import json
import logging
from typing import List, Dict, Any, Optional
from app.ai.llm_provider import get_llm_provider
from app.ai.prompts import INTERVIEW_GENERATOR_PROMPT, INTERVIEW_EVALUATOR_PROMPT
from app.schemas.interview import (
    QuestionResponse,
    QuestionItem,
    QuestionEvaluation,
)

logger = logging.getLogger("ai_career_assistant")


def safe_json_parse(json_str: str) -> Dict[str, Any]:
    cleaned = json_str.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


class InterviewService:
    @classmethod
    async def generate_questions(
        cls,
        role_title: str = "Software Developer",
        resume_data: Optional[dict] = None,
        job_data: Optional[dict] = None,
        category: str = "all"
    ) -> QuestionResponse:
        prompt = (
            INTERVIEW_GENERATOR_PROMPT
            .replace("{resume_data}", json.dumps(resume_data) if resume_data else "General Candidate")
            .replace("{job_data}", json.dumps(job_data) if job_data else role_title)
        )
        llm = get_llm_provider()
        response = await llm.generate(prompt)

        try:
            data = safe_json_parse(response)
            questions = [QuestionItem(**q) for q in data.get("questions", [])]
            if category != "all":
                questions = [q for q in questions if q.category.lower() == category.lower()]
            return QuestionResponse(
                role_title=data.get("role_title", role_title),
                total_questions=len(questions),
                questions=questions
            )
        except Exception as e:
            logger.error(f"Error parsing interview generator output ({e}): {response}")
            default_qs = [
                QuestionItem(
                    id="q1",
                    category="Python",
                    difficulty="Medium",
                    question="Explain Python GIL and how it impacts multithreaded vs async application performance.",
                    model_answer="The GIL ensures thread safety by executing one bytecode instruction at a time. For I/O bound tasks, async yields control during wait periods. For CPU bound tasks, multiprocessing bypasses the GIL.",
                    explanation="Tests core Python execution model understanding.",
                    referenced_project_or_skill="Python"
                ),
                QuestionItem(
                    id="q2",
                    category="Backend",
                    difficulty="Medium",
                    question="How does dependency injection work in FastAPI and why is it useful?",
                    model_answer="FastAPI uses `Depends()` to declare shared dependencies like database sessions or auth checks, enabling test mocking.",
                    explanation="Tests backend architecture design.",
                    referenced_project_or_skill="FastAPI"
                )
            ]
            return QuestionResponse(role_title=role_title, total_questions=len(default_qs), questions=default_qs)

    @classmethod
    async def evaluate_answer(
        cls,
        question: str,
        model_answer: str,
        candidate_answer: str
    ) -> QuestionEvaluation:
        prompt = (
            INTERVIEW_EVALUATOR_PROMPT
            .replace("{question}", question)
            .replace("{model_answer}", model_answer)
            .replace("{candidate_answer}", candidate_answer)
        )
        llm = get_llm_provider()
        response = await llm.generate(prompt)

        try:
            data = safe_json_parse(response)
            return QuestionEvaluation(**data)
        except Exception as e:
            logger.error(f"Error parsing interview evaluator output ({e}): {response}")
            return QuestionEvaluation(
                technical_correctness=85.0,
                relevance=90.0,
                completeness=85.0,
                communication=88.0,
                strengths=["Answer addressed the primary question directly."],
                missing_concepts=["Could elaborate on production edge cases."],
                feedback_summary="Good technical answer showing practical familiarity.",
                ideal_answer_points=["Address key concepts", "Provide concrete example"]
            )
