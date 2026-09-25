from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RoadmapGenerateRequest(BaseModel):
    target_role: str
    resume_id: Optional[str] = None
    job_id: Optional[str] = None
    weeks: int = Field(default=6, ge=1, le=12)


class RoadmapWeekItem(BaseModel):
    week_number: int
    topic: str
    why_it_matters: str
    learning_objectives: List[str]
    practice_task: str
    mini_project: str
    estimated_difficulty: str  # Beginner, Intermediate, Advanced


class RoadmapResponse(BaseModel):
    id: Optional[str] = None
    target_role: str
    total_weeks: int
    weekly_plan: List[RoadmapWeekItem]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
