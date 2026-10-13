import os

def download_models():
    """
    Placeholder/hook for downloading large language models or deep learning weights
    in full production mode. In lightweight mode, the fast TF-IDF multi-lingual classifier
    is initialized without heavy downloads.
    """
    os.makedirs("ml/models", exist_ok=True)
    print("✅ Model directory initialized. Lightweight fast models active.")

if __name__ == "__main__":
    download_models()
