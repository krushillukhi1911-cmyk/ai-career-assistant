from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    institution: Optional[str] = ""
    degree: Optional[str] = ""
    field_of_study: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    grade: Optional[str] = ""


class ExperienceItem(BaseModel):
    company: Optional[str] = ""
    title: Optional[str] = ""
    location: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    description: Optional[str] = ""
    highlights: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    name: Optional[str] = ""
    description: Optional[str] = ""
    technologies: List[str] = Field(default_factory=list)
    link: Optional[str] = ""


class StructuredResumeData(BaseModel):
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    summary: Optional[str] = ""
    skills: List[str] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)


class ResumeAnalysisResponse(BaseModel):
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    missing_sections: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    formatting_notes: List[str] = Field(default_factory=list)


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    file_type: str
    extracted_text: str
    structured_data: Optional[Dict[str, Any]] = None
    analysis: Optional[ResumeAnalysisResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeImprovementRequest(BaseModel):
    resume_id: str
    job_id: Optional[str] = None


class ResumeImprovementResponse(BaseModel):
    improved_summary: str
    refined_bullet_points: List[Dict[str, str]]
    recommended_action_verbs: List[str]
    missing_keywords: List[str]
    project_enhancements: List[Dict[str, str]]
    safety_disclaimer: str = "All improvements are strictly derived from supplied resume evidence. No artificial experience or achievements were fabricated."
