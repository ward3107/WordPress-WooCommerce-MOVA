/* Pure commerce rules shared by the storefront and its flow tests. */
window.MOVA_CORE=(()=>{
 'use strict';
 const products=window.MOVA_CATALOG.products;
 const product=id=>products.find(p=>p.id===id);
 const key=line=>`${line.id}:${line.color}:${line.size}`;
 const stock=line=>Math.max(0,Math.min(10,product(line?.id)?.inventory?.[line?.color]?.[line?.size]??0));
 const validLine=line=>!!line&&typeof line==='object'&&!!product(line.id)&&product(line.id).colors.some(c=>c.id===line.color)&&product(line.id).sizes.includes(line.size)&&Number.isInteger(line.qty)&&line.qty>0&&line.qty<=10;
 const sanitizeCart=value=>{
  if(!Array.isArray(value))return [];
  const result=[];
  for(const line of value.filter(validLine).slice(0,60)){
   const qty=Math.min(stock(line),line.qty);if(!qty)continue;
   const found=result.find(x=>key(x)===key(line));
   if(found)found.qty=Math.min(stock(line),found.qty+qty);
   else result.push({id:line.id,color:line.color,size:line.size,qty});
  }return result;
 };
 const add=(cart,line)=>sanitizeCart([...sanitizeCart(cart),line]);
 const update=(cart,k,delta)=>{
  if(!Number.isInteger(delta))return sanitizeCart(cart);
  return sanitizeCart(cart).flatMap(line=>{if(key(line)!==k)return [line];const qty=Math.min(stock(line),line.qty+delta);return qty>0?[{...line,qty}]:[];});
 };
 const count=cart=>sanitizeCart(cart).reduce((n,l)=>n+l.qty,0);
 const total=cart=>sanitizeCart(cart).reduce((n,l)=>n+product(l.id).price*l.qty,0);
 const couponCode=value=>typeof value==='string'?value.trim().toUpperCase():'';
 const validCoupon=value=>['','MOVA10','WELCOME15'].includes(couponCode(value));
 const quote=(cart,options={})=>{
  const subtotal=total(cart),coupon=validCoupon(options.coupon)?couponCode(options.coupon):'';
  const discount=Math.round(subtotal*(coupon==='MOVA10'?.10:coupon==='WELCOME15'?.15:0));
  const method=['standard','express','pickup'].includes(options.shipping)?options.shipping:'standard';
  const shipping=!subtotal||method==='pickup'?0:method==='express'?39:subtotal-discount>=600?0:25;
  const gift=subtotal&&options.gift===true?15:0;
  return {subtotal,discount,shipping,gift,total:subtotal-discount+shipping+gift,coupon,method,freeRemaining:Math.max(0,600-subtotal+discount)};
 };
 const validateAddress=(address,shipping='standard')=>{
  const a=address&&typeof address==='object'?address:{};const errors=[];
  if(typeof a.name!=='string'||a.name.trim().length<2||a.name.length>80)errors.push('name');
  if(typeof a.email!=='string'||a.email.length>120||!/^\S+@\S+\.\S+$/.test(a.email))errors.push('email');
  if(typeof a.phone!=='string'||!/^\+?[\d\s()-]{9,20}$/.test(a.phone)||a.phone.replace(/\D/g,'').length<9||a.phone.replace(/\D/g,'').length>15)errors.push('phone');
  if(shipping!=='pickup'){
   if(typeof a.city!=='string'||a.city.trim().length<2||a.city.length>80)errors.push('city');
   if(typeof a.street!=='string'||a.street.trim().length<3||a.street.length>120)errors.push('street');
  }return errors;
 };
 return Object.freeze({product,key,stock,validLine,sanitizeCart,add,update,count,total,couponCode,validCoupon,quote,validateAddress});
})();
