<?php
/** Run ONLY in an isolated disposable WordPress + WooCommerce test install.
 * wp eval-file /absolute/path/verification/woocommerce.test.php --user=1
 * No network gateway is used. This creates drafts and a local COD test order.
 */
if ( ! defined( 'WP_CLI' ) || ! WP_CLI || 'local' !== wp_get_environment_type() || 'mova.test' !== wp_parse_url( home_url(), PHP_URL_HOST ) ) {
    throw new RuntimeException( 'Refusing to run outside the isolated mova.test local QA install.' );
}
function mova_check( $condition, $message ) {
    if ( ! $condition ) {
        throw new RuntimeException( 'FAIL: ' . $message );
    }
}
global $wp_version;
$_SERVER['SERVER_NAME'] = 'mova.test';
$versions = array( 'wordpress' => $wp_version, 'woocommerce' => WC_VERSION, 'php' => PHP_VERSION );
$original = array();
foreach ( array( 'woocommerce_currency', 'woocommerce_default_country', 'woocommerce_cod_settings', 'show_on_front', 'page_on_front' ) as $key ) {
    $original[ $key ] = get_option( $key );
}
$created = mova_import_concepts();
mova_check( 12 === count( $created ), '12 new concept parents created' );
$variants = 0;
foreach ( $created as $id ) {
    $p = wc_get_product( $id );
    mova_check( 'draft' === $p->get_status(), 'imports stay drafts' );
    mova_check( $p->is_type( 'variable' ), 'native variable products' );
    mova_check( wp_attachment_is_image( $p->get_image_id() ), 'Media Library image attached' );
    mova_check( count( mova_components( $p ) ) >= 3, 'component information present' );
    mova_check( 12 === mova_spin_spec( $p )['frames'], '12-view turntable assigned' );
    $variants += count( $p->get_children() );
}
mova_check( array() === mova_import_concepts(), 're-import skips existing SKUs' );
foreach ( $original as $key => $value ) {
    mova_check( get_option( $key ) === $value, 'import preserves option ' . $key );
}
WP_CLI::log( 'PASS: 12 draft products, ' . $variants . ' native variations, media, components and turntables; idempotent import; store settings preserved' );

// The rest of this file configures only the guarded disposable QA store.
update_option( 'woocommerce_currency', 'ILS' );
update_option( 'woocommerce_default_country', 'IL' );
update_option( 'woocommerce_calc_taxes', 'no' );
update_option( 'woocommerce_cod_settings', array( 'enabled' => 'yes', 'title' => 'QA offline payment', 'enable_for_virtual' => 'yes', 'enable_for_methods' => array() ) );
update_option( 'woocommerce_enable_guest_checkout', 'yes' );
foreach ( $created as $id ) {
    $p = wc_get_product( $id );
    $p->set_status( 'publish' );
    $p->save();
}
WC_Install::create_pages();
if ( ! WC()->session ) {
    WC()->initialize_session();
}
if ( ! WC()->cart ) {
    WC()->initialize_cart();
}
WC()->cart->empty_cart();
WC()->customer->set_billing_country( 'IL' );
WC()->customer->set_shipping_country( 'IL' );
WC()->customer->set_shipping_city( 'Haifa' );
WC()->customer->set_shipping_address_1( '1 Test Street' );
WC()->customer->set_shipping_postcode( '3100000' );
WC()->customer->set_calculated_shipping( true );
WC()->customer->save();
$parent = wc_get_product( wc_get_product_id_by_sku( 'MOVA-DEMO-MOVE' ) );
$choice = null;
$sold_out = null;
foreach ( $parent->get_children() as $id ) {
    $v = wc_get_product( $id );
    if ( $v->get_stock_quantity() >= 4 && ! $choice ) {
        $choice = $v;
    }
    if ( 0 === $v->get_stock_quantity() ) {
        $sold_out = $v;
    }
}
mova_check( $choice && $sold_out, 'in-stock and sold-out variations found' );
$reject = WC()->cart->add_to_cart( $parent->get_id(), 1, $sold_out->get_id(), $sold_out->get_variation_attributes() );
mova_check( false === $reject, 'WooCommerce rejects sold-out variant' );
wc_clear_notices();
$choice->set_regular_price( '777' );
$choice->save();
WC_Product_Variable::sync( $parent->get_id() );
$stock_before = $choice->get_stock_quantity();
$key = WC()->cart->add_to_cart( $parent->get_id(), 2, $choice->get_id(), $choice->get_variation_attributes() );
mova_check( (bool) $key, 'native variation added to cart' );
$zone = new WC_Shipping_Zone( 0 );
$shipping_id = $zone->add_shipping_method( 'flat_rate' );
update_option( 'woocommerce_flat_rate_' . $shipping_id . '_settings', array( 'enabled' => 'yes', 'title' => 'QA delivery', 'tax_status' => 'none', 'cost' => '25' ) );
WC()->session->set( 'chosen_shipping_methods', array( 'flat_rate:' . $shipping_id ) );
$coupon = new WC_Coupon();
$coupon->set_code( 'mova-qa-ten' );
$coupon->set_discount_type( 'percent' );
$coupon->set_amount( 10 );
$coupon->save();
mova_check( WC()->cart->apply_coupon( 'mova-qa-ten' ), 'native coupon applied' );
WC()->cart->calculate_totals();
mova_check( abs( WC()->cart->get_subtotal() - 1554 ) < .001, 'WooCommerce price wins over demo catalog price' );
mova_check( abs( WC()->cart->get_discount_total() - 155.4 ) < .001, 'server discount total' );
mova_check( abs( WC()->cart->get_shipping_total() - 25 ) < .001, 'native shipping total' );
mova_check( abs( (float) WC()->cart->get_total( 'edit' ) - 1423.6 ) < .001, 'server order total' );
ob_start();
WC_Shortcode_Cart::output( array() );
$cart_html = ob_get_clean();
mova_check( false !== strpos( $cart_html, 'woocommerce-cart-form' ), 'native cart form renders' );
ob_start();
WC_Shortcode_Checkout::output( array() );
$checkout_html = ob_get_clean();
mova_check( false !== strpos( $checkout_html, 'woocommerce-process-checkout-nonce' ), 'native checkout with nonce renders' );
$order_id = WC()->checkout()->create_order( array( 'billing_first_name' => 'MOVA', 'billing_last_name' => 'QA', 'billing_email' => 'mova-qa@example.test', 'billing_country' => 'IL', 'billing_address_1' => '1 Test Street', 'billing_city' => 'Haifa', 'billing_postcode' => '3100000', 'shipping_country' => 'IL', 'shipping_address_1' => '1 Test Street', 'shipping_city' => 'Haifa', 'shipping_postcode' => '3100000', 'payment_method' => 'cod' ) );
mova_check( ! is_wp_error( $order_id ) && $order_id, 'native checkout creates persisted order: ' . ( is_wp_error( $order_id ) ? $order_id->get_error_message() : (string) $order_id ) );
$order = wc_get_order( $order_id );
mova_check( abs( (float) $order->get_total() - 1423.6 ) < .001 && 1 === count( $order->get_items() ), 'persisted order matches authoritative cart total and items' );
$gateway = WC()->payment_gateways()->payment_gateways()['cod'];
$result = $gateway->process_payment( $order_id );
mova_check( 'success' === $result['result'], 'offline gateway accepts QA order' );
$order = wc_get_order( $order_id );
mova_check( in_array( $order->get_status(), array( 'processing', 'on-hold' ), true ), 'native order state changes' );
mova_check( wc_get_product( $choice->get_id() )->get_stock_quantity() === $stock_before - 2, 'native order reduces variation inventory' );
WP_CLI::log( 'PASS: sold-out blocking; variation selection data; server pricing; quantity; coupon; shipping; native cart/checkout forms; persisted COD order; stock reduction' );

$dir = getenv( 'MOVA_WP_QA_ARTIFACTS' );
mova_check( $dir && is_dir( $dir ), 'QA output directory supplied' );
foreach ( $created as $id ) {
    $GLOBALS['wp_query'] = new WP_Query( array( 'post_type' => 'product', 'p' => $id ) );
    $GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
    $GLOBALS['post'] = get_post( $id );
    setup_postdata( $GLOBALS['post'] );
    $GLOBALS['product'] = wc_get_product( $id );
    ob_start();
    load_template( get_template_directory() . '/header.php', false );
    do_action( 'woocommerce_before_main_content' );
    wc_get_template_part( 'content', 'single-product' );
    do_action( 'woocommerce_after_main_content' );
    load_template( get_template_directory() . '/footer.php', false );
    $html = ob_get_clean();
    mova_check( false !== strpos( $html, 'data-mova-spec=' ), 'product viewer renders' );
    mova_check( false !== strpos( $html, 'mova-components' ), 'component tab renders' );
    mova_check( false !== strpos( $html, 'variations_form' ), 'native add-to-cart variation form renders' );
    file_put_contents( $dir . '/' . mova_concept( $GLOBALS['product'] )['id'] . '.html', $html );
    wp_reset_postdata();
}
$simple = new WC_Product_Simple();
$simple->set_name( 'Normal product with no turntable' );
$simple->set_regular_price( '50' );
$simple->set_status( 'draft' );
$simple->save();
mova_check( null === mova_spin_spec( $simple ), 'ordinary products retain native gallery' );
$simple->update_meta_data( '_mova_components', '<script>alert(1)</script> | Cotton | <b>plain text</b>' );
$simple->save();
$GLOBALS['product'] = $simple;
ob_start();
mova_render_components();
$components = ob_get_clean();
mova_check( false === strpos( $components, '<script>' ) && false !== strpos( $components, '&lt;script&gt;' ), 'component output escapes stored text' );
$GLOBALS['wp_query'] = new WP_Query( array( 'post_type' => 'post' ) );
$GLOBALS['wp_query']->is_home = true;
$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
ob_start();
load_template( get_template_directory() . '/header.php', false );
include get_template_directory() . '/front-page.php';
load_template( get_template_directory() . '/footer.php', false );
$home = ob_get_clean();
mova_check( false !== strpos( $home, 'data-mova-card-spec' ) && substr_count( $home, 'woocommerce-LoopProduct-link' ) >= 12, 'homepage displays catalog with card turntables' );
file_put_contents( $dir . '/home.html', $home );
file_put_contents( $dir . '/cart.html', $cart_html );
file_put_contents( $dir . '/checkout.html', $checkout_html );
file_put_contents( $dir . '/versions.json', wp_json_encode( array_merge( $versions, array( 'parents' => count( $created ), 'variations' => $variants, 'order_status' => $order->get_status(), 'total' => $order->get_total() ) ), JSON_PRETTY_PRINT ) );
WP_CLI::log( 'PASS: 12 native product templates with component tabs and turntables; 12-card homepage; ordinary-product fallback; escaped component text' );
WP_CLI::success( 'MOVA WooCommerce server integration checks passed: ' . wp_json_encode( $versions ) );
