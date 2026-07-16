"""
Mejora "estudio fotografico" + grading de marca consistente + conversion a
WebP para el catalogo y la seccion de comunidad.

100% local con Pillow (open-source, ya instalado via pip - no se descargan
ni ejecutan scripts de terceros de origen desconocido). Sustituye a
ImageMagick (el instalador oficial requiere un asistente grafico
interactivo que no se puede automatizar en este entorno).

Uso:
    python scripts/enhance_images.py
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "src" / "assets" / "products"
COMMUNITY_DIR = ROOT / "src" / "assets" / "community"
WEBP_QUALITY = 82


def _scurve_lut(strength):
    """LUT de curva en S: profundiza sombras, protege luces. strength 0-1."""
    lut = []
    for i in range(256):
        x = i / 255
        # curva suave tipo "film" via interpolacion con una sigmoide simple
        s = 0.5 + (x - 0.5) * (1 + strength) - strength * 0.5 * (x - 0.5) * abs(x - 0.5) * 2
        lut.append(max(0, min(255, round(s * 255))))
    return lut


def brand_grade(img: Image.Image, strength=0.12) -> Image.Image:
    """Curva de contraste consistente para que producto y comunidad
    compartan el mismo 'look' de marca (negros mas profundos, sin tocar
    el balance de color para no alterar tonos de piel)."""
    lut = _scurve_lut(strength) * 3
    return img.point(lut)


def enhance(img: Image.Image, max_long_edge, cutoff, sharpen_percent, saturation, contrast, grade_strength) -> Image.Image:
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

    # Curva de marca consistente (mismo "look" en todas las fotos del sitio)
    img = brand_grade(img, grade_strength)

    # Nitidez tipo "unsharp mask" de estudio
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=sharpen_percent, threshold=2))

    # Saturacion mas viva
    img = ImageEnhance.Color(img).enhance(saturation)

    # Micro-boost de contraste final
    img = ImageEnhance.Contrast(img).enhance(contrast)

    return img


def process_dir(src_dir, **enhance_kwargs):
    files = sorted(src_dir.glob("*.jpeg")) + sorted(src_dir.glob("*.jpg")) + sorted(src_dir.glob("*.png"))
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
        grade_strength=0.14,
    )

    # Fotos de comunidad (gente real, luz natural exterior): mejora mas
    # sutil para no quemar cielos/pieles, misma curva de marca pero mas leve.
    if COMMUNITY_DIR.exists():
        process_dir(
            COMMUNITY_DIR,
            max_long_edge=900,
            cutoff=0.4,
            sharpen_percent=80,
            saturation=1.08,
            contrast=1.03,
            grade_strength=0.08,
        )

    print("Listo.")


if __name__ == "__main__":
    main()
