from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Forward references
from app.schemas.user import UserResponse
from app.schemas.issue import IssueResponse


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskStatus(str, Enum):
    NEW = "new"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

# Base task schema


class TaskBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    priority: TaskPriority = TaskPriority.MEDIUM
    latitude: float
    longitude: float
    address: str
    category: str
    images: List[str] = []
    due_date: datetime
    notes: Optional[str] = None

# Task creation schema


class TaskCreate(TaskBase):
    issue_id: str
    assignee_id: str

# Task update schema


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    images: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    completed_at: Optional[datetime] = None

# Task response schema


class TaskResponse(TaskBase):
    id: str
    status: TaskStatus
    assigned_at: datetime
    completed_at: Optional[datetime] = None
    issue_id: str
    assignee_id: str

    class Config:
        from_attributes = True

# Task with details


class TaskDetailResponse(TaskResponse):
    issue: Optional[IssueResponse] = None
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Task assignment


class TaskAssignmentRequest(BaseModel):
    assignee_id: str
    due_date: datetime
    priority: TaskPriority = TaskPriority.MEDIUM
