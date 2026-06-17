from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    환경변수를 읽어 앱 설정으로 사용하는 클래스.
    .env 파일 또는 OS 환경변수에서 자동으로 값을 주입받는다.
    """

    # True면 Claude API 호출 없이 사전 정의된 Mock 추천을 반환
    use_mock: bool = True

    # Claude API 인증 키 (USE_MOCK=false일 때만 사용)
    anthropic_api_key: str = ""

    class Config:
        env_file = ".env"


# 앱 전역에서 import해서 사용하는 싱글톤 설정 객체
settings = Settings()
