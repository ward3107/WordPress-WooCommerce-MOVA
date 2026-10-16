# MOVA Motion Store

An interactive ecommerce portfolio demo with a cinematic opening, 360° product views, pinch-to-zoom, and Hebrew, Arabic and English support.

## Deploy the portfolio on Vercel

1. In Vercel, choose **Add New → Project** and import **ward3107/WordPress-WooCommerce-MOVA**.
2. Select **main** and leave **Root Directory** at the repository root (`./`).
3. Use **Framework Preset: Other**, **Output Directory: dist**, and leave the build and install commands empty. These settings are included in `vercel.json`.
4. Click **Deploy**. No environment variables or database are needed for this demo.

The deployed storefront uses fictional products, simulated inventory and a browser-local checkout. It does not charge payments or create real orders. Vercel hosts this static portfolio; the separate WooCommerce theme requires a WordPress installation.

## Install the WooCommerce trial theme

Download [mova-motion-woocommerce.zip](downloads/mova-motion-woocommerce.zip), then in WordPress use **Appearance → Themes → Add New → Upload Theme**. Install and activate WooCommerce, activate MOVA Motion, and optionally import the 12 draft sample products under **Appearance → MOVA Motion**.

The theme uses native WooCommerce products, variations, stock, cart and checkout. Configure shipping, taxes and a payment provider in WordPress before accepting real orders. The importer creates drafts and skips matching existing SKUs.

- [WordPress installation and customization](integrations/wordpress/README.md)
- [Validation results and remaining checks](integrations/wordpress/VALIDATION.md)
- [Asset provenance](ASSETS.md)

## Features

- Skippable cinematic opening and reduced-motion support.
- Twelve products with 360° image sequences, rotation gestures and pinch zoom.
- Component/material descriptions, product options, filters and comparison.
- Hebrew/Arabic RTL and English LTR interfaces.
- Demo cart, discounts, shipping choices and checkout.
- Live branding studio with a business-name preview, three curated palettes, browser-local preferences and a WhatsApp inquiry link.
- Editorial MOVE, FOCUS and CARRY chapters, with a consistent product sheet for every catalog item.
- Separate WooCommerce trial theme with native commerce and media-library turntable configuration.

The 360° sequences contain twelve AI-generated concept views per product, with frame blending. They are not product scans or continuous 3D models. The MOVE 01 flagship study uses the original product image for its hero, opening and close-ups. The older approximate 3D lab remains archived in the source and is not loaded by the storefront. Zoom magnifies available image detail.

## Repository layout

- `dist/`: deployable HTML, CSS, JavaScript and self-hosted assets.
- `vercel.json`: static hosting and browser security headers.
- `integrations/wordpress/`: editable theme source and setup documentation.
- `downloads/`: installable WooCommerce theme ZIP.
- `data/`, `scripts/`: catalog and asset/packaging tooling.
- `verification/`: automated source, commerce and interaction checks.

## Development and verification

The storefront is buildless; serve `dist/` with a local static server. There are no runtime package installation steps.

```sh
node verification/cart.test.cjs
node verification/pricing.test.cjs
```

DOM suites require an independently installed `jsdom`; set `MOVA_DOM_MODULE` to its module directory, then run `verification/opening.test.cjs` `verification/spin.test.cjs`, or `verification/checkout.test.cjs` with Node. WordPress verification requires the isolated test environment described in the validation document.

Rebuild distributable packages with Python 3 and Node:

```sh
python3 scripts/package-launch-kit.py
```

After choosing a production domain, use `--origin https://your-domain.example` and copy the generated `launch-build/portfolio/dist/` contents into `dist/` to set canonical and social URLs. Until then, storefront sharing uses the visitor origin, canonical/og:url are omitted, and the social cover points to the original public demo asset.

Automated checks passed before handoff. Real-device touch performance, visual layout and production payment-provider behavior still require review.

## Flagship storefront and brand studio

The storefront includes a measured opening-to-hero transition, a large gesture-controlled stage and original-photo close-ups for MOVE 01. FOCUS and CARRY have their own editorial treatments, and all twelve products use the same spacious product sheet. All three languages and the existing twelve-product catalog remain available. Hero rotation loads on interaction; the original high-resolution image remains available when rotation fails. Offscreen rotation is stopped and reduced-motion preferences skip the handoff.

The storefront keeps the existing twelve source views per product. It does not fabricate extra angles or claim a scan-quality 3D model. A denser, consistently photographed or rendered turntable is the next asset-production step. The separately distributed WooCommerce ZIP is still the previously validated trial package.

Run `verification/flagship.test.cjs` with `MOVA_DOM_MODULE` set to jsdom for real-page startup, handoff cleanup, gesture, language and purchase checks. `verification/lab.test.cjs` exercises the archived V8 lab fixture. Physical-device touch performance and browser visual review remain required before design approval; automated DOM checks do not measure those.

The “Your brand here” studio previews a business name and a Terracotta, Forest or Cobalt palette. Applying it updates storefront branding locally; reset restores MOVA. Names are bounded plain text, saved preferences are validated, and the preview works when storage is blocked. The WhatsApp link includes the currently previewed name and palette; it does not send a message automatically. This customization belongs to the static portfolio; the separately downloadable WooCommerce trial has not been rebuilt with it.

Run `verification/brand-studio.test.cjs` with `MOVA_DOM_MODULE` set to jsdom for branding, palette contrast, persistence, language changes, catalog chapter selection and cart-preservation checks. Full-page startup, existing commerce and gesture checks also pass. V10 adds no new image assets; initial local resources are approximately 543 KB, with turntables still deferred until interaction. These are source-size and DOM checks, not measured mobile loading time, browser screenshots or physical-device performance.
