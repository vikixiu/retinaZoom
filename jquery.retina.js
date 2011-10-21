jQuery(function($) {
	$.fn.retina = function(holder,options){
		
		var retina = $(this),
			holder = $(holder),
			left = 0,
			top = 0,
			offset = { left: holder.offset().left, top: holder.offset().top };
			//sizes = { retina: { width:190, height:190 }, holder:{ width:500, height:283 } };
		
		var sizes ={
			retina: { width:retina.width(), height:retina.height() }, 
			holder:{ width:holder.width(), height:holder.height() } 
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
					left				: left - sizes.retina.width/2,
					top					: top - sizes.retina.height/2,
					backgroundPosition	: '-'+(1.6*left)+'px -'+(1.35*top)+'px'
				});
				
			}).mouseleave(function(){
				retina.stop(true,true).fadeOut('fast');
			}).mouseenter(function(){
				retina.stop(true,true).fadeIn('fast');
			});
		});
		
	}
})