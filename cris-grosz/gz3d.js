/* ============================================================
   CRIS GROSZ × MORASHOP — visor 3D en vivo (Three.js vanilla)
   Botes 3D reales · escala real · frente en reposo · drag 360 ·
   idle · fondo de color por producto · sombra de contacto ·
   flechas + puntitos + transiciones. Estilo ciaoenergy.
   ============================================================ */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = id => document.getElementById(id);
const STAGE=$('gz3d-stage'), CANVAS=$('gz3d-canvas'), SECTION=$('linea');
const BG=$('gz3d-bg'), CAPNAME=$('gz3d-name'), CAPTAG=$('gz3d-tag'), CAPBEN=$('gz3d-benefit');
const DOTS=$('gz3d-dots'), HINT=$('gz3d-hint'), PREV=$('gz3d-prev'), NEXT=$('gz3d-next');
const NOW=$('gz3d-now'), WAS=$('gz3d-was'), CUO=$('gz3d-cuotas'), OFF=$('gz3d-off');
const ARS = n => "$" + Math.round(n).toLocaleString("es-AR");
if (STAGE && CANVAS && SECTION) init();

function init(){
  const PRODUCTS = [
    { slug:'whey-vainilla', name:'Whey Protein Vainilla', tag:'Proteína',    ben:'86% proteína · 30 servicios', c:'#2b4fd6', precio:39999, off:33 },
    { slug:'whey-cacao',    name:'Whey Protein Cacao',    tag:'Proteína',    ben:'Isolate + Concentrate + Hydro', c:'#f5820a', precio:47999, off:0 },
    { slug:'pre-nox-pump',  name:'Pre Nox Pump',          tag:'Pre-entreno', ben:'Energía + beta-alanina',       c:'#1f5fe0', precio:24999, off:36 },
    { slug:'colageno',      name:'Colágeno Hidrolizado',  tag:'Articular',   ben:'+ Vitamina C',                 c:'#f5820a', precio:27900, off:31 },
    { slug:'vitamina-c',    name:'Vitamina C',            tag:'Bienestar',   ben:'Ácido ascórbico · defensas',   c:'#f39215', precio:15900, off:20 },
    { slug:'creatina',      name:'Creatina Micronizada',  tag:'Creatina',    ben:'100% pura · 5g por toma',      c:'#2b4fd6', precio:24900, off:38 },
    { slug:'glutamina',     name:'Glutamina',             tag:'Recuperación',ben:'Micronizada',                  c:'#2b4fd6', precio:20900, off:24 },
    { slug:'bcaa',          name:'BCAA 12:1:1',           tag:'Aminoácidos', ben:'Ratio 12:1:1',                 c:'#3a49c8', precio:19900, off:28 },
    { slug:'magnesio',      name:'Citrato de Magnesio',   tag:'Recuperación',ben:'Función muscular',             c:'#2b4fd6', precio:20900, off:24 },
    { slug:'omega-3',       name:'Omega 3',               tag:'Bienestar',   ben:'Aceite de pescado',            c:'#f5820a', precio:18900, off:22 },
    { slug:'burn-max',      name:'Burn Max',              tag:'Termogénico', ben:'Cafeína + guaraná + té verde', c:'#f16d0a', precio:26999, off:30 },
  ];
  const N = PRODUCTS.length;

  const renderer = new THREE.WebGLRenderer({ canvas:CANVAS, antialias:true, alpha:true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  camera.position.set(0, 0, 0.72);

  // luz pareja
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa6b8, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-0.5,0.8,0.9); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8); rim.position.set(0.3,0.5,-0.9); scene.add(rim);

  // sombra de contacto (plano con textura radial)
  const shadow = (()=>{
    const c=document.createElement('canvas'); c.width=c.height=256; const x=c.getContext('2d');
    const g=x.createRadialGradient(128,128,10,128,128,120); g.addColorStop(0,'rgba(0,0,0,.42)'); g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g; x.fillRect(0,0,256,256);
    const tex=new THREE.CanvasTexture(c);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.42), new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));
    m.rotation.x=-Math.PI/2; m.position.y=-0.14; scene.add(m); return m;
  })();

  const pivot = new THREE.Group(); scene.add(pivot);
  const DISPLAY_TALL = 0.31; let commonK = null;
  const models = new Array(N).fill(null);
  const heights = new Array(N).fill(0.27);
  let current = -1;

  const draco = new DRACOLoader(); draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);

  function place(wrap, obj, i){
    const box=new THREE.Box3().setFromObject(obj), size=new THREE.Vector3(), center=new THREE.Vector3();
    box.getSize(size); box.getCenter(center);
    if (commonK===null) commonK = DISPLAY_TALL/(size.y||1);
    const K=commonK; obj.scale.setScalar(K);
    obj.position.set(-center.x*K, -center.y*K, -center.z*K);
    heights[i]=size.y*K;
  }
  function loadOne(i){
    loader.load('assets/3d/'+PRODUCTS[i].slug+'.glb', g=>{
      const o=g.scene;
      o.traverse(n=>{ if(n.isMesh){ n.frustumCulled=false; if(n.material) n.material.envMapIntensity=0.9; } });
      const wrap=new THREE.Group(); wrap.add(o); place(wrap,o,i);
      wrap.visible=false; pivot.add(wrap); models[i]=wrap;
      STAGE.classList.add('is-ready');
      // si este es el producto activo (o el 1ro), mostrarlo ya
      if (i===current || current===-1){
        current = (current===-1)?i:current;
        if (i===current){ wrap.visible=true; swapT=1;
          shadow.position.y=-heights[i]/2-0.004;
          wrap.traverse(n=>{ if(n.isMesh&&n.material){ n.material.opacity=1; } }); }
      }
    }, undefined, e=>console.warn('GLB fail', PRODUCTS[i].slug, e));
  }
  loadOne(0);
  let li=1; const drip=()=>{ if(li<N){ loadOne(li++); setTimeout(drip,110); } }; setTimeout(drip,250);

  let swapT=1; // 0..1 progreso de transición de entrada
  function show(i, instant){
    i=Math.max(0,Math.min(N-1,i)); if(i===current) return;
    if (models[current]) models[current].visible=false;
    current=i;
    const w=models[current]; if(w){ w.visible=true; }
    shadow.position.y = -heights[i]/2 - 0.004;
    swapT = instant?1:0;
    const p=PRODUCTS[i];
    if (CAPNAME) CAPNAME.textContent=p.name;
    if (CAPTAG)  CAPTAG.textContent=p.tag;
    if (CAPBEN)  CAPBEN.textContent=p.ben;
    if (BG) BG.style.setProperty('--gc', p.c);
    if (DOTS) [...DOTS.children].forEach((d,k)=>d.classList.toggle('on',k===i));
    // precio / OFF / cuotas
    const was = p.off ? Math.round(p.precio/(1-p.off/100)) : 0;
    if (NOW) NOW.textContent = ARS(p.precio);
    if (WAS) WAS.textContent = was ? ARS(was) : "";
    if (CUO) CUO.textContent = "3 cuotas sin interés de " + ARS(p.precio/3);
    if (OFF){ OFF.textContent = p.off ? p.off+"% OFF" : ""; OFF.style.display = p.off ? "" : "none"; }
  }

  // dots clickeables + flechas
  if (DOTS){ DOTS.innerHTML=PRODUCTS.map((p,k)=>'<button aria-label="'+p.name+'"></button>').join('');
    [...DOTS.children].forEach((b,k)=> b.addEventListener('click',()=>scrollToProduct(k))); }
  function scrollToProduct(i){
    const top=SECTION.offsetTop, total=SECTION.offsetHeight-innerHeight;
    if (total<=0) return;
    scrollTo({ top: top + ((i+0.5)/N)*total, behavior:'smooth' });
  }
  if (PREV) PREV.addEventListener('click',()=>scrollToProduct((current-1+N)%N));
  if (NEXT) NEXT.addEventListener('click',()=>scrollToProduct((current+1)%N));

  function resize(){ const r=STAGE.getBoundingClientRect(), w=Math.max(1,r.width), h=Math.max(1,r.height);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(STAGE); resize();

  // scroll -> producto (rotación queda de frente + idle + drag)
  function progress(){ const r=SECTION.getBoundingClientRect(), total=r.height-innerHeight;
    return total<=0?0:Math.max(0,Math.min(1,-r.top/total)); }
  function onScroll(){ show(Math.min(N-1, Math.floor(progress()*N))); }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', ()=>{resize();onScroll();}, {passive:true});

  // drag 360
  let dragRot=0, dragging=false, lastX=0, interacted=false, vel=0;
  function down(x){ dragging=true; lastX=x; vel=0; if(!interacted){interacted=true; HINT&&HINT.classList.add('gone');} }
  function move(x){ if(!dragging) return; const dx=(x-lastX); dragRot+=dx*0.011; vel=dx*0.011; lastX=x; }
  function up(){ dragging=false; }
  CANVAS.addEventListener('pointerdown', e=>{ down(e.clientX); try{CANVAS.setPointerCapture(e.pointerId);}catch(_){} });
  CANVAS.addEventListener('pointermove', e=>move(e.clientX));
  addEventListener('pointerup', up);

  let running=false;
  const io=new IntersectionObserver(es=>{ running=es[0].isIntersecting; if(running) loop(); },{rootMargin:'120px'});
  io.observe(SECTION); onScroll();

  const clock=new THREE.Clock(); let last=0;
  function loop(){
    if(!running) return; requestAnimationFrame(loop);
    const t=clock.getElapsedTime(); const dt=Math.min(0.05,t-last); last=t;
    if(!dragging){ dragRot += vel; vel*=0.94; if(Math.abs(vel)<0.0002) vel=0; }
    const idle = interacted ? 0 : Math.sin(t*0.5)*0.32;   // sway suave hasta que interactúa
    pivot.rotation.y = dragRot + idle;                     // 0 = frente a cámara
    pivot.position.y = Math.sin(t*1.0)*0.004;
    // transición de entrada (fade + escala) del bote activo
    if(swapT<1){ swapT=Math.min(1,swapT+dt*3.2); const w=models[current];
      if(w){ const e=1-Math.pow(1-swapT,3); w.scale.setScalar(0.82+0.18*e);
        w.traverse(n=>{ if(n.isMesh&&n.material){ n.material.transparent=true; n.material.opacity=e; } }); } }
    renderer.render(scene,camera);
  }
}
