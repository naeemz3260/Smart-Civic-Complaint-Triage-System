"""
Smart Civic Complaint Triage System - Text Classifier Training Script
====================================================================
This script trains a lightweight, multilingual text classifier on labeled civic complaints
written in English, Urdu (Arabic script), and Roman Urdu.

Key Workflow:
1. Adds project root to Python search path for modular backend imports.
2. Initializes TextClassifier with TF-IDF vectorization and Logistic Regression.
3. Fits the model on data/sample/complaints.csv.
4. Serializes the trained model artifact to ml/models/text_classifier.pkl.
5. Runs sanity inference checks against sample multi-dialect municipal inputs.
"""

import os
import sys

# Ensure repository root is on sys.path so backend modules can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.pipeline.text_classifier import TextClassifier

def main():
    """
    Main execution pipeline for training and sanity verification.
    """
    print("[INFO] Training Multi-Lingual Text Classifier...")
    
    # 1. Instantiate the classifier targeting the serializable model path
    classifier = TextClassifier(model_path="ml/models/text_classifier.pkl")
    
    # 2. Train classifier using the multilingual sample complaints dataset
    classifier.train_from_csv("data/sample/complaints.csv")
    print("[SUCCESS] Model trained and saved to ml/models/text_classifier.pkl")

    # 3. Sanity check test queries across English and Roman Urdu
    test_queries = [
        "Dangerous open hole on main road causing accidents",
        "Pipeline phat gaya saaf pani zaya ho raha hai",
        "Bijli ka taar zameen pe gira hai sparking ho rahi hai"
    ]
    
    print("\n[INFO] Sample Inference Tests:")
    for query in test_queries:
        cat, conf, _ = classifier.predict(query)
        print(f"  * Query: '{query}' -> [{cat.upper()}] (Confidence: {conf:.2f})")

if __name__ == "__main__":
    main()
