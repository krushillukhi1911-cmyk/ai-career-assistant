import json
import logging
from typing import List
from app.ai.llm_provider import get_llm_provider
from app.ai.prompts import SKILL_GAP_ANALYZER_PROMPT
from app.schemas.skill_gap import SkillGapAnalysisResponse, SkillGapItem

logger = logging.getLogger("ai_career_assistant")


class SkillAnalyzer:
    @classmethod
    async def analyze_gaps(
        cls,
        resume_text: str,
        resume_skills: List[str],
        job_required_skills: List[str]
    ) -> SkillGapAnalysisResponse:
        resume_skills_set = {s.strip().lower() for s in resume_skills}
        resume_text_lower = resume_text.lower()

        existing_skills = []
        missing_skills = []

        for skill in job_required_skills:
            skill_l = skill.strip().lower()
            if skill_l in resume_skills_set or skill_l in resume_text_lower:
                existing_skills.append(skill)
            else:
                missing_skills.append(skill)

        for r_skill in resume_skills:
            if r_skill not in existing_skills:
                existing_skills.append(r_skill)

        prompt = (
            SKILL_GAP_ANALYZER_PROMPT
            .replace("{resume_skills}", ", ".join(resume_skills))
            .replace("{resume_text}", resume_text[:1500])
            .replace("{job_skills}", ", ".join(job_required_skills))
        )

        llm = get_llm_provider()
        response = await llm.generate(prompt)

        try:
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            data = json.loads(cleaned.strip())
            return SkillGapAnalysisResponse(**data)
        except Exception as e:
            logger.error(f"Error parsing skill gap LLM output ({e}): {response}")
            classified_items = []
            for m_skill in missing_skills:
                classified_items.append(
                    SkillGapItem(
                        skill_name=m_skill,
                        target_proficiency="Intermediate",
                        current_evidence="Not identified in uploaded resume.",
                        recommendation=f"Complete hands-on tutorials and build a mini-project utilizing {m_skill}."
                    )
                )

            return SkillGapAnalysisResponse(
                existing_skills=existing_skills,
                required_skills=job_required_skills,
                missing_skills=missing_skills,
                skill_gaps_classified=classified_items,
                action_plan_summary=f"Identified {len(missing_skills)} missing target skill(s). Focusing on these areas will significantly improve job fit."
            )
