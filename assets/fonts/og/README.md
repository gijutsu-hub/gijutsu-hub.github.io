# Satori-safe font copies

Copies of the fonts one directory up with their `GSUB`, `GPOS` and `GDEF`
tables removed, used only by `src/app/opengraph-image.tsx`.

Satori — the renderer behind `next/og` — parses fonts with opentype.js, which
rejects some advanced OpenType layout lookups:

```
Error: lookupType: 7 - substFormat: 1 is not yet supported
```

Both Lato and DejaVu Sans Mono hit it, and the failure aborts the whole build.
Those tables drive ligatures, kerning pairs and glyph substitution. The card is
a few lines of Latin text at large sizes, so dropping them costs nothing
visible and makes the fonts parseable.

The originals are untouched and still used by the resume PDFs, where pdfkit
reads them without complaint.

Regenerate after replacing a font upstream:

```bash
python3 - <<'PY'
from fontTools.ttLib import TTFont
for name in ["Lato-Black.ttf", "Lato-Regular.ttf", "DejaVuSansMono.ttf"]:
    f = TTFont(f"assets/fonts/{name}")
    for t in ("GSUB", "GPOS", "GDEF"):
        if t in f: del f[t]
    f.save(f"assets/fonts/og/{name}")
PY
```
