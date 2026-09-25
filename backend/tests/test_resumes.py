import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_resume_upload_and_list(client: AsyncClient, auth_headers: dict):
    # Upload TXT Resume
    sample_text = "Jane Doe\njane@example.com\nSkills: Python, FastAPI, PostgreSQL, Docker\nExperience: 3 years building web apps."
    files = {"file": ("resume.txt", sample_text.encode("utf-8"), "text/plain")}

    response = await client.post("/api/v1/resumes/upload", files=files, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == "resume.txt"
    assert "structured_data" in data
    assert "analysis" in data
    resume_id = data["id"]

    # List Resumes
    list_resp = await client.get("/api/v1/resumes", headers=auth_headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # Get Single Resume
    get_resp = await client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == resume_id
