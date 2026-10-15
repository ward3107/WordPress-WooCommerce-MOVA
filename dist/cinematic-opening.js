/* A short, skippable product title sequence. No video/audio download or gate. */
window.MOVA_INTRO=(()=>{
 'use strict';
 const KEY='mova-opening-v8';
 let initialized=false,active=false,closing=false,reduced=()=>true,previousFocus=null;
 let exitTimer=0,closeTimer=0,guardTimer=0,fallback=[];
 const root=()=>document.getElementById('cinematicOpening');
 const seen=()=>{try{return sessionStorage.getItem(KEY)==='1';}catch{return false;}};
 const remember=()=>{try{sessionStorage.setItem(KEY,'1');}catch{/* The store also works when storage is blocked. */}};
 function clearTimers(){clearTimeout(exitTimer);clearTimeout(closeTimer);clearTimeout(guardTimer);exitTimer=closeTimer=guardTimer=0;}
 function complete(){
  if(!active)return;active=false;closing=false;clearTimers();
  const el=root();el.classList.remove('is-playing','is-leaving','is-still');
  if(el.open&&typeof el.close==='function')el.close();else el.removeAttribute('open');
  document.documentElement.classList.remove('intro-active');
  for(const [node,wasInert] of fallback){if(!wasInert)node.removeAttribute('inert');}fallback=[];
  if(previousFocus?.isConnected&&previousFocus!==document.body)previousFocus.focus({preventScroll:true});
  else document.querySelector('.hero-ctas a')?.focus({preventScroll:true});
  previousFocus=null;window.dispatchEvent(new CustomEvent('mova:intro-end'));
 }
 function finish(immediate=false){
  if(!active)return;if(immediate||reduced()){complete();return;}if(closing)return;
  closing=true;clearTimeout(exitTimer);root().classList.add('is-leaving');closeTimer=setTimeout(complete,550);
 }
 function play(manual=true){
  const el=root();if(!el)return false;
  if(!manual&&(seen()||reduced()||document.hidden||location.hash||window.scrollY>48||document.querySelector('dialog[open]')))return false;
  if(active)complete();
  previousFocus=document.activeElement;active=true;closing=false;remember();
  document.documentElement.classList.add('intro-active');
  el.classList.toggle('is-still',reduced());el.classList.remove('is-leaving');
  try{
   if(typeof el.showModal==='function')el.showModal();
   else{
    el.setAttribute('open','');fallback=[...document.body.children].filter(n=>n!==el&&!['SCRIPT','STYLE','LINK'].includes(n.tagName)).map(n=>[n,n.hasAttribute('inert')]);
    fallback.forEach(([n])=>n.setAttribute('inert',''));
   }
   // The existing product cutouts are reused. Lazy photos are promoted only
   // when the opening is actually watched, not on every catalog load.
   el.querySelectorAll('img').forEach(img=>{img.loading='eager';});
   el.classList.remove('is-playing');void el.offsetWidth;el.classList.add('is-playing');
   document.getElementById('skipOpening').focus({preventScroll:true});
   exitTimer=setTimeout(()=>finish(),reduced()?1100:3600);
   guardTimer=setTimeout(()=>finish(true),5200);
   return true;
  }catch{complete();return false;}
 }
 function init(options){
  if(initialized||!root())return;initialized=true;reduced=options.reduced;
  document.getElementById('skipOpening').addEventListener('click',()=>finish(true));
  document.getElementById('replayOpening').addEventListener('click',()=>play(true));
  root().addEventListener('cancel',e=>{e.preventDefault();finish(true);});
  root().addEventListener('close',complete);
  root().addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();finish(true);}
   // Native dialog contains focus. This also covers the attribute fallback.
   if(e.key==='Tab'){e.preventDefault();document.getElementById('skipOpening').focus({preventScroll:true});}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish(true);});
  window.addEventListener('pagehide',()=>finish(true));
  window.addEventListener('mova:motion',e=>{if(e.detail?.paused)finish(true);});
  // A failed optional opening must never stop the storefront from opening.
  play(false);
 }
 return Object.freeze({init,play,finish,snapshot:()=>({active,closing,seen:seen(),timers:Number(!!exitTimer)+Number(!!closeTimer)+Number(!!guardTimer)})});
})();
