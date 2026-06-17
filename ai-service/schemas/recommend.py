from pydantic import BaseModel


class RecordItem(BaseModel):
    title: str
    category: str
    tags: list[str] = []


class RecommendRequest(BaseModel):
    user_id: int
    records: list[RecordItem]


class RecommendResponse(BaseModel):
    user_id: int
    suggested_topic: str
    reason: str
    based_on_summary: str
