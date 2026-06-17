from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    use_mock: bool = True
    anthropic_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
