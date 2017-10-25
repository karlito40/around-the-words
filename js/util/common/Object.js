'use strict';
(function(exports){

exports.Object = {
	first: function(o){
		for(var i in o) {
			return o[i];
		}

		return null;
	},

	merge: function(o1, o2){

		for(var key in o2)
		{
			if(o1[key]) o1[key] = this.merge(o1[key], o2[key]);
			else o1[key] = o2[key];
		}

		return o1
	},

	each: function(o, cb){
		for(var key in o) {
			cb(o[key], o);
		}
	}
};

})(window.Util = window.Util || {});

