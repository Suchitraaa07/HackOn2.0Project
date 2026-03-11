from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database.supabase_client import supabase

router = APIRouter()

_linkedin_feed: List[dict] = []
_use_memory = False


class PublishLinkedInRequest(BaseModel):
    content: str
    campaign_id: int


@router.post("/publish/linkedin")
def publish_linkedin(payload: PublishLinkedInRequest):
    global _use_memory
    published_at = datetime.now(timezone.utc).isoformat()
    post = {
        "campaign_id": payload.campaign_id,
        "content": payload.content,
        "platform": "LinkedIn",
        "status": "published",
        "published_at": published_at,
    }

    saved = None
    try:
        response = supabase.table("posts").insert(post).execute()
        saved = response.data[0] if response.data else None
    except Exception:
        _use_memory = True
        saved = None

    if not saved:
        _linkedin_feed.insert(0, post)
        saved = post

    return {
        "status": "success",
        "platform": "LinkedIn",
        "message": "Post published successfully (simulated)",
        "post": saved,
    }


@router.get("/feed/linkedin")
def linkedin_feed():
    if _use_memory:
        return list(_linkedin_feed)
    try:
        response = (
            supabase.table("posts")
            .select("*")
            .eq("platform", "LinkedIn")
            .order("created_at", desc=True)
            .execute()
        )
        if response.data:
            return response.data
    except Exception:
        return list(_linkedin_feed)

    return list(_linkedin_feed)
