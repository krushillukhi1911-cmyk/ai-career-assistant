from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.database.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.models.interview import InterviewSession
from app.models.roadmap import LearningRoadmap
from app.api.v1.auth import get_current_user
from app.rag.vector_store import global_vector_store

router = APIRouter()

SAMPLE_RESUME_TEXT = """Jane Doe
jane.doe@example.com | +1 (555) 019-2834 | San Francisco, CA
GitHub: https://github.com/janedoe | LinkedIn: linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 5+ years of experience building scalable backend microservices, REST APIs, and database-intensive web applications using Python, FastAPI, PostgreSQL, and Docker.

TECHNICAL SKILLS
- Languages & Frameworks: Python, FastAPI, Django, SQL, JavaScript, HTML5, CSS3
- Databases & ORM: PostgreSQL, SQLAlchemy, AsyncPG, Redis, SQLite
- DevOps & Tools: Docker, Git, Linux, Pytest, REST APIs, CI/CD, GitHub Actions

WORK EXPERIENCE
Senior Backend Engineer | Tech Innovations Inc | San Francisco, CA | 2021 - Present
- Architected high-throughput microservices in Python with FastAPI and PostgreSQL, serving 100,000+ daily active users with 99.9% uptime.
- Optimized complex SQL queries and database indexes, reducing average API response latency by 40%.
- Implemented JWT authentication and OAuth2 role-based access control across 15+ API microservice endpoints.

Junior Python Developer | DataCorp | Oakland, CA | 2019 - 2021
- Developed automated data ingestion pipelines and ETL scripts processing 5GB+ daily JSON metrics.
- Authored automated unit and integration tests using pytest, increasing test coverage from 60% to 92%.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 - 2019

PROJECTS
AI Career Assistant: Built an intelligent RAG resume and job matching platform using Python, FastAPI, and FAISS vector embeddings."""

SAMPLE_JOB_TEXT = """Senior Python & AI Backend Engineer

Company: CloudTech Solutions
Location: San Francisco, CA (Hybrid / Remote)

JOB DESCRIPTION:
CloudTech Solutions is seeking an experienced Senior Python Backend Engineer to join our core infrastructure and AI product team. You will architect high-performance FastAPI microservices, design scalable PostgreSQL database schemas, build RAG pipelines with vector databases, and deploy containerized services to AWS.

REQUIRED SKILLS & QUALIFICATIONS:
- 3+ years of professional backend software development experience in Python.
- Proven expertise with FastAPI, Pydantic, and async SQLAlchemy ORM.
- Strong background in relational database design, complex SQL query optimization, and PostgreSQL.
- Proficiency with Git version control, Docker containerization, and RESTful API design principles.
- Hands-on experience with automated testing using Pytest.

PREFERRED / BONUS SKILLS:
- Cloud infrastructure experience with AWS (ECS, S3, RDS, App Runner).
- Familiarity with AI/ML concepts, Sentence-Transformers, vector databases (FAISS / ChromaDB), and RAG pipelines.
- Experience with Redis caching and Celery / background job processing.
- Knowledge of CI/CD pipeline automation with GitHub Actions."""

@router.post("/seed-demo-data")
async def seed_demo_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Populates rich sample demo data (resumes, target job roles, interview history, roadmap) for testing."""
    
    # 1. Create Sample Resume
    resume = Resume(
        user_id=current_user.id,
        filename="Jane_Doe_Resume_Sample.txt",
        file_type="txt",
        extracted_text=SAMPLE_RESUME_TEXT,
        structured_data={
            "contact_info": {"name": "Jane Doe", "email": "jane.doe@example.com", "phone": "+1 (555) 019-2834"},
            "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "REST APIs", "SQL", "pytest", "Redis", "Linux", "Django", "JavaScript", "HTML5", "CSS3"],
            "experience": [
              {
                "company": "Tech Innovations Inc",
                "role": "Senior Backend Engineer",
                "duration": "2021 - Present",
                "description": "Architected high-throughput microservices in Python with FastAPI and PostgreSQL serving 100,000+ daily active users."
              }
            ],
            "education": [
              {
                "institution": "UC Berkeley",
                "degree": "B.S. Computer Science",
                "year": "2015 - 2019"
              }
            ]
        }
    )
    db.add(resume)
    await db.flush()

    # Index into vector store for RAG
    global_vector_store.add_texts(
        [f"Candidate Resume: {SAMPLE_RESUME_TEXT}"],
        [{"user_id": current_user.id, "resume_id": resume.id}]
    )

    # 2. Create Sample Job Description
    job = JobDescription(
        user_id=current_user.id,
        title="Senior Python & AI Backend Engineer",
        company="CloudTech Solutions",
        description=SAMPLE_JOB_TEXT,
        structured_data={
            "required_skills": ["Python", "FastAPI", "PostgreSQL", "SQL", "Git", "Docker", "REST APIs", "Pytest"],
            "preferred_skills": ["AWS", "FAISS", "Redis", "Celery", "CI/CD"],
            "responsibilities": ["Architect FastAPI microservices", "Optimize PostgreSQL schemas", "Build RAG pipelines"]
        }
    )
    db.add(job)
    await db.flush()

    # 3. Create Sample Interview Session
    interview = InterviewSession(
        user_id=current_user.id,
        job_id=job.id,
        role_title="Senior Python Developer",
        status="completed",
        score=88.5,
        transcript=[
            {
                "question": "Explain the difference between sync and async handlers in FastAPI, and how Python GIL handles async I/O operations.",
                "answer": "Async handlers yield execution during I/O wait times via await keywords, maximizing request concurrency.",
                "score": 90.0,
                "feedback": "Excellent technical response demonstrating deep understanding of event loops and non-blocking I/O."
            }
        ],
        feedback={"summary": "Candidate demonstrated strong technical knowledge of async Python and backend architecture."}
    )
    db.add(interview)

    # 4. Create Sample Roadmap
    roadmap = LearningRoadmap(
        user_id=current_user.id,
        target_role="Senior AI Backend Engineer",
        roadmap_data={
            "weeks_count": 6,
            "curriculum": [
                {
                    "week": 1,
                    "topic": "Advanced FastAPI & Async Database Architecture",
                    "objective": "Master async SQLAlchemy 2.0 ORM, greenlet execution, and connection pooling.",
                    "action_items": [
                        "Implement async database migrations with Alembic",
                        "Add connection pooling benchmarks for PostgreSQL"
                    ],
                    "resources": [
                        "FastAPI Async Docs",
                        "SQLAlchemy 2.0 Async Guide"
                    ]
                },
                {
                    "week": 2,
                    "topic": "Redis Caching & Background Task Queues",
                    "objective": "Implement Redis response caching and Celery background workers.",
                    "action_items": [
                        "Integrate Redis key-value cache for API endpoints",
                        "Configure Celery worker with Redis broker"
                    ],
                    "resources": [
                        "Redis Developer Documentation",
                        "Celery User Guide"
                    ]
                },
                {
                    "week": 3,
                    "topic": "AWS Cloud Deployment & Docker Orchestration",
                    "objective": "Deploy containerized services using Docker Compose and AWS ECS.",
                    "action_items": [
                        "Create multi-stage Dockerfiles for backend and frontend",
                        "Deploy app to AWS App Runner / ECS with HTTPS"
                    ],
                    "resources": [
                        "AWS ECS Best Practices",
                        "Docker Production Optimization"
                    ]
                }
            ]
        }
    )
    db.add(roadmap)

    await db.commit()

    return {
        "message": "Demo sample data populated successfully!",
        "resume_id": resume.id,
        "job_id": job.id,
        "interview_id": interview.id,
        "roadmap_id": roadmap.id
    }
