from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MatchingRequest(BaseModel):
    resume_id: str
    job_id: str


class MatchingResultResponse(BaseModel):
    id: Optional[str] = None
    resume_id: str
    job_id: str
    compatibility_score: float = Field(..., description="Calculated 0-100 score")
    semantic_similarity_score: float
    skill_overlap_score: float
    keyword_coverage_score: float
    strong_matches: List[str] = Field(default_factory=list)
    skills_to_develop: List[str] = Field(default_factory=list)
    relevant_experience_summary: str
    relevant_projects_summary: str
    score_explanation: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
