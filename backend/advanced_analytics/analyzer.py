import re
from typing import List, Dict, Tuple
from collections import Counter
from datetime import datetime, timedelta

# Skill categories with importance weights
SKILL_CATEGORIES = {
    "backend": {
        "skills": ["python", "java", "go", "rust", "fastapi", "django", "spring"],
        "weight": 0.9
    },
    "frontend": {
        "skills": ["javascript", "react", "vue", "typescript", "css", "html"],
        "weight": 0.85
    },
    "devops": {
        "skills": ["docker", "kubernetes", "aws", "azure", "gcp", "terraform"],
        "weight": 0.95
    },
    "data": {
        "skills": ["python", "sql", "spark", "hadoop", "pandas", "numpy"],
        "weight": 0.88
    },
    "soft": {
        "skills": ["communication", "leadership", "teamwork", "problem-solving"],
        "weight": 0.75
    }
}


def analyze_skill_heatmap(resumes_data: List[Dict]) -> Tuple[List[Dict], List[str], List[str], List[str], List[str]]:
    """Analyze skill heatmap from multiple resumes."""
    
    all_skills = []
    skill_ats_correlation = {}
    skill_frequency = Counter()
    
    # Collect all skills and their ATS correlations
    for resume in resumes_data:
        skills = resume.get("skills", [])
        ats_score = resume.get("ats_score", 0)
        
        for skill in skills:
            skill_lower = skill.lower()
            skill_frequency[skill_lower] += 1
            
            if skill_lower not in skill_ats_correlation:
                skill_ats_correlation[skill_lower] = []
            skill_ats_correlation[skill_lower].append(ats_score)
    
    # Calculate correlations and generate heatmap
    heatmap_data = []
    
    for skill, frequency in skill_frequency.most_common(50):
        # Calculate ATS correlation
        ats_scores = skill_ats_correlation.get(skill, [0])
        ats_correlation = sum(ats_scores) / (len(ats_scores) * 10) if ats_scores else 0
        ats_correlation = min(ats_correlation, 1.0)
        
        # Determine role relevance based on category
        role_relevance = 0.5
        for category, data in SKILL_CATEGORIES.items():
            if skill in data["skills"]:
                role_relevance = data["weight"]
                break
        
        # Simple growth trend (for demo: skills appearing more recently)
        growth_trend = (frequency / max(skill_frequency.values())) * 0.2 - 0.1
        
        heatmap_data.append({
            "skill": skill,
            "frequency": frequency,
            "ats_correlation": ats_correlation,
            "role_relevance": role_relevance,
            "growth_trend": growth_trend
        })
    
    # Identify emerging, declining, top skills
    sorted_by_trend = sorted(heatmap_data, key=lambda x: x["growth_trend"], reverse=True)
    emerging_skills = [s["skill"] for s in sorted_by_trend[:5] if s["growth_trend"] > 0.05]
    declining_skills = [s["skill"] for s in sorted_by_trend[-5:] if s["growth_trend"] < -0.05]
    top_skills = [s["skill"] for s in sorted(heatmap_data, key=lambda x: x["frequency"], reverse=True)[:10]]
    
    # Recommendations
    recommendations = [
        f"Focus on {top_skills[0]} - it's the most common in your portfolio" if top_skills else "Add diverse skills",
        f"Emerging skill to learn: {emerging_skills[0]}" if emerging_skills else "Monitor market trends",
        "Maintain proficiency in high-impact skills",
        "Keep documentation of completed projects with each skill"
    ]
    
    return heatmap_data, top_skills, emerging_skills, declining_skills, recommendations


def analyze_trends(resumes_history: List[Dict]) -> Tuple[List[Dict], float, float, float, List[str]]:
    """Analyze ATS score trends over time."""
    
    # Sort by date
    sorted_resumes = sorted(resumes_history, key=lambda x: x.get("date", ""), reverse=True)
    
    trend_points = []
    ats_scores = []
    
    for resume in sorted_resumes:
        date = resume.get("date", "")
        ats_score = resume.get("ats_score", 0)
        skill_count = len(resume.get("skills", []))
        resume_id = resume.get("resume_id", "")
        
        trend_points.append({
            "date": date,
            "ats_score": ats_score,
            "skill_count": skill_count,
            "resume_id": resume_id
        })
        
        ats_scores.append(ats_score)
    
    # Calculate metrics
    average_ats = sum(ats_scores) / len(ats_scores) if ats_scores else 0
    best_ats = max(ats_scores) if ats_scores else 0
    
    # Calculate improvement rate (simplified: difference over resumes)
    if len(ats_scores) > 1:
        improvement_rate = ((ats_scores[0] - ats_scores[-1]) / ats_scores[-1] * 100) if ats_scores[-1] > 0 else 0
    else:
        improvement_rate = 0
    
    # Recommendations
    recommendations = [
        f"Your best ATS score so far: {best_ats:.1f}/10",
        f"Average score across resumes: {average_ats:.1f}/10",
        "Consistency is key - maintain high scores across all versions",
        "Focus on keyword optimization in your latest resume"
    ]
    
    if improvement_rate > 10:
        recommendations.insert(0, f"Great improvement trend: +{improvement_rate:.1f}%")
    elif improvement_rate < -10:
        recommendations.insert(0, f"Review recent changes - score decreased by {abs(improvement_rate):.1f}%")
    
    return trend_points, average_ats, best_ats, improvement_rate, recommendations


def compare_resumes(resume1_text: str, resume2_text: str, job_description: str = None) -> Tuple[List[Dict], str, float, float, List[str]]:
    """Compare two resumes across multiple dimensions."""
    
    comparisons = []
    
    # Extract data
    r1_lower = resume1_text.lower()
    r2_lower = resume2_text.lower()
    
    # 1. Skills Comparison
    skill_keywords = ["python", "javascript", "java", "react", "docker", "kubernetes", "aws",
                     "sql", "postgresql", "mongodb", "leadership", "communication"]
    r1_skills = sum(1 for skill in skill_keywords if skill in r1_lower)
    r2_skills = sum(1 for skill in skill_keywords if skill in r2_lower)
    
    comparisons.append({
        "aspect": "skills",
        "resume1_score": r1_skills / len(skill_keywords) * 10,
        "resume2_score": r2_skills / len(skill_keywords) * 10,
        "winner": "resume1" if r1_skills > r2_skills else ("resume2" if r2_skills > r1_skills else "tie"),
        "explanation": f"Resume 1: {r1_skills} keywords found, Resume 2: {r2_skills} keywords found"
    })
    
    # 2. Length/Content Analysis
    r1_length = len(resume1_text)
    r2_length = len(resume2_text)
    r1_length_score = min(r1_length / 500, 10)
    r2_length_score = min(r2_length / 500, 10)
    
    comparisons.append({
        "aspect": "content_depth",
        "resume1_score": r1_length_score,
        "resume2_score": r2_length_score,
        "winner": "resume1" if r1_length > r2_length else ("resume2" if r2_length > r1_length else "tie"),
        "explanation": f"Resume 1: {r1_length} chars, Resume 2: {r2_length} chars"
    })
    
    # 3. Action Verbs
    action_verbs = ["engineered", "developed", "led", "managed", "designed", "optimized", "improved"]
    r1_verbs = sum(1 for verb in action_verbs if verb in r1_lower)
    r2_verbs = sum(1 for verb in action_verbs if verb in r2_lower)
    
    comparisons.append({
        "aspect": "action_verbs",
        "resume1_score": r1_verbs,
        "resume2_score": r2_verbs,
        "winner": "resume1" if r1_verbs > r2_verbs else ("resume2" if r2_verbs > r1_verbs else "tie"),
        "explanation": f"Resume 1: {r1_verbs} action verbs, Resume 2: {r2_verbs} action verbs"
    })
    
    # 4. Quantification (metrics/numbers)
    r1_numbers = len(re.findall(r'\d+', resume1_text))
    r2_numbers = len(re.findall(r'\d+', resume2_text))
    
    comparisons.append({
        "aspect": "quantification",
        "resume1_score": min(r1_numbers / 5, 10),
        "resume2_score": min(r2_numbers / 5, 10),
        "winner": "resume1" if r1_numbers > r2_numbers else ("resume2" if r2_numbers > r1_numbers else "tie"),
        "explanation": f"Resume 1: {r1_numbers} numbers found, Resume 2: {r2_numbers} numbers found"
    })
    
    # Calculate overall scores
    r1_overall = sum(c["resume1_score"] for c in comparisons) / len(comparisons)
    r2_overall = sum(c["resume2_score"] for c in comparisons) / len(comparisons)
    
    overall_winner = "resume1" if r1_overall > r2_overall else ("resume2" if r2_overall > r1_overall else "tie")
    
    # Recommendations
    recommendations = [
        f"Winner: Resume {1 if overall_winner == 'resume1' else 2 if overall_winner == 'resume2' else 'Both are similar'}",
        "Consider combining the best aspects of both resumes",
        "Focus on the weaker resume areas to improve overall score",
        "Test the improved version against your target job description"
    ]
    
    return comparisons, overall_winner, r1_overall, r2_overall, recommendations
