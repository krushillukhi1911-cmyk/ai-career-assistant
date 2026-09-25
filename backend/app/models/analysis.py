import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy import String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    resume_id: Mapped[str] = mapped_column(String(36), ForeignKey("resumes.id"), nullable=False)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("job_descriptions.id"), nullable=False)
    compatibility_score: Mapped[float] = mapped_column(Float, nullable=False)
    analysis_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job = relationship("JobDescription", back_populates="analyses")
