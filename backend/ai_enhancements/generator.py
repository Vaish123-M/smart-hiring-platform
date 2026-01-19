import re
from typing import List, Dict, Tuple
from collections import Counter

# Action verbs for resume improvement
ACTION_VERBS = {
    "development": ["Engineered", "Architected", "Designed", "Developed", "Built", "Created"],
    "leadership": ["Led", "Managed", "Directed", "Oversaw", "Orchestrated", "Spearheaded"],
    "analysis": ["Analyzed", "Investigated", "Evaluated", "Examined", "Assessed", "Reviewed"],
    "improvement": ["Optimized", "Enhanced", "Improved", "Streamlined", "Accelerated", "Refined"],
    "innovation": ["Pioneered", "Innovated", "Introduced", "Revolutionized", "Transformed"],
    "collaboration": ["Collaborated", "Partnered", "Coordinated", "Facilitated", "Unified"]
}

WEAK_VERBS = ["did", "handled", "was", "helped", "made", "managed", "worked"]

# Common metrics patterns
METRICS_KEYWORDS = [
    "increased", "decreased", "improved", "reduced", "accelerated", "expanded",
    "saved", "earned", "generated", "boosted", "achieved", "captured"
]

QUANTIFIERS = ["%" , "x", "times", "million", "thousand", "billion"]

# Interview prep topics
INTERVIEW_TOPICS = {
    "behavioral": [
        {"question": "Tell me about a time you faced a technical challenge. How did you overcome it?",
         "topic": "Problem Solving",
         "approach": "Use STAR method (Situation, Task, Action, Result). Highlight technical skills used."},
        {"question": "Describe a project where you worked in a team. What was your role?",
         "topic": "Teamwork",
         "approach": "Focus on collaboration, communication, and how you contributed to team success."},
        {"question": "Tell me about a time you had to learn something new quickly.",
         "topic": "Learning Agility",
         "approach": "Show initiative, resourcefulness, and ability to adapt."},
    ],
    "technical": [
        {"question": "Explain your experience with [primary language/framework].",
         "topic": "Core Technology",
         "approach": "Be specific about projects, versions, and depth of knowledge."},
        {"question": "How would you approach debugging this code?",
         "topic": "Problem Solving",
         "approach": "Explain systematic debugging process, tools, and methodology."},
        {"question": "Design a [system/architecture/solution] for [scenario].",
         "topic": "System Design",
         "approach": "Discuss scalability, trade-offs, and reasoning."},
    ],
    "situational": [
        {"question": "How would you handle conflicting priorities from multiple stakeholders?",
         "topic": "Conflict Resolution",
         "approach": "Show communication skills, prioritization, and stakeholder management."},
        {"question": "What would you do if you disagreed with your manager's technical decision?",
         "topic": "Professional Growth",
         "approach": "Balance: respectful, data-driven, open to discussion."},
    ]
}


def analyze_resume_for_improvements(resume_text: str, job_description: str = None) -> Tuple[List[Dict], float, List[str], str]:
    """Analyze resume and provide improvement suggestions."""
    lines = resume_text.split('\n')
    suggestions = []
    total_improvements = 0
    
    # Analyze for weak action verbs
    weak_verb_count = 0
    for i, line in enumerate(lines):
        for weak_verb in WEAK_VERBS:
            if re.search(r'\b' + weak_verb + r'\b', line.lower()):
                weak_verb_count += 1
                verb_type = [k for k, v in ACTION_VERBS.items() if weak_verb in v.lower()]
                category = verb_type[0] if verb_type else "development"
                
                suggestions.append({
                    "section": "experience",
                    "line_number": i + 1,
                    "suggestions": [{
                        "original": line.strip()[:60],
                        "suggested": f"{ACTION_VERBS[category][0]} [specific action]",
                        "reason": "Use stronger action verbs to make impact clear",
                        "improvement_type": "action_verb"
                    }],
                    "confidence": 0.85
                })
    
    # Analyze for missing quantification
    quantified_lines = 0
    total_achievement_lines = 0
    
    for i, line in enumerate(lines):
        if any(metric in line.lower() for metric in METRICS_KEYWORDS):
            total_achievement_lines += 1
            has_number = any(char.isdigit() or quant in line for quant in QUANTIFIERS)
            
            if not has_number:
                quantified_lines += 1
                suggestions.append({
                    "section": "experience",
                    "line_number": i + 1,
                    "suggestions": [{
                        "original": line.strip()[:60],
                        "suggested": line.strip() + " by [specific metric/percentage]",
                        "reason": "Add specific metrics to demonstrate impact",
                        "improvement_type": "quantification"
                    }],
                    "confidence": 0.80
                })
    
    # Check for summary section
    has_summary = any(keyword in resume_text.lower() for keyword in ["summary", "objective", "profile"])
    
    if not has_summary and len(resume_text) > 100:
        suggestions.append({
            "section": "summary",
            "line_number": 1,
            "suggestions": [{
                "original": "[Missing section]",
                "suggested": "Add a professional summary highlighting key achievements and skills",
                "reason": "A strong summary increases ATS score and recruiter engagement",
                "improvement_type": "keywords"
            }],
            "confidence": 0.90
        })
    
    # Calculate improvement potential (0-100)
    improvement_potential = min((weak_verb_count + quantified_lines) * 10, 100)
    improvement_potential = max(50, improvement_potential)  # Minimum 50% potential
    
    # Top improvements
    top_improvements = [
        "Use power verbs instead of weak verbs",
        "Quantify achievements with specific metrics",
        "Add professional summary section",
        "Highlight industry keywords matching job description",
        "Use bullet points for better readability"
    ]
    
    # Estimate impact
    if improvement_potential > 80:
        estimated_impact = "high"
    elif improvement_potential > 60:
        estimated_impact = "medium"
    else:
        estimated_impact = "low"
    
    return suggestions[:10], improvement_potential, top_improvements[:3], estimated_impact


def generate_cover_letter(resume_text: str, job_description: str, company_name: str, position_title: str, tone: str = "professional") -> Tuple[str, Dict, List[str], str]:
    """Generate a customized cover letter."""
    
    # Extract key skills from resume
    resume_lower = resume_text.lower()
    skill_keywords = ["python", "javascript", "java", "react", "aws", "docker", "fastapi", 
                     "leadership", "communication", "project management"]
    extracted_skills = [skill for skill in skill_keywords if skill in resume_lower]
    
    # Extract achievement patterns from resume
    achievements = []
    achievement_verbs = ACTION_VERBS["improvement"] + ACTION_VERBS["leadership"]
    for verb in achievement_verbs:
        if verb.lower() in resume_lower:
            achievements.append(f"Strong background in {verb.lower()}")
    
    # Build cover letter sections
    opening = f"Dear Hiring Manager,\n\nI am excited to apply for the {position_title} position at {company_name}. With my proven track record in "
    if extracted_skills:
        opening += f"{', '.join(extracted_skills[:3])} and demonstrated "
    opening += "success in delivering impactful solutions, I am confident I would be a valuable addition to your team."
    
    body = f"\nIn my current role, I have developed expertise in several areas critical to this position. "
    body += f"My background includes experience with the technologies and practices outlined in your job description. "
    body += f"I am particularly drawn to {company_name}'s commitment to innovation and would welcome the opportunity to contribute my skills "
    body += f"to your {position_title} team."
    
    body += f"\nMy key strengths include:\n"
    for i, skill in enumerate(extracted_skills[:3], 1):
        body += f"  • {skill.capitalize()}: Demonstrated through multiple projects and roles\n"
    
    closing = f"\nI would welcome the opportunity to discuss how my background and skills align with your team's needs. "
    closing += f"Thank you for considering my application. I look forward to speaking with you soon.\n\nBest regards,\n[Your Name]"
    
    full_letter = opening + body + closing
    
    sections = {
        "opening": opening,
        "body": body,
        "closing": closing
    }
    
    # Key highlights
    key_highlights = [
        f"Tailored for {position_title} at {company_name}",
        f"Emphasized relevant skills: {', '.join(extracted_skills[:3])}",
        "Professional tone with specific achievements",
        "Customization level: High"
    ]
    
    return full_letter, sections, key_highlights, "high"


def generate_interview_prep(resume_text: str, job_description: str = None, focus_areas: List[str] = None) -> Tuple[List[Dict], List[str], List[str], List[Dict]]:
    """Generate interview preparation materials."""
    
    # Extract key skills from resume
    resume_lower = resume_text.lower()
    technical_skills = []
    skill_keywords = ["python", "javascript", "java", "react", "fastapi", "docker", "kubernetes", "aws"]
    for skill in skill_keywords:
        if skill in resume_lower:
            technical_skills.append(skill)
    
    # Generate specific questions
    questions = []
    
    # Behavioral questions (always relevant)
    behavioral_q = {
        "question": "Tell me about a time you had to debug a complex problem in production. How did you approach it?",
        "category": "behavioral",
        "topic": "Problem Solving",
        "suggested_approach": f"Share how you used systematic debugging, collaboration, and {technical_skills[0] if technical_skills else 'technical'} expertise to resolve the issue."
    }
    questions.append(behavioral_q)
    
    # Technical questions based on resume
    if technical_skills:
        tech_q = {
            "question": f"Walk us through a project where you used {technical_skills[0]}. What challenges did you face?",
            "category": "technical",
            "topic": "Core Technology",
            "suggested_approach": f"Describe the project, your specific role, technologies used, and problems solved."
        }
        questions.append(tech_q)
    
    # Additional behavioral
    behavioral_q2 = {
        "question": "Describe a time when you had to learn a new technology quickly to solve a problem.",
        "category": "behavioral",
        "topic": "Learning Agility",
        "suggested_approach": "Show resourcefulness, dedication to growth, and ability to apply new knowledge effectively."
    }
    questions.append(behavioral_q2)
    
    # Key talking points
    talking_points = [
        f"Proficiency in {', '.join(technical_skills[:3])}",
        "Track record of delivering projects on time and within scope",
        "Strong problem-solving and debugging skills",
        "Experience working in collaborative environments",
        "Commitment to continuous learning and improvement"
    ]
    
    # Skills to highlight
    skills_to_highlight = technical_skills[:5] + ["Problem-solving", "Communication", "Teamwork", "Adaptability"]
    
    # Common interview questions
    common_questions = [
        {
            "question": "What are your strengths and weaknesses?",
            "category": "behavioral",
            "topic": "Self-Assessment",
            "suggested_approach": "Be honest. Mention 2-3 real strengths with examples, and weaknesses you're actively improving."
        },
        {
            "question": "Why are you interested in this role/company?",
            "category": "situational",
            "topic": "Motivation",
            "suggested_approach": f"Research {job_description[:50] if job_description else 'the company'} and align it with your career goals."
        },
        {
            "question": "Where do you see yourself in 5 years?",
            "category": "behavioral",
            "topic": "Career Growth",
            "suggested_approach": "Show ambition, continuous learning, and alignment with company growth."
        }
    ]
    
    return questions, talking_points, skills_to_highlight, common_questions
