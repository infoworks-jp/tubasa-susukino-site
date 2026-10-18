import * as THREE from 'three';
import { entranceAnchor, entranceAngle } from './route-facades.mjs';

// Photo-led reconstruction, not a measured building plan. Only the visible
// sequence is asserted: entrance/stairs, left of Mogura, Fuji NOODLE,
// Akarenga, Karai Ramen 14 on the right, and Tsubasa at the end.
export const alleySource = {
  source: '16 photographs supplied by the user on 2026-10-18; capture date unknown',
  referenceImages: ['7CB15CB3-E93E-4265-B0F0-94171CEA86C6', '71E24862-C5B4-45A4-8D77-CF5CC8612AD0', '96FEE205-2B72-4CB0-B4DF-D1076CDA7636', '3639EE16-59E9-45A9-B48C-F9592D08CCDB', 'C0D7B419-29D1-4B3C-980D-1DB4EED4CD6D', '7550F3C9-DD7F-4687-A10E-E885699A0A24', '689F4634-32A0-427A-BF3E-AFF8C1E85E4B', '9D11A956-5813-47AB-9D78-7BA5554BBBDC'],
  limitations: 'Photograph-based approximate dimensions, stair count, storefront widths and passage length. Roof/west wall removed in cutaway. No surveyed plan or geographic restaurant coordinate inferred from this model.',
  attribution: '提供写真に基づく独自作画 / 屋内寸法は概略',
};
export const alleyStops = {
  'alley': { title: '横丁の中を見渡す', text: '階段 → もぐらの左 → 通路の一番奥がつばさ', position: [-10, 11, -5], target: [-.8, -.1, 7], fov: 42 },
  'alley-stairs': { title: '① 緑の看板から階段へ', text: '階段を下りると、正面に「もぐら」', position: [0, 1.1, -1.15], target: [0, -.6, 3.8], fov: 62 },
  'alley-turn': { title: '② もぐらの左の通路へ', text: '正面の赤い暖簾を目印に、左側の通路へ', position: [-.6, .25, .2], target: [-.6, 0, 4.7], fov: 72 },
  'alley-passage': { title: '③ 通路を奥へ', text: '右手の「赤れんが」「辛いラーメン14」を通り過ぎる', position: [-2.05, .25, 6.8], target: [-2.05, .05, 15.2], fov: 62 },
  'alley-door': { title: '④ 味一番つばさに到着', text: '突き当たりの紺色の暖簾。右隣は辛いラーメン14', position: [-2.05, .05, 12.25], target: [-2.05, -.05, 15.25], fov: 58 },
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
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),material(color));
    mesh.position.copy(v.add(w).multiplyScalar(.5)); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());group.add(mesh);return mesh;
  }
  function texture(draw,w=1024,h=512) {
    const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');draw(ctx,w,h);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
  }
  function lettering(ctx,text,x,y,size,color='#f5efdb') {
    ctx.fillStyle=color;ctx.font=`700 ${size}px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif`;ctx.textAlign='center';ctx.fillText(text,x,y);
  }
  function panel(name,w,h,at,rotation,draw,mask=.82) {
    const t=texture(draw), geom=new THREE.PlaneGeometry(w,h);
    const uv=geom.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setX(i,1-uv.getX(i));
    geom.setAttribute('inkArtwork',new THREE.Float32BufferAttribute(new Float32Array(geom.attributes.position.count).fill(mask),1));
    const m=new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide,toneMapped:false});materials.push(m);
    const p=new THREE.Mesh(geom,m);p.name=name;p.position.set(...at);p.rotation.y=rotation;group.add(p);return p;
  }
  const sign = (name,w,h,at,rotation,text,bg,fg='#fff6de',sub='') => panel(name,w,h,at,rotation,(c,W,H)=>{
    c.fillStyle=bg;c.fillRect(0,0,W,H);c.strokeStyle=fg;c.lineWidth=14;c.strokeRect(15,15,W-30,H-30);
    lettering(c,text,W/2,sub?H*.54:H*.65,Math.min(170,820/Math.max(text.length,1)),fg);
    if(sub)lettering(c,sub,W/2,H*.83,55,fg);
  });
  function tileFloor(name,width,length,x,z) {
    const t=texture((c,W,H)=>{c.fillStyle='#d7d3c5';c.fillRect(0,0,W,H);c.strokeStyle='#52544f';c.lineWidth=7;for(let i=0;i<=8;i++){c.beginPath();c.moveTo(i*128,0);c.lineTo(i*128,H);c.stroke();c.beginPath();c.moveTo(0,i*128);c.lineTo(W,i*128);c.stroke();}},1024,1024);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(width/1.9,length/1.9);
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
  sign('No.3 Green Building name',3.3,.36,[0,1.86,-.04],Math.PI,'No.3 グリーンビル','#e3e8d9','#317553');
  panel('Green and red Shin Ramen Yokocho sign',3.25,1.35,[0,2.97,0],Math.PI,(c,W,H)=>{
    c.fillStyle='#fffbea';c.fillRect(0,0,W,H);c.strokeStyle='#278451';c.lineWidth=25;c.strokeRect(18,18,W-36,H-36);
    for(let x=45;x<W-30;x+=80){c.strokeRect(x,45,44,40);c.strokeRect(x,H-85,44,40);}
    lettering(c,'さっぽろ名所',W/2,186,70,'#be2e2e');lettering(c,'新 ラーメン横丁',W/2,315,112,'#be2e2e');
    lettering(c,'Sapporo New Ramen Street',W/2,410,43,'#be2e2e');
  },.72);
  // Far side of landing: Mogura, with the route visibly continuing on its left.
  const mogura=box('Mogura corner tiled shop',[2.65,2.4,2.65],[.33,-.15,5.83],0xc4bba3);
  const brick=texture((c,W,H)=>{c.fillStyle='#cfc6ae';c.fillRect(0,0,W,H);c.strokeStyle='#4e4c43';c.lineWidth=6;for(let y=0;y<H;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=(y/64%2)*96;x<W;x+=192){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+64);c.stroke();}}},1024,1024);
  const brickMaterial=new THREE.MeshStandardMaterial({map:brick,roughness:1});materials.push(brickMaterial);mogura.material=brickMaterial;
  mogura.geometry.setAttribute('inkArtwork',new THREE.Float32BufferAttribute(new Float32Array(mogura.geometry.attributes.position.count).fill(.58),1));
  box('Mogura doorway recess',[1.6,1.85,.08],[.33,-.4,4.455],0x3e3027);
  const door = (name,width,at,rotation=0) => {
    const g=new THREE.Group();g.name=name;g.position.set(...at);g.rotation.y=rotation;group.add(g);
    box(name+' glazing',[width,1.9,.05],[0,.95,0],0xc9af77,g);
    for(let x=-width/2;x<=width/2+.01;x+=width/4)box('Black lattice upright',[.035,1.9,.06],[x,.95,-.04],0x262426,g);
    for(const y of [.12,.55,1.1,1.7,1.91])box('Black lattice crossbar',[width,.035,.06],[0,y,-.04],0x262426,g);
    // Door belongs to the shop face; no interior room is invented.
    return g;
  };
  const curtain=(name,text,width,at,bg,fg,sub='')=>{
    // Separate hanging panels and seams remain actual geometry in GLB.
    for(let i=0;i<5;i++)box(name+' hanging panel',[width/5-.017,.55,.025],[at[0]-width/2+(i+.5)*width/5,at[1],at[2]],bg);
    return panel(name,width,.55,[at[0],at[1],at[2]-.02],Math.PI,(c,W,H)=>{
      c.fillStyle='#'+bg.toString(16).padStart(6,'0');c.fillRect(0,0,W,H);
      if(sub)lettering(c,sub,W/2,115,48,fg);lettering(c,text,W/2,sub?370:330,180,fg);
      c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=5;for(let i=1;i<5;i++){c.beginPath();c.moveTo(W*i/5,H*.6);c.lineTo(W*i/5,H);c.stroke();}
    });
  };
  door('Mogura front lattice',1.9,[.3,-1.34,4.41]);
  curtain('Mogura red noren','もぐら',2.4,[.3,.77,4.34],0x992d29,'#111111','元祖 さっぽろラーメン');
  sign('Mogura upper shop board',2.5,.48,[.3,1.36,4.33],Math.PI,'もぐら','#fff2cc','#252a23');
  sign('Mogura yellow side sign',.45,1.4,[-1.04,-.1,5.5],-Math.PI/2,'もぐら','#e1c135','#242119');
  // Long wall behind the confirmed row of shops; no unobserved rooms.
  box('East shop wall',[.15,2.5,8.1],[-1.03,-.09,11.2],0xa79376);
  box('West wall cutaway base',[.13,.32,10.7],[-3.05,-1.18,9.9],0xa8a89e);
  box('West corridor wall',[.13,2.45,10.7],[-3.05,-.12,9.9],0xd9d5c9,walls);
  for(const z of [5.5,9.1,12.7,14.8]) {
    box('Overhead concrete beam',[2.1,.18,.22],[-2.05,1.12,z],0x9d9d91);
    box('Fluorescent fitting',[.85,.055,.18],[-2.05,1.005,z+.3],0x5c625e);
    box('Fluorescent diffuser',[.76,.025,.14],[-2.05,.965,z+.3],0xf8efd3);
  }
  pipe([-2.86,.94,4.8],[-2.86,.94,15.1],.065);pipe([-1.4,1.07,4.8],[-1.4,1.07,15.1],.09);
  pipe([-2.88,.89,8],[-1.05,.89,8],.055);pipe([-2.88,.92,13.9],[-1.05,.92,13.9],.065);
  const sideDoor=(name,z,width,curtainText,color)=>{
    const d=door(name,width,[-1.11,-1.34,z],Math.PI/2);
    const p=sign(name+' noren',width,.49,[-1.16,.6,z],-Math.PI/2,curtainText,color,'#fff3d6');
    return {d,p};
  };
  sideDoor('Fuji NOODLE',7.65,1.6,'ふじ屋 NOODLE','#343b3b');
  sideDoor('Akarenga',10.3,1.9,'赤れんが','#ac332c');
  sign('Akarenga projecting red sign',.65,1.35,[-1.29,-.05,11.2],Math.PI,'赤れんが','#b1322d','#fff6de','ラーメンの');
  sideDoor('Karai Ramen 14',13.65,2.7,'辛いラーメン14','#b92a26');
  sign('Karai Ramen 14 standing board',.65,1.15,[-1.38,-.74,12.65],Math.PI,'旨辛','#fff4dc','#a12929','辛いラーメン14');
  // Tsubasa closes the sightline; the neighbouring red noren stays on its right.
  box('Tsubasa back wall',[2.05,2.5,.14],[-2.05,-.09,15.35],0x795e40);
  door('Tsubasa black lattice entrance',1.78,[-2.05,-1.34,15.24]);
  curtain('Tsubasa navy noren','つばさ',1.94,[-2.05,.51,15.15],0x292c42,'#f3e4b5','ここススキノで30年');
  pipe([-3.07,.91,15.12],[-1.04,.91,15.12],.055,0x86613d);
  sign('Tsubasa blue entrance mat',1.75,.65,[-2.05,-1.323,14.72],0,'味一番 つばさ','#263e52','#f4e4c1').rotation.x=-Math.PI/2;
  const menu=panel('Tsubasa menu board',.64,1.53,[-2.79,-.48,14.9],Math.PI-.16,(c,W,H)=>{
    c.fillStyle='#222b37';c.fillRect(0,0,W,H);lettering(c,'つばさ',W/2,62,64);
    for(let row=0;row<3;row++)for(let col=0;col<2;col++){
      const x=260+col*490,y=155+row*135;
      c.fillStyle='#eee4c6';c.beginPath();c.ellipse(x,y,165,52,0,0,Math.PI*2);c.fill();
      c.fillStyle='#bc8f42';c.beginPath();c.ellipse(x,y-8,144,41,0,0,Math.PI*2);c.fill();
      c.strokeStyle='#ebcf72';c.lineWidth=8;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-90,y-24+i*9);c.bezierCurveTo(x-40,y-42,x+35,y+18,x+100,y-20+i*9);c.stroke();}
      c.fillStyle='#698042';c.fillRect(x-25,y-25,50,30);
    }
  });menu.userData.limitations='Illustrative bowls only; no price/menu content asserted';
  // The navigation ribbon is geometry, retained in exported models.
  const routePoints=[[0,.02,-.5],[0,-1.30,3.4],[-2.05,-1.30,4.15],[-2.05,-1.30,14.3]];
  const path=new THREE.CatmullRomCurve3(routePoints.map(p=>new THREE.Vector3(...p)),false,'centripetal',.1);
  const ribbon=new THREE.Mesh(new THREE.TubeGeometry(path,90,.025,6,false),new THREE.MeshBasicMaterial({color:0x9a332d}));ribbon.name='Entrance to Tsubasa route';group.add(ribbon);
  for(const z of [5.9,8.7,11.6,13.7]) {
    const triangle=new THREE.Mesh(new THREE.ConeGeometry(.12,.32,3),new THREE.MeshBasicMaterial({color:0x9a332d}));triangle.rotation.x=Math.PI/2;triangle.position.set(-2.05,-1.29,z);triangle.name='Route forward arrow';group.add(triangle);
  }
  group.updateMatrixWorld(true);
  const world=p=>group.localToWorld(new THREE.Vector3(...p));
  return {group,materials,walls,world,
    setView(name,aspect) {
      const stop=alleyStops[name];if(!stop)return;
      walls.visible=name!=='alley';
      const pos=[...stop.position],target=[...stop.target];
      if(name==='alley'&&aspect<1){pos[0]=-16;pos[1]=21;pos[2]=-12;target[2]=6.7;}
      return {position:world(pos),target:world(target),fov:stop.fov};
    },
  };
}
