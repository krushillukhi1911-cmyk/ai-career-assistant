import json
import logging
from typing import List
from app.ai.llm_provider import get_llm_provider
from app.ai.prompts import ROADMAP_GENERATOR_PROMPT
from app.schemas.roadmap import RoadmapResponse, RoadmapWeekItem

logger = logging.getLogger("ai_career_assistant")


def safe_json_parse(json_str: str) -> dict:
    cleaned = json_str.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


class RoadmapGenerator:
    @classmethod
    async def generate_roadmap(
        cls,
        target_role: str,
        current_skills: List[str],
        missing_skills: List[str],
        weeks: int = 6
    ) -> RoadmapResponse:
        prompt = (
            ROADMAP_GENERATOR_PROMPT
            .replace("{target_role}", target_role)
            .replace("{current_skills}", ", ".join(current_skills) if current_skills else "General Python")
            .replace("{missing_skills}", ", ".join(missing_skills) if missing_skills else "Cloud & Advanced Systems")
            .replace("{weeks}", str(weeks))
        )

        llm = get_llm_provider()
        response = await llm.generate(prompt)

        try:
            data = safe_json_parse(response)
            weeks_list = [RoadmapWeekItem(**w) for w in data.get("weekly_plan", [])]
            return RoadmapResponse(
                target_role=data.get("target_role", target_role),
                total_weeks=len(weeks_list),
                weekly_plan=weeks_list
            )
        except Exception as e:
            logger.error(f"Error parsing roadmap generator output ({e}): {response}")
            fallback_weeks = [
                RoadmapWeekItem(
                    week_number=1,
                    topic="Python Fundamentals & Data Structures Deep Dive",
                    why_it_matters="Mastering memory management and built-in algorithms is fundamental.",
                    learning_objectives=["Understand Python dict/set hash maps", "Master generators and decorators"],
                    practice_task="Implement custom data structures with type hints.",
                    mini_project="Build a fast CLI task scheduler.",
                    estimated_difficulty="Beginner"
                ),
                RoadmapWeekItem(
                    week_number=2,
                    topic="FastAPI & Async REST API Development",
                    why_it_matters="Industry standard framework for high-throughput Python backends.",
                    learning_objectives=["Master async/await endpoints", "Implement Pydantic v2 data validation"],
                    practice_task="Write middleware for request logging and exception handling.",
                    mini_project="Build a RESTful web service with JWT authentication.",
                    estimated_difficulty="Intermediate"
                )
            ]
            return RoadmapResponse(
                target_role=target_role,
                total_weeks=len(fallback_weeks),
                weekly_plan=fallback_weeks[:weeks]
            )
