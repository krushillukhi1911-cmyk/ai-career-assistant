from typing import List, Dict, Any
from pydantic import BaseModel, Field


class SkillGapAnalysisRequest(BaseModel):
    resume_id: str
    job_id: str


class SkillGapItem(BaseModel):
    skill_name: str
    target_proficiency: str  # Beginner, Intermediate, Advanced
    current_evidence: str  # Description of evidence in resume or "Not found"
    recommendation: str


class SkillGapAnalysisResponse(BaseModel):
    existing_skills: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    skill_gaps_classified: List[SkillGapItem] = Field(default_factory=list)
    action_plan_summary: str
