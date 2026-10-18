import * as THREE from 'three';
import { entranceAnchor, entranceAngle } from './route-facades.mjs';
import { loadArtwork } from './artwork.mjs';

// Photo-led reconstruction, not a measured building plan. Only the visible
// sequence is asserted: entrance/stairs, left of Mogura, Fuji NOODLE,
// Akarenga, Karai Ramen 14 on the right, and Tsubasa at the end.
export const alleySource = {
  source: '16 photographs supplied by the user on 2026-10-18; capture date unknown',
  referenceImages: ['7CB15CB3-E93E-4265-B0F0-94171CEA86C6', '71E24862-C5B4-45A4-8D77-CF5CC8612AD0', '96FEE205-2B72-4CB0-B4DF-D1076CDA7636', '3639EE16-59E9-45A9-B48C-F9592D08CCDB', 'C0D7B419-29D1-4B3C-980D-1DB4EED4CD6D', '7550F3C9-DD7F-4687-A10E-E885699A0A24', '689F4634-32A0-427A-BF3E-AFF8C1E85E4B', '9D11A956-5813-47AB-9D78-7BA5554BBBDC'],
  limitations: 'Photograph-based approximate dimensions, stair count, storefront widths and passage length. Roof/west wall removed in cutaway. No surveyed plan or geographic restaurant coordinate inferred from this model.',
  attribution: '提供写真の面を射影補正して3Dに配置 / 屋内寸法は概略',
  surfaceManifest: './assets/alley-photo/manifest.json',
};
export const alleyStops = {
  'alley': { title: '横丁の中を見渡す', text: '階段 → もぐらの左 → 通路の一番奥がつばさ', position: [-10, 11, -5], target: [-.8, -.1, 7], fov: 42 },
  'alley-stairs': { title: '① 緑の看板から階段へ', text: '階段を下りると、正面に「もぐら」', position: [0, 1.1, -1.15], target: [0, -.6, 3.8], fov: 62 },
  'alley-turn': { title: '② もぐらの左の通路へ', text: '正面の赤い暖簾を目印に、左側の通路へ', position: [-.6, .25, .2], target: [-.6, 0, 4.7], fov: 72 },
  'alley-passage': { title: '③ 通路を奥へ', text: '右手の「赤れんが」「辛いラーメン14」を通り過ぎる', position: [-2.05, .25, 6.8], target: [-2.05, .05, 15.2], fov: 62 },
  'alley-door': { title: '④ 味一番つばさに到着', text: '突き当たりの紺色の暖簾。右隣は辛いラーメン14', position: [-2.05, .28, 11.35], target: [-2.05, -.12, 15.25], fov: 64 },
};
export function addAlleyInterior(scene) {
  const group = new THREE.Group();
  group.name = 'Shin Ramen Yokocho — stairs and interior route to Tsubasa';
  group.position.set(entranceAnchor[0], 0, entranceAnchor[1]);
  group.rotation.y = entranceAngle;
  // The visitor looks into +Z: mirror the local plan so the shop row is on
  // their right. Texture U below is compensated to keep lettering readable.
  group.scale.x = -1;
  group.userData = { ...alleySource, type: 'photo-based interior cutaway', floor: 'B1F' };
  group.visible = false;
  scene.add(group);
  const materials = [], walls = new THREE.Group();
  walls.name = 'Cutaway west wall'; group.add(walls);
  const mats = new Map();
  const material = (color) => {
    if (!mats.has(color)) { const m = new THREE.MeshStandardMaterial({color, roughness: .94}); mats.set(color,m); materials.push(m); }
    return mats.get(color);
  };
  const ink = new THREE.LineBasicMaterial({color:0x242324});
  const box = (name, size, at, color, parent=group) => {
    const g = new THREE.BoxGeometry(...size), mesh = new THREE.Mesh(g,material(color));
    mesh.name=name; mesh.position.set(...at); parent.add(mesh);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(g),ink);mesh.add(lines);
    return mesh;
  };
  function pipe(a,b,r=.035,color=0x9b9c95) {
    const v=new THREE.Vector3(...a), w=new THREE.Vector3(...b), delta=w.clone().sub(v);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),20),material(color));
    mesh.position.copy(v.add(w).multiplyScalar(.5)); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());group.add(mesh);return mesh;
  }
  function texture(draw,w=1024,h=512) {
    const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
  }
  function tileFloor(name,width,length,x,z) {
    const t=texture((c,W,H)=>{c.fillStyle='#d7d3c5';c.fillRect(0,0,W,H);c.strokeStyle='#52544f';c.lineWidth=7;for(let i=0;i<=8;i++){c.beginPath();c.moveTo(i*128,0);c.lineTo(i*128,H);c.stroke();c.beginPath();c.moveTo(0,i*128);c.lineTo(W,i*128);c.stroke();}},1024,1024);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(width/1.2,length/1.2);
    const m=new THREE.MeshStandardMaterial({map:t,roughness:1});materials.push(m);
    const geom=new THREE.PlaneGeometry(width,length);
    geom.setAttribute('inkArtwork',new THREE.Float32BufferAttribute(new Float32Array(geom.attributes.position.count).fill(.58),1));
    const p=new THREE.Mesh(geom,m);p.name=name;p.rotation.x=-Math.PI/2;p.position.set(x,-1.34,z);group.add(p);
    box(name+' foundation',[width,.12,length],[x,-1.41,z],0xa8a79d);
  }
  // The stair flight is separated by a handrail, matching the photographs.
  box('Pavement at entrance',[3.6,.13,1.6],[0,-.07,-.8],0xbcb8aa);
  for(let i=0;i<7;i++) {
    const y=-(i+1)*1.35/7,z=(i+.5)*.43;
    box('Approximate descending stair '+(i+1),[3.25,.14,.43],[0,y-.07,z],0xb8a48a);
    for(const x of [-1.1,-.65,.65,1.1]) box('Stair anti-slip tread',[.29,.012,.035],[x,y+.005,z-.07],0x343633);
  }
  for(const x of [-1.57,0,1.57]) {
    pipe([x,.9,0],[x,-.45,3.02],.028,0xa3a7a1);
    for(const z of [.1,1.45,2.9]){const f=-1.35*z/3;pipe([x,f,z],[x,f+.9,z],.023,0xa3a7a1);}
  }
  tileFloor('Landing',4.7,1.45,-.7,3.75);
  tileFloor('Passage white square tiles',1.9,10.65,-2.05,9.9);
  box('Left entrance wall',[.15,2.65,3.1],[-1.7,.03,1.5],0xdbd5c5);
  box('Right entrance pier',[.2,3.1,.35],[1.75,.3,0],0xaca99d);
  box('Entrance lintel',[3.65,.24,.45],[0,2.18,0],0xb1afa3);
  // Each photograph is rectified independently. No whole-photo billboards,
  // people, generated food drawings, or invented sign lettering are used.
  const surfaces = new Map(), photoMaterials = [];
  function photo(name, asset, w, h, at, rotation=Math.PI, parent=group, mask=.58) {
    const geom=new THREE.PlaneGeometry(w,h,12,12), uv=geom.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setX(i,1-uv.getX(i));
    geom.setAttribute('inkArtwork',new THREE.Float32BufferAttribute(new Float32Array(geom.attributes.position.count).fill(mask),1));
    const m=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,toneMapped:false});
    materials.push(m);photoMaterials.push(m);
    if(!surfaces.has(asset))surfaces.set(asset,[]);surfaces.get(asset).push(m);
    const p=new THREE.Mesh(geom,m);p.name=name;p.position.set(...at);p.rotation.y=rotation;
    p.userData={surface:asset,sourceManifest:alleySource.surfaceManifest};parent.add(p);return p;
  }
  photo('No.3 Green Building name','building-name',3.3,.36,[0,1.86,-.05]);
  photo('Green and red Shin Ramen Yokocho sign','entry-sign',3.25,2.1,[0,3.09,-.03],Math.PI,group,.72);
  photo('Landing shop directory','yokocho-header',4.7,1.05,[-.55,1.57,3.87]);
  photo('Fuji bowl directory poster','fuji-poster',.47,1.12,[-1.61,.1,1.7],-Math.PI/2);
  // Bevelled Mogura corner: the left passage opens beside its angled menu face.
  const plan=new THREE.Shape();plan.moveTo(-1,4.95);plan.lineTo(-.55,4.5);plan.lineTo(1.65,4.5);plan.lineTo(1.65,7.12);plan.lineTo(-1,7.12);plan.closePath();
  const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(plan,{depth:2.4,bevelEnabled:false}),material(0xc4bba3));
  shell.rotation.x=Math.PI/2;shell.position.y=1.06;shell.name='Mogura bevelled tiled shell';group.add(shell);
  photo('Mogura photographed doorway','mogura-front',2.2,2.2,[.55,-.24,4.48]);
  photo('Mogura red noren','mogura-noren',1.92,.49,[.59,.55,4.43]);
  photo('Mogura bevel menu','mogura-bevel-menu',.63,1.76,[-.784,-.23,4.716],-Math.PI*3/4);
  box('Mogura yellow blade housing',[.16,1.63,.32],[-1.17,-.05,5.64],0xd5b638);
  photo('Mogura yellow side sign','mogura-yellow',.32,1.63,[-1.265,-.05,5.64],-Math.PI/2);
  box('East shop wall',[.15,2.5,8.1],[-1.03,-.09,11.2],0xa79376);
  box('West wall cutaway base',[.13,.32,10.7],[-3.05,-1.18,9.9],0xa8a89e);
  box('West corridor wall',[.13,2.45,10.7],[-3.05,-.12,9.9],0xd9d5c9,walls);
  box('West wall gray dado',[.018,.85,10.65],[-2.972,-.91,9.9],0x8b8c82,walls);
  box('West wall skirting',[.025,.10,10.65],[-2.957,-1.28,9.9],0x343834,walls);
  // Low ceilings belong to close views only; the overview remains a cutaway.
  const ceiling=photo('Rough concrete ceiling','ceiling',2.1,10.65,[-2.05,1.12,9.9],0,walls);
  ceiling.rotation.x=Math.PI/2;
  for(const z of [5.6,8.9,12.2,14.8]) {
    box('Low concrete beam',[2.12,.24,.27],[-2.05,1.01,z],0xa09d90,walls);
    box('Fluorescent metal housing',[.78,.055,.17],[-2.07,.93,z+.43],0x6a6a61,walls);
    box('Fluorescent diffuser',[.70,.025,.13],[-2.07,.892,z+.43],0xfff4ce,walls);
  }
  for(const x of [-2.86,-1.29]) {
    pipe([x,.94,4.8],[x,.94,15.12],.067,0xb6b5a8);
    for(const z of [6.2,9.5,12.7,14.6]) {
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.073,.013,8,24),material(0x777b75));ring.position.set(x,.94,z);group.add(ring);
      box('Pipe suspension bracket',[.032,.15,.035],[x,1.04,z],0x777b75);
    }
  }
  pipe([-2.91,.73,14.05],[-1.07,.73,14.05],.095,0xbab8a9);
  for(const x of [-2.64,-1.45])pipe([x,.73,13.95],[x,.73,14.16],.109,0x858d88);
  pipe([-1.25,.73,14.05],[-1.25,.73,14.74],.095,0xbab8a9);
  pipe([-2.9,.88,8.2],[-1.07,.88,8.2],.045,0x999a90);
  box('Small ceiling camera',[.09,.09,.15],[-2.57,.86,14.3],0x292b29);
  // Shop windows and signs occupy individual depths, rather than repeated doors.
  box('Fuji doorway dark recess',[.06,1.95,1.72],[-1.12,-.35,7.65],0x242b2b);
  for(let i=0;i<4;i++)box('Fuji plain charcoal noren',[.05,.92,.40],[-1.2,.18,7.02+i*.42],0x333737);
  for(let i=0;i<4;i++)box('Fuji faded yellow noren hem',[.055,.045,.40],[-1.225,-.26,7.02+i*.42],0xada16b);
  photo('Akarenga noren','akarenga-wall-menu',2.25,1.65,[-1.13,-.16,10.05],-Math.PI/2);
  box('Akarenga blade housing',[.10,1.58,.39],[-1.30,-.11,11.24],0xb52b24);
  photo('Akarenga projecting red sign','akarenga-blade',.39,1.58,[-1.30,-.11,11.18]);
  box('Karai14 dark door',[.07,2.0,2.7],[-1.14,-.34,13.66],0x28221d);
  photo('Karai Ramen 14 noren','karai-noren',2.7,.81,[-1.205,.47,13.66],-Math.PI/2);
  photo('Karai14 door menu','karai-poster',.42,1.39,[-1.21,-.58,14.62],-Math.PI/2);
  photo('Karai Ramen 14 standing board','karai-standing',.59,1.08,[-1.42,-.77,12.77]);
  // Open plastic crate rims and four banded kegs follow photograph 9.
  for(let i=0;i<6;i++) {
    const y=-1.26+i*.125;
    box('Orange crate bottom',[.48,.025,.66],[-1.42,y,10.82],0xd89a24);
    for(const x of [-1.65,-1.19])box('Orange crate side rim',[.025,.10,.66],[x,y+.05,10.82],0xd89a24);
    for(const z of [10.50,11.14])box('Orange crate end rim',[.48,.10,.025],[-1.42,y+.05,z],0xd89a24);
  }
  for(const z of [11.73,12.20])for(let i=0;i<2;i++) {
    const y=-1.11+i*.44;
    const keg=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.41,24),material(0xadb0a9));keg.position.set(-1.40,y,z);keg.name='Stacked stainless beer keg';group.add(keg);
    for(const dy of [-.18,-.12,.12,.18]) {
      const band=new THREE.Mesh(new THREE.TorusGeometry(.163,.012,6,24),material(0x777e78));band.rotation.x=Math.PI/2;band.position.set(-1.4,y+dy,z);group.add(band);
    }
  }
  // Tsubasa: measured wood upper panel, navy cloth, recessed lattice glazing.
  box('Tsubasa back wall',[2.05,2.5,.14],[-2.05,-.09,15.39],0x795e40);
  photo('Tsubasa photographed facade','tsubasa-facade',2.05,2.45,[-2.05,-.12,15.28]);
  const noren=photo('Tsubasa navy noren','tsubasa-noren',1.89,.80,[-2.05,.11,15.16]);
  // Small folds retain the photographed cloth silhouette and printed lettering.
  const pos=noren.geometry.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setZ(i,.012*Math.sin(pos.getX(i)*24));
  pos.needsUpdate=true;noren.geometry.computeVertexNormals();
  for(const x of [-3.045,-1.055])box('Tsubasa timber jamb',[.075,2.35,.12],[x,-.16,15.19],0x80613e);
  pipe([-3.07,.94,15.12],[-1.04,.94,15.12],.047,0x86613d);
  pipe([-2.08,-.93,15.18],[-2.08,-.63,15.18],.014,0xb0b0a2);
  pipe([-1.97,-.93,15.18],[-1.97,-.63,15.18],.014,0xb0b0a2);
  box('Tsubasa freestanding menu frame',[.79,1.57,.075],[-2.77,-.51,14.88],0x252a29);
  photo('Tsubasa menu board','tsubasa-menu',.75,1.52,[-2.77,-.49,14.76],Math.PI-.09);
  photo('Tsubasa white menu header','tsubasa-menu-top',.76,.30,[-2.79,.40,14.83],Math.PI-.09);
  for(const x of [-3.1,-2.45])box('Menu stand foot',[.04,.08,.45],[x,-1.29,14.82],0x292a27);
  const mat=photo('Tsubasa blue entrance mat','tsubasa-mat',1.85,.77,[-2.05,-1.321,14.74],0);mat.rotation.x=-Math.PI/2;
  const redMat=photo('Karai14 red mat','karai-mat',.61,1.02,[-1.43,-1.319,13.62],0);redMat.rotation.x=-Math.PI/2;
  const cover=photo('Square floor access cover','floor-cover',.35,.35,[-2.0,-1.318,12.0],0);cover.rotation.x=-Math.PI/2;
  let texturePromise,ready=false;
  async function loadTextures() {
    if(ready)return;
    if(texturePromise)return texturePromise;
    texturePromise=(async()=>{
      // Commit materials together, so a failed request never exposes half a shop.
      const results=await Promise.allSettled([...surfaces.keys()].map(async asset=>[asset,await loadArtwork('./assets/alley-photo/'+asset+'.webp')]));
      const failure=results.find(result=>result.status==='rejected');
      if(failure){for(const result of results)if(result.status==='fulfilled')result.value[1].dispose();throw failure.reason;}
      for(const {value:[asset,t]} of results) {
        if(asset==='ceiling'){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,10);}
        for(const m of surfaces.get(asset)){m.map=t;m.needsUpdate=true;}
      }
      ready=true;
    })().catch(e=>{texturePromise=undefined;throw e;});
    return texturePromise;
  }
  // The navigation ribbon is geometry, retained in exported models.
  const routePoints=[[0,.02,-.5],[0,-1.30,3.4],[-2.05,-1.30,4.15],[-2.05,-1.30,14.3]];
  const path=new THREE.CatmullRomCurve3(routePoints.map(p=>new THREE.Vector3(...p)),false,'centripetal',.1);
  const ribbon=new THREE.Mesh(new THREE.TubeGeometry(path,90,.025,6,false),new THREE.MeshBasicMaterial({color:0x9a332d}));ribbon.name='Entrance to Tsubasa route';group.add(ribbon);
  for(const z of [5.9,8.7,11.6,13.7]) {
    const triangle=new THREE.Mesh(new THREE.ConeGeometry(.12,.32,3),new THREE.MeshBasicMaterial({color:0x9a332d}));triangle.rotation.x=Math.PI/2;triangle.position.set(-2.05,-1.29,z);triangle.name='Route forward arrow';group.add(triangle);
  }
  group.updateMatrixWorld(true);
  const world=p=>group.localToWorld(new THREE.Vector3(...p));
  return {group,materials,walls,world,photoMaterials,loadTextures,get ready(){return ready;},
    setView(name,aspect) {
      const stop=alleyStops[name];if(!stop)return;
      walls.visible=name!=='alley';
      const pos=[...stop.position],target=[...stop.target];
      if(name==='alley'&&aspect<1){pos[0]=-16;pos[1]=21;pos[2]=-12;target[2]=6.7;}
      // Keep a similar horizontal shop width on wide desktop canvases.
      const fov=name==='alley-door'&&aspect>1.4?42:stop.fov;
      return {position:world(pos),target:world(target),fov};
    },
  };
}
