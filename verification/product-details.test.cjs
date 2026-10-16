/* The real product sheet, component navigation and gesture wiring for every SKU. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.join(__dirname,'..'),errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),{url:'https://mova-motion-store.vasele66.chatgpt.site',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window,d=w.document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)];
w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
const nativeRect=w.HTMLElement.prototype.getBoundingClientRect;
w.HTMLElement.prototype.getBoundingClientRect=function(){return this.id==='productVisual'?{left:10,top:20,width:340,height:310,right:350,bottom:330}:nativeRect.call(this);};
let frame=0,loads=0,spinLoads=0,clock=1000;Object.defineProperty(w.performance,'now',{value:()=>clock});const frames=new Map();w.requestAnimationFrame=fn=>{frames.set(++frame,fn);return frame;};w.cancelAnimationFrame=id=>frames.delete(id);
const flush=()=>{for(let i=0;frames.size&&i<500;i++){const batch=[...frames.values()];frames.clear();clock+=16.667;batch.forEach(f=>f(clock));}};
// Decode completion is simulated, not image pixels or network availability.
w.Image=class {set src(value){if(value.includes('/spin/')){spinLoads++;this.naturalWidth=1448;this.naturalHeight=1086;}else{loads++;this.naturalWidth=1440;this.naturalHeight=1440;}this.value=value;this.onload?.();}};
w.sessionStorage.setItem('mova-opening-v9','1');
for(const f of ['catalog.js','store-core.js','store-copy.js','product-zoom.js','product-spin.js','store-ui.js','cinematic-opening.js','app.js'])w.eval(fs.readFileSync(path.join(root,'dist',f),'utf8'));flush();
const click=s=>{assert.ok($(s),s);$(s).click();flush();};
const pointer=(type,id,x,y)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y});Object.defineProperty(e,'timeStamp',{value:clock});$('#productVisual').dispatchEvent(e);flush();};
const settle=async()=>{for(let i=0;i<4;i++)await Promise.resolve();flush();};
(async()=>{try{
 assert.equal(spinLoads,0,'All turntables are deferred at initial render');
 for(const lang of ['he','en','ar']){
  $('#language').value=lang;$('#language').dispatchEvent(new w.Event('change'));flush();
  for(const p of w.MOVA_CATALOG.products){
   const beforeLoads=loads;click(`[data-product="${p.id}"] .product-open`);await settle();
   assert.equal(loads,beforeLoads,'Detail image is deferred until a photographic inspection');assert.equal($('#productVisual').dataset.gallery,'spin');assert.equal($('#productVisual').dataset.spinState,'ready');assert.ok($('#productImage').classList.contains('spin-poster-hidden'));
   const positions=new Set();for(let angle=0;angle<12;angle++){$('#productSpinRange').value=String(angle*30);$('#productSpinRange').dispatchEvent(new w.Event('input',{bubbles:true}));positions.add($('#productImageTrack .spin-tile').style.backgroundPosition);flush();}assert.equal(positions.size,12,'Every viewpoint uses a different atlas cell');
   $('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));flush();assert.equal($('#productVisual').dataset.spinFrame,'0','A full turn wraps to the first viewpoint');
   pointer('pointerdown',21,100,175);pointer('pointermove',21,200,175);pointer('pointerup',21,200,175);assert.notEqual($('#productVisual').dataset.spinFrame,'0');const inspectedAngle=$('#productVisual').dataset.spinFrame;
   pointer('pointerdown',22,100,175);pointer('pointerdown',23,200,175);pointer('pointermove',23,400,175);pointer('pointerup',23,400,175);pointer('pointerup',22,100,175);assert.ok(Number($('#productVisual').dataset.zoom)>2);assert.equal($('#productVisual').dataset.spinFrame,inspectedAngle,'Pinching preserves the chosen side');
   click(`[data-color-option="${p.colors.at(-1).id}"]`);assert.equal($('#productVisual').dataset.spinFrame,inspectedAngle);$('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'0',bubbles:true}));flush();assert.equal($('#productZoom'),null,'No button-based image zoom');
   const cards=$$('.component-card');assert.equal(cards.length,p.components.length);
   for(const [i,c] of p.components.entries())for(const field of ['label','material','detail'])assert.ok(cards[i].textContent.includes(c[field][lang]));
   const last=p.components.at(-1);click(`[data-component="${last.id}"]`);assert.equal($('#productImageCaption').textContent,last.label[lang]);assert.ok(!$('#productImage').classList.contains('spin-poster-hidden'),'Components return to the matching reference photo');assert.ok($('#productSpinControls').hidden);assert.equal($(`[data-component="${last.id}"]`).getAttribute('aria-pressed'),'true');
   assert.ok(Number($('#productVisual').dataset.zoom)>3);assert.equal(loads,beforeLoads+1);assert.ok($('#productImage').src.endsWith('/'+p.detailImage));
   click('.gallery-tabs [data-gallery="whole"]');assert.equal(Number($('#productVisual').dataset.zoom),1);
   pointer('pointerdown',1,100,175);pointer('pointerdown',2,220,175);pointer('pointermove',2,380,175);assert.ok(Number($('#productVisual').dataset.zoom)>2);
   pointer('pointerup',2,380,175);pointer('pointermove',1,130,185);pointer('pointerup',1,130,185);
   const transform=$('#productImageTrack').style.transform;click(`[data-color-option="${p.colors.at(-1).id}"]`);assert.equal($('#productImageTrack').style.transform,transform,'Color changes retain the inspected area');
   $('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'0',bubbles:true}));flush();assert.equal($('#productVisual').dataset.zoom,'1.00');
   click('#productDialog>[data-close-dialog]');
  }
 }
 // Changing language in an open component view preserves the selection.
 click('[data-product="move"] .product-open');click('[data-component="laces"]');$('#language').value='en';$('#language').dispatchEvent(new w.Event('change'));flush();assert.equal($('#productImageCaption').textContent,'Laces & loops');
 assert.equal(spinLoads,12,'One atlas per product is reused across language changes');
 assert.deepEqual(errors,[]);console.log('PASS: all 12 products × 3 languages × 12 viewpoints, rotation/pinch/pan cooperation, component photo focus, deferred/shared assets, variant persistence and open-sheet translation');
}finally{dom.window.close();}})();
