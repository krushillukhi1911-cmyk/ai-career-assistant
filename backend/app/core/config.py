import json
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Career Assistant"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-change-this-in-production-ai-career-assistant"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./ai_career_assistant.db"

    # LLM Settings
    LLM_PROVIDER: str = "mock"  # "mock", "openai", "gemini", "ollama"
    LLM_API_KEY: str = ""
    LLM_MODEL_NAME: str = "gpt-4o-mini"
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    # Embeddings & Vector Store
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    VECTOR_STORE_PATH: str = "./vector_store_data"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
        "*",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str):
            return json.loads(v)
        return v

    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
