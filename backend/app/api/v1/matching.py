from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.analysis import Analysis
from app.services.matching_engine import MatchingEngine
from app.schemas.matching import MatchingRequest, MatchingResultResponse

router = APIRouter()


@router.post("/analyze", response_model=MatchingResultResponse)
async def analyze_match(
    request: MatchingRequest,
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
    job_pref_skills = (job.structured_data or {}).get("preferred_skills", [])

    match_result = MatchingEngine.calculate_match(
        resume_id=resume.id,
        job_id=job.id,
        resume_text=resume.extracted_text,
        resume_skills=resume_skills,
        job_text=job.description,
        job_required_skills=job_req_skills,
        job_preferred_skills=job_pref_skills
    )

    # Persist in DB
    analysis_record = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=job.id,
        compatibility_score=match_result.compatibility_score,
        analysis_data=match_result.model_dump(mode="json")
    )
    db.add(analysis_record)
    await db.commit()
    await db.refresh(analysis_record)

    match_result.id = analysis_record.id
    match_result.created_at = analysis_record.created_at
    return match_result
