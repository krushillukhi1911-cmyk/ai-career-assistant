from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException
from app.models.user import User
from app.models.job import JobDescription
from app.ai.resume_analyzer import AIResumeService
from app.rag.rag_chain import RAGChain
from app.schemas.job import JobAnalysisRequest, JobResponse

router = APIRouter()


@router.post("/analyze", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def analyze_job(
    request: JobAnalysisRequest,
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    structured_data = await AIResumeService.parse_job_structured(request.description)

    job = JobDescription(
        user_id=current_user.id,
        title=request.title or structured_data.job_title,
        company=request.company or structured_data.company,
        description=request.description,
        structured_data=structured_data.model_dump(),
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Index into RAG vector store
    if background_tasks:
        background_tasks.add_task(
            RAGChain.index_job_description, current_user.id, job.id, request.description
        )
    else:
        RAGChain.index_job_description(current_user.id, job.id, request.description)

    return JobResponse(
        id=job.id,
        user_id=job.user_id,
        title=job.title,
        company=job.company,
        description=job.description,
        structured_data=job.structured_data,
        created_at=job.created_at
    )


@router.get("", response_model=List[JobResponse])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(JobDescription)
        .where(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
    )
    jobs = result.scalars().all()
    return [
        JobResponse(
            id=j.id,
            user_id=j.user_id,
            title=j.title,
            company=j.company,
            description=j.description,
            structured_data=j.structured_data,
            created_at=j.created_at
        )
        for j in jobs
    ]


@router.get("/{id}", response_model=JobResponse)
async def get_job(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(JobDescription).where(JobDescription.id == id, JobDescription.user_id == current_user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise NotFoundException("Job description not found")

    return JobResponse(
        id=job.id,
        user_id=job.user_id,
        title=job.title,
        company=job.company,
        description=job.description,
        structured_data=job.structured_data,
        created_at=job.created_at
    )
