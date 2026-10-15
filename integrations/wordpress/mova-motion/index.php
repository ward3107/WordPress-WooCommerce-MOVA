<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="main" class="mova-container mova-content">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<?php if ( is_singular() ) { the_title( '<h1>', '</h1>' ); } else { the_title( '<h2><a href="' . esc_url( get_permalink() ) . '">', '</a></h2>' ); } ?>
<?php the_content(); wp_link_pages(); if ( is_singular() && ( comments_open() || get_comments_number() ) ) { comments_template(); } ?>
</article>
<?php endwhile; the_posts_pagination(); else : ?><h1><?php esc_html_e( 'Nothing found', 'mova-motion' ); ?></h1><?php get_search_form(); endif; ?>
</main><?php get_footer(); ?>
