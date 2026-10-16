/* Dependency-free storefront demo. No network, analytics, or payment requests.
 * User-entered text is never injected as markup. Stored cart values are validated.
 */
(() => {
  'use strict';
  const {brand,products}=window.MOVA_CATALOG;
  const core=window.MOVA_CORE;
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const safeRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Works in memory if storage is unavailable. */}};
  const storedLanguage=safeRead('mova-language',brand.defaultLanguage);
  const storedFavorites=safeRead('mova-favorites',[]);
  const state={lang:['he','en','ar'].includes(storedLanguage)?storedLanguage:'he',cart:core.sanitizeCart(safeRead('mova-cart',[])),favorites:Array.isArray(storedFavorites)?[...new Set(storedFavorites.filter(id=>core.product(id)))]:[],filter:'all',query:'',favoritesOnly:false,cardColors:{},selected:null,detail:'whole',mood:'move',userPaused:safeRead('mova-paused',false)===true};
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const he={};
  for(const [attribute,dataset,source] of [['data-i18n','i18n','textContent'],['data-i18n-aria','i18nAria','aria-label'],['data-i18n-alt','i18nAlt','alt'],['data-i18n-placeholder','i18nPlaceholder','placeholder']]){
    $$(`[${attribute}]`).forEach(el=>{he[el.dataset[dataset]]=source==='textContent'?el.textContent:el.getAttribute(source);});
  }
  Object.assign(he,{items:'{count} פריטים',oneItem:'פריט אחד',favoriteAdded:'נוסף למועדפים שלך',favoriteRemoved:'הוסר מהמועדפים',chooseOptions:'לבחירת צבע ומידה',chooseColor:'בחירת צבע',size:'מידה',color:'צבע',quantity:'כמות',addToBag:'להוסיף לתיק',addedToBag:'בתיק שלך ✓',added:'הפריט נוסף לתיק שלך',productDetails:'העיצוב מקרוב',colorSimulation:'צבעי ההדגמה מוצגים בהדמיה. אין מכירה או חיוב.',zoom:'הגדלת תמונת המוצר',zoomOut:'הקטנת תמונת המוצר',decrease:'הפחתת כמות',increase:'הגדלת כמות',remove:'הסרה',subtotal:'סך הכול להדגמה',demoCheckout:'להמשך ההדגמה',cartNote:'מחירים להדגמה בלבד. אין הזמנה, משלוח או חיוב.',emptyCart:'התיק שלך מחכה.',emptyCartText:'משהו תפס לך את העין? בחרו פריט, צבע ומידה והוסיפו אותו לכאן.',backToCollection:'לגלות את הקולקציה',maxQty:'עד 10 פריטים לכל בחירה.',copied:'הקישור הועתק. אפשר לשלוח אותו עכשיו.',copyFailed:'אפשר לשתף דרך WhatsApp או Facebook.',shareTitle:'MOVA — סטייל בתנועה',shareText:'החנות הזאת מרגישה אחרת. כנסו לגלות את MOVA.',reduceMotion:'הפחתת תנועה',enableMotion:'הפעלת תנועה',systemMotion:'תנועה מופחתת במכשיר',detailWholeTitle:'צורה שלא עומדת במקום.',detailWholeText:'קווים מעוגלים, שכבות וטאץ׳ של כתום. כל פרט הוא חלק מהתמונה השלמה.',detailMeshTitle:'לראות את הטקסטורה.',detailMeshText:'הזום מגלה את הסריג, התפרים והמפגש בין החומרים. כאן העיצוב הופך למשהו שאפשר כמעט להרגיש.',detailSoleTitle:'נקודת מבט חדשה.',detailSoleText:'צורה פיסולית, חריצים ושכבות. מתקרבים לסוליה ומגלים עוד צד של אותו פריט.',moodMoveHeadline:'היום מתחיל בצעד שלך.',moodFocusHeadline:'רגע אחד. רק בשבילך.',moodGoHeadline:'לאן שהיום ייקח אותך.',moodMoveCategory:'IN YOUR ELEMENT',moodFocusCategory:'MAKE ROOM FOR QUIET',moodGoCategory:'EVERYDAY, EVERYWHERE',favoritesEmpty:'המועדפים שלך מחכים.',favoritesEmptyHint:'לחצו על הלב ליד פריט שאהבתם, והוא יחכה לכם כאן.',contactText:'היי, ראיתי את חנות MOVA ואני רוצה חנות כזו למותג שלי.'});
  const I18N={he,
    en:{skip:'Skip to the collection',announcement:'A concept store. Style in motion.',navigation:'Main navigation',collection:'The collection',details:'A closer look',journal:'The story',language:'Language',search:'Search',favorites:'Your favorites',cart:'Shopping bag',menu:'Menu',heroLine1:'Your everyday.',heroLine2:'Reimagined.',heroDescription:'Pieces that make you want to go. Design you can feel. Style that never stands still.',discover:'Explore the collection',meetMove:'Meet MOVE 01',heroNote:'Three pieces. Endless possibilities.',heroProduct:'Take a closer look',heroStageNote:'A little space for good design.',shoeAlt:'Cream concept sneaker with an orange panel',collectionTitle:'A few pieces. A lot of character.',collectionAside:'Step out. Tune in. Take it with you.\nPieces that move at your pace.',all:'All',footwear:'In motion',audio:'In focus',bags:'On the go',filterLabel:'Filter products',searchProducts:'Search the collection',searchPlaceholder:'Sneakers, headphones, backpack...',clearSearch:'Clear search',noResults:'That piece is not here.',noResultsHint:'Try another word or explore the whole collection.',showAll:'Show all pieces',catalogNote:'Concept catalog • Illustrative products and prices',detailsLine1:'It’s all in',detailsLine2:'the details.',detailsIntro:'Get closer. Discover more. Feel the design.',detailAlt:'MOVE 01 sneaker details',meshZoom:'Zoom into the knit',soleZoom:'Zoom into the sole',detailCanvasCaption:'Tap a plus to get closer',detailTabs:'Select a product detail',exploreMove:'Discover MOVE 01',detailHint:'The angle shifts gently as you scroll',editorialAlt:'Concept campaign: model in an orange jacket on concrete steps',editorialLine1:'Less noise.',editorialLine2:'More presence.',editorialDescription:'We love simple things with a twist. An unexpected shape, the right color, a detail that feels different. Pieces that stay with you without saying too much.',findYourStyle:'Find your everyday style',moodTitle:'What’s your kind of day?',moodIntro:'Three moods. One love for design.',moodLabel:'Select a mood',moveMood:'Find your rhythm',focusMood:'Make space for quiet',goMood:'Take your day with you',exploreProduct:'Discover the piece',invitationTitle:'Imagine your brand here.',invitationText:'The same attention to design. Your products, your colors, your story.',wantStore:'I want a store like this',share:'Share the store ↗',demoDisclaimer:'MOVA is a concept brand. No orders, charges or payments are made on this site.',yourBag:'Your bag',checkoutTitle:'You have good taste.',checkoutDescription:'This is where the demo ends. In a live store, this is where you would choose delivery and pay securely.',checkoutNote:'No order was placed. No payment was taken.',keepExploring:'Keep exploring',close:'Close',items:'{count} pieces',oneItem:'One piece',favoriteAdded:'Added to your favorites',favoriteRemoved:'Removed from favorites',chooseOptions:'Choose color & size',chooseColor:'Choose a color',size:'Size',color:'Color',quantity:'Quantity',addToBag:'Add to your bag',addedToBag:'In your bag ✓',added:'Added to your bag',productDetails:'The design, up close',colorSimulation:'Demo colors are visual simulations. No sale or payment.',zoom:'Enlarge the product image',zoomOut:'Reduce the product image',decrease:'Decrease quantity',increase:'Increase quantity',remove:'Remove',subtotal:'Demo total',demoCheckout:'Continue the demo',cartNote:'Illustrative prices. No order, delivery or charge.',emptyCart:'Your bag is waiting.',emptyCartText:'Something caught your eye? Pick a piece, a color and a size and add it here.',backToCollection:'Explore the collection',maxQty:'Up to 10 pieces per selection.',copied:'Link copied. It is ready to share.',copyFailed:'You can share via WhatsApp or Facebook.',shareTitle:'MOVA — Objects in Motion',shareText:'This store feels different. Discover MOVA.',reduceMotion:'Reduce motion',enableMotion:'Enable motion',systemMotion:'Device motion is reduced',detailWholeTitle:'A shape that keeps moving.',detailWholeText:'Rounded lines, layers and a flash of orange. Every detail is part of the bigger picture.',detailMeshTitle:'Get a feel for texture.',detailMeshText:'Get close to the knit, the stitches and the meeting of materials. The design almost becomes something you can feel.',detailSoleTitle:'A different perspective.',detailSoleText:'Sculptural forms, grooves and layers. Look closer at the sole and discover another side of the same piece.',moodMoveHeadline:'Your day. Your first step.',moodFocusHeadline:'A moment. Just for you.',moodGoHeadline:'Wherever the day takes you.',moodMoveCategory:'IN YOUR ELEMENT',moodFocusCategory:'MAKE ROOM FOR QUIET',moodGoCategory:'EVERYDAY, EVERYWHERE',favoritesEmpty:'Your favorites are waiting.',favoritesEmptyHint:'Tap the heart on a piece you love. It will be waiting here.',contactText:'Hi, I saw the MOVA concept store and I would like a store like this for my brand.'},
    ar:{skip:'انتقل إلى المجموعة',announcement:'متجر مفهوم. أسلوب في حركة.',navigation:'التنقل الرئيسي',collection:'المجموعة',details:'عن قرب',journal:'القصة',language:'اللغة',search:'بحث',favorites:'المفضلة',cart:'حقيبة التسوق',menu:'القائمة',heroLine1:'يومك.',heroLine2:'بإيقاع مختلف.',heroDescription:'قطع تشجّعك على الانطلاق. تصميم تشعر به. وأسلوب لا يقف مكانه.',discover:'اكتشف المجموعة',meetMove:'تعرّف على MOVE 01',heroNote:'ثلاث قطع. احتمالات كثيرة.',heroProduct:'شاهد التفاصيل',heroStageNote:'مساحة للتصميم الجميل.',shoeAlt:'حذاء مفهوم كريمي بلوحة برتقالية',collectionTitle:'قطع قليلة. شخصية كبيرة.',collectionAside:'انطلق. ركّز. خذها معك.\nقطع تمشي بإيقاعك.',all:'الكل',footwear:'في حركة',audio:'في تركيز',bags:'في الطريق',filterLabel:'تصفية المنتجات',searchProducts:'ابحث في المجموعة',searchPlaceholder:'أحذية، سماعات، حقيبة...',clearSearch:'مسح البحث',noResults:'لم نجد هذه القطعة.',noResultsHint:'جرّب كلمة أخرى أو استكشف المجموعة كاملة.',showAll:'عرض كل القطع',catalogNote:'كتالوج مفهوم • منتجات وأسعار للعرض فقط',detailsLine1:'الفرق يكمن',detailsLine2:'في التفاصيل.',detailsIntro:'اقترب. اكتشف. اشعر بالتصميم.',detailAlt:'تفاصيل حذاء MOVE 01',meshZoom:'تكبير النسيج',soleZoom:'تكبير النعل',detailCanvasCaption:'اضغط علامة + للاقتراب',detailTabs:'اختر تفصيلاً',exploreMove:'اكتشف MOVE 01',detailHint:'تتغيّر الزاوية بلطف مع التمرير',editorialAlt:'حملة مفهوم: عارضة بسترة برتقالية على درج خرساني',editorialLine1:'ضجيج أقل.',editorialLine2:'حضور أكبر.',editorialDescription:'نحب الأشياء البسيطة بلمسة مختلفة. شكل مميز، لون في مكانه، وتفصيل صغير يمنح إحساساً آخر. قطع تبقى في الذاكرة بلا ضجيج.',findYourStyle:'اكتشف أسلوبك',moodTitle:'أي يوم تريد؟',moodIntro:'ثلاث حالات مزاجية. حب واحد للتصميم.',moodLabel:'اختر مزاجك',moveMood:'انطلق بإيقاعك',focusMood:'امنح الهدوء مساحة',goMood:'خذ يومك معك',exploreProduct:'اكتشف القطعة',invitationTitle:'تخيّل علامتك هنا.',invitationText:'نفس الاهتمام بالتصميم. منتجاتك، ألوانك، وقصتك.',wantStore:'أريد متجراً كهذا',share:'شارك المتجر ↗',demoDisclaimer:'MOVA علامة مفهوم. لا تتم طلبات أو عمليات دفع في هذا الموقع.',yourBag:'حقيبتك',checkoutTitle:'لديك ذوق جميل.',checkoutDescription:'هنا تنتهي تجربة العرض. في متجر فعلي، هذه مرحلة اختيار التوصيل والدفع الآمن.',checkoutNote:'لم يتم تسجيل طلب أو تحصيل أي مبلغ.',keepExploring:'تابع الاكتشاف',close:'إغلاق',items:'{count} قطع',oneItem:'قطعة واحدة',favoriteAdded:'أُضيف إلى المفضلة',favoriteRemoved:'أُزيل من المفضلة',chooseOptions:'اختر اللون والمقاس',chooseColor:'اختر اللون',size:'المقاس',color:'اللون',quantity:'الكمية',addToBag:'أضف إلى حقيبتك',addedToBag:'في حقيبتك ✓',added:'أُضيفت القطعة إلى حقيبتك',productDetails:'التصميم عن قرب',colorSimulation:'ألوان العرض محاكاة بصرية. لا توجد عملية بيع أو دفع.',zoom:'تكبير صورة المنتج',zoomOut:'تصغير صورة المنتج',decrease:'تقليل الكمية',increase:'زيادة الكمية',remove:'إزالة',subtotal:'المجموع للعرض',demoCheckout:'تابع تجربة العرض',cartNote:'أسعار للعرض فقط. لا طلب أو شحن أو دفع.',emptyCart:'حقيبتك بانتظارك.',emptyCartText:'هل أعجبتك قطعة؟ اختر القطعة واللون والمقاس وأضفها هنا.',backToCollection:'اكتشف المجموعة',maxQty:'حتى 10 قطع لكل اختيار.',copied:'نُسخ الرابط وهو جاهز للمشاركة.',copyFailed:'يمكنك المشاركة عبر WhatsApp أو Facebook.',shareTitle:'MOVA — أسلوب في حركة',shareText:'هذا المتجر يمنح إحساساً مختلفاً. اكتشف MOVA.',reduceMotion:'تقليل الحركة',enableMotion:'تفعيل الحركة',systemMotion:'الحركة مخفّضة في الجهاز',detailWholeTitle:'شكل لا يقف مكانه.',detailWholeText:'خطوط مستديرة، طبقات ولمسة برتقالية. كل تفصيل جزء من الصورة الكاملة.',detailMeshTitle:'شاهد الملمس عن قرب.',detailMeshText:'التكبير يكشف النسيج والخياطة والتقاء المواد. هنا يصبح التصميم شيئاً يمكنك أن تشعر به تقريباً.',detailSoleTitle:'من زاوية جديدة.',detailSoleText:'أشكال منحوتة، أخاديد وطبقات. اقترب من النعل واكتشف جانباً آخر من القطعة.',moodMoveHeadline:'يومك يبدأ بخطوتك.',moodFocusHeadline:'لحظة واحدة. لك فقط.',moodGoHeadline:'أينما يأخذك اليوم.',moodMoveCategory:'IN YOUR ELEMENT',moodFocusCategory:'MAKE ROOM FOR QUIET',moodGoCategory:'EVERYDAY, EVERYWHERE',favoritesEmpty:'المفضلة بانتظارك.',favoritesEmptyHint:'اضغط القلب على قطعة أحببتها، وستجدها هنا.',contactText:'مرحباً، رأيت متجر MOVA وأريد متجراً بهذه الروح لعلامتي التجارية.'}
  };
  Object.entries(window.MOVA_STORE_COPY).forEach(([lang,copy])=>Object.assign(I18N[lang],copy));
  const t=(key,values={})=>(I18N[state.lang][key]??I18N.he[key]??key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const money=value=>new Intl.NumberFormat(state.lang==='ar'?'ar-IL':state.lang==='he'?'he-IL':'en-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(value);
  const localeText=object=>object[state.lang]??object.en;
  const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z"/></svg>';
  const colorFor=(p,id)=>p.colors.find(c=>c.id===id)??p.colors[0];
  let toastTimer, productAddedTimer, moodTimer;
  const toast=message=>{clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);};

  const shop=window.MOVA_SHOP({state,core,$,$$,t,esc,money,localeText,toast,safeRead,safeWrite,openDialog,closeDialog,saveCart,motionIsReduced});

  function updateShareLinks(){
    $('#whatsappShare').href='https://wa.me/?text='+encodeURIComponent(t('shareText')+'\n'+brand.url);
    $('#facebookShare').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(brand.url);
    $('#contactLink').href='https://wa.me/'+brand.contactInternational+'?text='+encodeURIComponent(t('contactText'));
  }
  function applyLanguage(){
    document.documentElement.lang=state.lang;
    document.documentElement.dir=state.lang==='en'?'ltr':'rtl';
    $('#language').value=state.lang;
    $$('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    $$('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria));});
    $$('[data-i18n-alt]').forEach(el=>{el.alt=t(el.dataset.i18nAlt);});
    $$('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
    renderProducts();renderCart();updateCartCount();setDetail(state.detail);setMood(state.mood,true);updateShareLinks();syncMotion();
    if(state.selected&&$('#productDialog').open)renderProduct();
    if($('#checkoutDialog').open)renderCheckout();
    if($('#compareDialog').open)shop.renderCompare();
    if($('#orderHistoryDialog').open)shop.renderHistory();
    if($('#sizeGuideDialog').open)shop.renderSizeGuide();
    safeWrite('mova-language',state.lang);
    window.MOVA_FLAGSHIP?.translate();
    window.MOVA_BRAND?.translate();
  }

  function renderProducts(){return shop.renderProducts();}
  function resetFilters(){state.filter='all';state.query='';state.favoritesOnly=false;state.sort='featured';state.maxPrice=Infinity;state.availableOnly=false;$('#searchInput').value='';renderProducts();}
  function toggleFavorite(id){
    if(!core.product(id))return;
    const had=state.favorites.includes(id);
    state.favorites=had?state.favorites.filter(x=>x!==id):[...state.favorites,id];
    safeWrite('mova-favorites',state.favorites);renderProducts();toast(t(had?'favoriteRemoved':'favoriteAdded'));
    $(`[data-favorite="${id}"]`)?.focus({preventScroll:true});
  }

  const previousFocus=new WeakMap();
  function openDialog(id){
    const dialog=$('#'+id);
    if(dialog.open)return;
    previousFocus.set(dialog,document.activeElement);
    if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.classList.add('fallback-dialog');}
    document.body.style.overflow='hidden';
    const firstFocusable=dialog.querySelector('button:not(:disabled),a[href],input,select');
    firstFocusable?.focus({preventScroll:true});
  }
  function closeDialog(id){
    const dialog=$('#'+id);
    if(typeof dialog.close==='function')dialog.close();else{dialog.removeAttribute('open');dialog.classList.remove('fallback-dialog');onDialogClosed(dialog);}
  }
  function onDialogClosed(dialog){
    if(!$$('dialog[open]').length)document.body.style.overflow='';
    const previous=previousFocus.get(dialog);
    if(previous&&previous.isConnected)previous.focus({preventScroll:true});
  }
  $$('dialog').forEach(dialog=>{
    dialog.addEventListener('close',()=>onDialogClosed(dialog));
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog.id);}});
  });
  document.addEventListener('keydown',event=>{
    const dialog=$('dialog.fallback-dialog[open]');
    if(!dialog)return;
    if(event.key==='Escape'){event.preventDefault();closeDialog(dialog.id);}
    if(event.key==='Tab'){
      const focusable=$$('button:not(:disabled),a[href],input,select,summary,[tabindex]:not([tabindex="-1"])',dialog);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  });

  function openProduct(id,colorId){return shop.openProduct(id,colorId);}
  function renderProduct(){return shop.renderProduct();}
  function updateSelection(){return shop.updateSelection();}
  function addSelected(){return shop.addSelected();}
  function saveCart(){safeWrite('mova-cart',state.cart);updateCartCount();}
  function updateCartCount(){
    const n=core.count(state.cart);$('#cartCount').textContent=String(n);
    $('#cartButton').setAttribute('aria-label',t('cart')+' — '+t('items',{count:n}));
  }
  function renderCart(){return shop.renderCart();}
  function renderCheckout(){return shop.renderCheckout();}
  function setDetail(view){
    state.detail=['whole','mesh','sole'].includes(view)?view:'whole';
    const data={whole:{label:'THE SILHOUETTE',title:'detailWholeTitle',text:'detailWholeText',index:'01'},mesh:{label:'THE TEXTURE',title:'detailMeshTitle',text:'detailMeshText',index:'02'},sole:{label:'THE SCULPTURE',title:'detailSoleTitle',text:'detailSoleText',index:'03'}}[state.detail];
    $('#detailCanvas').dataset.view=state.detail;$('#detailLabel').textContent=data.label;$('#detailTitle').textContent=t(data.title);$('#detailText').textContent=t(data.text);$('#detailIndex').textContent=data.index+' / 03';
    $$('.detail-tab').forEach(b=>{const active=b.dataset.detail===state.detail;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('.detail-hotspot').forEach(b=>{b.hidden=state.detail!=='whole';});
  }
  function setMood(id,instant=false){
    state.mood=['move','focus','carry'].includes(id)?id:'move';
    const p=core.product(state.mood),keys={move:['moodMoveHeadline','moodMoveCategory','MOVE','01'],focus:['moodFocusHeadline','moodFocusCategory','FOCUS','02'],carry:['moodGoHeadline','moodGoCategory','GO','03']}[state.mood];
    const img=$('#moodImage');
    clearTimeout(moodTimer);
    const update=()=>{img.src=p.image;img.alt=localeText(p.title);$('#moodStage').dataset.mood=state.mood;$('#moodHeadline').textContent=t(keys[0]);$('#moodCategory').textContent=t(keys[1]);$('#moodBackword').textContent=keys[2];$('#moodStageIndex').textContent=keys[3]+' / 03';img.classList.remove('switching');if($('#moodMaterial')){$('#moodMaterial').textContent=localeText(p.material);$('#moodCode').textContent=p.code;$('#moodPrice').textContent=money(p.price);$('#moodStatus').textContent=p.code+' — '+t(keys[0]);}};
    if(instant||motionIsReduced())update();else{img.classList.add('switching');moodTimer=setTimeout(update,150);}
    $$('.mood-button').forEach(b=>{const active=b.dataset.mood===state.mood;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  function motionIsReduced(){return reduced.matches||state.userPaused;}
  function syncMotion(){
    const paused=motionIsReduced();document.documentElement.classList.toggle('paused-motion',paused);window.dispatchEvent(new CustomEvent('mova:motion',{detail:{paused}}));
    $('#motionToggle').setAttribute('aria-pressed',String(paused));$('#motionToggle').disabled=reduced.matches;
    $('#motionToggleLabel').textContent=t(reduced.matches?'systemMotion':paused?'enableMotion':'reduceMotion');
    if(paused){$('#heroShoe').style.transform='';$('#detailCanvas').style.removeProperty('--detail-scroll');$('#detailCanvas').style.removeProperty('--detail-rotation');}
    requestScrollFrame();
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.openProduct){openProduct(button.dataset.openProduct,button.closest('.lab-purchase')?window.MOVA_LAB?.snapshot().variant:undefined);return;}
    if(button.dataset.closeDialog){closeDialog(button.dataset.closeDialog);return;}
    if(button.dataset.favorite){toggleFavorite(button.dataset.favorite);return;}
    if(button.dataset.cardColor){
      const id=button.dataset.cardColor,c=button.dataset.colorId;
      if(!core.product(id)?.colors.some(color=>color.id===c))return;
      state.cardColors[id]=c;window.dispatchEvent(new CustomEvent('mova:variant',{detail:{id,color:c}}));renderProducts();$(`[data-card-color="${id}"][data-color-id="${c}"]`)?.focus({preventScroll:true});return;
    }
    if(button.dataset.filter){state.filter=button.dataset.filter;state.favoritesOnly=false;renderProducts();return;}
    if(button.dataset.detail){setDetail(button.dataset.detail);if(button.classList.contains('detail-hotspot'))$(`.detail-tab[data-detail="${state.detail}"]`)?.focus({preventScroll:true});return;}
    if(button.dataset.mood){setMood(button.dataset.mood);return;}
    if(button.dataset.colorOption&&state.selected){state.selected.color=button.dataset.colorOption;updateSelection();return;}
    if(button.dataset.sizeOption&&state.selected){state.selected.size=button.dataset.sizeOption;updateSelection();return;}
    if(button.dataset.productQty&&state.selected){state.selected.qty=Math.max(1,Math.min(10,state.selected.qty+Number(button.dataset.productQty)));updateSelection();return;}
    if(button.dataset.cartQty){
      const key=button.dataset.key,delta=Number(button.dataset.cartQty);state.cart=core.update(state.cart,key,delta);saveCart();renderCart();
      const next=$(`[data-cart-qty="${delta}"][data-key="${key}"]`);if(next&&!next.disabled)next.focus();else $('#cartDialog .drawer-header button').focus();return;
    }
    if(button.dataset.cartRemove){state.cart=state.cart.filter(l=>core.key(l)!==button.dataset.cartRemove);saveCart();renderCart();$('#cartDialog .drawer-header button').focus();return;}
    if(button.dataset.cartProduct){closeDialog('cartDialog');openProduct(button.dataset.cartProduct);return;}
    switch(button.id){
      case 'addProductButton':addSelected();break;
      case 'cartButton':renderCart();openDialog('cartDialog');break;
      case 'menuButton':openDialog('menuDialog');break;
      case 'cartDiscover':closeDialog('cartDialog');resetFilters();$('#collection').scrollIntoView({behavior:motionIsReduced()?'auto':'smooth'});break;
      case 'checkoutButton':renderCheckout();closeDialog('cartDialog');openDialog('checkoutDialog');break;
      case 'searchButton':$('#searchInline').hidden=false;state.favoritesOnly=false;$('#collection').scrollIntoView({behavior:motionIsReduced()?'auto':'smooth'});$('#searchInput').focus({preventScroll:true});renderProducts();break;
      case 'clearSearch':state.query='';$('#searchInput').value='';renderProducts();$('#searchInput').focus();break;
      case 'favoritesButton':state.favoritesOnly=!state.favoritesOnly;state.filter='all';state.query='';$('#searchInput').value='';renderProducts();$('#collection').scrollIntoView({behavior:motionIsReduced()?'auto':'smooth'});break;
      case 'resetFilters':resetFilters();break;
      case 'moodExplore':openProduct(state.mood);break;
      case 'motionToggle':state.userPaused=!state.userPaused;safeWrite('mova-paused',state.userPaused);syncMotion();break;
      case 'shareButton':shareStore();break;
    }
  });
  $('#menuDialog nav').addEventListener('click',event=>{if(event.target.closest('a'))closeDialog('menuDialog');});
  $('#searchInput').addEventListener('input',event=>{state.query=event.target.value;renderProducts();});
  $('#language').addEventListener('change',event=>{state.lang=event.target.value;applyLanguage();});
  async function shareStore(){
    const data={title:t('shareTitle'),text:t('shareText'),url:brand.url};
    if(navigator.share){try{await navigator.share(data);return;}catch(error){if(error.name==='AbortError')return;}}
    if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(brand.url);toast(t('copied'));return;}catch{}}
    toast(t('copyFailed'));
  }

  let scrollFrame=0,pointerX=0,pointerY=0;
  function requestScrollFrame(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateMotion);}
  function updateMotion(){
    scrollFrame=0;$('#siteHeader').classList.toggle('scrolled',window.scrollY>20);
    if(motionIsReduced()||document.hidden)return;
    const hero=$('#heroStage').getBoundingClientRect();
    if(!document.body.dataset.experience&&hero.bottom>0&&hero.top<window.innerHeight){const progress=Math.max(0,Math.min(1,window.scrollY/700));$('#heroShoe').style.transform=`rotate(${-11+progress*7+pointerX*2}deg) rotateY(${pointerX*5}deg) rotateX(${-pointerY*3}deg)`;}
    const detail=$('#detailCanvas').getBoundingClientRect();
    if(detail.bottom>0&&detail.top<window.innerHeight){const progress=(window.innerHeight*.5-(detail.top+detail.height*.5))/window.innerHeight;$('#detailCanvas').style.setProperty('--detail-scroll',`${Math.max(-12,Math.min(12,progress*25))}px`);$('#detailCanvas').style.setProperty('--detail-rotation',`${Math.max(-3,Math.min(3,progress*7))}deg`);}
  }
  window.addEventListener('scroll',requestScrollFrame,{passive:true});window.addEventListener('resize',requestScrollFrame,{passive:true});
  if(window.matchMedia('(hover: hover)').matches){
    $('#heroStage').addEventListener('pointermove',event=>{if(motionIsReduced())return;const r=event.currentTarget.getBoundingClientRect();pointerX=(event.clientX-r.left)/r.width-.5;pointerY=(event.clientY-r.top)/r.height-.5;requestScrollFrame();},{passive:true});
    $('#heroStage').addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;requestScrollFrame();});
  }
  if(reduced.addEventListener)reduced.addEventListener('change',syncMotion);else reduced.addListener(syncMotion);
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('tab-hidden',document.hidden);if(!document.hidden)requestScrollFrame();});
  window.addEventListener('storage',event=>{
    if(event.key==='mova-cart'){state.cart=core.sanitizeCart(safeRead('mova-cart',[]));updateCartCount();renderCart();if($('#checkoutDialog').open)renderCheckout();}
  });
  applyLanguage();
  window.MOVA_FLAGSHIP?.init({t,reduced:motionIsReduced});
  window.MOVA_BRAND?.init({t,phone:brand.contactInternational});
  window.MOVA_INTRO?.init({t,reduced:motionIsReduced});
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});
    $$('.section-top,.details-heading,.detail-description,.editorial-photo,.editorial-copy,.mood-heading,.brand-studio-heading').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  }
})();
