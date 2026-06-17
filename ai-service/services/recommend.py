import random
from anthropic import Anthropic
from core.config import settings
from core.prompt import RECOMMEND_PROMPT
from schemas.recommend import RecordItem

# 카테고리별 사전 정의 추천 (Mock 모드에서 사용)
_MOCK_TOPIC_MAP = {
    "ALGORITHM":      ("시간 복잡도 최적화", "알고리즘 학습을 이어서 성능 분석 능력을 키우면 좋겠습니다."),
    "DATA_STRUCTURE": ("트리와 그래프 심화", "자료구조 학습 흐름에 맞게 비선형 구조를 다음 단계로 추천합니다."),
    "SYSTEM_DESIGN":  ("분산 시스템 기초", "시스템 설계 역량 확장을 위해 분산 처리 개념을 학습하면 좋겠습니다."),
    "LANGUAGE":       ("디자인 패턴", "언어 학습 이후 코드 설계 패턴으로 넘어가면 실력이 크게 늘 것입니다."),
    "FRAMEWORK":      ("테스트 자동화", "프레임워크 사용법을 익혔으니 테스트 코드 작성 능력을 키울 때입니다."),
    "DATABASE":       ("인덱스 최적화와 쿼리 튜닝", "DB 학습 흐름에 맞게 성능 최적화를 다음 주제로 추천합니다."),
    "DEVOPS":         ("컨테이너 오케스트레이션 (Kubernetes)", "DevOps 역량 강화를 위해 Kubernetes 기초를 학습하면 좋겠습니다."),
    "ETC":            ("코드 리뷰 문화와 협업", "다양한 분야를 학습한 만큼 팀 협업 능력을 높이는 것을 추천합니다."),
}

# 매칭되는 카테고리가 없을 때 랜덤으로 선택하는 후보
_FALLBACK = [
    ("클린 코드 원칙", "학습한 내용을 바탕으로 코드 품질을 높이는 원칙을 익혀보세요."),
    ("REST API 설계", "백엔드 역량 강화를 위해 API 설계 원칙을 학습하면 좋겠습니다."),
]


def build_summary(records: list[RecordItem]) -> str:
    """
    학습 기록 목록을 Claude 프롬프트에 삽입할 텍스트로 변환한다.
    예: "- [FRAMEWORK] Spring Security (태그: spring, security)"
    """
    lines = [
        f"- [{r.category}] {r.title} (태그: {', '.join(r.tags) or '없음'})"
        for r in records
    ]
    return "\n".join(lines)


def get_recommendation(records: list[RecordItem]) -> tuple[str, str]:
    """
    설정(USE_MOCK)에 따라 Mock 또는 실제 AI 추천을 반환한다.
    반환값: (suggested_topic, reason)
    """
    if settings.use_mock:
        return _mock_recommend(records)
    return _ai_recommend(build_summary(records))


def _mock_recommend(records: list[RecordItem]) -> tuple[str, str]:
    """
    API 호출 없이 카테고리 기반으로 추천을 반환한다.
    records에 포함된 카테고리 중 첫 번째로 매칭되는 항목을 반환하고,
    매칭 없으면 _FALLBACK에서 랜덤 선택한다.
    """
    categories = {r.category for r in records}
    for category in categories:
        if category in _MOCK_TOPIC_MAP:
            return _MOCK_TOPIC_MAP[category]
    return random.choice(_FALLBACK)


def _ai_recommend(summary: str) -> tuple[str, str]:
    """
    Claude Haiku API를 호출해 다음 학습 토픽을 추천받는다.
    응답에서 TOPIC / REASON 라인을 파싱해 반환한다.
    파싱 실패 시 응답 앞 100자를 topic으로 fallback 처리한다.
    """
    client = Anthropic(api_key=settings.anthropic_api_key)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{"role": "user", "content": RECOMMEND_PROMPT.format(summary=summary)}],
    )

    suggested_topic, reason = "", ""
    for line in message.content[0].text.strip().splitlines():
        if line.startswith("TOPIC:"):
            suggested_topic = line.removeprefix("TOPIC:").strip()
        elif line.startswith("REASON:"):
            reason = line.removeprefix("REASON:").strip()
    return suggested_topic or summary[:100], reason
