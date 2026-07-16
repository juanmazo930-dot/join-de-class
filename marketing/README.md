# Marketing — Join the Class

Todo en esta carpeta se genera localmente con `scripts/generate_marketing.py`
usando Pillow + ffmpeg (herramientas open-source, sin costo, sin API keys,
sin límites de licencia). Nada de este proceso publica contenido en ninguna
red social automáticamente — solo prepara los archivos listos para subir.

## Regenerar

```bash
python scripts/generate_marketing.py            # solo imágenes de Instagram (rápido)
python scripts/generate_marketing.py --videos    # también genera todos los videos (~10-15 min)
```

Fuente de datos: `src/data/catalog.json` (debe mantenerse igual a
`src/data/products.js`). Fuentes de imagen: `src/assets/products/`.

## Estructura generada

```
marketing/
  instagram/
    manifest.json              # listado de todo lo generado
    <categoria>/<producto>/
      <color>.jpg              # tarjeta 1080x1350 lista para post
      <color>-caption.txt      # copy + hashtags sugeridos
  videos/
    products/<producto>.mp4    # reel individual, 4s, Ken Burns + overlay
    coleccion-hombre.mp4
    coleccion-mujer.mp4
    coleccion-conjuntos.mp4
    coleccion-completa.mp4
```

## Sobre "modelos con IA"

Se evaluó generar fotos de personas reales vistiendo las prendas
(virtual try-on). En este equipo no hay GPU dedicada, y ese tipo de modelo
(IDM-VTON, OOTDiffusion, etc.) generalmente lo requiere para tiempos de
generación razonables — en CPU un solo intento tomaría muchos minutos y el
resultado no sería confiable para catálogo completo. Además, usar fotos de
personas reales sacadas de internet como base tiene problemas de derechos
de imagen que no se resolvieron sin tu autorización explícita sobre modelos
concretos. Por eso el pipeline se quedó en mockups de producto (flat-lay),
que es lo que ya usa cualquier tienda profesional para su catálogo base.

Si más adelante quieres esa pieza, las opciones reales son:
1. Fotos de modelos propios/contratados (con derechos) que yo compongo.
2. Correr un modelo de try-on en una máquina con GPU (local o alquilada).

## Sobre publicar en Instagram

Este pipeline **prepara** el contenido, no lo publica. Publicar de verdad
requiere una app de Meta Developer + una cuenta de Instagram Business y un
access token — eso solo lo puedes crear tú desde tu cuenta. Si me das el
token, puedo escribir el script que sube el contenido vía la Graph API de
Instagram, pero cada publicación real necesita tu confirmación.
