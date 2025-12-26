from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

BOOST_KEYWORDS = [
    "python", "docker", "aws", "fastapi", "backend"
]

def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9 ]", " ", text)
    return text

def calculate_match_percentage(resume_text: str, job_description: str):
    resume_text = preprocess(resume_text)
    job_description = preprocess(job_description)

    documents = [resume_text, job_description]

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

    # 🔥 Keyword boost
    boost = 0
    for word in BOOST_KEYWORDS:
        if word in resume_text and word in job_description:
            boost += 0.05   # 5% boost per skill

    final_score = min((similarity + boost) * 100, 100)

    return {
        "match_percentage": round(final_score, 2)
    }
