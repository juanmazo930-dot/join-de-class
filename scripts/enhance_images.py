"""
Mejora "estudio fotografico" + upscale + conversion a WebP para el catalogo.

100% local con Pillow (open-source, ya incluido). Sustituye a ImageMagick
(el instalador oficial requiere un asistente grafico interactivo que no se
puede automatizar en este entorno) sin perder el resultado: mismo tipo de
operaciones (auto-nivel, nitidez, saturacion, upscale) via Pillow.

Uso:
    python scripts/enhance_images.py
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "src" / "assets" / "products"
MAX_LONG_EDGE = 1000  # solo baja resolucion si excede esto (arregla el lag de Conjuntos)
WEBP_QUALITY = 82


def enhance(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")

    # Solo redimensiona hacia abajo si la foto original es mas grande de lo
    # necesario para una tarjeta de catalogo web; no forzamos upscale de las
    # que ya estan bien de tamano (evita artefactos y peso extra sin razon).
    w, h = img.size
    if max(w, h) > MAX_LONG_EDGE:
        scale = MAX_LONG_EDGE / max(w, h)
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    # Auto balance de blancos / nivel de contraste por canal (como -auto-level)
    img = ImageOps.autocontrast(img, cutoff=1)

    # Nitidez tipo "unsharp mask" de estudio
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=2))

    # Saturacion ligeramente mas viva para telas/estampados
    img = ImageEnhance.Color(img).enhance(1.18)

    # Micro-boost de contraste final
    img = ImageEnhance.Contrast(img).enhance(1.05)

    return img


def main():
    files = sorted(SRC_DIR.glob("*.jpeg")) + sorted(SRC_DIR.glob("*.jpg"))
    print(f"Procesando {len(files)} imagenes de catalogo...")
    for f in files:
        img = Image.open(f)
        out = enhance(img)
        webp_path = f.with_suffix(".webp")
        out.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {f.name} -> {webp_path.name}  ({out.size[0]}x{out.size[1]})")
    print("Listo.")


if __name__ == "__main__":
    main()
