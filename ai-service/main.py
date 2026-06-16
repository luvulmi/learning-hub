from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import random

load_dotenv()

USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true"

app = FastAPI(title="Learning Hub AI Service")


class RecommendRequest(BaseModel):
    user_id: int
    records: list[dict]  # [{"title": str, "category": str, "tags": list[str]}]


class RecommendResponse(BaseModel):
    user_id: int
    suggested_topic: str
    reason: str
    based_on_summary: str


@app.get("/health")
def health():
    return {"status": "ok", "mode": "mock" if USE_MOCK else "ai"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    if not req.records:
        raise HTTPException(status_code=400, detail="records is empty")

    summary = _build_summary(req.records)

    if USE_MOCK:
        suggested_topic, reason = _mock_recommend(req.records)
    else:
        suggested_topic, reason = _ai_recommend(summary)

    return RecommendResponse(
        user_id=req.user_id,
        suggested_topic=suggested_topic,
        reason=reason,
        based_on_summary=summary,
    )


def _build_summary(records: list[dict]) -> str:
    lines = []
    for r in records:
        tags = ", ".join(r.get("tags", [])) or "없음"
        lines.append(f"- [{r.get('category', '')}] {r.get('title', '')} (태그: {tags})")
    return "\n".join(lines)


def _mock_recommend(records: list[dict]) -> tuple[str, str]:
    categories = {r.get("category", "") for r in records}

    topic_map = {
        "ALGORITHM": ("시간 복잡도 최적화", "알고리즘 학습을 이어서 성능 분석 능력을 키우면 좋겠습니다."),
        "DATA_STRUCTURE": ("트리와 그래프 심화", "자료구조 학습 흐름에 맞게 비선형 구조를 다음 단계로 추천합니다."),
        "SYSTEM_DESIGN": ("분산 시스템 기초", "시스템 설계 역량 확장을 위해 분산 처리 개념을 학습하면 좋겠습니다."),
        "LANGUAGE": ("디자인 패턴", "언어 학습 이후 코드 설계 패턴으로 넘어가면 실력이 크게 늘 것입니다."),
        "FRAMEWORK": ("테스트 자동화", "프레임워크 사용법을 익혔으니 테스트 코드 작성 능력을 키울 때입니다."),
        "DATABASE": ("인덱스 최적화와 쿼리 튜닝", "DB 학습 흐름에 맞게 성능 최적화를 다음 주제로 추천합니다."),
        "DEVOPS": ("컨테이너 오케스트레이션 (Kubernetes)", "DevOps 역량 강화를 위해 Kubernetes 기초를 학습하면 좋겠습니다."),
        "ETC": ("코드 리뷰 문화와 협업", "다양한 분야를 학습한 만큼 팀 협업 능력을 높이는 것을 추천합니다."),
    }

    for category in categories:
        if category in topic_map:
            return topic_map[category]

    fallback = [
        ("클린 코드 원칙", "학습한 내용을 바탕으로 코드 품질을 높이는 원칙을 익혀보세요."),
        ("REST API 설계", "백엔드 역량 강화를 위해 API 설계 원칙을 학습하면 좋겠습니다."),
    ]
    return random.choice(fallback)


def _ai_recommend(summary: str) -> tuple[str, str]:
    from anthropic import Anthropic
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""다음은 개발자의 학습 기록 요약입니다:

{summary}

위 학습 기록을 분석해서 다음에 공부하면 좋을 토픽 하나를 추천해 주세요.

반드시 아래 형식으로만 답변하세요 (다른 말 없이):
TOPIC: [추천 토픽]
REASON: [추천 이유 1-2문장]""",
        }],
    )

    text = message.content[0].text.strip()
    suggested_topic, reason = "", ""
    for line in text.splitlines():
        if line.startswith("TOPIC:"):
            suggested_topic = line.removeprefix("TOPIC:").strip()
        elif line.startswith("REASON:"):
            reason = line.removeprefix("REASON:").strip()
    return suggested_topic or text[:100], reason
