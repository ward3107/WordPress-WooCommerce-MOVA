/* Product turntables: one opaque source view with fractional gesture momentum.
 * Crossfading transparent silhouettes makes ghosts, not additional viewpoints.
 */
window.MOVA_SPIN=(()=>{
 'use strict';
 const cache=new Map(),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const mod=(n,count)=>((n%count)+count)%count;
 const wrap=(n,count)=>mod(Math.round(n),count);
 const coast=(velocity,dt,tau=170)=>{const decay=Math.exp(-dt/tau);return {distance:velocity*tau*(1-decay),velocity:velocity*decay};};
 function loadAtlas(spec){
  if(cache.has(spec.src))return cache.get(spec.src);
  const promise=new Promise((resolve,reject)=>{
   const img=new Image();img.decoding='async';
   img.onload=async()=>{
    if(!img.naturalWidth||!img.naturalHeight||Math.abs(img.naturalWidth/img.naturalHeight-spec.columns/spec.rows)>.015){reject(Error('Invalid product turntable'));return;}
    if(img.decode)try{await img.decode();}catch{/* onload already confirmed usable pixels. */}
    resolve(img);
   };
   img.onerror=()=>reject(Error('Product turntable could not load'));img.src=spec.src;
  });
  cache.set(spec.src,promise);promise.catch(()=>{if(cache.get(spec.src)===promise)cache.delete(spec.src);});return promise;
 }
 function attach({viewport,image,spec,fit='track',drag=false,initialFrame=0,preloadOnHover=true,onFrame=()=>{},onPosition=()=>{},onMotion=()=>{},onReady=()=>{},onError=()=>{},reduced=()=>document.documentElement.classList.contains('paused-motion')||!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}){
  if(!viewport||!image||!spec||spec.frames!==spec.columns*spec.rows)throw Error('A valid product turntable is required');
  let position=Number.isFinite(initialFrame)?mod(initialFrame,spec.frames):0,target=position,velocity=0;
  let ready=false,enabled=true,disposed=false,pending=null,raf=0,lastTick=0,lastSample=0,lastMove=0,lastNotified=-1,dragging=false,automatic=false,viewportWidth=360;
  let pointer=null,axis=null,multiple=false,suppressUntil=0;
  const pointers=new Set(),removers=[],surface=document.createElement('span');
  surface.className='spin-surface';surface.setAttribute('aria-hidden','true');surface.hidden=true;
  const tile=document.createElement('span');tile.className='spin-tile';surface.append(tile);
  image.parentElement.append(surface);image.draggable=false;
  const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);removers.push(()=>el.removeEventListener(type,fn,options));};
  const now=()=>performance.now();
  const sourceWidth=spec.bounds?.x.at(-1),sourceHeight=spec.bounds?.y.at(-1);
  const layouts=Array.from({length:spec.frames},(_,n)=>{
   const cell=spec.order?.[n]??n,col=cell%spec.columns,row=Math.floor(cell/spec.columns);
   if(!spec.bounds)return {width:100,height:100,left:50,top:50,size:`${spec.columns*100}% ${spec.rows*100}%`,at:`${spec.columns===1?0:col/(spec.columns-1)*100}% ${spec.rows===1?0:row/(spec.rows-1)*100}%`};
   const x=spec.bounds.x,y=spec.bounds.y,w=x[col+1]-x[col],h=y[row+1]-y[row];
   const size=Math.max(...x.slice(1).map((v,i)=>v-x[i]),...y.slice(1).map((v,i)=>v-y[i]));
   const f=spec.framing?.[cell],scale=f?.scale??1;
   return {width:w/size*100*scale,height:h/size*100*scale,left:50+(w/2-(f?.cx??w/2))/size*100*scale,top:50+(h/2-(f?.cy??h/2))/size*100*scale,size:`${sourceWidth/w*100}% ${sourceHeight/h*100}%`,at:`${x[col]/(sourceWidth-w)*100}% ${y[row]/(sourceHeight-h)*100}%`};
  });
  function resize(){
   const r=viewport.getBoundingClientRect();viewportWidth=r.width||360;if(fit==='track')return;
   const size=Math.max(1,Math.min(r.width-24,r.height-(fit==='card'?74:0)));
   surface.style.width=size+'px';surface.style.height=size+'px';surface.style.left='50%';surface.style.top=fit==='card'?'calc(50% - 10px)':'50%';surface.style.transform='translate(-50%,-50%)';
  }
  function setTile(frame){
   if(tile.dataset.frame!==String(frame)){
    const l=layouts[frame];tile.dataset.frame=String(frame);tile.style.width=l.width+'%';tile.style.height=l.height+'%';tile.style.left=l.left+'%';tile.style.top=l.top+'%';tile.style.backgroundSize=l.size;tile.style.backgroundPosition=l.at;
   }
  }
  function paint(){
   if(disposed)return;
   const visible=enabled&&ready,frame=wrap(position,spec.frames),angle=mod(position,spec.frames)*360/spec.frames;
   setTile(frame);
   surface.hidden=!visible;image.classList.toggle('spin-poster-hidden',visible);viewport.classList.toggle('has-spin',visible);
   viewport.dataset.spinFrame=String(frame);viewport.dataset.spinAngle=angle.toFixed(2);viewport.dataset.spinState=ready?'ready':pending?'loading':'poster';
   if(frame!==lastNotified){lastNotified=frame;onFrame(frame,spec.frames);}
   onPosition(angle,mod(position,spec.frames),frame);
  }
  function request(){if(!raf&&!disposed&&enabled)raf=requestAnimationFrame(tick);}
  function tick(time){
   raf=0;if(disposed||!enabled)return;
   const dt=lastTick?clamp(time-lastTick,0,32):16.667;lastTick=time;
   if(reduced()){velocity=0;automatic=false;position=target;}
   else{
    if(automatic)target+=dt*.0013;
    else if(!dragging&&Math.abs(velocity)>.00012){const next=coast(velocity,dt);target+=next.distance;velocity=next.velocity;}
    else if(!dragging){velocity=0;target=Math.round(target);}
    const difference=target-position;
    position=Math.abs(difference)<.0002?target:position+difference*(1-Math.exp(-dt/(dragging?24:46)));
   }
   paint();
   if(automatic||(!dragging&&Math.abs(velocity)>.00012)||Math.abs(target-position)>.0002)request();else lastTick=0;
  }
  function stop(){
   velocity=0;dragging=false;automatic=false;target=position;lastTick=0;lastSample=0;viewport.classList.remove('is-spinning');
   if(raf)cancelAnimationFrame(raf);raf=0;onMotion(false);
  }
  function load(){
   if(disposed||ready)return Promise.resolve(ready);if(pending)return pending;
   viewport.dataset.spinState='loading';
   pending=loadAtlas(spec).then(()=>{
    if(disposed)return false;
    ready=true;tile.style.backgroundImage=`url("${spec.src}")`;
    resize();paint();onReady();return true;
   }).catch(error=>{if(!disposed){pending=null;paint();viewport.dataset.spinState='error';onError(error);}return false;});return pending;
  }
  function goTo(value,{animate=false,loadImage=true}={}){
   if(disposed||!Number.isFinite(value))return Promise.resolve(false);
   stop();target=value;
   if(animate&&!reduced())request();else{position=value;paint();}
   return loadImage?load():Promise.resolve(ready);
  }
  function advance(delta){return goTo(Math.round(target)+delta,{animate:true});}
  function beginDrag(){if(disposed)return;stop();dragging=true;lastSample=now();load();}
  function rotate(delta,time=now()){
   if(disposed||!enabled||!Number.isFinite(delta))return;
   if(!dragging)beginDrag();
   const increment=delta/Math.max(240,viewportWidth*1.12)*spec.frames;
   target+=increment;const dt=Math.max(8,time-lastSample);
   velocity=clamp(velocity*.55+increment/dt*.45,-.014,.014);lastSample=time;lastMove=time;
   viewport.classList.add('is-spinning');request();load();
  }
  function endDrag(cancelled=false){
   if(!dragging)return;
   dragging=false;viewport.classList.remove('is-spinning');
   if(cancelled||reduced()||now()-lastMove>90)velocity=0;
   if(cancelled){target=position;stop();paint();}else request();
  }
  function setAuto(value){stop();automatic=!!value&&!reduced();onMotion(automatic);if(automatic)load();request();return automatic;}
  function setEnabled(value){stop();enabled=!!value;paint();if(enabled)load();}
  function freeze(){stop();position=target=Math.round(position);paint();}
  if(preloadOnHover){listen(viewport,'pointerenter',()=>load(),{passive:true});listen(viewport,'focusin',()=>load(),{passive:true});}
  listen(window,'mova:motion',e=>{if(e.detail?.paused)freeze();else onMotion(automatic);});
  listen(document,'visibilitychange',()=>{if(document.hidden)freeze();});
  listen(window,'blur',()=>{pointer=null;axis=null;multiple=false;pointers.clear();freeze();});
  if(drag){
   listen(viewport,'dragstart',e=>e.preventDefault());
   listen(viewport,'pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    pointers.add(e.pointerId);load();
    if(pointers.size>1){multiple=true;pointer=null;endDrag(true);suppressUntil=now()+700;return;}
    multiple=false;axis=null;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,last:e.clientX};beginDrag();
    try{viewport.setPointerCapture(e.pointerId);}catch{}
   });
   listen(viewport,'pointermove',e=>{
    if(!pointer||multiple||pointer.id!==e.pointerId)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!axis&&Math.hypot(dx,dy)>5)axis=Math.abs(dx)>Math.abs(dy)*1.25?'spin':'scroll';
    if(axis==='spin'){e.preventDefault();suppressUntil=now()+700;rotate(e.clientX-pointer.last,e.timeStamp||now());}
    pointer.last=e.clientX;
   },{passive:false});
   function end(e,cancelled=false){
    if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);
    if(pointer?.id===e.pointerId){if(axis==='spin')suppressUntil=now()+700;endDrag(cancelled||axis!=='spin');pointer=null;axis=null;}
    if(!pointers.size)multiple=false;
    try{if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);}catch{}
   }
   listen(viewport,'pointerup',e=>end(e));listen(viewport,'pointercancel',e=>end(e,true));listen(viewport,'lostpointercapture',e=>end(e,true));
   listen(viewport,'click',e=>{if(e.detail!==0&&now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
   listen(viewport,'keydown',e=>{
    if(e.target!==viewport||!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;
    e.preventDefault();e.stopPropagation();if(e.key==='Home')goTo(0,{animate:true});else advance(e.key==='ArrowRight'?1:-1);
   });
  }
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;
  observer?.observe(viewport);listen(window,'resize',resize);
  resize();paint();if(preloadOnHover&&cache.has(spec.src))load();
  return {load,resize,goTo,advance,rotate,beginDrag,endDrag,setEnabled,setAuto,stop:freeze,seekAngle:angle=>goTo(angle/360*spec.frames),snapshot:()=>({frame:wrap(position,spec.frames),position:mod(position,spec.frames),target:mod(target,spec.frames),angle:mod(position,spec.frames)*360/spec.frames,velocity,animating:!!raf,dragging,automatic,ready,enabled,disposed}),destroy(){
   if(disposed)return;stop();disposed=true;observer?.disconnect();removers.forEach(fn=>fn());
   for(const id of pointers){try{viewport.releasePointerCapture(id);}catch{}}
   pointers.clear();surface.remove();image.classList.remove('spin-poster-hidden');viewport.classList.remove('has-spin');delete viewport.dataset.spinFrame;delete viewport.dataset.spinAngle;delete viewport.dataset.spinState;
  }};
 }
 return Object.freeze({attach,wrap,coast});
})();
