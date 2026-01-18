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


def extract_skills_from_text(text):
    """Extract skills from a given text"""
    skill_count = {skill: 0 for skill in TECH_SKILLS}
    
    # Convert text to lowercase for matching
    text_lower = text.lower()
    
    # Count occurrences of each skill
    for skill in TECH_SKILLS:
        skill_lower = skill.lower()
        count = text_lower.count(skill_lower)
        if count > 0:
            skill_count[skill_lower] = count
    
    # Filter out skills with 0 count
    skill_count = {k: v for k, v in skill_count.items() if v > 0}
    
    return skill_count if skill_count else {"no_skills": "No recognized skills found"}


def get_match_distribution():
    # Temporary mock (will be dynamic in Phase 7 integration)
    return {
        "0-20": 2,
        "21-40": 5,
        "41-60": 8,
        "61-80": 3,
        "81-100": 1
    }
