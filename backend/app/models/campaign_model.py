from pydantic import BaseModel

class Campaign(BaseModel):
    campaign_name: str
    platform: str
    audience: str
    goal: str
    tone: str