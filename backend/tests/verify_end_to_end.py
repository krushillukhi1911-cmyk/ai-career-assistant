import asyncio
import httpx

BASE_URL = "http://localhost:8000/api/v1"


async def run_end_to_end_verification():
    print("🚀 Starting End-to-End Verification of AI Career Assistant API...\n")
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        # 1. Health Check
        h_res = await client.get(f"{BASE_URL}/health")
        print(f"[1] Health Check: Status {h_res.status_code} -> {h_res.json()}")
        assert h_res.status_code == 200

        # 2. User Registration & Login
        email = "demo_candidate@example.com"
        password = "password123"
        reg_res = await client.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
        if reg_res.status_code == 400:  # already exists
            login_res = await client.post(f"{BASE_URL}/auth/login/json", json={"email": email, "password": password})
            token = login_res.json()["access_token"]
        else:
            token = reg_res.json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        print(f"[2] Authentication: Token received successfully.")

        # 3. Resume Upload
        with open("../data/sample_resume.txt", "rb") as f:
            resume_bytes = f.read()

        up_res = await client.post(
            f"{BASE_URL}/resumes/upload",
            files={"file": ("sample_resume.txt", resume_bytes, "text/plain")},
            headers=headers
        )
        print(f"[3] Resume Upload: Status {up_res.status_code}")
        assert up_res.status_code == 201
        resume_data = up_res.json()
        resume_id = resume_data["id"]
        print(f"    Extracted Name: {resume_data['structured_data'].get('name')}")
        print(f"    Extracted Skills: {resume_data['structured_data'].get('skills')}")

        # 4. Job Description Analysis
        with open("../data/sample_job.txt", "r") as f:
            job_text = f.read()

        job_res = await client.post(
            f"{BASE_URL}/jobs/analyze",
            json={"title": "Senior Python & AI Backend Engineer", "company": "CloudTech Solutions", "description": job_text},
            headers=headers
        )
        print(f"[4] Job Analysis: Status {job_res.status_code}")
        assert job_res.status_code == 201
        job_data = job_res.json()
        job_id = job_data["id"]
        print(f"    Required Skills: {job_data['structured_data'].get('required_skills')}")

        # 5. Matching Engine
        match_res = await client.post(
            f"{BASE_URL}/matching/analyze",
            json={"resume_id": resume_id, "job_id": job_id},
            headers=headers
        )
        print(f"[5] Matching Engine: Status {match_res.status_code}")
        assert match_res.status_code == 200
        match_payload = match_res.json()
        print(f"    Compatibility Score: {match_payload['compatibility_score']}%")
        print(f"    Score Explanation: {match_payload['score_explanation']}")

        # 6. Skill Gap Analysis
        gap_res = await client.post(
            f"{BASE_URL}/skills/gap-analysis",
            json={"resume_id": resume_id, "job_id": job_id},
            headers=headers
        )
        print(f"[6] Skill Gap Analysis: Status {gap_res.status_code}")
        assert gap_res.status_code == 200
        gap_payload = gap_res.json()
        print(f"    Existing Skills: {gap_payload['existing_skills']}")
        print(f"    Missing Skills: {gap_payload['missing_skills']}")

        # 7. Resume Improvement
        imp_res = await client.post(
            f"{BASE_URL}/resume/improve",
            json={"resume_id": resume_id, "job_id": job_id},
            headers=headers
        )
        print(f"[7] Resume Improvement: Status {imp_res.status_code}")
        assert imp_res.status_code == 200
        imp_payload = imp_res.json()
        print(f"    Improved Summary: {imp_payload['improved_summary']}")

        # 8. AI Mock Interview
        start_mock = await client.post(
            f"{BASE_URL}/interview/start",
            json={"role_title": "Senior Python Developer", "resume_id": resume_id, "job_id": job_id},
            headers=headers
        )
        print(f"[8] Mock Interview Start: Status {start_mock.status_code}")
        assert start_mock.status_code == 200
        session_id = start_mock.json()["session_id"]
        current_q = start_mock.json()["current_question"]["question"]
        print(f"    Question 1: {current_q}")

        ans_res = await client.post(
            f"{BASE_URL}/interview/answer",
            json={"session_id": session_id, "answer_text": "FastAPI async def handlers run on the asyncio event loop while sync endpoints run in external thread pool. We use asyncpg for non-blocking database queries."},
            headers=headers
        )
        print(f"    Answer Evaluation Score: Technical {ans_res.json()['last_evaluation']['technical_correctness']}%")

        # 9. Learning Roadmap
        rm_res = await client.post(
            f"{BASE_URL}/roadmap/generate",
            json={"target_role": "Senior Python Developer", "resume_id": resume_id, "job_id": job_id, "weeks": 6},
            headers=headers
        )
        print(f"[9] Learning Roadmap: Status {rm_res.status_code}")
        assert rm_res.status_code == 200
        print(f"    Total Weeks: {rm_res.json()['total_weeks']}")

        # 10. RAG Career Chatbot
        chat_res = await client.post(
            f"{BASE_URL}/chat",
            json={"message": "What Python skills do I have according to my resume?", "resume_id": resume_id, "job_id": job_id},
            headers=headers
        )
        print(f"[10] RAG Career Chat: Status {chat_res.status_code}")
        assert chat_res.status_code == 200
        print(f"     Chatbot Answer: {chat_res.json()['answer']}")

    print("\n✅ End-to-End Verification Completed Successfully with 0 Errors!")


if __name__ == "__main__":
    asyncio.run(run_end_to_end_verification())
