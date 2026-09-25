from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.interview import InterviewSession
from app.services.interview_service import InterviewService
from app.schemas.interview import (
    QuestionGeneratorRequest,
    QuestionResponse,
    MockInterviewStartRequest,
    MockInterviewAnswerRequest,
    MockInterviewNextStepResponse,
    InterviewSessionResponse,
)

router = APIRouter()


@router.post("/questions", response_model=QuestionResponse)
async def generate_interview_questions(
    request: QuestionGeneratorRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume_data = None
    if request.resume_id:
        r_res = await db.execute(
            select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
        )
        resume = r_res.scalar_one_or_none()
        if resume:
            resume_data = resume.structured_data

    job_data = None
    if request.job_id:
        j_res = await db.execute(
            select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
        )
        job = j_res.scalar_one_or_none()
        if job:
            job_data = job.structured_data

    return await InterviewService.generate_questions(
        role_title=request.role_title or "Software Developer",
        resume_data=resume_data,
        job_data=job_data,
        category=request.category or "all"
    )


@router.post("/start", response_model=MockInterviewNextStepResponse)
async def start_mock_interview(
    request: MockInterviewStartRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume_data = None
    if request.resume_id:
        r_res = await db.execute(
            select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id)
        )
        resume = r_res.scalar_one_or_none()
        if resume:
            resume_data = resume.structured_data

    job_data = None
    if request.job_id:
        j_res = await db.execute(
            select(JobDescription).where(JobDescription.id == request.job_id, JobDescription.user_id == current_user.id)
        )
        job = j_res.scalar_one_or_none()
        if job:
            job_data = job.structured_data

    questions_res = await InterviewService.generate_questions(
        role_title=request.role_title,
        resume_data=resume_data,
        job_data=job_data
    )

    questions_payload = [q.model_dump() for q in questions_res.questions]

    session = InterviewSession(
        user_id=current_user.id,
        job_id=request.job_id,
        role_title=request.role_title,
        status="in_progress",
        transcript=[{
            "step": 0,
            "questions": questions_payload,
            "current_index": 0,
            "answers": [],
            "evaluations": []
        }]
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    first_q = questions_res.questions[0] if questions_res.questions else None

    return MockInterviewNextStepResponse(
        session_id=session.id,
        status="in_progress",
        question_number=1,
        total_questions=len(questions_res.questions),
        current_question=first_q
    )


@router.post("/answer", response_model=MockInterviewNextStepResponse)
async def submit_mock_interview_answer(
    request: MockInterviewAnswerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.id == request.session_id, InterviewSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException("Interview session not found")

    transcript = list(session.transcript)
    if not transcript:
        raise BadRequestException("Invalid session state")

    session_state = transcript[0]
    questions = session_state.get("questions", [])
    current_idx = session_state.get("current_index", 0)

    if current_idx >= len(questions):
        raise BadRequestException("Interview session is already completed.")

    current_q = questions[current_idx]

    # Evaluate candidate answer
    evaluation = await InterviewService.evaluate_answer(
        question=current_q.get("question"),
        model_answer=current_q.get("model_answer"),
        candidate_answer=request.answer_text
    )

    session_state.setdefault("answers", []).append(request.answer_text)
    session_state.setdefault("evaluations", []).append(evaluation.model_dump())

    next_idx = current_idx + 1
    session_state["current_index"] = next_idx

    # Check if completed
    if next_idx >= len(questions):
        session.status = "completed"
        # Calculate overall scorecard
        evals = session_state["evaluations"]
        avg_tech = sum(e["technical_correctness"] for e in evals) / len(evals)
        avg_rel = sum(e["relevance"] for e in evals) / len(evals)
        avg_comp = sum(e["completeness"] for e in evals) / len(evals)
        avg_comm = sum(e["communication"] for e in evals) / len(evals)
        overall_score = round((avg_tech + avg_rel + avg_comp + avg_comm) / 4, 1)

        session.score = overall_score
        final_scorecard = {
            "overall_score": overall_score,
            "technical_correctness": round(avg_tech, 1),
            "relevance": round(avg_rel, 1),
            "completeness": round(avg_comp, 1),
            "communication": round(avg_comm, 1),
            "summary": f"Completed mock interview for {session.role_title} with overall performance score of {overall_score}%."
        }
        session.feedback = final_scorecard
        session.transcript = [session_state]
        await db.commit()

        return MockInterviewNextStepResponse(
            session_id=session.id,
            status="completed",
            question_number=next_idx,
            total_questions=len(questions),
            current_question=None,
            last_evaluation=evaluation,
            final_scorecard=final_scorecard
        )
    else:
        session.transcript = [session_state]
        await db.commit()
        next_q = questions[next_idx]

        return MockInterviewNextStepResponse(
            session_id=session.id,
            status="in_progress",
            question_number=next_idx + 1,
            total_questions=len(questions),
            current_question=next_q,
            last_evaluation=evaluation
        )


@router.get("/{id}", response_model=InterviewSessionResponse)
async def get_interview_session(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(InterviewSession).where(InterviewSession.id == id, InterviewSession.user_id == current_user.id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise NotFoundException("Interview session not found")

    return session
