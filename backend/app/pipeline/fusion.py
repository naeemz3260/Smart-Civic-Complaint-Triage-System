import os
from typing import Dict, Any, Optional
from backend.app.pipeline.language import detect_language
from backend.app.pipeline.keywords import check_safety_keywords
from backend.app.pipeline.text_classifier import TextClassifier
from backend.app.pipeline.image_classifier import ImageClassifier

class FusionEngine:
    """
    Combines text prediction, image classification, safety overrides,
    and determines whether human review is required.
    """
    def __init__(self, text_classifier: Optional[TextClassifier] = None):
        self.text_classifier = text_classifier or TextClassifier()
        self.image_classifier = ImageClassifier()

    def fuse(
        self,
        text: str,
        image_filename: Optional[str] = None,
        image_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        lang = detect_language(text)

        # 1. Check critical safety triggers first
        is_critical, cat_override, sev_override, reason = check_safety_keywords(text)
        if is_critical and cat_override:
            return {
                "category": cat_override,
                "confidence": 0.99,
                "language": lang,
                "is_critical": True,
                "critical_reason": reason,
                "severity_override": sev_override,
                "needs_human_review": False,
                "fusion_details": "Critical safety keyword override"
            }

        # 2. Text model prediction
        text_cat, text_conf, prob_dist = self.text_classifier.predict(text)

        # 3. Vision prediction if image present
        img_cat, img_conf = (None, 0.0)
        if image_filename:
            img_cat, img_conf = self.image_classifier.classify_image(image_filename, image_bytes)

        # 4. Multimodal Fusion Logic
        final_cat = text_cat
        final_conf = text_conf

        if img_cat:
            if img_cat == text_cat:
                # Text and Image agree -> boost confidence
                final_conf = min(0.99, text_conf * 0.6 + img_conf * 0.4 + 0.1)
            else:
                # Disagreement -> slight penalty, consider both
                final_conf = max(0.40, (text_conf + img_conf) / 2.0 - 0.1)
                # If text confidence was strong, keep text category; else fall back to higher
                if img_conf > text_conf + 0.2:
                    final_cat = img_cat

        # 5. Review determination based on threshold
        needs_review = final_conf < 0.70

        return {
            "category": final_cat,
            "confidence": round(final_conf, 3),
            "language": lang,
            "is_critical": False,
            "critical_reason": None,
            "severity_override": None,
            "needs_human_review": needs_review,
            "text_prediction": {"category": text_cat, "confidence": round(text_conf, 3)},
            "image_prediction": {"category": img_cat, "confidence": round(img_conf, 3)} if img_cat else None
        }
