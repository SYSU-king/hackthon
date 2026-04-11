"""Quick test: streaming JSON mode with the LLM proxy."""
import httpx, json

headers = {
    "Authorization": "Bearer sk-va78tltSJeB2AOIq1V1CRrEWNicWeQ1xKgbFrIoxsnxCG9BF",
    "Content-Type": "application/json",
}

payload = {
    "model": "gpt-5.4",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant. Reply in valid JSON only."},
        {"role": "user", "content": 'Output exactly: {"name": "test", "value": 42}'},
    ],
    "max_tokens": 200,
    "stream": True,
}

r = httpx.post(
    "https://cpa.zhuzihan.com/v1/chat/completions",
    headers=headers,
    json=payload,
    timeout=30,
)

full = ""
for line in r.iter_lines():
    if line.startswith("data: ") and line != "data: [DONE]":
        d = json.loads(line[6:])
        delta = d["choices"][0].get("delta", {})
        content = delta.get("content", "")
        if content:
            full += content

print(f"Full response: {full}")
try:
    parsed = json.loads(full)
    print(f"Parsed JSON OK: {parsed}")
except Exception as e:
    print(f"JSON parse error: {e}")
