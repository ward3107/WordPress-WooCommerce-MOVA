<?php
defined( 'ABSPATH' ) || exit;

function mova_product_tab( $tabs ) {
    $tabs['mova_motion'] = array( 'label' => 'MOVA 360°', 'target' => 'mova_product_data', 'priority' => 80 );
    return $tabs;
}
add_filter( 'woocommerce_product_data_tabs', 'mova_product_tab' );

function mova_product_fields() {
    global $product_object;
    ?>
    <div id="mova_product_data" class="panel woocommerce_options_panel hidden">
    <p class="form-field"><?php echo esc_html( mova_text( 'תצוגת 360° דורשת תמונות של אותו מוצר מכל הזוויות, המסודרות באטלס אחד. תמונה רגילה לא יכולה לחשוף את גב המוצר.', 'A turntable needs consistent views of the same product, arranged in one image atlas. One flat photograph cannot reveal the back of an object.', 'عرض 360° يتطلّب زوايا متّسقة لنفس المنتج داخل صورة أطلس واحدة. صورة مسطّحة واحدة لا تكشف ظهر القطعة.' ) ); ?></p>
    <?php
    wp_nonce_field( 'mova_product_fields', 'mova_product_nonce' );
    woocommerce_wp_text_input( array( 'id' => '_mova_spin_attachment', 'type' => 'number', 'label' => __( 'Turntable image attachment ID', 'mova-motion' ), 'desc_tip' => true, 'description' => __( 'A Media Library image with equal square cells, ordered left to right, top to bottom. No gutters.', 'mova-motion' ), 'custom_attributes' => array( 'min' => 0, 'step' => 1 ) ) );
    ?>
    <p class="form-field"><button class="button" type="button" id="mova-select-atlas"><?php echo esc_html( mova_text( 'בחירת אטלס מספריית המדיה', 'Choose atlas from Media Library', 'اختر الأطلس من مكتبة الوسائط' ) ); ?></button></p>
    <?php
    woocommerce_wp_text_input( array( 'id' => '_mova_spin_columns', 'type' => 'number', 'label' => __( 'Atlas columns', 'mova-motion' ), 'value' => $product_object ? ( $product_object->get_meta( '_mova_spin_columns' ) ?: 4 ) : 4, 'custom_attributes' => array( 'min' => 1, 'max' => 12, 'step' => 1 ) ) );
    woocommerce_wp_text_input( array( 'id' => '_mova_spin_rows', 'type' => 'number', 'label' => __( 'Atlas rows', 'mova-motion' ), 'value' => $product_object ? ( $product_object->get_meta( '_mova_spin_rows' ) ?: 3 ) : 3, 'custom_attributes' => array( 'min' => 1, 'max' => 10, 'step' => 1 ) ) );
    woocommerce_wp_textarea_input( array( 'id' => '_mova_components', 'label' => __( 'Materials & components', 'mova-motion' ), 'description' => __( 'One component per line: Name | Material | Description. Plain text only.', 'mova-motion' ), 'rows' => 8 ) );
    ?>
    </div>
    <?php
}
add_action( 'woocommerce_product_data_panels', 'mova_product_fields' );

function mova_save_product_fields( $product ) {
    if ( ! current_user_can( 'edit_post', $product->get_id() ) || ! isset( $_POST['mova_product_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['mova_product_nonce'] ) ), 'mova_product_fields' ) ) {
        return;
    }
    $attachment = absint( $_POST['_mova_spin_attachment'] ?? 0 );
    if ( $attachment && ! wp_attachment_is_image( $attachment ) ) {
        $attachment = 0;
    }
    $product->update_meta_data( '_mova_spin_attachment', $attachment );
    $product->update_meta_data( '_mova_spin_columns', max( 1, min( 12, absint( $_POST['_mova_spin_columns'] ?? 4 ) ) ) );
    $product->update_meta_data( '_mova_spin_rows', max( 1, min( 10, absint( $_POST['_mova_spin_rows'] ?? 3 ) ) ) );
    $product->update_meta_data( '_mova_components', sanitize_textarea_field( wp_unslash( $_POST['_mova_components'] ?? '' ) ) );
}
add_action( 'woocommerce_admin_process_product_object', 'mova_save_product_fields' );

function mova_admin_assets( $hook ) {
    $screen = get_current_screen();
    if ( in_array( $hook, array( 'post.php', 'post-new.php' ), true ) && $screen && 'product' === $screen->post_type ) {
        wp_enqueue_media();
        wp_enqueue_script( 'mova-admin', mova_asset( 'admin.js' ), array( 'jquery', 'media-views' ), MOVA_MOTION_VERSION, true );
    }
}
add_action( 'admin_enqueue_scripts', 'mova_admin_assets' );
