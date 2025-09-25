from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from typing import List, Optional
import logging
import uuid

from app.core.database import get_db
from app.models import Task, User, Issue
from app.schemas.task import (
    TaskResponse,
    TaskCreate,
    TaskUpdate,
    TaskDetailResponse,
    TaskAssignmentRequest
)
from app.auth.dependencies import (
    get_current_active_user,
    get_staff_or_admin,
    get_fieldworker_or_staff_or_admin
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Create a new task (staff and admin only)"""
    # Check if issue exists
    issue = await db.get(Issue, task_data.issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check if task already exists for this issue
    existing_task = await db.execute(
        select(Task).where(Task.issue_id == task_data.issue_id)
    )
    if existing_task.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task already exists for this issue"
        )

    # Check if assignee exists and is a fieldworker
    assignee = await db.get(User, task_data.assignee_id)
    if not assignee or assignee.role.value != "fieldworker":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid assignee - must be a fieldworker"
        )

    # Create task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        latitude=task_data.latitude,
        longitude=task_data.longitude,
        address=task_data.address,
        category=task_data.category,
        images=task_data.images,
        due_date=task_data.due_date,
        issue_id=task_data.issue_id,
        assignee_id=task_data.assignee_id
    )

    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Update issue status to assigned
    issue.status = "assigned"
    issue.assignee_id = task_data.assignee_id
    await db.commit()

    logger.info(f"Task created: {task.title} assigned to {assignee.email}")

    return TaskResponse.from_orm(task)


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to_me: bool = False,
    current_user: User = Depends(get_fieldworker_or_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get list of tasks with filtering"""
    query = select(Task)

    # Apply filters
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)

    # Role-based filtering
    if current_user.role.value == "fieldworker":
        # Fieldworkers can only see their assigned tasks
        query = query.where(Task.assignee_id == current_user.id)
    elif assigned_to_me:
        # Show only tasks assigned to current user
        query = query.where(Task.assignee_id == current_user.id)

    # Order by due date (urgent first) then creation date
    query = query.order_by(Task.due_date, desc(
        Task.assigned_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return [TaskResponse.from_orm(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskDetailResponse)
async def get_task_detail(
    task_id: str,
    current_user: User = Depends(get_fieldworker_or_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed task information"""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check permissions
    if (current_user.role.value == "fieldworker" and
            task.assignee_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this task"
        )

    return TaskDetailResponse.from_orm(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_fieldworker_or_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update task"""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check permissions
    if (current_user.role.value == "fieldworker" and
            task.assignee_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Fieldworkers can only update status and notes
    if current_user.role.value == "fieldworker":
        allowed_fields = {"status", "notes", "completed_at"}
        update_data = task_update.dict(exclude_unset=True)
        for field in update_data:
            if field not in allowed_fields:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Field '{field}' cannot be updated by fieldworkers"
                )

    # Update fields
    for field, value in task_update.dict(exclude_unset=True).items():
        if hasattr(task, field):
            setattr(task, field, value)

    # If task is completed, update completed_at
    if task_update.status == "completed" and not task.completed_at:
        from datetime import datetime, timezone
        task.completed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(task)

    # Update issue status if task is completed
    if task_update.status == "completed":
        issue = await db.get(Issue, task.issue_id)
        if issue:
            issue.status = "resolved"
            await db.commit()

    logger.info(f"Task updated: {task.title} - status: {task.status}")

    return TaskResponse.from_orm(task)


@router.post("/{task_id}/assign", response_model=TaskResponse)
async def assign_task(
    task_id: str,
    assignment_data: TaskAssignmentRequest,
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Reassign task to different fieldworker (staff and admin only)"""
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check if new assignee exists and is a fieldworker
    assignee = await db.get(User, assignment_data.assignee_id)
    if not assignee or assignee.role.value != "fieldworker":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid assignee - must be a fieldworker"
        )

    # Update task
    task.assignee_id = assignment_data.assignee_id
    task.due_date = assignment_data.due_date
    task.priority = assignment_data.priority
    task.status = "new"  # Reset status when reassigned

    await db.commit()
    await db.refresh(task)

    # Update issue assignee
    issue = await db.get(Issue, task.issue_id)
    if issue:
        issue.assignee_id = assignment_data.assignee_id
        await db.commit()

    logger.info(f"Task reassigned: {task.title} to {assignee.email}")

    return TaskResponse.from_orm(task)


@router.get("/stats/overview")
async def get_task_stats(
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get task statistics overview (staff and admin only)"""
    # Count by status
    status_counts = await db.execute(
        select(Task.status, func.count(Task.id))
        .group_by(Task.status)
    )
    status_stats = {status.value: count for status, count in status_counts}

    # Count by priority
    priority_counts = await db.execute(
        select(Task.priority, func.count(Task.id))
        .group_by(Task.priority)
    )
    priority_stats = {priority.value: count for priority,
                      count in priority_counts}

    # Overdue tasks
    from datetime import datetime, timezone
    overdue_count = await db.execute(
        select(func.count(Task.id))
        .where(and_(Task.due_date < datetime.now(timezone.utc), Task.status != "completed"))
    )

    return {
        "total_tasks": sum(status_stats.values()),
        "status_breakdown": status_stats,
        "priority_breakdown": priority_stats,
        "overdue_tasks": overdue_count.scalar()
    }
