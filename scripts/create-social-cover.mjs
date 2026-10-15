import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp'));
const root=path.resolve(import.meta.dirname,'..');
const assets=path.join(root,'dist/assets');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f7f5ee"/>
<circle cx="965" cy="330" r="295" fill="#f7c1a1"/>
<circle cx="965" cy="330" r="275" fill="none" stroke="#bd7749" stroke-opacity=".25"/>
<g font-family="DejaVu Sans,Arial,sans-serif" fill="#1d2822">
<text x="62" y="114" font-size="70" font-weight="bold" letter-spacing="-6">mova</text>
<text x="262" y="76" font-size="15">®</text>
<text x="67" y="169" font-size="10" font-weight="bold" letter-spacing="3">OBJECTS IN MOTION / THE EVERYDAY EDIT</text>
<text x="62" y="265" font-size="73" font-weight="bold" letter-spacing="-4">GOOD STYLE.</text>
<text x="62" y="351" font-size="73" font-weight="bold" letter-spacing="-4" fill="#d44117">IN MOTION.</text>
<text x="66" y="405" font-size="16" fill="#666b60">A store that feels a little different.</text>
<rect x="64" y="454" width="294" height="62" rx="31" fill="#1d2822"/>
<text x="92" y="491" font-size="13" font-weight="bold" fill="#fffefa">ENTER THE CONCEPT</text>
<circle cx="321" cy="485" r="23" fill="#d7ef73"/>
<text x="307" y="493" font-size="27">↗</text>
<text x="66" y="589" font-size="9" letter-spacing="2">CONCEPT STORE / MADE TO STAND OUT</text>
</g></svg>`;
const shoe=await sharp(path.join(assets,'sneaker.webp')).resize(690,690).extract({left:0,top:0,width:690,height:630}).toBuffer();
await sharp(Buffer.from(svg)).composite([{input:shoe,left:506,top:0}]).jpeg({quality:91,mozjpeg:true}).toFile(path.join(assets,'social-cover.jpg'));
console.log('Social cover created:',fs.statSync(path.join(assets,'social-cover.jpg')).size,'bytes');
