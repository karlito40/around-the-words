'use strict';
(function(exports){
	function Depth(ref, scalingLevel, scaleOri){
		this.ref = ref;
		this.scalingLevel = scalingLevel;
		this.scaleOri = scaleOri || 1;
	};

	Depth.prototype.get = function(point) {
		var distance = Math.abs(this.ref.x - point.x);
		if(!distance) return this.scaleOri;

		var scale = (this.scaleOri/distance) * this.scalingLevel;
		return Math.min(scale, this.scaleOri);
	};

	exports.Depth = Depth;
})(window.Util = window.Util || {});