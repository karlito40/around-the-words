'use strict';

(function(namespace){

var app = {
	width: 768,
	height: 1024
};

namespace.config = {
	store: {
		sandbox: true
	},
	app: app,
	game: {
		width: app.width,
		height: app.height,

		END_CHECK_LARGERWORD_ON_NBDEATH: 8,
		HOLE_SHIFT_TOP_BY: 30
	},

	ratio: 1,

	scene: {
		// fadeIn: 1.2,
		fadeIn: 0.7,
		fadeOut: 0.2
	},

	splashs: {
		images: ["resources/splash-f4f.jpg", "resources/splash-3dduo.jpg"],
		displayFor: 1400
	},


	loading: {
		minDisplay: 1,
		globeSpeed: 15

	},

	test: {
		desactiveDico: false,
		desactiveSplash: false,
		desactiveHome: false
	},

	wrapper: {
		width: 1024
	},

	avatars: {
		mexico: {
			body: [{
				type: 'face',
				key: 'face_mexico_mustache'
			}, {
				type: 'hat',
				key: 'hat_mexico_sombrero'
			}],
			skin: 'body_blue_to_pink'
		},

		france: {		// ok
			body: [{
				type: 'face',
				key: 'face_france_parisian'
			}, {
				type: 'hat',
				key: 'hat_france_beret'
			}],
			skin: 'body_blue_to_pink'
		},

		japan: {
			body: [{
				type: 'face',
				key: 'face_japan_ninja'
			}, {
				type: 'hat',
				key: 'hat_japan_headband'
			}],
			skin: 'body_blue_to_pink'
		},

		usa: {		// ok
			body: [{
				type: 'face',
				key: 'face_usa_belt'
			}, {
				type: 'hat',
				key: 'hat_usa_texas'
			}],
			skin: 'body_blue_to_pink'
		},

		tanzania: {
			body: [{
				type: 'face',
				key: 'face_tanzania_horn'
			}, {
				type: 'hat',
				key: 'hat_tanzania_ears'
			}],
			skin: 'skin_grey_animal'
		}

	}
};



namespace.gameMidWidth = function(){
	return ~~(this.gameWidth()/2);
};

namespace.gameMidHeight = function(){
	return ~~(this.gameHeight()/2);
};

namespace.gameWidth = function(){
	return namespace.config.game.width;
};

namespace.gameDim = function(){
	return namespace.config.game;
};

namespace.setGameWidth = function(width) {
	namespace.config.game.width = width;
};

namespace.gameHeight = function(){
	return namespace.config.game.height;
};

namespace.setGameHeight = function(height) {
	namespace.config.game.height = height;
};

namespace.isMobile = function(){
	return (namespace.config.game.width < 750);
};



})(window.ATW = window.ATW || {});
