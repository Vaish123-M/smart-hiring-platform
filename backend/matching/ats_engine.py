from matching.skills import TECH_SKILLS

def calculate_ats_score(resume_text: str, job_description: str):
    resume_text = resume_text.lower()
    job_description = job_description.lower()

    matched_skills = []
    score = 0

    # Skill Matching (70%)
    for skill in TECH_SKILLS:
        if skill in resume_text and skill in job_description:
            matched_skills.append(skill)

    skill_score = (len(matched_skills) / len(TECH_SKILLS)) * 70

    # Keyword Density (20%)
    jd_keywords = set(job_description.split())
    resume_words = resume_text.split()
    keyword_matches = jd_keywords.intersection(resume_words)
    keyword_score = (len(keyword_matches) / max(len(jd_keywords), 1)) * 20

    # Formatting Signals (10%)
    format_score = 10 if len(resume_words) > 300 else 5

    final_score = round(skill_score + keyword_score + format_score, 2)

    return {
        "ats_score": final_score,
        "matched_skills": matched_skills
    }
