"""MOVE anatomy revision 5: geometry authored against the original product image.

Reuses the mesh writer and unchanged local fabric swatch from revision 4.
The visible side is the reference; hidden surfaces remain an inferred concept.
"""
from pathlib import Path
import argparse, importlib.util, io, json, math, struct
import numpy as np
from scipy.optimize import least_squares

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('solid', ROOT/'scripts/build-solid-shoe.py')
b = importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
K,P,O,F,R,L,C,G = b.KNIT,b.PANEL,b.ORANGE,b.FOAM,b.RUBBER,b.LINING,b.LACES,b.CAGE
W = b.curve([(-1.80,.025),(-1.70,.22),(-1.48,.43),(-1.10,.53),(-.60,.53),(-.12,.45),(.35,.365),(.80,.385),(1.17,.36),(1.39,.25),(1.49,.03)])
TOP = b.curve([(-1.80,.56),(-1.703,.608),(-1.423,.557),(-1.01,.532),(-.644,.448),(-.221,.464),(-.008,.487),(.233,.56),(.533,.59),(.794,.70),(1.052,.732),(1.22,.66),(1.49,.46)])
CENTRE = b.curve([(-1.80,.60),(-1.695,.65),(-1.286,.746),(-.88,.812),(-.556,.88),(-.284,1.126),(-.031,1.384),(.185,1.499),(.338,1.314),(.491,1.151),(.67,1.245),(.863,1.344),(1.05,1.349),(1.181,1.219),(1.391,.836),(1.49,.57)])
BOTTOM = b.curve([(-1.80,.48),(-1.694,.36),(-1.431,.253),(-1.067,.146),(-.692,.164),(-.329,.112),(-.035,.184),(.152,.214),(.329,.208),(.523,.088),(.88,.081),(1.25,.09),(1.49,.10)])
def width(x): return float(max(.025,W(np.clip(x,-1.80,1.49))))
def top(x): return float(TOP(np.clip(x,-1.80,1.49)))-.052*math.exp(-((x+.40)/.39)**2)-.018*math.exp(-((x-.28)/.27)**2)
def height(x): return float(max(.04,CENTRE(np.clip(x,-1.80,1.49))-top(x)))
def rocker(x): return float(BOTTOM(np.clip(x,-1.80,1.49)))
def upper(x,a,o=0):
    # A broad, rounded forefoot and a higher instep replace the narrow old shell.
    return np.array([x,top(x)+(height(x)+o)*max(0,math.sin(a))**.84+.009,(width(x)*.925+o)*math.cos(a)])
def shell_y(x,z): return top(x)+height(x)*max(0,1-(z/(width(x)*.925))**2)**.42+.009
def sole(x,side,t,o=0):
    x=float(x); t=float(t); bottom=rocker(x)+.055
    bulb=.055*math.sin(math.pi*t)
    for centre,level,amount,spread in [(-1.15,.2,.075,.28),(-.65,.34,.085,.31),(-.20,.22,.12,.23),(.22,.66,.10,.30),(1.12,.59,.11,.33)]:
        bulb+=amount*math.exp(-((x-centre)/spread)**2-((t-level)/.29)**2)*math.sin(math.pi*t)
    for level in [.19+.44*math.exp(-((x-.3)/.68)**2),.45+.37*math.exp(-((x-.40)/.7)**2),.75+.12*math.sin(2.5*x)]:
        bulb+=.043*math.exp(-((t-level)/.065)**2)*math.sin(math.pi*t)
    return np.array([x,bottom+(top(x)-bottom)*t,side*(width(x)*1.10+bulb*.65+o)])

def sole_volume(name,layer,lo,hi,material,scale=1,sculpted=False):
    xs=np.linspace(-1.80,1.49,100 if sculpted else 60)
    outline=[(x,1) for x in xs]+[(x,-1) for x in xs[::-1]]
    n=len(outline); rings=22 if sculpted else 4; v=[]; f=[]
    for t in np.linspace(0,1,rings):
        for x,s in outline:
            v.append(sole(x,s,t) if sculpted else [x,lo(x)*(1-t)+hi(x)*t,s*width(x)*scale*(.98+.02*math.sin(math.pi*t))])
    for j in range(rings-1):
        for i in range(n):
            a=j*n+i; c=j*n+(i+1)%n; f.extend([(a,c,c+n),(a,c+n,a+n)])
    # Crosswise cap strips follow the rocker, unlike a flat fan from the center.
    for ring,flip in [(0,True),(rings-1,False)]:
        start=ring*n
        for i in range(len(xs)-1):
            a=start+i; c=start+i+1; d=start+n-1-i; e=start+n-2-i
            faces=[(a,c,d),(c,e,d)]
            f.extend([tuple(reversed(q)) if flip else q for q in faces])
    b.add(name,layer,v,f,material)

def patch(name,polygon,point,material,holes=(),offset=.025,stitch=False,reverse=False,density=.055):
    b.patch(name,'UPPER',polygon,point,material,holes=holes,offset=offset,stitch=stitch,reverse=reverse,density=density)

REFERENCE=json.loads((ROOT/'data/move-reference-landmarks.json').read_text())
def project(point):
    pose=REFERENCE['pose']; yaw,elev,roll=np.radians([pose['yaw'],pose['elevation'],pose['roll']])
    right=np.array([np.cos(yaw),0,-np.sin(yaw)])
    up=np.array([-np.sin(elev)*np.sin(yaw),np.cos(elev),-np.sin(elev)*np.cos(yaw)])
    x,y=np.dot(point,right),np.dot(point,up)
    return np.array([pose['scale']*(np.cos(roll)*x-np.sin(roll)*y)+pose['cx'],pose['cy']-pose['scale']*(np.sin(roll)*x+np.cos(roll)*y)])
def trace(key, surface='upper'):
    point=(lambda x,a:upper(x,a,.04)) if surface=='upper' else (lambda x,a:sole(x,1,a,.026))
    result=[]
    for pixel in REFERENCE[key]:
        seed=np.clip((pixel[0]-REFERENCE['pose']['cx'])/REFERENCE['pose']['scale'],-1.78,1.47)
        fits=[least_squares(lambda q:project(point(*q))-pixel,[seed,a],bounds=([-1.79,.003],[1.48,1.57 if surface=='upper' else .997])) for a in ([.2,.7,1.3] if surface=='upper' else [.1,.5,.9])]
        result.append(min(fits,key=lambda fit:np.linalg.norm(fit.fun)).x.tolist())
    return result

def build(target):
    b.meshes.clear()
    b.width=width;b.height=height;b.upper_point=upper;b.shell_y=shell_y;b.sole_top=top;b.rocker=rocker;b.sole_point=sole
    b.COLORS[:]=['#ded6c3','#ded6c4','#b94a22','#e9e1ce','#30312f','#9c907a','#ece3ce','#a7b978']
    sole_volume('MIDSOLE_sculpted_foam','MIDSOLE',lambda x:rocker(x)+.055,top,F,sculpted=True)
    sole_volume('OUTSOLE_rocker_rubber','OUTSOLE',rocker,lambda x:rocker(x)+.057,R,scale=1.10)
    sole_volume('INSOLE_contoured_cushion','INSOLE',lambda x:top(x)-.025,lambda x:top(x)+.006,L,scale=.79)
    sole_volume('CAGE_carbon_carrier','CAGE',lambda x:top(x)-.18,lambda x:top(x)-.163,R,scale=.80)

    nx,na=105,48; v=[]; uv=[]; faces=[]
    for x in np.linspace(-1.80,1.49,nx):
        for a in np.linspace(0,math.pi,na):v.append(upper(x,a));uv.append(((x+1.80)/3.29*11,a/math.pi*8))
    for i in range(nx-1):
        for j in range(na-1):
            ids=[i*na+j,(i+1)*na+j,i*na+j+1,(i+1)*na+j+1];c=np.mean(np.array(v)[ids],0)
            opening=((c[0]-.84)/.375)**2+(c[2]/.242)**2<1 and .20*na<j<.80*na
            if not opening:faces.extend([(ids[0],ids[1],ids[2]),(ids[2],ids[1],ids[3])])
    for start in [0,(nx-1)*na]:
        for j in range(1,na-1):faces.append((start,start+j,start+j+1))
    b.add('UPPER_knit_shell','UPPER',v,faces,K,uv)
    rim=[]
    for t in np.linspace(0,2*math.pi,90,endpoint=False):
        x=.84+.375*math.cos(t);z=.242*math.sin(t);rim.append((x,shell_y(x,z)+.028,z))
    b.tube('UPPER_padded_collar','UPPER',rim,.060,P,sides=10,closed=True)
    inside=[np.array(p)+np.array([0,-.33,0]) for p in rim];n=len(rim)
    b.add('UPPER_collar_lining','UPPER',rim+inside,[(i,(i+1)%n,(i+1)%n+n) for i in range(n)]+[(i,(i+1)%n+n,i+n) for i in range(n)],L)

    # Broad toe bumper with a curved mesh boundary, rather than a straight seam.
    pts=[]; nx,na=16,46
    edge=lambda a:-1.08-.48*max(0,math.sin(a))**1.3
    for t in np.linspace(0,1,nx):
        for a in np.linspace(0,math.pi,na):pts.append(upper(-1.81+(edge(a)+1.81)*t,a,.017))
    b.grid('UPPER_toe_suede_guard','UPPER',pts,nx,na,P)
    for delta,mat in [(0,P),(.023,L)]:
        b.tube('UPPER_toe_border_'+str(delta),'UPPER',[upper(edge(a)+delta,a,.030) for a in np.linspace(0,math.pi,80)],.006 if mat==P else .0025,mat)

    # Three distinct branches and two knit windows reproduce the reference's
    # orange quarter panel. Cream overlays frame the front window and eyestay.
    orange=trace('orange'); orange_hole=trace('orangeHole')
    foreframe=trace('foreframe');forehole=trace('forehole')
    eyestay=trace('eyestay');heel=trace('heel');collar_frame=trace('collarFrame')
    webbing=trace('webbing')
    for side in [1,-1]:
        label='outer' if side==1 else 'inner';point=lambda x,a,o,side=side:upper(x,a if side==1 else math.pi-a,o)
        patch('UPPER_suede_orange_'+label,orange,point,O,holes=[orange_hole],offset=.035,stitch=True,reverse=side<0)
        patch('UPPER_front_overlay_'+label,foreframe,point,P,holes=[forehole],offset=.055,stitch=True,reverse=side<0)
        patch('UPPER_eyestay_'+label,eyestay,point,P,offset=.048,stitch=True,reverse=side<0)
        patch('UPPER_collar_frame_'+label,collar_frame,point,P,offset=.038,stitch=True,reverse=side<0)
        patch('UPPER_heel_counter_'+label,heel,point,R,offset=.045,reverse=side<0)
        # Small orange forefoot inset is a separate detail in the photo.
        patch('UPPER_forefoot_accent_'+label,trace('forefootAccent'),point,O,offset=.070,stitch=True,reverse=side<0)
        for i,(x,a) in enumerate(webbing):
            patch('UPPER_lace_webbing_'+label+'_'+str(i),[(x-.047,a-.075),(x+.035,a-.075),(x+.044,a-.06),(x+.044,a+.10),(x+.035,a+.115),(x-.047,a+.115),(x-.056,a+.10),(x-.056,a-.06)],point,R,offset=.078,reverse=side<0,density=.04)
        # Heel counter ribs and stitch seams have actual raised profiles.
        for i in range(3):
            path=[point(x,a,.056) for x,a in b.smooth_path(trace('heelRidge'+str(i)),32)]
            b.tube('UPPER_heel_rib_'+label+str(i),'UPPER',path,.006,R,sides=6)
        b.tube('UPPER_sole_welt_'+label,'UPPER',[point(x,.045,.05) for x in np.linspace(-1.43,1.40,85)],.012,P)

        sp=lambda x,t,o,side=side:sole(x,side,t,o)
        heel_inset=trace('heelInsert','sole')
        arch=trace('archInsert','sole')
        b.patch('MIDSOLE_heel_insert_'+label,'MIDSOLE',heel_inset,sp,O,offset=.022,reverse=side<0,density=.045)
        b.patch('MIDSOLE_arch_insert_'+label,'MIDSOLE',arch,sp,R,offset=.026,reverse=side<0,density=.045)
        # Diagonal molded ridges flow around the arch and into the heel insert.
        for k in range(7):
            path=[sp(x,.16+.064*k+.31*math.exp(-((x+.08)/.29)**2),.004) for x in np.linspace(-.64,.10,60)]
            b.tube('MIDSOLE_forefoot_rib_'+label+str(k),'MIDSOLE',path,.011,F,sides=6)
        for k in range(3):
            path=[sp(x,.22+.16*k+.10*math.sin(3*x),.004) for x in np.linspace(-1.49,-.59,55)]
            b.tube('MIDSOLE_toe_flow_'+label+str(k),'MIDSOLE',path,.012,F,sides=6)
        for key,count,mat,radius in [('heelGrip',5,O,.008),('archGrip',4,R,.007)]:
            for k in range(count):
                path=[sp(x,t,.037) for x,t in b.smooth_path(trace(key+str(k),'sole'),28)]
                b.tube('MIDSOLE_'+key+'_'+label+str(k),'MIDSOLE',path,radius,mat,sides=6)

    # A broad, taller padded tongue; thicker laces bridge the charcoal webbing.
    nx,nz=34,20;pts=[];uv=[]
    def tongue(x,z):return shell_y(x,z)+.037+.115*max(0,(x+.1)/.5)
    for x in np.linspace(-.65,.27,nx):
        for t in np.linspace(-1,1,nz):
            z=.205*t*(1-.08*max(0,(x-.2)/.2));pts.append((x,tongue(x,z),z));uv.append(((x+.65)*3.8,(t+1)*1.55))
    b.grid('UPPER_padded_tongue','UPPER',pts,nx,nz,K,uv)
    for side in [-1,1]:
        b.tube('UPPER_tongue_border_'+str(side),'UPPER',[(x,tongue(x,.202*side),.202*side) for x in np.linspace(-.63,.27,65)],.014,P)
    for i,(x,a) in enumerate([(-.72,1.05)]+webbing):
        reach=(width(x)*.925+.082)*math.cos(a)
        for diagonal in [-1,1]:
            path=[]
            for t in np.linspace(0,1,36):
                z=reach*(1-2*t);xx=x+diagonal*.068*(t-.5)
                edge_y=upper(xx,a,.085)[1]
                y=max(edge_y,shell_y(xx,z)+.06)+.02*math.sin(math.pi*t)+(0.018 if diagonal>0 else 0)
                path.append((xx,y,z))
            b.tube('UPPER_cotton_lace_'+str(i)+'_'+str(diagonal),'UPPER',path,.023,C,sides=8)
    ty=tongue(.20,0)
    b.strap('UPPER_tongue_pull',[(.18,ty-.07,0),(.14,ty+.16,0),(.26,ty+.19,0),(.35,ty-.03,0)],.112,R)
    hy=shell_y(1.19,0)
    b.strap('UPPER_heel_pull',[(1.22,hy-.11,0),(1.20,hy+.16,0),(1.36,hy+.18,0),(1.43,hy-.08,0)],.10,R)
    # A graphite toe bumper rises above the segmented outsole, as in the photo.
    pts=[]
    for t in np.linspace(0,1,14):
        for a in np.linspace(0,math.pi,36):
            x=-1.82+(.21-.08*math.sin(a))*t;p=upper(x,a,.055);pts.append(p)
    b.grid('OUTSOLE_toe_bumper','OUTSOLE',pts,14,36,R)
    for i,x in enumerate(np.linspace(-1.37,1.29,14)):
        w=width(x)*.78
        for side in [-1,1]:b.ellipsoid('OUTSOLE_traction_'+str(i)+'_'+str(side),'OUTSOLE',(x,rocker(x)-.008,side*w*.72),(.082,.035,w*.30),R,n=12,m=6)
    for i,x in enumerate(np.linspace(-1.13,1.12,11)):
        w=width(x)*.73;y=top(x)-.15
        for side in [-1,1]:b.tube('CAGE_lateral_rib_'+str(i)+'_'+str(side),'CAGE',[(x,y,side*w),(x+.12,y+.10,side*w*.76)],.012,G,sides=6)
        b.tube('CAGE_crossbeam_'+str(i),'CAGE',[(x,y+.09,-w),(x+.08,y+.09,w)],.011,G,sides=6)

    # Reuse the existing fabric bytes; no silhouette is projected onto the mesh.
    raw=(ROOT/'data/move-source-v4.glb').read_bytes();length=struct.unpack_from('<I',raw,12)[0]
    doc=json.loads(raw[20:20+length]);binstart=20+length+8;view=doc['bufferViews'][doc['images'][0]['bufferView']]
    texture=raw[binstart+view.get('byteOffset',0):binstart+view.get('byteOffset',0)+view['byteLength']]
    b.export_glb(target,texture)
    return texture

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--out',default=str(ROOT/'dist/assets/move-anatomy-v5.glb'));ap.add_argument('--mesh-json');args=ap.parse_args()
    texture=build(Path(args.out))
    if args.mesh_json:
        np.savez_compressed(args.mesh_json,**{str(i)+'_'+k:m[k] for i,m in enumerate(b.meshes) for k in ['v','f','n','uv']},materials=np.array([m['material'] for m in b.meshes]),layers=np.array([b.LAYERS.index(m['layer']) for m in b.meshes]),colors=np.array(b.COLORS),names=np.array([m['name'] for m in b.meshes]))
        Path(args.mesh_json+'.png').write_bytes(texture)
        Path(args.mesh_json+'.normal.png').write_bytes(b.fabric_normal(texture))
    print(json.dumps({'file':args.out,'bytes':Path(args.out).stat().st_size,'meshes':len(b.meshes),'vertices':sum(len(m['v']) for m in b.meshes),'triangles':sum(len(m['f']) for m in b.meshes)}))
