from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
p=Path(__file__).parent
im=Image.open(p/'assets/bunny-illustration.jpg').convert('RGBA')
mask=Image.new('L',im.size,0);d=ImageDraw.Draw(mask)
d.polygon([(277,362),(274,314),(292,279),(324,244),(372,218),(426,200),(483,201),(534,216),(578,245),(616,280),(628,307),(607,315),(573,300),(535,285),(491,282),(448,298),(401,323),(355,351),(315,370)],fill=255)
d.polygon([(780,312),(799,259),(817,207),(848,155),(891,120),(936,99),(976,95),(1002,107),(1016,133),(1005,164),(979,203),(941,240),(901,273),(858,309),(815,326)],fill=255)
d.ellipse((477,285,902,609),fill=255)
d.ellipse((343,493,509,591),fill=255);d.ellipse((852,490,1037,591),fill=255)
d.rectangle((679,248,729,304),fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(1.5));im.putalpha(mask)
im=im.resize((round(im.width*1.045),round(im.height*1.045)),Image.Resampling.LANCZOS)
out=Image.new('RGBA',(1000,1000));out.alpha_composite(im,(round(500-700*1.045),round(635-437*1.045)))
out.save(p/'assets/bunny-cutout.png')
