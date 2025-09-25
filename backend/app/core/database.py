from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings
import logging
import os

logger = logging.getLogger(__name__)

# Ensure database directory exists
db_path = "/Users/aaryannara/Downloads/project/backend/citizen_engagement.db"
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Create async engine for SQLite
engine = create_async_engine(
    f"sqlite+aiosqlite:///{db_path}",
    echo=settings.ENVIRONMENT == "development",
    connect_args={"check_same_thread": False}
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """Create all database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise
