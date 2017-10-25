(function(exports){

exports.Bonus = {
	_cacheByKey: null,
	_cacheByTuto: null,

	_createCache: function() {
		if(!this._cacheByKey) {
			this._cacheByTuto = {};
			this._cacheByKey = {};
			var bs = ATW.Datas.BONUS;
			for(var i in bs) {
				this._cacheByKey[bs[i].key] = bs[i];
				if(bs[i].tuto_key) {
					this._cacheByTuto[bs[i].tuto_key] = bs[i];
				}
			}
		}
	},

	findByKey: function(key) {
		this._createCache();
		return this._cacheByKey[key];
	},

	findByTuto: function(tut) {
		this._createCache();
		return this._cacheByTuto[tut];
	}
};

})(window.Util = window.Util || {});