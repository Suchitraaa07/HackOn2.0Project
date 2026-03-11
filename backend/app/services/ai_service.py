import os
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_post(goal, platform, audience, tone, campaign_name=None):
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set")

    system_prompt = (
        "You are an expert social media copywriter. "
        "Write a single, concise social media post in plain text. "
        "Do not include hashtags unless they are explicitly requested."
    )

    campaign_line = f'Campaign: "{campaign_name}". ' if campaign_name else ""
    user_prompt = (
        f"{campaign_line}Goal: {goal}. Platform: {platform}. "
        f"Audience: {audience}. Tone: {tone}. "
        "Write one post under 80 words."
    )

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 200,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    with httpx.Client(timeout=30) as client:
        response = client.post(GROQ_API_URL, headers=headers, json=payload)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            detail = response.text.strip()
            raise RuntimeError(f"Groq API error: {detail}") from exc
        data = response.json()

    choices = data.get("choices", [])
    if not choices:
        raise RuntimeError("Groq response had no choices")

    content = choices[0].get("message", {}).get("content", "")
    text = content.strip()
    # Some models return a quoted string; normalize to plain text.
    if len(text) >= 2 and ((text[0] == '"' and text[-1] == '"') or (text[0] == "'" and text[-1] == "'")):
        text = text[1:-1].strip()
    return text
