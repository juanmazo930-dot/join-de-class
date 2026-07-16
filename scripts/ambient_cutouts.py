"""
Recortes SIN fondo (transparentes, sin backdrop de estudio) para las
siluetas que flotan de fondo ambiental en la pagina principal. Distinto
de studio_composite.py: aqui no se compone sobre nada, se deja el alpha
transparente para que floten directamente sobre el fondo blanco del sitio.

Uso:
    python scripts/ambient_cutouts.py
"""
import sys
from pathlib import Path

from PIL import Image
from rembg import remove

sys.path.insert(0, str(Path(__file__).resolve().parent))
from studio_composite import enhance_subject

ROOT = Path(__file__).resolve().parent.parent
COMMUNITY_DIR = ROOT / "src" / "assets" / "community"
AMBIENT_DIR = ROOT / "src" / "assets" / "ambient"
WEBP_QUALITY = 85

# fuente -> nombre de salida
SOURCES = {
    "community-2.jpeg": "cutout-1.webp",
    "community-5.jpeg": "cutout-2.webp",
    "community-9.png": "cutout-3.webp",
}


def process(path: Path):
    original = Image.open(path).convert("RGB")
    cutout = remove(original)
    bbox = cutout.getbbox()
    if not bbox:
        return None
    subject = cutout.crop(bbox)
    subject.thumbnail((900, 1100), Image.LANCZOS)
    return enhance_subject(subject)


def main():
    AMBIENT_DIR.mkdir(parents=True, exist_ok=True)
    for src_name, out_name in SOURCES.items():
        src_path = COMMUNITY_DIR / src_name
        if not src_path.exists():
            print(f"  {src_name}: no encontrado, se omite")
            continue
        out = process(src_path)
        if out is None:
            print(f"  {src_name}: no se detecto sujeto, se omite")
            continue
        out_path = AMBIENT_DIR / out_name
        out.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {src_name} -> {out_path.name}")
    print("Listo.")


if __name__ == "__main__":
    main()
