"""Remove preview-only geometry and clipped sample wordmarks before export.
Run only in the original MOVA asset scene after inspecting the named objects.
The website supplies its own lighting and ground shadow.
"""
import bpy
from mathutils import Vector
scene=bpy.context.scene
removed=[]
# Distinct material panels need physical separation to avoid coplanar artifacts.
for name in ['UPPER_orange_wave_inner','UPPER_orange_wave_outer']:
    obj=bpy.data.objects[name]
    if not obj.get('mova_depth_separated'):
        for v in obj.data.vertices:
            x=v.co.x
            base=.45+.09*max(0,(-x-1.08)/.42)**2+.025*max(0,(x-.8)/.53)
            v.co.y*=1.028
            v.co.z=base+(v.co.z-base)*1.028
        obj.data.update()
        obj['mova_depth_separated']=True
for name in ['ENV_preview_floor','LABEL_MOVA','LABEL_MOVE / 01']:
    obj=bpy.data.objects.get(name)
    if obj:
        bpy.data.objects.remove(obj,do_unlink=True)
        removed.append(name)
camera=bpy.data.objects['CAM_main']
camera.location=(-.44,-.52,.30)
camera.rotation_euler=(Vector((0,0,.06))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.ortho_scale=.40
scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=900;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.media_type='IMAGE';scene.render.image_settings.file_format='PNG'
target=artifacts.file(name='mova-final-transparent.png',media_type='image/png')
scene.render.filepath=str(target.path)
bpy.ops.render.render(write_still=True)
target.publish()
result={'removed':removed,'root':'HERO_MOVE','layers':[o.name for o in bpy.data.objects if o.name.startswith('LAYER_')],'render':'mova-final-transparent.png'}
