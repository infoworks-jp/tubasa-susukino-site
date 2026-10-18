#!/usr/bin/env python3
"""Bake measured shop-surface quads for the 3D model; never publish full photos.
Requires Pillow and numpy. Coordinates refer to the 1152x2048 upright previews.
Only photographed surfaces are rectified; there is no generative completion.
"""
import argparse, json, pathlib
import numpy as np
from PIL import Image, ImageOps, ImageDraw
parser=argparse.ArgumentParser();parser.add_argument('source_root',type=pathlib.Path);parser.add_argument('--output',type=pathlib.Path,default=pathlib.Path('location/assets/alley-photo'));parser.add_argument('--contact',type=pathlib.Path);args=parser.parse_args()
ids={'entry':'7CB15CB3-E93E-4265-B0F0-94171CEA86C6','mogura':'96FEE205-2B72-4CB0-B4DF-D1076CDA7636','mogura-side':'EE12EC31-3783-4F98-993C-43950E97AE1B','fuji':'784FC8FD-33A2-4192-851C-8601088A6029','akarenga':'7550F3C9-DD7F-4687-A10E-E885699A0A24','karai':'4F97B9C7-935E-465A-AAE0-68C187271616','karai-board':'DE580058-938D-494A-A490-7DC1447D2E29','shop':'9D11A956-5813-47AB-9D78-7BA5554BBBDC'}
# Surface boundary measurements: TL, TR, BR, BL. Person-free surface quads only.
specs=[
('entry-sign','entry',[[294,375],[969,78],[953,794],[277,851]],[1024,768]),
('building-name','entry',[[276,853],[950,798],[948,888],[274,919]],[1024,150]),
('mogura-front','mogura',[[276,764],[831,758],[805,1320],[272,1320]],[1024,1024]),
('mogura-noren','mogura',[[337,787],[817,777],[811,905],[324,901]],[1280,340]),
('mogura-bevel-menu','mogura',[[79,766],[269,771],[270,1240],[88,1178]],[512,1280]),
('mogura-yellow','mogura-side',[[649,459],[774,469],[757,1183],[621,1161]],[300,1400]),
('yokocho-header','mogura',[[0,151],[1151,193],[1151,550],[0,526]],[1600,470]),
('fuji-poster','fuji',[[239,618],[409,586],[413,968],[242,1007]],[400,960]),
('akarenga-blade','akarenga',[[438,564],[560,569],[542,1083],[422,1059]],[360,1400]),
('akarenga-wall-menu','akarenga',[[565,626],[1031,546],[1017,1168],[556,1106]],[1280,1000]),
('karai-noren','karai',[[1,366],[878,284],[864,681],[1,699]],[1536,540]),
('karai-poster','shop',[[940,818],[1036,778],[1025,1286],[904,1244]],[360,1280]),
('karai-standing','karai-board',[[555,1100],[1150,1170],[1150,2045],[608,1960]],[720,1100]),
('tsubasa-facade','shop',[[192,485],[885,488],[828,1290],[214,1290]],[1200,1400]),
('tsubasa-noren','shop',[[230,678],[863,697],[846,941],[232,945]],[1536,650]),
('tsubasa-menu','shop',[[132,840],[492,868],[451,1472],[156,1539]],[700,1400]),
('tsubasa-menu-top','shop',[[120,710],[439,747],[434,861],[130,837]],[800,320]),
('tsubasa-mat','shop',[[443,1283],[823,1281],[868,1440],[327,1470]],[1024,620]),
('karai-mat','shop',[[734,1531],[1070,1514],[1149,1900],[802,2014]],[600,1024]),
('floor-cover','shop',[[640,1811],[848,1824],[854,2025],[632,2038]],[512,512]),
('ceiling','akarenga',[[116,5],[603,130],[570,254],[52,162]],[1024,512]),
]
args.output.mkdir(parents=True,exist_ok=True);cache={};records=[];thumbs=[]
for name,key,q,size in specs:
    uid=ids[key]
    if key not in cache:
        image=ImageOps.exif_transpose(Image.open(args.source_root/uid[0]/(uid+'_1_201_a.jpeg'))).convert('RGB');cache[key]=image
    image=cache[key];W,H=image.size
    assert abs(W/H-1152/2048)<.001
    points=[(x*W/1152,y*H/2048) for x,y in q]
    assert all(0<=x<=W and 0<=y<=H for x,y in points),name
    a=[];b=[]
    for (u,v),(x,y) in zip([(0,0),(size[0],0),(size[0],size[1]),(0,size[1])],points):
        a.extend([[u,v,1,0,0,0,-x*u,-x*v],[0,0,0,u,v,1,-y*u,-y*v]]);b.extend([x,y])
    coefficients=np.linalg.solve(np.array(a,float),np.array(b,float))
    baked=image.transform(tuple(size),Image.Transform.PERSPECTIVE,coefficients,Image.Resampling.BICUBIC)
    file=args.output/(name+'.webp');baked.save(file,'WEBP',quality=90,method=6)
    records.append({'name':name,'file':name+'.webp','sourceId':uid,'sourceSize':[W,H],'measurementSize':[1152,2048],'sourceQuad':q,'size':size,'bytes':file.stat().st_size,'technique':'Measured projective surface bake; original pixels, no generated lettering or invented menu'});
    thumb=Image.new('RGB',(270,300),'#e6e3dc');copy=baked.copy();copy.thumbnail((250,260));thumb.paste(copy,((270-copy.width)//2,30));ImageDraw.Draw(thumb).text((8,8),name,fill='black');thumbs.append(thumb)
(args.output/'manifest.json').write_text(json.dumps({'source':'16 user photographs supplied 2026-10-18; capture date unknown','surfaces':records},ensure_ascii=False,indent=2)+'\n')
if args.contact:
    sheet=Image.new('RGB',(270*5,300*((len(thumbs)+4)//5)),'white')
    for i,t in enumerate(thumbs):sheet.paste(t,((i%5)*270,(i//5)*300))
    sheet.save(args.contact)
print(f'Baked {len(records)} measured surfaces; {sum(r["bytes"] for r in records):,} bytes')
