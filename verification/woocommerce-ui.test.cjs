/* DOM + native WooCommerce variation-script checks, not a browser rendering test.
 * Requires rendered pages from woocommerce.test.php and a built theme.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.resolve(__dirname,'..'),rendered=process.env.MOVA_WP_QA_ARTIFACTS,wp=process.env.MOVA_WP_QA_ROOT;
if(!rendered||!wp)throw Error('Supply MOVA_WP_QA_ARTIFACTS and MOVA_WP_QA_ROOT');
const assets=path.join(root,'launch-build/mova-motion/assets');
async function boot(filename){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(rendered,filename),'utf8'),{url:'https://mova.test/'+(filename==='home.html'?'':'product/move/'),runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,d=w.document,queue=new Map();let clock=1000,serial=0;
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.requestAnimationFrame=fn=>{queue.set(++serial,fn);return serial;};w.cancelAnimationFrame=id=>queue.delete(id);
 Object.defineProperty(w.performance,'now',{value:()=>clock});
 const settle=()=>{for(let i=0;queue.size&&i<600;i++){clock+=16.667;const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn(clock));}assert.equal(queue.size,0,'No frame work continues after settling');};
 w.Image=class{naturalWidth=1448;naturalHeight=1086;set src(v){this._src=v;queueMicrotask(()=>this.onload?.());}get src(){return this._src;}decode(){return Promise.resolve();}};
 for(const el of d.querySelectorAll('.mova-product-viewport,.woocommerce-LoopProduct-link')){
  el.getBoundingClientRect=()=>({left:0,top:0,width:360,height:360});el.setPointerCapture=()=>{};el.hasPointerCapture=()=>false;
 }
 d.getElementById('cinematicOpening').showModal=function(){this.setAttribute('open','');};
 d.getElementById('cinematicOpening').close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
 for(const name of ['product-spin.js','product-zoom.js','cinematic-opening.js','theme.js'])w.eval(fs.readFileSync(path.join(assets,name),'utf8'));
 for(let i=0;i<6;i++)await Promise.resolve();settle();
 return {w,d,dom,settle,errors,queue};
}
(async()=>{
 for(const id of ['move','focus','carry','pace','slide','pulse','echo','roam','orbit','form','shell','loop']){
  const x=await boot(id+'.html'),{w,d}=x,view=d.querySelector('.mova-product-viewport');
  assert.equal(w.MOVA_INTRO.snapshot().active,false,'Direct product link bypasses automatic intro');
  assert.equal(view.dataset.spinState,'ready');assert.equal(view.querySelectorAll('.spin-tile').length,2);
  const spec=JSON.parse(view.dataset.movaSpec);assert.equal(spec.frames,12);assert.ok(fs.existsSync(path.join(assets,'spin',id+'.webp')));
  view.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));x.settle();assert.equal(view.dataset.spinFrame,'1');
  view.dispatchEvent(new w.KeyboardEvent('keydown',{key:'+',bubbles:true,cancelable:true}));x.settle();assert.ok(Number(view.dataset.zoom)>1);
  d.querySelector('[data-mova-reset]').click();x.settle();assert.equal(view.dataset.spinFrame,'0');assert.equal(view.dataset.zoom,'1.00');
  const auto=d.querySelector('[data-mova-auto]');auto.click();assert.equal(auto.getAttribute('aria-pressed'),'true');
  d.querySelector('[data-mova-pause]').click();x.settle();assert.equal(auto.disabled,true);assert.equal(auto.getAttribute('aria-pressed'),'false');
  d.querySelector('[data-mova-pause]').click();x.settle();assert.equal(auto.disabled,false);
  assert.ok(d.querySelectorAll('.mova-components article').length>=3);
  assert.ok(d.querySelector('form.variations_form .single_add_to_cart_button'));
  assert.equal(d.querySelectorAll('form [name=add-to-cart]').length,1);
  d.getElementById('replayOpening').click();assert.equal(w.MOVA_INTRO.snapshot().active,true);d.getElementById('skipOpening').click();assert.equal(w.MOVA_INTRO.snapshot().active,false);
  w.dispatchEvent(new w.PageTransitionEvent('pagehide'));assert.equal(x.queue.size,0);assert.equal(view.querySelector('.spin-surface'),null);assert.deepEqual(x.errors,[]);x.dom.window.close();
 }
 const home=await boot('home.html');assert.equal(home.w.MOVA_INTRO.snapshot().active,true);home.d.getElementById('skipOpening').click();
 assert.equal(home.d.querySelectorAll('[data-mova-card-spec]').length,12);
 const card=home.d.querySelector('a.woocommerce-LoopProduct-link');card.dispatchEvent(new home.w.Event('pointerenter'));for(let i=0;i<5;i++)await Promise.resolve();home.settle();
 assert.equal(card.dataset.spinState,'ready');assert.ok(card.querySelector('.mova-loop-visual .spin-surface'));assert.equal(card.querySelector('.spin-surface').style.width,'');
 home.w.dispatchEvent(new home.w.PageTransitionEvent('pagehide'));home.dom.window.close();
 // Execute WooCommerce's own variation handler against the actual rendered form.
 const x=await boot('move.html'),{w,d}=x;
 w.eval(fs.readFileSync(path.join(wp,'wp-includes/js/jquery/jquery.min.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(wp,'wp-includes/js/underscore.min.js'),'utf8'));
 w.eval(fs.readFileSync(path.join(wp,'wp-includes/js/wp-util.min.js'),'utf8'));
 const params=d.getElementById('wc-add-to-cart-variation-js-extra');assert.ok(params);w.eval(params.textContent);
 w.eval(fs.readFileSync(path.join(wp,'wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart-variation.js'),'utf8'));
 const $=w.jQuery,form=$('form.variations_form');form.wc_variation_form();
 const choices=JSON.parse(form.attr('data-product_variations')),choice=choices.find(v=>v.is_in_stock&&v.is_purchasable&&v.display_price===777);
 assert.ok(choice,'Server price modification appears in native variation data');
 for(const [name,value]of Object.entries(choice.attributes))form.find('select[name="'+name+'"]').val(value).trigger('change');
 await new Promise(resolve=>setTimeout(resolve,350));
 assert.equal(Number(form.find('input.variation_id').val()),choice.variation_id,'Native WooCommerce script selects the expected variation');
 assert.ok(!form.find('.single_add_to_cart_button').hasClass('disabled'),'Native form enables in-stock selection');
 const soldOut=choices.find(v=>!v.is_in_stock);assert.ok(soldOut);
 for(const [name,value]of Object.entries(soldOut.attributes))form.find('select[name="'+name+'"]').val(value).trigger('change');
 await new Promise(resolve=>setTimeout(resolve,350));assert.ok(form.find('.single_add_to_cart_button').hasClass('disabled'),'Native UI disables sold-out selection');
 x.w.dispatchEvent(new x.w.PageTransitionEvent('pagehide'));x.dom.window.close();
 console.log('PASS: 12 rendered product pages, 360 keyboard/zoom/reset, motion pause/resume, direct-link intro bypass, replay/Skip, components, 12 homepage turntables, cleanup and native WooCommerce in-stock/sold-out variation selection');
})().catch(e=>{console.error(e);process.exitCode=1;});
