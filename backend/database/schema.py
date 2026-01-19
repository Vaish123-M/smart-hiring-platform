"""
MongoDB Database Collections Schema

This module defines the database schema for the Smart Hiring Platform.
All collections use MongoDB as the primary datastore.

Collections:
1. users - User accounts with authentication
2. resumes - Uploaded resumes with parsed data
3. job_descriptions - Job descriptions for matching
4. match_results - Resume-JD matching results
5. analytics_events - Event tracking for analytics
6. cover_letters - Generated cover letters

Indexes:
- users: email (unique), username (unique), created_at
- resumes: user_id, uploaded_at, ats_score
- job_descriptions: user_id, posted_at
- match_results: user_id, resume_id, jd_id, created_at
- analytics_events: user_id, event_type, timestamp
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection settings
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_hiring_platform")

# Global client instance
mongodb_client: AsyncIOMotorClient = None


async def connect_to_mongo():
    """Connect to MongoDB on startup."""
    global mongodb_client
    mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    print(f"✅ Connected to MongoDB at {MONGODB_URL}")


async def close_mongo_connection():
    """Close MongoDB connection on shutdown."""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        print("❌ Closed MongoDB connection")


def get_database():
    """Get database instance."""
    return mongodb_client[DATABASE_NAME]


async def create_indexes():
    """Create database indexes for performance."""
    db = get_database()
    
    # Users collection indexes
    await db.users.create_index([("email", ASCENDING)], unique=True)
    await db.users.create_index([("username", ASCENDING)], unique=True)
    await db.users.create_index([("created_at", DESCENDING)])
    
    # Resumes collection indexes
    await db.resumes.create_index([("user_id", ASCENDING)])
    await db.resumes.create_index([("uploaded_at", DESCENDING)])
    await db.resumes.create_index([("ats_score", DESCENDING)])
    await db.resumes.create_index([("is_deleted", ASCENDING)])
    
    # Job descriptions collection indexes
    await db.job_descriptions.create_index([("user_id", ASCENDING)])
    await db.job_descriptions.create_index([("posted_at", DESCENDING)])
    await db.job_descriptions.create_index([("company", ASCENDING)])
    
    # Match results collection indexes
    await db.match_results.create_index([("user_id", ASCENDING)])
    await db.match_results.create_index([("resume_id", ASCENDING)])
    await db.match_results.create_index([("jd_id", ASCENDING)])
    await db.match_results.create_index([("created_at", DESCENDING)])
    await db.match_results.create_index([("match_percentage", DESCENDING)])
    
    # Analytics events collection indexes
    await db.analytics_events.create_index([("user_id", ASCENDING)])
    await db.analytics_events.create_index([("event_type", ASCENDING)])
    await db.analytics_events.create_index([("timestamp", DESCENDING)])
    
    # Cover letters collection indexes
    await db.cover_letters.create_index([("user_id", ASCENDING)])
    await db.cover_letters.create_index([("resume_id", ASCENDING)])
    await db.cover_letters.create_index([("created_at", DESCENDING)])
    
    print("✅ Created database indexes")


# Sample data seeds (for development/testing)
SAMPLE_USERS = [
    {
        "email": "demo@smarthiring.com",
        "username": "demo_user",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5L1RfT.NDKV4G",  # "password123"
        "full_name": "Demo User",
        "is_active": True,
        "is_verified": True
    }
]


async def seed_database():
    """Seed database with sample data (development only)."""
    db = get_database()
    
    # Check if users exist
    user_count = await db.users.count_documents({})
    
    if user_count == 0:
        await db.users.insert_many(SAMPLE_USERS)
        print("✅ Seeded database with sample users")
    else:
        print("ℹ️  Database already seeded")
