<?php
/** Explicit, capability/nonce-checked import. Never runs during activation. */
defined( 'ABSPATH' ) || exit;

function mova_demo_menu() {
    add_theme_page( 'MOVA Motion', 'MOVA Motion', 'manage_woocommerce', 'mova-motion-demo', 'mova_demo_page' );
}
add_action( 'admin_menu', 'mova_demo_menu' );
function mova_demo_page() {
    if ( ! current_user_can( 'manage_woocommerce' ) ) {
        return;
    }
    ?>
    <div class="wrap"><h1>MOVA Motion / WooCommerce trial</h1>
    <p><?php echo esc_html( mova_text( 'התבנית משתמשת במוצרים, בווריאציות, במלאי, בעגלה ובתשלום של WooCommerce.', 'This theme uses WooCommerce products, variations, stock, cart and checkout.', 'القالب يستخدم منتجات ومتغيّرات ومخزون وسلة ودفع WooCommerce.' ) ); ?></p>
    <?php if ( isset( $_GET['mova_imported'] ) ) : ?><div class="notice notice-success"><p><?php echo esc_html( mova_text( 'הייבוא הסתיים. המוצרים החדשים נשמרו כטיוטות. אפשר למצוא אותם במסך המוצרים.', 'Import complete. New concepts were saved as drafts. Find them under Products.', 'اكتمل الاستيراد. حُفظت المنتجات الجديدة كمسودّات. تجدها في صفحة المنتجات.' ) ); ?></p></div><?php endif; ?>
    <h2><?php echo esc_html( mova_text( '12 מוצרי קונספט לניסיון', '12 concept products to try', '12 منتجًا تصوّريًا للتجربة' ) ); ?></h2>
    <p><?php echo esc_html( mova_text( 'הייבוא יוצר טיוטות עם תמונות, רכיבים, צבעים, מידות ומלאי לדוגמה. מוצרים קיימים והגדרות החנות לא ישתנו. המחירים הם מספרי הדגמה שתוכננו לשקל; מטבע החנות הנוכחי קובע את הסימון בפועל.', 'Import creates drafts with images, components, colours, sizes and sample stock. Existing products and store settings stay as they are. Demo price numbers were designed for ILS; your store currency determines the actual currency.', 'الاستيراد ينشئ مسودّات بصور ومكوّنات وألوان ومقاسات ومخزون تجريبي. لا يغيّر منتجاتك أو إعدادات المتجر. الأرقام أُعدّت للشيكل وعملة المتجر هي المعتمدة.' ) ); ?></p>
    <?php if ( class_exists( 'WooCommerce' ) ) : ?>
    <form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><input type="hidden" name="action" value="mova_import_demo"><?php wp_nonce_field( 'mova_import_demo' ); ?><p><label><input type="checkbox" name="mova_acknowledge" value="1" required> <?php echo esc_html( mova_text( 'אני מבין שאלו מוצרי קונספט לניסיון, והם יישמרו כטיוטות.', 'I understand these are fictional trial products, saved as drafts.', 'أفهم أن هذه منتجات تجريبية غير حقيقية وستُحفظ كمسودّات.' ) ); ?></label></p><?php submit_button( mova_text( 'ייבוא טיוטות לדוגמה', 'Import concept drafts', 'استيراد المسودّات التجريبية' ) ); ?></form>
    <?php else : ?><p><?php esc_html_e( 'Activate WooCommerce first.', 'mova-motion' ); ?></p><?php endif; ?>
    <h2><?php echo esc_html( mova_text( 'תצוגת 360° ורכיבים למוצרים שלך', 'Turntables and components for your products', 'عرض 360° ومكوّنات لمنتجاتك' ) ); ?></h2><p><?php echo esc_html( mova_text( 'בעריכת מוצר: נתוני מוצר ← MOVA 360°. בחרו אטלס מהמדיה ומלאו שורות ועמודות. הזינו רכיבים, רכיב אחד בשורה: שם | חומר | הסבר. מוצר ללא אטלס יציג גלריה רגילה.', 'Edit a product → Product data → MOVA 360°. Choose a turntable atlas and enter its columns/rows. Add components, one per line: Name | Material | Description. Products without an atlas retain their standard gallery.', 'حرّر المنتج ← بيانات المنتج ← MOVA 360°. اختر أطلس الزوايا وحدّد الأعمدة والصفوف. أضف المكوّنات، واحدًا بكل سطر: الاسم | المادة | الوصف. المنتجات بلا أطلس تحتفظ بالمعرض العادي.' ) ); ?></p>
    </div>
    <?php
}

function mova_import_attachment( $item ) {
    $filename = $item['id'] . '-mova-demo.webp';
    $path = get_template_directory() . '/assets/' . preg_replace( '#^assets/#', '', $item['image'] );
    $upload = wp_upload_bits( $filename, null, file_get_contents( $path ) );
    if ( ! empty( $upload['error'] ) ) {
        throw new RuntimeException( $upload['error'] );
    }
    $attachment = wp_insert_attachment( array( 'post_mime_type' => 'image/webp', 'post_title' => $item['code'] . ' concept', 'post_status' => 'inherit' ), $upload['file'], 0, true );
    if ( is_wp_error( $attachment ) ) {
        throw new RuntimeException( $attachment->get_error_message() );
    }
    require_once ABSPATH . 'wp-admin/includes/image.php';
    wp_update_attachment_metadata( $attachment, wp_generate_attachment_metadata( $attachment, $upload['file'] ) );
    update_post_meta( $attachment, '_wp_attachment_image_alt', $item['code'] . ' — AI concept / demo' );
    return $attachment;
}

function mova_import_concepts() {
    if ( ! class_exists( 'WC_Product_Variable' ) ) {
        throw new RuntimeException( 'WooCommerce is required.' );
    }
    $created = array();
    foreach ( mova_catalog()['products'] as $index => $item ) {
        $sku = 'MOVA-DEMO-' . strtoupper( $item['id'] );
        $existing = wc_get_product_id_by_sku( $sku );
        if ( $existing ) {
            continue; // Never overwrite or duplicate an existing product.
        }
        $product = new WC_Product_Variable();
        $product->set_name( '[DEMO] ' . $item['code'] . ' — ' . $item['title'][ mova_language() ] );
        $product->set_sku( $sku );
        $product->set_status( 'draft' );
        $product->set_catalog_visibility( 'visible' );
        $product->set_menu_order( $index );
        $product->set_description( $item['details'][ mova_language() ] );
        $product->set_short_description( $item['description'][ mova_language() ] . "\n\n" . mova_text( 'מוצר קונספט להדגמה בלבד.', 'Fictional concept product for demonstration only.', 'منتج تصوّري للعرض فقط.' ) );
        $attributes = array();
        foreach ( array( 'Colour' => array_column( $item['colors'], 'id' ), 'Size' => $item['sizes'] ) as $name => $options ) {
            $attribute = new WC_Product_Attribute();
            $attribute->set_name( $name );
            $attribute->set_options( $options );
            $attribute->set_visible( true );
            $attribute->set_variation( true );
            $attributes[] = $attribute;
        }
        $product->set_attributes( $attributes );
        $product->update_meta_data( '_mova_concept_key', $item['id'] );
        $product->update_meta_data( '_mova_demo_product', 'yes' );
        // Persist the parent first, so an interrupted run remains idempotent.
        $product->save();
        $created[] = $product->get_id();
        foreach ( $item['colors'] as $color ) {
            foreach ( $item['sizes'] as $size ) {
                $variation = new WC_Product_Variation();
                $variation->set_parent_id( $product->get_id() );
                $variation->set_attributes( array( 'colour' => $color['id'], 'size' => $size ) );
                $variation->set_regular_price( (string) $item['price'] );
                $variation->set_manage_stock( true );
                $variation->set_stock_quantity( absint( $item['inventory'][ $color['id'] ][ $size ] ?? 0 ) );
                $variation->set_backorders( 'no' );
                $variation->set_status( 'publish' );
                $variation->save();
            }
        }
        $product->set_image_id( mova_import_attachment( $item ) );
        $product->save();
        WC_Product_Variable::sync( $product->get_id() );
    }
    return $created;
}
function mova_import_action() {
    if ( ! current_user_can( 'manage_woocommerce' ) ) {
        wp_die( esc_html__( 'You do not have permission to import products.', 'mova-motion' ), '', array( 'response' => 403 ) );
    }
    check_admin_referer( 'mova_import_demo' );
    if ( empty( $_POST['mova_acknowledge'] ) ) {
        wp_die( esc_html__( 'Please confirm that these are trial products.', 'mova-motion' ), '', array( 'response' => 400 ) );
    }
    try {
        mova_import_concepts();
    } catch ( Throwable $error ) {
        wp_die( esc_html( $error->getMessage() ), esc_html__( 'Import stopped', 'mova-motion' ), array( 'response' => 500, 'back_link' => true ) );
    }
    wp_safe_redirect( admin_url( 'themes.php?page=mova-motion-demo&mova_imported=1' ) );
    exit;
}
add_action( 'admin_post_mova_import_demo', 'mova_import_action' );
