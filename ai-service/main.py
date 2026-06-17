from fastapi import FastAPI
from core.config import settings
from routers import recommend

app = FastAPI(title="Learning Hub AI Service")
app.include_router(recommend.router)


@app.get("/health")
def health():
    return {"status": "ok", "mode": "mock" if settings.use_mock else "ai"}
