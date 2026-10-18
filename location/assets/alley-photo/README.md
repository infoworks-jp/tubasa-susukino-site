# Photograph surfaces for the Yokocho interior

These 21 surfaces come from the user's 16 photographs supplied on 2026-10-18.
Capture date and surveyed dimensions are unknown. Only person-free shop surfaces
are published, not the original photographs. Signs, food photographs and printed
lettering retain their original pixels; no text or menus were generated.

`manifest.json` records each source image ID, measured four corners in the
1152 × 2048 upright preview, original dimensions, output dimensions and byte size.
`scripts/bake-alley-photos.py` applies the corresponding projective transform
using Pillow and NumPy. Run it from the repository root with the original renders
directory as its positional argument to reproduce these WebP files.

The 3D model uses the confirmed route order and approximate dimensions. It is
not a surveyed plan. In particular, stair count and corridor length are estimates.
Clothing, fixtures and architectural occlusion visible on a selected surface
remain photographic evidence rather than an inferred hidden room. The manga
renderer traces the same surfaces in line/tone modes; the GLB retains the maps.

Textures load together on the first indoor navigation request. A failed request
keeps the street scene visible and can be retried; exterior navigation cancels
the pending viewpoint change. They do not delay the initial street model.
