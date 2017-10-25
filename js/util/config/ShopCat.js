'use strict';
(function(exports){

	exports.ShopCat = {
		findByKey: function(key) {
			for(var i in ATW.Datas.SHOPCATS) {
				if(ATW.Datas.SHOPCATS[i].key == key) {
					return ATW.Datas.SHOPCATS[i];
				}
			}
			return false;
		}

	};

})(window.Util = window.Util || {});