/*
 * Retina Zoom
 * Retina zoom is jQuery plugin which offers an Apple like zoom style. It 
 * works well in both IE and morden broswers, also support IOS devices.
 * Not only image can zoom, retina also can zoom when mousewheel.
 *
 * To make it working, it need 
 * 1. DD_roundies_0.0.2a.js 
 * 2. jquery_mousewheel_plugin.js
 * 3. <meta content="IE=EmulateIE7, IE=9" http-equiv="X-UA-Compatible">
 * 
 * After add above three , time to use:
 * $('#retina').retina();
 *
 * retina can take up to 2 arguments, both optional.
 * {
 *		wheel: true,		
 *			//controller of mousewheel event, default value is true
 *		sizelimit: 100
 *			//set maximum size to #retina
 * }
 *
 *
 */

jQuery(function($) {
	$.fn.retina = function(options){
				
		var controls = {
			wheel : true
		}
		

		return this.each(function(){
		
			//If options exist, merge them with default settings
			if (options) {
				$.extend (controls, options);
			}
			
			//define retina and holder
			var retina = $(this), holder;

			if(retina.parent('div')){
				holder = retina.parent('div');
				}else{
					return false;
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
			
			// function to Caculate mouseMove Parameters
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
				
			// Setting maximum retina size
			if(controls.sizelimit){
				maxRetina = controls.sizelimit;
			}else{
				maxRetina = (sizes.zImg.width-(sizes.oImg.width - sizes.retina.width/2)*Imgscale.x)/2;
				if(sizes.retina.width > maxRetina){maxRetina = sizes.retina.width*1.5}
				
			}
			
			// Add round conners to IE6~8
			if($.browser.msie){//alert(retina.attr('id'));
				DD_roundies.addRule('#' + retina.attr('id'), maxRetina + 'px');
			}
			
			// necessary -- DO NOT REMOVE, clear holder's padding
			holder.css({
				paddingLeft:'0px',
				paddingTop:'0px'
				});
			
			//begin
			holder.bind('mousemove touchmove',function(e){

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
				
				
			}).bind('mouseleave touchend',function(){
				retina.stop(true,true).fadeOut('fast');
			}).bind('mouseenter touchstart',function(){
				retina.stop(true,true).fadeIn('fast');
			});
			

			//Add mousewheel effect
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
							//backgroundPosition : (Imgscale.x*(wheelPara.left + scale/2)*(-1))+'px '+(Imgscale.y*(wheelPara.top + scale/2)*(-1))+'px'
						});
					}
				});// end of mousewheel
			};

		});
		
	}
})