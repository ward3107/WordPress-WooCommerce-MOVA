import * as THREE from './assets/vendor/three.module.js';
import {GLTFLoader} from './assets/vendor/GLTFLoader.js';
import {OrbitControls} from './assets/vendor/OrbitControls.js';
import {RoomEnvironment} from './assets/vendor/RoomEnvironment.js';
import {mergeGeometries} from './assets/vendor/BufferGeometryUtils.js';

const PARTS=['UPPER','INSOLE','CAGE','MIDSOLE','OUTSOLE'];
const OFFSETS={UPPER:1.5,INSOLE:.6,CAGE:.03,MIDSOLE:-.7,OUTSOLE:-1.42};
const BASE_COLORS={KNIT:'#e4decc',PANEL:'#ded6c4',FOAM:'#e9e1ce',RUBBER:'#30312f',ACCENT:'#b94a22',LINING:'#9c907a',CAGE:'#a9bd72',LACES:'#eee8d5'};

export function placeLayer(part,progress){
  const world=part.baseWorld.clone();world.y+=OFFSETS[part.key]*progress;
  part.node.position.copy(part.node.parent.worldToLocal(world));
}

function softShadowTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
  const gradient=ctx.createRadialGradient(64,64,7,64,64,64);gradient.addColorStop(0,'rgba(35,46,35,.15)');gradient.addColorStop(.55,'rgba(35,46,35,.065)');gradient.addColorStop(1,'rgba(35,46,35,0)');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);
}

/* Preserve the named layer hierarchy while batching repeated lace/lattice meshes.
 * Knit shell stays distinct because the skeleton view draws only its wireframe.
 */
export function optimizeLayers(root){
  root.updateMatrixWorld(true);
  for(const key of PARTS){
    const layer=root.getObjectByName('LAYER_'+key);if(!layer)throw new Error('Missing model layer '+key);
    const buckets=new Map(),meshes=[];layer.traverse(o=>{if(o.isMesh)meshes.push(o);});
    const inverse=layer.matrixWorld.clone().invert();
    for(const mesh of meshes){
      if(Array.isArray(mesh.material))continue;
      const shell=mesh.name==='UPPER_knit_shell';
      const id=mesh.material.uuid+'_'+shell;
      if(!buckets.has(id))buckets.set(id,{material:mesh.material,geometries:[],meshes:[],shell});
      const b=buckets.get(id),g=mesh.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));
      for(const attr of Object.keys(g.attributes))if(!['position','normal','uv'].includes(attr))g.deleteAttribute(attr);
      if(!g.attributes.normal)g.computeVertexNormals();
      if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
      if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
      b.geometries.push(g);b.meshes.push(mesh);
    }
    for(const b of buckets.values()){
      const geometry=mergeGeometries(b.geometries,false);if(!geometry)continue;
      const merged=new THREE.Mesh(geometry,b.material.clone());merged.name=b.shell?'UPPER_knit_shell':key+'_'+b.material.name;merged.castShadow=true;merged.receiveShadow=true;
      merged.userData.shell=b.shell;layer.add(merged);
      b.meshes.forEach(mesh=>{mesh.removeFromParent();mesh.geometry.dispose();});b.geometries.forEach(g=>g.dispose());
    }
  }
  return root;
}

export function configureShoeControls(camera,element){
  const controls=new OrbitControls(camera,element);
  controls.target.set(0,.02,0);controls.enablePan=true;controls.enableZoom=true;controls.minZoom=.7;controls.maxZoom=12;controls.zoomSpeed=.8;
  controls.touches.ONE=THREE.TOUCH.ROTATE;controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
  controls.enableDamping=true;controls.dampingFactor=.13;controls.rotateSpeed=.68;controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI-.12;controls.autoRotateSpeed=.7;
  return controls;
}

export function createShoeTapRecognizer(onTap,now=()=>performance.now()){
  let down=null,multiTouch=false;const active=new Set();
  return {
    down(event){active.add(event.pointerId);if(active.size===1){multiTouch=false;down={id:event.pointerId,x:event.clientX,y:event.clientY,time:now()};}else{multiTouch=true;down=null;}},
    up(event){active.delete(event.pointerId);if(!multiTouch&&down?.id===event.pointerId&&Math.hypot(event.clientX-down.x,event.clientY-down.y)<6&&now()-down.time<450)onTap(event);down=null;if(!active.size)multiTouch=false;},
    cancel(event){active.delete(event.pointerId);down=null;if(!active.size)multiTouch=false;}
  };
}

export async function createShoeViewer({mount,onTap,onAutoStop,onReset,onZoom,onZoomChange,onContextLost}){
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-3,3,2,-2,.1,50);camera.position.set(-5.51,2.78,7.87);
  const controls=configureShoeControls(camera,renderer.domElement);
  // The 3D area owns pinch/drag gestures; surrounding content scrolls normally.
  renderer.domElement.style.touchAction='none';renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-describedby','shoeKeyboardHelp');
  mount.appendChild(renderer.domElement);
  const hemi=new THREE.HemisphereLight(0xfff8ed,0x939788,1.05);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xfff8ed,2.6);key.position.set(-3.5,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=key.shadow.camera.bottom=-3.5;key.shadow.camera.right=key.shadow.camera.top=3.5;key.shadow.bias=-.0003;key.shadow.normalBias=.008;key.shadow.radius=3;scene.add(key);
  const rim=new THREE.DirectionalLight(0xe1ebff,1.2);rim.position.set(2,3,-3);scene.add(rim);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);
  scene.environment=env.texture;room.dispose();pmrem.dispose();
  let asset;
  try{asset=await new GLTFLoader().loadAsync(new URL('./assets/move-anatomy-v5.glb',import.meta.url).href);}catch(error){renderer.dispose();env.dispose();renderer.domElement.remove();throw error;}
  const root=asset.scene.getObjectByName('HERO_MOVE');
  if(!root){renderer.dispose();renderer.domElement.remove();throw new Error('Invalid MOVE assembly');}
  const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  root.removeFromParent();optimizeLayers(root);
  const model=new THREE.Group();scene.add(model);model.add(root);root.position.sub(center);model.scale.setScalar(3.1/size.x);model.updateMatrixWorld(true);
  const parts=PARTS.map((key,index)=>{
    const node=root.getObjectByName('LAYER_'+key),baseWorld=node.getWorldPosition(new THREE.Vector3()),materials=[];
    node.traverse(mesh=>{
      if(!mesh.isMesh)return;mesh.castShadow=true;mesh.receiveShadow=true;
      for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
        const role=Object.keys(BASE_COLORS).find(role=>m.name.includes('M_'+role));if(role)m.color.set(BASE_COLORS[role]);
        if(m.map){m.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());if(role==='KNIT')m.color.set(0xffffff);}
        m.userData.baseMap=m.map||null;
        m.side=THREE.DoubleSide;if(m.isMeshStandardMaterial){m.envMapIntensity=.45;m.roughness=Math.max(.65,m.roughness);}m.userData.baseColor=m.color.clone();
        materials.push({material:m,shell:mesh.userData.shell===true,mesh});
      }
    });
    return {key,index,node,baseWorld,materials,progress:0};
  });
  const footbox=new THREE.Box3().setFromObject(model);
  const shadow=softShadowTexture();
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(3.65,1.55),new THREE.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=footbox.min.y-.075;scene.add(floor);
  const initialPosition=camera.position.clone(),initialTarget=controls.target.clone();
  let ui={explosion:0,skeleton:false,auto:false,selected:null,variant:'orange',zoom:1,reduced:false},visible=true,frame=0,last=performance.now(),disposed=false,dirty=true,lastMaterials='';
  let width=1,height=1,viewHeight=3;
  function fitCamera(progress){
    const aspect=width/height;
    viewHeight=Math.max(2.7,3.4/aspect)+(Math.max(5.4,3.4/aspect)-Math.max(2.7,3.4/aspect))*progress;
    camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.zoom=ui.zoom;camera.updateProjectionMatrix();
  }
  function resize(){const r=mount.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);renderer.setSize(width,height,false);fitCamera(ui.explosion/100);dirty=true;requestFrame();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(mount);
  function updateMaterials(){
    const signature=[ui.skeleton,ui.selected,ui.variant].join(':');if(signature===lastMaterials)return;lastMaterials=signature;
    for(const part of parts){for(const {material:m,shell,mesh} of part.materials){
      const selected=!ui.selected||ui.selected===part.key;
      m.color.copy(m.userData.baseColor);if(m.name.includes('M_ACCENT'))m.color.set(ui.variant==='mint'?'#638d6c':BASE_COLORS.ACCENT);
      m.wireframe=ui.skeleton&&shell;
      m.map=m.wireframe?null:m.userData.baseMap;
      if(m.wireframe)m.color.set('#234632');
      let opacity=1;
      if(ui.skeleton&&part.key==='UPPER')opacity=shell ? .8 : .6;
      if(ui.skeleton&&part.key==='MIDSOLE')opacity=.22;
      if(!selected)opacity=Math.min(opacity,.15);
      m.opacity=opacity;m.transparent=opacity<.99;m.depthWrite=opacity>.95;m.needsUpdate=true;mesh.castShadow=opacity>.75;
    }}
  }
  function requestFrame(){if(!frame&&visible&&!disposed&&!document.hidden)frame=requestAnimationFrame(render);}
  function render(now){
    frame=0;if(disposed||!visible||document.hidden)return;
    const dt=Math.min(.06,Math.max(.001,(now-last)/1000));last=now;const target=ui.explosion/100;
    let moving=false;
    for(const part of parts){
      const delta=target-part.progress;
      part.progress=ui.reduced?target:Math.abs(delta)<.0006?target:part.progress+delta*(1-Math.exp(-dt*(7.5-part.index*.45)));
      if(Math.abs(target-part.progress)>.0006)moving=true;
      placeLayer(part,part.progress);
    }
    fitCamera(parts[0].progress);floor.position.y=footbox.min.y-.075-1.42*parts[4].progress;
    controls.autoRotate=ui.auto&&!ui.reduced;const orbitChanged=controls.update(dt);renderer.render(scene,camera);dirty=false;
    if(moving||controls.autoRotate||orbitChanged)requestFrame();
  }
  controls.addEventListener('change',()=>{if(Math.abs(camera.zoom-ui.zoom)>.00001){ui.zoom=camera.zoom;onZoomChange?.(camera.zoom);}requestFrame();});
  controls.addEventListener('start',()=>{if(ui.auto)onAutoStop?.();requestFrame();});
  const taps=createShoeTapRecognizer(event=>{
    const r=renderer.domElement.getBoundingClientRect(),point=new THREE.Vector2((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(point,camera);
    if(ray.intersectObject(model,true).length)onTap?.();
  });
  renderer.domElement.addEventListener('pointerdown',taps.down,{passive:true});
  renderer.domElement.addEventListener('pointerup',taps.up,{passive:true});
  renderer.domElement.addEventListener('pointercancel',taps.cancel);
  renderer.domElement.addEventListener('keydown',event=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
      event.preventDefault();onAutoStop?.();const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if(event.key==='ArrowLeft')s.theta-=.16;if(event.key==='ArrowRight')s.theta+=.16;if(event.key==='ArrowUp')s.phi-=.12;if(event.key==='ArrowDown')s.phi+=.12;
      s.phi=Math.max(.12,Math.min(Math.PI-.12,s.phi));camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(controls.target));controls.update();requestFrame();
    }
    if(['Enter',' '].includes(event.key)){event.preventDefault();onTap?.();}
    if(event.key==='+'||event.key==='='){event.preventDefault();onZoom?.(1.15);}
    if(event.key==='-'){event.preventDefault();onZoom?.(1/1.15);}
    if(event.key==='Home'){event.preventDefault();onReset?.();}
  });
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();controls.dispose();
    const textures=new Set();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)textures.add(m.map);if(m.normalMap)textures.add(m.normalMap);if(m.userData.baseMap)textures.add(m.userData.baseMap);m.dispose();}});
    textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.domElement.remove();
  }
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();onContextLost?.();},{once:true});
  resize();updateMaterials();controls.update();requestFrame();
  return {
    setState(next){ui={...ui,...next};updateMaterials();dirty=true;requestFrame();},
    setVisible(next){visible=next;if(!visible){cancelAnimationFrame(frame);frame=0;}else{last=performance.now();requestFrame();}},
    setLabel(text){renderer.domElement.setAttribute('aria-label',text);},
    resetCamera(){controls.autoRotate=false;camera.position.copy(initialPosition);controls.target.copy(initialTarget);controls.update();requestFrame();},
    dispose
  };
}
