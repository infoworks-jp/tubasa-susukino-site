import {
  ACESFilmicToneMapping,Color,LinearFilter,Mesh,MeshBasicMaterial,
  PerspectiveCamera,PlaneGeometry,Scene,SRGBColorSpace,TextureLoader,Timer,
  Vector2,WebGLRenderer,
} from 'https://esm.sh/three@0.183.2';

const mobile=matchMedia('(max-width:700px)').matches;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const topStage=document.getElementById('fluidTextStage');
const shopStage=document.querySelector('.shop-photo');
if(!(topStage instanceof HTMLElement))throw new Error('Missing #fluidTextStage');
if(shopStage instanceof HTMLElement){shopStage.classList.add('fluid-effect-stage');shopStage.dataset.slide='assets/store-interior.webp'}

const states={};
const setState=(stage,state)=>{states[stage.id||'shop']=state;window.__tsubasaFluid=states};
const fallback=(stage,reason)=>{stage.classList.add('fluid-unavailable');setState(stage,{engine:'three-fluid-fx-fluid-text',renderer:'static-fallback',pointer:false,touch:false,mobile,reason})};

const commonScene=async(stage)=>{
  const path=mobile&&stage.dataset.mobileSlide?stage.dataset.mobileSlide:stage.dataset.slide;
  const FOV=45,Z=6.4,scene=new Scene(),camera=new PerspectiveCamera(FOV,1,.1,100);
  camera.position.set(0,0,Z);camera.updateMatrixWorld(true);
  const texture=await new TextureLoader().loadAsync(path);
  texture.colorSpace=SRGBColorSpace;texture.minFilter=LinearFilter;texture.magFilter=LinearFilter;
  const material=new MeshBasicMaterial({map:texture,toneMapped:false}),mesh=new Mesh(new PlaneGeometry(1,1),material);
  scene.add(mesh);
  const fit=()=>{const image=texture.image,imageAspect=(image?.naturalWidth||image?.width||1)/(image?.naturalHeight||image?.height||1),viewHeight=2*Z*Math.tan((FOV*Math.PI)/360),viewWidth=viewHeight*camera.aspect,viewAspect=viewWidth/viewHeight;let width=viewWidth,height=viewHeight;if(imageAspect>viewAspect)width=viewHeight*imageAspect;else height=viewWidth/imageAspect;mesh.scale.set(width,height,1)};
  return{scene,camera,texture,material,mesh,fit};
};
const mountCanvas=(stage,renderer)=>{const canvas=renderer.domElement;canvas.className='fluid-text-canvas';if(stage===topStage)canvas.id='fluidTextCanvas';Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',touchAction:'pan-y'});stage.appendChild(canvas);return canvas};

async function initWebGL(stage,{subtle=false}={}){
  if(reduced){fallback(stage,'reduced motion');return}
  let renderer;
  try{
    const [fluidFx,{EffectComposer},{RenderPass},{OutputPass}]=await Promise.all([
      import('https://esm.sh/three-fluid-fx@0.1.0?deps=three@0.183.2'),
      import('https://esm.sh/three@0.183.2/examples/jsm/postprocessing/EffectComposer.js'),
      import('https://esm.sh/three@0.183.2/examples/jsm/postprocessing/RenderPass.js'),
      import('https://esm.sh/three@0.183.2/examples/jsm/postprocessing/OutputPass.js'),
    ]);
    const {ArtInkOverlayPass,FluidSimulation,SimpleDistortionPass,attachPointerSplats}=fluidFx;
    renderer=new WebGLRenderer({alpha:true,antialias:false,powerPreference:'high-performance'});
    renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.setClearColor(new Color('#07080b'),0);
    const canvas=mountCanvas(stage,renderer),{scene,camera,texture,material,mesh,fit}=await commonScene(stage);
    const shop=stage===shopStage;
    const fluid=new FluidSimulation(renderer,{profile:'balanced',splatRadius:mobile?(shop?.00145:(subtle?.00110:.00155)):(subtle?.00072:.00092),splatForce:mobile?(shop?20:(subtle?18:28)):(subtle?7.5:11),pressureIterations:9,curlStrength:.26,velocityDissipation:.99,densityDissipation:.94,pressureDissipation:.8,enableVorticity:false,bfecc:true,reflectWalls:false});
    fluid.enableDye=true;fluid.dyeDissipation=.965;
    const distortion=new SimpleDistortionPass(fluid);distortion.intensity=mobile?(shop?1.8:(subtle?1.15:4.2)):(subtle?.38:1.05);
    const ink=new ArtInkOverlayPass(fluid);
    // Mobile keeps the same WebGL pipeline, but the photographed stage needs
    // a little more readable ink after iPhone compositing. Desktop remains
    // unchanged.
    ink.intensity=mobile?(shop?1.45:(subtle?1.05:2.8)):(subtle?.18:.48);
    ink.vibrance=mobile?(shop?1.1:(subtle?.95:1.3)):(subtle?.28:.52);
    const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(distortion);composer.addPass(ink);composer.addPass(new OutputPass());
    const detach=attachPointerSplats(canvas,fluid,{coloredStrokes:true});
    // three-fluid-fx starts strokes on pointermove.  Mobile needs a genuine
    // fluid splat on the first press as well, not a separate painted circle.
    const pressSplat=(event)=>{const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;const x=(event.clientX-rect.left)/rect.width,y=1-(event.clientY-rect.top)/rect.height;fluid.addSplat(x,y,0,150,{radius:mobile?.00155:.00110,dyeColor:[.78,.88,1]})};
    canvas.addEventListener('pointerdown',pressSplat,{passive:true});
    // iOS 18 Safari can cancel pointermove when a vertical pan begins. Mirror touch
    // coordinates back into pointer events so the library receives splats while pan-y remains allowed.
    let lastTouch=null;
    const bridgeTouch=(event)=>{const t=event.touches?.[0];if(!t)return;const type=lastTouch?'pointermove':'pointerdown';canvas.dispatchEvent(new PointerEvent(type,{clientX:t.clientX,clientY:t.clientY,pointerId:77,pointerType:'touch',isPrimary:true,bubbles:false}));lastTouch={x:t.clientX,y:t.clientY}};
    stage.addEventListener('touchstart',bridgeTouch,{passive:true});
    stage.addEventListener('touchmove',bridgeTouch,{passive:true});
    stage.addEventListener('touchend',()=>{lastTouch=null},{passive:true});
    const resize=()=>{const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.12));renderer.setSize(width,height,false);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();fluid.resize(width,height);fit()};
    resize();addEventListener('resize',resize,{passive:true});visualViewport?.addEventListener('resize',resize,{passive:true});
    const timer=new Timer(),STEP=1/60,MAX=2;let accumulator=0,frame=0,active=true;
    const observer=new IntersectionObserver(entries=>{active=entries[0]?.isIntersecting??true},{rootMargin:'100px'});observer.observe(stage);
    renderer.setAnimationLoop(()=>{if(!active)return;timer.update();accumulator+=Math.min(Math.max(timer.getDelta(),1e-6),STEP*MAX);let steps=0;while(accumulator>=STEP&&steps<MAX){fluid.step(STEP);accumulator-=STEP;steps++}if(steps===MAX)accumulator=0;composer.render(STEP);frame++;if(frame===2)stage.classList.add('fluid-ready');setState(stage,{engine:'three-fluid-fx-fluid-text',pipeline:'GLSL',renderer:'WebGL2',profile:'performance',pointer:true,touch:true,mobile,subtle,frame})});
    addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);detach?.();canvas.removeEventListener('pointerdown',pressSplat);observer.disconnect();composer.dispose();material.dispose();mesh.geometry.dispose();texture.dispose();fluid.dispose?.();renderer.dispose()},{once:true});
  }catch(error){console.error('[Tsubasa Fluid WebGL2]',error);renderer?.domElement?.remove();fallback(stage,String(error?.message||error))}
}

async function initWebGPU(stage,{subtle=false}={}){
  let renderer;
  try{
    // PC browsers without WebGPU must keep the same interactive effect through
    // the WebGL2 three-fluid-fx pipeline.  A static image is only the final
    // fallback when neither GPU API can run.
    if(reduced){fallback(stage,'reduced motion');return}
    if(!('gpu' in navigator)){await initWebGL(stage,{subtle});return}
    const [webgpu,tsl,fluidFx]=await Promise.all([import('https://esm.sh/three@0.183.2/webgpu'),import('https://esm.sh/three@0.183.2/tsl'),import('https://esm.sh/three-fluid-fx@0.1.0/tsl?deps=three@0.183.2')]);
    const {RenderPipeline,WebGPURenderer}=webgpu,{pass,uniform}=tsl,{attachPointerSplats,FluidSimulation,fluidOverlay,simpleDistortion}=fluidFx;
    renderer=new WebGPURenderer({antialias:true,forceWebGL:false});renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.setClearColor(new Color('#07080b'),1);
    const canvas=mountCanvas(stage,renderer);await renderer.init();
    const {scene,camera,texture,material,mesh,fit}=await commonScene(stage);
    const fluid=new FluidSimulation(renderer,{profile:'performance',splatRadius:subtle?.00115:.0013,splatForce:subtle?15:19,pressureIterations:9,curlStrength:.18,velocityDissipation:.99,densityDissipation:.94,pressureDissipation:.8,enableVorticity:false,bfecc:true,reflectWalls:false});
    fluid.enableDye=true;fluid.dyeDissipation=.965;
    const distortion=uniform(subtle?.82:1.18),intensity=uniform(subtle?.64:1.36),opacity=uniform(subtle?.31:.7),velocity=uniform(subtle?1.3:1.62),elapsed=uniform(0),texel=uniform(new Vector2(1/512,1/512)),cursor=uniform(new Color(.85,.95,1)),vibrance=uniform(subtle?.66:.72);
    let output=simpleDistortion(pass(scene,camera),fluid.densityNode,distortion);output=fluidOverlay('artInk',output,fluid.densityNode,fluid.dyeNode,fluid.velocityNode,{intensity,opacity,time:elapsed,texel,cursorColor:cursor,vibrance,velocityScale:velocity});
    const pipeline=new RenderPipeline(renderer);pipeline.outputNode=output;pipeline.needsUpdate=true;const detach=attachPointerSplats(canvas,fluid,{coloredStrokes:true});
    // `attachPointerSplats` draws a stroke on movement.  Add a genuine fluid
    // impulse on press as well, so the effect never appears to be missing
    // until the mouse has already travelled across the photograph.
    const pressSplat=(event)=>{const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;const x=(event.clientX-rect.left)/rect.width,y=1-(event.clientY-rect.top)/rect.height;fluid.addSplat?.(x,y,0,subtle?125:150,{radius:subtle?.0012:.0014,dyeColor:[.72,.86,1]})};
    canvas.addEventListener('pointerdown',pressSplat,{passive:true});
    const resize=()=>{const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();fluid.resize(width,height);const image=fluid.dyeTexture.image;texel.value.set(1/(image.width||512),1/(image.height||512));fit()};
    resize();addEventListener('resize',resize,{passive:true});visualViewport?.addEventListener('resize',resize,{passive:true});
    const timer=new Timer(),STEP=1/60,MAX=3;let accumulator=0,frame=0,active=true;const observer=new IntersectionObserver(entries=>{active=entries[0]?.isIntersecting??true},{rootMargin:'120px'});observer.observe(stage);
    renderer.setAnimationLoop(()=>{if(!active)return;timer.update();const dt=Math.min(Math.max(timer.getDelta(),1e-6),STEP*MAX);elapsed.value=timer.getElapsed();accumulator+=dt;let steps=0;while(accumulator>=STEP&&steps<MAX){fluid.step(STEP);accumulator-=STEP;steps++}if(steps===MAX)accumulator=0;pipeline.render();frame++;if(frame===2)stage.classList.add('fluid-ready');setState(stage,{engine:'three-fluid-fx-fluid-text',pipeline:'TSL',renderer:'WebGPU',profile:'performance',pointer:true,touch:true,mobile,subtle,frame})});
    addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);detach?.();canvas.removeEventListener('pointerdown',pressSplat);observer.disconnect();material.dispose();mesh.geometry.dispose();texture.dispose();fluid.dispose?.();renderer.dispose()},{once:true});
  }catch(error){console.error('[Tsubasa Fluid WebGPU]',error);renderer?.domElement?.remove();await initWebGL(stage,{subtle})}
}

if(mobile){
  await initWebGL(topStage);
  if(shopStage instanceof HTMLElement){const lazyShop=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)return;lazyShop.disconnect();initWebGL(shopStage,{subtle:false})},{rootMargin:'240px'});lazyShop.observe(shopStage)}
}else{
  await initWebGPU(topStage);
  if(shopStage instanceof HTMLElement)await initWebGPU(shopStage,{subtle:true});
}
