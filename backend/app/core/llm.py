"""
LLM Client — OpenAI SDK compatible wrapper.
Follows MiroFish's LLMClient pattern with JSON mode graceful degradation.
"""

import json
import re
import logging
from typing import Optional, Dict, Any, List
from openai import OpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    """Unified LLM client using OpenAI SDK format."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.api_key = api_key or settings.LLM_API_KEY
        self.base_url = base_url or settings.LLM_BASE_URL
        self.model = model or settings.LLM_MODEL_NAME

        if not self.api_key:
            raise ValueError("LLM_API_KEY 未配置，请在 .env 文件中设置")

        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)

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
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if response_format:
            kwargs["response_format"] = response_format

        try:
            response = self.client.chat.completions.create(**kwargs)
        except Exception as e:
            # If json_object mode is not supported, retry without it
            if response_format and "response_format" in str(e):
                logger.warning("JSON mode not supported, falling back to plain text")
                kwargs.pop("response_format", None)
                response = self.client.chat.completions.create(**kwargs)
            else:
                raise

        content = response.choices[0].message.content
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


# Singleton instance
_llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    """Get or create the singleton LLM client."""
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client
