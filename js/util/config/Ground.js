(function(exports){
exports.Ground = {
	_cacheByGroundType: null,

	_createCache: function()
	{
		if(!this._cacheByGroundType)
		{
			this._cacheByGroundType = {};

			var cGrounds = ATW.Datas.GROUNDS;
			for(var i in cGrounds)
			{
				if(!this._cacheByGroundType[cGrounds[i].groundType_id])
				{
					this._cacheByGroundType[cGrounds[i].groundType_id] = [];
				}
				this._cacheByGroundType[cGrounds[i].groundType_id].push(cGrounds[i]);
			}
		}
	},

	findByGdType: function(gdTypeId) {
		this._createCache();
		return this._cacheByGroundType[gdTypeId];
	}

};

})(window.Util = window.Util || {});


