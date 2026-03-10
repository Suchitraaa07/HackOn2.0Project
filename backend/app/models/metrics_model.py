from pydantic import BaseModel

class Metrics(BaseModel):
    post_id: int
    likes: int
    comments: int
    shares: int
    reach: int