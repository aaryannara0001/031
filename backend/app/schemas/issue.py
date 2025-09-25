from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
import json

# Forward references
from app.schemas.user import UserResponse


class IssueCategory(str, Enum):
    POTHOLE = "pothole"
    STREETLIGHT = "streetlight"
    GARBAGE = "garbage"
    WATERLOGGING = "waterlogging"
    OTHER = "other"


class IssueStatus(str, Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

# Base issue schema


class IssueBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    category: IssueCategory
    urgency: int = Field(1, ge=1, le=5)
    latitude: float
    longitude: float
    address: str
    images: List[str] = []
    audio_note: Optional[str] = None

# Issue creation schema


class IssueCreate(IssueBase):
    pass

# Issue update schema


class IssueUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    category: Optional[IssueCategory] = None
    urgency: Optional[int] = Field(None, ge=1, le=5)
    status: Optional[IssueStatus] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    images: Optional[List[str]] = None
    audio_note: Optional[str] = None
    assignee_id: Optional[str] = None

# Issue response schema


class IssueResponse(IssueBase):
    id: str
    status: IssueStatus
    tracking_id: str
    reported_at: datetime
    updated_at: datetime
    reporter_id: str
    assignee_id: Optional[str] = None
    upvotes: int = 0
    downvotes: int = 0
    comments_count: int = 0

    class Config:
        from_attributes = True

    @field_validator('images', mode='before')
    @classmethod
    def parse_images(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

# Comment schemas


class CommentBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: str
    created_at: datetime
    author_id: str
    author_name: str

    class Config:
        from_attributes = True

# Issue with details


class IssueDetailResponse(IssueResponse):
    reporter: Optional[UserResponse] = None
    assignee: Optional[UserResponse] = None
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True

# Vote schema


class VoteRequest(BaseModel):
    is_upvote: bool = True


class VoteResponse(BaseModel):
    id: str
    is_upvote: bool
    user_id: str
    issue_id: str

    class Config:
        from_attributes = True
