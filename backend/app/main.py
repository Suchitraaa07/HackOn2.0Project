from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.campaign_model import Campaign
from app.database.supabase_client import supabase
from pydantic import BaseModel
from datetime import datetime
from app.models.metrics_model import Metrics
from app.models.post_model import Post
from app.services.ai_service import generate_post
from app.services.twitter_service import publish_tweet
from scheduler import start_scheduler, scheduler, publish_post
from routes.publish import router as publish_router

class SchedulePostRequest(BaseModel):
    post_id: int
    run_time: str

class GeneratePostRequest(BaseModel):
    campaign_id: int | None = None
    campaign_name: str
    platform: str
    audience: str
    goal: str
    tone: str

class PublishPostRequest(BaseModel):
    post_id: int

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(publish_router)

@app.get("/")
def root():
    return {"message": "API Running"}

@app.post("/campaign")
def create_campaign(campaign: Campaign):

    data = {
        "campaign_name": campaign.campaign_name,
        "platform": campaign.platform,
        "audience": campaign.audience,
        "goal": campaign.goal,
        "tone": campaign.tone
    }

    response = supabase.table("campaigns").insert(data).execute()

    return {
        "message": "Campaign saved",
        "data": response.data
    }

@app.get("/campaigns")
def get_campaigns():
    response = supabase.table("campaigns").select("*").execute()
    
    return {
        "campaigns": response.data
    }

@app.post("/post")
def create_post(post: Post):

    data = {
        "campaign_id": post.campaign_id,
        "platform": post.platform,
        "content": post.content,
        "status": post.status
    }

    response = supabase.table("posts").insert(data).execute()

    return {
        "message": "Post saved",
        "data": response.data
    }

@app.post("/generate-post")
def generate_ai_post(payload: GeneratePostRequest):

    try:
        content = generate_post(
            payload.goal,
            payload.platform,
            payload.audience,
            payload.tone,
            campaign_name=payload.campaign_name,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    saved_post = None
    if payload.campaign_id is not None:
        data = {
            "campaign_id": payload.campaign_id,
            "platform": payload.platform,
            "content": content,
            "status": "draft"
        }
        response = supabase.table("posts").insert(data).execute()
        saved_post = response.data

    return {
        "generated_post": content,
        "saved_post": saved_post
    }

@app.get("/posts")
def get_posts():

    response = supabase.table("posts").select("*").execute()

    return {
        "posts": response.data
    }

@app.on_event("startup")
def start_background_scheduler():
    start_scheduler()

@app.post("/schedule-post")
def schedule_post(payload: SchedulePostRequest):

    run_time = payload.run_time.replace("Z", "+00:00")
    run_date = datetime.fromisoformat(run_time)

    scheduler.add_job(
        publish_post,
        'date',
        run_date=run_date,
        args=[payload.post_id]
    )

    return {
        "message": "Post scheduled",
        "post_id": payload.post_id,
        "run_time": payload.run_time
    }

@app.post("/publish-post")
def publish_post_now(payload: PublishPostRequest):
    response = supabase.table("posts").select("*").eq("id", payload.post_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Post not found")

    post = response.data[0]
    platform = (post.get("platform") or "").lower()
    if platform != "twitter":
        raise HTTPException(status_code=400, detail="Platform not supported for publishing yet")

    try:
        tweet_id = publish_tweet(post.get("content", ""))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    supabase.table("posts").update({"status": "published"}).eq("id", payload.post_id).execute()

    return {
        "message": "Post published",
        "platform": post.get("platform"),
        "post_id": payload.post_id,
        "tweet_id": tweet_id,
    }

@app.post("/metrics")
def save_metrics(metrics: Metrics):

    data = {
        "post_id": metrics.post_id,
        "likes": metrics.likes,
        "comments": metrics.comments,
        "shares": metrics.shares,
        "reach": metrics.reach
    }

    response = supabase.table("metrics").insert(data).execute()

    return {
        "message": "Metrics saved",
        "data": response.data
    }

@app.get("/analytics/{campaign_id}")
def get_campaign_analytics(campaign_id: int):

    # get posts for this campaign
    posts = supabase.table("posts").select("id").eq("campaign_id", campaign_id).execute()

    post_ids = [p["id"] for p in posts.data]

    if not post_ids:
        return {"message": "No posts for this campaign"}

    # get metrics
    metrics = supabase.table("metrics").select("*").in_("post_id", post_ids).execute()

    total_likes = sum(m["likes"] for m in metrics.data)
    total_comments = sum(m["comments"] for m in metrics.data)
    total_shares = sum(m["shares"] for m in metrics.data)
    total_reach = sum(m["reach"] for m in metrics.data)

    engagement = total_likes + total_comments + total_shares

    engagement_rate = 0
    if total_reach > 0:
        engagement_rate = engagement / total_reach

    return {
        "campaign_id": campaign_id,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "total_reach": total_reach,
        "engagement_rate": engagement_rate
    }
