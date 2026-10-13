import os
import sys

# Script to fetch recommended open source models
# Models are saved to ml/models/ and never committed to git.

def download_open_source_models():
    """
    Fetches:
    1. Multilingual Sentence Embeddings:
       'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2' (approx. 470 MB)
       Native support for Urdu, Arabic, English, and Latin Roman Urdu.
    2. Vision Model (Optional / Full profile):
       'ViT-B-32' open_clip (OpenAI pretrained weights)
    """
    print("[INFO] Starting Open-Source Model Download...")
    os.makedirs("ml/models", exist_ok=True)

    try:
        from sentence_transformers import SentenceTransformer
        print("[INFO] Downloading 'paraphrase-multilingual-MiniLM-L12-v2'...")
        model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        model.save("ml/models/sentence_transformer")
        print("[SUCCESS] Multilingual Sentence Transformer cached successfully!")
    except ImportError:
        print("[NOTICE] 'sentence-transformers' not installed yet. To download real weights, run:")
        print("         pip install sentence-transformers")
    except Exception as e:
        print(f"[WARNING] Could not download sentence model: {e}")

    try:
        import open_clip
        print("[INFO] Checking OpenCLIP 'ViT-B-32'...")
        model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
        print("[SUCCESS] OpenCLIP ViT-B-32 ready!")
    except ImportError:
        print("[NOTICE] 'open_clip_torch' not installed. In lite mode, vision heuristics are active.")
    except Exception as e:
        print(f"[WARNING] OpenCLIP notice: {e}")

    print("[SUCCESS] ml/download_models.py execution completed.")

if __name__ == "__main__":
    download_open_source_models()
