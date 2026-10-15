"""A complete, projection-free MOVE sneaker assembly.

All geometry is authored in shoe coordinates (X length, Y up, Z width),
including its opening, seams, panels, laces, sculpted sole and tread.
UVs follow individual surfaces. The hero photo is a design reference only.
This is a concept model, not measured CAD of the depicted product.
"""
from pathlib import Path
import argparse, io, json, math, struct
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.interpolate import PchipInterpolator, CubicSpline
from scipy.spatial import Delaunay
from matplotlib.path import Path as PolygonPath

ROOT=Path(__file__).resolve().parents[1]
LAYERS=['UPPER','INSOLE','CAGE','MIDSOLE','OUTSOLE']
KNIT,PANEL,ORANGE,FOAM,RUBBER,LINING,LACES,CAGE=range(8)
COLORS=['#ddd6c5','#e5decd','#bc5027','#e9e1cf','#30332f','#877a65','#eee7d6','#a7b978']
NAMES=['M_KNIT_cream','M_PANEL_cream','M_ACCENT_terracotta','M_FOAM_ivory','M_RUBBER_graphite','M_LINING_warm','M_LACES_cream','M_CAGE_sage']
meshes=[]

def curve(stops):
    a=np.array(stops);return PchipInterpolator(a[:,0],a[:,1],extrapolate=True)
_width=curve([(-1.5,.035),(-1.40,.22),(-1.22,.38),(-.91,.47),(-.50,.49),(-.05,.44),(.4,.36),(.85,.385),(1.12,.35),(1.32,.24),(1.43,.035)])
_height=curve([(-1.5,.04),(-1.33,.14),(-1.07,.22),(-.77,.31),(-.48,.49),(-.18,.74),(.08,.93),(.29,.98),(.57,.87),(.88,.88),(1.19,.81),(1.43,.60)])

def width(x):return float(max(.025,_width(np.clip(x,-1.5,1.43))))
def height(x):return float(max(.04,_height(np.clip(x,-1.5,1.43))))
def rocker(x):return .028+.185*math.exp(-((x+1.47)/.32)**2)+.046*math.exp(-((x-1.40)/.30)**2)+.085*math.exp(-((x-.45)/.42)**2)
def sole_top(x):return .51+.16*math.exp(-((x-1.08)/.85)**2)+.08*math.exp(-((x+1.43)/.4)**2)-.035*math.exp(-((x+.65)/.4)**2)
def upper_point(x,a,offset=0):
    w=width(x)*.925
    return np.array([x,sole_top(x)+(height(x)+offset)*math.sin(a)+.009,(w+offset)*math.cos(a)])
def shell_y(x,z):return sole_top(x)+height(x)*math.sqrt(max(0,1-(z/(width(x)*.925))**2))+.009
def sole_point(x,side,t,offset=0):
    lower=rocker(x)+.075;top=sole_top(x)
    y=lower+(top-lower)*t
    # Lobes and recessed channels are part of the volume, not painted shadows.
    sculpt=.047*math.sin(math.pi*t)+.026*math.sin(5*x+4*t)*math.sin(math.pi*t)
    sculpt+=.009*math.cos(26*t+2*math.sin(2*x))*math.sin(math.pi*t)
    sculpt+=(.062*math.exp(-((x+.60)/.32)**2)+.045*math.exp(-((x-1.07)/.30)**2))*math.sin(math.pi*t)
    for track in [.21+.14*math.sin(2.7*x),.48+.12*math.sin(2.8*x+.9),.73+.10*math.sin(2.5*x+1.7)]:
        sculpt+=.022*math.exp(-((t-track)/.06)**2)*math.sin(math.pi*t)
    return np.array([x,y,side*(width(x)*1.085+sculpt+offset)])

def normals(v,f):
    n=np.zeros_like(v);q=v[f];face=np.cross(q[:,1]-q[:,0],q[:,2]-q[:,0])
    for k in range(3):np.add.at(n,f[:,k],face)
    n/=np.maximum(np.linalg.norm(n,axis=1)[:,None],1e-10)
    return n.astype('float32')

def add(name,layer,v,f,material,uv=None):
    v=np.asarray(v,dtype='float32');f=np.asarray(f,dtype='uint32')
    tex=np.asarray(uv,dtype='float32') if uv is not None else np.zeros((len(v),2),dtype='float32')
    used,ids=np.unique(f.flatten(),return_inverse=True);v=v[used];tex=tex[used];f=ids.reshape((-1,3)).astype('uint32')
    # Discard zero-area triangles at intentionally closed end rings.
    q=v[f];area=np.linalg.norm(np.cross(q[:,1]-q[:,0],q[:,2]-q[:,0]),axis=1);f=f[area>1e-9]
    meshes.append(dict(name=name,layer=layer,v=v,f=f,n=normals(v,f),uv=tex,material=material))

def grid(name,layer,points,nx,ny,material,uv=None):
    f=[]
    for i in range(nx-1):
        for j in range(ny-1):
            a=i*ny+j;b=a+ny;f.extend([(a,b,a+1),(a+1,b,b+1)])
    add(name,layer,points,f,material,uv)

def smooth_path(points,count=100,closed=False):
    p=np.asarray(points,dtype=float)
    if closed and not np.allclose(p[0],p[-1]):p=np.concatenate([p,p[:1]])
    d=np.r_[0,np.cumsum(np.linalg.norm(np.diff(p,axis=0),axis=1))]
    return CubicSpline(d,p,bc_type='periodic' if closed else 'natural')(np.linspace(0,d[-1],count))

def tube(name,layer,points,radius,material,sides=8,closed=False):
    p=np.array(points);v=[];f=[];uv=[];n=len(p)
    if closed and np.allclose(p[0],p[-1]):p=p[:-1];n=len(p)
    for i,q in enumerate(p):
        before=p[(i-1)%n] if closed or i>0 else p[i];after=p[(i+1)%n] if closed or i<n-1 else p[i]
        d=after-before;d/=max(np.linalg.norm(d),1e-9)
        ref=np.array([0,1,0]) if abs(d[1])<.93 else np.array([0,0,1]);a=np.cross(d,ref);a/=max(np.linalg.norm(a),1e-9);b=np.cross(d,a)
        for j in range(sides):
            theta=2*math.pi*j/sides;v.append(q+radius*(a*math.cos(theta)+b*math.sin(theta)));uv.append((i*.12,j/sides))
    for i in range(n if closed else n-1):
        for j in range(sides):
            a=i*sides+j;b=i*sides+(j+1)%sides;c=((i+1)%n)*sides+(j+1)%sides;d=((i+1)%n)*sides+j;f.extend([(a,b,c),(a,c,d)])
    if not closed:
        for j in range(1,sides-1):f.extend([(0,j+1,j),((n-1)*sides,(n-1)*sides+j,(n-1)*sides+j+1)])
    add(name,layer,v,f,material,uv)

def patch(name,layer,polygon,point_fn,material,holes=(),density=.035,offset=.016,stitch=False,reverse=False):
    perimeter=sum(np.linalg.norm(np.array(polygon[(i+1)%len(polygon)])-polygon[i]) for i in range(len(polygon)))
    boundary=smooth_path(polygon,max(16,min(100,int(perimeter/.045))),closed=True)
    def ccw(line):
        area=np.sum(line[:-1,0]*line[1:,1]-line[1:,0]*line[:-1,1])
        return line if area>0 else line[::-1]
    # The containment tolerance expands CCW contours. Clockwise borders made
    # it shrink and incorrectly discard the rim triangles, leaving white teeth.
    boundary=ccw(boundary);paths=[PolygonPath(boundary)]
    hole_lines=[ccw(smooth_path(h,52,closed=True)) for h in holes];hole_paths=[PolygonPath(h) for h in hole_lines]
    low=boundary.min(0);high=boundary.max(0);inside=[]
    for x in np.arange(low[0],high[0],density):
        for y in np.arange(low[1],high[1],density):
            p=(x,y)
            if paths[0].contains_point(p) and not any(h.contains_point(p) for h in hole_paths):inside.append(p)
    pts=np.unique(np.round(np.concatenate([boundary,*hole_lines,np.array(inside).reshape((-1,2))]),6),axis=0)
    triangles=Delaunay(pts).simplices;f=[]
    for tri in triangles:
        q=pts[tri];tests=[q.mean(0),(q[0]+q[1])*.5,(q[1]+q[2])*.5,(q[2]+q[0])*.5]
        if all(paths[0].contains_point(p,radius=.002) and not any(h.contains_point(p,radius=-.002) for h in hole_paths) for p in tests):f.append(tri)
    if reverse:f=[tri[::-1] for tri in f]
    v=[point_fn(x,y,offset) for x,y in pts]
    add(name,layer,v,f,material,pts*np.array([5,3]))
    # Raised leather/suede edge has real thickness and follows the surface.
    for j,line in enumerate([boundary,*hole_lines]):
        tube(name+'_edge_'+str(j),layer,[point_fn(x,y,offset) for x,y in line],.005,material,sides=6,closed=True)
        if stitch:
            for k in range(0,len(line)-2,4):
                pair=[point_fn(*line[k],offset+.009),point_fn(*line[k+1],offset+.009)]
                tube(name+'_stitch_'+str(j)+'_'+str(k),layer,pair,.0018,ORANGE if material==ORANGE else LINING,sides=5)

def sole_volume(name,layer,lower_fn,upper_fn,material,scale=1,sculpted=False):
    xs=np.linspace(-1.5,1.43,110 if sculpted else 84);poly=[(x,1) for x in xs]+[(x,-1) for x in xs[::-1]];n=len(poly);rings=19 if sculpted else 7 if layer=='OUTSOLE' else 3
    v=[];f=[]
    for j,t in enumerate(np.linspace(0,1,rings)):
        for x,side in poly:
            if sculpted:p=sole_point(x,side,t)
            else:p=np.array([x,lower_fn(x)*(1-t)+upper_fn(x)*t,side*width(x)*scale*(.985+.015*math.sin(math.pi*t))])
            v.append(p)
    for j in range(rings-1):
        for i in range(n):
            a=j*n+i;b=j*n+(i+1)%n;f.extend([(a,b,b+n),(a,b+n,a+n)])
    for j,offset in [(0,0),(rings-1,(rings-1)*n)]:
        centre=len(v);v.append((0,lower_fn(0) if j==0 else upper_fn(0),0))
        for i in range(n):f.append((centre,offset+i,offset+(i+1)%n) if j else (centre,offset+(i+1)%n,offset+i))
    add(name,layer,v,f,material)

def ellipsoid(name,layer,centre,axes,material,n=24,m=12):
    v=[];f=[]
    for i,a in enumerate(np.linspace(0,math.pi,m+1)):
        for j,t in enumerate(np.linspace(0,2*math.pi,n+1)):
            v.append(np.array(centre)+np.array(axes)*np.array([math.sin(a)*math.cos(t),math.cos(a),math.sin(a)*math.sin(t)]))
    for i in range(m):
        for j in range(n):
            a=i*(n+1)+j;b=a+n+1;f.extend([(a,a+1,b),(a+1,b+1,b)])
    add(name,layer,v,f,material)

def knit_texture():
    # Only a small, flat fabric swatch is reused as a local material. No shoe
    # silhouette, laces, panels or other perspective details enter this map.
    source=Image.open(ROOT/'dist/assets/sneaker.webp').convert('RGB').crop((213,677,279,720))
    a=np.asarray(source,dtype=float);h,w,_=a.shape;boundary=np.zeros_like(a)
    boundary[0]=a[-1]-a[0];boundary[-1]=a[0]-a[-1];boundary[:,0]+=a[:,-1]-a[:,0];boundary[:,-1]+=a[:,0]-a[:,-1]
    yy,xx=np.mgrid[:h,:w];denom=2*np.cos(2*np.pi*xx/w)+2*np.cos(2*np.pi*yy/h)-4;denom[0,0]=1
    smooth=np.fft.fft2(boundary,axes=(0,1))/denom[:,:,None];smooth[0,0]=0
    periodic=np.clip(a-np.fft.ifft2(smooth,axes=(0,1)).real,0,255).astype('uint8')
    im=Image.fromarray(periodic).resize((264,172),Image.Resampling.LANCZOS);b=io.BytesIO();im.save(b,'PNG');return b.getvalue()

def fabric_normal(texture):
    a=np.asarray(Image.open(io.BytesIO(texture)).convert('RGB'),dtype=float).mean(2)/255
    dx=(np.roll(a,-1,axis=1)-np.roll(a,1,axis=1))*3;dy=(np.roll(a,-1,axis=0)-np.roll(a,1,axis=0))*3
    n=np.stack([-dx,-dy,np.ones_like(a)],axis=2);n/=np.linalg.norm(n,axis=2)[:,:,None]
    im=Image.fromarray(np.clip((n*.5+.5)*255,0,255).astype('uint8'));b=io.BytesIO();im.save(b,'PNG');return b.getvalue()

def export_glb(target,texture):
    blob=bytearray();views=[];accessors=[]
    def buf(data,kind=None):
        while len(blob)%4:blob.append(0)
        view=dict(buffer=0,byteOffset=len(blob),byteLength=len(data));blob.extend(data)
        if kind:view['target']=kind
        views.append(view);return len(views)-1
    def acc(a,typ,component,kind):
        a=np.ascontiguousarray(a);obj=dict(bufferView=buf(a.tobytes(),kind),componentType=component,count=len(a),type=typ)
        if typ=='VEC3':obj.update(min=a.min(0).tolist(),max=a.max(0).tolist())
        accessors.append(obj);return len(accessors)-1
    texview=buf(texture);normalview=buf(fabric_normal(texture));materials=[]
    for i,(name,color) in enumerate(zip(NAMES,COLORS)):
        rgb=np.array([int(color[k:k+2],16)/255 for k in [1,3,5]])
        linear=np.where(rgb<=.04045,rgb/12.92,((rgb+.055)/1.055)**2.4)
        pbr=dict(baseColorFactor=[*linear.tolist(),1],roughnessFactor=.88 if i in [KNIT,ORANGE,LINING,LACES] else .66,metallicFactor=0)
        if i==KNIT:pbr.update(baseColorFactor=[1,1,1,1],baseColorTexture=dict(index=0))
        material=dict(name=name,pbrMetallicRoughness=pbr,doubleSided=True)
        if i==KNIT:material['normalTexture']=dict(index=1,scale=.35)
        materials.append(material)
    nodes=[dict(name='HERO_MOVE',scale=[.095,.095,.095],children=list(range(1,6)))]
    for layer in LAYERS:nodes.append(dict(name='LAYER_'+layer,children=[]))
    outmesh=[]
    for m in meshes:
        attrs=dict(POSITION=acc(m['v'],'VEC3',5126,34962),NORMAL=acc(m['n'],'VEC3',5126,34962),TEXCOORD_0=acc(m['uv'],'VEC2',5126,34962))
        assert len(m['v'])<65535
        ix=acc(m['f'].astype('uint16').flatten(),'SCALAR',5123,34963);outmesh.append(dict(name=m['name'],primitives=[dict(attributes=attrs,indices=ix,material=m['material'])]))
        nodes.append(dict(name=m['name'],mesh=len(outmesh)-1));nodes[1+LAYERS.index(m['layer'])]['children'].append(len(nodes)-1)
    document=dict(asset=dict(version='2.0',generator='MOVA full surface model v4'),scene=0,scenes=[dict(nodes=[0])],nodes=nodes,meshes=outmesh,materials=materials,buffers=[dict(byteLength=len(blob))],bufferViews=views,accessors=accessors,images=[dict(bufferView=texview,mimeType='image/png'),dict(bufferView=normalview,mimeType='image/png')],samplers=[dict(magFilter=9729,minFilter=9987,wrapS=10497,wrapT=10497)],textures=[dict(source=0,sampler=0),dict(source=1,sampler=0)])
    js=json.dumps(document,separators=(',',':')).encode();js+=b' '*((-len(js))%4);blob+=b'\0'*((-len(blob))%4);total=12+8+len(js)+8+len(blob)
    target.write_bytes(struct.pack('<4sII',b'glTF',2,total)+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(blob),b'BIN\0')+blob)

def strap(name,path,width_,material):
    p=smooth_path(path,38);v=[];f=[]
    for q in p:v.extend([q+np.array([0,0,-width_/2]),q+np.array([0,0,width_/2])])
    for i in range(len(p)-1):a=2*i;f.extend([(a,a+1,a+3),(a,a+3,a+2)])
    add(name,'UPPER',v,f,material)
    for s in [-1,1]:tube(name+'_selvedge_'+str(s),'UPPER',[q+np.array([0,0,s*width_/2]) for q in p],.004,ORANGE)

def build(target):
    # Foot-shaped, fully closed sole volumes, including a rocker and arch.
    sole_volume('MIDSOLE_sculpted_foam','MIDSOLE',lambda x:rocker(x)+.075,sole_top,FOAM,sculpted=True)
    sole_volume('OUTSOLE_rocker_rubber','OUTSOLE',rocker,lambda x:rocker(x)+.08,RUBBER,scale=1.06)
    sole_volume('INSOLE_contoured_cushion','INSOLE',lambda x:sole_top(x)-.020,lambda x:sole_top(x)+.007,LINING,scale=.81)
    sole_volume('CAGE_carbon_carrier','CAGE',lambda x:sole_top(x)-.19,lambda x:sole_top(x)-.171,RUBBER,scale=.82)

    # The knit shell wraps around the foot in X/theta coordinates. A real
    # elliptical opening is left in its top, with an interior lining below.
    nx,na=128,56;v=[];uv=[];f=[]
    for i,x in enumerate(np.linspace(-1.50,1.43,nx)):
        for j,a in enumerate(np.linspace(0,math.pi,na)):
            v.append(upper_point(x,a));uv.append(((x+1.5)/2.93*24,a/math.pi*14))
    for i in range(nx-1):
        for j in range(na-1):
            ids=[i*na+j,(i+1)*na+j,i*na+j+1,(i+1)*na+j+1]
            c=np.mean(np.array(v)[ids],0)
            opening=((c[0]-.83)/.35)**2+(c[2]/.225)**2<1 and .23*na<j<.77*na
            if not opening:f.extend([(ids[0],ids[1],ids[2]),(ids[2],ids[1],ids[3])])
    for start,rev in [(0,True),((nx-1)*na,False)]:
        for j in range(1,na-1):f.append((start,start+j+1,start+j) if rev else (start,start+j,start+j+1))
    add('UPPER_knit_shell','UPPER',v,f,KNIT,uv)
    rim=[]
    for t in np.linspace(0,2*math.pi,110,endpoint=False):
        x=.83+.35*math.cos(t);z=.225*math.sin(t);rim.append((x,shell_y(x,z)+.018,z))
    tube('UPPER_padded_collar','UPPER',rim,.046,PANEL,sides=12,closed=True)
    inside=[np.array(p)+np.array([0,-.28,0]) for p in rim];verts=rim+inside;faces=[];n=len(rim)
    for i in range(n):j=(i+1)%n;faces.extend([(i,j,j+n),(i,j+n,i+n)])
    add('UPPER_collar_lining','UPPER',verts,faces,LINING)

    # Toe suede cap follows the rounded volume, leaving the knitted vamp open.
    nx,na=25,66;pts=[]
    for i,t in enumerate(np.linspace(0,1,nx)):
        for a in np.linspace(0,math.pi,na):
            end=-1.08-.18*math.sin(a);x=-1.51+(end+1.51)*t;pts.append(upper_point(x,a,.012))
    grid('UPPER_toe_suede_guard','UPPER',pts,nx,na,PANEL)
    tube('UPPER_toe_stitched_border','UPPER',[upper_point(-1.08-.18*math.sin(a),a,.019) for a in np.linspace(0,math.pi,100)],.004,LINING)

    orange_poly=[(-.43,.86),(-.06,.96),(.30,.88),(.65,.64),(1.04,.33),(1.15,.20),(.76,.12),(.40,.20),(.23,.32),(-.10,.23),(-.38,.09),(-.78,.03),(-.51,.26),(-.22,.44),(.08,.51),(.42,.57),(.31,.67),(.02,.67),(-.35,.66)]
    white_front=[(-1.11,.06),(-.91,.30),(-.60,.45),(-.32,.58),(-.14,.47),(-.33,.32),(-.56,.17),(-.42,.06),(-.76,.02)]
    white_hole=[(-.82,.15),(-.70,.29),(-.53,.32),(-.45,.25),(-.66,.13)]
    eyestay=[(-.86,.86),(-.62,.99),(-.31,1.01),(.02,1.08),(.31,1.19),(.38,1.37),(.15,1.44),(-.11,1.37),(-.38,1.33),(-.70,1.19)]
    heel=[(.98,.13),(1.15,.21),(1.39,.44),(1.41,.88),(1.23,.99),(1.10,.65)]
    for side in [1,-1]:
        label='outer' if side==1 else 'inner'
        point=lambda x,a,o,side=side:upper_point(x,a if side==1 else math.pi-a,o)
        patch('UPPER_suede_orange_'+label,'UPPER',orange_poly,point,ORANGE,offset=.030,stitch=True,reverse=side<0)
        patch('UPPER_front_overlay_'+label,'UPPER',white_front,point,PANEL,holes=[white_hole],stitch=True,offset=.055,reverse=side<0)
        patch('UPPER_eyestay_'+label,'UPPER',eyestay,point,PANEL,offset=.055,stitch=True,reverse=side<0)
        patch('UPPER_heel_counter_'+label,'UPPER',heel,point,RUBBER,offset=.047,reverse=side<0)
        # Cream collar seam and protective rand frame the technical materials.
        for angle in [.055]:
            path=[point(x,angle,.064) for x in np.linspace(-1.36,1.35,120)]
            tube('UPPER_lower_rand_'+label+'_'+str(angle),'UPPER',path,.010,PANEL)
        # Eyestay tabs are actual charcoal loops, separate from the laces.
        for i,x in enumerate(np.linspace(-.70,.23,6)):
            tab=[(x-.043,1.12),(x+.037,1.12),(x+.036,1.25),(x-.042,1.25)]
            patch('UPPER_lace_tab_'+label+'_'+str(i),'UPPER',tab,point,RUBBER,density=.025,offset=.081,reverse=side<0)

        # Recessed heel inserts and arch rubber accent on the sculpted sole.
        sp=lambda x,t,o,side=side:sole_point(x,side,t,o)
        heel_insert=[(.62,.62),(.89,.81),(1.16,.79),(1.36,.59),(1.30,.30),(1.02,.31),(.85,.43)]
        arch=[(.03,.08),(.28,.41),(.59,.42),(.75,.20),(.54,.05)]
        patch('MIDSOLE_heel_insert_'+label,'MIDSOLE',heel_insert,sp,ORANGE,density=.035,offset=.028,reverse=side<0)
        patch('MIDSOLE_arch_insert_'+label,'MIDSOLE',arch,sp,RUBBER,density=.035,offset=.028,reverse=side<0)
        for k,(base,amplitude,phase) in enumerate([(.21,.14,0),(.48,.12,.9),(.73,.10,1.7)]):
            path=[sole_point(x,side,base+amplitude*math.sin(2.7*x+phase),.004) for x in np.linspace(-1.35,.40,120)]
            tube('MIDSOLE_flow_channel_'+label+'_'+str(k),'MIDSOLE',path,.009,FOAM)
        for k in range(5):
            path=[sole_point(x,side,.39+.047*k+.05*math.sin(5*x),.042) for x in np.linspace(.8,1.3,35)]
            tube('MIDSOLE_heel_rib_'+label+'_'+str(k),'MIDSOLE',path,.007,ORANGE)

    # Raised knit tongue with a leather border, independent of the main shell.
    nx,nz=38,22;pts=[];uv=[]
    for i,x in enumerate(np.linspace(-.74,.35,nx)):
        for j,t in enumerate(np.linspace(-1,1,nz)):
            z=.155*t*(1-.12*max(0,(x-.18)/.17));y=shell_y(x,z)+.032+.07*max(0,(x+.05)/.4)
            pts.append((x,y,z));uv.append(((x+.74)*11,(t+1)*2.8))
    grid('UPPER_padded_tongue','UPPER',pts,nx,nz,KNIT,uv)
    for side in [-1,1]:
        edge=[]
        for x in np.linspace(-.74,.35,70):
            z=.155*side*(1-.12*max(0,(x-.18)/.17));edge.append((x,shell_y(x,z)+.032+.07*max(0,(x+.05)/.4),z))
        tube('UPPER_tongue_border_'+str(side),'UPPER',edge,.012,PANEL)

    # A visible chain of individual cotton laces spans the domed tongue.
    for i,x in enumerate(np.linspace(-.69,.22,6)):
        points=[]
        for t in np.linspace(0,1,42):
            z=(-1 if i%2 else 1)*(.205-.410*t);xx=x+.08*(t-.5)
            y=shell_y(xx,z)+.054+.052*math.sin(math.pi*t)+.07*max(0,(xx+.05)/.4)
            points.append((xx,y,z))
        tube('UPPER_lace_'+str(i),'UPPER',points,.015,LACES,sides=10)
    tongue_y=shell_y(.29,0)+.085
    strap('UPPER_tongue_pull',[(.28,tongue_y-.09,0),(.25,tongue_y+.15,0),(.39,tongue_y+.18,0),(.46,tongue_y-.02,0)],.089,RUBBER)
    heel_y=shell_y(1.18,0)
    strap('UPPER_heel_pull',[(1.20,heel_y-.11,0),(1.20,heel_y+.12,0),(1.35,heel_y+.14,0),(1.40,heel_y-.08,0)],.075,RUBBER)

    # Internal support lattice is contained inside the closed assembly.
    for i,x in enumerate(np.linspace(-1.13,1.08,11)):
        w=width(x)*.74;y=sole_top(x)-.16
        for side in [-1,1]:
            tube('CAGE_lateral_rib_'+str(i)+'_'+str(side),'CAGE',[(x,y,side*w),(x+.13,y+.11,side*w*.75)],.012,CAGE)
        tube('CAGE_crossbeam_'+str(i),'CAGE',[(x,y+.10,-w),(x+.09,y+.10,w)],.011,CAGE)
    # A manufactured tread remains coherent from underside/end-on views.
    for i,x in enumerate(np.linspace(-1.31,1.24,13)):
        w=width(x)*.79
        for side in [-1,1]:
            ellipsoid('OUTSOLE_traction_'+str(i)+'_'+str(side),'OUTSOLE',(x,rocker(x)-.008,side*w*.62),(.070,.027,w*.36),RUBBER,n=16,m=8)
        tube('OUTSOLE_tread_channel_'+str(i),'OUTSOLE',[(x-.034,rocker(x)-.017,-w),(x+.042,rocker(x)-.017,w)],.011,RUBBER)

    texture=knit_texture();export_glb(target,texture)
    vertices=np.concatenate([m['v'] for m in meshes]);print(json.dumps(dict(file=str(target),bytes=target.stat().st_size,meshes=len(meshes),triangles=sum(len(m['f']) for m in meshes),dimensions_m=((vertices.max(0)-vertices.min(0))*.095).tolist(),method='full surface model; local material UVs; no photo projection')))
    return texture

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--out',default=str(ROOT/'dist/assets/move-solid-v4.glb'));ap.add_argument('--mesh-json');args=ap.parse_args()
    texture=build(Path(args.out))
    if args.mesh_json:
        np.savez_compressed(args.mesh_json,**{str(i)+'_'+k:m[k] for i,m in enumerate(meshes) for k in ['v','f','n','uv']},materials=np.array([m['material'] for m in meshes]),layers=np.array([LAYERS.index(m['layer']) for m in meshes]),colors=np.array(COLORS),names=np.array([m['name'] for m in meshes]))
        Path(args.mesh_json+'.png').write_bytes(texture)
        Path(args.mesh_json+'.normal.png').write_bytes(fabric_normal(texture))
