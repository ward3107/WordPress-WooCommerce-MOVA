# MOVA launch validation — 15 October 2026

## Portfolio

The portfolio package is based on the published MOVA version 8. Its source
checkout was synchronized from the Site's repository before packaging.

Passed:

- Actual storefront boot, cinematic opening, Skip, replay, focus handling,
  Escape, reduced motion, deep links, blocked storage and lifecycle cleanup.
- Fractional turntable drag, blending at the 360° seam, momentum math, frame
  coalescing, idle stop, gesture cancellation, pinch/pan integration, automatic
  rotation, motion pause, atlas decode caching/retry and disposal.
- Twelve products, variant availability, galleries, search/filter/sort,
  comparison, coupons, gift/delivery totals, address validation, all three
  languages, simulated checkout, order history and storage failure/tampering.
- Source asset references, 12 turntables × 12 distinct cells, translations,
  alpha channels, IDs, anchors and social metadata.
- Vercel configuration, converted security/cache headers, dynamic share origin,
  output structure, JavaScript syntax and ZIP integrity.

Vercel publication is **blocked**, not completed. Creating the project in the
connected account's default team returned HTTP 403 / forbidden. The mapped CLI
path also reported no access to that same account scope. No Vercel deployment,
production alias or Git connection was created. The existing public portfolio
remains at https://mova-motion-store.vasele66.chatgpt.site/.

## WooCommerce trial 0.1.0

Tested locally with WordPress **7.1.3**, WooCommerce **11.2.1**, PHP **8.3.6**
and MariaDB **10.11.14**. This was a disposable CLI test store at `mova.test`,
with outbound mail/requests blocked and an offline payment method. No real
customer data, payment service or charge was involved. QA runtime and database
files are not included in the installable theme.

Passed:

- Theme activation and PHP syntax checks.
- Explicit import of 12 draft variable products and 126 variations; Media
  Library images, turntables and components; re-import skips existing SKUs.
  Currency, payment, home-page and other captured options remain unchanged.
- Native sold-out rejection and in-stock cart addition. Changing a WooCommerce
  variation's price from 490 to 777 is reflected in the cart, independent of
  the static demo catalog.
- Quantity 2: subtotal 1554, 10% coupon discount 155.40, delivery 25, final
  total 1423.60. The native checkout created and persisted an order with these
  amounts; native cash-on-delivery processing changed its state to processing
  and reduced the selected variation's stock by 2.
- Native cart and checkout forms, including the checkout nonce, rendered.
- Twelve native product templates with 360 viewers, component tabs and native
  variation purchase forms; 12-card homepage; standard-gallery fallback for
  products without an atlas; stored component text is HTML-escaped.
- DOM checks on all 12 rendered product pages: rotation, zoom/reset, motion
  pause/resume, intro bypass on direct product links, replay/Skip and cleanup.
  The homepage's turntable lives within each product's image frame.
- Executed WooCommerce's own variation JavaScript against the rendered product
  form: the correct in-stock variation is selected and enabled; a sold-out
  variation disables add-to-cart.

The server test is `verification/woocommerce.test.php`; the rendered DOM/native
variation-script check is `verification/woocommerce-ui.test.cjs`. The former
refuses to run outside a local `mova.test` installation. The standard portfolio
tests remain in `verification/`.

## Remaining checks

No supported browser-control skill is available in this environment. Browser
pixels, responsive visual rendering, real-device touch, accessibility with
assistive technology, and device frame rates have not been verified. The DOM
tests do not establish rendering smoothness or image fidelity.

No third-party live payment gateway, customer email delivery, merchant-specific
shipping/tax setup, extension compatibility, production WordPress host, or
alternative WordPress/PHP/WooCommerce versions were certified. This package is
an installable trial for staging and further merchant integration.

The included concept turntables use 12 AI-generated views and crossfades. They
are not measured 3D models or an accurate dense real-product photoshoot. More
optical detail and more accurate intermediate viewpoints require better source
assets; increasing the zoom or frame rate cannot create that information.
