from typing import Tuple, List, Optional
import yaml
import os

CRITICAL_SAFETY_TERMS = {
    "live wire": ("electricity", 1.0, "Critical electrical hazard: Exposed live electrical wire"),
    "sparking": ("electricity", 0.95, "Active sparking hazard on electrical infrastructure"),
    "bijli ka taar": ("electricity", 1.0, "Fallen electrical cable hazard"),
    "open manhole": ("sewage", 0.98, "Open manhole hazard: Fatal falling risk"),
    "manhole lid missing": ("sewage", 0.98, "Missing sewer cover hazard"),
    "gatter khula": ("sewage", 0.95, "Open drain hazard"),
    "sinkhole": ("pothole", 1.0, "Catastrophic road subsidence / sinkhole"),
    "hospital waste": ("garbage", 0.95, "Bio-hazardous medical waste dumped in public area")
}

def check_safety_keywords(text: str) -> Tuple[bool, Optional[str], float, Optional[str]]:
    """
    Scans text for life-safety emergency triggers.
    Returns: (is_critical, category_override, severity_override, reason)
    """
    lower_text = text.lower()
    for trigger, (cat, sev, reason) in CRITICAL_SAFETY_TERMS.items():
        if trigger in lower_text:
            return True, cat, sev, reason
    return False, None, 0.0, None
