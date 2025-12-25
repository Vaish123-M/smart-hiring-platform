# Smart Hiring & Talent Intelligence Platform

An AI-powered hiring platform that performs ATS resume scanning,
JD–Resume matching, hiring analytics, and secure cloud deployment.

## Tech Stack
- Backend: FastAPI (Python)
- Frontend: React + Tailwind
- Database: PostgreSQL + MongoDB
- AI/NLP: TF-IDF, Cosine Similarity
- DevOps: Docker, GitHub Actions, AWS

## Status
🚧 In active development (Final-Year Level Project)

## Backend Quick Start (Windows)

1. Create and activate a virtual environment:

```
python -m venv venv
./venv/Scripts/Activate.ps1
```

2. Install backend dependencies:

```
pip install -r backend/requirements.txt
```

3. Run the API server:

```
cd backend
uvicorn main:app --reload
```

The API will be available at http://127.0.0.1:8000.
