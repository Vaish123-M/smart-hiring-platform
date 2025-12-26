from fastapi import APIRouter
from collections import Counter
from pydantic import BaseModel
from database.mongo import resume_collection

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ------------------ SCHEMAS ------------------

class SkillAnalytics(BaseModel):
    skill_counts: dict


# ------------------ ROUTES ------------------

@router.get("/top-skills", response_model=SkillAnalytics)
def get_top_skills():
    resumes = resume_collection.find({})
    skill_counter = Counter()

    for resume in resumes:
        # SAFE access (prevents 500 error)
        text = resume.get("cleaned_text") or resume.get("resume_text") or ""

        words = text.lower().split()
        skill_counter.update(words)

    top_skills = dict(skill_counter.most_common(20))
    return {"skill_counts": top_skills}
