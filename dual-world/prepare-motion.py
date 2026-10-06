from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
root=Path('dual-world/assets')
im=Image.open(root/'hero-digital-v2.png').convert('RGB')
base=im.copy()
# Peripheral objects are well separated from the stationary bunny.
regions=[('error',(330,35,600,245)),('drop',(625,50,795,170)),('screen',(900,70,1040,215)),('plus',(1085,42,1175,120)),('card',(1395,112,1565,300))]
for name,box in regions:
    x0,y0,x1,y1=box
    mask=Image.new('L',im.size)
    draw=ImageDraw.Draw(mask)
    draw.rounded_rectangle(box,radius=22,fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(5))
    # Keep edge feathering in the dark background, away from each object.
    pixels=np.asarray(im)
    edge=pixels[y0:y1,x0:x1]
    dark=edge[np.max(edge,axis=2)<22]
    color=tuple(int(v) for v in np.median(dark,axis=0)) if len(dark) else (5,5,7)
    fill=Image.new('RGB',im.size,color)
    base=Image.composite(fill,base,mask)
    layer=Image.new('RGBA',im.size)
    layer.paste(im,(0,0))
    layer.putalpha(mask)
    layer.save(root/f'digital-prop-{name}.png',optimize=True)
base.save(root/'digital-scene-base.jpg',quality=96)
