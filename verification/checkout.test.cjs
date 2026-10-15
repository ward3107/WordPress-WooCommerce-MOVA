/* Real application DOM flows with jsdom. This is not a browser/layout test. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.join(__dirname,'..');
function setup(stored={},blocked=false){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),{url:'https://mova-motion-store.vasele66.chatgpt.site',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,d=w.document,$=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)];
 w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.fetch=()=>{throw Error('The shopping demo must not make network requests');};
 for(const [k,v] of Object.entries(stored))w.localStorage.setItem(k,JSON.stringify(v));
 if(blocked){w.Storage.prototype.getItem=function(){throw Error('storage blocked');};w.Storage.prototype.setItem=function(){throw Error('storage blocked');};}
 try{w.sessionStorage.setItem('mova-opening-v8','1');}catch{}
for(const file of ['catalog.js','store-core.js','store-copy.js','product-zoom.js','product-spin.js','store-ui.js','cinematic-opening.js','app.js'])w.eval(fs.readFileSync(path.join(root,'dist',file),'utf8'));
 const click=s=>{const el=$(s);assert.ok(el,'Control missing: '+s);el.click();};
 const set=(s,value,type='change')=>{const el=$(s);assert.ok(el,s);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event(type,{bubbles:true}));};
 const submit=s=>{$(s).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};
 const closeProduct=()=>click('#productDialog>[data-close-dialog]');
 return {w,d,$,$$,click,set,submit,closeProduct,errors,close:()=>dom.window.close()};
}
const same=(a,b)=>assert.equal(JSON.stringify(a),JSON.stringify(b));
let a;
try{
 a=setup();let {w,d,$,$$,click,set,submit,closeProduct}=a;
 const ps=w.MOVA_CATALOG.products,core=w.MOVA_CORE;
 assert.equal(ps.length,12);assert.equal(new Set(ps.map(p=>p.image)).size,12);assert.equal(new Set(ps.map(p=>p.category)).size,5);
 for(const p of ps){
  click(`[data-product="${p.id}"] .product-open`);assert.equal($('#productDialogTitle').textContent,p.code);
  for(const c of p.colors){
   click(`[data-color-option="${c.id}"]`);assert.equal($(`[data-color-option="${c.id}"]`).getAttribute('aria-pressed'),'true');
   for(const size of p.sizes){const el=$(`[data-size-option="${size}"]`);assert.equal(el.disabled,core.stock({id:p.id,color:c.id,size})===0);}
  }
  click('.gallery-tabs [data-gallery="detail"]');assert.equal($('#productVisual').dataset.gallery,'detail');
  $('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'+',bubbles:true}));
  click('.gallery-tabs [data-gallery="whole"]');assert.ok(!$('#productVisual').classList.contains('zoomed'));assert.equal($('#productZoom'),null);
  if(p.category==='footwear'||p.category==='apparel'){click('#sizeGuideButton');assert.ok($('#sizeGuideDialog').open);assert.ok($$('.size-guide-table tbody tr').length>=5);click('#sizeGuideDialog>[data-close-dialog]');assert.ok($('#productDialog').open);}
  closeProduct();
 }
 assert.equal($$('#recentGrid .mini-product').length,4);
 click('[data-product="echo"] .product-open');assert.ok($('#addProductButton').disabled);closeProduct();
 set('#availableOnly',true);assert.equal($$('.product-card').length,11);assert.equal($('[data-product="echo"]'),null);
 set('#sortProducts','price-low');let prices=$$('.product-card').map(el=>core.product(el.dataset.product).price);same(prices,[...prices].sort((x,y)=>x-y));
 set('#sortProducts','price-high');prices=$$('.product-card').map(el=>core.product(el.dataset.product).price);same(prices,[...prices].sort((x,y)=>y-x));
 set('#priceFilter','250');assert.ok($$('.product-card').every(el=>core.product(el.dataset.product).price<=250));
 click('#resetStoreFilters');assert.equal($$('.product-card').length,12);assert.equal($('#priceFilter').value,'Infinity');
 click('[data-filter="apparel"]');assert.equal($$('.product-card').length,2);
 click('#resetStoreFilters');set('#searchInput','hoodie','input');assert.equal($('.product-card').dataset.product,'form');
 click('#clearSearch');
 for(const id of ['move','focus','carry'])click(`[data-compare="${id}"]`);
 click('[data-compare="loop"]');assert.equal($('[data-compare="loop"]').getAttribute('aria-pressed'),'false');
 click('#compareOpen');assert.ok($('#compareDialog').open);assert.equal($$('.comparison-table thead th').length,4);
 click('[data-remove-compare="carry"]');assert.equal($$('.comparison-table thead th').length,3);
 click('[data-compare-product="focus"]');assert.ok(!$('#compareDialog').open);assert.equal($('#productDialogTitle').textContent,'FOCUS 02');closeProduct();
 click('#clearCompare');assert.ok($('#compareBar').hidden);
 // Two different sizes and prices; coupon, wrap and shipping share one quote.
 click('[data-product="form"] .product-open');click('[data-color-option="sage"]');click('[data-size-option="M"]');click('#addProductButton');closeProduct();
 click('[data-product="loop"] .product-open');click('[data-product-qty="1"]');click('#addProductButton');click('#viewBagButton');
 assert.ok($('#cartDialog').open);assert.equal($('#cartCount').textContent,'3');
 set('#couponInput','  mova10  ','input');submit('#couponForm');assert.equal($('#couponInput').value,'MOVA10');
 const cart=JSON.parse(w.localStorage.getItem('mova-cart'));assert.equal(core.total(cart),520);
 assert.ok($('#cartBody').textContent.includes('MOVA10'));assert.equal(core.quote(cart,{coupon:'MOVA10'}).discount,52);
 set('#couponInput','wrong','input');submit('#couponForm');assert.equal($('#couponInput').getAttribute('aria-invalid'),'true');assert.ok($('#cartBody .saving').textContent.includes('MOVA10'));
 set('#couponInput','WELCOME15','input');submit('#couponForm');assert.ok($('#cartBody .saving').textContent.includes('WELCOME15'));
 set('#giftWrap',true);set('#cartShipping','express');
 const expected=core.quote(cart,{coupon:'WELCOME15',gift:true,shipping:'express'});assert.equal(expected.total,496);
 assert.equal($('#cartBody .total-row strong[dir=ltr]').textContent,new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(expected.total));
 click('#removeCoupon');assert.equal($('#cartBody .saving'),null);assert.equal($('#couponInput').value,'');
 click('#cartDialog [data-close-dialog]');assert.deepEqual(a.errors,[]);a.close();

 // Complete all three languages with all three delivery and payment methods.
 let retained;
 for(const [lang,shipping,payment] of [['he','standard','card'],['en','express','bit'],['ar','pickup','paypal']]){
  a=setup();({w,d,$,$$,click,set,submit,closeProduct}=a);set('#language',lang);
  click('[data-product="pace"] .product-open');click('#addProductButton');click('#viewBagButton');
  set('#couponInput','MOVA10','input');submit('#couponForm');set('#giftWrap',true);click('#checkoutButton');
  assert.ok($('#checkoutDialog').open);submit('#checkoutDetails');assert.equal($('#checkout-name').getAttribute('aria-invalid'),'true');assert.equal(d.activeElement,$('#checkout-name'));
  for(const [name,value] of Object.entries({name:'Demo Person',email:'demo@example.test',phone:'0501234567',city:'Demo City',street:'Example 10'}))set('#checkout-'+name,value,'input');
  click(`input[name="shipping"][value="${shipping}"]`);
  assert.equal($('#checkout-city').disabled,shipping==='pickup');
  submit('#checkoutDetails');assert.ok($('#checkoutPayment'));assert.equal($('input[autocomplete="cc-number"]'),null);
  assert.ok($('#checkoutDialog').textContent.includes('demo@example.test'));
  click('#backCheckout');assert.equal($('#checkout-name').value,'Demo Person');submit('#checkoutDetails');
  click(`input[name="payment"][value="${payment}"]`);submit('#checkoutPayment');assert.ok($('#checkoutError').textContent);assert.ok($('#checkoutPayment'));
  set('#demoConsent',true);submit('#checkoutPayment');assert.equal($('#cartCount').textContent,'0');assert.ok($('.order-success'));assert.ok(!$('#checkoutPayment'));
  const stored=w.localStorage.getItem('mova-orders');assert.ok(stored&&!stored.includes('Demo Person')&&!stored.includes('demo@example.test')&&!stored.includes('0501234567'));
  retained=JSON.parse(stored);assert.equal(retained.length,1);assert.equal(retained[0].payment,payment);assert.equal(retained[0].shipping,shipping);
  same(JSON.parse(w.localStorage.getItem('mova-cart')),[]);
  click('.order-success [data-open-orders]');assert.ok($('#orderHistoryDialog').open);assert.equal($$('.saved-order').length,1);
  click('#clearOrderHistory');assert.equal($$('.saved-order').length,0);same(JSON.parse(w.localStorage.getItem('mova-orders')),[]);
  assert.deepEqual(a.errors,[]);a.close();
 }
 a=setup({'mova-orders':retained,'mova-cart':[{id:'move',color:'orange',size:'40',qty:10,price:1},{id:'echo',color:'green',size:'ONE SIZE',qty:1}]});
 ({w,$,$$,click}=a);assert.equal($('#cartCount').textContent,String(w.MOVA_CORE.stock({id:'move',color:'orange',size:'40'})));
 click('.site-footer [data-open-orders]');assert.equal($$('.saved-order').length,1,'Confirmations survive a reload');assert.deepEqual(a.errors,[]);a.close();
 // Restrictive storage must not block shopping or a local confirmation.
 a=setup({},true);({w,d,$,click,set,submit,closeProduct}=a);
 click('[data-product="loop"] .product-open');click('#addProductButton');click('#viewBagButton');click('#checkoutButton');
 for(const [name,value] of Object.entries({name:'Example Person',email:'sample@example.test',phone:'0501234567'}))set('#checkout-'+name,value,'input');
 click('input[name="shipping"][value="pickup"]');submit('#checkoutDetails');set('#demoConsent',true);submit('#checkoutPayment');assert.ok($('.order-success'));assert.ok($('.order-success [role=status]'));assert.deepEqual(a.errors,[]);a.close();
 console.log('PASS: 12 unique designs, every color/size availability, galleries, size guides, recent items, sort/filter/search, sold-out states, 3-way comparison, coupon replacement/errors, gift/shipping totals, address validation, 3 languages × 3 delivery/payment methods, consent, completion, history, reload, tampered storage and blocked storage');
}catch(e){if(a)a.close();console.error(e);process.exitCode=1;}
