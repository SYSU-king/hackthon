import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env files before settings initialization.
# Priority rule:
#   1) existing process env vars win
#   2) current repo .env / backend/.env
#   3) reference project env as compatibility fallback
_project_root = Path(__file__).resolve().parent.parent.parent.parent
_env_candidates = [
    _project_root / ".env",
    _project_root / "backend" / ".env",
    _project_root / "参考项目" / "MiroFish" / ".env",
]
LOADED_ENV_FILES: list[str] = []
for _env_file in _env_candidates:
    if _env_file.exists():
        load_dotenv(_env_file, override=False)
        LOADED_ENV_FILES.append(str(_env_file))


class Settings(BaseSettings):
    # Local JSON file storage directory
    DATA_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "storage")

    # LLM configuration (OpenAI SDK compatible)
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gpt-4o-mini")
    LLM_REASONING_EFFORT: str = os.getenv("LLM_REASONING_EFFORT", "medium")

    # Optional boost LLM (for parallel/faster requests)
    LLM_BOOST_API_KEY: str = os.getenv("LLM_BOOST_API_KEY", "")
    LLM_BOOST_BASE_URL: str = os.getenv("LLM_BOOST_BASE_URL", "")
    LLM_BOOST_MODEL_NAME: str = os.getenv("LLM_BOOST_MODEL_NAME", "")

    # Zep GraphRAG configuration
    ZEP_API_KEY: str = os.getenv("ZEP_API_KEY", "")

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure data directory exists
os.makedirs(settings.DATA_DIR, exist_ok=True)
