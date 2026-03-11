from apscheduler.schedulers.background import BackgroundScheduler
from app.database.supabase_client import supabase
from app.services.twitter_service import publish_tweet

scheduler = BackgroundScheduler()


def start_scheduler():
    if not scheduler.running:
        scheduler.start()


def publish_post(post_id: int):
    response = supabase.table("posts").select("*").eq("id", post_id).execute()
    post = response.data[0] if response.data else None
    if not post:
        return

    platform = (post.get("platform") or "").lower()
    try:
        if platform == "twitter":
            publish_tweet(post.get("content", ""))
        supabase.table("posts").update({"status": "published"}).eq("id", post_id).execute()
    except Exception:
        supabase.table("posts").update({"status": "failed"}).eq("id", post_id).execute()
