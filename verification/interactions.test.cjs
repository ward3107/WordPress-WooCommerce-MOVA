/* DOM behavior tests, not a browser/layout test. Use the installed jsdom module
 * supplied via MOVA_DOM_MODULE; no browser installation or launch is involved.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require(process.env.MOVA_DOM_MODULE||'jsdom');
const root=path.join(__dirname,'..');
const virtualConsole=new VirtualConsole();
const errors=[];
virtualConsole.on('jsdomError',error=>errors.push(error.message));
const dom=new JSDOM(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),{url:'https://mova-motion-store.vasele66.chatgpt.site',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
const w=dom.window,d=w.document;
const $=selector=>d.querySelector(selector);
const $$=selector=>[...d.querySelectorAll(selector)];
const click=selector=>{const el=$(selector);assert.ok(el,'Missing control: '+selector);el.click();};
const changeLang=lang=>{$('#language').value=lang;$('#language').dispatchEvent(new w.Event('change',{bubbles:true}));};
const changeSearch=query=>{$('#searchInput').value=query;$('#searchInput').dispatchEvent(new w.Event('input',{bubbles:true}));};
const cart=()=>JSON.parse(w.localStorage.getItem('mova-cart'));
const media={matches:false,listeners:[],addEventListener(_,listener){this.listeners.push(listener);},addListener(listener){this.listeners.push(listener);}};
w.matchMedia=query=>query.includes('reduced-motion')?media:{matches:false,addEventListener(){},addListener(){}};
w.HTMLElement.prototype.scrollIntoView=function(){};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
w.fetch=()=>{throw new Error('Demo must not make a network request');};
w.localStorage.setItem('mova-cart','corrupt JSON');
w.localStorage.setItem('mova-favorites',JSON.stringify(['unknown',{id:'move'}]));
w.sessionStorage.setItem('mova-opening-v9','1');
for(const file of ['catalog.js','store-core.js','store-copy.js','product-zoom.js','product-spin.js','store-ui.js','cinematic-opening.js'])w.eval(fs.readFileSync(path.join(root,'dist',file),'utf8'));
w.eval(fs.readFileSync(path.join(root,'dist/app.js'),'utf8'));

(async()=>{
 assert.equal($$('.product-card').length,12);
 assert.equal($('#cartCount').textContent,'0');
 const trigger=$('.hero-product-tag');trigger.focus();trigger.click();
 assert.ok($('#productDialog').open);
 assert.equal($('#productDialogTitle').textContent,'MOVE 01');
 click('[data-color-option="mint"]');click('[data-size-option="42"]');click('[data-product-qty="1"]');
 assert.equal($('#selectedQty').textContent,'2');
 assert.equal($('[data-color-option="mint"]').getAttribute('aria-pressed'),'true');
 $('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'+',bubbles:true}));
 $('#productVisual').dispatchEvent(new w.KeyboardEvent('keydown',{key:'0',bubbles:true}));
 click('#addProductButton');
 assert.equal($('#cartCount').textContent,'2');
 assert.deepEqual(cart(),[{id:'move',color:'mint',size:'42',qty:2}]);
 click('#addProductButton');assert.equal(cart()[0].qty,4);
 click('#productDialog > [data-close-dialog]');assert.equal(d.activeElement,trigger,'Focus returns to product trigger');
 click('#cartButton');assert.ok($('#cartDialog').open);assert.equal($$('.cart-line').length,1);
 assert.equal($('.cart-summary-row span[dir=ltr]').textContent,w.MOVA_CORE.total(cart()).toLocaleString('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}));
 click('[data-cart-qty="1"]');assert.equal(cart()[0].qty,5);
 click('[data-cart-qty="-1"]');assert.equal(cart()[0].qty,4);
 click('[data-cart-remove]');assert.equal($('#cartCount').textContent,'0');assert.ok($('.empty-cart'));
 click('#cartDiscover');assert.ok(!$('#cartDialog').open);
 click('.hero-product-tag');click('[data-product-qty="1"]');click('#addProductButton');click('#productDialog > [data-close-dialog]');
 click('[data-product="focus"] .product-open');click('#addProductButton');click('#productDialog > [data-close-dialog]');
 assert.equal(w.MOVA_CORE.total(cart()),1670);
 click('#cartButton');click('#checkoutButton');
 assert.ok($('#checkoutDialog').open);assert.ok(!$('#cartDialog').open);
 assert.ok($('#checkoutDetails'),'Checkout offers a full local demo flow');assert.equal($('#checkoutDialog input[autocomplete=cc-number]'),null,'No card details collected');
 assert.equal(w.MOVA_CORE.total(cart()),1670,'Demo checkout neither charges nor modifies cart');
 click('#checkoutDialog [data-close-dialog]');

 click('#searchButton');assert.equal($('#searchInline').hidden,false);
 changeSearch('backpack');assert.equal($$('.product-card').length,1);assert.equal($('.product-card').dataset.product,'carry');
 changeSearch('<img src=x onerror=alert(1)>');assert.equal($$('.product-card').length,0);assert.ok(!$('#emptyResults').hidden);assert.equal($('#emptyResults img'),null);
 click('#clearSearch');assert.equal($$('.product-card').length,12);
 click('[data-filter="footwear"]');assert.equal($$('.product-card').length,3);
 click('[data-favorite="move"]');assert.deepEqual(JSON.parse(w.localStorage.getItem('mova-favorites')),['move']);
 click('#favoritesButton');assert.equal($$('.product-card').length,1);
 click('[data-favorite="move"]');assert.equal($$('.product-card').length,0);assert.ok(!$('#emptyResults').hidden);
 click('#resetFilters');assert.equal($$('.product-card').length,12);

 click('#menuButton');click('#menuFavorites');assert.ok(!$('#menuDialog').open);assert.equal($('#favoritesButton').getAttribute('aria-pressed'),'true');click('#resetFilters');
 click('[data-card-color="move"][data-color-id="mint"]');
 click('[data-product="move"] .product-open');assert.equal($('[data-color-option="mint"]').getAttribute('aria-pressed'),'true');click('#productDialog > [data-close-dialog]');
 click('[data-detail="mesh"]');assert.equal($('#detailCanvas').dataset.view,'mesh');assert.equal($('.detail-tab[data-detail="mesh"]').getAttribute('aria-pressed'),'true');
 click('.detail-tab[data-detail="whole"]');assert.equal($('.detail-tab[data-detail="whole"]').getAttribute('aria-pressed'),'true');
 click('[data-mood="focus"]');await new Promise(resolve=>setTimeout(resolve,190));
 assert.equal($('#moodStage').dataset.mood,'focus');assert.ok($('#moodImage').src.endsWith('/assets/headphones.webp'));
 click('#moodExplore');assert.equal($('#productDialogTitle').textContent,'FOCUS 02');click('#productDialog > [data-close-dialog]');

 for(const [lang,dir,headline] of [['en','ltr','Made to move.'],['ar','rtl','صُمّم للحركة.'],['he','rtl','נועד לזוז.']]){
   changeLang(lang);assert.equal(d.documentElement.dir,dir);assert.equal(d.documentElement.lang,lang);assert.equal($('#heroTitle span').textContent,headline);
   assert.equal($$('.product-card').length,12);assert.equal($('[data-filter="all"]').getAttribute('aria-pressed'),'true');
   assert.equal($('#cartCount').textContent,'3');
   assert.ok($('#contactLink').href.startsWith('https://wa.me/972544513141?text='));
 }
 click('#motionToggle');assert.ok(d.documentElement.classList.contains('paused-motion'));
 click('#motionToggle');assert.ok(!d.documentElement.classList.contains('paused-motion'));
 media.matches=true;media.listeners.forEach(listener=>listener());assert.ok($('#motionToggle').disabled);assert.ok(d.documentElement.classList.contains('paused-motion'));
 media.matches=false;media.listeners.forEach(listener=>listener());assert.ok(!$('#motionToggle').disabled);

 let copied;
 Object.defineProperty(w.navigator,'clipboard',{value:{async writeText(text){copied=text;}},configurable:true});
 click('#shareButton');await Promise.resolve();await Promise.resolve();assert.equal(copied,'https://mova-motion-store.vasele66.chatgpt.site');
 let shared;
 Object.defineProperty(w.navigator,'share',{value:async value=>{shared=value;},configurable:true});
 click('#shareButton');await Promise.resolve();assert.equal(shared.url,'https://mova-motion-store.vasele66.chatgpt.site');
 assert.ok(decodeURIComponent($('#whatsappShare').href).includes(shared.url));
 assert.ok(decodeURIComponent($('#facebookShare').href).includes(shared.url));

 w.localStorage.setItem('mova-cart',JSON.stringify([{id:'move',color:'orange',size:'40',qty:2,price:1},{id:'bad',qty:1}]));
 w.dispatchEvent(new w.StorageEvent('storage',{key:'mova-cart'}));
 assert.equal($('#cartCount').textContent,'2');click('#cartButton');assert.equal($$('.cart-line').length,1);click('#cartDialog [data-close-dialog]');

 // Exercise actual application fallback as well as mocked native dialog calls.
 w.HTMLDialogElement.prototype.showModal=undefined;w.HTMLDialogElement.prototype.close=undefined;
 click('.hero-product-tag');assert.ok($('#productDialog').classList.contains('fallback-dialog'));assert.ok($('#productDialog').open);
 d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.ok(!$('#productDialog').open);assert.equal(d.body.style.overflow,'');
 assert.deepEqual(errors,[],'No DOM runtime exceptions');
 console.log('PASS: products, variants, zoom, add/remove/quantity, checkout, search, favorites, close-ups, mood, three languages, sharing, motion and fallback dialogs');
 dom.window.close();
})().catch(error=>{console.error(error);dom.window.close();process.exitCode=1;});
