'use strict';
(function(namespace){

namespace.Screen = {

	toFullScreen: function(displayObject){

	    var compare = (displayObject.width < displayObject.height) ? 'width' : 'height';

	    if(displayObject[compare] < ATW.config.game[compare]) {
	        var ratio = ATW.config.game[compare]/displayObject[compare];
	        displayObject.scale.x = ratio;
	        displayObject.scale.y = ratio;
	    }

	},

	boundedBox: function(displayObject) {
		if(!displayObject) {
			var wrapper = ATW.config.wrapper;
			var midWidth = wrapper.width/2;
			var x = ~~(ATW.gameMidWidth() - midWidth)
			var xMax = ~~(ATW.gameMidWidth() + midWidth);

			return {
				x:  Math.max(0, x),
				xMax: Math.min(ATW.gameWidth(), xMax)
			}

		}

		return  {
			x: Math.max(0, displayObject.position.x),
			xMax: Math.min(ATW.gameWidth(), displayObject.position.x+displayObject.width)
		}
	}


};

})(window.Util = window.Util || {});
