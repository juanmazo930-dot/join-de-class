/**
 * Builds a tiny blurred SVG placeholder so images have a stable box
 * (avoids layout shift) before the real asset finishes loading.
 */
export function getPlaceholder(width = 400, height = 500, color = '#e5e5e5') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

export const lazyImageProps = {
  loading: 'lazy',
  decoding: 'async',
};
