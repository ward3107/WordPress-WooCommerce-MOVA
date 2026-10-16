"""Offscreen inspection of the complete shoe asset, independent of the site.

Uses the same mesh/UV checkpoint as the GLB export. This does not exercise
browser layout, OrbitControls or a mobile WebGL driver.
"""
import argparse, math
import numpy as np
from PIL import Image
import moderngl

ap=argparse.ArgumentParser();ap.add_argument('mesh');ap.add_argument('output');ap.add_argument('--yaw',type=float,default=-35);ap.add_argument('--elev',type=float,default=16);ap.add_argument('--explode',type=float,default=0);ap.add_argument('--wire',action='store_true');ap.add_argument('--mint',action='store_true');ap.add_argument('--size',type=int,default=900);args=ap.parse_args()
data=np.load(args.mesh);ctx=moderngl.create_standalone_context(backend='egl');size=args.size
color=ctx.texture((size,size),4);depth=ctx.depth_renderbuffer((size,size));fb=ctx.framebuffer([color],depth);fb.use();fb.clear(.94,.945,.91,0);ctx.enable(moderngl.DEPTH_TEST)
program=ctx.program(vertex_shader='''#version 330
in vec3 position;in vec3 normal;in vec2 uv;uniform vec3 right;uniform vec3 up;uniform vec3 forward;uniform vec3 centre;uniform float span;uniform float lift;out vec2 texCoord;out vec3 norm;
void main(){vec3 p=position-centre+vec3(0,lift,0);gl_Position=vec4(dot(p,right)/span,dot(p,up)/span,-dot(p,forward)/6.,1.);texCoord=uv;norm=normal;}
''',fragment_shader='''#version 330
uniform sampler2D image;uniform int textured;uniform vec3 base;uniform vec3 viewDir;in vec2 texCoord;in vec3 norm;out vec4 frag;
vec3 filmic(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
 vec3 n=normalize(norm);if(!gl_FrontFacing)n=-n;
 vec3 albedo=base;if(textured==1)albedo=pow(texture(image,texCoord).rgb,vec3(2.2));
 vec3 key=normalize(vec3(-.5,1.3,1.1));vec3 fill=normalize(vec3(1.,.4,-.7));
 float light=.50+.18*max(0.,n.y)+.62*max(0.,dot(n,key))+.26*max(0.,dot(n,fill));
 float spec=.028*pow(max(0.,dot(n,normalize(key+viewDir))),25.);
 frag=vec4(pow(filmic(albedo*light+vec3(spec)),vec3(1./2.2)),1.);
}
''')
im=Image.open(args.mesh+'.png').convert('RGB').transpose(Image.Transpose.FLIP_TOP_BOTTOM);tex=ctx.texture(im.size,3,im.tobytes());tex.repeat_x=tex.repeat_y=True;tex.build_mipmaps();tex.use(0)
yaw=math.radians(args.yaw);elev=math.radians(args.elev);r=np.array([math.cos(yaw),0,-math.sin(yaw)]);u=np.array([-math.sin(elev)*math.sin(yaw),math.cos(elev),-math.sin(elev)*math.cos(yaw)]);d=np.cross(r,u)
allv=np.concatenate([data[str(i)+'_v'] for i in range(len(data['materials']))]);centre=(allv.min(0)+allv.max(0))/2
program['right'].value=tuple(r);program['up'].value=tuple(u);program['forward'].value=tuple(d);program['viewDir'].value=tuple(d);program['centre'].value=tuple(centre);program['span'].value=1.85+args.explode*.95
offset=[1.5,.6,.03,-.7,-1.42]
for i,material in enumerate(data['materials']):
    v=data[str(i)+'_v'];f=data[str(i)+'_f'];n=data[str(i)+'_n'];uv=data[str(i)+'_uv'];buffer=ctx.buffer(np.concatenate([v,n,uv],axis=1).astype('float32').tobytes());index=ctx.buffer(f.astype('uint32').tobytes());vao=ctx.vertex_array(program,[(buffer,'3f 3f 2f','position','normal','uv')],index)
    col=str(data['colors'][int(material)]);rgb=np.array([int(col[k:k+2],16)/255 for k in [1,3,5]])
    if args.mint and material==2:rgb=np.array([.388,.553,.424])
    if args.wire:rgb=np.array([.14,.25,.18])
    linear=np.where(rgb<=.04045,rgb/12.92,((rgb+.055)/1.055)**2.4)
    program['textured'].value=int(material==0 and not args.wire);program['base'].value=tuple(linear);program['lift'].value=offset[int(data['layers'][i])]*args.explode
    ctx.wireframe=args.wire and str(data['names'][i])=='UPPER_knit_shell';vao.render();ctx.wireframe=False
out=Image.frombytes('RGBA',(size,size),fb.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM);out.save(args.output,quality=91,lossless=True);print(args.output)
