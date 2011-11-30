/*
 * Retina Zoom
 * Retina zoom is jQuery plugin which offers an Apple like zoom style. It 
 * works well in both IE and morden broswers.
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
 *		sizelimit: {max:200,min:50}
 *			//set max/min size to #retina
 * }
 *
 *
 */

jQuery(function($) {
	
	$.fn.hoverDelay = function(hoverEvent, outEvent){
		var hoverTimer, outTimer;
		return $(this).each(function(){
			$(this).hover(function(){
				var t = this;
				clearTimeout(outTimer);
				hoverTimer = setTimeout(function (){
					hoverEvent.call(t);
				}, 200);
				},function(){
					var t = this;
					clearTimeout(hoverTimer);
					outTimer = setTimeout(function (){
					outEvent.call(t);
				}, 200);
			});
		});
	}

	var methods = {
		
		retinaOnly : function (options) {
			var controls = {
				wheel : true
			}
			
			return this.each(function(){
				//If options exist, merge them with default settings
				if (options) {
					$.extend (controls, options);
				}
				
				try {
					//Init
					var retina = $(this), holder, oImg, zImg;
					
					holder = retina.parent('div');
					oImg = holder.children('img:eq(0)');

					zImg = oImg.attr('longdesc').split('|');	
					
					//retina background-image
					retina.css('background-image', 'url(' + zImg[0] + ')');
						
					var sizes ={
						retina: { width:retina.width(), height:retina.height() }, 
						holderOffset : { left: holder.offset().left, top: holder.offset().top },
						oImg:{ width:oImg.width(), height:oImg.height()},// origin image size
						zImg:{width:zImg[1]-0,height:zImg[2]-0}// zoom image size
						},
						Imgscale = {
							x:(sizes.zImg.width - sizes.retina.width)/sizes.oImg.width,
							y:(sizes.zImg.height - sizes.retina.height)/sizes.oImg.height
							},
						maxRetina = 0,
						minRetina = 0;
					
					
						
					// Setting maximum retina size
					maxRetina = (sizes.zImg.width-(sizes.oImg.width - sizes.retina.width/2)*Imgscale.x)/2;
						if(sizes.retina.width > maxRetina){maxRetina = sizes.retina.width*1.5};
					minRetina = sizes.retina.width*0.5;

					if(controls.sizelimit){
						if(controls.sizelimit.max){
							maxRetina = controls.sizelimit.max;
							}
						if(controls.sizelimit.min){
							minRetina = controls.sizelimit.min;
							}
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
				}
				catch (error) {
					console.log(error);
				}		
				
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
						
						if(wheelPara.retinaZoom >= minRetina && wheelPara.retinaZoom <= maxRetina){
							retina.width(wheelPara.retinaZoom).height(wheelPara.retinaZoom).css({
								left : wheelPara.left,
								top : wheelPara.top
								//backgroundPosition : (Imgscale.x*(wheelPara.left + scale/2)*(-1))+'px '+(Imgscale.y*(wheelPara.top + scale/2)*(-1))+'px'
							});
						}
					});// end of mousewheel
				};

			});
		},
		gallery : function (){
		
			var galleryPara = arguments[0]; 
		
			var retinaOn = function($img){
				try{
					var imgInfo = $img.attr('longdesc').split('+'),
					oImgInfo = imgInfo[0].split('|'); 
				
					$('.retinaHolder').children('img:eq(0)').attr({
						src : oImgInfo[0],
						width : oImgInfo[1],
						height : oImgInfo[2],
						longdesc : imgInfo[1]
					});
					$img.addClass('retinaOn');
				}catch(e){
					$.error(e);
				}
			};
			
			// Append retina Divs 
			
			if (galleryPara.position == 0) {
				this.parent('div').prepend('<div class="retinaHolder holder"><img alt /><div class="retina"></div>');
			}else{
				this.parent('div').append('<div class="retinaHolder holder"><img alt /><div class="retina"></div>');
				}
			
			retinaOn(this.children('img:eq(0)'));
			
			// Bind retina event
			if(arguments){ //console.log(Array.prototype.slice.call( arguments, 1 ));
				methods.retinaOnly.apply($('.retina'),Array.prototype.slice.call( arguments, 1 ));
			}else{
				methods.retinaOnly.apply($('.retina'));
			}
			
			// gallery images
			var $gallery = this.children('img');
			$gallery.hoverDelay(function(){
				$gallery.removeClass('retinaOn');
				retinaOn($(this));
			},function(){
				//$(this).removeClass('retinaOn');
			});
		}
	};
		
	$.fn.retina = function(method){
		
		if ( methods[method] ) {
		  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.retinaOnly.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist' );
		}  
				
		
		
	}
})