jQuery(function($) {
	$.fn.retina = function(holder,options){
		var retina = $(this), holder;
		if(holder) { holder = $(holder);} else {holder = retina.parent('div')}
		
		var	
			left = 0,scaleX = 0,
			top = 0,scaleY = 0,
			offset = { left: holder.offset().left, top: holder.offset().top };
			
		
		var sizes ={
			retina: { width:retina.width(), height:retina.height() }, 
			oImg:{ width:holder.children('img').width(), height:holder.children('img').height()},// origin image size
			zImg:{width:retina.next('div').width(),height:retina.next('div').height()}// zoom image size
			//scale:{ x:(imgW-retina.width())/holder.width(), 
				//	y:(imgH-retina.height())/holder.height() } 
		}
		
		var retinaPara = function(event){
			this.holderleft = event.pageX - offset.left;
			this.holdertop = event.pageY - offset.top; 
			this.scaleX = (sizes.zImg.width - sizes.retina.width)/sizes.oImg.width;
			this.scaleY = (sizes.zImg.height - sizes.retina.height)/sizes.oImg.height;
			
			return {
						left: this.holderleft - retina.width()/2,
						top: this.holdertop - retina.height()/2,
						backgroundPosition : (this.scaleX*this.holderleft*(-1))+'px '+(this.scaleY*this.holdertop*(-1))+'px'
					};
		}

		return this.each(function(){
		
			//If options exist, merge them with default settings
			if (options) {
				$.extend (sizes, options);
			}
			
			//begin
			if(navigator.userAgent.indexOf('Chrome')!=-1)
			{
				/*	Applying a special chrome curosor,
					as it fails to render completely blank curosrs. */
					
				retina.addClass('chrome');
			}
			
			holder.mousemove(function(e){

				left = (e.pageX-offset.left);
				top = (e.pageY-offset.top); 

			
				scaleX = (sizes.zImg.width - sizes.retina.width)/sizes.oImg.width;
				scaleY = (sizes.zImg.height - sizes.retina.height)/sizes.oImg.height;
				
				var movePara = new retinaPara(e); 

				if(retina.is(':not(:animated):hidden')){
					/* Fixes a bug where the retina div is not shown */
					holder.trigger('mouseenter');
				}

				if(left<0 || top<0 || left > sizes.oImg.width || top > sizes.oImg.height)
				{
					/*	If we are out of the bondaries of the
						holder screenshot, hide the retina div */

					if(!retina.is(':animated')){
						holder.trigger('mouseleave');
					}
					return false;
				}

				/*	Moving the retina div with the mouse
					(and scrolling the background) */
				
				retina.css({
					left				: movePara.left,
					top					: movePara.top,
					backgroundPosition	: movePara.backgroundPosition
				});
				
				
			}).mouseleave(function(){
				retina.stop(true,true).fadeOut('fast');
			}).mouseenter(function(){
				retina.stop(true,true).fadeIn('fast');
			});
			

			
				
			holder.mousewheel(function(objEvent, intDelta){ 
				var retinaZoom = 0,zoomRadius = 0;
				var scale = retina.width() * 0.2 * intDelta;
				
				retinaZoom = retina.width() + scale;
				
				if(objEvent.preventDefault){
					objEvent.preventDefault();}
				
				if(retinaZoom >= sizes.retina.width*0.5 && retinaZoom <= (sizes.zImg.width-(sizes.oImg.width - sizes.retina.width/2)*scaleX)/2){
					retina.width(retinaZoom).height(retinaZoom).css({
						left : retina.offset().left - offset.left - scale/2,
						top : retina.offset().top - offset.top - scale/2
					});
				}
			});

		});
		
	}
})