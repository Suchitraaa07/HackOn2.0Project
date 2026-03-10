from pydantic import BaseModel

class Post(BaseModel):
    campaign_id: int
    platform: str
    content: str
    status: str