# MOVA Motion — WooCommerce trial 0.1.0

This installable **classic WordPress theme** uses the native WooCommerce product,
variation, inventory, cart, account and checkout flows. It does not embed the
static demo's localStorage cart, simulated payment form or order history.

Install on a staging/test WordPress site with WooCommerce active. This is a first
integration trial, not a claim that all payment providers, extensions or devices
have been certified. The portfolio remains a separate static demo.

## Install

1. Extract `mova-launch-kit.zip` on your computer.
2. In WordPress, Appearance → Themes → Add New → Upload Theme, select the inner
   `mova-motion-woocommerce.zip`, install, then activate **MOVA Motion**.
3. Activate WooCommerce and complete its normal setup, including shop/cart/
   checkout/account pages. Configure currency, shipping, tax and payments in
   WooCommerce itself. The theme never changes these settings automatically.
4. The MOVA landing page appears at the homepage. The shop is WooCommerce's
   normal shop page. Choose the site language in Settings → General for Hebrew,
   Arabic or English theme copy and automatic RTL. Native WordPress/WooCommerce
   translations must be installed separately as usual.
5. Optional: Appearance → MOVA Motion → Import concept drafts. This explicitly
   creates 12 **draft** variable products with demo sizes, colours, stock,
   component descriptions and images. The price numbers were designed for ILS.
   The store's current currency is authoritative; the importer does not change it.
6. On your test store, publish the demo drafts you want to inspect. For purchase
   tests, use a gateway's test mode or an offline method on that test store.
   The concepts are fictional and are not real merchandise.

Activation does not import products, configure payment credentials, publish
products, replace existing catalog entries or change the site's URL.

## Your own products

Edit a WooCommerce product → Product data → **MOVA 360°**.

- Choose an image atlas from the WordPress Media Library; set its columns/rows.
  Cells must be equally sized squares, without gutters, ordered left to right,
  top to bottom over a full turn. For smoother, accurate real-product views use
  a consistent dense shoot, for example 48 or 72 angles. Maximum grid 12 × 10.
- Add materials as plain text, one per line:
  `Name | Material | Description`. Product pages add a component-details tab.
- Products without an atlas use the standard WooCommerce gallery.
- Native variation selections control the price and stock. The shared turntable
  is a product-level presentation and **does not simulate a selected colour**.
  Use actual variation images in WooCommerce to show each real variant.

Touch: one-finger horizontal drag rotates; pinch zooms 1–12×; once enlarged,
drag pans. Two taps reset/toggle a closer view. Mouse: drag rotates, double click
zooms; focused scroll wheel zooms. Keyboard: arrows rotate at 1×, +/- zoom,
0/Escape resets zoom, arrows pan when enlarged. Native gallery remains below the
viewer. Its lightbox/slider and WooCommerce variation image handling are retained.

The opening is skippable, has Escape support, plays once per tab, and respects
reduced motion. Deep product/cart/checkout/account pages bypass its automatic
playback; it can be replayed from the footer. Motion can be paused in the header.

## Demo assets and limitations

The 12 existing MOVA concept turntables contain 12 AI-generated source views
with fractional crossfading and momentum. They are not measured photography or
accurate continuous 3D; blends may ghost or change shape between views. Enlarging
an atlas does not create missing optical detail. Original AI concept product
images are included; see ASSETS.md. The original approximate shoe 3D breakdown
is in the portfolio, and is not ported into this theme trial.

The default landing-page editorial/hero imagery retains the MOVA concept
branding. Customize `front-page.php` and `template-parts/opening.php` or a child
theme when adapting it to a real merchant. A merchant's catalog, payments,
shipping, tax, policies and approved product imagery remain their store setup.

Importer behavior: existing matching `MOVA-DEMO-*` SKUs are skipped, never
overwritten. It does not delete other products. If a server interrupts an import
after saving a parent, the incomplete draft is retained and skipped on retry;
remove that specific incomplete draft before retrying it. Created images are
copied into the Media Library, not fetched from a third party. No automatic
cleanup runs on deactivation; imported drafts can be removed through Products.

## Developer references

- https://developer.woocommerce.com/docs/theming/theme-development/classic-theme-developer-handbook/
- https://developer.wordpress.org/themes/core-concepts/including-assets/
- https://woocommerce.com/document/variable-product/

See `VALIDATION.md` in the launch kit for the exact tested versions and results.
Use the recommended runtime requirements for the installed WooCommerce release:
https://woocommerce.com/document/server-requirements/
