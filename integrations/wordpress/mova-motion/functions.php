<?php
/** MOVA Motion: presentation on top of native WordPress and WooCommerce. */
defined( 'ABSPATH' ) || exit;
define( 'MOVA_MOTION_VERSION', '0.1.0' );

function mova_language() {
    $language = substr( determine_locale(), 0, 2 );
    return in_array( $language, array( 'he', 'ar' ), true ) ? $language : 'en';
}
function mova_text( $he, $en, $ar ) {
    return array( 'he' => $he, 'en' => $en, 'ar' => $ar )[ mova_language() ];
}
function mova_asset( $path ) {
    return get_template_directory_uri() . '/assets/' . ltrim( $path, '/' );
}
function mova_catalog() {
    static $catalog;
    if ( null === $catalog ) {
        $catalog = json_decode( file_get_contents( get_template_directory() . '/data/catalog.json' ), true );
        $catalog = is_array( $catalog ) ? $catalog : array( 'products' => array() );
    }
    return $catalog;
}
function mova_concept( $product ) {
    $key = $product ? $product->get_meta( '_mova_concept_key' ) : '';
    foreach ( mova_catalog()['products'] as $item ) {
        if ( $item['id'] === $key ) {
            return $item;
        }
    }
    return null;
}
function mova_setup() {
    load_theme_textdomain( 'mova-motion', get_template_directory() . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array( 'height' => 70, 'width' => 220, 'flex-width' => true ) );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'woocommerce', array( 'thumbnail_image_width' => 600, 'single_image_width' => 1000, 'product_grid' => array( 'default_columns' => 3 ) ) );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
    register_nav_menus( array( 'primary' => __( 'Primary navigation', 'mova-motion' ) ) );
}
add_action( 'after_setup_theme', 'mova_setup' );

function mova_enqueue() {
    wp_enqueue_style( 'mova-motion', get_stylesheet_uri(), array(), MOVA_MOTION_VERSION );
    wp_enqueue_style( 'mova-storefront', mova_asset( 'theme.css' ), array( 'mova-motion' ), MOVA_MOTION_VERSION );
    wp_enqueue_style( 'mova-spin', mova_asset( 'product-spin.css' ), array(), MOVA_MOTION_VERSION );
    wp_enqueue_style( 'mova-cinema', mova_asset( 'cinematic-opening.css' ), array(), MOVA_MOTION_VERSION );
    wp_enqueue_script( 'mova-spin', mova_asset( 'product-spin.js' ), array(), MOVA_MOTION_VERSION, true );
    wp_enqueue_script( 'mova-zoom', mova_asset( 'product-zoom.js' ), array(), MOVA_MOTION_VERSION, true );
    wp_enqueue_script( 'mova-cinema', mova_asset( 'cinematic-opening.js' ), array(), MOVA_MOTION_VERSION, true );
    wp_enqueue_script( 'mova-storefront', mova_asset( 'theme.js' ), array( 'mova-spin', 'mova-zoom', 'mova-cinema', 'jquery' ), MOVA_MOTION_VERSION, true );
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'mova_enqueue' );

function mova_shop_url() {
    return function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
}
function mova_cart_link() {
    if ( ! function_exists( 'WC' ) ) {
        return;
    }
    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
    echo '<a class="mova-cart-link" href="' . esc_url( wc_get_cart_url() ) . '" aria-label="' . esc_attr__( 'Shopping cart', 'mova-motion' ) . '"><span aria-hidden="true">⌑</span> <span class="mova-cart-count">' . esc_html( (string) $count ) . '</span></a>';
}
function mova_cart_fragments( $fragments ) {
    ob_start();
    mova_cart_link();
    $fragments['a.mova-cart-link'] = ob_get_clean();
    return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'mova_cart_fragments' );

function mova_wrapper_start() {
    echo '<main id="main" class="mova-container mova-commerce">';
}
function mova_wrapper_end() {
    echo '</main>';
}
function mova_woocommerce_hooks() {
    remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
    remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
    remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
    add_action( 'woocommerce_before_main_content', 'mova_wrapper_start', 10 );
    add_action( 'woocommerce_after_main_content', 'mova_wrapper_end', 10 );
    add_action( 'woocommerce_before_shop_loop_item_title', 'mova_loop_visual', 9 );
    add_action( 'woocommerce_before_shop_loop_item_title', 'mova_loop_visual_end', 11 );
    add_action( 'woocommerce_before_single_product_summary', 'mova_single_viewer', 15 );
    add_filter( 'woocommerce_product_tabs', 'mova_component_tab' );
}
add_action( 'after_setup_theme', 'mova_woocommerce_hooks', 20 );

/** Return an explicitly assigned turntable. Ordinary products keep their gallery. */
function mova_spin_spec( $product ) {
    if ( ! $product ) {
        return null;
    }
    $attachment = absint( $product->get_meta( '_mova_spin_attachment' ) );
    if ( $attachment ) {
        $url = wp_get_attachment_image_url( $attachment, 'full' );
        $columns = max( 1, min( 12, absint( $product->get_meta( '_mova_spin_columns' ) ?: 4 ) ) );
        $rows = max( 1, min( 10, absint( $product->get_meta( '_mova_spin_rows' ) ?: 3 ) ) );
        return $url ? array( 'src' => $url, 'columns' => $columns, 'rows' => $rows, 'frames' => $columns * $rows ) : null;
    }
    $item = mova_concept( $product );
    if ( ! $item || empty( $item['spin'] ) ) {
        return null;
    }
    $spec = $item['spin'];
    $spec['src'] = mova_asset( preg_replace( '#^assets/#', '', $spec['src'] ) );
    return $spec;
}
function mova_poster( $product ) {
    $url = wp_get_attachment_image_url( $product->get_image_id(), 'full' );
    $item = mova_concept( $product );
    return $url ?: ( $item ? mova_asset( preg_replace( '#^assets/#', '', $item['image'] ) ) : wc_placeholder_img_src() );
}
function mova_loop_visual() {
    global $product;
    if ( ! $product ) {
        return;
    }
    $spec = mova_spin_spec( $product );
    echo '<span class="mova-loop-visual"' . ( $spec ? ' data-mova-card-spec="' . esc_attr( wp_json_encode( $spec ) ) . '"' : '' ) . '>';
}
function mova_loop_visual_end() {
    global $product;
    if ( $product ) {
        echo '</span>';
    }
}
function mova_single_viewer() {
    global $product;
    $spec = mova_spin_spec( $product );
    if ( ! $spec ) {
        return;
    }
    // The native gallery remains as an alternative and a no-JavaScript fallback.
    ?>
    <section class="mova-viewer" aria-label="<?php echo esc_attr__( 'Interactive product view', 'mova-motion' ); ?>">
        <div class="mova-product-viewport" tabindex="0" role="group" aria-label="<?php echo esc_attr( mova_text( 'גררו לסיבוב. צבטו בשתי אצבעות להגדלה. חצים לסיבוב ופלוס ומינוס להגדלה במקלדת.', 'Drag to rotate. Pinch to zoom. Arrow keys rotate; plus and minus zoom.', 'اسحب للتدوير. قرّب بإصبعين. الأسهم للتدوير وزرّا الجمع والطرح للتكبير.' ) ); ?>" data-mova-spec="<?php echo esc_attr( wp_json_encode( $spec ) ); ?>">
            <span class="mova-viewer-word" aria-hidden="true">MOVE</span>
            <div class="product-image-track"><img src="<?php echo esc_url( mova_poster( $product ) ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" width="1000" height="1000" decoding="async"></div>
            <output class="mova-zoom-level" aria-label="<?php esc_attr_e( 'Magnification', 'mova-motion' ); ?>">1.0×</output>
        </div>
        <div class="mova-viewer-controls"><span>360° / DESIGN LAB</span><button type="button" data-mova-auto aria-pressed="false"><?php echo esc_html( mova_text( 'סיבוב אוטומטי', 'Auto rotate', 'تدوير تلقائي' ) ); ?></button><button type="button" data-mova-reset><?php echo esc_html( mova_text( 'איפוס', 'Reset', 'إعادة ضبط' ) ); ?></button></div>
        <p class="mova-viewer-hint" role="status"><?php echo esc_html( mova_text( 'אצבע אחת לסיבוב · שתי אצבעות להגדלה עד פי 12', 'One finger rotates · two fingers zoom up to 12×', 'إصبع واحد للتدوير · إصبعان للتكبير حتى 12×' ) ); ?></p>
        <?php if ( mova_concept( $product ) ) : ?><small><?php echo esc_html( mova_text( 'המחשת קונספט מ־12 זוויות שנוצרו ב־AI. הזום מגדיל את התמונה ואינו מוסיף פרטים.', 'AI concept turntable with 12 source views. Zoom enlarges the image; it adds no detail.', 'عرض تصوّري من 12 زاوية مولّدة. التكبير لا يضيف تفاصيل جديدة.' ) ); ?></small><?php endif; ?>
    </section>
    <?php
}
function mova_components( $product ) {
    $raw = $product ? $product->get_meta( '_mova_components' ) : '';
    $items = array();
    if ( $raw ) {
        foreach ( preg_split( '/\R/u', $raw ) as $line ) {
            $parts = array_map( 'trim', explode( '|', $line, 3 ) );
            if ( ! empty( $parts[0] ) ) {
                $items[] = array( 'label' => $parts[0], 'material' => $parts[1] ?? '', 'detail' => $parts[2] ?? '' );
            }
        }
        return $items;
    }
    $item = mova_concept( $product );
    foreach ( $item['components'] ?? array() as $component ) {
        $entry = array();
        foreach ( array( 'label', 'material', 'detail' ) as $field ) {
            $entry[ $field ] = $component[ $field ][ mova_language() ] ?? $component[ $field ]['en'] ?? '';
        }
        $items[] = $entry;
    }
    return $items;
}
function mova_component_tab( $tabs ) {
    global $product;
    if ( mova_components( $product ) ) {
        $tabs['mova_components'] = array( 'title' => mova_text( 'ממה זה מורכב', 'Materials & components', 'المواد والمكوّنات' ), 'priority' => 15, 'callback' => 'mova_render_components' );
    }
    return $tabs;
}
function mova_render_components() {
    global $product;
    echo '<div class="mova-components">';
    foreach ( mova_components( $product ) as $index => $item ) {
        echo '<article><span class="mova-component-number">' . esc_html( sprintf( '%02d', $index + 1 ) ) . '</span><h3>' . esc_html( $item['label'] ) . '</h3><strong>' . esc_html( $item['material'] ) . '</strong><p>' . esc_html( $item['detail'] ) . '</p></article>';
    }
    echo '</div>';
}

require get_template_directory() . '/inc/product-fields.php';
require get_template_directory() . '/inc/demo-import.php';
