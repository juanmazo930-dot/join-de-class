"""
Generación local de material de marketing para Join the Class.

100% open-source y local: Pillow para composición de imagenes/frames y
ffmpeg para codificar video. No usa APIs de pago ni sube nada a ninguna
red social - solo prepara archivos en marketing/ listos para exportar.

Uso:
    python scripts/generate_marketing.py
"""
import json
import subprocess
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "src" / "data" / "catalog.json"
PRODUCTS_DIR = ROOT / "src" / "assets" / "products"
LOGO_PATH = ROOT / "src" / "assets" / "brand" / "logo-white.png"
LOGO_BLACK_PATH = ROOT / "src" / "assets" / "brand" / "logo-black.png"
OUT_VIDEOS = ROOT / "marketing" / "videos"
OUT_INSTAGRAM = ROOT / "marketing" / "instagram"

FONT_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
FONT_BLACK = Path(r"C:\Windows\Fonts\impact.ttf")

import shutil

_WINGET_FFMPEG = Path(
    r"C:\Users\juanm\AppData\Local\Microsoft\WinGet\Packages"
    r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
    r"\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
)
FFMPEG_BIN = shutil.which("ffmpeg") or (str(_WINGET_FFMPEG) if _WINGET_FFMPEG.exists() else "ffmpeg")

FRAME_W, FRAME_H = 1080, 1350  # Instagram feed 4:5
FPS = 24
PRODUCT_DURATION_S = 4
BRAND_BG = (13, 13, 13)
BRAND_ACCENT = (245, 245, 244)

HASHTAGS = (
    "#JoinTheClass #Streetwear #Madrid #OutfitOfTheDay #StreetStyle "
    "#UrbanFashion #OversizeFit #DropAlert #ExclusiveDrop"
)


def font(path, size):
    return ImageFont.truetype(str(path), size)


def load_catalog():
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def fit_cover(img, w, h):
    src_ratio = img.width / img.height
    dst_ratio = w / h
    if src_ratio > dst_ratio:
        new_h = h
        new_w = int(h * src_ratio)
    else:
        new_w = w
        new_h = int(w / src_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    return img.crop((left, top, left + w, top + h))


def branded_card(img, name, price, color, category, size=(FRAME_W, FRAME_H)):
    """Composite a product photo onto a branded card with logo + caption."""
    w, h = size
    canvas = Image.new("RGB", (w, h), BRAND_BG)

    photo_h = int(h * 0.78)
    photo = fit_cover(img, w, photo_h)
    canvas.paste(photo, (0, 0))

    # soft gradient at the bottom of the photo so text stays legible
    grad = Image.new("L", (1, photo_h), 0)
    for y in range(photo_h):
        t = max(0, (y - int(photo_h * 0.65)) / (photo_h * 0.35))
        grad.putpixel((0, y), int(255 * min(1, t)))
    grad = grad.resize((w, photo_h))
    shadow = Image.new("RGB", (w, photo_h), (0, 0, 0))
    canvas.paste(Image.composite(shadow, canvas.crop((0, 0, w, photo_h)), grad), (0, 0))

    draw = ImageDraw.Draw(canvas)

    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo.thumbnail((80, 80))
    canvas.paste(logo, (32, 32), logo)

    name_font = font(FONT_BLACK, 54)
    meta_font = font(FONT_BOLD, 32)
    price_font = font(FONT_BOLD, 44)

    text_y = photo_h + 24
    draw.text((36, text_y), name.upper(), font=name_font, fill=BRAND_ACCENT)
    draw.text(
        (36, text_y + 68),
        f"{category.upper()}  ·  COLOR {color.upper()}",
        font=meta_font,
        fill=(163, 163, 163),
    )
    draw.text((36, text_y + 112), f"{price} €", font=price_font, fill=BRAND_ACCENT)

    return canvas


def ken_burns_frames(photo, n_frames, w, h, zoom_start=1.0, zoom_end=1.18):
    base = fit_cover(photo, int(w * zoom_end) + 4, int(h * zoom_end) + 4)
    bw, bh = base.size
    for i in range(n_frames):
        t = i / max(1, n_frames - 1)
        zoom = zoom_start + (zoom_end - zoom_start) * t
        crop_w, crop_h = int(w * zoom / zoom_end), int(h * zoom / zoom_end)
        max_x, max_y = bw - crop_w, bh - crop_h
        x = int(max_x * t * 0.5)
        y = int(max_y * 0.5)
        frame = base.crop((x, y, x + crop_w, y + crop_h)).resize((w, h), Image.LANCZOS)
        yield frame


def overlay_caption(frame, name, price, t, fade_in_at=0.55):
    if t < fade_in_at:
        return frame
    alpha = min(1.0, (t - fade_in_at) / 0.15)
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    band_h = 220
    draw.rectangle(
        [0, frame.height - band_h, frame.width, frame.height],
        fill=(10, 10, 10, int(200 * alpha)),
    )
    name_font = font(FONT_BLACK, 58)
    price_font = font(FONT_BOLD, 40)
    draw.text(
        (40, frame.height - band_h + 40),
        name.upper(),
        font=name_font,
        fill=(255, 255, 255, int(255 * alpha)),
    )
    draw.text(
        (40, frame.height - band_h + 120),
        f"{price} €  ·  JOIN THE CLASS",
        font=price_font,
        fill=(220, 220, 220, int(255 * alpha)),
    )
    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def encode_video(frame_iter, out_path, w, h, fps):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        FFMPEG_BIN, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pixel_format", "rgb24",
        "-video_size", f"{w}x{h}", "-framerate", str(fps),
        "-i", "-",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(out_path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = 0
    for frame in frame_iter:
        proc.stdin.write(frame.tobytes())
        n += 1
    proc.stdin.close()
    proc.wait()
    return n


def build_product_video(product, variant, out_path):
    img = Image.open(PRODUCTS_DIR / variant["file"]).convert("RGB")
    n_frames = PRODUCT_DURATION_S * FPS

    def frames():
        for i, frame in enumerate(ken_burns_frames(img, n_frames, FRAME_W, FRAME_H)):
            t = i / max(1, n_frames - 1)
            frame = overlay_caption(frame, product["name"], product["price"], t)
            yield frame

    encode_video(frames(), out_path, FRAME_W, FRAME_H, FPS)


def build_collection_video(products, out_path, per_item_s=1.8):
    n_per = int(per_item_s * FPS)

    def frames():
        for product in products:
            variant = product["variants"][0]
            img = Image.open(PRODUCTS_DIR / variant["file"]).convert("RGB")
            for i, frame in enumerate(ken_burns_frames(img, n_per, FRAME_W, FRAME_H, 1.0, 1.12)):
                t = i / max(1, n_per - 1)
                frame = overlay_caption(frame, product["name"], product["price"], t, fade_in_at=0.35)
                yield frame

    encode_video(frames(), out_path, FRAME_W, FRAME_H, FPS)


def caption_for(product, variant):
    lines = [
        f"{product['name']} — color {variant['color']} 🖤",
        "",
        textwrap.fill(
            f"Nueva pieza de {product['category']} en Join the Class. "
            f"Tallas disponibles: {', '.join(product['sizes'])}. "
            f"Precio: {product['price']} €.",
            width=70,
        ),
        "",
        HASHTAGS,
    ]
    return "\n".join(lines)


def build_instagram_assets(catalog):
    manifest = []
    for product in catalog["products"]:
        for variant in product["variants"]:
            img = Image.open(PRODUCTS_DIR / variant["file"]).convert("RGB")
            card = branded_card(img, product["name"], product["price"], variant["color"], product["category"])
            out_dir = OUT_INSTAGRAM / product["category"].lower() / product["id"]
            out_dir.mkdir(parents=True, exist_ok=True)
            img_path = out_dir / f"{variant['color'].lower()}.jpg"
            card.save(img_path, quality=92)
            caption_path = out_dir / f"{variant['color'].lower()}-caption.txt"
            caption_path.write_text(caption_for(product, variant), encoding="utf-8")
            manifest.append(
                {
                    "product": product["name"],
                    "category": product["category"],
                    "color": variant["color"],
                    "price": product["price"],
                    "image": str(img_path.relative_to(ROOT)).replace("\\", "/"),
                    "caption": str(caption_path.relative_to(ROOT)).replace("\\", "/"),
                }
            )
    (OUT_INSTAGRAM / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return manifest


def main():
    if not FONT_BOLD.exists():
        print("Aviso: no se encontraron las fuentes de Windows; usando fuente por defecto de PIL.")

    catalog = load_catalog()
    products = catalog["products"]

    print(f"Generando assets de Instagram para {len(products)} productos...")
    manifest = build_instagram_assets(catalog)
    print(f"  -> {len(manifest)} imagenes + captions en {OUT_INSTAGRAM}")

    only_video = "--videos" in sys.argv or "--all" in sys.argv
    if only_video:
        print("Generando video individual por producto...")
        for product in products:
            variant = product["variants"][0]
            out_path = OUT_VIDEOS / "products" / f"{product['id']}.mp4"
            build_product_video(product, variant, out_path)
            print(f"  -> {out_path}")

        print("Generando reels por categoria...")
        categories = sorted({p["category"] for p in products})
        for cat in categories:
            items = [p for p in products if p["category"] == cat]
            out_path = OUT_VIDEOS / f"coleccion-{cat.lower()}.mp4"
            build_collection_video(items, out_path)
            print(f"  -> {out_path}")

        out_path = OUT_VIDEOS / "coleccion-completa.mp4"
        build_collection_video(products, out_path)
        print(f"  -> {out_path}")
    else:
        print("(Videos omitidos: pasa --videos para generarlos tambien, tarda mas)")

    print("\nListo. Nada se publico automaticamente: revisa marketing/ y sube manualmente.")


if __name__ == "__main__":
    main()
