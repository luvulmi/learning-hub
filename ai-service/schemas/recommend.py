from pydantic import BaseModel


class RecordItem(BaseModel):
    """학습 기록 한 건의 요약 정보. Spring Boot에서 전달하는 단위."""
    title: str
    category: str
    tags: list[str] = []


class RecommendRequest(BaseModel):
    """POST /recommend 요청 바디."""
    user_id: int
    records: list[RecordItem]  # 최근 학습 기록 목록 (최대 10건)


class RecommendResponse(BaseModel):
    """POST /recommend 응답 바디. Spring Boot가 그대로 DB에 저장한다."""
    user_id: int
    suggested_topic: str   # 추천 토픽
    reason: str            # 추천 이유
    based_on_summary: str  # 추천 근거로 사용된 학습 기록 요약 (이력 보존용)
