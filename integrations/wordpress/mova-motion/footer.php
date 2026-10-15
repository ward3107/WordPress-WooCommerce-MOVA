<?php defined( 'ABSPATH' ) || exit; ?>
<footer class="mova-footer"><a class="mova-footer-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" dir="ltr">mova®</a><p><?php echo esc_html( mova_text( 'פריטים עם אופי. חנות בתנועה.', 'Objects with character. A store in motion.', 'قطع بطابعها الخاص. متجر يتحرّك.' ) ); ?></p><button class="intro-replay" id="replayOpening" type="button"><span aria-hidden="true">▶</span><?php echo esc_html( mova_text( 'לצפות בפתיח', 'Play the opening', 'شاهد الافتتاحية' ) ); ?></button><?php if ( function_exists( 'wc_privacy_policy_page_id' ) && wc_privacy_policy_page_id() ) : ?><a href="<?php echo esc_url( get_permalink( wc_privacy_policy_page_id() ) ); ?>"><?php esc_html_e( 'Privacy policy', 'mova-motion' ); ?></a><?php endif; ?></footer>
<?php get_template_part( 'template-parts/opening' ); ?>
<?php wp_footer(); ?>
</body></html>
