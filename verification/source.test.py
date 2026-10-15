from pathlib import Path
import re
import json
import subprocess
from html.parser import HTMLParser
from PIL import Image

root=Path(__file__).resolve().parents[1]
dist=root/'dist'
class Parse(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.local=[]; self.anchors=[]; self.i18n=set(); self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for k,v in a.items():
            if k.startswith('data-i18n'):self.i18n.add(v)
        for k in ['href','src']:
            v=a.get(k,'')
            if v.startswith('#') and len(v)>1:self.anchors.append(v[1:])
            elif v and not v.startswith(('http:','https:','#','data:')):self.local.append(v.split("?",1)[0])
        if tag=='img':self.images.append(a)
p=Parse();p.feed((dist/'index.html').read_text())
assert len(p.ids)==len(set(p.ids)), 'Duplicate HTML ids'
assert all(x in p.ids for x in p.anchors),'Missing anchor destination'
assert all((dist/x).is_file() for x in p.local),'Missing local resource'
assert all(x.get('alt') and x.get('width') and x.get('height') for x in p.images),'Incomplete image metadata'
app=(dist/'app.js').read_text()
# Evaluate literal translation dictionaries, never the storefront program.
literal=app.split('const I18N={he,',1)[1].split('\n  Object.entries(window.MOVA_STORE_COPY)',1)[0].rstrip().removesuffix(';')
script='const he={};const data={he,'+literal+';console.log(JSON.stringify({en:Object.keys(data.en),ar:Object.keys(data.ar)}));'
script=script.replace('console.log(JSON.stringify({en:Object.keys(data.en),ar:Object.keys(data.ar)}));','')
copy=(dist/'store-copy.js').read_text()
script+='const window={};'+copy+';for(const lang of ["en","ar"])Object.assign(data[lang],window.MOVA_STORE_COPY[lang]);console.log(JSON.stringify({en:Object.keys(data.en),ar:Object.keys(data.ar)}));'
keys=json.loads(subprocess.check_output(['node','-e',script],text=True))
for lang,values in keys.items():
    missing=p.i18n-set(values)
    assert not missing, f'{lang}: untranslated static keys {missing}'
for image in ['sneaker','headphones','bag','pace','slide','pulse','echo','roam','orbit','form','shell','loop']:
    im=Image.open(dist/'assets'/f'{image}.webp')
    assert im.mode=='RGBA' and im.getextrema()[-1][0]==0,'Lost cutout alpha'
    assert im.width<=1200 and im.height<=1200
social=Image.open(dist/'assets/social-cover.jpg')
assert social.size==(1200,630),'Wrong social card aspect ratio'
assert 'prefers-reduced-motion:reduce' in (dist/'styles.css').read_text()
assert 'frame-ancestors' in (dist/'_headers').read_text()
headers=(dist/'_headers').read_text()
assert "img-src 'self' data: blob:" in headers and "connect-src 'self' blob:" in headers,'Embedded GLB textures need blob image/fetch access'
assert 'navigator.share' in app and 'navigator.clipboard' in app
files=[f for f in dist.rglob('*') if f.is_file()]
size=sum(f.stat().st_size for f in files)
# Critical resources are the local HTML/CSS/JS plus eager HTML images.
# Catalog images, campaign imagery and the 3D runtime are deliberately lazy.
critical=set(x for x in p.local if not x.startswith('assets/'))
critical.add('index.html')
critical.update(x['src'].split('?',1)[0] for x in p.images if x.get('loading')!='lazy')
initial=sum((dist/x).stat().st_size for x in critical)
assert initial<1_500_000,f'Unexpectedly heavy critical resources: {initial}'
detail=sum(f.stat().st_size for f in (dist/'assets/detail').glob('*.webp'))
assert detail<4_000_000,f'Unexpectedly heavy deferred detail photography: {detail}'
spin=sum(f.stat().st_size for f in (dist/'assets/spin').glob('*.webp'))
assert spin<6_000_000,f'Unexpectedly heavy deferred turntables: {spin}'
assert size-detail-spin<6_500_000,f'Unexpectedly heavy base store with deferred 3D: {size-detail-spin}'
assert size<16_500_000,f'Unexpectedly heavy complete store with detail photos and turntables: {size}'
for f in (dist/'assets/detail').glob('*.webp'):
    im=Image.open(f)
    assert im.size==(1440,1440) and im.mode=='RGBA' and im.getextrema()[-1][0]==0
catalog=json.loads(subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm'),s={window:{}};vm.runInNewContext(fs.readFileSync('dist/catalog.js','utf8'),s);console.log(JSON.stringify(s.window.MOVA_CATALOG));"],cwd=root,text=True))
for product in catalog['products']:
    spec=product['spin'];im=Image.open(dist/spec['src'])
    assert spec['frames']==12 and spec['columns']==4 and spec['rows']==3
    assert im.size==(1448,1086) and im.mode=='RGBA' and im.getextrema()[-1][0]==0
    x=spec['bounds']['x'];y=spec['bounds']['y']
    assert len(x)==5 and len(y)==4 and x[0]==y[0]==0 and x[-1]==1448 and y[-1]==1086
    assert all(b>a for a,b in zip(x,x[1:])) and all(b>a for a,b in zip(y,y[1:]))
    cells=[im.crop((x[n%4],y[n//4],x[n%4+1],y[n//4+1])) for n in range(12)]
    assert len(set(cell.tobytes() for cell in cells))==12,'Duplicated atlas cells'
assert len(list((dist/'assets/spin').glob('*.webp')))==12,'All catalog products need a turntable'
print(f'PASS: assets, 12 turntables × 12 distinct cells, anchors, unique IDs, translations, alpha, social metadata; critical {initial:,}, deferred spin {spin:,}, total {size:,} bytes')
