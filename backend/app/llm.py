from __future__ import annotations

import json
import os
from typing import Any
from urllib.request import Request, urlopen

from .models import LLMRuntime

DEFAULT_OPENAI_COMPAT_MODEL = "gpt-5.4-mini"
REQUEST_TIMEOUT_SECONDS = 12
SYSTEM_PROMPT = (
    "你是人生推演引擎的调度助理。"
    "只输出简洁中文，不要输出英文键名、JSON、Markdown 标题、项目符号或额外说明。"
    "回答控制在 1 到 2 句，聚焦状态变化、风险和下一步。"
)


def _first_env(*keys: str) -> str | None:
    for key in keys:
        value = os.getenv(key)
        if value:
            return value.strip()
    return None


def _build_runtime() -> LLMRuntime:
    base_url = _first_env("LIFEPATH_LLM_BASE_URL", "OPENAI_BASE_URL")
    api_key = _first_env("LIFEPATH_LLM_API_KEY", "OPENAI_API_KEY")
    model = _first_env("LIFEPATH_LLM_MODEL", "OPENAI_MODEL") or DEFAULT_OPENAI_COMPAT_MODEL
    configured = bool(base_url)
    if configured:
        return LLMRuntime(
            provider="openai-compatible",
            mode="ready",
            base_url=base_url.rstrip("/"),
            model=model,
            configured=True,
            api_key_present=bool(api_key),
            used_fallback=False,
        )
    return LLMRuntime(
        provider="local-fallback",
        mode="fallback",
        model=model,
        configured=False,
        api_key_present=bool(api_key),
        used_fallback=True,
    )


def describe_runtime() -> LLMRuntime:
    return _build_runtime()


def _build_user_prompt(prompt_kind: str, payload: dict[str, Any]) -> str:
    kind_labels = {
        "bootstrap": "初始化概览",
        "director_cycle": "周期推进",
        "path_rerun": "路径重跑",
    }
    return (
        f"任务：{kind_labels.get(prompt_kind, prompt_kind)}。\n"
        "请基于以下上下文，输出一到两句简洁中文。\n"
        f"上下文：{json.dumps(payload, ensure_ascii=False, separators=(',', ':'))}"
    )


def _extract_message_content(data: dict[str, Any]) -> str:
    choices = data.get("choices")
    if not isinstance(choices, list) or not choices:
        raise ValueError("LLM response missing choices")
    message = choices[0].get("message")
    if not isinstance(message, dict):
        raise ValueError("LLM response missing message")
    content = message.get("content")
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text = item.get("text")
                if isinstance(text, str) and text.strip():
                    parts.append(text.strip())
        if parts:
            return "".join(parts).strip()
    raise ValueError("LLM response missing content")


def _request_remote_text(runtime: LLMRuntime, prompt_kind: str, payload: dict[str, Any]) -> str:
    assert runtime.base_url is not None
    api_key = _first_env("LIFEPATH_LLM_API_KEY", "OPENAI_API_KEY")
    body = {
        "model": runtime.model or DEFAULT_OPENAI_COMPAT_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(prompt_kind, payload)},
        ],
        "temperature": 0.3,
        "max_tokens": 180,
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    request = Request(
        url=f"{runtime.base_url}/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        raw = response.read().decode("utf-8")
    return _extract_message_content(json.loads(raw))


def _fallback_text(prompt_kind: str, payload: dict[str, Any]) -> str:
    if prompt_kind == "bootstrap":
        return "基础画像已就绪，后续推演会围绕当前核心取舍持续闭环。"
    if prompt_kind == "director_cycle":
        branch_title = payload.get("branch_title") or "当前分支"
        focus_axis = payload.get("focus_axis") or "核心维度"
        return f"{branch_title} 正在继续推进，当前重点落在{focus_axis}，建议保持小步校准。"
    if prompt_kind == "path_rerun":
        path_title = payload.get("path_title") or "该路径"
        field_label = payload.get("field_label") or "关键条件"
        value = payload.get("value") or "已更新"
        return f"{path_title} 已按{field_label}调整为{value}，后续判断会同步重估风险与收益。"
    return "推演已更新，建议继续观察状态变化并及时修正。"


def generate_text(prompt_kind: str, payload: dict[str, Any]) -> tuple[str, LLMRuntime]:
    runtime = _build_runtime()
    runtime.last_prompt_kind = prompt_kind

    if runtime.configured:
        try:
            text = _request_remote_text(runtime, prompt_kind, payload)
            if not text:
                raise ValueError("LLM returned empty content")
            runtime.mode = "remote"
            runtime.used_fallback = False
            runtime.last_error = None
            runtime.last_response_preview = text[:160]
            return text, runtime
        except Exception as exc:  # noqa: BLE001
            fallback = _fallback_text(prompt_kind, payload)
            runtime.mode = "fallback"
            runtime.used_fallback = True
            runtime.last_error = str(exc)
            runtime.last_response_preview = fallback[:160]
            return fallback, runtime

    fallback = _fallback_text(prompt_kind, payload)
    runtime.last_response_preview = fallback[:160]
    return fallback, runtime
