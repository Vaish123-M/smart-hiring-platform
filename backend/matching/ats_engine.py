from typing import List, Set
import re

from matching.skills import TECH_SKILLS

# Minimal, explicit stopword list keeps noise words from skewing matches
STOPWORDS: Set[str] = {
    "the", "a", "an", "and", "or", "for", "of", "to", "in", "on", "with",
    "is", "are", "was", "were", "be", "being", "been", "at", "by", "from",
    "as", "that", "this", "it", "its", "if", "then", "but", "so", "we", "you",
    "your", "our", "their", "they", "i", "me", "my", "mine", "us"
}

# Normalize common aliases to canonical skill names present in TECH_SKILLS
ALIAS_MAP = {
    "fast api": "fastapi",
    "fast-api": "fastapi",
    "node js": "node.js",
    "nodejs": "node.js",
    "js": "javascript",
    "py": "python",
    "c sharp": "c#",
    "c-sharp": "c#",
    "c plus plus": "c++",
    "c++": "c++",
    "machine learning": "machine learning",
    "ml": "machine learning",
    "deep-learning": "deep learning",
    "data-science": "data science",
    "ci cd": "ci/cd",
    "ci-cd": "ci/cd",
}


def _normalize_aliases(text: str) -> str:
    normalized = text
    for alias, canonical in ALIAS_MAP.items():
        pattern = re.compile(r"\b" + re.escape(alias) + r"\b", re.IGNORECASE)
        normalized = pattern.sub(canonical, normalized)
    return normalized


def _preprocess(text: str) -> str:
    text = _normalize_aliases(text.lower())
    # Keep letters, numbers, plus, hash, dot, and spaces; drop other symbols
    text = re.sub(r"[^a-z0-9+#\.\s]", " ", text)
    tokens = [t for t in text.split() if t and t not in STOPWORDS]
    return " ".join(tokens)


def _extract_skills(clean_text: str) -> List[str]:
    found: Set[str] = set()
    for skill in TECH_SKILLS:
        # Convert multi-word skills to flexible whitespace matching
        pattern = r"\b" + re.escape(skill).replace(r"\ ", r"\s+") + r"\b"
        if re.search(pattern, clean_text, flags=re.IGNORECASE):
            found.add(skill)
    return sorted(found)


def calculate_ats_score(resume_text: str, job_description: str):
    # Shared preprocessing pipeline for resume and JD
    clean_resume = _preprocess(resume_text)
    clean_jd = _preprocess(job_description)

    resume_skills = set(_extract_skills(clean_resume))
    jd_skills = set(_extract_skills(clean_jd))

    matched_skills = sorted(resume_skills.intersection(jd_skills))
    missing_skills = sorted(jd_skills.difference(resume_skills))

    total_jd_skills = len(jd_skills)
    if total_jd_skills == 0:
        ats_score = 0
    else:
        ats_score = round((len(matched_skills) / total_jd_skills) * 100)

    return {
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "total_jd_skills": total_jd_skills,
    }
