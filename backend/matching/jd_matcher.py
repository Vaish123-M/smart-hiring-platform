from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import io
from typing import List, Dict
import pdfplumber
from docx import Document
from .skills import TECH_SKILLS

BOOST_KEYWORDS = [
    "python", "docker", "aws", "fastapi", "backend"
]

def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9 ]", " ", text)
    return text

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from text by matching against known skill list"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in TECH_SKILLS:
        # Use word boundaries to match whole words
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    
    return list(set(found_skills))

def extract_experience_years(text: str) -> int:
    """Extract years of experience from text"""
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?experience'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0

def generate_recommendations(missing_skills: List[str], matched_skills: List[str]) -> List[str]:
    """Generate actionable recommendations based on skill gaps"""
    recommendations = []
    
    if len(missing_skills) > 0:
        priority_skills = missing_skills[:5]  # Top 5 missing skills
        recommendations.append(f"Focus on learning these priority skills: {', '.join(priority_skills)}")
    
    if len(matched_skills) < 5:
        recommendations.append("Expand your skill set to include more technologies mentioned in the job description")
    
    # Skill category analysis
    frontend_skills = ["react", "angular", "vue", "html", "css", "javascript"]
    backend_skills = ["python", "java", "node.js", "fastapi", "django", "spring boot"]
    
    has_frontend = any(skill in matched_skills for skill in frontend_skills)
    has_backend = any(skill in matched_skills for skill in backend_skills)
    
    missing_frontend = [s for s in missing_skills if s in frontend_skills]
    missing_backend = [s for s in missing_skills if s in backend_skills]
    
    if missing_frontend and len(missing_frontend) > 0:
        recommendations.append(f"Consider strengthening frontend skills: {', '.join(missing_frontend[:3])}")
    
    if missing_backend and len(missing_backend) > 0:
        recommendations.append(f"Consider strengthening backend skills: {', '.join(missing_backend[:3])}")
    
    if len(matched_skills) > 10:
        recommendations.append("Great! You have a strong technical skill set matching this role")
    
    return recommendations

def calculate_match_percentage(resume_text: str, job_description: str):
    """Enhanced JD matching with comprehensive analysis"""
    resume_text_clean = preprocess(resume_text)
    job_description_clean = preprocess(job_description)

    documents = [resume_text_clean, job_description_clean]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        min_df=1
    )

    tfidf_matrix = vectorizer.fit_transform(documents)

    similarity = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0]

    # Extract skills from both texts
    resume_skills = extract_skills_from_text(resume_text)
    jd_skills = extract_skills_from_text(job_description)
    
    # Find matched and missing skills
    matched_skills = list(set(resume_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(resume_skills))
    
    # Calculate skill match bonus
    skill_match_ratio = len(matched_skills) / len(jd_skills) if len(jd_skills) > 0 else 0
    
    # Extract experience
    resume_exp = extract_experience_years(resume_text)
    jd_exp = extract_experience_years(job_description)
    
    exp_match = True
    exp_gap = 0
    if jd_exp > 0:
        exp_gap = max(0, jd_exp - resume_exp)
        exp_match = resume_exp >= jd_exp
    
    # Calculate final score with weighted components
    base_score = similarity * 0.6  # 60% weight to text similarity
    skill_score = skill_match_ratio * 0.4  # 40% weight to skill matching
    
    final_score = min((base_score + skill_score) * 100, 100)
    
    # Generate recommendations
    recommendations = generate_recommendations(missing_skills, matched_skills)
    
    # Skill gap analysis
    skill_gap_analysis = {
        "total_required_skills": len(jd_skills),
        "matched_count": len(matched_skills),
        "missing_count": len(missing_skills),
        "match_ratio": round(skill_match_ratio * 100, 2),
        "categories": {
            "frontend": [s for s in matched_skills if s in ["react", "angular", "vue", "html", "css", "javascript"]],
            "backend": [s for s in matched_skills if s in ["python", "java", "node.js", "fastapi", "django"]],
            "cloud": [s for s in matched_skills if s in ["aws", "azure", "gcp", "docker", "kubernetes"]],
            "database": [s for s in matched_skills if s in ["sql", "mongodb", "postgresql", "redis"]]
        }
    }
    
    # Experience match analysis
    experience_match = {
        "resume_years": resume_exp,
        "required_years": jd_exp,
        "meets_requirement": exp_match,
        "gap_years": exp_gap
    }

    return {
        "match_percentage": round(final_score, 2),
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "recommendations": recommendations,
        "skill_gap_analysis": skill_gap_analysis,
        "experience_match": experience_match
    }


def _extract_text_from_bytes(content: bytes, filename: str) -> str:
    """Extract text from raw bytes for PDF, DOCX, or TXT."""
    lower_name = filename.lower()

    if lower_name.endswith('.txt'):
        try:
            return content.decode('utf-8', errors='ignore')
        except Exception:
            return content.decode('latin-1', errors='ignore')

    if lower_name.endswith('.pdf'):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or '' for page in pdf.pages]
            return '\n'.join(pages)

    if lower_name.endswith('.docx'):
        document = Document(io.BytesIO(content))
        return '\n'.join([p.text for p in document.paragraphs])

    raise ValueError('Unsupported file type. Please upload PDF, DOCX, or TXT.')


def extract_text_from_upload(file) -> str:
    """Extract text from an uploaded JD file (PDF/DOCX/TXT)."""
    content = file.file.read()
    return _extract_text_from_bytes(content, file.filename)


def extract_text_from_resume_upload(file) -> str:
    """Extract text from an uploaded resume file (PDF/DOCX/TXT)."""
    content = file.file.read()
    return _extract_text_from_bytes(content, file.filename)


def fetch_text_from_url(url: str) -> str:
    """Fetch JD text from a URL (basic HTTP GET)."""
    import urllib.request

    with urllib.request.urlopen(url) as response:
        if response.status != 200:
            raise ValueError('Could not fetch job description from URL')
        data = response.read()
        try:
            return data.decode('utf-8', errors='ignore')
        except Exception:
            return data.decode('latin-1', errors='ignore')
