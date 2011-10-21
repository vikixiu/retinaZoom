jQuery(function($) {
	$.fn.retina = function(holder,options){
		
		var retina = $(this),
			holder = $(holder),
			left = 0,scaleX = 0,
			top = 0,scaleY = 0;
			imgW = retina.next('div').width(),
			imgH = retina.next('div').height(),
			offset = { left: holder.offset().left, top: holder.offset().top };
			//sizes = { retina: { width:190, height:190 }, holder:{ width:500, height:283 } };
		console.log(retina.next('div').width());
		var sizes ={
			retina: { width:retina.width(), height:retina.height() }, 
			holder:{ width:holder.children('img').width(), height:holder.children('img').height()}
			//scale:{ x:(imgW-retina.width())/holder.width(), 
				//	y:(imgH-retina.height())/holder.height() } 
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

			
				scaleX = (imgW - sizes.retina.width)/sizes.holder.width;
				scaleY = (imgH - sizes.retina.height)/sizes.holder.height;
				
				

				if(retina.is(':not(:animated):hidden')){
					/* Fixes a bug where the retina div is not shown */
					holder.trigger('mouseenter');
				}

				if(left<0 || top<0 || left > sizes.holder.width || top > sizes.holder.height)
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
					left				: left - retina.width()/2,
					top					: top - retina.height()/2,
					backgroundPosition	: (scaleX*left*(-1))+'px '+(scaleY*top*(-1))+'px'
				});
				


				
			}).mouseleave(function(){
				retina.stop(true,true).fadeOut('fast');
			}).mouseenter(function(){
				retina.stop(true,true).fadeIn('fast');
			});
			

			var retinaZoom = 0,intOverallDelta = 0,zoomRadius = 0;;
				
			holder.mousewheel(function(objEvent, intDelta){ 
				if(objEvent.preventDefault){
					objEvent.preventDefault();}
					
				var scale = retina.width() * 0.2 * intDelta;
			    if (intDelta > 0){
				   intOverallDelta++;
				}
			    else if (intDelta < 0){
					intOverallDelta--;
				}
				retinaZoom = retina.width() + scale;
				if(retinaZoom >= 10 && retinaZoom <= sizes.holder.width){
					retina.width(retinaZoom).height(retinaZoom).css({
						left : retina.offset().left - offset.left - scale/2,
						top : retina.offset().top - offset.top - scale/2
					});
				}
			});

		});
		
	}
})