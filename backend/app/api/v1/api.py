from fastapi import APIRouter
from app.api.v1 import (
    auth,
    resumes,
    jobs,
    matching,
    skills,
    resume_improvement,
    interview,
    roadmap,
    chat,
    health,
    seed,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(matching.router, prefix="/matching", tags=["Matching"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(resume_improvement.router, prefix="/resume", tags=["Resume Improvement"])
api_router.include_router(interview.router, prefix="/interview", tags=["Interview"])
api_router.include_router(roadmap.router, prefix="/roadmap", tags=["Roadmap"])
api_router.include_router(chat.router, prefix="/chat", tags=["Career Chatbot"])
api_router.include_router(seed.router, prefix="/seed", tags=["Demo Data Seed"])
api_router.include_router(health.router, tags=["Health"])

