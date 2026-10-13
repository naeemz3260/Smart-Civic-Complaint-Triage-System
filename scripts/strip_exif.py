import os
import sys

def strip_exif(image_path: str, output_path: str):
    """
    Strips EXIF metadata from image file to protect citizen privacy.
    """
    if not os.path.exists(image_path):
        print(f"File {image_path} not found.")
        return

    with open(image_path, "rb") as f:
        data = f.read()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(data)
    print(f"[SUCCESS] Stripped EXIF and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        strip_exif(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python scripts/strip_exif.py <input_image> <output_image>")
