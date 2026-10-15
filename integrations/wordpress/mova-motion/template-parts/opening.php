<?php defined( 'ABSPATH' ) || exit; ?>
<dialog class="cinematic-opening" id="cinematicOpening" aria-modal="true" aria-labelledby="introTitle" aria-describedby="introDescription">
<h2 class="sr-only" id="introTitle"><?php echo esc_html( mova_text( 'MOVA — הפתיח', 'MOVA — the opening', 'MOVA — الافتتاحية' ) ); ?></h2>
<p class="sr-only" id="introDescription"><?php echo esc_html( mova_text( 'פתיח קצר. אפשר לדלג בכל רגע.', 'A short product opening. Skip at any time.', 'افتتاحية قصيرة. يمكنك التخطي في أي وقت.' ) ); ?></p>
<div class="cinema-header"><span>MOVA STUDIOS / 01</span><button class="cinema-skip" id="skipOpening" type="button"><span><?php echo esc_html( mova_text( 'כניסה לחנות', 'Enter the store', 'ادخل المتجر' ) ); ?></span><span aria-hidden="true">↗</span></button></div>
<div class="cinema-stage" aria-hidden="true"><div class="cinema-light"></div><div class="cinema-halo"></div><div class="cinema-word"><span>m</span><span>o</span><span>v</span><span>a</span></div><span class="cinema-kicker">OBJECTS. IN MOTION.</span>
<div class="cinema-product cinema-product-left"><img src="<?php echo esc_url( mova_asset( 'headphones.webp' ) ); ?>" width="1200" height="1200" alt="" loading="lazy" decoding="async"></div>
<div class="cinema-product cinema-product-right"><img src="<?php echo esc_url( mova_asset( 'bag.webp' ) ); ?>" width="1200" height="1200" alt="" loading="lazy" decoding="async"></div>
<div class="cinema-product cinema-product-main"><img src="<?php echo esc_url( mova_asset( 'sneaker.webp' ) ); ?>" width="1200" height="1200" alt="" loading="lazy" decoding="async"></div>
<div class="cinema-caption"><span><?php echo esc_html( mova_text( 'עיצוב שמרגישים.', 'Design you can feel.', 'تصميم تشعر به.' ) ); ?></span><small>LESS ORDINARY. MORE MOVA.</small></div></div>
<div class="cinema-footer"><span><?php echo esc_html( mova_text( 'הקולקציה בתנועה', 'The collection, in motion', 'المجموعة تتحرّك' ) ); ?></span><span>LESS ORDINARY. MORE MOVA.</span></div><div class="cinema-progress" aria-hidden="true"><i></i></div>
</dialog>
