/* Small UI bridge; Three.js and the model are loaded only when needed. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const COPY={
    he:{openLabel:'סיבוב 360° + פירוק',interactive:'תלת־ממד אינטראקטיבי',posterAlt:'נעל קונספט MOVE 01',start:'לסובב ולגלות מבפנים',loading:'מכינים את הנעל שלך...',viewTools:'כלי תצוגה',zoomIn:'התקרבות',zoomOut:'התרחקות',reset:'איפוס התצוגה',dragHint:'גררו לסיבוב. צבטו בשתי אצבעות לזום. הקישו לפירוק.',modeLabel:'בחירת תצוגה',assembled:'שלמה',exploded:'פירוק לשכבות',skeleton:'סקלטון',autoRotate:'סיבוב אוטומטי',stopRotate:'עצירת סיבוב',separation:'כמה להפריד?',keyboardHelp:'חיצים לסיבוב, פלוס ומינוס לזום, Enter לפירוק או הרכבה, Home לאיפוס.',title:'מבחוץ זה סטייל.\nמבפנים זה סיפור.',intro:'סובבו את הנעל לכל כיוון, הפרידו את השכבות וגלו את הצורה של כל חלק.',layerLabel:'בחירת שכבה',upper:'גפת הסריג',upperHint:'מעטפת, פאנלים ושרוכים',insole:'המדרס',insoleHint:'השכבה שנמצאת בפנים',cage:'המבנה הפנימי',cageHint:'רשת התמיכה של הקונספט',midsole:'שכבת הביניים',midsoleHint:'הצורה שמתחת למעטפת',outsole:'הסוליה החיצונית',outsoleHint:'לראות גם את הצד התחתון',finish:'הנגיעה שלך',colorLabel:'בחירת צבע',orange:'כתום',mint:'ירוק',choose:'לבחירת צבע ומידה',conceptNote:'המחשת עיצוב קונספטואלית. המבנה אינו מפרט של נעל אמיתית.',photoDetails:'תמונת המוצר ופרטים מקרוב',ready:'הנעל מוכנה לסיבוב ולפירוק.',error:'תצוגת התלת־ממד לא נטענה. אפשר לנסות שוב או לצפות בתמונת המוצר.',retry:'לנסות שוב',canvasLabel:'נעל MOVE 01 בתלת־ממד. גרירה לסיבוב, לחיצה לפירוק.',partial:'הפרדה {value} אחוז',selected:'השכבה שנבחרה: {layer}',contextLost:'התצוגה נעצרה. לחצו כדי לטעון אותה מחדש.'},
    en:{openLabel:'360° view + disassembly',interactive:'Interactive 3D',posterAlt:'MOVE 01 concept sneaker',start:'Rotate. Discover what’s inside.',loading:'Preparing your sneaker...',viewTools:'View controls',zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Reset view',dragHint:'Drag to rotate. Pinch to zoom. Tap to separate.',modeLabel:'Choose a view',assembled:'Whole',exploded:'Exploded view',skeleton:'Skeleton',autoRotate:'Auto rotate',stopRotate:'Stop rotation',separation:'Layer separation',keyboardHelp:'Arrow keys to rotate, plus and minus to zoom, Enter to separate or assemble, Home to reset.',title:'Style on the outside.\nA story on the inside.',intro:'Turn the sneaker in any direction, separate the layers, and discover the form of each piece.',layerLabel:'Select a layer',upper:'The knit upper',upperHint:'Shell, panels and laces',insole:'The insole',insoleHint:'The layer on the inside',cage:'Internal structure',cageHint:'The concept’s support lattice',midsole:'The middle layer',midsoleHint:'The form below the shell',outsole:'The outsole',outsoleHint:'See the underside, too',finish:'Your finishing touch',colorLabel:'Choose an accent color',orange:'Orange',mint:'Green',choose:'Choose color & size',conceptNote:'An illustrative concept assembly, not the technical specifications of a real sneaker.',photoDetails:'Product photograph and close-ups',ready:'Ready to rotate and take apart.',error:'The 3D view could not load. Try again or explore the product photograph.',retry:'Try again',canvasLabel:'MOVE 01 sneaker in 3D. Drag to rotate; tap to separate.',partial:'{value} percent separated',selected:'Selected layer: {layer}',contextLost:'The view paused. Tap to reload it.'},
    ar:{openLabel:'دوران 360° + تفكيك',interactive:'ثلاثي الأبعاد تفاعلي',posterAlt:'حذاء مفهوم MOVE 01',start:'أدر الحذاء واكتشف ما بداخله',loading:'نجهّز حذاءك...',viewTools:'أدوات العرض',zoomIn:'تقريب',zoomOut:'إبعاد',reset:'إعادة ضبط العرض',dragHint:'اسحب للدوران، وكبّر بإصبعين. اضغط للتفكيك.',modeLabel:'اختر طريقة العرض',assembled:'كامل',exploded:'تفكيك الطبقات',skeleton:'الهيكل',autoRotate:'دوران تلقائي',stopRotate:'إيقاف الدوران',separation:'مسافة الفصل',keyboardHelp:'الأسهم للدوران، زائد وناقص للتقريب، Enter للتفكيك أو التجميع، Home لإعادة الضبط.',title:'أسلوب من الخارج.\nقصة من الداخل.',intro:'أدر الحذاء في أي اتجاه، افصل الطبقات واكتشف شكل كل قطعة.',layerLabel:'اختر طبقة',upper:'النسيج العلوي',upperHint:'الغلاف والألواح والأربطة',insole:'الفرشة الداخلية',insoleHint:'الطبقة الموجودة في الداخل',cage:'الهيكل الداخلي',cageHint:'شبكة دعم تصميم المفهوم',midsole:'الطبقة الوسطى',midsoleHint:'الشكل أسفل الغلاف',outsole:'النعل الخارجي',outsoleHint:'شاهد الجانب السفلي أيضاً',finish:'لمستك الخاصة',colorLabel:'اختر لون اللمسة',orange:'برتقالي',mint:'أخضر',choose:'اختر اللون والمقاس',conceptNote:'عرض لبنية تصميم مفهوم، وليس مواصفات فنية لحذاء حقيقي.',photoDetails:'صورة المنتج وتفاصيل عن قرب',ready:'جاهز للدوران والتفكيك.',error:'تعذّر تحميل العرض ثلاثي الأبعاد. جرّب مجدداً أو شاهد صورة المنتج.',retry:'حاول مجدداً',canvasLabel:'حذاء MOVE 01 ثلاثي الأبعاد. اسحب للدوران واضغط للتفكيك.',partial:'الفصل {value} بالمئة',selected:'الطبقة المختارة: {layer}',contextLost:'توقّف العرض. اضغط لإعادة تحميله.'}
  };
  const layerKeys=['UPPER','INSOLE','CAGE','MIDSOLE','OUTSOLE'];
  let state={mode:'assembled',explosion:0,skeleton:false,auto:false,selected:null,variant:'orange',zoom:1};
  let viewer=null,loadPromise=null,visible=true,failed=false,loadEpoch=0,presentation='model';
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=()=>media.matches||document.documentElement.classList.contains('paused-motion');
  const lang=()=>COPY[document.documentElement.lang]?document.documentElement.lang:'he';
  const label=(key,values={})=>(COPY[lang()][key]??COPY.he[key]??key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  function syncUI(announce=false){
    $('#shoeViewport').dataset.presentation=presentation;
    $$('[data-lab-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.labView===presentation)));
    $('#shoeReference').style.filter=state.variant==='mint'?'hue-rotate(125deg) saturate(.55)':'none';
    for(const id of ['shoeReset'])$('#'+id).disabled=presentation==='photo';
    $$('[data-lab-i18n]').forEach(e=>{e.textContent=label(e.dataset.labI18n);});
    $$('[data-lab-aria]').forEach(e=>e.setAttribute('aria-label',label(e.dataset.labAria)));
    $$('[data-lab-alt]').forEach(e=>e.alt=label(e.dataset.labAlt));
    $$('[data-shoe-mode]').forEach(b=>{const active=b.dataset.shoeMode===state.mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('[data-shoe-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shoeLayer===state.selected)));
    $$('[data-shoe-color]').forEach(b=>{const active=b.dataset.shoeColor===state.variant;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('#shoeExplodeRange').value=String(state.explosion);$('#shoeExplodeValue').textContent=state.explosion+'%';
    $('#shoeExplodeRange').setAttribute('aria-valuetext',state.explosion===0?label('assembled'):label('partial',{value:state.explosion}));
    $('#shoeAuto').disabled=reduced()||presentation==='photo';$('#shoeAuto').setAttribute('aria-pressed',String(state.auto&&!reduced()));
    $('#shoeAutoLabel').textContent=label(state.auto?'stopRotate':'autoRotate');
    $('#shoeModelState').textContent=state.mode==='assembled'?'01 / ASSEMBLED':state.mode==='skeleton'?'03 / SKELETON':'02 / EXPLODED';
    if(failed)$('#shoeStart span:last-child').textContent=label('retry');
    if(viewer){viewer.setState({...state,reduced:reduced()});viewer.setLabel(label('canvasLabel'));viewer.setVisible(visible&&!document.hidden&&presentation==='model');}
    if(announce)$('#shoeStatus').textContent=state.selected?label('selected',{layer:label(state.selected.toLowerCase())}):label(state.mode);
  }
  function act(type,value){
    if(type!=='variant')presentation='model';
    switch(type){
      case 'mode':if(!['assembled','exploded','skeleton'].includes(value))return;state.mode=value;state.skeleton=value==='skeleton';state.explosion=value==='assembled'?0:value==='skeleton'?75:100;state.selected=null;break;
      case 'explosion':state.explosion=Math.max(0,Math.min(100,Math.round(Number(value)||0)));state.mode=state.skeleton?'skeleton':state.explosion?'exploded':'assembled';break;
      case 'layer':if(!layerKeys.includes(value))return;state.selected=state.selected===value?null:value;if(state.selected&&value!=='UPPER'&&state.explosion<70){state.explosion=100;state.mode=state.skeleton?'skeleton':'exploded';}break;
      case 'variant':if(!['orange','mint'].includes(value))return;state.variant=value;break;
      case 'auto':state.auto=reduced()?false:!state.auto;break;
      case 'zoom':state.zoom=Math.max(.7,Math.min(12,state.zoom*Number(value)));break;
      case 'zoomValue':state.zoom=Math.max(.7,Math.min(12,Number(value)||1));break;
      case 'reset':state={mode:'assembled',explosion:0,skeleton:false,auto:false,selected:null,variant:state.variant,zoom:1};viewer?.resetCamera();break;
      case 'tap':act('mode',state.explosion>0?'assembled':'exploded');return;
      default:return;
    }
    syncUI(type!=='zoom'&&type!=='zoomValue'&&type!=='explosion');
    if(!viewer)loadViewer();
  }
  async function loadViewer(factory){
    if(viewer)return viewer;
    if(loadPromise)return loadPromise;
    failed=false;$('#shoeViewport').classList.remove('is-error');$('#shoeLoader').hidden=false;$('#shoeStart').hidden=true;$('#shoeViewport').setAttribute('aria-busy','true');
    const epoch=++loadEpoch;
    const request=(async()=>{
      try{
        const create=factory||(await import('./shoe-viewer.js?v=7')).createShoeViewer;
        const created=await create({mount:$('#shoeCanvasMount'),onTap:()=>act('tap'),onAutoStop:()=>{state.auto=false;syncUI();},onReset:()=>act('reset'),onZoom:value=>act('zoom',value),onZoomChange:value=>act('zoomValue',value),onContextLost:()=>{loadEpoch++;viewer?.dispose();viewer=null;loadPromise=null;failed=true;$('#shoeViewport').classList.remove('ready');$('#shoeViewport').classList.add('is-error');$('#shoeLoader').hidden=true;$('#shoeViewport').setAttribute('aria-busy','false');$('#shoeStatus').textContent=label('contextLost');$('#shoeStart').hidden=false;syncUI();}});
        if(epoch!==loadEpoch){created?.dispose();return null;}
        viewer=created;
        $('#shoeViewport').classList.add('ready');$('#shoeLoader').hidden=true;$('#shoeViewport').setAttribute('aria-busy','false');
        syncUI();$('#shoeStatus').textContent=label('ready');
        return viewer;
      }catch(error){
        failed=true;viewer=null;loadPromise=null;$('#shoeLoader').hidden=true;$('#shoeStart').hidden=false;$('#shoeViewport').classList.add('is-error');$('#shoeViewport').setAttribute('aria-busy','false');$('#shoeStatus').textContent=label('error');syncUI();return null;
      }
    })();
    loadPromise=request;
    const result=await request;
    if(!result&&loadPromise===request)loadPromise=null;
    return result;
  }
  function openLab(){
    const product=$('#productDialog');
    if(product.open)product.querySelector('[data-close-dialog]')?.click();
    const target=$('#anatomy');target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});target.focus({preventScroll:true});
    presentation='model';syncUI();loadViewer();
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.labView){presentation=b.dataset.labView==='photo'?'photo':'model';if(presentation==='photo')state.auto=false;syncUI();if(presentation==='model'&&!viewer)loadViewer();return;}
    if(b.hasAttribute('data-open-anatomy')){openLab();return;}
    if(b.dataset.shoeMode){act('mode',b.dataset.shoeMode);return;}
    if(b.dataset.shoeLayer){act('layer',b.dataset.shoeLayer);return;}
    if(b.dataset.shoeColor){act('variant',b.dataset.shoeColor);return;}
    if(b.id==='shoeStart')loadViewer();
    if(b.id==='shoeAuto')act('auto');
    if(b.id==='shoeReset')act('reset');
  });
  $('#shoeExplodeRange').addEventListener('input',e=>act('explosion',e.target.value));
  $('#language').addEventListener('change',()=>syncUI());
  window.addEventListener('mova:variant',e=>{if(e.detail?.id==='move'&&['orange','mint'].includes(e.detail.color)){state.variant=e.detail.color;syncUI();}});
  const onMotion=()=>{if(reduced())state.auto=false;syncUI();};
  new MutationObserver(onMotion).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  if(media.addEventListener)media.addEventListener('change',onMotion);else media.addListener(onMotion);
  document.addEventListener('visibilitychange',()=>viewer?.setVisible(visible&&!document.hidden&&presentation==='model'));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{for(const e of entries){visible=e.isIntersecting;viewer?.setVisible(visible&&!document.hidden&&presentation==='model');if(visible&&!failed&&!viewer&&presentation==='model')loadViewer();}},{rootMargin:'160px'});
    observer.observe($('#shoeViewport'));
  }else{
    const check=()=>{const r=$('#shoeViewport').getBoundingClientRect();visible=r.height>0&&r.bottom>0&&r.top<innerHeight+160;viewer?.setVisible(visible&&!document.hidden&&presentation==='model');if(visible&&!failed&&!viewer&&presentation==='model')loadViewer();};
    window.addEventListener('scroll',check,{passive:true});check();
  }
  window.MOVA_LAB=Object.freeze({load:loadViewer,label,setVariant:color=>act('variant',color),snapshot:()=>({...state,loaded:!!viewer,loading:!!loadPromise&&!viewer,failed})});
  syncUI();
  if(location.hash==='#anatomy')openLab();
})();
