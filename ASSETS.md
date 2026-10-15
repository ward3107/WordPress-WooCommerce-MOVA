# Original imagery

The original catalog and editorial images were produced with the built-in Imagegen tool on 2026-10-14.
No CLI image model/API fallback was used. None is a photograph of an actual item for sale.
PNG alpha was retained when converting the cutouts to WebP. Optimization changes
format and dimensions, not product content. The editorial image has an opaque background.

| Final workspace path | Asset |
| --- | --- |
| `/workspace/sites/mova-flagship/dist/assets/sneaker.webp` | Cream/orange sneaker cutout |
| `/workspace/sites/mova-flagship/dist/assets/headphones.webp` | Ivory/peach headphone cutout |
| `/workspace/sites/mova-flagship/dist/assets/bag.webp` | Terracotta backpack cutout |
| `/workspace/sites/mova-flagship/dist/assets/editorial.webp` | Original fashion campaign |
| `/workspace/sites/mova-flagship/dist/assets/social-cover.jpg` | Code-composed social preview using sneaker cutout |

## Complete interactive 3D asset

`/workspace/sites/mova-flagship/dist/assets/move-solid-v4.glb` is built by
`scripts/build-solid-shoe.py`. The upper, opening, lining, tongue, laces, panels,
rocker sole, inserts and tread are authored as surfaces in shoe coordinates.
Five layer groups support separation and exact reassembly. The previous
image-derived shell was removed after it produced folded-looking surfaces
when viewed end-on. No whole-product photograph is projected onto this model.

The original `sneaker.webp` remains the hero and design reference. A small
66×43 pixel knit swatch is made periodic and reused with local repeating UVs
and a normal map. Separate standard PBR materials provide cream panels,
terracotta accents, graphite rubber and lining. Color selection changes only
the accent material. This is an approximation of the reference design, not
an exact scan or manufacturing/CAD data; the internals remain illustrative.

`move-solid-v4-poster.webp` is a render of the actual current assembly.
`scripts/render-solid.py` inspects the same meshes/UVs exported into the GLB.
Front, side, heel, toe, rear, top, underside and exploded views were reviewed.
The view sheet is `verification/move-solid-v4-review.jpg`. These are offscreen
asset renders, not browser screenshots. No third-party shoe mesh, external
texture or paid generation was used. Earlier Blender prototypes remain only
as historical source; they do not build the deployed asset.

## Image generation briefs

### Sneaker

Use case: product-mockup. Create a photorealistic luxury ecommerce product cutout of ONE fictional contemporary chunky running sneaker, off-white cream technical mesh and sculpted cream rubber sole, bold curved burnt-orange panel on the outer side, small dark charcoal details, elegant futuristic but plausible construction. Single shoe, full three-quarter outer-side view, toe pointing left, slightly tilted nose upward 12 degrees, beautifully detailed knit, stitches and sole channels. Pure transparent alpha background, no scene or pedestal, no extra objects, no cast shadow outside the shoe. Luxury studio softbox lighting, tactile real materials, premium advertising photography, extremely clean silhouette. Generous 8% empty margin around complete product. No existing logos or text, no Nike swoosh or recognizable branded pattern. Square composition.

### Headphones

Use case: product-mockup. Premium photorealistic ecommerce cutout of one pair of sculptural over-ear wireless headphones in warm ivory with peach-orange satin aluminum earcups, plush cream cushions, curved broad headband, three-quarter front view. Complete headphones centered with 10% margin. Very refined real industrial design, tactile soft leather and satin metal, premium studio lighting and crisp intricate details. Pure transparent alpha background. No pedestal, no extra objects, no text, no existing brand logos, no shadow outside the object. Square composition.

### Backpack

Use case: product-mockup. Premium photorealistic ecommerce cutout of one contemporary designer commuter backpack in terracotta burnt-orange technical canvas with structured sculptural silhouette, padded rounded front panel, minimal ivory zipper pull, two real shoulder straps and handle, refined stitching. Three-quarter front view, full complete bag centered with 10% margin. Soft sophisticated studio lighting, tactile canvas and realistic weave, fashion advertising photography. Pure transparent alpha background. No pedestal, no extra objects, no text, no existing brand logos, no shadow outside the object. Square composition.

### Editorial campaign

Use case: ads-marketing. A premium contemporary streetwear campaign photograph for a fictional lifestyle concept store. One adult female fashion model with short dark hair walking energetically down a sunlit modern pale concrete architectural staircase, wearing an oversized tangerine-orange technical jacket, loose cream trousers and cream chunky running sneakers with orange panels. She is naturally looking away, full body, candid confident movement. Warm Mediterranean afternoon sunlight, crisp natural shadows, sophisticated editorial photography, concrete geometry fills the scene, tactile clothing. A tiny touch of chartreuse through an architectural panel in the distant background. Wide landscape 3:2, model on right third, quieter pale concrete on left for website copy. Photorealistic, polished fashion art direction. No text, no brand logos, no watermark.

## Expanded catalog — 2026-10-15

Nine additional original cutouts were generated with built-in Imagegen, one
request per design. No CLI/API fallback was used. Final transparent WebP
assets are 1200×1200, centered by their alpha bounds; product content was
not otherwise changed. The complete subjects, shared prompt, source filenames
and final workspace paths are recorded in `verification/product-assets-v5.json`.

| Final asset under `/workspace/sites/mova-flagship/dist/assets/` | Design |
| --- | --- |
| `pace.webp` | Low court sneaker |
| `slide.webp` | Molded slides |
| `pulse.webp` | Earbuds and charging case |
| `echo.webp` | Woven portable speaker |
| `roam.webp` | Forest weekender |
| `orbit.webp` | Crescent crossbody |
| `form.webp` | Sage hoodie |
| `shell.webp` | Color-block windbreaker |
| `loop.webp` | Bottle and cap detail |

The GLB remains the V4 approximate model. V5 adds a visible original-photo/3D
comparison selector and explicitly identifies the approximation. It does not
claim that the mesh now reproduces the photographed shoe.

## Deferred detail photography — V6

Every product has a higher-quality WebP at
`/workspace/sites/mova-flagship/dist/assets/detail/<product-id>.webp`. These
1440×1440 derivatives use the original 1254×1254 PNG masters, WebP quality 95,
and the same alpha framing as the catalog. Only format, scale and centering
change; no generated or procedural product details were added. They load on
zoom or component selection and retain the lower-weight catalog cutout for
initial display. The derivation is in `scripts/build-detail-images.py`.
Magnification up to 12× exposes the existing source pixels; it is not a claim
of 12× more original detail or native 4K photography.

## Product turntables — V7

All twelve catalog designs have an individual transparent 4-column, 3-row
turntable atlas under `/workspace/sites/mova-flagship/dist/assets/spin/`.
Each atlas was generated with built-in Imagegen using the corresponding
original product photograph as its identity reference. The complete prompts,
original PNG filenames, output paths and dimensions are recorded in
`verification/spin-assets-v7.json`. PNGs were converted to WebP quality 93;
no procedural or mirrored views were substituted.

The viewer crops each frame at the measured alpha gutters recorded in
`data/spin-layouts.json`, keeping a constant scale across all twelve views.
This corrects uneven generated grid spacing without changing the product pixels.

These are generated concept viewpoints, with unseen surfaces inferred by the
image model. They are neither photographic captures of physical products nor
accurate 3D reconstructions. View spacing is approximate, so the UI reports
frame numbers rather than exact degrees. Each 1448×1086 atlas contains twelve
362px square frames; digital zoom does not create further source detail.
The original higher-quality photographs remain available for component/detail
inspection. LOOP rotates one closed bottle, omitting the auxiliary loose-cap
detail; SLIDE preserves a pair and PULSE an open case plus two earbuds.

Atlases are loaded on product opening or card/hero rotation, then shared across
viewers. They are excluded from initial page loading. The existing approximate
exploded shoe model remains separate and unchanged.

## V8 presentation changes

No product image pixels or new raster assets were generated. The existing
atlases supply two blended layers at fractional positions. Alpha-derived
centers/scales are stored as numeric framing in `data/spin-layouts.json` and
regenerated by `scripts/measure-spin-framing.py`. The cinematic opening reuses
`assets/sneaker.webp`, `assets/headphones.webp` and `assets/bag.webp` with CSS
lighting, title and camera-style motion. Source-view fidelity limits remain.
