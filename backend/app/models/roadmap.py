import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy import String, JSON, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    target_role: Mapped[str] = mapped_column(String(255), nullable=False)
    roadmap_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="roadmaps")
