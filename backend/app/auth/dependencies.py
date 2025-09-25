from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import logging

from app.core.database import get_db
from app.models import User
from app.auth.security import verify_token
from app.schemas.user import UserRole

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise credentials_exception

    if payload.get("type") != "access":
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # Get user from database
    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise credentials_exception

    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_user_with_role(required_role: UserRole):
    """Factory function to create role-based dependency"""
    async def current_user_with_role(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' not authorized for this action"
            )
        return current_user
    return current_user_with_role


def get_current_user_with_any_role(*required_roles: UserRole):
    """Factory function to create multi-role dependency"""
    async def current_user_with_any_role(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' not authorized for this action"
            )
        return current_user
    return current_user_with_any_role


# Pre-defined role dependencies
get_admin_user = get_current_user_with_role(UserRole.ADMIN)
get_staff_user = get_current_user_with_role(UserRole.STAFF)
get_fieldworker_user = get_current_user_with_role(UserRole.FIELDWORKER)
get_citizen_user = get_current_user_with_role(UserRole.CITIZEN)

# Multi-role dependencies
get_staff_or_admin = get_current_user_with_any_role(
    UserRole.STAFF, UserRole.ADMIN)
get_fieldworker_or_staff_or_admin = get_current_user_with_any_role(
    UserRole.FIELDWORKER, UserRole.STAFF, UserRole.ADMIN
)
