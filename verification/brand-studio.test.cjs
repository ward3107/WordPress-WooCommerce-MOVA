/* Full-page behavior checks. No browser rendering or physical touch is simulated. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const {JSDOM, VirtualConsole} = require(process.env.MOVA_DOM_MODULE || 'jsdom');
const root = path.join(__dirname, '..', 'dist'), key = 'mova-brand-v1';
function boot({stored, denied = false} = {}) {
  const errors = [], vc = new VirtualConsole(); vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {url:'https://mova.example/', runScripts:'outside-only', pretendToBeVisual:true, virtualConsole:vc});
  const w = dom.window, d = w.document, $ = selector => d.querySelector(selector);
  w.matchMedia = () => ({matches:true, addEventListener(){}, addListener(){}});
  w.HTMLElement.prototype.scrollIntoView = function(){};
  w.HTMLDialogElement.prototype.showModal = function(){this.open = true;};
  w.HTMLDialogElement.prototype.close = function(){this.open = false; this.dispatchEvent(new w.Event('close'));};
  w.Image = class {set src(value){this.value=value;}};
  w.fetch = () => {throw new Error('Unexpected network request');};
  w.open = () => {throw new Error('Brand changes must not open external pages');};
  if (stored !== undefined) w.localStorage.setItem(key, stored);
  if (denied) Object.defineProperty(w, 'localStorage', {get(){throw new Error('Blocked storage');}});
  for (const script of d.querySelectorAll('script[src]')) w.eval(fs.readFileSync(path.join(root, script.getAttribute('src').split('?')[0]), 'utf8'));
  const name = value => {$('#brandName').value = value; $('#brandName').dispatchEvent(new w.Event('input', {bubbles:true}));};
  const theme = value => {const radio = $(`[name="brandTheme"][value="${value}"]`); radio.checked = true; radio.dispatchEvent(new w.Event('change', {bubbles:true}));};
  const submit = () => $('#brandStudioForm button[type="submit"]').click();
  const lang = value => {$('#language').value = value; $('#language').dispatchEvent(new w.Event('change', {bubbles:true}));};
  return {w, d, $, errors, name, theme, submit, lang, close:()=>w.close()};
}
const x = boot(); let persisted;
try {
  const {w,d,$,name,theme,submit,lang} = x;
  assert.equal(d.querySelectorAll('.product-card').length,12);
  assert.equal($('#brandReset').disabled,true);
  assert.equal($('#brandViewStore').hidden,true);
  const input = '<img src=x onerror=alert(1)>';
  name(input); theme('cobalt');
  assert.equal($('#brandPreviewName').textContent,input);
  assert.equal($('#brandPreviewName img'),null,'Business names remain plain text');
  assert.equal($('#brandPreview').dataset.brandTheme,'cobalt');
  assert.equal(d.documentElement.dataset.brandTheme,'terracotta','Draft is distinct from the applied storefront');
  assert.equal($('#siteHeader [data-store-brand]').textContent,'mova');
  submit();
  assert.equal(d.documentElement.dataset.brandTheme,'cobalt');
  assert.equal($('#siteHeader [data-store-brand]').textContent,input);
  assert.equal($('#siteHeader img'),null);
  assert.equal($('#siteHeader [data-brand-link]').getAttribute('aria-label'),input);
  assert.equal($('#siteHeader [data-brand-mark]').hidden,true);
  assert.equal($('#brandViewStore').hidden,false);
  for (const [language,direction] of [['en','ltr'],['ar','rtl'],['he','rtl']]) {
    lang(language);
    assert.equal(d.documentElement.dir,direction);
    assert.equal($('#brandName').value,input,'Changing language preserves branding');
    const contact = new URL($('#contactLink').href);
    assert.equal(contact.hostname,'wa.me'); assert.equal(contact.pathname,'/972544513141');
    assert.ok(contact.searchParams.get('text').includes(input));
    assert.ok(contact.searchParams.get('text').includes(w.MOVA_STORE_COPY[language].brandTheme_cobalt));
    assert.equal($('#brandStatus').textContent,w.MOVA_STORE_COPY[language].brandApplied);
    for (const id of ['move','focus','carry']) {
      $(`[data-mood="${id}"]`).click();
      const product = w.MOVA_CATALOG.products.find(p=>p.id===id);
      assert.equal($('#moodStage').dataset.mood,id);
      assert.equal($('#moodImage').getAttribute('src'),product.image);
      assert.equal($('#moodCode').textContent,product.code);
      assert.equal($('#moodMaterial').textContent,product.material[language]);
      assert.equal($('#moodPrice').textContent,product.price.toLocaleString(language==='he'?'he-IL':language==='ar'?'ar-IL':'en-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}));
      $('#moodExplore').click(); assert.equal($('#productDialogTitle').textContent,product.code);
      assert.equal($('#productDialog').dataset.flagshipProduct,id);
      $('#productDialog [data-close-dialog]').click();
    }
  }
  // Applying a brand must not reset an existing shopping session.
  $('.hero-product-tag').click(); $('#addProductButton').click(); $('#productDialog [data-close-dialog]').click();
  const cart = w.localStorage.getItem('mova-cart');
  name('  אור סטודיו  '); theme('forest'); submit();
  assert.equal($('#brandName').value,'אור סטודיו');
  assert.equal(w.localStorage.getItem('mova-cart'),cart);
  assert.equal($('#cartCount').textContent,'1');
  persisted = w.localStorage.getItem(key);
  assert.deepEqual(JSON.parse(persisted),{name:'אור סטודיו',theme:'forest'});
  name('A\u202e'+'Z'.repeat(80)); submit();
  assert.equal($('#brandName').value.length,32);
  assert.ok(!$('#brandPreviewName').textContent.includes('\u202e'));
  $('#brandReset').click();
  assert.equal(w.localStorage.getItem(key),null);
  assert.equal($('#brandName').value,'');
  assert.equal($('#brandPreviewName').textContent,'mova');
  assert.equal($('#siteHeader [data-store-brand]').textContent,'mova');
  assert.equal(d.documentElement.dataset.brandTheme,'terracotta');
  assert.equal(d.documentElement.hasAttribute('data-brand-custom'),false);
  assert.equal($('#siteHeader [data-brand-mark]').hidden,false);
  assert.equal($('#brandReset').disabled,true);
  assert.equal(w.localStorage.getItem('mova-cart'),cart);
  assert.deepEqual(x.errors,[]);
} finally {x.close();}
const restored = boot({stored:persisted});
try {
  assert.equal(restored.$('#siteHeader [data-store-brand]').textContent,'אור סטודיו');
  assert.equal(restored.d.documentElement.dataset.brandTheme,'forest');
  assert.equal(restored.$('#brandViewStore').hidden,false);
  assert.equal(restored.$('[name="brandTheme"][value="forest"]').checked,true);
  assert.deepEqual(restored.errors,[]);
} finally {restored.close();}
for (const options of [{stored:'{bad JSON'}, {stored:'{"name":44,"theme":"url(https://evil.example)"}'}, {denied:true}]) {
  const y=boot(options);
  try {
    assert.equal(y.$('#brandName').value,''); assert.equal(y.d.documentElement.dataset.brandTheme,'terracotta');
    y.name('LOCAL'); y.theme('forest'); y.submit();
    assert.equal(y.$('#siteHeader [data-store-brand]').textContent,'LOCAL');
    y.$('#brandReset').click(); assert.equal(y.$('#siteHeader [data-store-brand]').textContent,'mova');
    assert.deepEqual(y.errors,[]);
  } finally {y.close();}
}
// Check the intended foreground/background pairs in every curated palette.
const css=fs.readFileSync(path.join(root,'brand-studio.css'),'utf8');
const luminance=hex=>hex.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for (const theme of ['terracotta','forest','cobalt']) {
  const block=css.match(new RegExp(`\\[data-brand-theme="${theme}"\\] \\{([^}]+)\\}`))[1];
  const colors=Object.fromEntries([...block.matchAll(/--([\w-]+):#([0-9a-f]{6})/g)].map(([,key,value])=>[key,value]));
  for (const [fg,bg] of [['ink','paper'],['muted','paper'],['muted','studio-panel'],['white','ink'],['ink','orange'],['ink','lime'],['studio-accent','paper']]) {
    assert.ok(contrast(colors[fg],colors[bg])>=4.5,`${theme}: ${fg} on ${bg} lacks text contrast`);
  }
}
console.log('PASS: actual-page branding, safe names, preview/apply/reset, theme contrast, WhatsApp brief, three languages, product chapters, cart preservation, persistence, malformed and blocked storage');
