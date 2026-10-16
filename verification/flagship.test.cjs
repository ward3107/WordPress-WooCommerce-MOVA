/* Exercises the real HTML script order, gestures and handoff lifecycle.
 * Geometry/animation are controlled; this is not a browser pixel or FPS test. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.join(__dirname,'..','dist');
function setup({fail=false,reduced=false}={}){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://mova.example/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window,d=w.document,$=s=>d.querySelector(s),frames=new Map(),timers=new Map(),images=[],animations=[],observations=[];
  let clock=1000,id=0;
  Object.defineProperty(w.performance,'now',{value:()=>clock});
  w.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};w.cancelAnimationFrame=id=>frames.delete(id);
  w.setTimeout=(fn,delay)=>{timers.set(++id,{fn,at:clock+delay});return id;};w.clearTimeout=id=>timers.delete(id);
  const advance=ms=>{clock+=ms;for(let i=0;i<100;i++){const entry=[...timers.entries()].find(([,v])=>v.at<=clock);if(!entry)break;timers.delete(entry[0]);entry[1].fn();}};
  const step=()=>{clock+=16.667;const queue=[...frames.values()];frames.clear();queue.forEach(fn=>fn(clock));};
  const settle=()=>{for(let i=0;frames.size&&i<600;i++)step();assert.equal(frames.size,0,'Rendering settles');};
  w.matchMedia=()=>({matches:reduced,addEventListener(){},addListener(){}});
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.HTMLElement.prototype.getBoundingClientRect=function(){return {left:20,top:120,right:420,bottom:500,width:400,height:380};};
  w.HTMLElement.prototype.animate=function(keyframes,options){const animation={keyframes,options,cancelled:false,cancel(){this.cancelled=true;}};animations.push(animation);return animation;};
  w.IntersectionObserver=class{constructor(fn){this.fn=fn;observations.push(this);}observe(){}unobserve(){}disconnect(){}};
  w.Image=class{set src(src){this.value=src;images.push(this);}get naturalWidth(){return 1448;}get naturalHeight(){return 1086;}};
  w.fetch=()=>{throw Error('Unexpected network call');};
  const fire=(type,pointerId,x,y)=>{const event=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{pointerId,pointerType:'touch',button:0,clientX:x,clientY:y});Object.defineProperty(event,'timeStamp',{value:clock});$('#flagshipViewport').dispatchEvent(event);};
  for(const script of d.querySelectorAll('script[src]'))w.eval(fs.readFileSync(path.join(root,script.getAttribute('src').split('?')[0]),'utf8'));
  return {w,d,$,dom,errors,frames,timers,images,animations,observations,step,advance,settle,fire};
}
(async()=>{
  const x=setup();const {w,d,$,fire,step,settle,advance,images,animations}=x;
  try{
    assert.equal(d.querySelectorAll('.product-card').length,12);
    assert.ok(w.MOVA_FLAGSHIP.snapshot().initialized);
    assert.ok($('#shoeCanvasMount'),'The requested interactive anatomy is available');
    assert.ok($('#photoStudy #detailCanvas'),'The original-photo study remains distinct');
    assert.ok(w.MOVA_INTRO.snapshot().active);
    assert.equal(images.length,0,'No turntable download at boot');
    w.MOVA_INTRO.finish();assert.ok(w.MOVA_FLAGSHIP.snapshot().transferring);
    assert.ok(d.documentElement.classList.contains('flagship-handoff'));
    assert.equal(animations.at(-1).options.duration,550);
    advance(550);assert.ok(!w.MOVA_INTRO.snapshot().active);
    assert.ok(!w.MOVA_FLAGSHIP.snapshot().transferring);
    assert.equal($('.cinema-handoff'),null);assert.ok(animations.at(-1).cancelled);
    $('#flagshipViewport').dispatchEvent(new w.Event('pointerenter'));
    $('#flagshipViewport').focus();assert.equal(images.length,0,'Hover/focus do not replace the original photograph');
    fire('pointerdown',1,100,220);advance(16);fire('pointermove',1,155,220);step();
    assert.ok(w.MOVA_FLAGSHIP.snapshot().spin.position>0,'A horizontal drag rotates');
    assert.equal(images.length,1);images[0].onload();await Promise.resolve();await Promise.resolve();
    assert.ok($('#heroShoe').classList.contains('spin-poster-hidden'));
    fire('pointerup',1,155,220);settle();
    fire('pointerdown',2,100,220);fire('pointerdown',3,200,220);
    const angle=w.MOVA_FLAGSHIP.snapshot().spin.angle;
    fire('pointermove',3,400,220);step();
    assert.equal(w.MOVA_FLAGSHIP.snapshot().zoom.scale,3);
    assert.equal(w.MOVA_FLAGSHIP.snapshot().spin.angle,angle,'Pinch does not rotate');
    fire('pointerup',3,400,220);fire('pointerup',2,100,220);settle();
    $('#flagshipReset').click();settle();assert.equal(w.MOVA_FLAGSHIP.snapshot().zoom.scale,1);
    assert.equal(w.MOVA_FLAGSHIP.snapshot().spin.frame,0);
    $('[data-flagship-view="photo"]').click();settle();
    assert.equal(w.MOVA_FLAGSHIP.snapshot().view,'photo');
    assert.ok(!$('#heroShoe').classList.contains('spin-poster-hidden'));
    $('#flagshipViewport').dispatchEvent(new w.KeyboardEvent('keydown',{key:'+',bubbles:true,cancelable:true}));step();
    assert.ok(w.MOVA_FLAGSHIP.snapshot().zoom.scale>1);
    for(const [lang,dir,word] of [['en','ltr','Pinch'],['ar','rtl','كبّر'],['he','rtl','צבטו']]){
      $('#language').value=lang;$('#language').dispatchEvent(new w.Event('change',{bubbles:true}));
      assert.equal(d.documentElement.dir,dir);assert.ok($('#flagshipGesture').textContent.includes(word));
      assert.ok(!$('#heroTitle').textContent.includes('flagshipTitle'));
    }
    for(const view of ['mesh','sole','whole']){$(`[data-detail="${view}"]`).click();assert.equal($('#detailCanvas').dataset.view,view);assert.equal($('#detailImage').getAttribute('src'),'assets/sneaker.webp');}
    $('[data-flagship-view="spin"]').click();
    $('#flagshipViewport').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));settle();
    const selectedAngle=w.MOVA_FLAGSHIP.snapshot().spin.angle;
    $('.hero-product-tag').click();assert.ok($('#productDialog').open);
    assert.ok(Math.abs(Number($('#productSpinRange').value)-selectedAngle)<.05,'The product opens at the hero viewing angle, within the range control precision');assert.equal($('#productDialog').dataset.flagshipProduct,'move');
    assert.ok($('.product-lab-link'),'The product links to its restored anatomy');
    $('#addProductButton').click();assert.equal($('#cartCount').textContent,'1');
    $('#productDialog>[data-close-dialog]').click();assert.ok(!$('#productDialog').open);
    $('#flagshipViewport').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));settle();
    assert.equal(w.MOVA_FLAGSHIP.snapshot().spin.frame,0,'Home resets the turntable');
    $('#replayOpening').click();assert.equal(w.MOVA_FLAGSHIP.snapshot().zoom.scale,1);
    assert.equal(w.MOVA_FLAGSHIP.snapshot().spin.frame,0);
    assert.ok(!$('#heroShoe').classList.contains('spin-poster-hidden'));
    w.MOVA_INTRO.finish();assert.ok(w.MOVA_FLAGSHIP.snapshot().transferring);
    w.dispatchEvent(new w.Event('resize'));assert.ok(!w.MOVA_FLAGSHIP.snapshot().transferring);
    $('#skipOpening').click();assert.ok(!w.MOVA_INTRO.snapshot().active);
    assert.ok(!d.documentElement.classList.contains('flagship-handoff'));
    for(const link of d.querySelectorAll('link[rel="stylesheet"]')){const style=d.createElement('style');style.textContent=fs.readFileSync(path.join(root,link.getAttribute('href').split('?')[0]),'utf8');d.head.append(style);assert.ok(style.sheet.cssRules.length);}
    assert.deepEqual(x.errors,[]);
  }finally{x.dom.window.close();}
  const failed=setup();try{
    failed.$('#skipOpening').click();failed.$('[data-flagship-view="spin"]').click();
    failed.images[0].onerror();await Promise.resolve();await Promise.resolve();await Promise.resolve();
    assert.equal(failed.w.MOVA_FLAGSHIP.snapshot().view,'photo');
    assert.ok(failed.$('#flagshipStatus').textContent.includes('לא ניתן'));
    assert.ok(!failed.$('#heroShoe').classList.contains('spin-poster-hidden'));
  }finally{failed.dom.window.close();}
  const reduced=setup({reduced:true});try{
    assert.ok(!reduced.w.MOVA_INTRO.snapshot().active);
    reduced.$('#replayOpening').click();reduced.w.MOVA_INTRO.finish();
    assert.equal(reduced.animations.length,0,'Reduced motion avoids the handoff');
    assert.ok(!reduced.w.MOVA_FLAGSHIP.snapshot().transferring);
  }finally{reduced.dom.window.close();}
  console.log('PASS: actual script order, measured opening handoff/cleanup, deferred atlas, drag/pinch/reset, photo fallback, 3 languages, detail views, product purchase, reduced motion and CSS parsing');
})().catch(error=>{console.error(error);process.exitCode=1;});
