import json
import logging
from abc import ABC, abstractmethod
import httpx
from app.core.config import settings

logger = logging.getLogger("ai_career_assistant")


class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str) -> str:
        """
        Generate text completion or JSON string for the given prompt.
        """
        pass


class OpenAILLMProvider(LLMProvider):
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.model = model or settings.LLM_MODEL_NAME

    async def generate(self, prompt: str) -> str:
        if not self.api_key:
            logger.warning("OpenAI API Key missing, falling back to Mock LLM provider.")
            return await MockLLMProvider().generate(prompt)
            
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional AI Career & HR Expert. Output valid JSON when requested."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"OpenAI API Error: {response.text}")
                raise RuntimeError(f"OpenAI API returned status code {response.status_code}")
            data = response.json()
            return data["choices"][0]["message"]["content"]


class GeminiLLMProvider(LLMProvider):
    def __init__(self, api_key: str = None, model: str = "gemini-1.5-flash"):
        self.api_key = api_key or settings.LLM_API_KEY
        self.model = model

    async def generate(self, prompt: str) -> str:
        if not self.api_key:
            return await MockLLMProvider().generate(prompt)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"Gemini API Error: {response.text}")
                raise RuntimeError(f"Gemini API returned status code {response.status_code}")
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]


class OllamaLLMProvider(LLMProvider):
    def __init__(self, base_url: str = None, model: str = "llama3"):
        self.base_url = base_url or settings.OLLAMA_BASE_URL
        self.model = model

    async def generate(self, prompt: str) -> str:
        url = f"{self.base_url}/api/generate"
        payload = {"model": self.model, "prompt": prompt, "stream": False}
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                raise RuntimeError(f"Ollama returned status {response.status_code}")
            return response.json().get("response", "")


class MockLLMProvider(LLMProvider):
    """
    Mock LLM provider that simulates realistic AI career assistance structured outputs.
    Ensures zero-config testing and works reliably without API keys.
    """
    async def generate(self, prompt: str) -> str:
        prompt_lower = prompt.lower()

        if "resume_parser" in prompt_lower or "extract structured career data" in prompt_lower:
            return json.dumps({
                "name": "Jane Doe",
                "email": "jane.doe@example.com",
                "phone": "+1 (555) 019-2834",
                "location": "San Francisco, CA",
                "summary": "Results-driven Senior Software Engineer with 5+ years of experience building scalable backend web applications and AI tools.",
                "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "REST APIs", "SQL", "pytest", "Redis", "Linux"],
                "education": [
                    {
                        "institution": "University of California, Berkeley",
                        "degree": "Bachelor of Science",
                        "field_of_study": "Computer Science",
                        "start_date": "2015",
                        "end_date": "2019",
                        "grade": "3.8 GPA"
                    }
                ],
                "experience": [
                    {
                        "company": "Tech Innovations Inc",
                        "title": "Backend Engineer",
                        "location": "San Francisco, CA",
                        "start_date": "2021",
                        "end_date": "Present",
                        "description": "Architected high-throughput backend services using FastAPI and PostgreSQL.",
                        "highlights": [
                            "Optimized database queries reducing latency by 40%.",
                            "Implemented REST APIs serving 100k daily active users.",
                            "Built automated CI/CD pipelines using GitHub Actions."
                        ]
                    },
                    {
                        "company": "DataCorp",
                        "title": "Junior Python Developer",
                        "location": "Oakland, CA",
                        "start_date": "2019",
                        "end_date": "2021",
                        "description": "Developed internal data ingestion scripts and RESTful endpoints.",
                        "highlights": ["Wrote automated unit tests achieving 90% coverage."]
                    }
                ],
                "projects": [
                    {
                        "name": "AI Career Assistant",
                        "description": "Built RAG-powered resume and job description analyzer using Python and FAISS.",
                        "technologies": ["Python", "FastAPI", "FAISS", "Docker"],
                        "link": "https://github.com/example/ai-career-assistant"
                    }
                ],
                "certifications": ["AWS Certified Developer Associate", "Certified Kubernetes Application Developer"],
                "achievements": ["Hackathon Winner 2023 - Best AI Integration"]
            })

        elif "job_parser" in prompt_lower or "extract structured job requirements" in prompt_lower:
            return json.dumps({
                "job_title": "Senior Python Developer",
                "company": "CloudTech Solutions",
                "required_skills": ["Python", "FastAPI", "PostgreSQL", "SQL", "Git", "Docker", "REST APIs"],
                "preferred_skills": ["AWS", "CI/CD", "Redis", "Kubernetes", "Sentence-Transformers", "FAISS"],
                "experience_requirements": "3-5 years",
                "education_requirements": "Bachelor's degree in Computer Science or equivalent",
                "responsibilities": [
                    "Design and implement scalable Python microservices.",
                    "Optimize database performance and complex SQL queries.",
                    "Collaborate with frontend engineers to build seamless web applications."
                ],
                "technologies": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Redis"],
                "keywords": ["Python", "FastAPI", "PostgreSQL", "Docker", "Microservices", "REST API", "AWS"]
            })

        elif "resume_analyzer" in prompt_lower or "compatibility analysis" in prompt_lower:
            return json.dumps({
                "technical_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git", "SQL", "pytest"],
                "soft_skills": ["Problem Solving", "Team Collaboration", "Communication", "Agile Execution"],
                "strengths": [
                    "Strong background in Python and FastAPI backend development.",
                    "Proven track record in database optimization and SQL.",
                    "Good automated testing and CI/CD awareness."
                ],
                "improvements": [
                    "Quantify impact in experience bullets (e.g. percentages, user volume).",
                    "Add explicit cloud deployment experience (AWS/GCP).",
                    "Highlight system architecture and high-availability design decisions."
                ],
                "missing_sections": ["Volunteering / Open Source Contributions"],
                "keywords": ["Python", "FastAPI", "PostgreSQL", "Docker", "Microservices", "REST APIs"],
                "formatting_notes": [
                    "Consistent bullet point formatting.",
                    "Ensure section headings are standard for ATS readability."
                ]
            })

        elif "resume_improver" in prompt_lower or "suggest improvements" in prompt_lower:
            return json.dumps({
                "improved_summary": "High-impact Senior Python Developer with 5+ years of expertise in FastAPI microservices, PostgreSQL query optimization, and cloud deployments. Driven by building robust, developer-friendly REST APIs.",
                "refined_bullet_points": [
                    {
                        "original": "Architected high-throughput backend services using FastAPI.",
                        "improved": "Engineered high-throughput FastAPI backend services delivering 99.9% uptime for 100k+ daily active users."
                    },
                    {
                        "original": "Optimized database queries reducing latency by 40%.",
                        "improved": "Optimized PostgreSQL indexes and complex SQL queries, decreasing average API response latency by 40%."
                    }
                ],
                "recommended_action_verbs": ["Engineered", "Architected", "Spearheaded", "Optimized", "Deployed", "Streamlined"],
                "missing_keywords": ["AWS", "CI/CD", "Kubernetes", "Redis", "FAISS"],
                "project_enhancements": [
                    {
                        "project_name": "AI Career Assistant",
                        "suggested_description": "Architected an end-to-end RAG career analysis platform utilizing Python, FastAPI, and FAISS vector embeddings to analyze resumes against job descriptions."
                    }
                ],
                "safety_disclaimer": "All improvements strictly retain facts present in original resume evidence."
            })

        elif "interview_generator" in prompt_lower or "generate interview questions" in prompt_lower:
            return json.dumps({
                "role_title": "Senior Python Developer",
                "total_questions": 4,
                "questions": [
                    {
                        "id": "q1",
                        "category": "Python",
                        "difficulty": "Medium",
                        "question": "Explain the difference between sync and async handlers in FastAPI, and how Python GIL handles async I/O operations.",
                        "model_answer": "FastAPI async def endpoints run on the main asyncio event loop. For non-blocking I/O operations (like database calls with asyncpg), async endpoints allow concurrent execution. Sync def endpoints run in an external thread pool.",
                        "explanation": "Tests deep understanding of Python asyncio and FastAPI performance execution model.",
                        "referenced_project_or_skill": "FastAPI"
                    },
                    {
                        "id": "q2",
                        "category": "Backend",
                        "difficulty": "Hard",
                        "question": "How do you optimize slow PostgreSQL queries in an async SQLAlchemy application?",
                        "model_answer": "Analyze execution plans using EXPLAIN ANALYZE, add index coverage, select only required columns, use joinedload/selectinload to eliminate N+1 queries, and utilize async connection pooling.",
                        "explanation": "Evaluates database tuning skills.",
                        "referenced_project_or_skill": "PostgreSQL"
                    },
                    {
                        "id": "q3",
                        "category": "AI/ML",
                        "difficulty": "Medium",
                        "question": "How does vector similarity search with FAISS or ChromaDB work when performing RAG document retrieval?",
                        "model_answer": "Document text chunks are converted to dense vector embeddings using models like SentenceTransformers. FAISS indexing (e.g. L2 or Cosine distance) calculates vector proximity to locate relevant context chunks for the LLM prompt.",
                        "explanation": "Tests knowledge of RAG architecture.",
                        "referenced_project_or_skill": "FAISS & RAG"
                    },
                    {
                        "id": "q4",
                        "category": "Project-specific",
                        "difficulty": "Medium",
                        "question": "In your 'AI Career Assistant' project, how did you handle document parsing for corrupted PDFs or unsupported formats?",
                        "model_answer": "Used PyMuPDF to inspect text streams, wrapped extraction in clean error handling, and validated structured output schema with Pydantic.",
                        "explanation": "References actual candidate project evidence.",
                        "referenced_project_or_skill": "AI Career Assistant"
                    }
                ]
            })

        elif "mock_interview_eval" in prompt_lower or "evaluate answer" in prompt_lower:
            return json.dumps({
                "technical_correctness": 88.0,
                "relevance": 92.0,
                "completeness": 85.0,
                "communication": 90.0,
                "strengths": [
                    "Clear distinction between sync and async event loops.",
                    "Correct explanation of asyncio non-blocking I/O."
                ],
                "missing_concepts": [
                    "Could mention threadpool limit configuration in Starlette/FastAPI."
                ],
                "feedback_summary": "Strong technical explanation demonstrating solid grasp of FastAPI async fundamentals.",
                "ideal_answer_points": [
                    "Mention asyncio event loop vs threadpool executor",
                    "Highlight asyncpg driver for non-blocking DB calls"
                ]
            })

        elif "roadmap_generator" in prompt_lower or "personalized learning roadmap" in prompt_lower:
            return json.dumps({
                "target_role": "Senior Python Developer",
                "total_weeks": 6,
                "weekly_plan": [
                    {
                        "week_number": 1,
                        "topic": "Python Advanced & Async Deep Dive",
                        "why_it_matters": "Mastering asyncio, generators, context managers, and GIL performance is essential for senior backend engineering.",
                        "learning_objectives": ["Understand asyncio event loop internals", "Master custom decorators & context managers"],
                        "practice_task": "Write an async rate limiter middleware for HTTP requests.",
                        "mini_project": "Build an async web scraper with concurrency controls.",
                        "estimated_difficulty": "Intermediate"
                    },
                    {
                        "week_number": 2,
                        "topic": "FastAPI & Production Microservices",
                        "why_it_matters": "FastAPI is standard for modern Python REST APIs and microservice architecture.",
                        "learning_objectives": ["Build custom Pydantic v2 validators", "Configure OAuth2 JWT flow"],
                        "practice_task": "Implement secure authentication with refresh tokens.",
                        "mini_project": "Build a multi-tenant API gateway with FastAPI.",
                        "estimated_difficulty": "Intermediate"
                    },
                    {
                        "week_number": 3,
                        "topic": "PostgreSQL Optimization & SQLAlchemy 2.0",
                        "why_it_matters": "Database performance directly determines backend scalability.",
                        "learning_objectives": ["Analyze query plans with EXPLAIN ANALYZE", "Master async SQLAlchemy ORM relationships"],
                        "practice_task": "Optimize a slow query with N+1 issue using selectinload.",
                        "mini_project": "Design a high-throughput transaction logging schema.",
                        "estimated_difficulty": "Advanced"
                    },
                    {
                        "week_number": 4,
                        "topic": "Docker, Containerization & CI/CD",
                        "why_it_matters": "Deploying scalable applications requires container orchestration.",
                        "learning_objectives": ["Write multi-stage Dockerfiles", "Configure docker-compose networks"],
                        "practice_task": "Containerize a FastAPI app with PostgreSQL service.",
                        "mini_project": "Set up a GitHub Actions CI pipeline with automated pytest.",
                        "estimated_difficulty": "Intermediate"
                    },
                    {
                        "week_number": 5,
                        "topic": "AWS Fundamentals & Cloud Deployment",
                        "why_it_matters": "Cloud deployment skills bridge local development and production scale.",
                        "learning_objectives": ["Deploy containers to AWS ECS/Fargate", "Configure S3 & RDS instances"],
                        "practice_task": "Deploy a stateless REST API to AWS App Runner.",
                        "mini_project": "Build an automated S3 file upload service.",
                        "estimated_difficulty": "Advanced"
                    },
                    {
                        "week_number": 6,
                        "topic": "AI/ML Fundamentals & RAG Pipelines",
                        "why_it_matters": "AI integration is key for modern intelligent applications.",
                        "learning_objectives": ["Master SentenceTransformers embeddings", "Build FAISS vector index retrieval"],
                        "practice_task": "Implement similarity search over text chunks.",
                        "mini_project": "Build a RAG knowledge base assistant.",
                        "estimated_difficulty": "Advanced"
                    }
                ]
            })

        elif "career_chatbot" in prompt_lower or "rag question" in prompt_lower:
            return json.dumps({
                "answer": "Based on your uploaded resume, you have strong experience in Python, FastAPI, PostgreSQL, and Docker. To target the Senior Python Developer position, your main missing skill areas are AWS cloud deployment, CI/CD pipeline automation, and Redis caching. I recommend focusing your next study session on AWS and Redis.",
                "context_sources": [
                    {
                        "source_type": "resume",
                        "content_snippet": "Skills: Python, FastAPI, PostgreSQL, Docker, Git",
                        "relevance_score": 0.92
                    },
                    {
                        "source_type": "job_description",
                        "content_snippet": "Preferred Skills: AWS, CI/CD, Redis, Kubernetes",
                        "relevance_score": 0.88
                    }
                ]
            })

        # Generic fallback
        return json.dumps({
            "status": "success",
            "message": "AI analysis completed.",
            "data": prompt[:100]
        })


def get_llm_provider() -> LLMProvider:
    provider = settings.LLM_PROVIDER.lower()
    if provider == "openai":
        return OpenAILLMProvider()
    elif provider == "gemini":
        return GeminiLLMProvider()
    elif provider == "ollama":
        return OllamaLLMProvider()
    else:
        return MockLLMProvider()
