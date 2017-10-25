'use strict';
(function(exports){
	function World (cf, showStat, highlight) {
		this.key = cf.key;
		this.id = cf.id;
		// this.prefab = Prefab['world_'+ this.key + '_prefab']();
		this.prefab = Prefab['world_prefab'](cf, showStat, highlight);
		this.prefab.key = cf.key;
		this.prefab.worldId = cf.id;
		Util.Container.anchor(this.prefab, 0.5, 0.5);

		// this.prefab.pivot.x = this.prefab.width/2;
		// this.prefab.pivot.y = this.prefab.height/2;
	}

	exports.World = World;
})(window.UI = window.UI || {});