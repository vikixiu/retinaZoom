jQuery(function($) {
	$.fn.retina = function(options){
		var retina = $(this), holder;
		if(options && options.holder) { holder = $(holder);} else {holder = retina.parent('div')};
		
		var controls = {
			wheel : true,
		}
		

		return this.each(function(){
		
			//If options exist, merge them with default settings
			if (options) {
				$.extend (controls, options);
			}
			
			var sizes ={
				retina: { width:retina.width(), height:retina.height() }, 
				holderOffset : { left: holder.offset().left, top: holder.offset().top },
				oImg:{ width:holder.children('img').width(), height:holder.children('img').height()},// origin image size
				zImg:{width:retina.next('div').width(),height:retina.next('div').height()}// zoom image size
				},
				Imgscale = {
					x:(sizes.zImg.width - sizes.retina.width)/sizes.oImg.width,
					y:(sizes.zImg.height - sizes.retina.height)/sizes.oImg.height
					},
				maxRetina = 0;
				
			var retinamovePara = function(event){
					this.holderleft = event.pageX - sizes.holderOffset.left;
					this.holdertop = event.pageY - sizes.holderOffset.top; 
					this.css = {
								left: this.holderleft - retina.width()/2,
								top: this.holdertop - retina.height()/2,
								backgroundPosition : (Imgscale.x*this.holderleft*(-1))+'px '+(Imgscale.y*this.holdertop*(-1))+'px'
							};
					
					return this;
				};
		
			if(controls.sizelimit){
				maxRetina = controls.sizelimit;
			}else{
				maxRetina = (sizes.zImg.width-(sizes.oImg.width - sizes.retina.width/2)*Imgscale.x)/2;
				if(sizes.retina.width > maxRetina){maxRetina = sizes.retina.width}
				
			}
			
			//begin
			if(navigator.userAgent.indexOf('Chrome')!=-1)
			{
				/*	Applying a special chrome curosor,
					as it fails to render completely blank curosrs. */
					
				retina.addClass('chrome');
			}
			
			holder.mousemove(function(e){

				var movePara = new retinamovePara(e); 

				if(retina.is(':not(:animated):hidden')){
					/* Fixes a bug where the retina div is not shown */
					holder.trigger('mouseenter');
				}

				if(movePara.holderleft<0 || movePara.holdertop<0 || movePara.holderleft > sizes.oImg.width || movePara.holdertop > sizes.oImg.height)
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
					left				: movePara.css.left,
					top					: movePara.css.top,
					backgroundPosition	: movePara.css.backgroundPosition
				});
				
				
			}).mouseleave(function(){
				retina.stop(true,true).fadeOut('fast');
			}).mouseenter(function(){
				retina.stop(true,true).fadeIn('fast');
			});
			

			
			if(controls.wheel){	
				holder.mousewheel(function(objEvent, intDelta){ 
					
					var scale = retina.width() * 0.2 * intDelta;
					
					
					var wheelPara = {
						left:retina.offset().left - sizes.holderOffset.left - scale/2,
						top: retina.offset().top - sizes.holderOffset.top - scale/2,
						retinaZoom : retina.width() + scale
					}
					
					if(objEvent.preventDefault){
						objEvent.preventDefault();}
					
					if(wheelPara.retinaZoom >= sizes.retina.width*0.5 && wheelPara.retinaZoom <= maxRetina){
						retina.width(wheelPara.retinaZoom).height(wheelPara.retinaZoom).css({
							left : wheelPara.left,
							top : wheelPara.top
							//backgroundPosition : (Imgscale.x*wheelPara.left*(-1))+'px '+(Imgscale.y*wheelPara.top*(-1))+'px'
						});
					}
				});// end of mousewheel
			}

		});
		
	}
})