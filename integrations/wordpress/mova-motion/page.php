<?php defined( 'ABSPATH' ) || exit; get_header(); ?>
<main id="main" class="mova-container mova-content">
<?php while ( have_posts() ) : the_post(); ?><article id="post-<?php the_ID(); ?>" <?php post_class(); ?>><?php the_title( '<h1>', '</h1>' ); the_content(); wp_link_pages(); ?></article><?php endwhile; ?>
</main><?php get_footer(); ?>
