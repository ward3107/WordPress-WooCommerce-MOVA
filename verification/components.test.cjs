const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/catalog.js'),'utf8'),context);
const source=require('../data/product-components.cjs');
for(const p of context.window.MOVA_CATALOG.products){
 assert.ok(p.components.length>=3&&p.components.length<=8,p.id+' has a useful component count');
 assert.equal(new Set(p.components.map(c=>c.id)).size,p.components.length);
 assert.equal(JSON.stringify(p.components),JSON.stringify(source[p.id]),'Generated catalog keeps the complete authored detail');
 for(const component of p.components){
  for(const key of ['label','material','detail'])for(const lang of ['he','en','ar'])assert.ok(component[key][lang].trim().length>=3,`${p.id}/${component.id}/${key}/${lang}`);
  assert.ok(component.focus.x>=0&&component.focus.x<=1&&component.focus.y>=0&&component.focus.y<=1);
  assert.ok(component.focus.scale>1&&component.focus.scale<=12);
 }
 assert.ok(fs.existsSync(path.join(__dirname,'../dist',p.detailImage)),'High-quality image exists for '+p.id);
}
console.log('PASS: all 12 products have distinct component details, 3-language labels/materials/explanations, valid image focus and higher-quality detail assets');
