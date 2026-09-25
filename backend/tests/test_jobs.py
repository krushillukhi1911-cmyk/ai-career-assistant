import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_job_analysis(client: AsyncClient, auth_headers: dict):
    job_payload = {
        "title": "Senior Python Engineer",
        "company": "TechCorp",
        "description": "We are seeking a Senior Python Developer with strong skills in FastAPI, PostgreSQL, SQL, Docker, and AWS."
    }
    response = await client.post("/api/v1/jobs/analyze", json=job_payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Senior Python Engineer"
    assert "required_skills" in data["structured_data"]
