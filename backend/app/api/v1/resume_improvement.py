from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.ai.resume_analyzer import AIResumeService
from app.schemas.resume import ResumeImprovementRequest, ResumeImprovementResponse

router = APIRouter()


@router.post("/improve", response_model=ResumeImprovementResponse)
async def improve_resume(
    request: ResumeImprovementRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res_result = await db.execute(
        select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
    )
    resume = res_result.scalar_one_or_none()
    if not resume:
        raise NotFoundException("Resume not found")

    job_data = None
    if request.job_id:
        job_result = await db.execute(
            select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
        )
        job = job_result.scalar_one_or_none()
        if job:
            job_data = job.structured_data or {"title": job.title, "description": job.description}

    return await AIResumeService.improve_resume(
        resume_data=resume.structured_data or {"text": resume.extracted_text},
        job_data=job_data
    )
