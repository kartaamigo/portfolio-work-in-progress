from pathlib import Path
from PIL import Image
root=Path('dual-world/assets')
im=Image.open(root/'motion-details.png').convert('RGBA')
regions=[('error',(350,18,652,250)),('drop',(653,56,842,230)),('screen',(12,102,332,425)),('plus',(856,278,1015,440)),('card',(168,716,441,940)),('spray',(95,478,384,718)),('chip',(315,300,433,431))]
for name,box in regions:
    layer=Image.new('RGBA',im.size)
    layer.paste(im.crop(box),box[:2])
    layer.save(root/f'detail-{name}.png',optimize=True)
p=Path('dual-world/index.html')
s=p.read_text(encoding='utf-8').replace('assets/digital-scene-base.jpg','assets/hero-digital-bunny.png')
for name,_ in regions:
    s=s.replace(f'assets/digital-prop-{name}.png',f'assets/detail-{name}.png')
s=s.replace('<img class="digital-prop prop-card" src="assets/detail-card.png" alt="">','<img class="digital-prop prop-card" src="assets/detail-card.png" alt=""><img class="digital-prop prop-spray" src="assets/detail-spray.png" alt=""><img class="digital-prop prop-chip" src="assets/detail-chip.png" alt="">')
p.write_text(s,encoding='utf-8')
