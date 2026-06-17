from fastapi import APIRouter, HTTPException
from schemas.recommend import RecommendRequest, RecommendResponse
from services.recommend import build_summary, get_recommendation

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.post("", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    """
    학습 기록을 받아 AI 추천 토픽을 반환한다.

    1. records가 비어있으면 400 에러 반환
    2. 학습 기록을 프롬프트용 텍스트(summary)로 변환
    3. Mock 또는 실제 AI로 추천 토픽과 이유를 생성
    4. 결과를 RecommendResponse로 반환 (Spring Boot가 DB에 저장)
    """
    if not req.records:
        raise HTTPException(status_code=400, detail="records is empty")

    summary = build_summary(req.records)
    suggested_topic, reason = get_recommendation(req.records)

    return RecommendResponse(
        user_id=req.user_id,
        suggested_topic=suggested_topic,
        reason=reason,
        based_on_summary=summary,
    )
