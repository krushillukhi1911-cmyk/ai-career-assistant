from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.services.skill_analyzer import SkillAnalyzer
from app.schemas.skill_gap import SkillGapAnalysisRequest, SkillGapAnalysisResponse

router = APIRouter()


@router.post("/gap-analysis", response_model=SkillGapAnalysisResponse)
async def analyze_skill_gaps(
    request: SkillGapAnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res_result = await db.execute(
        select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
    )
    resume = res_result.scalar_one_or_none()
    if not resume:
        raise NotFoundException("Resume not found")

    job_result = await db.execute(
        select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
    )
    job = job_result.scalar_one_or_none()
    if not job:
        raise NotFoundException("Job description not found")

    resume_skills = (resume.structured_data or {}).get("skills", [])
    job_req_skills = (job.structured_data or {}).get("required_skills", [])

    return await SkillAnalyzer.analyze_gaps(
        resume_text=resume.extracted_text,
        resume_skills=resume_skills,
        job_required_skills=job_req_skills
    )
