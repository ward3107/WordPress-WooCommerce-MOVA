import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from '../dist/assets/vendor/three.module.js';
import {GLTFLoader} from '../dist/assets/vendor/GLTFLoader.js';
import {optimizeLayers,placeLayer} from '../dist/shoe-viewer.js';
const bytes=fs.readFileSync(new URL('../dist/assets/move-solid-v4.glb',import.meta.url));
const array=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
// CPU-only geometry verification: image pixels are inspected in asset renders.
// A texture placeholder lets the real GLTF parser verify the embedded geometry
// without introducing a browser or an unsupported website preview path.
const loader=new GLTFLoader();loader.register(()=>({name:'MOVA_CPU_TEXTURE',loadTexture:()=>Promise.resolve(new THREE.Texture())}));
const asset=await new Promise((resolve,reject)=>loader.parse(array,'',resolve,reject));
const root=asset.scene.getObjectByName('HERO_MOVE');assert.ok(root);
const count=object=>{let n=0;object.traverse(o=>{if(o.isMesh)n++;});return n;};
const names=['UPPER','INSOLE','CAGE','MIDSOLE','OUTSOLE'];
names.forEach(key=>assert.ok(root.getObjectByName('LAYER_'+key)));
const before=new THREE.Box3().setFromObject(root),dimensions=before.getSize(new THREE.Vector3());
assert.ok(dimensions.x>.27&&dimensions.x<.31,'Original metre dimensions are plausible');
assert.ok(dimensions.y>.13&&dimensions.y<.20,'Chunky silhouette and raised tongue are retained');
assert.ok(dimensions.z>.08&&dimensions.z<.13);
const originalCount=count(root);root.removeFromParent();optimizeLayers(root);
const optimizedCount=count(root);assert.ok(optimizedCount<25,'Batched mobile draw call budget');
assert.ok(optimizedCount<originalCount/3);
assert.ok(root.getObjectByName('UPPER_knit_shell').userData.shell,'Shell remains independently addressable');
const shell=root.getObjectByName('UPPER_knit_shell');
assert.ok(shell.material.map,'A fabric material remains attached to the shell');
assert.ok(shell.material.normalMap,'The repeating fabric has a normal map');
assert.equal(shell.material.name,'M_KNIT_cream');
assert.ok(shell.isMesh&&shell.material.isMeshStandardMaterial,'Standard lit material; no photograph shader');
const uv=shell.geometry.attributes.uv;let maxU=0,maxV=0;
for(let i=0;i<uv.count;i++){maxU=Math.max(maxU,uv.getX(i));maxV=Math.max(maxV,uv.getY(i));}
assert.ok(maxU>10&&maxV>5,'Local repeating fabric UVs replace the projected whole-shoe photo');
const neckRay=new THREE.Raycaster(new THREE.Vector3(.83*.095,.30,0),new THREE.Vector3(0,-1,0));
root.updateMatrixWorld(true);
assert.equal(neckRay.intersectObject(root.getObjectByName('LAYER_UPPER'),true).length,0,'The collar has a real opening');
assert.ok(neckRay.intersectObject(root.getObjectByName('LAYER_INSOLE'),true).length>0,'A real insole sits below the opening');
const after=new THREE.Box3().setFromObject(root);
assert.ok(before.min.distanceTo(after.min)<1e-5&&before.max.distanceTo(after.max)<1e-5,'Batching preserves geometry');
const model=new THREE.Group();model.add(root);root.position.sub(before.getCenter(new THREE.Vector3()));model.scale.setScalar(3.1/dimensions.x);model.updateMatrixWorld(true);
const parts=names.map(key=>{const node=root.getObjectByName('LAYER_'+key);return {node,key,baseWorld:node.getWorldPosition(new THREE.Vector3())};});
const expected={UPPER:1.18,INSOLE:.48,CAGE:-.04,MIDSOLE:-.55,OUTSOLE:-1.08};
for(const p of parts){placeLayer(p,1);model.updateMatrixWorld(true);const current=p.node.getWorldPosition(new THREE.Vector3());assert.ok(Math.abs(current.y-p.baseWorld.y-expected[p.key])<1e-5);assert.ok(Math.abs(current.x-p.baseWorld.x)<1e-5);assert.ok(Math.abs(current.z-p.baseWorld.z)<1e-5);}
// Adjacent exploded layers must be visibly separated in the delivery axis.
const bounds=parts.map(p=>new THREE.Box3().setFromObject(p.node));
for(let i=0;i<bounds.length-1;i++)assert.ok(bounds[i].min.y>bounds[i+1].max.y+.035,'Separated layer order: '+names[i]);
for(const p of parts){placeLayer(p,0);model.updateMatrixWorld(true);assert.ok(p.node.getWorldPosition(new THREE.Vector3()).distanceTo(p.baseWorld)<1e-5,'Exact assembly restoration');}
root.traverse(o=>{if(o.isMesh){assert.ok(o.geometry.attributes.position.count>0);for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v),'Finite geometry coordinates');}});
console.log(`PASS: real GLB, open collar/insole, local fabric UVs and normal map, five layers, metre scale, batching ${originalCount} → ${optimizedCount}, separation, exact reassembly and finite geometry`);
