from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_, or_
from typing import List, Optional
import uuid
import os
import logging
import json

from app.core.database import get_db
from app.core.config import settings
from app.models import Issue, User, Comment, Vote
from app.schemas.issue import (
    IssueResponse,
    IssueCreate,
    IssueUpdate,
    IssueDetailResponse,
    CommentCreate,
    CommentResponse,
    VoteRequest
)
from app.auth.dependencies import (
    get_current_active_user,
    get_staff_or_admin,
    get_fieldworker_or_staff_or_admin
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=IssueResponse)
async def create_issue(
    issue_data: IssueCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new issue report"""
    # Generate tracking ID
    tracking_id = f"TRK-{uuid.uuid4().hex[:8].upper()}"

    # Create issue
    issue = Issue(
        title=issue_data.title,
        description=issue_data.description,
        category=issue_data.category,
        urgency=issue_data.urgency,
        latitude=issue_data.latitude,
        longitude=issue_data.longitude,
        address=issue_data.address,
        images=json.dumps(issue_data.images),  # Convert list to JSON string
        audio_note=issue_data.audio_note,
        tracking_id=tracking_id,
        reporter_id=current_user.id
    )

    db.add(issue)
    await db.commit()
    await db.refresh(issue)

    logger.info(f"Issue created: {tracking_id} by {current_user.email}")

    return IssueResponse.from_orm(issue)


@router.get("/", response_model=List[IssueResponse])
async def get_issues(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    urgency: Optional[int] = None,
    assigned_to_me: bool = False,
    reported_by_me: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get list of issues with filtering"""
    query = select(Issue)

    # Apply filters
    if category:
        query = query.where(Issue.category == category)
    if status:
        query = query.where(Issue.status == status)
    if urgency:
        query = query.where(Issue.urgency == urgency)

    # Role-based filtering
    if current_user.role.value == "citizen":
        # Citizens can only see their own issues
        query = query.where(Issue.reporter_id == current_user.id)
    elif assigned_to_me:
        # Show only issues assigned to current user
        query = query.where(Issue.assignee_id == current_user.id)
    elif reported_by_me:
        # Show only issues reported by current user
        query = query.where(Issue.reporter_id == current_user.id)

    # Order by creation date (newest first)
    query = query.order_by(desc(Issue.reported_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    issues = result.scalars().all()

    return [IssueResponse.from_orm(issue) for issue in issues]


@router.get("/{issue_id}", response_model=IssueDetailResponse)
async def get_issue_detail(
    issue_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed issue information"""
    issue = await db.get(Issue, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check permissions
    if (current_user.role.value == "citizen" and
            issue.reporter_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this issue"
        )

    # Get comments count
    comments_count = await db.execute(
        select(func.count(Comment.id)).where(Comment.issue_id == issue_id)
    )
    issue.comments_count = comments_count.scalar()

    return IssueDetailResponse.from_orm(issue)


@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: str,
    issue_update: IssueUpdate,
    current_user: User = Depends(get_fieldworker_or_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update issue (fieldworkers, staff, admin only)"""
    issue = await db.get(Issue, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check permissions for assignment
    if issue_update.assignee_id and current_user.role.value not in ["staff", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to assign issues"
        )

    # Update fields
    for field, value in issue_update.dict(exclude_unset=True).items():
        if hasattr(issue, field):
            if field == "images" and isinstance(value, list):
                # Convert list to JSON string
                setattr(issue, field, json.dumps(value))
            else:
                setattr(issue, field, value)

    await db.commit()
    await db.refresh(issue)

    logger.info(f"Issue updated: {issue.tracking_id}")

    return IssueResponse.from_orm(issue)


@router.post("/{issue_id}/comments", response_model=CommentResponse)
async def add_comment(
    issue_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add comment to issue"""
    issue = await db.get(Issue, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check permissions
    if (current_user.role.value == "citizen" and
        issue.reporter_id != current_user.id and
            issue.assignee_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to comment on this issue"
        )

    comment = Comment(
        text=comment_data.text,
        issue_id=issue_id,
        author_id=current_user.id
    )

    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    # Create response with author name
    response = CommentResponse.from_orm(comment)
    response.author_name = current_user.name

    return response


@router.get("/{issue_id}/comments", response_model=List[CommentResponse])
async def get_issue_comments(
    issue_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for an issue"""
    issue = await db.get(Issue, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check permissions
    if (current_user.role.value == "citizen" and
        issue.reporter_id != current_user.id and
            issue.assignee_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view comments for this issue"
        )

    query = select(Comment, User.name).join(
        User).where(Comment.issue_id == issue_id)
    query = query.order_by(Comment.created_at)

    result = await db.execute(query)
    comments = result.all()

    response_comments = []
    for comment, author_name in comments:
        comment_response = CommentResponse.from_orm(comment)
        comment_response.author_name = author_name
        response_comments.append(comment_response)

    return response_comments


@router.post("/{issue_id}/vote")
async def vote_issue(
    issue_id: str,
    vote_data: VoteRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Vote on an issue (upvote/downvote)"""
    issue = await db.get(Issue, issue_id)
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )

    # Check if user already voted
    existing_vote = await db.execute(
        select(Vote).where(
            and_(Vote.issue_id == issue_id, Vote.user_id == current_user.id)
        )
    )
    vote = existing_vote.scalar_one_or_none()

    if vote:
        # Update existing vote
        vote.is_upvote = vote_data.is_upvote
    else:
        # Create new vote
        vote = Vote(
            issue_id=issue_id,
            user_id=current_user.id,
            is_upvote=vote_data.is_upvote
        )
        db.add(vote)

    await db.commit()

    # Update issue vote counts
    upvotes = await db.execute(
        select(func.count(Vote.id)).where(
            and_(Vote.issue_id == issue_id, Vote.is_upvote == True)
        )
    )
    downvotes = await db.execute(
        select(func.count(Vote.id)).where(
            and_(Vote.issue_id == issue_id, Vote.is_upvote == False)
        )
    )

    issue.upvotes = upvotes.scalar()
    issue.downvotes = downvotes.scalar()
    await db.commit()

    return {"message": "Vote recorded successfully"}


@router.get("/stats/overview")
async def get_issue_stats(
    current_user: User = Depends(get_staff_or_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get issue statistics overview (staff and admin only)"""
    # Count by status
    status_counts = await db.execute(
        select(Issue.status, func.count(Issue.id))
        .group_by(Issue.status)
    )
    status_stats = {status.value: count for status, count in status_counts}

    # Count by category
    category_counts = await db.execute(
        select(Issue.category, func.count(Issue.id))
        .group_by(Issue.category)
    )
    category_stats = {category.value: count for category,
                      count in category_counts}

    # Average resolution time (for resolved issues)
    resolved_issues = await db.execute(
        select(func.avg(func.extract('epoch', Issue.updated_at - Issue.reported_at)))
        .where(Issue.status == "resolved")
    )
    avg_resolution_time = resolved_issues.scalar()

    return {
        "total_issues": sum(status_stats.values()),
        "status_breakdown": status_stats,
        "category_breakdown": category_stats,
        "avg_resolution_hours": avg_resolution_time / 3600 if avg_resolution_time else None
    }
