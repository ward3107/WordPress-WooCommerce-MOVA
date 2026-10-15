#!/usr/bin/env python3
"""Package the existing portfolio and a native WooCommerce trial theme.

No publishing, dependency install, credentials or store-setting mutation.
Usage: python3 scripts/package-launch-kit.py [--origin https://assigned-domain]
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from urllib.parse import urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--origin')
parser.add_argument('--output', default=str(ROOT / 'launch-build'))
args = parser.parse_args()
if args.origin:
    parsed = urlsplit(args.origin)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.path not in ('', '/') or parsed.query or parsed.fragment or parsed.username:
        parser.error('--origin must be an HTTPS origin without a path, credentials or query')
    args.origin = args.origin.rstrip('/')
out = Path(args.output).resolve()
if out == ROOT or ROOT in out.parents and out.parts[len(ROOT.parts):] != ('launch-build',):
    parser.error('Use the default launch-build or an output directory outside the checkout')
out.mkdir(parents=True, exist_ok=True)

def tree_zip(directory, target, prefix=''):
    with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for path in sorted(directory.rglob('*')):
            if path.is_file():
                z.write(path, str(Path(prefix) / path.relative_to(directory)))

portfolio = out / 'portfolio'
if portfolio.exists():
    shutil.rmtree(portfolio)
portfolio.mkdir()
shutil.copytree(ROOT / 'dist', portfolio / 'dist')
headers = []
for line in (ROOT / 'dist/_headers').read_text().splitlines():
    if not line.strip():
        continue
    if not line.startswith(' '):
        source = '/(.*)' if line == '/*' else line.replace('*', '(.*)')
        headers.append({'source': source, 'headers': []})
    else:
        key, value = line.strip().split(':', 1)
        headers[-1]['headers'].append({'key': key, 'value': value.strip()})
(portfolio / 'dist/_headers').unlink()
config = {'$schema': 'https://openapi.vercel.sh/vercel.json', 'framework': None, 'buildCommand': '', 'installCommand': '', 'outputDirectory': 'dist', 'headers': headers}
(portfolio / 'vercel.json').write_text(json.dumps(config, indent=2) + '\n')
html = (portfolio / 'dist/index.html').read_text()
old = 'https://mova-motion-store.vasele66.chatgpt.site'
catalog_js = (portfolio / 'dist/catalog.js').read_text()
if args.origin:
    html = html.replace(old, args.origin)
    catalog_js = catalog_js.replace(old, args.origin)
    if 'rel="canonical"' not in html:
        html = html.replace('</head>', f'<link rel="canonical" href="{args.origin}/">\n<meta property="og:url" content="{args.origin}/">\n</head>')
else:
    html = re.sub(r'^.*(?:property="og:url"|rel="canonical").*\n', '', html, flags=re.M)
    catalog_js = catalog_js.replace(json.dumps(old), 'window.location.origin')
(portfolio / 'dist/index.html').write_text(html)
(portfolio / 'dist/catalog.js').write_text(catalog_js)
(portfolio / 'README.txt').write_text('MOVA portfolio / static deployment\n\nDeploy the contents of this folder as the project root.\nFramework: Other; Build command: empty; Output directory: dist.\nRun `vercel --prod` from this directory after authenticating in the intended account.\nNo payment credentials or backend services are required. Checkout is a demo.\n\nThe package has not been deployed to Vercel by generating it.\nIf no --origin was supplied, share links use the actual visitor origin and\ncanonical/og:url tags are omitted until an assigned domain is known.\nThe social-cover image is served from the existing public MOVA site.\nRebuild with --origin https://your-assigned-domain to set final SEO URLs.\n')
shutil.copy2(ROOT / 'integrations/wordpress/VALIDATION.md', portfolio / 'VALIDATION.md')
tree_zip(portfolio, out / 'mova-vercel-portfolio.zip')

theme = out / 'mova-motion'
if theme.exists():
    shutil.rmtree(theme)
shutil.copytree(ROOT / 'integrations/wordpress/mova-motion', theme)
assets = theme / 'assets'
for name in ['product-spin.js', 'product-zoom.js', 'product-spin.css', 'cinematic-opening.js', 'cinematic-opening.css']:
    shutil.copy2(ROOT / 'dist' / name, assets / name)
# WooCommerce deep links must not show a cinematic gate during a purchase.
cinema = assets / 'cinematic-opening.js'
cinema.write_text(cinema.read_text().replace('  play(false);', '  if(options.auto!==false)play(false);'))
for path in (ROOT / 'dist/assets').iterdir():
    if path.suffix in ('.webp', '.svg'):
        shutil.copy2(path, assets / path.name)
shutil.copytree(ROOT / 'dist/assets/spin', assets / 'spin')
(theme / 'data').mkdir(exist_ok=True)
js = 'const fs=require("fs"),vm=require("vm");let c={window:{}};vm.runInNewContext(fs.readFileSync("dist/catalog.js","utf8"),c);process.stdout.write(JSON.stringify({products:c.window.MOVA_CATALOG.products}));'
catalog = json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))
(theme / 'data/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
shutil.copy2(ROOT / 'ASSETS.md', theme / 'ASSETS.md')
shutil.copy2(ROOT / 'integrations/wordpress/README.md', theme / 'README.md')
shutil.copy2(ROOT / 'integrations/wordpress/VALIDATION.md', theme / 'VALIDATION.md')
tree_zip(theme, out / 'mova-motion-woocommerce.zip', 'mova-motion')

kit = out / 'kit'
kit.mkdir(exist_ok=True)
for name in ['mova-motion-woocommerce.zip', 'mova-vercel-portfolio.zip']:
    shutil.copy2(out / name, kit / name)
shutil.copy2(ROOT / 'integrations/wordpress/START-HERE.html', kit / 'START-HERE.html')
shutil.copy2(ROOT / 'integrations/wordpress/VALIDATION.md', kit / 'VALIDATION.md')
manifest = {'portfolio_base_version': 8, 'theme_version': '0.1.0', 'origin': args.origin, 'files': {}}
for name in ['mova-motion-woocommerce.zip', 'mova-vercel-portfolio.zip']:
    b = (kit / name).read_bytes()
    manifest['files'][name] = {'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest()}
(kit / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
tree_zip(kit, out / 'mova-launch-kit.zip')
print(json.dumps({'kit': str(out / 'mova-launch-kit.zip'), 'theme': str(out / 'mova-motion-woocommerce.zip'), 'portfolio': str(out / 'mova-vercel-portfolio.zip'), 'products': len(catalog['products']), 'size': (out / 'mova-launch-kit.zip').stat().st_size}))
