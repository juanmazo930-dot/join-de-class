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
PRODUCTS_DIR = ROOT / "src" / "assets" / "products"
COMMUNITY_DIR = ROOT / "src" / "assets" / "community"
WEBP_QUALITY = 82


def enhance(img: Image.Image, max_long_edge, cutoff, sharpen_percent, saturation, contrast) -> Image.Image:
    img = img.convert("RGB")

    # Solo redimensiona hacia abajo si la foto original es mas grande de lo
    # necesario para web; no forzamos upscale de las que ya estan bien de
    # tamano (evita artefactos y peso extra sin razon).
    w, h = img.size
    if max(w, h) > max_long_edge:
        scale = max_long_edge / max(w, h)
        img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    # Auto balance de blancos / nivel de contraste por canal (como -auto-level)
    img = ImageOps.autocontrast(img, cutoff=cutoff)

    # Nitidez tipo "unsharp mask" de estudio
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=sharpen_percent, threshold=2))

    # Saturacion mas viva
    img = ImageEnhance.Color(img).enhance(saturation)

    # Micro-boost de contraste final
    img = ImageEnhance.Contrast(img).enhance(contrast)

    return img


def process_dir(src_dir, **enhance_kwargs):
    files = sorted(src_dir.glob("*.jpeg")) + sorted(src_dir.glob("*.jpg"))
    print(f"Procesando {len(files)} imagenes en {src_dir.name}/...")
    for f in files:
        img = Image.open(f)
        out = enhance(img, **enhance_kwargs)
        webp_path = f.with_suffix(".webp")
        out.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {f.name} -> {webp_path.name}  ({out.size[0]}x{out.size[1]})")


def main():
    # Fotos de producto (fondo de estudio): mejora mas marcada, tamano acotado
    # a 1000px para tarjetas de catalogo (arregla el lag de Conjuntos).
    process_dir(
        PRODUCTS_DIR,
        max_long_edge=1000,
        cutoff=1,
        sharpen_percent=120,
        saturation=1.18,
        contrast=1.05,
    )

    # Fotos de comunidad (gente real, luz natural exterior): mejora mas
    # sutil para no quemar cielos/pieles, tamano mayor porque se muestran
    # como piezas grandes tipo editorial.
    if COMMUNITY_DIR.exists():
        process_dir(
            COMMUNITY_DIR,
            max_long_edge=900,
            cutoff=0.4,
            sharpen_percent=80,
            saturation=1.08,
            contrast=1.03,
        )

    print("Listo.")


if __name__ == "__main__":
    main()
