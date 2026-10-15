<?php defined( 'ABSPATH' ) || exit; if ( post_password_required() ) { return; } ?>
<section class="mova-comments">
<?php if ( have_comments() ) : ?><h2><?php esc_html_e( 'Comments', 'mova-motion' ); ?></h2><ol><?php wp_list_comments( array( 'style' => 'ol', 'short_ping' => true ) ); ?></ol><?php the_comments_pagination(); endif; comment_form(); ?>
</section>
