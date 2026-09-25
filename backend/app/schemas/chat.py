from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    resume_id: Optional[str] = None
    job_id: Optional[str] = None


class ContextSource(BaseModel):
    source_type: str  # "resume" or "job_description"
    content_snippet: str
    relevance_score: float


class ChatResponse(BaseModel):
    answer: str
    context_sources: List[ContextSource] = Field(default_factory=list)
