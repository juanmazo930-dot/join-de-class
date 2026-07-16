"""
Quita el fondo real de las fotos de comunidad (rembg, MIT, modelo oficial
descargado desde las releases de GitHub del propio proyecto rembg - no un
script suelto) y las compone sobre un fondo de estudio oscuro/neutro
consistente con el resto del catalogo, con sombra de contacto y el mismo
grading de marca aplicado solo al sujeto (aplicarlo al lienzo completo con
el fondo casi plano confunde el auto-contraste y mete un tinte de color).

Uso:
    python scripts/studio_composite.py
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from rembg import remove

sys.path.insert(0, str(Path(__file__).resolve().parent))
from enhance_images import enhance  # reutiliza la misma curva de marca

ROOT = Path(__file__).resolve().parent.parent
COMMUNITY_DIR = ROOT / "src" / "assets" / "community"
WEBP_QUALITY = 85
CANVAS_SIZE = (900, 1125)  # 4:5


def studio_backdrop(size):
    w, h = size
    canvas = Image.new("RGB", size, (24, 24, 26))
    draw = ImageDraw.Draw(canvas)
    top = (38, 38, 41)
    bottom = (14, 14, 15)
    for y in range(h):
        t = y / h
        r = round(top[0] + (bottom[0] - top[0]) * t)
        g = round(top[1] + (bottom[1] - top[1]) * t)
        b = round(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return canvas


def enhance_subject(subject_rgba):
    """Aplica la curva de marca solo al sujeto (RGB), preservando su alpha."""
    rgb = subject_rgba.convert("RGB")
    alpha = subject_rgba.split()[3]
    graded = enhance(
        rgb,
        max_long_edge=10_000,  # ya viene del tamano correcto, no recortar aqui
        cutoff=0.5,
        sharpen_percent=130,
        saturation=1.12,
        contrast=1.06,
        grade_strength=0.08,
    )
    return Image.merge("RGBA", (*graded.split(), alpha))


def add_contact_shadow(canvas, subject_bbox):
    left, top, right, bottom = subject_bbox
    shadow_w = int((right - left) * 0.8)
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    cx = (left + right) // 2
    draw.ellipse(
        [cx - shadow_w // 2, bottom - 18, cx + shadow_w // 2, bottom + 18],
        fill=(0, 0, 0, 140),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    return Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")


def process(path: Path):
    original = Image.open(path).convert("RGB")
    cutout = remove(original)  # RGBA con fondo transparente

    bbox = cutout.getbbox()
    if not bbox:
        return None
    subject = cutout.crop(bbox)

    canvas_w, canvas_h = CANVAS_SIZE
    target_h = int(canvas_h * 0.82)
    scale = target_h / subject.height
    subject = subject.resize((round(subject.width * scale), round(subject.height * scale)), Image.LANCZOS)
    subject = enhance_subject(subject)

    if subject.width > canvas_w * 0.9:
        # sujeto muy ancho (varias personas lado a lado): reescala por ancho
        scale2 = (canvas_w * 0.9) / subject.width
        subject = subject.resize((round(subject.width * scale2), round(subject.height * scale2)), Image.LANCZOS)

    backdrop = studio_backdrop(CANVAS_SIZE)
    x = (canvas_w - subject.width) // 2
    y = canvas_h - subject.height - int(canvas_h * 0.04)

    backdrop = add_contact_shadow(backdrop, (x, y, x + subject.width, y + subject.height))
    backdrop = backdrop.convert("RGBA")
    backdrop.alpha_composite(subject, (x, y))
    return backdrop.convert("RGB")


# Fotos panoramicas con varios sujetos separados por todo el encuadre
# (foto de rodaje/BTS): el recorte a bounding-box unico no funciona bien,
# se quedan con su tratamiento normal (ver enhance_images.py).
SKIP_STUDIO = {"community-10.png", "community-8.png"}


def main():
    files = (
        sorted(COMMUNITY_DIR.glob("*.jpeg"))
        + sorted(COMMUNITY_DIR.glob("*.jpg"))
        + sorted(COMMUNITY_DIR.glob("*.png"))
    )
    files = [f for f in files if f.name not in SKIP_STUDIO]
    print(f"Componiendo {len(files)} fotos sobre fondo de estudio...")
    for f in files:
        out = process(f)
        if out is None:
            print(f"  {f.name}: no se detecto sujeto, se omite")
            continue
        webp_path = f.with_suffix(".webp")
        out.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {f.name} -> {webp_path.name}")
    print("Listo.")


if __name__ == "__main__":
    main()
