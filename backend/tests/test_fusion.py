import pytest
from backend.app.pipeline.language import detect_language
from backend.app.pipeline.keywords import check_safety_keywords
from backend.app.pipeline.fusion import FusionEngine

def test_language_detection():
    assert detect_language("Big pothole on main road") == "en"
    assert detect_language("سڑک پر گڑھا ہے") == "ur"
    assert detect_language("Sadak pe bara khadda hai") == "roman_ur"

def test_safety_keywords():
    is_crit, cat, sev, reason = check_safety_keywords("Danger! Live wire fell on the ground sparking!")
    assert is_crit is True
    assert cat == "electricity"
    assert sev >= 0.95

def test_fusion_engine():
    engine = FusionEngine()
    result = engine.fuse("Massive open manhole without cover near primary school")
    assert result["category"] == "sewage"
    assert result["is_critical"] is True
