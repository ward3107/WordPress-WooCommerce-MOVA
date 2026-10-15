"""Original MOVE 01 concept assembly for Blender 5.2 / 3D Jutsu.
Coordinates below use a 10 cm design grid. HERO_MOVE applies that single
conversion to metres. Semantic layer parents are preserved in the GLB.
This is an illustrative design, not a reconstruction of a real product.
"""
import bpy, math
from mathutils import Vector

DETAIL = True  # Silhouette and 28.3 cm length were verified in revision 1.
scene = bpy.context.scene

def mat(name, color, roughness=.65, metallic=0):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    b=m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value=(*color,1)
    b.inputs['Roughness'].default_value=roughness
    b.inputs['Metallic'].default_value=metallic
    return m

cream=mat('M_KNIT_cream',(.79,.75,.65),.83)
foam=mat('M_FOAM_ivory',(.86,.81,.68),.73)
rubber=mat('M_RUBBER_graphite',(.033,.043,.037),.84)
orange=mat('M_ACCENT_terracotta',(.68,.16,.046),.48)
lining=mat('M_LINING_warm',(.44,.40,.32),.88)
sage=mat('M_CAGE_sage',(.46,.57,.23),.45)
lace_mat=mat('M_LACES_cream',(.91,.87,.75),.74)

def empty(name,parent=None):
    o=bpy.data.objects.new(name,None)
    scene.collection.objects.link(o)
    if parent:o.parent=parent
    return o

def mesh(name,verts,faces,material,parent=None):
    data=bpy.data.meshes.new(name+'_geometry')
    data.from_pydata(verts,[],faces);data.update()
    obj=bpy.data.objects.new(name,data)
    scene.collection.objects.link(obj)
    if parent:obj.parent=parent
    data.materials.append(material)
    for p in data.polygons:p.use_smooth=True
    return obj

def smooth_value(u,stops):
    u=max(0,min(1,u))
    for i in range(len(stops)-1):
        a,av=stops[i];b,bv=stops[i+1]
        if a<=u<=b:
            t=(u-a)/(b-a);t=t*t*(3-2*t)
            return av+(bv-av)*t
    return stops[-1][1]

def width(u):
    return smooth_value(u,[(0,.015),(.065,.285),(.17,.465),(.32,.50),(.49,.465),(.65,.365),(.83,.38),(.935,.285),(1,.015)])

def height(u):
    return smooth_value(u,[(0,.13),(.08,.19),(.24,.25),(.39,.35),(.56,.54),(.72,.61),(.84,.60),(.94,.57),(1,.43)])

def x_for(u):return -1.5+2.83*u
def u_for(x):return (x+1.5)/2.83
def lift(x):return .09*max(0,(-x-1.08)/.42)**2+.025*max(0,(x-.8)/.53)
def surface(x,y,extra=0):
    u=max(0,min(1,u_for(x)));w=max(.02,width(u)*.94)
    return .45+lift(x)+height(u)*math.sqrt(max(0,1-(y/w)**2))+extra

def outline(n=96,scale=1):
    # Inner side is slightly narrower at the arch; toe/heel stay rounded.
    out=[]
    for i in range(n+1):
        u=i/n;out.append((x_for(u),width(u)*scale))
    for i in range(n,-1,-1):
        u=i/n;asym=1-.06*math.sin(math.pi*u)
        out.append((x_for(u),-width(u)*scale*asym))
    return out

def sole(name,z0,z1,material,parent,scale=1,bevel=.018):
    poly=outline(scale=scale);n=len(poly)
    rings=[(.98,z0),(1,z0+bevel),(1,z1-bevel),(.975,z1)]
    verts=[(x*f,y*f,z+lift(x)) for f,z in rings for x,y in poly]
    faces=[]
    for r in range(3):
        for j in range(n):
            a=r*n+j;b=r*n+(j+1)%n
            faces.append((a,b,b+n,a+n))
    faces.append(tuple(reversed(range(n))))
    faces.append(tuple(3*n+j for j in range(n)))
    return mesh(name,verts,faces,material,parent)

def upper(parent):
    nu,nv=128,64;verts=[];faces=[]
    for i in range(nu+1):
        u=i/nu;x=x_for(u);w=width(u)*.94;h=height(u)
        for j in range(nv+1):
            a=math.pi*j/nv;y=w*math.cos(a)
            verts.append((x,y,.45+lift(x)+h*math.sin(a)))
    stride=nv+1
    for i in range(nu):
        for j in range(nv):
            ids=(i*stride+j,i*stride+j+1,(i+1)*stride+j+1,(i+1)*stride+j)
            cx=sum(verts[k][0] for k in ids)/4;cy=sum(verts[k][1] for k in ids)/4
            aperture=((cx-.67)/.405)**2+(cy/.228)**2
            # Hole is only on the upper-facing part of the shell.
            if aperture<1 and 9<j<55:continue
            faces.append(ids)
    faces.append(tuple(reversed(range(stride))))
    faces.append(tuple(nu*stride+j for j in range(stride)))
    obj=mesh('UPPER_knit_shell',verts,faces,cream,parent)
    # Consistent UV coordinates allow a lightweight woven normal map in WebGL.
    uv=obj.data.uv_layers.new(name='UVMap')
    for poly in obj.data.polygons:
        for loop_index in poly.loop_indices:
            vid=obj.data.loops[loop_index].vertex_index
            uv.data[loop_index].uv=(vid//stride/nu,vid%stride/nv)
    return obj

def tube(name,points,radius,material,parent,cyclic=False,sides=8):
    # A direct mesh tube keeps draw calls and GLB conversion predictable.
    verts=[];faces=[];n=len(points)
    for i,p in enumerate(points):
        p=Vector(p)
        before=Vector(points[(i-1)%n] if cyclic or i>0 else points[i])
        after=Vector(points[(i+1)%n] if cyclic or i<n-1 else points[i])
        direction=(after-before).normalized()
        ref=Vector((0,0,1)) if abs(direction.z)<.92 else Vector((0,1,0))
        a=direction.cross(ref).normalized();b=direction.cross(a).normalized()
        for k in range(sides):
            angle=2*math.pi*k/sides;v=p+radius*(a*math.cos(angle)+b*math.sin(angle))
            verts.append(tuple(v))
    for i in range(n if cyclic else n-1):
        for k in range(sides):
            a=i*sides+k;b=i*sides+(k+1)%sides;c=((i+1)%n)*sides+(k+1)%sides;d=((i+1)%n)*sides+k
            faces.append((a,b,c,d))
    if not cyclic:
        faces.append(tuple(reversed(range(sides))));faces.append(tuple((n-1)*sides+k for k in range(sides)))
    return mesh(name,verts,faces,material,parent)

def capsule_line(name,points,radius,material,parent):return tube(name,points,radius,material,parent)

def aim(o,point):o.rotation_euler=(Vector(point)-o.location).to_track_quat('-Z','Y').to_euler()

# Only this original private asset scene is cleared.
for obj in list(bpy.data.objects):bpy.data.objects.remove(obj,do_unlink=True)
root=empty('HERO_MOVE');root.scale=(.1,.1,.1)
groups={key:empty('LAYER_'+key,root) for key in ['UPPER','INSOLE','CAGE','MIDSOLE','OUTSOLE']}
sole('OUTSOLE_base',.015,.145,rubber,groups['OUTSOLE'])
sole('MIDSOLE_foam',.145,.415,foam,groups['MIDSOLE'],bevel=.026)
sole('INSOLE_footbed',.418,.448,sage,groups['INSOLE'],scale=.90,bevel=.006)
sole('CAGE_carrier',.235,.26,orange,groups['CAGE'],scale=.87,bevel=.006)
upper(groups['UPPER'])

# Padded opening and interior: this remains separate from the visible outer shell.
rim=[];inside=[]
for i in range(96):
    a=2*math.pi*i/96;x=.67+.405*math.cos(a);y=.228*math.sin(a);z=surface(x,y,.008)
    rim.append((x,y,z));inside.append((x,y,z-.16))
tube('UPPER_padded_collar',rim,.033,lining,groups['UPPER'],cyclic=True,sides=12)
faces=[(i,(i+1)%96,96+(i+1)%96,96+i) for i in range(96)]
mesh('UPPER_inner_lining',rim+inside,faces,lining,groups['UPPER'])

if DETAIL:
    def shell_point(x,a,offset=.012):
        u=max(0,min(1,u_for(x)));w=width(u)*.94
        return (x,(w+offset)*math.cos(a),.45+lift(x)+(height(u)+offset)*math.sin(a))

    def ribbon(name,stops,material,side=1,halfwidth=.10):
        verts=[];faces=[];n=100
        for i in range(n+1):
            t=i/n;x=stops[0][0]+(stops[-1][0]-stops[0][0])*t
            normalized=[((a-stops[0][0])/(stops[-1][0]-stops[0][0]),b) for a,b in stops]
            angle=smooth_value(t,normalized)
            if side<0:angle=math.pi-angle
            for j in range(4):
                a=angle+halfwidth*(j/3*2-1);verts.append(shell_point(x,a,.015))
        for i in range(n):
            for j in range(3):
                a=i*4+j;faces.append((a,a+1,a+5,a+4))
        o=mesh(name,verts,faces,material,groups['UPPER'])
        # Small thickness catches real edge highlights from every angle.
        solid=o.modifiers.new('panel_thickness','SOLIDIFY');solid.thickness=.008
        return o

    # Original flowing panels, fitted to the actual upper rather than flat decals.
    wave=[(-1.12,2.68),(-.88,2.34),(-.48,2.26),(-.10,2.20),(.22,2.40),(.60,2.57),(.98,2.37)]
    for side in [1,-1]:
        suffix='outer' if side==1 else 'inner'
        ribbon('UPPER_orange_wave_'+suffix,wave,orange,side,.15)
        ribbon('UPPER_lower_guard_'+suffix,[(-1.31,2.95),(-.93,2.87),(-.32,2.83),(.30,2.90),(.98,2.85)],lace_mat,side,.075)
        # Seam paths follow the same changing profile.
        for seam in [2.96,2.77]:
            points=[shell_point(-1.26+2.4*i/100,seam if side==1 else math.pi-seam,.019) for i in range(101)]
            tube('UPPER_seam_'+suffix+'_'+str(seam),points,.0055,lining,groups['UPPER'])

    # Tongue has its own padded raised surface.
    tongue_verts=[];tongue_faces=[]
    for i in range(32):
        x=-.66+.91*i/31
        for j in range(13):
            y=-.145+.29*j/12;edge=math.sin(math.pi*j/12)
            tongue_verts.append((x,y,surface(x,y,.011)+.018*edge))
    for i in range(31):
        for j in range(12):
            a=i*13+j;tongue_faces.append((a,a+1,a+14,a+13))
    mesh('UPPER_padded_tongue',tongue_verts,tongue_faces,lace_mat,groups['UPPER'])
    for y in [-.151,.151]:
        tube('UPPER_eyestay_'+str(y),[(-.70+.95*i/40,y,surface(-.70+.95*i/40,y,.028)) for i in range(41)],.018,cream,groups['UPPER'])

    for i in range(6):
        x=-.64+.145*i
        for side in [-1,1]:
            cy=.151*side
            eye=[(x+.022*math.cos(a),cy+.020*math.sin(a),surface(x+.022*math.cos(a),cy+.020*math.sin(a),.039)) for a in [2*math.pi*k/20 for k in range(20)]]
            tube('UPPER_eyelet_'+str(i)+'_'+str(side),eye,.006,rubber,groups['UPPER'],cyclic=True)
        if i<5:
            for side in [-1,1]:
                lace=[]
                for j in range(30):
                    t=j/29;xx=x+.145*t;yy=side*(-.15+.30*t)
                    zz=surface(xx,yy,.035)+.018*math.sin(math.pi*t)
                    lace.append((xx,yy,zz))
                tube('UPPER_lace_'+str(i)+'_'+str(side),lace,.012,lace_mat,groups['UPPER'])

    # Heel counter, seam, and pull tab retain their own meshes for wireframe mode.
    for side in [1,-1]:
        ribbon('UPPER_heel_counter_'+str(side),[(.76,2.65),(1.10,2.50),(1.27,2.4)],rubber,side,.24)
    tab=[(1.08,0,surface(1.08,0,.015)),(1.15,0,1.10),(1.25,0,1.12),(1.29,0,.98)]
    tube('UPPER_heel_pull',tab,.024,rubber,groups['UPPER'],sides=12)
    tube('UPPER_heel_pull_accent',[(x,-.022,z) for x,y,z in tab],.007,orange,groups['UPPER'])

    # Fine stitched dashes are consolidated so they do not become many draw calls.
    stitches=[]
    for side in [-1,1]:
        for i in range(34):
            x=-1.15+.064*i
            angle=2.75 if side==1 else math.pi-2.75
            p=shell_point(x,angle,.028);q=shell_point(x+.024,angle,.028)
            stitches.append(tube('UPPER_stitch_'+str(side)+'_'+str(i),[p,q],.0035,lace_mat,groups['UPPER'],sides=5))
    bpy.ops.object.select_all(action='DESELECT')
    for o in stitches:o.select_set(True)
    bpy.context.view_layer.objects.active=stitches[0];bpy.ops.object.join();stitches[0].name='UPPER_stitched_detail'

    # Sculpted midsole lines and a warm heel insert.
    poly=outline()
    for z in [.225,.337]:
        points=[(x*1.003,y*1.003,z+lift(x)+.014*math.sin(x*4)) for x,y in poly]
        tube('MIDSOLE_contour_'+str(z),points,.0055,lining,groups['MIDSOLE'],cyclic=True)
    for side in [-1,1]:
        points=[]
        for i in range(64):
            a=2*math.pi*i/64;xx=.86+.21*math.cos(a);yy=side*width(u_for(xx))*1.003
            points.append((xx,yy,.265+.064*math.sin(a)))
        verts=[(.86,side*width(u_for(.86))*1.004,.265)]+points
        mesh('MIDSOLE_heel_insert_'+str(side),verts,[(0,i+1,(i+1)%64+1) for i in range(64)],orange,groups['MIDSOLE'])

    def box(name,center,size,material,parent,bevel=.008):
        cx,cy,cz=center;sx,sy,sz=[a/2 for a in size]
        v=[(cx+dx*sx,cy+dy*sy,cz+dz*sz) for dx,dy,dz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
        o=mesh(name,v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],material,parent)
        mod=o.modifiers.new('manufactured_edges','BEVEL');mod.width=bevel;mod.segments=2
        return o

    for i,x in enumerate([-.99,-.76,-.53,-.30,-.07,.16,.39,.62,.85,1.08]):
        w=width(u_for(x))*.80
        for side in [-1,1]:
            box('OUTSOLE_traction_'+str(i)+'_'+str(side),(x,side*w*.52,.017+lift(x)),(.14,w*.78,.035),rubber if i%3 else orange,groups['OUTSOLE'])

    # A distinct geometric support layer appears only when the shell separates.
    carrier=bpy.data.objects['CAGE_carrier'];carrier.data.materials[0]=rubber
    for i,x in enumerate([-.98,-.75,-.52,-.29,-.06,.17,.40,.63,.86]):
        w=width(u_for(x))*.79
        for side in [-1,1]:
            for flip in [0,1]:
                p=(x,side*w,.20 if flip==0 else .33);q=(x+.18,side*w,.33 if flip==0 else .20)
                tube('CAGE_lattice_'+str(i)+'_'+str(side)+'_'+str(flip),[p,q],.014,sage,groups['CAGE'])
        tube('CAGE_crossbeam_'+str(i),[(x,-w,.31),(x,w,.31)],.014,sage,groups['CAGE'])
    for yscale in [-1,1]:
        tube('CAGE_rail_'+str(yscale),[(x_for(.10+.8*i/65),yscale*width(.10+.8*i/65)*.82,.22+lift(x_for(.10+.8*i/65))) for i in range(66)],.012,orange,groups['CAGE'])

    # Small original wordmarks, converted to meshes so they survive export.
    for label,x,y,z,size,material,parent in [('MOVE / 01',-.33,-.431,.285,.068,rubber,groups['MIDSOLE']),('MOVA',-.09,-.012,.775,.080,rubber,groups['UPPER'])]:
        data=bpy.data.curves.new('brand_'+label,'FONT');data.body=label;data.size=size;data.extrude=.0006
        obj=bpy.data.objects.new('LABEL_'+label,data);scene.collection.objects.link(obj);obj.parent=parent
        obj.location=(x,y,z);obj.rotation_euler=(math.pi/2,0,0);data.materials.append(material)
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj;bpy.ops.object.convert(target='MESH')

    # Procedural knit detail for the inspected render; WebGL supplies its own UV normal map.
    nodes=cream.node_tree.nodes;links=cream.node_tree.links
    noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=190;noise.inputs['Detail'].default_value=2
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.18;bump.inputs['Distance'].default_value=.001
    links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])

# Original asset preview rig; viewer imports HERO_MOVE only.
floor=mesh('ENV_preview_floor',[(-1,-1,0),(1,-1,0),(1,1,0),(-1,1,0)],[(0,1,2,3)],mat('M_STAGE_paper',(.86,.85,.80),.9))
camera_data=bpy.data.cameras.new('CAM_main');camera=bpy.data.objects.new('CAM_main',camera_data)
scene.collection.objects.link(camera);camera.location=(-.44,-.52,.30);aim(camera,(0,0,.06))
camera_data.type='ORTHO';camera_data.ortho_scale=.43;scene.camera=camera
for name,kind,loc,energy,color in [('LGT_key','SUN',(-.3,-.4,.65),2.2,(1,.93,.83)),('LGT_fill','POINT',(.15,.25,.36),18,(.83,.90,1))]:
    data=bpy.data.lights.new(name,kind);data.energy=energy;data.color=color
    if kind=='SUN':data.angle=.3
    else:data.shadow_soft_size=.16
    light=bpy.data.objects.new(name,data);scene.collection.objects.link(light);light.location=loc;aim(light,(0,0,.055))
scene.world=bpy.data.worlds.get('MOVA_world') or bpy.data.worlds.new('MOVA_world');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.86,.85,.80,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.4
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=900;scene.render.resolution_y=680;scene.render.resolution_percentage=100
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG'
target=artifacts.file(name='mova-detail.png' if DETAIL else 'mova-silhouette.png',media_type='image/png')
scene.render.filepath=str(target.path);bpy.ops.render.render(write_still=True);target.publish()
bpy.context.view_layer.update()
hero_meshes=[o for o in root.children_recursive if o.type=='MESH']
bounds=[o.matrix_world@Vector(v) for o in hero_meshes for v in o.bound_box]
result={'root':root.name,'layers':[g.name for g in groups.values()],'hero_meshes':len(hero_meshes),'vertices':sum(len(o.data.vertices) for o in hero_meshes),'dimensions_m':[max(v[i] for v in bounds)-min(v[i] for v in bounds) for i in range(3)],'render':'mova-detail.png' if DETAIL else 'mova-silhouette.png'}
