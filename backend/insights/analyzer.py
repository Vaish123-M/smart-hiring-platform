import re
from typing import List, Dict, Tuple
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Role profiles with typical skills and experience
ROLE_PROFILES = {
    "Junior Software Developer": {
        "skills": ["python", "javascript", "git", "html", "css", "rest api", "sql", "debugging"],
        "experience_years": (0, 2),
        "keywords": ["entry-level", "fresh", "graduate", "internship"]
    },
    "Mid-Level Backend Developer": {
        "skills": ["python", "fastapi", "django", "postgresql", "mongodb", "docker", "microservices", "testing"],
        "experience_years": (2, 5),
        "keywords": ["backend", "server", "api design", "scalability"]
    },
    "Senior Backend Developer": {
        "skills": ["python", "fastapi", "django", "postgresql", "mongodb", "docker", "kubernetes", "aws", "system design", "leadership"],
        "experience_years": (5, 15),
        "keywords": ["architect", "lead", "technical lead", "senior", "mentoring"]
    },
    "Full Stack Developer": {
        "skills": ["javascript", "react", "python", "fastapi", "postgresql", "mongodb", "docker", "html", "css"],
        "experience_years": (2, 10),
        "keywords": ["full stack", "frontend", "backend"]
    },
    "Frontend Developer": {
        "skills": ["javascript", "react", "html", "css", "typescript", "responsive design", "ui/ux"],
        "experience_years": (1, 8),
        "keywords": ["ui", "frontend", "react", "javascript"]
    },
    "DevOps Engineer": {
        "skills": ["docker", "kubernetes", "aws", "ci/cd", "jenkins", "terraform", "linux", "monitoring"],
        "experience_years": (2, 10),
        "keywords": ["devops", "infrastructure", "deployment", "cloud"]
    },
    "Data Engineer": {
        "skills": ["python", "sql", "spark", "hadoop", "etl", "postgresql", "mongodb", "airflow"],
        "experience_years": (2, 10),
        "keywords": ["data", "pipeline", "etl", "big data"]
    },
    "Machine Learning Engineer": {
        "skills": ["python", "tensorflow", "pytorch", "scikit-learn", "numpy", "pandas", "sql", "statistics"],
        "experience_years": (2, 10),
        "keywords": ["machine learning", "ml", "ai", "deep learning"]
    }
}

# Career progression paths
CAREER_PATHS = {
    "Backend Developer": [
        ("Senior Backend Developer", ["system design", "kubernetes", "mentoring"]),
        ("DevOps Engineer", ["docker", "kubernetes", "aws"]),
        ("Technical Lead", ["leadership", "architecture", "communication"])
    ],
    "Frontend Developer": [
        ("Senior Frontend Developer", ["typescript", "performance", "accessibility"]),
        ("Full Stack Developer", ["backend frameworks", "databases"]),
        ("Tech Lead", ["leadership", "mentoring"])
    ],
    "Data Engineer": [
        ("Senior Data Engineer", ["architecture", "optimization", "leadership"]),
        ("ML Engineer", ["machine learning", "statistics"]),
        ("Data Science", ["statistics", "business analysis"])
    ]
}

# Technical keywords by category
TECHNICAL_KEYWORDS = {
    "languages": ["python", "javascript", "java", "go", "rust", "typescript", "c++", "sql"],
    "frameworks": ["fastapi", "django", "react", "vue", "spring", "express", "flask"],
    "tools": ["docker", "kubernetes", "jenkins", "git", "github", "gitlab", "linux"],
    "databases": ["postgresql", "mongodb", "mysql", "redis", "elasticsearch"],
    "cloud": ["aws", "azure", "gcp", "heroku", "digitalocean"],
    "soft_skills": ["communication", "leadership", "teamwork", "problem-solving", "mentoring"]
}


def extract_keywords_by_category(text: str) -> Dict[str, List[str]]:
    """Extract keywords from text and categorize them."""
    text_lower = text.lower()
    found_keywords = {}
    
    for category, keywords in TECHNICAL_KEYWORDS.items():
        found_keywords[category] = []
        for keyword in keywords:
            if keyword in text_lower:
                found_keywords[category].append(keyword)
    
    return found_keywords


def analyze_keyword_gaps(resume_text: str, job_description: str) -> Tuple[List[Dict], float, List[str], List[str]]:
    """Analyze gaps between resume and job description."""
    resume_keywords = extract_keywords_by_category(resume_text)
    jd_keywords = extract_keywords_by_category(job_description)
    
    # Count keyword frequencies in JD
    jd_text_lower = job_description.lower()
    keyword_frequency = {}
    all_keywords = []
    
    for category, keywords in jd_keywords.items():
        for keyword in keywords:
            count = len(re.findall(r'\b' + keyword + r'\b', jd_text_lower))
            keyword_frequency[keyword] = (category, count)
            all_keywords.append(keyword)
    
    # Resume keywords
    resume_all_keywords = []
    for keywords in resume_keywords.values():
        resume_all_keywords.extend(keywords)
    
    # Find missing keywords
    missing_keywords = []
    for keyword, (category, freq) in keyword_frequency.items():
        if keyword not in resume_all_keywords:
            importance = min(freq / max(len(all_keywords), 1), 1.0)
            missing_keywords.append({
                "keyword": keyword,
                "category": category,
                "importance": importance,
                "frequency_in_jd": freq
            })
    
    # Sort by importance
    missing_keywords.sort(key=lambda x: x["importance"], reverse=True)
    
    # Calculate gap score (0-100)
    if len(all_keywords) > 0:
        gap_percentage = (len(missing_keywords) / len(all_keywords)) * 100
        gap_score = 100 - min(gap_percentage, 100)
    else:
        gap_score = 50
    
    # Critical gaps (high frequency and missing)
    critical_gaps = [kw["keyword"] for kw in missing_keywords[:5] if kw["importance"] > 0.3]
    
    # Recommendations
    recommendations = [
        f"Add expertise in {keyword}" 
        for keyword in critical_gaps
    ]
    if len(missing_keywords) > 3:
        recommendations.append(f"Consider gaining experience in {len(missing_keywords)} technical areas mentioned in the job description")
    recommendations.append("Emphasize existing skills that overlap with job requirements")
    
    return missing_keywords, gap_score, critical_gaps, recommendations


def match_job_roles(resume_text: str, skills_extracted: List[str] = None) -> Tuple[List[Dict], str, float]:
    """Match resume to job roles based on skills and experience."""
    if skills_extracted is None:
        skills_extracted = []
    
    resume_lower = resume_text.lower()
    resume_keywords = extract_keywords_by_category(resume_text)
    all_resume_skills = [s.lower() for s in skills_extracted]
    for keywords in resume_keywords.values():
        all_resume_skills.extend(keywords)
    
    # Extract experience years
    experience_pattern = r'(\d+)\s+years?|(\d+)\s+yrs?'
    years_matches = re.findall(experience_pattern, resume_lower)
    total_experience = sum(int(match[0] or match[1]) for match in years_matches) if years_matches else 0
    
    # Calculate role matches
    role_scores = []
    for role_name, role_profile in ROLE_PROFILES.items():
        profile_skills = [s.lower() for s in role_profile["skills"]]
        matched_skills = [s for s in all_resume_skills if s in profile_skills]
        skill_overlap = len(matched_skills) / len(profile_skills) if profile_skills else 0
        
        # Check experience range
        exp_min, exp_max = role_profile["experience_years"]
        experience_match = 1.0 if exp_min <= total_experience <= exp_max else 0.5
        
        # Check keywords
        keywords_found = sum(1 for kw in role_profile["keywords"] if kw in resume_lower)
        keyword_bonus = min(keywords_found * 0.1, 0.2)
        
        match_score = (skill_overlap * 0.6 + experience_match * 0.3 + keyword_bonus * 0.1) * 100
        
        role_scores.append({
            "title": role_name,
            "match_score": match_score,
            "required_skills": profile_skills[:8],
            "your_skills": matched_skills[:8],
            "skill_overlap": skill_overlap
        })
    
    # Sort by match score
    role_scores.sort(key=lambda x: x["match_score"], reverse=True)
    top_roles = role_scores[:5]
    
    # Determine current level
    if total_experience < 2:
        current_level = "junior"
    elif total_experience < 5:
        current_level = "mid-level"
    else:
        current_level = "senior"
    
    # Confidence based on top match score
    confidence = min(top_roles[0]["match_score"] / 100, 1.0) if top_roles else 0.3
    
    return top_roles, current_level, confidence


def suggest_career_paths(resume_text: str, skills_extracted: List[str] = None, experience_years: float = None) -> Tuple[str, List[Dict], List[str]]:
    """Suggest career progression paths."""
    if skills_extracted is None:
        skills_extracted = []
    
    # Get current role match
    top_roles, current_level, _ = match_job_roles(resume_text, skills_extracted)
    current_trajectory = top_roles[0]["title"] if top_roles else "Software Developer"
    
    # Extract experience if not provided
    if experience_years is None:
        resume_lower = resume_text.lower()
        years_pattern = r'(\d+)\s+years?|(\d+)\s+yrs?'
        matches = re.findall(years_pattern, resume_lower)
        experience_years = sum(int(m[0] or m[1]) for m in matches) if matches else 1
    
    # Get career paths for current role
    recommended_paths = []
    
    # Find relevant career progressions
    for base_role, progressions in CAREER_PATHS.items():
        if base_role.lower() in current_trajectory.lower():
            for next_role, required_skills in progressions:
                path_info = {
                    "current_role": current_trajectory,
                    "next_role": next_role,
                    "skill_gaps": required_skills,
                    "experience_needed": f"{int(experience_years + 2)}-{int(experience_years + 4)} years",
                    "learning_resources": [
                        {"name": f"Learn {skill}", "url": f"https://learn.microsoft.com", "type": "course"}
                        for skill in required_skills[:3]
                    ]
                }
                recommended_paths.append(path_info)
    
    # If no specific paths found, suggest generic progressions
    if not recommended_paths:
        recommended_paths = [
            {
                "current_role": current_trajectory,
                "next_role": "Senior " + current_trajectory,
                "skill_gaps": ["leadership", "system design", "mentoring"],
                "experience_needed": f"{int(experience_years + 3)}-{int(experience_years + 5)} years",
                "learning_resources": [
                    {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer", "type": "resource"},
                    {"name": "Leadership Fundamentals", "url": "https://www.coursera.org", "type": "course"}
                ]
            }
        ]
    
    # Skill development plan
    all_missing_skills = []
    for path in recommended_paths:
        all_missing_skills.extend(path["skill_gaps"])
    
    skill_development_plan = []
    seen = set()
    for skill in all_missing_skills:
        if skill not in seen:
            skill_development_plan.append(f"Develop {skill} capability")
            seen.add(skill)
    
    return current_trajectory, recommended_paths[:3], skill_development_plan[:5]
