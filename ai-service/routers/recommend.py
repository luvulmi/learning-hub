from fastapi import APIRouter, HTTPException
from schemas.recommend import RecommendRequest, RecommendResponse
from services.recommend import build_summary, get_recommendation

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.post("", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
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
