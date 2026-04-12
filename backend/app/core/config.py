import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load .env from project root
_project_root = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(_project_root / ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Local JSON file storage directory
    DATA_DIR: str = str(Path(__file__).resolve().parent.parent.parent / "storage")

    # LLM configuration (OpenAI SDK compatible)
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gpt-4o-mini")

    # Optional boost LLM (for parallel/faster requests)
    LLM_BOOST_API_KEY: str = os.getenv("LLM_BOOST_API_KEY", "")
    LLM_BOOST_BASE_URL: str = os.getenv("LLM_BOOST_BASE_URL", "")
    LLM_BOOST_MODEL_NAME: str = os.getenv("LLM_BOOST_MODEL_NAME", "")

    # Zep GraphRAG configuration
    ZEP_API_KEY: str = os.getenv("ZEP_API_KEY", "")

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]


settings = Settings()

# Ensure data directory exists
os.makedirs(settings.DATA_DIR, exist_ok=True)
