/* Native WooCommerce retains all price, variation, cart and checkout authority. */
(()=>{
 'use strict';
 const instances=[];
 const reduced=()=>document.documentElement.classList.contains('paused-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const parse=el=>{try{return JSON.parse(el.dataset.movaSpec||el.dataset.movaCardSpec);}catch{return null;}};
 document.querySelectorAll('.mova-product-viewport').forEach(viewport=>{
  const spec=parse(viewport),section=viewport.closest('.mova-viewer'),product=viewport.closest('.product'),track=viewport.querySelector('.product-image-track'),image=track?.querySelector('img');
  if(!spec||!track||!image)return;
  const auto=section.querySelector('[data-mova-auto]'),hint=section.querySelector('[role=status]');
  const spin=window.MOVA_SPIN.attach({viewport,image,spec,reduced,onReady:()=>product?.classList.add('mova-spin-ready'),onError:()=>{viewport.dataset.movaError='true';if(hint)hint.textContent=spec.errorLabel||'360° unavailable — product photos are still available.';},onMotion:playing=>{auto?.setAttribute('aria-pressed',String(playing));}});
  const zoom=window.MOVA_ZOOM.attach({viewport,track,readout:viewport.querySelector('output'),scrollParent:document.scrollingElement,canRotate:()=>true,onRotateStart:()=>spin.beginDrag(),onRotateEnd:cancelled=>spin.endDrag(cancelled),onRotate:(dx,time)=>spin.rotate(dx,time),onStep:step=>spin.advance(step),onIntent:()=>spin.setAuto(false)});
  section.querySelector('[data-mova-reset]')?.addEventListener('click',()=>{zoom.reset();spin.goTo(0,{animate:true});});
  auto?.addEventListener('click',()=>{if(!reduced())spin.setAuto(!spin.snapshot().automatic);});
  const motion=()=>{if(auto)auto.disabled=reduced();};motion();window.addEventListener('mova:motion',motion);
  spin.load();instances.push({spin,zoom});
 });
 document.querySelectorAll('[data-mova-card-spec]').forEach(marker=>{
  const viewport=marker.closest('a.woocommerce-LoopProduct-link'),image=viewport?.querySelector('img'),spec=parse(marker);
  if(!viewport||!image||!spec)return;
  instances.push({spin:window.MOVA_SPIN.attach({viewport,image,spec,fit:'track',drag:true,reduced})});
 });
 const pause=document.querySelector('[data-mova-pause]');
 pause?.addEventListener('click',()=>{
  const paused=document.documentElement.classList.toggle('paused-motion');pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'▶':'Ⅱ';window.dispatchEvent(new CustomEvent('mova:motion',{detail:{paused}}));
 });
 const cleanup=()=>instances.forEach(({spin,zoom})=>{spin.destroy();zoom?.destroy();});
 // Persisted pages keep controllers; a bfcache return should remain interactive.
 window.addEventListener('pagehide',event=>{if(!event.persisted)cleanup();});
 if(window.MOVA_INTRO&&document.getElementById('cinematicOpening'))window.MOVA_INTRO.init({reduced,auto:document.body.classList.contains('home')});
})();
