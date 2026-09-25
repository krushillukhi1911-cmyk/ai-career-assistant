import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_matching_and_skill_gap(client: AsyncClient, auth_headers: dict):
    # Upload Resume
    resume_text = "John Smith\njohn@example.com\nSkills: Python, FastAPI, SQL\nExperience: Built REST APIs."
    res_resp = await client.post(
        "/api/v1/resumes/upload",
        files={"file": ("resume.txt", resume_text.encode("utf-8"), "text/plain")},
        headers=auth_headers
    )
    resume_id = res_resp.json()["id"]

    # Upload Job
    job_resp = await client.post(
        "/api/v1/jobs/analyze",
        json={
            "title": "Python Developer",
            "description": "Looking for Python, FastAPI, SQL, Docker, AWS."
        },
        headers=auth_headers
    )
    job_id = job_resp.json()["id"]

    # Test Matching
    match_resp = await client.post(
        "/api/v1/matching/analyze",
        json={"resume_id": resume_id, "job_id": job_id},
        headers=auth_headers
    )
    assert match_resp.status_code == 200
    m_data = match_resp.json()
    assert 0 <= m_data["compatibility_score"] <= 100
    assert "score_explanation" in m_data

    # Test Skill Gap Analysis
    gap_resp = await client.post(
        "/api/v1/skills/gap-analysis",
        json={"resume_id": resume_id, "job_id": job_id},
        headers=auth_headers
    )
    assert gap_resp.status_code == 200
    g_data = gap_resp.json()
    assert "existing_skills" in g_data
    assert "missing_skills" in g_data
