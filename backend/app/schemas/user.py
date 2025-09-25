from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    CITIZEN = "citizen"
    FIELDWORKER = "fieldworker"
    STAFF = "staff"
    ADMIN = "admin"

# Base user schema


class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.CITIZEN
    avatar: Optional[str] = None

# User creation schema


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

# User update schema


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None

# User response schema


class UserResponse(UserBase):
    id: str
    points: int = 0
    badge_count: int = 0
    is_active: bool = True
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User with permissions


class UserWithPermissions(UserResponse):
    permissions: List[str] = []

# Login schemas


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[UserRole] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Password change


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)
