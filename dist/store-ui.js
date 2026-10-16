/* Full local shopping demo. No checkout data leaves this page. */
'use strict';
window.MOVA_SHOP=({state,core,$,$$,t,esc,money,localeText,toast,safeRead,safeWrite,openDialog,closeDialog,saveCart,motionIsReduced})=>{
 const products=window.MOVA_CATALOG.products;
 let productZoom=null,productSpin=null,heroSpin=null,activeComponent=null,detailRequest=null;
 const cardSpins=[],spinFrames=new Map();
 function attachCardSpins(){
  for(const controller of cardSpins)controller.destroy();cardSpins.length=0;
  $$('.product-card .product-open').forEach(viewport=>{
   const p=core.product(viewport.dataset.openProduct),c=colorFor(p,state.cardColors[p.id]);
   viewport.setAttribute('aria-label',p.code+' — '+t('spinCardHint'));
   viewport.style.setProperty('--spin-filter',imageFilter(p,c));
   cardSpins.push(window.MOVA_SPIN.attach({viewport,image:viewport.querySelector('img'),spec:p.spin,fit:'card',drag:true,reduced:motionIsReduced,initialFrame:spinFrames.get(p.id)||0,onPosition:(_,position)=>spinFrames.set(p.id,position)}));
  });
  const hero=$('.hero-shoe-launch');
  if(hero&&!hero.dataset.flagship&&!heroSpin)heroSpin=window.MOVA_SPIN.attach({viewport:hero,image:$('#heroShoe'),spec:core.product('move').spin,drag:true,reduced:motionIsReduced,onPosition:(_,position)=>spinFrames.set('move',position)});
 }
 const colorFor=(p,id)=>p.colors.find(c=>c.id===id)??p.colors[0];
 const imageFilter=(p,c)=>c.filter||'none';
 const price=p=>`${p.compareAt?`<del>${esc(money(p.compareAt))}</del>`:''}<span>${esc(money(p.price))}</span>`;
 const cleanIds=value=>Array.isArray(value)?[...new Set(value.filter(id=>core.product(id)))].slice(0,8):[];
 Object.assign(state,{sort:'featured',maxPrice:Infinity,availableOnly:false,compare:[],recent:cleanIds(safeRead('mova-recent',[])),coupon:'',shipping:'standard',gift:false,checkoutStep:1,address:{},payment:'card',consent:false,orders:[]});
 // Stored orders contain only validated variants, a date, options and a payment
 // label. Totals are recalculated and contact details are never persisted.
 const storedOrders=safeRead('mova-orders',[]);
 if(Array.isArray(storedOrders))state.orders=storedOrders.slice(0,12).filter(o=>o&&/^MOVA-[A-Z0-9-]{5,40}$/.test(o.id)&&Number.isFinite(Date.parse(o.date))).map(o=>({id:o.id,date:o.date,items:core.sanitizeCart(o.items),coupon:core.validCoupon(o.coupon)?core.couponCode(o.coupon):'',shipping:['standard','express','pickup'].includes(o.shipping)?o.shipping:'standard',gift:o.gift===true,payment:['card','bit','paypal'].includes(o.payment)?o.payment:'card'})).filter(o=>o.items.length);
 const quote=()=>core.quote(state.cart,{coupon:state.coupon,shipping:state.shipping,gift:state.gift});
 const summaryRows=q=>`<div class="cart-summary-row"><span>${esc(t('subtotal'))}</span><span dir="ltr">${esc(money(q.subtotal))}</span></div>${q.discount?`<div class="cart-summary-row saving"><span>${esc(t('discount'))} <b dir="ltr">${q.coupon}</b></span><span dir="ltr">−${esc(money(q.discount))}</span></div>`:''}<div class="cart-summary-row"><span>${esc(t('shipping'))}</span><span dir="ltr">${esc(q.shipping?money(q.shipping):t('free'))}</span></div>${q.gift?`<div class="cart-summary-row"><span>${esc(t('gift'))}</span><span dir="ltr">${esc(money(q.gift))}</span></div>`:''}<div class="cart-summary-row total-row"><strong>${esc(t('total'))}</strong><strong dir="ltr">${esc(money(q.total))}</strong></div>`;
 function renderProducts(){
  const query=state.query.trim().toLocaleLowerCase();
  const shown=products.filter(p=>(state.filter==='all'||p.category===state.filter)&&(!state.favoritesOnly||state.favorites.includes(p.id))&&p.price<=state.maxPrice&&(!state.availableOnly||Object.values(p.inventory).some(v=>Object.values(v).some(n=>n>0)))&&(!query||[p.code,...Object.values(p.title),...Object.values(p.description),...Object.values(p.material),p.category,t(p.category)].join(' ').toLocaleLowerCase().includes(query)));
  shown.sort(state.sort==='price-low'?(a,b)=>a.price-b.price:state.sort==='price-high'?(a,b)=>b.price-a.price:state.sort==='newest'?(a,b)=>b.featured-a.featured:(a,b)=>a.featured-b.featured);
  $('#productGrid').innerHTML=shown.map(p=>{
   const c=colorFor(p,state.cardColors[p.id]);
   const availability=Object.values(p.inventory).some(v=>Object.values(v).some(n=>n>0));
   return `<article class="product-card" data-product="${p.id}"><div class="product-visual" style="background:${p.surface}"><button class="product-open" data-open-product="${p.id}" aria-label="${esc(p.code+' — '+localeText(p.title))}"><img src="${p.image}" width="1200" height="1200" alt="${esc(localeText(p.title))}" loading="lazy" decoding="async" style="filter:${imageFilter(p,c)} drop-shadow(0 20px 14px #58442b17)"></button><span class="card-spin-label" aria-hidden="true"><span>↔</span>360°</span><span class="product-badge" dir="ltr">${p.badge}</span><button class="wishlist-button" data-favorite="${p.id}" aria-label="${esc(t('favorites')+' — '+p.code)}" aria-pressed="${state.favorites.includes(p.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 5.5a5 5 0 0 0-7.1 0L12 6.9l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-8.4a5 5 0 0 0 0-7.1Z"/></svg></button>${!availability?`<span class="product-new">${esc(t('outOfStock'))}</span>`:p.new?`<span class="product-new">${esc(t('newLabel'))}</span>`:''}<button class="quick-add" data-open-product="${p.id}"><span>${esc(t('chooseOptions'))}</span><span aria-hidden="true">↗</span></button></div><div class="product-info"><div><button class="product-name" data-open-product="${p.id}">${p.code}</button><p class="product-subtitle">${esc(localeText(p.title))}</p></div><span class="product-price">${price(p)}</span></div><div class="product-bottom"><div class="mini-swatches" role="group" aria-label="${esc(t('chooseColor')+' — '+p.code)}">${p.colors.map(color=>`<button class="mini-swatch" data-card-color="${p.id}" data-color-id="${color.id}" style="--swatch:${color.hex}" aria-label="${esc(localeText(color.label))}" aria-pressed="${color.id===c.id}"></button>`).join('')}</div><button class="compare-toggle" data-compare="${p.id}" aria-pressed="${state.compare.includes(p.id)}">${state.compare.includes(p.id)?'✓':'+'} ${esc(t('compare'))}</button></div></article>`;
  }).join('');
  $('#productCount').textContent=shown.length===1?t('oneItem'):t('items',{count:shown.length});
  $('#emptyResults').hidden=shown.length!==0;
  $('#emptyResults h3').textContent=t(state.favoritesOnly&&!query?'favoritesEmpty':'noResults');
  $('#emptyResults p').textContent=t(state.favoritesOnly&&!query?'favoritesEmptyHint':'noResultsHint');
  $$('[data-filter]').forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  $('#favoritesButton').setAttribute('aria-pressed',String(state.favoritesOnly));
  $('#sortProducts').value=state.sort;$('#priceFilter').value=String(state.maxPrice);$('#availableOnly').checked=state.availableOnly;
  renderCompareBar();renderRecent();attachCardSpins();
 }
 const miniature=p=>`<button class="mini-product" data-open-product="${p.id}"><span style="background:${p.surface}"><img src="${p.image}" width="240" height="240" loading="lazy" alt="${esc(localeText(p.title))}"></span><b dir="ltr">${p.code}</b><small>${esc(money(p.price))}</small></button>`;
 function renderRecent(){const list=state.recent.map(core.product).filter(Boolean).slice(0,4);$('#recentlyViewed').hidden=!list.length;$('#recentGrid').innerHTML=list.map(miniature).join('');}
 function openProduct(id){
  const p=core.product(id);if(!p)return;
  let color=colorFor(p,state.cardColors[id]).id,size=p.defaultSize;
  if(!core.stock({id,color,size}))size=p.sizes.find(s=>core.stock({id,color,size:s}))??p.defaultSize;
  const flagship=id==='move'?window.MOVA_FLAGSHIP?.snapshot():null;
  const spinFrame=flagship?.view==='spin'?flagship.spin?.position:spinFrames.get(id);
  state.selected={id,color,size,qty:1,spinFrame:spinFrame||0};state.gallery='spin';activeComponent=null;
  state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,8);safeWrite('mova-recent',state.recent);
  renderRecent();renderProduct();openDialog('productDialog');productZoom?.resize();productSpin?.resize();
  $('#productDialog').scrollTop=0;
 }
 function renderProduct(){
  if(!state.selected)return;
  productZoom?.destroy();productSpin?.destroy();productSpin=null;if(detailRequest){detailRequest.onload=null;detailRequest.onerror=null;}detailRequest=null;
  const p=core.product(state.selected.id),c=colorFor(p,state.selected.color);
  $('#productDialog').dataset.flagshipProduct=p.id;
  const componentList=`<section class="product-components" aria-labelledby="componentsTitle"><div class="components-heading"><h3 id="componentsTitle">${esc(t('componentsTitle'))}</h3><span dir="ltr">${String(p.components.length).padStart(2,'0')} / DETAILS</span></div><p>${esc(t('componentsIntro'))}</p><div class="component-list">${p.components.map((part,i)=>`<button class="component-card" data-component="${part.id}" aria-pressed="false"><span class="component-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(localeText(part.label))}</strong><small>${esc(localeText(part.material))}</small><span>${esc(localeText(part.detail))}</span></span><span class="component-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><small class="components-note">${esc(t('componentsNote'))}</small></section>`;
  const labLink=p.id==='move'&&window.MOVA_LAB?`<button class="product-lab-link" data-open-anatomy><span>${esc(window.MOVA_LAB.label('openLabel'))}</span><span aria-hidden="true">↗</span></button>`:'';
  const related=products.filter(x=>x.id!==p.id).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,3);
  $('#productDialogBody').innerHTML=`<div class="product-dialog-layout"><div class="product-gallery"><div class="product-dialog-visual pinch-viewport" id="productVisual" data-gallery="${state.gallery}" style="--product-bg:${p.surface};--product-filter:${imageFilter(p,c)}" tabindex="0" role="group" aria-label="${esc(t('zoomRegion',{product:p.code}))}" aria-describedby="productGestureHint productGestureKeyboard" aria-keyshortcuts="+ - ArrowUp ArrowDown ArrowLeft ArrowRight 0 Home"><span class="eyebrow" dir="ltr">MOVA / ${p.badge}</span><div class="product-image-track" id="productImageTrack"><img id="productImage" src="${p.image}" width="1200" height="1200" alt="${esc(localeText(p.title)+' — '+localeText(c.label))}" draggable="false"></div><span class="product-image-caption" id="productImageCaption">${esc(t(state.gallery==='spin'?'spinLoading':'fullView'))}</span><span class="product-zoom-meter" dir="ltr"><output id="productZoomValue" aria-label="${esc(t('magnification'))}">1.0×</output><small>/ 12×</small></span></div><p class="product-gesture-hint" id="productGestureHint">${esc(t(state.gallery==='spin'?'spinHint':'gestureHint'))}</p><div class="spin-controls" id="productSpinControls" ${state.gallery==='spin'?'':'hidden'}><label for="productSpinRange">360°</label><input id="productSpinRange" type="range" min="0" max="360" step="0.1" value="${(state.selected.spinFrame||0)*30}" aria-label="${esc(t('spinAngleLabel'))}"><output id="productSpinValue" for="productSpinRange"></output><button class="spin-auto" id="productSpinAuto" aria-pressed="false" aria-label="${esc(t('spinPlay'))}" title="${esc(t('spinPlay'))}"><span aria-hidden="true">▶</span></button></div><small class="spin-note" id="productSpinNote" ${state.gallery==='spin'?'':'hidden'}>${esc(t('spinNote'))}</small><p class="sr-only" id="productGestureKeyboard">${esc(t('gestureKeyboard'))}</p><p class="sr-only" id="productComponentLive" role="status" aria-live="polite"></p><div class="gallery-tabs" role="group" aria-label="${esc(t('gallery'))}">${['spin','whole','detail','texture'].map((v,i)=>`<button data-gallery="${v}" aria-pressed="${state.gallery===v}"><span>0${i+1}</span>${esc(t(['spinView','galleryWhole','galleryDetail','galleryTexture'][i]))}</button>`).join('')}</div></div><div class="product-dialog-content"><p class="eyebrow">${esc(t(p.category))}</p><h2 id="productDialogTitle">${p.code}</h2><p class="product-subtitle">${esc(localeText(p.title))}</p><div class="dialog-price">${price(p)}</div><p class="dialog-description">${esc(localeText(p.description))}</p><div class="option-heading">${esc(t('color'))}<span id="selectedColorLabel">${esc(localeText(c.label))}</span></div><div class="color-options" role="group" aria-label="${esc(t('chooseColor'))}">${p.colors.map(color=>`<button class="color-option" data-color-option="${color.id}" style="--swatch:${color.hex}" aria-pressed="${color.id===c.id}" aria-label="${esc(localeText(color.label))}"></button>`).join('')}</div><div class="option-heading">${esc(t('size'))}${['footwear','apparel'].includes(p.category)?`<button id="sizeGuideButton" class="text-button">${esc(t('sizeGuide'))} ↗</button>`:''}</div><div class="size-options" role="group" aria-label="${esc(t('size'))}">${p.sizes.map(size=>`<button class="size-option" data-size-option="${size}" aria-pressed="${size===state.selected.size}" ${!core.stock({id:p.id,color:c.id,size})?'disabled':''}>${size}</button>`).join('')}</div><p class="stock-status" id="stockStatus"></p><div class="purchase-row"><div class="quantity-picker" aria-label="${esc(t('quantity'))}"><button data-product-qty="-1" aria-label="${esc(t('decrease'))}">−</button><span id="selectedQty">${state.selected.qty}</span><button data-product-qty="1" aria-label="${esc(t('increase'))}">+</button></div><button class="button button-dark" id="addProductButton"><span id="addProductLabel">${esc(t('addToBag'))}</span><span class="button-arrow" aria-hidden="true">+</span></button></div><button id="viewBagButton" class="view-bag" hidden>${esc(t('viewBag'))} ↗</button><p class="dialog-demo-note" id="productLive" role="status" aria-live="polite">${esc(t('colorSimulation'))}</p>${labLink}${componentList}<details class="product-accordion"><summary>${esc(t('productDetails'))}</summary><p>${esc(localeText(p.details))}</p><p><b>${esc(t('material'))}:</b> ${esc(localeText(p.material))}</p></details><details class="product-accordion"><summary>${esc(t('deliveryReturns'))}</summary><p>${esc(t('deliveryText'))}</p></details></div></div><div class="product-related"><h3>${esc(t('related'))}</h3><div class="mini-product-grid">${related.map(miniature).join('')}</div></div>`;
  const upgradePhoto=()=>{if(state.gallery==='spin'||detailRequest||!p.detailImage)return;const img=$('#productImage');const request=new Image();detailRequest=request;request.onload=()=>{if(img.isConnected&&state.selected?.id===p.id)img.src=p.detailImage;};request.onerror=()=>{if(detailRequest===request)detailRequest=null;};request.src=p.detailImage;};
  productSpin=window.MOVA_SPIN.attach({viewport:$('#productVisual'),image:$('#productImage'),spec:p.spin,reduced:motionIsReduced,initialFrame:state.selected.spinFrame||0,onPosition:(angle,position)=>{
   state.selected.spinFrame=position;spinFrames.set(p.id,position);$('#productSpinRange').value=angle.toFixed(1);$('#productSpinRange').setAttribute('aria-valuetext',t('spinDegrees',{angle:Math.round(angle)}));$('#productSpinValue').textContent=Math.round(angle)+'°';
  },onMotion:playing=>{const b=$('#productSpinAuto');if(b){b.setAttribute('aria-pressed',String(playing));b.setAttribute('aria-label',t(playing?'spinPause':'spinPlay'));b.title=t(playing?'spinPause':'spinPlay');b.querySelector('span').textContent=playing?'Ⅱ':'▶';b.disabled=motionIsReduced();}},onReady:()=>{if(state.gallery==='spin'){$('#productImageCaption').textContent=t('spinView');$('#productGestureHint').textContent=t('spinHint');}},onError:()=>{if(state.gallery==='spin'){$('#productImageCaption').textContent=t('spinUnavailable');$('#productGestureHint').textContent=t('spinRetry');}}});
  productSpin.setEnabled(state.gallery==='spin');
  productZoom=window.MOVA_ZOOM.attach({onIntent:()=>{if(state.gallery==='spin')productSpin.load();else upgradePhoto();},canRotate:()=>state.gallery==='spin',onRotateStart:()=>productSpin.beginDrag(),onRotateEnd:cancelled=>productSpin.endDrag(cancelled),onRotate:(delta,time)=>productSpin.rotate(delta,time),onStep:delta=>productSpin.advance(delta),viewport:$('#productVisual'),track:$('#productImageTrack'),readout:$('#productZoomValue'),scrollParent:$('#productDialog')});
  updateSelection();
  if(activeComponent)selectComponent(activeComponent,false);else if(state.gallery!=='spin'&&state.gallery!=='whole')productZoom.focus(.5,.5,state.gallery==='texture'?5:2.5);
 }
 function selectComponent(id,scroll=true){
  const part=core.product(state.selected?.id)?.components.find(p=>p.id===id);if(!part)return;activeComponent=id;state.gallery='component';productSpin?.setEnabled(false);$('#productSpinControls').hidden=true;$('#productSpinNote').hidden=true;$('#productGestureHint').textContent=t('gestureHint');$('#productVisual').dataset.gallery='component';$$('.gallery-tabs button').forEach(b=>b.setAttribute('aria-pressed','false'));
  $$('[data-component]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.component===id)));
  $('#productImageCaption').textContent=localeText(part.label);$('#productComponentLive').textContent=t('selectedComponent',{component:localeText(part.label)})+'. '+localeText(part.detail);
  productZoom.focus(part.focus.x,part.focus.y,part.focus.scale);
  if(scroll)$('#productDialog').scrollTo?.({top:0,behavior:motionIsReduced()?'instant':'smooth'});
 }
 function updateSelection(){
  const p=core.product(state.selected.id),c=colorFor(p,state.selected.color);
  let stock=core.stock(state.selected);
  if(!stock){state.selected.size=p.sizes.find(size=>core.stock({...state.selected,size}))??state.selected.size;stock=core.stock(state.selected);}
  state.selected.qty=Math.max(1,Math.min(state.selected.qty,stock||1));
  $('#productVisual').style.setProperty('--product-filter',imageFilter(p,c));
  $('#productImage').alt=localeText(p.title)+' — '+localeText(c.label);$('#selectedColorLabel').textContent=localeText(c.label);
  $$('[data-color-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colorOption===c.id)));
  $$('[data-size-option]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.sizeOption===state.selected.size));b.disabled=!core.stock({...state.selected,size:b.dataset.sizeOption});});
  $('#selectedQty').textContent=String(state.selected.qty);
  $('[data-product-qty="-1"]').disabled=state.selected.qty===1;
  $('[data-product-qty="1"]').disabled=state.selected.qty>=stock;
  $('#stockStatus').textContent=stock?t('stockLabel',{count:stock}):t('outOfStock');
  $('#addProductButton').disabled=!stock;$('#addProductLabel').textContent=t('addToBag');
  window.dispatchEvent(new CustomEvent('mova:variant',{detail:{id:p.id,color:c.id}}));
 }
 function addSelected(){
  const s=state.selected;if(!s)return;const stock=core.stock(s),existing=state.cart.find(l=>core.key(l)===core.key(s));
  if(!stock||(existing?.qty??0)+s.qty>stock){$('#productLive').textContent=t('stockLimit',{count:stock});return;}
  state.cart=core.add(state.cart,s);saveCart();renderCart();$('#productLive').textContent=t('added');$('#addProductLabel').textContent=t('addedToBag');$('#viewBagButton').hidden=false;
  if(!motionIsReduced()&&$('#productImage').animate)$('#productImage').animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:350});
 }
 function renderCart(){
  if(!state.cart.length){$('#cartBody').innerHTML=`<div class="empty-cart"><span class="empty-cart-symbol" aria-hidden="true">✳</span><h3>${esc(t('emptyCart'))}</h3><p>${esc(t('emptyCartText'))}</p><button class="button button-dark" id="cartDiscover">${esc(t('backToCollection'))}</button></div>`;return;}
  const q=quote();
  $('#cartBody').innerHTML=`<div class="cart-scroll"><div class="shipping-progress"><span>${esc(q.freeRemaining?t('freeShippingRemaining',{amount:money(q.freeRemaining)}):t('freeShipping'))}</span><progress max="600" value="${Math.min(600,q.subtotal-q.discount)}"></progress></div><div class="cart-lines">${state.cart.map(line=>{
   const p=core.product(line.id),c=colorFor(p,line.color),key=core.key(line);
   return `<article class="cart-line" data-cart-line="${key}"><button class="cart-line-image" data-cart-product="${p.id}" style="--product-filter:${imageFilter(p,c)}" aria-label="${esc(p.code)}"><img src="${p.image}" width="1200" height="1200" alt="${esc(localeText(p.title))}"></button><div><h3 dir="ltr">${p.code}</h3><p>${esc(localeText(c.label))} / ${esc(t('size'))} ${line.size}</p><span class="cart-line-price" dir="ltr">${esc(money(p.price*line.qty))}</span><div class="cart-line-bottom"><div class="quantity-picker"><button data-cart-qty="-1" data-key="${key}" aria-label="${esc(t('decrease')+' — '+p.code)}">−</button><span>${line.qty}</span><button data-cart-qty="1" data-key="${key}" aria-label="${esc(t('increase')+' — '+p.code)}" ${line.qty>=core.stock(line)?'disabled':''}>+</button></div><button class="remove-line" data-cart-remove="${key}" aria-label="${esc(t('remove')+' — '+p.code)}">${esc(t('remove'))}</button></div></div></article>`;
  }).join('')}</div><div class="cart-extras"><form id="couponForm" class="coupon-form"><label for="couponInput">${esc(t('coupon'))}</label><div><input id="couponInput" name="coupon" maxlength="24" dir="ltr" autocomplete="off" placeholder="MOVA10" value="${esc(state.coupon)}"><button type="submit">${esc(t('applyCoupon'))}</button></div><p id="couponMessage" role="status"></p></form>${state.coupon?`<button class="text-button" id="removeCoupon">${esc(t('removeCoupon'))} ×</button>`:''}<label class="check-option"><input type="checkbox" id="giftWrap" ${state.gift?'checked':''}><span>${esc(t('gift'))}</span></label><label class="shipping-select-label" for="cartShipping">${esc(t('shipping'))}</label><select id="cartShipping">${['standard','express','pickup'].map(v=>`<option value="${v}" ${v===state.shipping?'selected':''}>${esc(t(v))}</option>`).join('')}</select></div></div><div class="cart-summary">${summaryRows(q)}<p class="cart-summary-note">${esc(t('cartNote'))}</p><button class="button button-dark" id="checkoutButton"><span>${esc(t('demoCheckout'))}</span><span class="button-arrow" aria-hidden="true">↗</span></button></div>`;
 }
 function shippingChoices(){return `<fieldset class="shipping-choices"><legend>${esc(t('shipping'))}</legend>${['standard','express','pickup'].map(v=>{const q=core.quote(state.cart,{coupon:state.coupon,shipping:v,gift:state.gift});return `<label class="shipping-choice"><input type="radio" name="shipping" value="${v}" ${state.shipping===v?'checked':''}><span><b>${esc(t(v))}</b><small>${esc(t(v+'Hint'))}</small></span><strong dir="ltr">${esc(q.shipping?money(q.shipping):t('free'))}</strong></label>`;}).join('')}</fieldset>`;}
 const formAddress=()=>Object.fromEntries(['name','email','phone','city','street'].map(k=>[k,$(`#checkout-${k}`)?.value??state.address[k]??'']));
 function renderCheckout(){
  const body=$('#checkoutBody');
  if(state.checkoutStep!==3&&!state.cart.length){body.innerHTML=`<h2 id="checkoutTitle">${esc(t('checkoutEmpty'))}</h2><button class="button button-dark" data-close-dialog="checkoutDialog">${esc(t('continueShopping'))}</button>`;return;}
  const steps=`<ol class="checkout-steps">${['stepDetails','stepReview','stepDone'].map((key,i)=>`<li ${state.checkoutStep===i+1?'aria-current="step"':''}><span>${i+1}</span>${esc(t(key))}</li>`).join('')}</ol>`;
  if(state.checkoutStep===3){
   const order=state.lastOrder,q=core.quote(order.items,order);
   body.innerHTML=`<div class="order-success"><span class="success-mark" aria-hidden="true">✓</span><p class="eyebrow" dir="ltr">MOVA / GOOD CHOICES</p><h2 id="checkoutTitle">${esc(t('orderSuccess'))}</h2><p>${esc(t('orderSuccessNote'))}</p><div class="order-number"><span>${esc(t('orderNumber'))}</span><strong dir="ltr">${order.id}</strong></div><div id="checkoutSummary">${summaryRows(q)}</div>${state.orderSaveFailed?`<p role="status">${esc(t('orderSavedFailed'))}</p>`:''}<button class="button button-dark" data-close-dialog="checkoutDialog">${esc(t('continueShopping'))} ↗</button><button class="text-button" data-open-orders>${esc(t('orderHistory'))}</button></div>`;return;
  }
  const q=quote();
  const heading=`<p class="eyebrow" dir="ltr">MOVA / THE CHECKOUT EXPERIENCE</p><h2 id="checkoutTitle">${esc(t('checkoutTitle'))}</h2><p class="checkout-subtitle">${esc(t('checkoutSubtitle'))}</p>${steps}`;
  if(state.checkoutStep===1){
   body.innerHTML=heading+`<form id="checkoutDetails" novalidate><p class="address-note">${esc(t('addressNote'))}</p><div class="checkout-fields">${['name','email','phone','city','street'].map(k=>`<label ${['city','street'].includes(k)?'data-address-field':''}>${esc(t(k))}<input id="checkout-${k}" name="${k}" type="${k==='email'?'email':k==='phone'?'tel':'text'}" maxlength="${k==='email'||k==='street'?120:80}" autocomplete="off" ${state.shipping==='pickup'&&['city','street'].includes(k)?'disabled':''} ${k==='email'||k==='phone'?'dir="ltr"':''} value="${esc(state.address[k]??'')}" aria-required="${!['city','street'].includes(k)||state.shipping!=='pickup'}"></label>`).join('')}</div>${shippingChoices()}<div id="checkoutSummary">${summaryRows(q)}</div><p class="form-error" id="checkoutError" role="alert"></p><button class="button button-dark" type="submit">${esc(t('nextReview'))} ↗</button></form>`;
  }else{
   const a=state.address;
   body.innerHTML=heading+`<div class="review-contact"><b>${esc(a.name)}</b><span dir="ltr">${esc(a.email)}</span><span>${esc(t(state.shipping))}${state.shipping==='pickup'?'':' · '+esc(a.city)+', '+esc(a.street)}</span><button class="text-button" id="backCheckout">${esc(t('backDetails'))} ↗</button></div><div class="review-items">${state.cart.map(line=>{const p=core.product(line.id),c=colorFor(p,line.color);return `<div><img src="${p.image}" width="80" height="80" style="filter:${imageFilter(p,c)}" alt="${esc(localeText(p.title))}"><span><b dir="ltr">${p.code}</b><small>${esc(localeText(c.label))} / ${esc(line.size)} × ${line.qty}</small></span><strong dir="ltr">${esc(money(p.price*line.qty))}</strong></div>`;}).join('')}</div><div id="checkoutSummary">${summaryRows(q)}</div><form id="checkoutPayment"><fieldset class="payment-choices"><legend>${esc(t('paymentMethod'))}</legend>${['card','bit','paypal'].map(v=>`<label><input type="radio" name="payment" value="${v}" ${state.payment===v?'checked':''}>${esc(t({card:'payCard',bit:'payBit',paypal:'payPaypal'}[v]))}</label>`).join('')}</fieldset><p class="payment-note">${esc(t('paymentNote'))}</p><label class="check-option consent"><input type="checkbox" id="demoConsent" ${state.consent?'checked':''}><span>${esc(t('demoConsent'))}</span></label><p class="form-error" id="checkoutError" role="alert"></p><button class="button button-dark" id="placeDemoOrder" type="submit">${esc(t('placeOrder'))} ↗</button></form>`;
  }
 }
 function renderCompareBar(){
  $('#compareBar').hidden=!state.compare.length;
  $('#compareNames').textContent=state.compare.map(id=>core.product(id).code).join(' / ');
  $('#compareOpen').textContent=t('compare')+` (${state.compare.length}/3)`;$('#compareOpen').disabled=state.compare.length<2;
 }
 function renderCompare(){
  const ps=state.compare.map(core.product).filter(Boolean);
  $('#compareBody').innerHTML=`<p class="eyebrow" dir="ltr">MOVA / SIDE BY SIDE</p><h2 id="compareTitle">${esc(t('compareTitle'))}</h2><div class="comparison-scroll"><table class="comparison-table"><thead><tr><th scope="col">${esc(t('compare'))}</th>${ps.map(p=>`<th scope="col"><img src="${p.image}" width="200" height="200" alt="${esc(localeText(p.title))}"><b dir="ltr">${p.code}</b><button data-remove-compare="${p.id}" aria-label="${esc(t('removeCompare')+' '+p.code)}">×</button></th>`).join('')}</tr></thead><tbody>${[['category',p=>t(p.category)],['total',p=>money(p.price)],['material',p=>localeText(p.material)],['colors',p=>p.colors.map(c=>localeText(c.label)).join(' / ')],['sizes',p=>p.sizes.join(' · ')]].map(([label,value])=>`<tr><th scope="row">${esc(t(label))}</th>${ps.map(p=>`<td>${esc(value(p))}</td>`).join('')}</tr>`).join('')}<tr><th></th>${ps.map(p=>`<td><button class="button button-dark" data-compare-product="${p.id}">${esc(t('chooseOptions'))}</button></td>`).join('')}</tr></tbody></table></div>`;
 }
 function renderSizeGuide(){
  const p=core.product(state.selected?.id);if(!p)return;
  const footwear=p.category==='footwear';
  const rows=footwear?p.sizes.map((s,i)=>[s,(22.5+i*(p.id==='slide'?1:0.5)).toFixed(1)]):[['XS','80–86'],['S','86–92'],['M','92–98'],['L','98–104'],['XL','104–112'],['XXL','112–120']];
  $('#sizeGuideBody').innerHTML=`<p class="eyebrow" dir="ltr">MOVA / FIND YOUR FIT</p><h2 id="sizeGuideTitle">${esc(t('sizeGuide'))}</h2><p>${esc(t('sizeGuideNote'))}</p><table class="size-guide-table"><thead><tr><th>${esc(t('size'))}</th><th>${esc(t(footwear?'footLength':'chest'))}</th></tr></thead><tbody>${rows.map(row=>`<tr><td dir="ltr">${row[0]}</td><td dir="ltr">${row[1]}</td></tr>`).join('')}</tbody></table>${footwear?'':`<p>${esc(t('fitGuide'))}</p>`}`;
 }
 function renderHistory(){
  $('#orderHistoryBody').innerHTML=`<p class="eyebrow" dir="ltr">MOVA / YOUR SELECTIONS</p><h2 id="orderHistoryTitle">${esc(t('orderHistoryTitle'))}</h2><p>${esc(t('savedLocally'))}</p>${state.orders.length?state.orders.map(o=>{const q=core.quote(o.items,o);return `<article class="saved-order"><div><b dir="ltr">${o.id}</b><time>${esc(new Date(o.date).toLocaleDateString(state.lang==='ar'?'ar-IL':state.lang==='he'?'he-IL':'en-GB'))}</time></div><p>${o.items.map(l=>`${esc(core.product(l.id).code)} × ${l.qty}`).join(' · ')}</p><strong dir="ltr">${esc(money(q.total))}</strong><small>${esc(t('cartNote'))}</small></article>`;}).join('')+`<button class="text-button" id="clearOrderHistory">${esc(t('clearHistory'))}</button>`:`<p class="orders-empty">${esc(t('ordersEmpty'))}</p>`}`;
 }
 function completeOrder(){
  if(state.completing||!state.cart.length)return;
  if(!state.consent){$('#checkoutError').textContent=t('consentRequired');$('#demoConsent').focus();return;}
  state.completing=true;
  const random=globalThis.crypto?.randomUUID?.().slice(0,6).toUpperCase()??Math.random().toString(36).slice(2,8).toUpperCase();
  const order={id:`MOVA-${Date.now().toString(36).toUpperCase()}-${random}`,date:new Date().toISOString(),items:core.sanitizeCart(state.cart),coupon:state.coupon,shipping:state.shipping,gift:state.gift,payment:state.payment};
  state.orders=[order,...state.orders].slice(0,12);state.lastOrder=order;
  try{localStorage.setItem('mova-orders',JSON.stringify(state.orders));state.orderSaveFailed=false;}catch{state.orderSaveFailed=true;}
  state.cart=[];saveCart();renderCart();state.address={};state.checkoutStep=3;state.consent=false;state.completing=false;renderCheckout();$('#checkoutDialog').scrollTop=0;$('#checkoutTitle').setAttribute('tabindex','-1');$('#checkoutTitle').focus();
 }
 document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.compare){
   const id=b.dataset.compare;if(!core.product(id))return;
   if(state.compare.includes(id))state.compare=state.compare.filter(x=>x!==id);else if(state.compare.length<3)state.compare.push(id);else{toast(t('compareMax'));return;}
   renderProducts();$(`[data-compare="${id}"]`)?.focus({preventScroll:true});return;
  }
  if(b.dataset.removeCompare){state.compare=state.compare.filter(id=>id!==b.dataset.removeCompare);renderCompareBar();renderProducts();if(state.compare.length<2)closeDialog('compareDialog');else renderCompare();return;}
  if(b.dataset.compareProduct){closeDialog('compareDialog');openProduct(b.dataset.compareProduct);return;}
  if(b.dataset.component){selectComponent(b.dataset.component);return;}
  if(b.dataset.gallery&&b.tagName==='BUTTON'){
   state.gallery=b.dataset.gallery;activeComponent=null;const spin=state.gallery==='spin';productSpin?.setEnabled(spin);$('#productSpinControls').hidden=!spin;$('#productSpinNote').hidden=!spin;$('#productGestureHint').textContent=t(spin?'spinHint':'gestureHint');$('#productVisual').dataset.gallery=state.gallery;$$('[data-component]').forEach(el=>el.setAttribute('aria-pressed','false'));$('#productImageCaption').textContent=t({spin:'spinView',whole:'fullView',detail:'galleryDetail',texture:'galleryTexture'}[state.gallery]);
   if(state.gallery==='whole'||state.gallery==='spin')productZoom.reset();else productZoom.focus(.5,.5,state.gallery==='texture'?5:2.5);
   $$('.gallery-tabs button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.gallery===state.gallery)));return;
  }
  if(b.hasAttribute('data-open-orders')){if($('#checkoutDialog').open)closeDialog('checkoutDialog');if($('#menuDialog').open)closeDialog('menuDialog');renderHistory();openDialog('orderHistoryDialog');return;}
  switch(b.id){
   case 'productSpinAuto':productSpin?.setAuto(!productSpin.snapshot().automatic);break;
   case 'menuFavorites':closeDialog('menuDialog');$('#favoritesButton').click();break;
   case 'checkoutButton':state.checkoutStep=1;state.consent=false;break;
   case 'viewBagButton':closeDialog('productDialog');renderCart();openDialog('cartDialog');break;
   case 'sizeGuideButton':renderSizeGuide();openDialog('sizeGuideDialog');break;
   case 'compareOpen':if(state.compare.length>=2){renderCompare();openDialog('compareDialog');}break;
   case 'clearCompare':state.compare=[];renderProducts();break;
   case 'resetStoreFilters':state.filter='all';state.query='';state.sort='featured';state.maxPrice=Infinity;state.availableOnly=false;state.favoritesOnly=false;$('#searchInput').value='';renderProducts();break;
   case 'removeCoupon':state.coupon='';renderCart();break;
   case 'backCheckout':state.checkoutStep=1;renderCheckout();break;
   case 'showOrders':if($('#checkoutDialog').open)closeDialog('checkoutDialog');if($('#menuDialog').open)closeDialog('menuDialog');renderHistory();openDialog('orderHistoryDialog');break;
   case 'clearOrderHistory':state.orders=[];safeWrite('mova-orders',[]);renderHistory();break;
  }
 });
 $('#productDialog').addEventListener('close',()=>{productZoom?.destroy();productZoom=null;productSpin?.destroy();productSpin=null;if(detailRequest){detailRequest.onload=null;detailRequest.onerror=null;}detailRequest=null;});
 document.addEventListener('change',event=>{
  const el=event.target;
  switch(el.id){
   case 'sortProducts':state.sort=el.value;renderProducts();break;
   case 'priceFilter':state.maxPrice=Number(el.value);renderProducts();break;
   case 'availableOnly':state.availableOnly=el.checked;renderProducts();break;
   case 'giftWrap':state.gift=el.checked;renderCart();break;
   case 'cartShipping':state.shipping=el.value;renderCart();break;
   case 'demoConsent':state.consent=el.checked;break;
  }
  if(el.name==='shipping'){
   state.address=formAddress();state.shipping=el.value;
   $$('[data-address-field] input').forEach(input=>{input.disabled=state.shipping==='pickup';input.setAttribute('aria-required',String(state.shipping!=='pickup'));input.removeAttribute('aria-invalid');});
   $('#checkoutSummary').innerHTML=summaryRows(quote());
  }
  if(el.name==='payment'&&['card','bit','paypal'].includes(el.value))state.payment=el.value;
 });
 document.addEventListener('input',event=>{if(event.target.id==='productSpinRange'){productSpin?.seekAngle(Number(event.target.value));return;}if(event.target.id.startsWith('checkout-')){state.address=formAddress();event.target.removeAttribute('aria-invalid');}});
 document.addEventListener('submit',event=>{
  if(!['couponForm','checkoutDetails','checkoutPayment'].includes(event.target.id))return;event.preventDefault();
  if(event.target.id==='couponForm'){
   const code=core.couponCode($('#couponInput').value);
   if(!code||!core.validCoupon(code)){$('#couponMessage').textContent=t('couponInvalid');$('#couponInput').setAttribute('aria-invalid','true');return;}
   state.coupon=code;renderCart();$('#couponMessage').textContent=t('couponApplied');return;
  }
  if(event.target.id==='checkoutDetails'){
   state.address=formAddress();const invalid=core.validateAddress(state.address,state.shipping);
   ['name','email','phone','city','street'].forEach(k=>$('#checkout-'+k)?.setAttribute('aria-invalid',String(invalid.includes(k))));
   if(invalid.length){$('#checkoutError').textContent=t('invalidAddress');$('#checkout-'+invalid[0]).focus();return;}
   state.checkoutStep=2;renderCheckout();$('#checkoutDialog').scrollTop=0;return;
  }
  completeOrder();
 });
 return {renderProducts,openProduct,renderProduct,updateSelection,addSelected,renderCart,renderCheckout,renderCompare,renderHistory,renderSizeGuide};
};
