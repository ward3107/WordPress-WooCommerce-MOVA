/* The flagship owns only its hero and the opening handoff. Commerce stays in MOVA_SHOP. */
window.MOVA_FLAGSHIP=(()=>{
  'use strict';
  let initialized=false,spin=null,zoom=null,view='spin',t=key=>key,reduced=()=>true;
  let transfer=null,transferAnimation=null,observer=null,visible=true;
  const $=selector=>document.querySelector(selector);
  const status=key=>{if($('#flagshipStatus'))$('#flagshipStatus').textContent=t(key);};
  function translate(){
    if(!initialized)return;
    $('#flagshipGesture').textContent=t(view==='spin'?'flagshipGesture':'flagshipPhotoGesture');
  }
  function setView(next,{load=true}={}){
    if(!initialized||!['spin','photo'].includes(next))return;
    view=next;spin.stop();zoom.reset();
    // The high-resolution poster stays visible until the visitor requests rotation.
    if(view==='spin'&&load)spin.setEnabled(true);
    else {spin.setEnabled(false);if(!load)spin.goTo(0,{loadImage:false});}
    document.querySelectorAll('[data-flagship-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.flagshipView===view)));
    $('#flagshipAngle').hidden=view!=='spin';translate();
  }
  function init(options){
    if(initialized||!$('#flagshipViewport'))return;
    initialized=true;t=options.t;reduced=options.reduced;
    const viewport=$('#flagshipViewport'),track=$('#flagshipTrack');
    const spec=window.MOVA_CATALOG.products.find(product=>product.id==='move').spin;
    spin=window.MOVA_SPIN.attach({viewport,image:$('#heroShoe'),spec,reduced,preloadOnHover:false,
      onPosition:angle=>{$('#flagshipAngle').textContent=Math.round(angle)+'°';},
      onReady:()=>status('flagshipReady'),onError:()=>{setView('photo');status('flagshipUnavailable');}
    });
    zoom=window.MOVA_ZOOM.attach({viewport,track,readout:$('#flagshipZoom'),maxScale:8,
      scrollParent:document.scrollingElement||document.documentElement,
      canRotate:()=>view==='spin',
      onRotateStart:()=>{if(view==='spin'){spin.setEnabled(true);spin.beginDrag();}},
      onRotate:(delta,time)=>spin.rotate(delta,time),onRotateEnd:cancelled=>spin.endDrag(cancelled),
      onStep:delta=>{spin.setEnabled(true);spin.advance(delta);},
      onIntent:()=>{if(view==='spin')spin.setEnabled(true);}
    });
    // Loading on mere hover would swap the opening's photograph before its handoff.
    spin.setEnabled(false);
    document.querySelectorAll('[data-flagship-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.flagshipView)));
    const reset=()=>{zoom.reset();spin.stop();if(view==='spin'){spin.setEnabled(true);spin.goTo(0);}status('flagshipResetDone');};
    $('#flagshipReset').addEventListener('click',reset);
    viewport.addEventListener('keydown',event=>{if(event.target===viewport&&event.key==='Home'){event.preventDefault();reset();}});
    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(!visible)spin.stop();},{threshold:0});
      observer.observe(viewport);
    }
    window.addEventListener('mova:intro-start',()=>{endHandoff();setView('spin',{load:false});});
    window.addEventListener('pagehide',()=>{spin.stop();endHandoff();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){spin.stop();endHandoff();}});
    window.addEventListener('mova:motion',event=>{if(event.detail?.paused)endHandoff();});
    window.addEventListener('resize',endHandoff);
    translate();
  }
  function handoff(dialog){
    endHandoff();
    if(!initialized||reduced()||!visible||document.hidden)return false;
    const source=dialog.querySelector('.cinema-product-main img'),target=$('#heroShoe');
    if(!source||!target||typeof source.animate!=='function')return false;
    const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();
    if(!a.width||!a.height||!b.width||!b.height||b.top<0||b.bottom>window.innerHeight)return false;
    transfer=document.createElement('img');transfer.src=source.currentSrc||source.src;
    transfer.alt='';transfer.setAttribute('aria-hidden','true');transfer.className='cinema-handoff';
    Object.assign(transfer.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});
    dialog.append(transfer);document.documentElement.classList.add('flagship-handoff');
    try{
      transferAnimation=transfer.animate([
        {transform:'translate(0,0) scale(1,1)'},
        {transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(${b.width/a.width},${b.height/a.height})`}
      ],{duration:550,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
      return true;
    }catch{endHandoff();return false;}
  }
  function endHandoff(){
    transferAnimation?.cancel();transferAnimation=null;transfer?.remove();transfer=null;
    document.documentElement.classList.remove('flagship-handoff');
  }
  return Object.freeze({init,translate,handoff,endHandoff,
    snapshot:()=>({initialized,view,visible,transferring:!!transfer,spin:spin?.snapshot(),zoom:zoom?.snapshot()})});
})();
