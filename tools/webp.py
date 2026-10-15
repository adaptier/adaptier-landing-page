"""Convert a 2x PNG capture into the page's 1x/2x WebP pair.

Usage: python3 tools/webp.py <src.png> <name> <display_width>
"""
import sys
from pathlib import Path
from PIL import Image

src, name, width = sys.argv[1], sys.argv[2], int(sys.argv[3])
out = Path(__file__).resolve().parent.parent / "images"
img = Image.open(src).convert("RGB")
for suffix, w in (("", width), ("@2x", width * 2)):
    h = round(img.height * w / img.width)
    path = out / f"{name}{suffix}.webp"
    img.resize((w, h), Image.LANCZOS).save(path, "WEBP", quality=82, method=6)
    print(f"{path.name}: {w}x{h}, {path.stat().st_size // 1024} KB")
