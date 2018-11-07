/**
 * jquery.gallery.js
 * http://www.codrops.com
 *
 * Copyright 2011, Pedro Botelho / Codrops
 * Free to use under the MIT license.
 *
 * Date: Mon Jan 30 2012
 */

(function( $, undefined ) {
  var selfObj = this,
      selfWidth = $(this).width(),
      selfHeigth = $(this).height(),
      translateX,
      rightTranslateX,
      translateZ = 0

  var generate3DTransitionValue = function(translateX, translateY, translateZ) {
    return 'translateX(' + translateX + 'px) translateZ(' + translateZ + 'px) rotateY(' + translateY + 'deg)'
  }

  var generate2DTransitionValue = function(translateX, scale) {
    return 'translate(' + translateX + 'px) scale( ' + scale + ')'
  }

  var transformGenerator = function(transitionValue) {
    return {
      '-webkit-transform' : transitionValue, // rightRotateX
      '-moz-transform'  : transitionValue, // rightRotateX
      '-o-transform'    : transitionValue, // rightRotateX
      '-ms-transform'   : transitionValue, // rightRotateX
      'transform'     : transitionValue // rightRotateX
    }
  }


	/*
	 * Gallery object.
	 */
	$.Gallery 				= function( options, element ) {
		this.$el	= $( element );
		this._init( options );

	};

	$.Gallery.defaults 		= {
		current		: 0,	// index of current item
		autoplay	: false,// slideshow on / off
		interval	: 2000  // time between transitions
  };

	$.Gallery.prototype 	= {
		_init 				: function( options ) {
      var self = this
			this.options 		= $.extend( true, {}, $.Gallery.defaults, options );

      var hRate = this.options.hRate || 0.3
      translateX  = selfWidth * hRate
      rightTranslateX = selfWidth - 2 * (1 - hRate) * translateX

			// support for 3d / 2d transforms and transitions
			this.support3d		= Modernizr.csstransforms3d;
			this.support2d		= Modernizr.csstransforms;
			this.supportTrans	= Modernizr.csstransitions;

			this.$wrapper		= this.$el.find('.dg-wrapper');

			this.$items			= this.$wrapper.children();
			this.itemsCount		= this.$items.length;

			this.$nav			= this.$el.find('nav');
			this.$navPrev		= this.$el.find('.dg-prev');
			this.$navNext		= this.$el.find('.dg-next');

			// minimum of 3 items
			if( this.itemsCount < 3 ) {
				this.$nav.remove();
        this.$navPrev.remove();
        this.$navNext.remove();
				return false;
			}

			this.current		= this.options.current;

			this.isAnim			= false;

			this.$items.css({
				'opacity'	: 0,
				'visibility': 'hidden'
			});
			this._validate();
			this._layout();

      $(window).resize(function() {
        // ÖØÐÂÉè¶¨Á½±ßµÄ transform
        selfWidth = $(window).width()
        var hRate = self.options.hRate || 0.3
        translateX  = selfWidth * hRate
        rightTranslateX = selfWidth - 2 * (1 - hRate) * translateX
        self._layout();
      });

			// load the events
			this._loadEvents();

			// slideshow
			if( this.options.autoplay ) {

				this._startSlideshow();

			}

      // if( this.options.indicators ) {
      //   this.options.indicators.find('.indicator').on('click', function(evt) {
      //     console.info($(this), $(this).index)
      //   })
      // }

		},
		_validate			: function() {

			if( this.options.current < 0 || this.options.current > this.itemsCount - 1 ) {

				this.current = 0;

			}

		},
		_layout				: function() {
			// current, left and right items
			this._setItems();

			// current item is not changed
			// left and right one are rotated and translated
			var leftCSS, rightCSS, currentCSS;

      currentCSS  = {
        'z-index'     : 999,
        width: '60%',
      };

      commonCss = {
        opacity: 1,
        visibility: 'visible',
        width: '50%'
      };

      if( this.support3d && this.supportTrans ) {
        leftCSS   = transformGenerator(generate3DTransitionValue(-translateX, +0, translateZ));
        rightCSS  = transformGenerator(generate3DTransitionValue(rightTranslateX, -0, translateZ));

				leftCSS.opacity		= commonCss.opacity
        leftCSS.visibility  = commonCss.visibility
				leftCSS.width	= commonCss.width

				rightCSS.opacity	= commonCss.opacity
        rightCSS.visibility = commonCss.visibility
				rightCSS.width	= commonCss.width
			}
			else if( this.support2d && this.supportTrans ) {
				leftCSS 	= transformGenerator(generate2DTransitionValue(-translateX, 0.8));
				rightCSS	= transformGenerator(generate2DTransitionValue(rightTranslateX, 0.8));

        leftCSS.opacity   = commonCss.opacity
        leftCSS.visibility  = commonCss.visibility
        leftCSS.width = commonCss.width

        rightCSS.opacity  = commonCss.opacity
        rightCSS.visibility = commonCss.visibility
        rightCSS.width  = commonCss.width
			}

			this.$leftItm.css( leftCSS || {} );
			this.$rightItm.css( rightCSS || {} );

			this.$currentItm.css( currentCSS || {} ).css({
				'opacity'	: 1,
				'visibility': 'visible'
			}).addClass('dg-center');

		},
		_setItems			: function() {
			this.$items.removeClass('dg-center');

			this.$currentItm	= this.$items.eq( this.current );
			this.$leftItm		= ( this.current === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$items.eq( this.current - 1 );
			this.$rightItm		= ( this.current === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$items.eq( this.current + 1 );

			if( !this.support3d && this.support2d && this.supportTrans ) {
				this.$items.css( 'z-index', 1 );
				this.$currentItm.css( 'z-index', 999 );
			}

      if ( typeof this.options.onActiveItem === 'function' ) {
        this.options.onActiveItem(this.current)
      }

			// next & previous items
			if( this.itemsCount > 3 ) {

				// next item
				this.$nextItm		= ( this.$rightItm.index() === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$rightItm.next();
				this.$nextItm.css( this._getCoordinates('outright') );

				// previous item
				this.$prevItm		= ( this.$leftItm.index() === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$leftItm.prev();
				this.$prevItm.css( this._getCoordinates('outleft') );

			}

		},
		_loadEvents			: function() {

			var _self	= this;

			this.$navPrev.on( 'click.gallery', function( event ) {

				if( _self.options.autoplay ) {
					clearTimeout( _self.slideshow );
					_self.options.autoplay	= false;

				}

				_self._navigate('prev');
				return false;
			});

			this.$navNext.on( 'click.gallery', function( event ) {

				if( _self.options.autoplay ) {
					clearTimeout( _self.slideshow );
					_self.options.autoplay	= false;

				}

				_self._navigate('next');
				return false;
			});

			this.$wrapper.on( 'webkitTransitionEnd.gallery transitionend.gallery OTransitionEnd.gallery', function( event ) {

				_self.$currentItm.addClass('dg-center');
				_self.$items.removeClass('dg-transition');
				_self.isAnim	= false;

			});

		},
		_getCoordinates		: function( position ) {
      var css
			if( this.support3d && this.supportTrans ) {

				switch( position ) {
					case 'outleft':
            css = transformGenerator(generate3DTransitionValue(-translateX, +0, translateZ))
						break;
					case 'outright':
            css = transformGenerator(generate3DTransitionValue(rightTranslateX, +0, translateZ))

						break;
					case 'left':
            css = transformGenerator(generate3DTransitionValue(-translateX, +0, -translateZ))
						break;
					case 'right':
            css = transformGenerator(generate3DTransitionValue(rightTranslateX, -0, -translateZ))
						break;
					case 'center':
            css = transformGenerator(generate3DTransitionValue(0, 0, 0))
						break;
				};

			}
			else if( this.support2d && this.supportTrans ) {
				switch( position ) {
					case 'outleft':
            css = transformGenerator(generate2DTransitionValue(-translateX, 0.7))
						break;
					case 'outright':
            css = transformGenerator(generate2DTransitionValue(rightTranslateX, 0.7))
						break;
					case 'left':
            css = transformGenerator(generate2DTransitionValue(-translateX, 0.8))
						break;
					case 'right':
            css = transformGenerator(generate2DTransitionValue(rightTranslateX, 0.8))
						break;
					case 'center':
            css = transformGenerator(generate2DTransitionValue(0, 0.8))
						break;
				};
			}

      switch( position ) {
        case 'outleft'  :
        case 'outright' :
          css.opacity = 0;
          css.visibility = 'hidden';
          break;
        case 'left'   :
        case 'right'  :
        case 'center' :
          css.opacity = 1;
          css.visibility = 'visible';
          break;
      };

      return css
		},
		_navigate			: function( dir ) {
			if( this.supportTrans && this.isAnim )
				return false;

			this.isAnim	= true;

      var currentCSS  = {
            'z-index'     : 999,
            width: '60%',
          },
          commonCss = {
            opacity: 1,
            visibility: 'visible',
            width: '50%'
          },
          animationOpts = {
            duration: 600,
            queue: false,
            easing: 'easeInOutCubic'
          };

      switch( dir ) {
        case 'next' :
          this.current  = this.$rightItm.index();
          // current item moves left
					this.$currentItm.animate({ width: commonCss.width }, animationOpts);
          this.$currentItm.addClass('dg-transition').css( this._getCoordinates('left') );
          this.$currentItm.find('img').animate({ padding: '9%', 'opacity': 0.3 }, animationOpts);

					// right item moves to the center
          // this.$rightItm.find('img').animate({ padding: 0 });
          this.$rightItm.addClass('dg-transition').css( this._getCoordinates('center') );
          this.$rightItm.animate({ width: currentCSS.width }, animationOpts);
          this.$rightItm.find('img').animate({ padding: '0', 'opacity': 1 }, animationOpts);

					// next item moves to the right
					if( this.$nextItm ) {
						// left item moves out
            this.$leftItm.animate({ width: commonCss.width }, animationOpts);
            this.$leftItm.addClass('dg-transition').css( this._getCoordinates('outleft') );
            this.$leftItm.find('img').animate({ padding: '9%', 'opacity': 0.3 }, animationOpts);

            this.$nextItm.animate({ width: commonCss.width }, animationOpts);
            this.$nextItm.addClass('dg-transition').css( this._getCoordinates('right') );
            this.$nextItm.find('img').animate({ padding: '9%', 'opacity': 0.3 }, animationOpts);
					}
					else {
						// left item moves right
            this.$leftItm.animate({ width: commonCss.width }, animationOpts);
            this.$leftItm.css( this._getCoordinates('right') );
            this.$leftItm.find('img').animate({ padding: '9%', 'opacity': 0.3 }, animationOpts);
					}
					break;

				case 'prev' :
					this.current	= this.$leftItm.index();
					// current item moves right
					this.$currentItm.addClass('dg-transition').css( this._getCoordinates('right') );
          this.$currentItm.addClass('dg-transition').css({ width: commonCss.width });


					// left item moves to the center
					this.$leftItm.addClass('dg-transition').css( this._getCoordinates('center') );
          this.$leftItm.addClass('dg-transition').css({ width: currentCSS.width });

					// prev item moves to the left
					if( this.$prevItm ) {
						// right item moves out
						this.$rightItm.addClass('dg-transition').css( this._getCoordinates('outright') );
						this.$prevItm.addClass('dg-transition').css( this._getCoordinates('left') );

					}
					else {
						// right item moves left
						this.$rightItm.addClass('dg-transition').css( this._getCoordinates('left') );
            this.$rightItm.addClass('dg-transition').css({ width: commonCss.width });
					}
					break;
			};

			this._setItems();

			// if( !this.supportTrans ) {
			// 	this.$currentItm.addClass('dg-center');
   //    }

		},
		_startSlideshow		: function() {
			var _self	= this;

			this.slideshow	= setTimeout( function() {
				_self._navigate( 'next' );

				if( _self.options.autoplay ) {
					_self._startSlideshow();
				}

			}, this.options.interval);

		},
		destroy				: function() {
			this.$navPrev.off('.gallery');
			this.$navNext.off('.gallery');
			this.$wrapper.off('.gallery');

		}
	};

	var logError 			= function( message ) {
		if ( this.console ) {
			console.error( message );
		}
	};

	$.fn.gallery			= function( options ) {

		if ( typeof options === 'string' ) {

			var args = Array.prototype.slice.call( arguments, 1 );

			this.each(function() {

				var instance = $.data( this, 'gallery' );

				if ( !instance ) {
					logError( "cannot call methods on gallery prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}

				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for gallery instance" );
					return;
				}

				instance[ options ].apply( instance, args );

			});

		}
		else {

			this.each(function() {

				var instance = $.data( this, 'gallery' );
				if ( !instance ) {
          $.data(this, 'gallery', new $.Gallery(options, this));
				}
			});

		}

		return this;

	};

})( jQuery );
