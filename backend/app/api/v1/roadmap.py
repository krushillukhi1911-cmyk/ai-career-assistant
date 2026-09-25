from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.roadmap import LearningRoadmap
from app.services.roadmap_generator import RoadmapGenerator
from app.schemas.roadmap import RoadmapGenerateRequest, RoadmapResponse

router = APIRouter()


@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(
    request: RoadmapGenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_skills = []
    if request.resume_id:
        r_res = await db.execute(
            select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
        )
        resume = r_res.scalar_one_or_none()
        if resume:
            current_skills = (resume.structured_data or {}).get("skills", [])

    missing_skills = []
    if request.job_id:
        j_res = await db.execute(
            select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
        )
        job = j_res.scalar_one_or_none()
        if job:
            req_skills = (job.structured_data or {}).get("required_skills", [])
            missing_skills = [s for s in req_skills if s not in current_skills]

    roadmap_res = await RoadmapGenerator.generate_roadmap(
        target_role=request.target_role,
        current_skills=current_skills,
        missing_skills=missing_skills,
        weeks=request.weeks
    )

    record = LearningRoadmap(
        user_id=current_user.id,
        target_role=request.target_role,
        roadmap_data=roadmap_res.model_dump(mode="json")
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    roadmap_res.id = record.id
    roadmap_res.created_at = record.created_at
    return roadmap_res
