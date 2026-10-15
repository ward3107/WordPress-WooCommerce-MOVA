const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'dist/catalog.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'dist/store-core.js'),'utf8'),context);
const core=context.window.MOVA_CORE;
const same=(actual,expected)=>assert.equal(JSON.stringify(actual),JSON.stringify(expected));
const orange={id:'move',color:'orange',size:'40',qty:2};
const green={id:'move',color:'mint',size:'40',qty:1};
const focus={id:'focus',color:'peach',size:'ONE SIZE',qty:1};
let cart=core.add([],orange);
assert.equal(core.count(cart),2);
assert.equal(core.total(cart),980);
cart=core.add(cart,green);
cart=core.add(cart,focus);
assert.equal(cart.length,3,'Variants are distinct cart lines');
assert.equal(core.count(cart),4);
assert.equal(core.total(cart),2160);
cart=core.add(cart,{...orange,qty:1});
assert.equal(cart.length,3,'Same variant merges into its line');
assert.equal(cart[0].qty,3);
cart=core.update(cart,core.key(orange),-1);
assert.equal(cart[0].qty,2);
cart=core.update(cart,core.key(green),-1);
assert.equal(cart.length,2,'Decrementing the last unit removes only its variant');
assert.equal(core.total(cart),1670);
assert.equal(core.add([{...orange,qty:10}],{...orange,qty:10})[0].qty,core.stock(orange),'Variant stock cap is enforced');
const tampered=[
 {...orange,qty:0},{...orange,qty:-5},{...orange,qty:11},
 {...orange,qty:1.5},{...orange,qty:'2'},{...orange,color:'invented'},
 {...orange,size:'XL'},{...orange,id:'nonexistent'},{id:'<script>',qty:1},null,
 {...orange,price:1,privateData:'should be dropped'}
];
same(core.sanitizeCart(tampered),[orange]);
assert.equal(core.total(tampered),980,'Catalog price wins over injected local price');
same(core.sanitizeCart('corrupt'),[]);
same(core.sanitizeCart({}),[]);
same(core.sanitizeCart([orange,orange]),[{...orange,qty:4}]);
same(core.add([orange],{...orange,qty:-10}),[orange]);
same(core.update([orange],'unknown-key',-1),[orange]);
assert.equal(core.total([]),0);
assert.equal(core.count([]),0);
assert.equal(orange.qty,2,'Operations do not mutate caller objects');
console.log('PASS: variant cart, totals, merge, decrement, cap and tampered storage rejection');
