from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models.user import User
from app.models.resume import Resume
from app.services.document_parser import DocumentParser
from app.ai.resume_analyzer import AIResumeService
from app.rag.rag_chain import RAGChain
from app.schemas.resume import ResumeResponse, ResumeAnalysisResponse

router = APIRouter()


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename:
        raise BadRequestException("No filename provided")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10 MB limit
        raise BadRequestException("File size exceeds 10MB limit")

    extracted_text, file_type = DocumentParser.parse_document(file.filename, content)
    
    # Extract structured AI representation
    structured_data = await AIResumeService.parse_resume_structured(extracted_text)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_type=file_type,
        extracted_text=extracted_text,
        structured_data=structured_data.model_dump(),
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    # Index into RAG vector store
    if background_tasks:
        background_tasks.add_task(
            RAGChain.index_resume, current_user.id, resume.id, extracted_text
        )
    else:
        RAGChain.index_resume(current_user.id, resume.id, extracted_text)

    # Perform analysis
    analysis_res = await AIResumeService.analyze_resume(extracted_text)

    return ResumeResponse(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        file_type=resume.file_type,
        extracted_text=resume.extracted_text,
        structured_data=resume.structured_data,
        analysis=analysis_res,
        created_at=resume.created_at
    )


@router.get("", response_model=List[ResumeResponse])
async def list_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc())
    )
    resumes = result.scalars().all()
    return [
        ResumeResponse(
            id=r.id,
            user_id=r.user_id,
            filename=r.filename,
            file_type=r.file_type,
            extracted_text=r.extracted_text,
            structured_data=r.structured_data,
            created_at=r.created_at
        )
        for r in resumes
    ]


@router.get("/{id}", response_model=ResumeResponse)
async def get_resume(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Resume).where(Resume.id == id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise NotFoundException("Resume not found")

    analysis_res = await AIResumeService.analyze_resume(resume.extracted_text)

    return ResumeResponse(
        id=resume.id,
        user_id=resume.user_id,
        filename=resume.filename,
        file_type=resume.file_type,
        extracted_text=resume.extracted_text,
        structured_data=resume.structured_data,
        analysis=analysis_res,
        created_at=resume.created_at
    )
