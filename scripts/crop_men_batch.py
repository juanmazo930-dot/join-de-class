"""Crop the new Hombre screenshot batch into individual product images.

Splits multi-panel screenshots at their black divider bars and writes each
panel out as its own file (no color/filter changes - just crop + format).
"""
from PIL import Image
import numpy as np
import os

SRC = r"C:\Users\juanm\OneDrive\Desktop\camizas men"
DEST = r"C:\Users\juanm\Documents\join-de-class\src\assets\products"
HERO_DEST = r"C:\Users\juanm\Documents\join-de-class\src\assets\hero"
os.makedirs(HERO_DEST, exist_ok=True)


def find_dividers(im, thresh=80, min_width=4):
    arr = np.array(im.convert('RGB'))
    h, w, _ = arr.shape
    col_is_black = (arr.max(axis=(0, 2)) < thresh)
    runs = []
    x = 0
    while x < w:
        if col_is_black[x]:
            start = x
            while x < w and col_is_black[x]:
                x += 1
            end = x
            if end - start >= min_width:
                runs.append((start, end))
        else:
            x += 1
    return runs


def trim_border(im, thresh=15):
    arr = np.array(im.convert('RGB'))
    mask = arr.max(axis=2) > thresh
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any() or not cols.any():
        return im
    top, bottom = np.argmax(rows), len(rows) - 1 - np.argmax(rows[::-1])
    left, right = np.argmax(cols), len(cols) - 1 - np.argmax(cols[::-1])
    return im.crop((left, top, right + 1, bottom + 1))


def save_pair(im, dest_basename):
    im = im.convert('RGB')
    jpeg_path = os.path.join(DEST, dest_basename + '.jpeg')
    webp_path = os.path.join(DEST, dest_basename + '.webp')
    im.save(jpeg_path, 'JPEG', quality=92)
    im.save(webp_path, 'WEBP', quality=90)
    print('saved', dest_basename, im.size)


def split(fname, cuts, pad=12):
    im = Image.open(os.path.join(SRC, fname))
    w, h = im.size
    bounds = [0] + [((a + b) // 2) for a, b in cuts] + [w]
    segments = []
    for i in range(len(bounds) - 1):
        left = bounds[i] + (pad if i > 0 else 0)
        right = bounds[i + 1] - (pad if i < len(bounds) - 2 else 0)
        seg = im.crop((left, 0, right, h))
        segments.append(trim_border(seg))
    return segments


# --- Single-panel screenshots (direct front/back replacements) ---
SINGLE = {
    'Screenshot 2026-07-17 104853.png': 'hombre-blanca',
    'Screenshot 2026-07-17 104903.png': 'hombre-camel',
    'Screenshot 2026-07-17 104920.png': 'hombre-negra',
    'Screenshot 2026-07-17 104930.png': 'hombre-olivo',
    'Screenshot 2026-07-17 104943.png': 'hombre-roja',
    'Screenshot 2026-07-17 105008.png': 'hombre-rosario',
    'Screenshot 2026-07-17 105018.png': 'hombre-rosario-back',
    'Screenshot 2026-07-17 105030.png': 'hombre-palm-back',
    'Screenshot 2026-07-17 105041.png': 'hombre-palm',
}

for fname, dest in SINGLE.items():
    im = Image.open(os.path.join(SRC, fname))
    im = trim_border(im)
    save_pair(im, dest)

# --- Multi-panel screenshots ---
# 105123: [thumbnails column (skip)] [red back] [black back]
segs = split('Screenshot 2026-07-17 105123.png', [(252, 263), (724, 732)])
save_pair(segs[1], 'hombre-cvlt-rojo-back')
save_pair(segs[2], 'hombre-cvlt-negro-back')

# 105139: [back roses] [front rose crest]
segs = split('Screenshot 2026-07-17 105139.png', [(535, 554)])
save_pair(segs[0], 'hombre-floral-gold-back')
save_pair(segs[1], 'hombre-floral-gold')

# 105155: [front collar text - blanco] [back shoulder text - blanco]
segs = split('Screenshot 2026-07-17 105155.png', [(513, 531)])
save_pair(segs[0], 'hombre-ones-blanco')
save_pair(segs[1], 'hombre-ones-blanco-back')

# 105213: [back shoulder text - negro] [front collar text - negro]
segs = split('Screenshot 2026-07-17 105213.png', [(520, 540)])
save_pair(segs[0], 'hombre-ones-negro-back')
save_pair(segs[1], 'hombre-ones-negro')

# 105231: [front swirl logo] [back motivation shine]
segs = split('Screenshot 2026-07-17 105231.png', [(492, 511)])
save_pair(segs[0], 'hombre-motivation')
save_pair(segs[1], 'hombre-motivation-back')

# 105257: [back legends art] [front C logo]
segs = split('Screenshot 2026-07-17 105257.png', [(505, 534)])
save_pair(segs[0], 'hombre-legends-back')
save_pair(segs[1], 'hombre-legends')

# 105315: [back blank (skip)] [front join the class text]
segs = split('Screenshot 2026-07-17 105315.png', [(506, 522)])
save_pair(segs[1], 'hombre-celeste')

# 105340: [back statue of liberty] [front C + flag skull]
segs = split('Screenshot 2026-07-17 105340.png', [(508, 526)])
save_pair(segs[0], 'hombre-usa-back')
save_pair(segs[1], 'hombre-usa')

# 105356: [front graffiti logo] [back cupid angel]
segs = split('Screenshot 2026-07-17 105356.png', [(500, 522)])
save_pair(segs[0], 'hombre-cupido')
save_pair(segs[1], 'hombre-cupido-back')

# 105417: [front BAD text] [back dusk shade]
segs = split('Screenshot 2026-07-17 105417.png', [(492, 526)])
save_pair(segs[0], 'hombre-dusk')
save_pair(segs[1], 'hombre-dusk-back')

# --- Hero background: Aire Fresco ---
hero = Image.open(os.path.join(SRC, 'Screenshot 2026-07-17 105455.png')).convert('RGB')
hero.save(os.path.join(HERO_DEST, 'aire-fresco.jpg'), 'JPEG', quality=95)
hero.save(os.path.join(HERO_DEST, 'aire-fresco.webp'), 'WEBP', quality=92)
print('saved hero', hero.size)

print('DONE')
