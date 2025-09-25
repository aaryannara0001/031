import asyncio
import logging
import json
from app.core.database import async_session_maker, Base, engine
from app.models import User, Issue
from app.auth.security import get_password_hash
from app.core.config import settings
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_database():
    """Seed the database with initial data"""
    async with async_session_maker() as session:
        try:
            # Create tables if they don't exist
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            # Check if data already exists
            result = await session.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            if count > 0:
                logger.info("Database already seeded, skipping...")
                return

            logger.info("Seeding database...")

            # Create admin user
            admin = User(
                id="admin-001",
                email="admin@city.gov",
                password=get_password_hash("admin123"),
                name="System Administrator",
                role="admin",
                is_active=True
            )

            # Create staff user
            staff = User(
                id="staff-001",
                email="staff@city.gov",
                password=get_password_hash("staff123"),
                name="City Staff Member",
                role="staff",
                is_active=True
            )

            # Create fieldworker
            fieldworker = User(
                id="fieldworker-001",
                email="fieldworker@city.gov",
                password=get_password_hash("field123"),
                name="Field Worker",
                role="fieldworker",
                is_active=True
            )

            # Create citizen
            citizen = User(
                id="citizen-001",
                email="citizen@example.com",
                password=get_password_hash("citizen123"),
                name="John Citizen",
                role="citizen",
                points=1250,
                badge_count=3,
                is_active=True
            )

            session.add_all([admin, staff, fieldworker, citizen])

            # Create sample issues
            issues = [
                Issue(
                    id="issue-001",
                    title="Large pothole on Main Street",
                    description="Dangerous pothole causing vehicle damage near the intersection with Oak Avenue.",
                    category="pothole",
                    urgency=4,
                    status="assigned",
                    latitude=37.7749,
                    longitude=-122.4194,
                    address="123 Main Street, San Francisco, CA",
                    images=json.dumps(
                        ["https://images.pexels.com/photos/163016/highway-asphalt-space-sky-163016.jpeg?w=400"]),
                    tracking_id="TRK-2024-001",
                    reporter_id="citizen-001",
                    assignee_id="fieldworker-001"
                ),
                Issue(
                    id="issue-002",
                    title="Broken street light",
                    description="Street light has been flickering and now completely dark. Safety concern for pedestrians.",
                    category="streetlight",
                    urgency=3,
                    status="pending",
                    latitude=37.7849,
                    longitude=-122.4094,
                    address="456 Oak Avenue, San Francisco, CA",
                    images=json.dumps(
                        ["https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?w=400"]),
                    tracking_id="TRK-2024-002",
                    reporter_id="citizen-001"
                ),
                Issue(
                    id="issue-003",
                    title="Overflowing garbage bin",
                    description="Public trash bin is overflowing and attracting pests. Needs immediate attention.",
                    category="garbage",
                    urgency=2,
                    status="resolved",
                    latitude=37.7649,
                    longitude=-122.4294,
                    address="789 Pine Street, San Francisco, CA",
                    images=json.dumps(
                        ["https://images.pexels.com/photos/2827735/pexels-photo-2827735.jpeg?w=400"]),
                    tracking_id="TRK-2024-003",
                    reporter_id="citizen-001",
                    assignee_id="fieldworker-001"
                )
            ]

            session.add_all(issues)

            await session.commit()
            logger.info("Database seeded successfully!")

            print("\n" + "="*50)
            print("DATABASE SEEDED SUCCESSFULLY!")
            print("="*50)
            print("Default users created:")
            print("Admin: admin@city.gov / admin123")
            print("Staff: staff@city.gov / staff123")
            print("Fieldworker: fieldworker@city.gov / field123")
            print("Citizen: citizen@example.com / citizen123")
            print("="*50)

        except Exception as e:
            logger.error(f"Error seeding database: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(seed_database())
