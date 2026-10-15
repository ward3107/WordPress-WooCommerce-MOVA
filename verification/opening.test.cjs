/* Opening lifecycle against the real page; CSS motion needs browser review. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.join(__dirname,'..');
function setup(native=true){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),{url:'https://mova-motion-store.vasele66.chatgpt.site/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,d=w.document,$=s=>d.querySelector(s),timers=new Map();let clock=0,id=0,reduce=false;
 w.setTimeout=(fn,delay)=>{timers.set(++id,{fn,at:clock+delay});return id;};w.clearTimeout=id=>timers.delete(id);
 const advance=ms=>{const end=clock+ms;for(let i=0;i<100;i++){const entries=[...timers.entries()].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at);if(!entries.length)break;const [key,v]=entries[0];clock=v.at;timers.delete(key);v.fn();}clock=end;};
 if(native){w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};}
 else{w.HTMLDialogElement.prototype.showModal=undefined;w.HTMLDialogElement.prototype.close=undefined;}
 w.eval(fs.readFileSync(path.join(root,'dist/cinematic-opening.js'),'utf8'));
 return {dom,w,d,$,timers,advance,errors,setReduced:v=>reduce=v,init:()=>w.MOVA_INTRO.init({t:k=>k,reduced:()=>reduce}),api:w.MOVA_INTRO};
}
for(const native of [true,false]){
 const x=setup(native),{w,d,$,api,timers,advance}=x;
 try{
  if(!native)$('#siteHeader').setAttribute('inert','');
  x.init();assert.equal(api.snapshot().active,true);assert.ok($('#cinematicOpening').open);assert.ok(d.documentElement.classList.contains('intro-active'));assert.equal(d.activeElement,$('#skipOpening'));
  advance(3600);assert.equal(api.snapshot().closing,true);advance(550);assert.equal(api.snapshot().active,false);assert.ok(!$('#cinematicOpening').open);assert.equal(timers.size,0);assert.ok(!d.documentElement.classList.contains('intro-active'));
  if(!native){assert.ok($('#siteHeader').hasAttribute('inert'),'Pre-existing inert state survives');assert.ok(!$('main').hasAttribute('inert'),'Fallback inert is removed');}
  assert.equal(api.play(false),false,'Autoplay runs once in this session');
  $('#replayOpening').focus();$('#replayOpening').click();assert.equal(api.snapshot().active,true);$('#skipOpening').click();assert.equal(api.snapshot().active,false);assert.equal(d.activeElement,$('#replayOpening'),'Replay focus is restored');assert.equal(timers.size,0);
  api.play();const cancel=new w.Event('cancel',{cancelable:true});$('#cinematicOpening').dispatchEvent(cancel);assert.ok(cancel.defaultPrevented);assert.equal(api.snapshot().active,false);
  api.play();$('#cinematicOpening').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(d.activeElement,$('#skipOpening'));$('#cinematicOpening').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(api.snapshot().active,false);
  api.play();x.setReduced(true);w.dispatchEvent(new w.CustomEvent('mova:motion',{detail:{paused:true}}));assert.equal(api.snapshot().active,false);assert.equal(timers.size,0);
  api.play();assert.ok($('#cinematicOpening').classList.contains('is-still'),'Explicit replay remains available as a still under reduced motion');advance(1100);assert.equal(api.snapshot().active,false);
  x.setReduced(false);w.sessionStorage.clear();w.history.replaceState(null,'','#collection');assert.equal(api.play(false),false,'Deep links do not get an opening gate');w.history.replaceState(null,'','/');
  Object.defineProperty(w,'sessionStorage',{configurable:true,get(){throw Error('Storage blocked');}});assert.equal(api.play(false),true,'Blocked storage cannot break the store');w.dispatchEvent(new w.Event('pagehide'));assert.equal(api.snapshot().active,false);assert.equal(timers.size,0);
  assert.deepEqual(x.errors,[]);
 }finally{x.dom.window.close();}
}
const reduced=setup();try{reduced.setReduced(true);reduced.init();assert.equal(reduced.api.snapshot().active,false,'Reduced motion suppresses the automatic opening');assert.equal(reduced.timers.size,0);}finally{reduced.dom.window.close();}
console.log('PASS: first-visit opening, timed exit, skip/replay/focus, Escape/Tab, reduced motion, deep links, blocked storage, pagehide, native dialog and inert fallback');
// Exercise the actual storefront boot with the opening enabled, then shop.
const integrated=setup();try{
 const {w,d,$,api}=integrated;
 w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};
 for(const file of ['catalog.js','store-core.js','store-copy.js','product-zoom.js','product-spin.js','store-ui.js','app.js'])w.eval(fs.readFileSync(path.join(root,'dist',file),'utf8'));
 assert.ok(api.snapshot().active,'Store startup launches the opening');$('#skipOpening').click();assert.ok(!api.snapshot().active);
 $('.hero-product-tag').click();assert.ok($('#productDialog').open);assert.equal($('#productSpinRange').step,'0.1');
 $('#productSpinRange').value='15.5';$('#productSpinRange').dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(Number($('#productVisual').dataset.spinAngle),15.5);
 $('#productSpinAuto').click();assert.equal($('#productSpinAuto').getAttribute('aria-pressed'),'true');$('#motionToggle').click();assert.ok($('#productSpinAuto').disabled);assert.equal($('#productSpinAuto').getAttribute('aria-pressed'),'false');$('#motionToggle').click();assert.ok(!$('#productSpinAuto').disabled,'Re-enabling motion restores the automatic rotation control');
 $('#productDialog>[data-close-dialog]').click();assert.ok(!$('#productDialog').open);
 for(const file of ['product-spin.css','cinematic-opening.css']){const style=d.createElement('style');style.textContent=fs.readFileSync(path.join(root,'dist',file),'utf8');d.head.append(style);assert.ok(style.sheet.cssRules.length>0);}
 assert.deepEqual(integrated.errors,[]);console.log('PASS: actual storefront boot → opening → Skip → product rotation/auto control → motion pause/resume → close; both new stylesheets parse');
}finally{integrated.dom.window.close();}
