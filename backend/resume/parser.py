import pdfplumber
from io import BytesIO

def extract_text_from_pdf(file_obj):
    """
    Extract text from PDF file object using pdfplumber.
    
    Args:
        file_obj: BytesIO object or file path
        
    Returns:
        str: Extracted text from all pages
        
    Raises:
        Exception: If PDF cannot be opened or read
    """
    text = ""
    
    try:
        with pdfplumber.open(file_obj) as pdf:
            if not pdf.pages:
                return ""
                
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
                    
        return text.strip()
        
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")
