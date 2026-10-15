"""Measure existing alpha cutouts; only numeric layout metadata is written.

Center and stabilize product height through the orbit without changing any
product pixels. Keep the existing measured atlas gutters intact.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
path = root / 'data/spin-layouts.json'
layouts = json.loads(path.read_text())
for name, data in layouts.items():
    alpha = np.array(Image.open(root / 'dist/assets/spin' / (name + '.webp')))[..., 3]
    x, y = data['x'], data['y']
    size = max(np.diff(x).max(), np.diff(y).max())
    boxes = []
    for n in range(12):
        cell = alpha[y[n//4]:y[n//4+1], x[n%4]:x[n%4+1]]
        ys, xs = np.where(cell > 100)
        boxes.append(dict(cx=float((xs.min()+xs.max())/2), cy=float((ys.min()+ys.max())/2),
                          w=int(xs.max()-xs.min()+1), h=int(ys.max()-ys.min()+1)))
    height = min(size * .82, size * .9 * min(b['h']/b['w'] for b in boxes))
    data['framing'] = [dict(cx=round(b['cx'], 2), cy=round(b['cy'], 2), scale=round(height/b['h'], 5)) for b in boxes]
path.write_text(json.dumps(layouts, indent=2) + '\n')
