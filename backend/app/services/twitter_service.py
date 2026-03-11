import base64
import hashlib
import hmac
import os
import time
import uuid
import urllib.parse

import httpx

TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")

TWITTER_POST_URL = "https://api.twitter.com/2/tweets"


def _percent_encode(value: str) -> str:
    return urllib.parse.quote(str(value), safe="~")


def _build_oauth_header(method: str, url: str) -> str:
    nonce = uuid.uuid4().hex
    timestamp = str(int(time.time()))

    oauth_params = {
        "oauth_consumer_key": TWITTER_API_KEY,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": timestamp,
        "oauth_token": TWITTER_ACCESS_TOKEN,
        "oauth_version": "1.0",
    }

    normalized_params = "&".join(
        f"{_percent_encode(k)}={_percent_encode(v)}"
        for k, v in sorted(oauth_params.items())
    )

    base_elems = [
        method.upper(),
        _percent_encode(url),
        _percent_encode(normalized_params),
    ]
    base_string = "&".join(base_elems)

    signing_key = f"{_percent_encode(TWITTER_API_SECRET)}&{_percent_encode(TWITTER_ACCESS_TOKEN_SECRET)}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode("utf-8"), base_string.encode("utf-8"), hashlib.sha1).digest()
    ).decode("utf-8")

    oauth_params["oauth_signature"] = signature
    header_params = ", ".join(
        f'{_percent_encode(k)}="{_percent_encode(v)}"' for k, v in oauth_params.items()
    )
    return f"OAuth {header_params}"


def publish_tweet(text: str) -> str:
    if not all([TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET]):
        raise ValueError("Twitter API keys are not fully configured")

    auth_header = _build_oauth_header("POST", TWITTER_POST_URL)
    headers = {
        "Authorization": auth_header,
        "Content-Type": "application/json",
    }
    payload = {"text": text}

    with httpx.Client(timeout=30) as client:
        response = client.post(TWITTER_POST_URL, headers=headers, json=payload)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            detail = response.text.strip()
            raise RuntimeError(f"Twitter API error: {detail}") from exc

    data = response.json()
    tweet_id = data.get("data", {}).get("id")
    if not tweet_id:
        raise RuntimeError("Twitter API did not return a tweet id")
    return tweet_id
