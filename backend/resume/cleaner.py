import re
import nltk
from nltk.corpus import stopwords

# Download NLTK stopwords safely (only once)
try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    try:
        nltk.download("stopwords", quiet=True)
    except Exception as e:
        print(f"Warning: Could not download NLTK stopwords: {e}")

# Initialize stopwords set
try:
    stop_words = set(stopwords.words("english"))
except Exception:
    stop_words = set()  # Fallback to empty set if NLTK fails

def clean_text(text: str) -> str:
    """
    Clean and normalize text by:
    - Converting to lowercase
    - Removing special characters
    - Removing stopwords
    - Tokenizing and rejoining
    
    Args:
        text: Raw text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep spaces
    text = re.sub(r"[^a-z0-9\s+#]", " ", text)
    
    # Replace multiple spaces with single space
    text = re.sub(r"\s+", " ", text)
    
    # Remove stopwords if available
    if stop_words:
        tokens = text.split()
        tokens = [word for word in tokens if word and word not in stop_words and len(word) > 1]
        text = " ".join(tokens)
    
    return text.strip()
