"""
LLM Client — OpenAI-compatible HTTP wrapper.
Uses direct Chat Completions requests so gateways like NewAPI receive the
exact `/v1/chat/completions` JSON body defined by their docs.
"""

import json
import re
import logging
from typing import Optional, Dict, Any, List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    """Unified LLM client using direct OpenAI-compatible HTTP requests."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.api_key = api_key or settings.LLM_API_KEY
        self.base_url = base_url or settings.LLM_BASE_URL
        self.model = model or settings.LLM_MODEL_NAME
        self.reasoning_effort = settings.LLM_REASONING_EFFORT or "medium"

        if not self.api_key:
            raise ValueError("LLM_API_KEY 未配置，请在 .env 文件中设置")

    def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 4096,
        response_format: Optional[Dict] = None,
    ) -> str:
        """
        Send a chat completion request.

        Args:
            messages: Chat message list
            temperature: Sampling temperature
            max_tokens: Maximum tokens in response
            response_format: Optional response format (e.g. {"type": "json_object"})

        Returns:
            Model response text
        """
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "stream": False,
        }

        token_field = self._token_field_for_model(self.model)
        payload[token_field] = max_tokens

        if self._supports_reasoning_effort(self.model):
            payload["reasoning_effort"] = self.reasoning_effort

        if response_format:
            payload["response_format"] = response_format

        try:
            data = self._post_chat_completions(payload)
        except Exception as e:
            # If json_object mode is not supported, retry without it
            if response_format and "response_format" in str(e):
                logger.warning("JSON mode not supported, falling back to plain text")
                payload.pop("response_format", None)
                data = self._post_chat_completions(payload)
            else:
                raise

        content = self._extract_message_content(data)
        # Strip <think>...</think> blocks some models emit
        content = re.sub(r"<think>[\s\S]*?</think>", "", content).strip()
        return content

    def chat_json(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        max_tokens: int = 4096,
    ) -> Dict[str, Any]:
        """
        Send a chat request and return parsed JSON.
        Handles models that don't support json_object mode gracefully.
        """
        # Append JSON instruction to system message
        enhanced_messages = list(messages)
        if enhanced_messages and enhanced_messages[0]["role"] == "system":
            enhanced_messages[0] = {
                **enhanced_messages[0],
                "content": enhanced_messages[0]["content"]
                + "\n\n**重要：你必须输出有效的 JSON 格式数据，不要输出任何其他内容。不要包含 markdown 代码块标记。**",
            }

        # Try JSON mode first
        try:
            response = self.chat(
                messages=enhanced_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "json_object"},
            )
        except Exception:
            # Fallback without json mode
            response = self.chat(
                messages=enhanced_messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

        return self._parse_json_response(response)

    @staticmethod
    def _parse_json_response(text: str) -> Dict[str, Any]:
        """Parse JSON from LLM response, handling markdown code blocks."""
        cleaned = text.strip()
        # Remove markdown code block wrappers
        cleaned = re.sub(r"^```(?:json)?\s*\n?", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\n?```\s*$", "", cleaned)
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to find JSON object in the text
            match = re.search(r"\{[\s\S]*\}", cleaned)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    pass
            raise ValueError(f"LLM 返回的 JSON 格式无效: {cleaned[:500]}")

    def _post_chat_completions(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """POST exact Chat Completions JSON body to an OpenAI-compatible gateway."""
        url = self._chat_completions_url()
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        logger.debug("POST %s with fields=%s", url, sorted(payload.keys()))

        try:
            with httpx.Client(timeout=120.0) as client:
                response = client.post(url, headers=headers, json=payload)
        except Exception as e:
            raise RuntimeError(f"请求 LLM 接口失败: {e}") from e

        if response.status_code >= 400:
            detail = self._extract_error_message(response)
            raise RuntimeError(f"LLM 接口错误 {response.status_code}: {detail}")

        try:
            return response.json()
        except Exception as e:
            raise RuntimeError(f"LLM 响应不是有效 JSON: {response.text[:500]}") from e

    def _chat_completions_url(self) -> str:
        """Normalize base_url to the exact chat completions endpoint."""
        base = self.base_url.rstrip("/")
        if base.endswith("/chat/completions"):
            return base
        if base.endswith("/v1"):
            return f"{base}/chat/completions"
        return f"{base}/v1/chat/completions"

    @staticmethod
    def _token_field_for_model(model: str) -> str:
        """
        NewAPI docs support both max_tokens and max_completion_tokens.
        Use max_completion_tokens for reasoning-style models to avoid
        compatibility issues with newer model families.
        """
        lowered = (model or "").lower()
        reasoning_prefixes = ("gpt-5", "o1", "o3", "o4")
        if lowered.startswith(reasoning_prefixes):
            return "max_completion_tokens"
        return "max_tokens"

    @staticmethod
    def _supports_reasoning_effort(model: str) -> bool:
        lowered = (model or "").lower()
        return lowered.startswith(("gpt-5", "o1", "o3", "o4"))

    @staticmethod
    def _extract_message_content(data: Dict[str, Any]) -> str:
        choices = data.get("choices") or []
        if not choices:
            raise RuntimeError(f"LLM 响应缺少 choices: {json.dumps(data, ensure_ascii=False)[:500]}")

        message = choices[0].get("message") or {}
        content = message.get("content", "")
        if isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, dict):
                    parts.append(item.get("text", ""))
                else:
                    parts.append(str(item))
            content = "".join(parts)

        if content is None:
            content = ""
        return str(content)

    @staticmethod
    def _extract_error_message(response: httpx.Response) -> str:
        try:
            data = response.json()
            if isinstance(data, dict):
                if isinstance(data.get("error"), dict):
                    return data["error"].get("message") or json.dumps(data["error"], ensure_ascii=False)
                return data.get("message") or json.dumps(data, ensure_ascii=False)
        except Exception:
            pass
        return response.text[:500]


# Singleton instance
_llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    """Get or create the singleton LLM client."""
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client
