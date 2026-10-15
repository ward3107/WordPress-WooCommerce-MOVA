/* Product-image gestures: pointer capture, anchored pinch/pan, mouse and keys.
 * No page-wide gesture suppression; listeners belong only to the image area.
 */
window.MOVA_ZOOM=(()=>{
 'use strict';
 const MIN=1,MAX=12;
 const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
 const bounded=(state,box,maxScale=MAX)=>{
  const scale=clamp(Number.isFinite(state.scale)?state.scale:MIN,MIN,maxScale);
  const xMax=Math.max(0,(box.size*scale-box.width)/2),yMax=Math.max(0,(box.size*scale-box.height)/2);
  return {scale,x:xMax?clamp(Number.isFinite(state.x)?state.x:0,-xMax,xMax):0,y:yMax?clamp(Number.isFinite(state.y)?state.y:0,-yMax,yMax):0};
 };
 const around=(state,nextScale,point,box,maxScale=MAX)=>{
  const scale=clamp(nextScale,MIN,maxScale),ratio=scale/state.scale;
  return bounded({scale,x:point.x-(point.x-state.x)*ratio,y:point.y-(point.y-state.y)*ratio},box,maxScale);
 };
 function attach({viewport,track,readout,scrollParent,onState=()=>{},onIntent=()=>{},onRotate=null,onRotateStart=()=>{},onRotateEnd=()=>{},canRotate=()=>false,onStep=null,maxScale=MAX}){
  if(!viewport||!track)throw Error('A product viewport and image track are required');
  let state={scale:1,x:0,y:0},box={width:1,height:1,size:1},pointers=new Map(),baseline=null,frame=0,disposed=false,lastTap=null,pinched=false,moved=false,startedAt=0,startPoint=null,lastTouch=-Infinity;
  const removers=[];let axis=null,lastX=0;
  const listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);removers.push(()=>target.removeEventListener(type,fn,options));};
  const point=p=>{const rect=viewport.getBoundingClientRect();return {x:p.clientX-rect.left-rect.width/2,y:p.clientY-rect.top-rect.height/2};};
  const metrics=()=>{
   const ps=[...pointers.values()];if(!ps.length)return null;
   const a=point(ps[0]),b=ps[1]?point(ps[1]):a;
   return {count:ps.length,point:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),clientY:ps[0].clientY};
  };
  const rebase=()=>{const m=metrics();baseline=m?{...m,state:{...state}}:null;};
  function paint(){
   frame=0;if(disposed)return;
   track.style.transform=`translate(-50%,-50%) translate3d(${state.x.toFixed(3)}px,${state.y.toFixed(3)}px,0) scale(${state.scale.toFixed(5)})`;
   viewport.dataset.zoom=state.scale.toFixed(2);viewport.classList.toggle('is-zoomed',state.scale>1.01);
   if(readout)readout.textContent=state.scale.toFixed(state.scale<10?1:0)+'×';
   onState({...state});
  }
  const render=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(paint);};
  const apply=next=>{state=bounded(next,box,maxScale);render();};
  function resize(){
   const rect=viewport.getBoundingClientRect();const width=rect.width||viewport.clientWidth||1,height=rect.height||viewport.clientHeight||1;
   const old=box.size;box={width,height,size:Math.min(width,height)};
   track.style.width=box.size+'px';track.style.height=box.size+'px';
   state=bounded({...state,x:state.x*box.size/old,y:state.y*box.size/old},box,maxScale);rebase();render();
  }
  const reset=()=>{apply({scale:1,x:0,y:0});rebase();};
  const zoomAt=(scale,p={x:0,y:0})=>{onIntent();apply(around(state,scale,p,box,maxScale));rebase();};
  const focus=(x,y,scale=3.5)=>{onIntent();apply({scale,x:(.5-clamp(x,0,1))*box.size*scale,y:(.5-clamp(y,0,1))*box.size*scale});rebase();};
  listen(viewport,'pointerdown',event=>{
   if(event.pointerType==='mouse'&&event.button!==0)return;
   if(event.target.closest('button'))return;
   viewport.focus({preventScroll:true});
   if(!pointers.size){if(canRotate())onRotateStart();pinched=false;moved=false;axis=null;lastX=event.clientX;startedAt=performance.now();startPoint={x:event.clientX,y:event.clientY};}
   pointers.set(event.pointerId,{clientX:event.clientX,clientY:event.clientY,type:event.pointerType});
   try{viewport.setPointerCapture(event.pointerId);}catch{/* The pointer may already have ended. */}
   if(pointers.size>1){onRotateEnd(true);pinched=true;lastTap=null;onIntent();}
   rebase();
  });
  listen(viewport,'pointermove',event=>{
   if(!pointers.has(event.pointerId))return;
   pointers.set(event.pointerId,{clientX:event.clientX,clientY:event.clientY,type:event.pointerType});
   const m=metrics();if(!baseline||!m)return;
   const dx=m.point.x-baseline.point.x,dy=m.point.y-baseline.point.y;
   if((startPoint&&Math.hypot(event.clientX-startPoint.x,event.clientY-startPoint.y)>5)||Math.abs(m.distance-baseline.distance)>3)moved=true;
   if(m.count>=2&&baseline.count>=2){
    event.preventDefault();const scale=clamp(baseline.state.scale*m.distance/baseline.distance,1,maxScale),ratio=scale/baseline.state.scale;
    apply({scale,x:m.point.x-(baseline.point.x-baseline.state.x)*ratio,y:m.point.y-(baseline.point.y-baseline.state.y)*ratio});
   }else if(state.scale>1.01){event.preventDefault();apply({...baseline.state,x:baseline.state.x+dx,y:baseline.state.y+dy});}
   else if(!pinched&&onRotate&&canRotate()){
    const totalX=event.clientX-startPoint.x,totalY=event.clientY-startPoint.y;
    if(!axis&&Math.hypot(totalX,totalY)>7)axis=Math.abs(totalX)>Math.abs(totalY)*1.25?'spin':'scroll';
    if(axis==='spin'){event.preventDefault();onRotate(event.clientX-lastX,event.timeStamp);}
    else if(axis==='scroll'&&event.pointerType==='touch'&&scrollParent){scrollParent.scrollTop-=m.clientY-baseline.clientY;rebase();}
    lastX=event.clientX;
   }else if(event.pointerType==='touch'&&scrollParent){
    // The image captures multi-touch. A one-finger swipe at 1× still scrolls
    // the product sheet, so the picture does not become a scroll dead end.
    scrollParent.scrollTop-=m.clientY-baseline.clientY;rebase();
   }
  },{passive:false});
  function end(event,cancelled=false){
   if(!pointers.has(event.pointerId))return;
   const p=point(event);pointers.delete(event.pointerId);if(!pointers.size)onRotateEnd(cancelled||pinched||axis!=='spin');
   try{if(viewport.hasPointerCapture?.(event.pointerId))viewport.releasePointerCapture(event.pointerId);}catch{}
   if(!cancelled&&!pointers.size&&!pinched&&!moved&&event.pointerType==='touch'&&performance.now()-startedAt<350){
    const now=performance.now();
    if(lastTap&&now-lastTap.time<320&&Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<28){zoomAt(state.scale>1.01?1:3,p);lastTap=null;}
    else lastTap={time:now,x:event.clientX,y:event.clientY};
   }
   if(event.pointerType==='touch')lastTouch=performance.now();
   if(cancelled)lastTap=null;rebase();render();
  }
  listen(viewport,'pointerup',e=>end(e));listen(viewport,'pointercancel',e=>end(e,true));listen(viewport,'lostpointercapture',e=>end(e,true));
  listen(viewport,'dblclick',e=>{if(e.target.closest('button')||e.sourceCapabilities?.firesTouchEvents||performance.now()-lastTouch<600)return;e.preventDefault();zoomAt(state.scale>1.01?1:3,point(e));});
  listen(viewport,'wheel',e=>{
   // Trackpad pinch arrives as ctrl+wheel. Ordinary wheel scrolling at 1×
   // remains available until this image is focused.
   if(!e.ctrlKey&&document.activeElement!==viewport&&state.scale<=1.01)return;
   e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?box.height:1);
   zoomAt(state.scale*Math.exp(-clamp(delta,-200,200)*.006),point(e));
  },{passive:false});
  listen(viewport,'keydown',e=>{
   if(e.target!==viewport)return;
   const next={...state},step=box.size*.12;
   if(['+','=','Add'].includes(e.key))zoomAt(state.scale*1.3);
   else if(['-','_','Subtract'].includes(e.key))zoomAt(state.scale/1.3);
   else if(['0','Home','Escape'].includes(e.key)&&state.scale>1.01){reset();if(e.key==='Escape')e.stopPropagation();}
   else if(state.scale<=1.01&&canRotate()&&onStep&&['ArrowLeft','ArrowRight'].includes(e.key))onStep(e.key==='ArrowRight'?1:-1);
   else if(e.key==='ArrowLeft'){next.x+=step;apply(next);}
   else if(e.key==='ArrowRight'){next.x-=step;apply(next);}
   else if(e.key==='ArrowUp'){next.y+=step;apply(next);}
   else if(e.key==='ArrowDown'){next.y-=step;apply(next);}
   else return;
   e.preventDefault();
  });
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;
  observer?.observe(viewport);listen(window,'resize',resize);
  listen(window,'blur',()=>{onRotateEnd(true);pointers.clear();baseline=null;lastTap=null;});
  resize();
  return {reset,focus,resize,zoomAt,snapshot:()=>({...state,box:{...box},pointers:pointers.size}),destroy(){if(disposed)return;disposed=true;observer?.disconnect();removers.forEach(fn=>fn());for(const id of pointers.keys()){try{viewport.releasePointerCapture(id);}catch{}}pointers.clear();if(frame)cancelAnimationFrame(frame);}};
 }
 return Object.freeze({MIN,MAX,bounded,around,attach});
})();
