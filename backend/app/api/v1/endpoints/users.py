from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import logging

from app.core.database import get_db
from app.models import User
from app.schemas.user import UserResponse, UserUpdate, UserWithPermissions
from app.auth.dependencies import (
    get_current_active_user,
    get_admin_user,
    get_staff_or_admin
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Role-based permissions mapping
ROLE_PERMISSIONS = {
    "citizen": [
        "report_issues",
        "view_own_reports",
        "vote_issues",
        "view_community",
    ],
    "fieldworker": [
        "view_assigned_tasks",
        "update_task_status",
        "view_fieldworker_dashboard",
        "report_field_updates",
    ],
    "staff": [
        "assign_tasks",
        "view_department_reports",
        "manage_team",
        "view_analytics",
        "moderate_content",
    ],
    "admin": [
        "manage_users",
        "system_configuration",
        "view_all_analytics",
        "manage_policies",
        "system_admin",
    ],
}


@router.get("/me", response_model=UserWithPermissions)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user profile with permissions"""
    permissions = ROLE_PERMISSIONS.get(current_user.role.value, [])
    user_response = UserWithPermissions.from_orm(current_user)
    user_response.permissions = permissions
    return user_response


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""
    # Update fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    logger.info(f"User profile updated: {current_user.email}")

    return UserResponse.from_orm(current_user)


@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get list of users (staff and admin only)"""
    query = select(User)

    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    return [UserResponse.from_orm(user) for user in users]


@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get user statistics (staff and admin only)"""
    # Count users by role
    role_counts = await db.execute(
        select(User.role, func.count(User.id))
        .group_by(User.role)
    )
    role_stats = {role.value: count for role, count in role_counts}

    # Total active users
    active_count = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    total_active = active_count.scalar()

    return {
        "total_users": sum(role_stats.values()),
        "active_users": total_active,
        "role_breakdown": role_stats
    }


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID (staff and admin only)"""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse.from_orm(user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user (admin only)"""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update fields
    for field, value in user_update.dict(exclude_unset=True).items():
        if hasattr(user, field):
            setattr(user, field, value)

    await db.commit()
    await db.refresh(user)

    logger.info(f"User updated by admin: {user.email}")

    return UserResponse.from_orm(user)


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user (admin only)"""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Soft delete by deactivating
    user.is_active = False
    await db.commit()

    logger.info(f"User deactivated by admin: {user.email}")

    return {"message": "User deactivated successfully"}
