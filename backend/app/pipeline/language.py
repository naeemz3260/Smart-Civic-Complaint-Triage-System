import re

def detect_language(text: str) -> str:
    """
    Detects whether the input complaint text is in Urdu (Arabic script),
    Roman Urdu, or Standard English.
    """
    if not text or not text.strip():
        return "en"
    
    # Check for Arabic / Urdu Unicode Range (0600-06FF)
    urdu_chars = re.findall(r'[\u0600-\u06FF]', text)
    if len(urdu_chars) > len(text.strip()) * 0.2:
        return "ur"
    
    # Roman Urdu common civic markers
    roman_urdu_markers = [
        "hai", "hain", "mera", "meri", "humara", "gadda", "khadda", "sarak", "sadak",
        "pani", "bijli", "kachra", "koora", "ganda", "band", "toot", "gaya", "gaye",
        "raha", "rahi", "bohot", "bohat", "khatra", "jaldi", "bhejo", "safai"
    ]
    tokens = [t.lower() for t in re.findall(r'\b[a-zA-Z]+\b', text)]
    marker_hits = sum(1 for t in tokens if t in roman_urdu_markers)
    if marker_hits >= 1 and len(tokens) > 0:
        if (marker_hits / len(tokens)) > 0.1 or marker_hits >= 2:
            return "roman_ur"
            
    return "en"

def normalize_text(text: str) -> str:
    """Normalizes text by lowercasing and standardizing whitespace."""
    if not text:
        return ""
    cleaned = re.sub(r'\s+', ' ', text.strip().lower())
    return cleaned
