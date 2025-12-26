from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

MONGO_URL = "mongodb://localhost:27017"

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connected successfully")
    mongo_db = client["smart_hiring"]
    resume_collection = mongo_db["resumes"]
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print("❌ WARNING: MongoDB is not running!")
    print(f"   Error: {e}")
    print("   Please start MongoDB with: mongod")
    print("   Or install MongoDB from: https://www.mongodb.com/try/download/community")
    # Create dummy collections to prevent import errors
    client = None
    mongo_db = None
    resume_collection = None
