"""Create deferred high-quality product photos from the retained PNG masters.

Only format, scale and alpha framing change. No new product detail is invented.
Pass the directory of original generated PNG files with --masters.
"""
from pathlib import Path
from PIL import Image
import argparse,json

root=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--masters',required=True);args=ap.parse_args()
masters=Path(args.masters)
sources={
 'move':'exec-49f40deb-87c5-45f7-bc59-98e691150c83.png',
 'focus':'exec-180eed91-1274-48d2-9143-d98f1a97dae8.png',
 'carry':'exec-90f5e83d-03c4-4a90-8dd6-d20cf8994158.png'
}
for item in json.loads((root/'verification/product-assets-v5.json').read_text())['assets']:
 sources[item['id']]=item['generatedSource']
target=root/'dist/assets/detail';target.mkdir(exist_ok=True)
for id,source in sources.items():
 im=Image.open(masters/source).convert('RGBA')
 if id in ['move','focus','carry']:
  out=im.resize((1440,1440),Image.Resampling.LANCZOS)
 else:
  im=im.crop(im.getchannel('A').getbbox());factor=1224/max(im.size)
  im=im.resize((round(im.width*factor),round(im.height*factor)),Image.Resampling.LANCZOS)
  out=Image.new('RGBA',(1440,1440));out.alpha_composite(im,((1440-im.width)//2,(1440-im.height)//2))
 path=target/(id+'.webp');out.save(path,quality=95,method=5)
 print(id,path.stat().st_size,flush=True)
