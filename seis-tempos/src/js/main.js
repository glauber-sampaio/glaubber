function GLAUBBER() {

	TweenLite.defaultEase = Expo.easeOut;

	this.content = document.querySelector('#content');
	this.ui = this.content.querySelector('.ui');
	this.coverArtEl = this.content.querySelector('.cover-art');
	this.shareCoverElements = this.content.querySelector('.share-cover-elements');
	this.FBData = {};

};

GLAUBBER.prototype = {

	showingCoverElements: false,
	skip: false,

	initEvents: function () {

		var self = this;

		this.lettering = this.coverArtEl.querySelector('.lettering'),
		this.titleSVG = this.lettering.querySelector('#title')
		this.epSign = this.lettering.querySelector('.ep-sign'),
		this.circle = this.coverArtEl.querySelector('.circle');

		this.soundButton = this.content.querySelector('.sound-button');
		this.audioEl = document.getElementById('audio-bg');
		
		var shareCoverButton = this.ui.querySelector('.share-cover');
		
		this.skipButton = document.querySelector('.skip-button');

		this.scb_closeButton = this.shareCoverElements.querySelector('.close-button');
		this.scb_tip = this.shareCoverElements.querySelector('.tip');
		this.scb_fbLogin = this.shareCoverElements.querySelector('.fb-login-button');
		this.scb_fbPost = this.shareCoverElements.querySelector('.fb-post-button');
		this.scb_picShootFx = this.shareCoverElements.querySelector('.canvas-pic-shoot-fx');
		this.scb_loadingDisplay = this.shareCoverElements.querySelector('.canvas-loading-display');
		this.scb_messageButton = this.shareCoverElements.querySelector('.canvas-message--edit');
		this.scb_canvasMessage = this.shareCoverElements.querySelector('.canvas-message');
		
		//

		this.introAnimateCoverElements();
		this.canvasDraw();
		this.audioEl.play();

		this.soundButton.addEventListener('click', function () {
			if(classie.has(this, 'paused')) {
				self.audioEl.play();
				this.classList.remove('paused');
				return;
			}
			self.audioEl.pause();
			this.classList.add('paused');
		});

		this.skipButton.addEventListener('click', function () {
			self.skipIntro();
		});

        TweenMax.set(this.shareCoverElements.querySelector('.canvas-wrapper'), {
			transform: 'rotate3d(1, 1, 0, 85deg)'
		});

        shareCoverButton.addEventListener('click', function () {
            self.animateCoverCanvasDraw();
        });

        this.scb_closeButton.addEventListener('click', function () {
            self.hideCoverCanvasDraw();
        });

        this.scb_fbLogin.addEventListener('click', function () {
        	self.tryFBLogin();
        });

        this.scb_messageButton.addEventListener('click', function () {
        	self.editMessage();
        })

        this.scb_fbPost.addEventListener('click', function () {
        	self.publishFinalImageToFB();
        });

		//this.mousemove();

	},

	introAnimateCoverElements: function () {

		var self = this;
		TweenMax.set(this.circle, { scale: 0.8 });
		TweenMax.staggerTo(this.titleSVG.querySelectorAll('path'), 8, { 
			strokeDasharray: 410,
			onComplete: hideSkipBtn
		}, 0.4);
		TweenMax.to(this.epSign, 8, { opacity: 1, delay: 5 });
		TweenMax.to(this.circle, 8, { opacity: 1, scale: 1, delay: 8 });
		TweenMax.to(this.ui, 8, { opacity: 1, delay: 10 });

		function hideSkipBtn() {
			if(!self.skip) {
				self.skip = true;
			}

			TweenMax.to(self.skipButton, 1, { 
				opacity: 0,
				onComplete: function () {
					self.skipButton.style.display = 'none';
				}
			});
		}

		this.showingCoverElements = true;

	},

	skipIntro: function () {

		var self = this;

		TweenMax.killTweensOf([
			this.circle,
			this.titleSVG.querySelectorAll('path'),
			this.epSign,
			this.ui
		]);

		TweenMax.set(this.circle, { scale: 0.8 });
		TweenMax.to(this.titleSVG.querySelectorAll('path'), 2, { strokeDasharray: 410 });
		TweenMax.to(this.epSign, 2, { opacity: 1 });
		TweenMax.to(this.circle, 3, { opacity: 1, scale: 1 });
		TweenMax.to(this.ui, 1, { opacity: 1 });

		TweenMax.to(this.skipButton, 1, { 
			opacity: 0,
			onComplete: function () {
				self.skipButton.style.display = 'none';
				self.skip = true;
			}
		});

	},

    secondAnimateCoverElements: function () {

        this.ui.style.display = 'block';
        this.coverArtEl.style.display = 'block';
        this.soundButton.style.display = 'block';
        this.shareCoverElements.style.display = 'none';

        TweenMax.set(this.titleSVG.querySelectorAll('path'), { opacity: 1 });
        TweenMax.to(this.circle, 3, { opacity: 1, scale: 1 });
        TweenMax.to(this.titleSVG.querySelectorAll('path'), 5, { strokeDasharray: 410, delay: 1.5 });
        TweenMax.to(this.epSign, 3, { opacity: 1, delay: 1.3 });
        TweenMax.to(this.ui, 4, { opacity: 1, delay: 2 });

        TweenMax.set(this.shareCoverElements.querySelector('.canvas-wrapper'), {
            transform: 'rotate3d(1, 1, 0, 85deg)'
        });

        this.showingCoverElements = true;

    },

	hideCoverElements: function() {

		var self = this;

		TweenMax.to(this.titleSVG.querySelectorAll('path'), 9, {
			strokeDasharray: 290,
			onComplete: function () {
				self.showingCoverElements = false;
			}
		});

		TweenMax.to(this.titleSVG.querySelectorAll('path'), 1, { opacity: 0, delay: 3.5 });

		TweenMax.to([this.epSign, this.ui], 5, { opacity: 0 });
		TweenMax.to(this.circle, 2, { opacity: 0, scale: 0.8, delay: 3 });

	},

	mousemove: function () {

		var self = this;
		var perspective, tx, ty, tz, rx, ry, rz;
		perspective = 1000; tx = -10; ty = -10; tz = 20; rx = 2; ry = 2; rz = 0;

		Array.prototype.slice.call(document.querySelectorAll('.js-interact')).forEach(
			function (el, i) {

				window.addEventListener('mousemove', function (event) {

					// snippet from codrops

					var	mousepos = getMousePos(event),
						bounds = content.getBoundingClientRect(),
						relmousepos = {
							x: mousepos.x - bounds.left,
							y: mousepos.y - bounds.top
						};

					var transY = ty ? 2 * ((i+1) * ty/2) / content.offsetWidth * relmousepos.x - ((i+1) * ty/2) : 0,
						transX = tx ? 2 * ((i+1) * tx/2) / content.offsetHeight * relmousepos.y - ((i+1) * tx/2) : 0,
						transZ = tz ? 2 * ((i+1) * tz/3) / content.offsetHeight * relmousepos.y - ((i+1) * tz/2) : 0,
						rotX = rx ? 2 * ((i+1) * rx/2) / content.offsetHeight * relmousepos.y - ((i+1) * rx/2) : 0,
						rotY = ry ? 2 * ((i+1) * ry/2) / content.offsetWidth * relmousepos.x - ((i+1) * ry/2) : 0,
						rotZ = rz ? 2 * ((i+1) * rz/2) / content.offsetWidth * relmousepos.x - ((i+1) * rz/2) : 0;

					el.style.transform = 'perspective('+perspective+'px) translate3d('+transX+'px, '+transY+'px, '+transZ+'px) rotate3d(1,0,0,'+rotX+'deg) rotate3d(0,1,0,'+rotY+'deg) rotate3d(0,0,1,'+rotZ+'deg)';

				});

			}
		);

	},

	resize: function () {

		var ww = window.innerWidth;
		var ratio = (ww / 1000) * 0.6;
		var scale = ratio > 1 ? 1 : ratio;

		document.querySelector('.cover-art').style.transform = 'scale('+ scale +')';
		// document.querySelector('.canvas-wrapper').style.transform = 'scale('+ scale +')';
		// document.querySelector('.canvas-pic-shoot-fx').style.transform = 'scale('+ scale +')';
		// document.querySelector('.canvas-loading-display').style.transform = 'scale('+ scale +')';
		// document.querySelector('.canvas-message').style.transform = 'scale('+ scale +')';

	},

	animateCoverCanvasDraw: function () {

		console.log('share cover state initialized;');

		var self = this;

		if(this.showingCoverElements) {
			this.hideCoverElements();
		}

		this.shareCoverElements.style.display = 'block';
		this.soundButton.style.display = 'none';

		TweenMax.to(this.content, 1, {
			backgroundColor: '#dedede',
			delay: 3,
			onComplete: function () {
				self.ui.style.display = 'none';
				self.coverArtEl.style.display = 'none';
				self.content.classList.add('sm');
			}
		});

		TweenMax.staggerTo(this.shareCoverElements.children, 3, { opacity: 1, delay: 4 }, 0.4);
		TweenMax.to(this.shareCoverElements.querySelector('.canvas-wrapper'), 1.5, {
			transform: 'rotate3d(1, 1, 0, 0deg)', delay: 7.5,
			onComplete: function() {
				self.resize();
			}
		});

	},

    hideCoverCanvasDraw: function () {

        var self = this;

        TweenMax.killTweensOf([this.shareCoverElements.querySelector('.canvas-wrapper'), this.shareCoverElements.children, this.content]);

        TweenMax.to(this.shareCoverElements.querySelector('.canvas-wrapper'), 1.5, {
            transform: 'rotate3d(1, 1, 0, -60deg)', opacity: 0
        });
        TweenMax.to(this.shareCoverElements.children, 1, { opacity: 0 });
        TweenMax.to(this.content, 1, {
            backgroundColor: '#000',
            delay: 1.4,
            onComplete: function () {
                self.secondAnimateCoverElements();
                self.content.classList.remove('sm');
            }
        });

    },

	canvasDraw: function () {

		paper.setup('cover-viewport');

		var tool = new Tool();
		var brush, background;

		// image

		insertBG();

		//Draw

		tool.onMouseDown = function (ev) {
			brush = new Path();
			brush.style = {
				strokeWidth: 10,
				strokeColor: 'white',
				strokeCap: 'round',
				strokeJoin: 'round'
			}
			brush.add(ev.point);
		}

		tool.onMouseDrag = function (ev) {
			brush.add(ev.point);
		}

		tool.onMouseUp = function () {
			brush.simplify();
		}

		tool.onKeyDown = function (ev) {
			if(ev.key == 'escape') {
				project.activeLayer.clear();
                insertBG();
				return false;
			}
		}

        function insertBG () {
            background = new Raster('share-cover-bg');
            background.position = view.center;
        }

	},

    tryFBLogin: function () {

    	var self = this;

    	FB.getLoginStatus(function (response) {
    		if(response.status === 'connected') {

    			showLoggedStatus(response.authResponse.accessToken);

    		}else{
    			
    			FB.login(function (response) {

    				showLoggedStatus(response.authResponse.accessToken);

    			},{ scope: 'publish_actions'});

    		}
    	});

    	function showLoggedStatus(token) {
    		
    		self.FBData.accessToken = token;
    		
    		FB.api('/me', function (response) {
    			self.scb_fbPost.querySelector('span').innerHTML = response.name;
    			self.FBData.username = response.name;
    			self.FBData.userID = response.id;
    		});

    		TweenMax.set([self.scb_fbPost, self.scb_messageButton], { opacity: 0, display: 'block' });
			
			TweenMax.to(self.scb_fbLogin, 1, {
				opacity: 0, onComplete: function () {
					self.scb_fbLogin.style.display = 'none';
					TweenMax.to([self.scb_fbPost, self.scb_messageButton], 1, { opacity: 1 });
				}
			});

    	}

    },

    editMessage: function () {

    	var self = this;
    	var textarea = this.scb_canvasMessage.querySelector('textarea');
    	var okButton = this.scb_canvasMessage.querySelector('.canvas-message--ok');

    	this.scb_canvasMessage.style.display = 'block';
    	this.scb_canvasMessage.style.opacity = 0;
    	
    	TweenMax.to(this.scb_canvasMessage, 1, { opacity: 1 });
		TweenMax.to([this.scb_fbPost, this.scb_messageButton], 1, { x: -30, opacity: 0 });
		TweenMax.to(this.scb_tip, 1, { x: 30, opacity: 0 });

    	textarea.focus();

    	okButton.addEventListener('click', function () {

    		if(textarea.value.length != 0) {
    			self.FBData.imageCaption = textarea.value;
    		}

    		TweenMax.to(self.scb_canvasMessage, 1, { 
    			opacity: 0,
    			onComplete: function () {
    				self.scb_canvasMessage.style.display = 'none';
    				TweenMax.to([self.scb_fbPost, self.scb_messageButton], 1, { x: 0, opacity: 1 });
					TweenMax.to(self.scb_tip, 1, { x: 0, opacity: 1 });
    			}
    		});

    	});

    },

    publishFinalImageToFB: function () {

    	var self = this,
    		dataURL = document.querySelector('#cover-viewport').toDataURL(),
    		mime = dataURL.slice(dataURL.indexOf(':') + 1, dataURL.indexOf(';')),
    		data = base64.decode(dataURL.slice(dataURL.indexOf(',') + 1));

    	var fd = new FormData();
    	
    	fd.append('access_token', self.FBData.accessToken);
    	fd.append('source', new Blob([data], { type: mime }));

    	if(this.FBData.imageCaption) {
    		fd.append('caption', this.FBData.imageCaption);
    	}

    	showLoadingAnimation();

    	var xhr = new XMLHttpRequest();

    	xhr.open('POST', 'https://graph.facebook.com/' + self.FBData.userID + '/photos');
    	xhr.onload = function () {
    		if(xhr.status >= 200 && xhr.status < 400) {
    			self.scb_fbPost.innerHTML = 'Obrigado por compartilhar!';
    			showSuccessMessage();
    		}else{
    			// bad request
    			showErrorMessage();
    		}
    	}
    	xhr.onerror = showErrorMessage;
    	xhr.send(fd);

    	function showLoadingAnimation() {

    		self.scb_loadingDisplay.style.display = 'block';
    		self.scb_loadingDisplay.style.opacity = 0;
    		
    		TweenMax.to([self.scb_fbPost, self.scb_messageButton], 1, { x: -30, opacity: 0 });
    		TweenMax.to(self.scb_tip, 1, { x: 30, opacity: 0 });
    		TweenMax.to(self.scb_loadingDisplay, 1, { opacity: 1, delay: 1 });

    	}

    	function showSuccessMessage() {

    		self.scb_picShootFx.style.display = 'block';
    		self.scb_picShootFx.style.opacity = 0;

    		TweenMax.to(self.scb_loadingDisplay, 1, { opacity: 0 });
    		TweenMax.to(self.scb_picShootFx, 0.3, { opacity: 1, yoyo: true, repeat: 1 });
    		TweenMax.to(self.scb_fbPost, 1, { x: 0, opacity: 1 });
    		TweenMax.to(self.scb_fbPost, 1, { x: -30, opacity: 0, delay: 2.5 });

    		setTimeout(function () { returnDefaults(); }, 3000);

    	}

    	function showErrorMessage() {
    		
    		self.scb_fbPost.innerHTML = 'Algo deu errado. Por favor, atualize a página.';
    		TweenMax.to(self.scb_fbPost, 1, { x: 0, opacity: 1 });

    	}

    	function returnDefaults() {

    		TweenMax.killTweensOf([self.shareCoverElements.children]);

    		self.scb_picShootFx.style.display = 'none';
    		self.scb_loadingDisplay.style.display = 'none';
    		self.scb_fbPost.innerHTML = 'PUBLICAR NO FACEBOOK COMO <br/><span>'+self.FBData.username+'</span>';

    		TweenMax.to(self.scb_tip, 1, { x: 0, opacity: 1 });
    		TweenMax.to([self.scb_fbPost, self.scb_messageButton], 1, { x: 0, opacity: 1 });

    	}

    }

}

paper.install(window);
window.GLAUBBER = new GLAUBBER();

window.onload = function () {

	GLAUBBER.resize();

	setTimeout(function () {
		GLAUBBER.initEvents();
	}, 1000);

}


window.onresize = function () {
	GLAUBBER.resize();
};
