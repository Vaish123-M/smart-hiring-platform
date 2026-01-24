#!/usr/bin/env python
"""Test ATS scoring to debug why score is 0"""

from matching.ats_engine import calculate_ats_score

# Sample test case
resume_text = """
JOHN DOE
Web Developer

SKILLS:
- Python
- JavaScript
- React
- HTML
- CSS
- Node.js
- Django
- Git

EXPERIENCE:
Senior Web Developer at TechCorp (2020-2024)
- Developed web applications using React and Node.js
- Built REST APIs with Python and Django
- Worked with HTML, CSS, and JavaScript daily
"""

job_description = """
Job Title: Senior Web Developer

Requirements:
- 5+ years experience with Python
- Strong knowledge of JavaScript and React
- Experience with HTML and CSS
- Familiarity with Node.js and Django
- Git version control

Must have: Python, JavaScript, React, HTML, CSS
"""

print("=" * 60)
print("TESTING ATS SCORING ENGINE")
print("=" * 60)

result = calculate_ats_score(resume_text, job_description)

print(f"\n📊 ATS SCORE: {result['ats_score']}%")
print(f"✅ Matched Skills ({len(result['matched_skills'])}): {result['matched_skills']}")
print(f"❌ Missing Skills ({len(result['missing_skills'])}): {result['missing_skills']}")
print(f"📋 Total JD Skills: {result['total_jd_skills']}")

if result['ats_score'] == 0:
    print("\n⚠️  WARNING: Score is 0!")
    print("This means NO skills were matched.")
    print("Possible issues:")
    print("1. Skills not in TECH_SKILLS list")
    print("2. Preprocessing removing important text")
    print("3. Skill extraction pattern not matching")
else:
    print(f"\n✅ SUCCESS: ATS score is {result['ats_score']}%")
