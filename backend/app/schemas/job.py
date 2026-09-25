from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class JobAnalysisRequest(BaseModel):
    title: Optional[str] = "Target Job Role"
    company: Optional[str] = ""
    description: str = Field(..., min_length=10)


class StructuredJobData(BaseModel):
    job_title: str
    company: Optional[str] = ""
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    experience_requirements: Optional[str] = ""
    education_requirements: Optional[str] = ""
    responsibilities: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)


class JobResponse(BaseModel):
    id: str
    user_id: str
    title: str
    company: Optional[str] = None
    description: str
    structured_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
