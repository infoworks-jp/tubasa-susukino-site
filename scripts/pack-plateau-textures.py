"""Lossless UV atlas repacking, without resampling or drawing new image content.
Requires Pillow. Only image regions referenced by the selected buildings survive.
"""
import io,json,math,struct,sys
from pathlib import Path
from PIL import Image
source=Path(sys.argv[1] if len(sys.argv)>1 else 'output/plateau-v4/processed')
dest=Path(sys.argv[2] if len(sys.argv)>2 else 'location/assets/plateau')
dest.mkdir(parents=True,exist_ok=True)
for tile in ['data30','data44']:
 raw=(source/(tile+'.glb')).read_bytes(); jl=struct.unpack_from('<I',raw,12)[0]; g=json.loads(raw[20:20+jl]); binary=bytearray(raw[28+jl:]); iv=g['bufferViews'][g['images'][0]['bufferView']]; image=Image.open(io.BytesIO(binary[iv['byteOffset']:iv['byteOffset']+iv['byteLength']])).convert('RGB');w,h=image.size
 uvaccess=next(p['attributes']['TEXCOORD_0'] for m in g['meshes'] for p in m['primitives'] if 'TEXCOORD_0' in p['attributes']); a=g['accessors'][uvaccess];v=g['bufferViews'][a['bufferView']];offset=v['byteOffset']+a.get('byteOffset',0); coords=list(struct.iter_unpack('<ff',binary[offset:offset+a['count']*8]));parent=list(range(len(coords)))
 def find(i):
  while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
  return i
 def union(i,j):parent[find(i)]=find(j)
 seen={}
 for i,p in enumerate(coords):
  key=tuple(round(x*1000000) for x in p)
  if key in seen:union(i,seen[key])
  else:seen[key]=i
  if i%3:union(i,i-i%3)
 groups={}
 for i in range(len(coords)):groups.setdefault(find(i),[]).append(i)
 patches=[]
 for indices in groups.values():
  # glTF UV v=0 is the top of the embedded image; GLTFLoader sets flipY=false.
  xs=[coords[i][0]*w for i in indices];ys=[coords[i][1]*h for i in indices]
  box=(max(0,math.floor(min(xs))-2),max(0,math.floor(min(ys))-2),min(w,math.ceil(max(xs))+2),min(h,math.ceil(max(ys))+2))
  patches.append({'indices':indices,'box':box,'w':max(1,box[2]-box[0]),'h':max(1,box[3]-box[1])})
 patches.sort(key=lambda p:p['h'],reverse=True)
 # Shelf-pack; 4px gutters retain mipmap isolation, all source texels retained.
 width=2**math.ceil(math.log2(max(1024,max(p['w']+8 for p in patches),math.sqrt(sum((p['w']+8)*(p['h']+8) for p in patches)))))
 x=y=row=0
 for p in patches:
  if x+p['w']+8>width:x=0;y+=row;row=0
  p['x']=x+4;p['y']=y+4;x+=p['w']+8;row=max(row,p['h']+8)
 height=2**math.ceil(math.log2(y+row));atlas=Image.new('RGB',(width,height),(255,255,255))
 for p in patches:
  atlas.paste(image.crop(p['box']),(p['x'],p['y']))
  for i in p['indices']:
   u,vv=coords[i];struct.pack_into('<ff',binary,offset+i*8,(u*w-p['box'][0]+p['x'])/width,(vv*h-p['box'][1]+p['y'])/height)
 out=io.BytesIO();atlas.save(out,'WEBP',lossless=True,method=6);tex=out.getvalue();chunks=[];newOffset=0
 for i,view in enumerate(g['bufferViews']):
  chunk=tex if i==g['images'][0]['bufferView'] else binary[view['byteOffset']:view['byteOffset']+view['byteLength']]
  view['byteOffset']=newOffset;view['byteLength']=len(chunk);chunk=bytes(chunk)+b'\x00'*((-len(chunk))%4);chunks.append(chunk);newOffset+=len(chunk)
 g['buffers'][0]['byteLength']=newOffset;g['extras']['atlas']={'width':width,'height':height,'patches':len(patches),'method':'Lossless UV atlas repack; original texel resolution preserved'};j=json.dumps(g,separators=(',',':'),ensure_ascii=False).encode();j+=b' '*((-len(j))%4);b=b''.join(chunks);glb=struct.pack('<4sII',b'glTF',2,28+len(j)+len(b))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(b),b'BIN\x00')+b
 (dest/(tile+'.glb')).write_bytes(glb)
 print(tile,len(patches),'patches',image.size,'->',atlas.size,'bytes',len(glb))
