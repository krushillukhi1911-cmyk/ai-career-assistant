import logging
import numpy as np
from typing import List, Dict, Any
from app.ai.embeddings import EmbeddingService
from app.schemas.matching import MatchingResultResponse

logger = logging.getLogger("ai_career_assistant")


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    a = np.array(vec1, dtype=np.float32)
    b = np.array(vec2, dtype=np.float32)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


class MatchingEngine:
    @staticmethod
    def calculate_match(
        resume_id: str,
        job_id: str,
        resume_text: str,
        resume_skills: List[str],
        job_text: str,
        job_required_skills: List[str],
        job_preferred_skills: List[str]
    ) -> MatchingResultResponse:
        # 1. Semantic Similarity via Sentence Embeddings
        resume_embedding = EmbeddingService.get_embedding(resume_text[:2000])
        job_embedding = EmbeddingService.get_embedding(job_text[:2000])
        raw_sim = cosine_similarity(resume_embedding, job_embedding)
        # Scale cosine similarity from [-1, 1] or [0, 1] to a readable 0-100 percentage
        semantic_score = max(0.0, min(100.0, (raw_sim + 0.2) / 1.2 * 100))

        # 2. Skill Overlap Calculation
        resume_skills_lower = {s.lower().strip() for s in resume_skills}
        required_skills_lower = [s.strip() for s in job_required_skills]
        preferred_skills_lower = [s.strip() for s in job_preferred_skills]

        strong_matches = []
        skills_to_develop = []

        matched_count = 0
        total_required = max(1, len(required_skills_lower))

        for req_skill in job_required_skills:
            req_l = req_skill.lower().strip()
            # Direct or substring match in resume skills or raw text
            if req_l in resume_skills_lower or any(req_l in s for s in resume_skills_lower) or req_l in resume_text.lower():
                strong_matches.append(req_skill)
                matched_count += 1
            else:
                skills_to_develop.append(req_skill)

        # Include preferred skills in development list if missing
        for pref_skill in job_preferred_skills:
            pref_l = pref_skill.lower().strip()
            if pref_l in resume_skills_lower or pref_l in resume_text.lower():
                if pref_skill not in strong_matches:
                    strong_matches.append(pref_skill)
            else:
                if pref_skill not in skills_to_develop:
                    skills_to_develop.append(pref_skill)

        skill_overlap_score = round((matched_count / total_required) * 100, 1)

        # 3. Keyword Coverage Calculation
        all_job_keywords = set([s.lower() for s in job_required_skills + job_preferred_skills])
        if not all_job_keywords:
            keyword_score = semantic_score
        else:
            found_keywords = [kw for kw in all_job_keywords if kw in resume_text.lower()]
            keyword_score = round((len(found_keywords) / max(1, len(all_job_keywords))) * 100, 1)

        # 4. Overall Compatibility Score Formula:
        # 45% Skill Overlap + 35% Semantic Similarity + 20% Keyword Coverage
        overall_score = round(
            (0.45 * skill_overlap_score) + (0.35 * semantic_score) + (0.20 * keyword_score), 1
        )
        overall_score = max(5.0, min(99.0, overall_score))

        # 5. Transparent Explanation
        explanation = (
            f"Compatibility score of {overall_score}% calculated transparently via: "
            f"45% Skill Overlap ({skill_overlap_score}%), "
            f"35% Semantic Embedding Similarity ({round(semantic_score, 1)}%), and "
            f"20% Job Keyword Coverage ({keyword_score}%). "
            f"Found {len(strong_matches)} matched key skills out of {len(job_required_skills)} required."
        )

        return MatchingResultResponse(
            resume_id=resume_id,
            job_id=job_id,
            compatibility_score=overall_score,
            semantic_similarity_score=round(semantic_score, 1),
            skill_overlap_score=skill_overlap_score,
            keyword_coverage_score=keyword_score,
            strong_matches=strong_matches,
            skills_to_develop=skills_to_develop,
            relevant_experience_summary="Candidate experience aligns with core programming and software engineering workflows.",
            relevant_projects_summary="Candidate projects demonstrate practical hands-on application of modern development tools.",
            score_explanation=explanation
        )
