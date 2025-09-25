from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.core.database import Base


class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    FIELDWORKER = "fieldworker"
    STAFF = "staff"
    ADMIN = "admin"


class IssueCategory(str, enum.Enum):
    POTHOLE = "pothole"
    STREETLIGHT = "streetlight"
    GARBAGE = "garbage"
    WATERLOGGING = "waterlogging"
    OTHER = "other"


class IssueStatus(str, enum.Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskStatus(str, enum.Enum):
    NEW = "new"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN, nullable=False)
    avatar = Column(String, nullable=True)
    points = Column(Integer, default=0)
    badge_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),
                        server_default=func.now(), onupdate=func.now())

    # Relationships
    reported_issues = relationship(
        "Issue", back_populates="reporter", foreign_keys="Issue.reporter_id")
    assigned_tasks = relationship(
        "Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    comments = relationship("Comment", back_populates="author")
    votes = relationship("Vote", back_populates="user")
    refresh_tokens = relationship("RefreshToken", back_populates="user")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(IssueCategory), nullable=False)
    urgency = Column(Integer, default=1)
    status = Column(Enum(IssueStatus), default=IssueStatus.PENDING)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=False)
    images = Column(String, default="[]")  # JSON array as string
    audio_note = Column(String, nullable=True)
    tracking_id = Column(String, unique=True, nullable=False)
    reported_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),
                        server_default=func.now(), onupdate=func.now())

    # Foreign Keys
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Relationships
    reporter = relationship(
        "User", back_populates="reported_issues", foreign_keys=[reporter_id])
    assignee = relationship("User", foreign_keys=[assignee_id])
    task = relationship("Task", back_populates="issue", uselist=False)
    comments = relationship("Comment", back_populates="issue")
    votes = relationship("Vote", back_populates="issue")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.NEW)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=False)
    category = Column(String, nullable=False)
    images = Column(String, default="[]")  # JSON array as string
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    # Foreign Keys
    issue_id = Column(String, ForeignKey("issues.id"),
                      unique=True, nullable=False)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    issue = relationship("Issue", back_populates="task")
    assignee = relationship(
        "User", back_populates="assigned_tasks", foreign_keys=[assignee_id])


class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    issue_id = Column(String, ForeignKey("issues.id"), nullable=False)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    issue = relationship("Issue", back_populates="comments")
    author = relationship("User", back_populates="comments")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    is_upvote = Column(Boolean, default=True)

    # Foreign Keys
    issue_id = Column(String, ForeignKey("issues.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    issue = relationship("Issue", back_populates="votes")
    user = relationship("User", back_populates="votes")

    __table_args__ = (
        {"schema": None},
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, index=True,
                default=lambda: str(uuid.uuid4()))
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign Keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")
