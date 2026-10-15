/* Native WordPress media selection; no credentials or external uploads. */
jQuery(function($){
 'use strict';
 let media;
 $('#mova-select-atlas').on('click',function(){
  if(!media){
   media=wp.media({library:{type:'image'},multiple:false});
   media.on('select',function(){const selected=media.state().get('selection').first();if(selected)$('#_mova_spin_attachment').val(selected.id).trigger('change');});
  }
  media.open();
 });
});
