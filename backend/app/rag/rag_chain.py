import json
import logging
from typing import List, Optional
from app.rag.vector_store import global_vector_store
from app.ai.llm_provider import get_llm_provider
from app.ai.prompts import CAREER_CHATBOT_PROMPT
from app.schemas.chat import ChatResponse, ContextSource

logger = logging.getLogger("ai_career_assistant")


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk.strip())
    return chunks


class RAGChain:
    @staticmethod
    def index_resume(user_id: str, resume_id: str, raw_text: str):
        chunks = chunk_text(raw_text)
        metadatas = [
            {"user_id": user_id, "resume_id": resume_id, "source_type": "resume"}
            for _ in chunks
        ]
        global_vector_store.add_texts(chunks, metadatas)

    @staticmethod
    def index_job_description(user_id: str, job_id: str, raw_text: str):
        chunks = chunk_text(raw_text)
        metadatas = [
            {"user_id": user_id, "job_id": job_id, "source_type": "job_description"}
            for _ in chunks
        ]
        global_vector_store.add_texts(chunks, metadatas)

    @classmethod
    async def ask_question(
        cls,
        user_id: str,
        question: str,
        resume_text: Optional[str] = None,
        job_text: Optional[str] = None
    ) -> ChatResponse:
        search_results = global_vector_store.similarity_search(
            query=question, top_k=4, filter_user_id=user_id
        )

        context_snippets = []
        context_sources = []

        for res in search_results:
            source_type = res["metadata"].get("source_type", "general")
            context_snippets.append(f"[{source_type.upper()}] {res['text']}")
            context_sources.append(
                ContextSource(
                    source_type=source_type,
                    content_snippet=res["text"][:200] + "...",
                    relevance_score=round(res["score"], 3)
                )
            )

        if not context_snippets:
            if resume_text:
                context_snippets.append(f"[RESUME] {resume_text[:1000]}")
                context_sources.append(ContextSource(source_type="resume", content_snippet=resume_text[:200], relevance_score=0.85))
            if job_text:
                context_snippets.append(f"[JOB] {job_text[:1000]}")
                context_sources.append(ContextSource(source_type="job_description", content_snippet=job_text[:200], relevance_score=0.85))

        formatted_context = "\n\n".join(context_snippets) if context_snippets else "No resume or job text uploaded yet."

        prompt = (
            CAREER_CHATBOT_PROMPT
            .replace("{context_chunks}", formatted_context)
            .replace("{user_question}", question)
        )

        llm = get_llm_provider()
        llm_response = await llm.generate(prompt)

        try:
            parsed = json.loads(llm_response)
            answer_text = parsed.get("answer", llm_response)
        except Exception:
            answer_text = llm_response

        return ChatResponse(
            answer=answer_text,
            context_sources=context_sources
        )
