import os
import csv
import pickle
from typing import Tuple, Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from backend.app.pipeline.language import normalize_text

class TextClassifier:
    def __init__(self, model_path: str = "ml/models/text_classifier.pkl"):
        self.model_path = model_path
        self.pipeline = None
        self._load_or_train()

    def _load_or_train(self):
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, "rb") as f:
                    self.pipeline = pickle.load(f)
                return
            except Exception:
                pass
        
        # Train on-the-fly using complaints.csv if model doesn't exist
        self.train_from_csv("data/sample/complaints.csv")

    def train_from_csv(self, csv_path: str):
        if not os.path.exists(csv_path):
            return
        
        texts = []
        labels = []
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                norm = normalize_text(row["text"])
                if norm and row["category"]:
                    texts.append(norm)
                    labels.append(row["category"])

        if not texts:
            return

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=500, random_state=42))
        ])
        self.pipeline.fit(texts, labels)

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, "wb") as f:
            pickle.dump(self.pipeline, f)

    def predict(self, text: str) -> Tuple[str, float, Dict[str, float]]:
        """
        Returns: (predicted_category, confidence_score, all_probabilities)
        """
        if not self.pipeline:
            return "pothole", 0.50, {}

        norm = normalize_text(text)
        probs = self.pipeline.predict_proba([norm])[0]
        classes = self.pipeline.classes_

        class_prob_map = {classes[i]: float(probs[i]) for i in range(len(classes))}
        top_idx = probs.argmax()
        top_cat = classes[top_idx]
        top_conf = float(probs[top_idx])

        return top_cat, top_conf, class_prob_map
