<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f5ee"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'mova-motion' ); ?></a>
<div class="mova-announcement"><span>●</span> <?php echo esc_html( mova_text( 'עיצוב שמרגישים. סטייל בתנועה.', 'Good design. Good energy.', 'تصميم تشعر به. أسلوب يتحرّك.' ) ); ?><span dir="ltr">THE MOVA EDIT / 01</span></div>
<header class="mova-header">
    <div class="mova-brand"><?php if ( has_custom_logo() ) { the_custom_logo(); } else { ?><a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="MOVA" dir="ltr">mova<sup>®</sup></a><?php } ?></div>
    <nav aria-label="<?php esc_attr_e( 'Primary navigation', 'mova-motion' ); ?>"><?php if ( has_nav_menu( 'primary' ) ) { wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'depth' => 1 ) ); } else { ?><a href="<?php echo esc_url( mova_shop_url() ); ?>"><?php echo esc_html( mova_text( 'הקולקציה', 'The collection', 'المجموعة' ) ); ?></a><?php } ?></nav>
    <div class="mova-header-actions"><?php if ( function_exists( 'wc_get_page_permalink' ) ) : ?><a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>"><?php echo esc_html( mova_text( 'החשבון שלי', 'My account', 'حسابي' ) ); ?></a><?php mova_cart_link(); endif; ?><button type="button" data-mova-pause aria-pressed="false" aria-label="<?php echo esc_attr( mova_text( 'השהיית תנועה', 'Pause motion', 'إيقاف الحركة' ) ); ?>">Ⅱ</button></div>
</header>
