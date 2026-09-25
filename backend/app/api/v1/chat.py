from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.rag.rag_chain import RAGChain
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat_with_career_assistant(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume_text = None
    if request.resume_id:
        r_res = await db.execute(
            select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
        )
        resume = r_res.scalar_one_or_none()
        if resume:
            resume_text = resume.extracted_text

    job_text = None
    if request.job_id:
        j_res = await db.execute(
            select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
        )
        job = j_res.scalar_one_or_none()
        if job:
            job_text = job.description

    return await RAGChain.ask_question(
        user_id=current_user.id,
        question=request.message,
        resume_text=resume_text,
        job_text=job_text
    )
