'use strict';
(function(exports){
	var Container = {};

	Container.anchor = function(displayObjectContainer, x, y) {
		for(var i=displayObjectContainer.children.length-1; i>=0; i--) {
			var children = displayObjectContainer.children[i];
			if(children.anchor) {
				children.anchor.x = x;
				children.anchor.y = y;
			}
		}

	};

	exports.Container = Container;
})(window.Util = window.Util || {});
