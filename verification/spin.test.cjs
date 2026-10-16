/* Deterministic animation/gesture tests. No browser pixels or device claims. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const dom=new JSDOM('<!doctype html><button id="card"><img id="poster"></button><div id="sheet"><div id="view" tabindex="0"><div id="track"><img id="photo"></div></div></div>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=s=>d.querySelector(s),requests=[],queue=new Map();
let clock=1000,frameId=0,reduce=false;
Object.defineProperty(w.performance,'now',{value:()=>clock});
w.requestAnimationFrame=fn=>{queue.set(++frameId,fn);return frameId;};w.cancelAnimationFrame=id=>queue.delete(id);
const step=(dt=16.667)=>{clock+=dt;const callbacks=[...queue.values()];queue.clear();callbacks.forEach(fn=>fn(clock));};
const settle=()=>{for(let i=0;queue.size&&i<500;i++)step();assert.equal(queue.size,0,'No rendering continues at rest');};
for(const el of [$('#card'),$('#view')]){
 el.getBoundingClientRect=()=>({left:0,top:0,width:360,height:360});
 const captured=new Set();el.setPointerCapture=id=>captured.add(id);el.releasePointerCapture=id=>captured.delete(id);el.hasPointerCapture=id=>captured.has(id);
}
w.Image=class {set src(value){this.value=value;requests.push(this);}get naturalWidth(){return 1448;}get naturalHeight(){return 1086;}};
for(const file of ['product-spin.js','product-zoom.js'])w.eval(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'));
const style=d.createElement('style');style.textContent=fs.readFileSync(path.join(__dirname,'../dist/product-spin.css'),'utf8');d.head.append(style);
const spec={src:'assets/spin/move.webp',columns:4,rows:3,frames:12};
const fire=(el,type,id,x,y)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y});Object.defineProperty(e,'timeStamp',{value:clock});el.dispatchEvent(e);return e;};
const key=(el,k)=>el.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≠ ${b}`);
(async()=>{
 const api=w.MOVA_SPIN;
 for(const p of [-120.5,-.25,0,.25,11.75,12,132.25]){const frame=api.wrap(p,12);assert.ok(frame>=0&&frame<12);assert.ok(Number.isInteger(frame));}
 // Closed-form friction produces the same distance at 60Hz and 120Hz.
 const simulate=dt=>{let v=.01,distance=0;for(let t=0;t<500;t+=dt){const n=api.coast(v,Math.min(dt,500-t));distance+=n.distance;v=n.velocity;}return distance;};near(simulate(1000/60),simulate(1000/120));
 let errors=0;const card=api.attach({viewport:$('#card'),image:$('#poster'),spec,fit:'card',drag:true,reduced:()=>reduce});
 assert.equal(requests.length,0,'Atlases stay deferred at initial render');
 let opened=0;$('#card').addEventListener('click',()=>opened++);$('#card').click();assert.equal(opened,1);
 fire($('#card'),'pointerdown',1,100,180);clock+=16;fire($('#card'),'pointermove',1,110,180);assert.equal(queue.size,1);
 clock+=4;fire($('#card'),'pointermove',1,112,180);assert.equal(queue.size,1,'Pointer events coalesce into one animation frame');step();
 assert.ok(card.snapshot().position>0&&card.snapshot().position<1,'A small drag retains fractional input precision');
 const tiles=[...d.querySelectorAll('#card .spin-tile')];assert.equal(tiles.length,1,'Only one source view can be painted');
 const released=card.snapshot().position;fire($('#card'),'pointerup',1,112,180);$('#card').dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,detail:1}));assert.equal(opened,1,'Drag cannot open a product by accident');step();assert.ok(card.snapshot().position>released,'Release continues with momentum');settle();near(card.snapshot().position,Math.round(card.snapshot().position),.001);
 assert.equal(requests.length,1);
 requests[0].onload();await card.load();assert.ok($('#poster').classList.contains('spin-poster-hidden'));
 assert.equal(w.getComputedStyle($('#poster')).visibility,'hidden','The old photograph cannot show through the cutout');
 for(const position of [.25,.49,.5,.75,5.5,11.49,11.5,11.75,-.25]){
  await card.goTo(position);assert.equal(tiles[0].dataset.frame,String(api.wrap(position,12)));
  const css=w.getComputedStyle(tiles[0]);assert.equal(css.opacity,'1','Fractional positions never fade the silhouette');assert.equal(css.mixBlendMode,'normal');assert.equal(css.transition,'none');
 }
 await card.goTo(11.75);assert.equal(tiles[0].dataset.frame,'0','The 360-degree seam uses one complete view');
 await card.goTo(11);await card.advance(1);settle();assert.equal(card.snapshot().frame,0);await card.advance(-1);settle();assert.equal(card.snapshot().frame,11);
 card.setEnabled(false);assert.ok($('#card .spin-surface').hidden);assert.ok(!$('#poster').classList.contains('spin-poster-hidden'));card.setEnabled(true);
 clock+=1000;fire($('#card'),'pointerdown',2,100,100);fire($('#card'),'pointermove',2,102,200);fire($('#card'),'pointercancel',2,102,200);settle();assert.equal(card.snapshot().frame,11,'Vertical scroll does not rotate');
 fire($('#card'),'pointerdown',3,100,100);fire($('#card'),'pointerdown',4,200,100);fire($('#card'),'pointermove',3,300,100);fire($('#card'),'pointerup',3,300,100);fire($('#card'),'pointerup',4,200,100);settle();assert.equal(card.snapshot().frame,11,'Multi-touch on cards remains a page gesture');
 key($('#card'),'Home');settle();assert.equal(card.snapshot().frame,0);key($('#card'),'ArrowLeft');settle();assert.equal(card.snapshot().frame,11);
 const spin=api.attach({viewport:$('#view'),image:$('#photo'),spec,reduced:()=>reduce});await spin.load();assert.equal(requests.length,1,'Decoded atlases are shared');
 const zoom=w.MOVA_ZOOM.attach({viewport:$('#view'),track:$('#track'),scrollParent:$('#sheet'),canRotate:()=>true,onRotateStart:()=>spin.beginDrag(),onRotateEnd:c=>spin.endDrag(c),onRotate:(dx,time)=>spin.rotate(dx,time),onStep:n=>spin.advance(n)});settle();
 fire($('#view'),'pointerdown',10,100,180);clock+=16;fire($('#view'),'pointermove',10,180,180);step();assert.ok(spin.snapshot().position>0);fire($('#view'),'pointerup',10,180,180);step();assert.ok(spin.snapshot().animating);
 fire($('#view'),'pointerdown',11,100,180);assert.equal(spin.snapshot().velocity,0,'Touching an orbit stops its previous momentum');fire($('#view'),'pointerdown',12,200,180);const angle=spin.snapshot().angle;
 fire($('#view'),'pointermove',12,400,180);step();assert.equal(zoom.snapshot().scale,3);near(spin.snapshot().angle,angle);
 fire($('#view'),'pointerup',12,400,180);const oldX=zoom.snapshot().x;fire($('#view'),'pointermove',11,130,180);step();assert.ok(zoom.snapshot().x>oldX);near(spin.snapshot().angle,angle);fire($('#view'),'pointercancel',11,130,180);settle();
 key($('#view'),'0');settle();$('#sheet').scrollTop=100;fire($('#view'),'pointerdown',13,180,100);fire($('#view'),'pointermove',13,181,130);fire($('#view'),'pointerup',13,181,130);settle();assert.equal($('#sheet').scrollTop,70);
 spin.setAuto(true);for(let i=0;i<10;i++)step();assert.ok(spin.snapshot().automatic);assert.ok(spin.snapshot().angle!==angle);spin.setAuto(false);settle();
 reduce=true;assert.equal(spin.setAuto(true),false,'Reduced motion disables automatic spinning');settle();spin.beginDrag();spin.rotate(5);step();spin.endDrag();settle();assert.equal(spin.snapshot().velocity,0);reduce=false;
 spin.setAuto(true);step();w.dispatchEvent(new w.CustomEvent('mova:motion',{detail:{paused:true}}));assert.equal(spin.snapshot().automatic,false);settle();
 spin.destroy();zoom.destroy();card.destroy();assert.equal($('#view .spin-surface'),null);assert.equal(queue.size,0,'Disposal cancels all frame work');
 const retry=api.attach({viewport:$('#card'),image:$('#poster'),spec:{...spec,src:'assets/spin/retry.webp'},onError:()=>errors++});let p=retry.load();requests.at(-1).onerror();assert.equal(await p,false);assert.equal(errors,1);assert.ok(!$('#poster').classList.contains('spin-poster-hidden'));p=retry.load();requests.at(-1).onload();assert.equal(await p,true);retry.destroy();
 const late=api.attach({viewport:$('#card'),image:$('#poster'),spec:{...spec,src:'assets/spin/late.webp'}});p=late.load();late.destroy();requests.at(-1).onload();await p;assert.equal($('#card .spin-surface'),null);
 console.log('PASS: one opaque view across fractional positions and the 360° seam, hidden poster, coalesced frames, frame-rate-independent momentum, idle stop, pinch/pan cancellation, auto rotation, reduced motion, decode sharing/retry and disposal');
})().finally(()=>dom.window.close());
