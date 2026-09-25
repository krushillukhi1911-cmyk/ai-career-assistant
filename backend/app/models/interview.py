import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    job_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("job_descriptions.id"), nullable=True)
    role_title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="in_progress")  # in_progress, completed
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    transcript: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    feedback: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="interviews")
    job = relationship("JobDescription", back_populates="interviews")
