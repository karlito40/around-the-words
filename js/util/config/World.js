'use strict';

(function(exports){
	exports.World = {

		cacheOrder: null,

		isAccessible: function(world)
		{
			return !this.getPrevious(world);
		},

		getPrevious: function(world)
		{
			this._createCacheOrder();
			return (this.cacheOrder[world.order-1]);
		},

		_createCacheOrder: function()
		{
			if(!this.cacheOrder)
			{
				var cWorlds = ATW.Datas.WORLDS;
				this.cacheOrder = {};
				for(var i in cWorlds)
				{
					var w = cWorlds[i];
					this.cacheOrder[w.order] = w;
				}
			}

			return this.cacheOrder;

		}
	};
}) (window.Util = window.Util || {});
