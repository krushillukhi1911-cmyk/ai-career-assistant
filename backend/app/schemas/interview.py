from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class QuestionGeneratorRequest(BaseModel):
    resume_id: Optional[str] = None
    job_id: Optional[str] = None
    role_title: Optional[str] = "Software Engineer"
    category: Optional[str] = "all"  # Python, Backend, AI/ML, Project-specific, all


class QuestionItem(BaseModel):
    id: str
    category: str  # Python, Backend, AI/ML, Project-specific
    difficulty: str  # Easy, Medium, Hard
    question: str
    model_answer: str
    explanation: str
    referenced_project_or_skill: Optional[str] = ""


class QuestionResponse(BaseModel):
    role_title: str
    total_questions: int
    questions: List[QuestionItem]


class MockInterviewStartRequest(BaseModel):
    role_title: str
    job_id: Optional[str] = None
    resume_id: Optional[str] = None


class MockInterviewAnswerRequest(BaseModel):
    session_id: str
    answer_text: str


class QuestionEvaluation(BaseModel):
    technical_correctness: float = Field(..., description="0-100 score")
    relevance: float = Field(..., description="0-100 score")
    completeness: float = Field(..., description="0-100 score")
    communication: float = Field(..., description="0-100 score")
    strengths: List[str]
    missing_concepts: List[str]
    feedback_summary: str
    ideal_answer_points: List[str]


class MockInterviewNextStepResponse(BaseModel):
    session_id: str
    status: str  # "in_progress" or "completed"
    question_number: int
    total_questions: int
    current_question: Optional[QuestionItem] = None
    last_evaluation: Optional[QuestionEvaluation] = None
    final_scorecard: Optional[Dict[str, Any]] = None


class InterviewSessionResponse(BaseModel):
    id: str
    user_id: str
    job_id: Optional[str] = None
    role_title: str
    status: str
    score: Optional[float] = None
    transcript: List[Dict[str, Any]]
    feedback: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
