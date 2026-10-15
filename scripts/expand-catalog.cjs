// One-time catalog migration; all products are fictional MOVA demo designs.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),scope={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'dist/catalog.js'),'utf8'),scope);
const catalog=JSON.parse(JSON.stringify(scope.window.MOVA_CATALOG));
const components=require('../data/product-components.cjs');
const spinLayouts=require('../data/spin-layouts.json');
catalog.products=catalog.products.filter(p=>['move','focus','carry'].includes(p.id));
const l=(he,en,ar)=>({he,en,ar});
const colors={
 cream:{id:'cream',hex:'#e8dfca',filter:'saturate(.15) brightness(1.08)',label:l('אבן','Stone','حجري')},
 sage:{id:'sage',hex:'#72866d',filter:'hue-rotate(55deg) saturate(.55)',label:l('מרווה','Sage','مريمي')},
 clay:{id:'clay',hex:'#bf6846',filter:'none',label:l('טרקוטה','Terracotta','طيني')},
 green:{id:'green',hex:'#29483a',filter:'none',label:l('ירוק יער','Forest','أخضر غابة')},
 sand:{id:'sand',hex:'#d9c4a0',filter:'none',label:l('חול','Sand','رملي')},
 charcoal:{id:'charcoal',hex:'#353d36',filter:'saturate(.1) brightness(.62)',label:l('פחם','Charcoal','فحمي')}
};
const shoeSizes=['36','37','38','39','40','41','42','43','44','45'];
const one=['ONE SIZE'],clothes=['XS','S','M','L','XL','XXL'];
const rows=[
 ['pace','PACE 04','footwear',390,490,'#e8eadd','THE DAILY CLASSIC',l('סניקרס נקיות, יום פתוח','Clean lines. Open plans.','خطوط هادئة، يوم مفتوح'),l('סילואט נמוך בקרם, פרט ירוק וסוליית גומי בגוון חם.','A low cream silhouette, a green accent and a warm gum sole.','تصميم منخفض كريمي، لمسة خضراء ونعل بلون دافئ.'),['sand','sage','charcoal'],shoeSizes,'40',l('דמוי עור / סוליית גומי','Leather-look / gum sole','مظهر جلدي / نعل مطاطي')],
 ['slide','SLIDE 05','footwear',190,null,'#f1dfd4','OFF DUTY',l('לתת ליום לזרום','Make room for slow days','مساحة لأيام هادئة'),l('כפכף פיסולי עם רצועה רחבה, קווים רכים וגוון טרקוטה.','A sculpted slide with a broad strap, soft lines and a terracotta finish.','صندل منحوت بحزام عريض وخطوط ناعمة بلون طيني.'),['clay','cream','sage'],['36–37','38–39','40–41','42–43','44–45'],'40–41',l('מבנה יצוק','Molded construction','تصميم مصبوب')],
 ['pulse','PULSE 06','audio',320,390,'#eee5d9','SMALL OBJECT. BIG MOOD.',l('רגע של מוזיקה בכיס','A little music in your pocket','لحظة موسيقى في جيبك'),l('אוזניות זעירות בקייס עגול. שילוב של שנהב וטרקוטה.','Compact earbuds in a rounded case, pairing ivory with terracotta.','سماعات صغيرة في علبة مستديرة تجمع العاجي بالطيني.'),['clay','cream','sage'],one,'ONE SIZE',l('קייס קומפקטי / גימור מט','Compact case / matte finish','علبة صغيرة / تشطيب مطفي')],
 ['echo','ECHO 07','audio',240,null,'#e2e7db','SET THE ATMOSPHERE',l('הפסקול הולך איתך','Bring your own atmosphere','خذ أجواءك معك'),l('רמקול ירוק קומפקטי בטקסטורה ארוגה עם לולאת נשיאה בהירה.','A compact green speaker with a woven texture and a pale carry loop.','مكبر أخضر صغير بنسيج منسوج وحلقة حمل فاتحة.'),['green','clay','charcoal'],one,'ONE SIZE',l('מעטפת ארוגה / לולאת נשיאה','Woven shell / carry loop','غلاف منسوج / حلقة حمل')],
 ['roam','ROAM 08','bags',420,520,'#e5e7dc','WEEKEND STATE OF MIND',l('סוף השבוע מתחיל כאן','The weekend starts here','عطلة الأسبوع تبدأ هنا'),l('תיק סוף שבוע רך בירוק יער, רצועות שמנת ופרטי טרקוטה.','A soft forest-green weekender with cream straps and terracotta details.','حقيبة عطلة ناعمة بلون الغابة وأحزمة كريمية وتفاصيل طينية.'),['green','sand','charcoal'],['COMPACT','WEEKENDER'],'WEEKENDER',l('אריג ניילון / רצועה מתכווננת','Nylon weave / adjustable strap','نسيج نايلون / حزام قابل للتعديل')],
 ['orbit','ORBIT 09','bags',260,null,'#eee5d9','HANDS FREE. MIND OPEN.',l('לקחת רק מה שצריך','Only what you need','فقط ما تحتاجه'),l('תיק צד בצורת חצי ירח, בגוון חול עם רצועת טרקוטה.','A sand crescent crossbody with a terracotta strap.','حقيبة كتف هلالية رملية بحزام طيني.'),['sand','sage','charcoal'],one,'ONE SIZE',l('דמוי עור / רצועת צד','Leather-look / crossbody strap','مظهر جلدي / حزام كتف')],
 ['form','FORM 10','apparel',280,350,'#e5e8dc','ROOM TO BE YOURSELF',l('השכבה שתמיד חוזרים אליה','Your everyday layer','طبقتك اليومية'),l('קפוצ׳ון אוברסייז בגוון מרווה עם כיס קדמי וקפוצ׳ון נדיב.','An oversized sage hoodie with a kangaroo pocket and generous hood.','هودي واسع بلون مريمي وجيب أمامي وغطاء رأس كبير.'),['sage','cream','charcoal'],clothes,'M',l('מראה כותנה עבה / גזרת אוברסייז','Heavy cotton look / oversized fit','مظهر قطني سميك / قصة واسعة')],
 ['shell','SHELL 11','apparel',360,null,'#eedfd3','CHANGE OF WEATHER',l('לצאת, גם בלי תכנית','Step out without a plan','انطلق دون خطة'),l('ג׳קט קל בטרקוטה ושמנת, עם רוכסן מלא וצווארון עומד.','A lightweight terracotta and cream jacket, full zip and stand collar.','سترة خفيفة طينية وكريمية بسحاب كامل وياقة قائمة.'),['clay','sage','charcoal'],clothes,'M',l('אריג קל / גזרה רגועה','Lightweight weave / relaxed fit','نسيج خفيف / قصة مريحة')],
 ['loop','LOOP 12','accessories',120,null,'#eee8da','A SMALL DAILY RITUAL',l('עצירה קטנה באמצע היום','A small daily ritual','طقس يومي صغير'),l('בקבוק שנהב, פקק טרקוטה ולולאת נשיאה ירוקה. אובייקט קטן עם אופי.','An ivory bottle, terracotta cap and green carry loop. A small object with character.','زجاجة عاجية بغطاء طيني وحلقة حمل خضراء. قطعة صغيرة بشخصية.'),['sand','sage','charcoal'],['500 ML','750 ML'],'500 ML',l('מראה מתכת / לולאת סיליקון','Metal finish / silicone loop','تشطيب معدني / حلقة سيليكون')]
];
for(const [id,code,category,price,compareAt,surface,badge,title,description,cs,sizes,defaultSize,material] of rows){
 catalog.products.push({id,code,category,price,compareAt,surface,badge,title,description,colors:cs.map((c,i)=>({...colors[c],filter:i===0?'none':colors[c].filter==='none'?'hue-rotate(45deg) saturate(.6)':colors[c].filter})),sizes,defaultSize,material,image:`assets/${id}.webp`,details:l('עיצוב מקורי להדגמת חנות MOVA. התמונות, המידות, הזמינות והמחירים מיועדים להתנסות; אינם מפרט של מוצר למכירה.','An original MOVA concept design. Images, sizes, availability and prices are for exploring this demo; they are not a real product specification.','تصميم أصلي لعرض متجر MOVA. الصور والمقاسات والتوفر والأسعار للتجربة وليست مواصفات منتج للبيع.')});
}
const materials={move:l('סריג / פאנלים מפוסלים','Knit / sculpted panels','نسيج / ألواح منحوتة'),focus:l('קשת מרופדת / גימור מט','Padded band / matte finish','طوق مبطن / تشطيب مطفي'),carry:l('אריג טקסטורלי / רצועות נשיאה','Textured weave / carry straps','نسيج بارز / أحزمة حمل')};
catalog.products.forEach((p,i)=>{
 p.components=components[p.id];p.detailImage=`assets/detail/${p.id}.webp`;
 p.spin={src:`assets/spin/${p.id}.webp`,columns:4,rows:3,frames:12,bounds:{x:spinLayouts[p.id].x,y:spinLayouts[p.id].y},framing:spinLayouts[p.id].framing};
 p.material??=materials[p.id];p.new=i>=6;p.featured=i;
 p.inventory={};for(const [j,c] of p.colors.entries())p.inventory[c.id]=Object.fromEntries(p.sizes.map((s,k)=>[s,p.sizes.length>2&&k===p.sizes.length-1?0:Math.min(10,3+(i+j+k)%8)]));
});
// One sold-out design and one unavailable finish demonstrate real stock handling.
for(const variants of Object.values(catalog.products.find(p=>p.id==='echo').inventory))for(const size of Object.keys(variants))variants[size]=0;
for(const size of catalog.products.find(p=>p.id==='form').sizes)catalog.products.find(p=>p.id==='form').inventory.charcoal[size]=0;
fs.writeFileSync(path.join(root,'dist/catalog.js'),'/* Original MOVA concept catalog. All inventory and prices are demo data. */\nwindow.MOVA_CATALOG = Object.freeze('+JSON.stringify(catalog,null,2)+');\n');
