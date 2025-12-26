# Data aggregation logic
from database.mongo import resume_collection
from matching.skills import TECH_SKILLS

def get_top_skills():
    skill_count = {skill: 0 for skill in TECH_SKILLS}

    resumes = resume_collection.find()
    for resume in resumes:
        text = resume.get("cleaned_text", "")
        for skill in TECH_SKILLS:
            if skill in text:
                skill_count[skill] += 1

    return skill_count


def get_match_distribution():
    # Temporary mock (will be dynamic in Phase 7 integration)
    return {
        "0-20": 2,
        "21-40": 5,
        "41-60": 8,
        "61-80": 3,
        "81-100": 1
    }
