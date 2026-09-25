# AI Career Assistant

Production-ready, full-stack **AI Career Assistant** web application built with **Python (FastAPI, SQLAlchemy, Sentence-Transformers, FAISS)** and **React (TypeScript, Vite, Modern Glassmorphism CSS)**.

The application allows users to upload resumes (PDF, DOCX, TXT), parse structured candidate data, analyze resumes against target job postings, compute transparent semantic & skill compatibility scores, classify skill gaps, generate tailored resume improvement suggestions, produce job-specific interview questions, conduct interactive mock interviews, construct personalized weekly learning roadmaps, and chat with a RAG-backed career chatbot.

---

## Architecture Overview

```mermaid
graph TD
    User([User / Browser]) <--> Frontend[React + TypeScript Frontend]
    Frontend <--> API[FastAPI REST API v1]
    
    subgraph Backend Layer
        API --> Auth[JWT & Security Engine]
        API --> DocParser[Document Parser PyMuPDF / python-docx]
        API --> MatchEngine[Semantic & Skill Match Engine]
        API --> SkillAnalyzer[Skill Gap Classifier]
        API --> InterviewService[Mock Interview & Question Generator]
        API --> RoadmapGen[Roadmap Generator]
        API --> RAGChain[RAG Pipeline]
    end

    subgraph AI / ML & Database
        RAGChain <--> VectorDB[FAISS Vector Store]
        DocParser <--> Embeddings[SentenceTransformers all-MiniLM-L6-v2]
        MatchEngine <--> Embeddings
        API <--> LLM[LLM Provider Abstraction OpenAI / Gemini / Ollama / Mock]
        API <--> DB[(PostgreSQL / SQLite Database)]
    end
```

---

## Core Features

1. **Document Processing & Parsing**: Native text extraction for PDF (PyMuPDF), DOCX (python-docx), and TXT files into validated Pydantic JSON schemas (`name`, `email`, `skills`, `education`, `experience`, `projects`, `certifications`).
2. **Resume Compatibility Analysis**: Structured evaluation of technical skills, soft skills, strengths, actionable improvements, missing sections, and formatting notes (without false ATS claims).
3. **Job Description Analyzer**: Extraction of required skills, preferred qualifications, experience levels, and core responsibilities from raw job postings.
4. **Resume vs Job Match Engine**: Transparent compatibility score (0-100%) calculated via 45% skill overlap + 35% SentenceTransformers vector similarity + 20% job keyword coverage.
5. **Skill Gap Analysis**: Categorization of missing skills into Beginner, Intermediate, & Advanced levels based strictly on resume evidence (no fabricated skill claims).
6. **AI Resume Improvement**: Generates polished summary statements, action-verb bullet refinements, missing keyword suggestions, and project enhancements while enforcing strict facts-vs-assumptions safety rules.
7. **AI Interview Question Generator**: Role-tailored questions across Python, Backend, AI/ML, and candidate project categories with model answers & explanations.
8. **Interactive AI Mock Interview**: Interactive simulator featuring step-by-step questions, real-time response evaluation (technical correctness, relevance, completeness, communication), and final performance scorecards.
9. **Personalized Learning Roadmap**: Week-by-week curriculum specifying learning objectives, hands-on practice tasks, and capstone mini-projects.
10. **RAG Career Chatbot**: Contextual QA chatbot powered by FAISS vector similarity search over uploaded resumes and target job postings.
11. **Production Security & Persistence**: JWT authentication, bcrypt password hashing, SQLAlchemy 2.0 async ORM, and Alembic migrations.

---

## Tech Stack

### Backend
* **Python**: 3.12+
* **Framework**: FastAPI, Uvicorn
* **Database & ORM**: PostgreSQL, SQLAlchemy 2.0 (Async), Alembic, SQLite fallback
* **Security & Auth**: PyJWT / python-jose, Passlib (bcrypt)
* **Document Processing**: PyMuPDF (`fitz`), `python-docx`

### AI / ML & RAG
* **LLM Provider Abstraction**: `LLMProvider` base class with OpenAI, Gemini, Ollama, and zero-key `MockLLMProvider` implementations
* **Embeddings**: `sentence-transformers` (`all-MiniLM-L6-v2`)
* **Vector Store**: FAISS (`faiss-cpu`) index manager
* **Data Validation**: Pydantic v2

### Frontend
* **Core**: React 18, TypeScript, Vite
* **Styling**: Vanilla CSS glassmorphic design system
* **Icons**: Lucide React

---

## Directory Structure

```text
ai-career-assistant/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── v1/            # REST API Routes (Auth, Resumes, Jobs, Matching, Skills, Interview, Roadmap, Chat)
│   │   ├── core/              # Config, Security, Logging, Exceptions
│   │   ├── database/          # Async Engine & Base metadata
│   │   ├── models/            # SQLAlchemy ORM Models (User, Resume, Job, Analysis, Interview, Roadmap)
│   │   ├── schemas/           # Pydantic Schemas
│   │   ├── services/          # DocumentParser, MatchingEngine, SkillAnalyzer, InterviewService, RoadmapGenerator
│   │   ├── ai/                # LLMProvider, Embeddings, Prompts, AIResumeService
│   │   ├── rag/               # FAISS VectorStore & RAGChain
│   │   └── main.py            # FastAPI Entrypoint
│   ├── tests/                 # Pytest Test Suite
│   ├── alembic/               # Database Migrations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/        # Sidebar, Navbar, ScoreGauge, LoadingSpinner
│   │   ├── pages/             # Dashboard, Resume, JobAnalysis, Match, Skills, Interview, Roadmap, Chat, Profile, Auth
│   │   ├── services/          # Axios API Client
│   │   ├── types/             # TypeScript Interfaces
│   │   ├── App.tsx
│   │   └── index.css          # Glassmorphism Design Tokens
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
# Backend Settings
PROJECT_NAME="AI Career Assistant"
API_V1_STR="/api/v1"
SECRET_KEY="super-secret-key-change-this-in-production-ai-career-assistant"

# Database
DATABASE_URL="postgresql+asyncpg://postgres:postgrespassword@localhost:5432/aicareerassistant"
# Fallback database URL for local development:
# DATABASE_URL="sqlite+aiosqlite:///./ai_career_assistant.db"

# LLM Provider Options: "mock", "openai", "gemini", "ollama"
LLM_PROVIDER="mock"
LLM_API_KEY=""
LLM_MODEL_NAME="gpt-4o-mini"

# Embeddings & Vector Store
EMBEDDING_MODEL_NAME="all-MiniLM-L6-v2"
VECTOR_STORE_PATH="./vector_store_data"

# CORS
BACKEND_CORS_ORIGINS='["http://localhost:3000","http://localhost:5173"]'
```

---

## Local Development Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations or table creation
uvicorn app.main:app --reload --port 8000
```
Access FastAPI Swagger Documentation at `http://localhost:8000/docs` and health endpoint at `http://localhost:8000/api/v1/health`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Access Web Application UI at `http://localhost:5173` or `http://localhost:3000`.

---

## Docker Setup

Run the multi-container stack (PostgreSQL, FastAPI Backend, React Frontend):

```bash
docker compose up --build -d
```

---

## Automated Testing

Execute unit and integration tests with Pytest (runs out-of-the-box with mocked LLM providers):

```bash
cd backend
python -m pytest tests/ -v
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
