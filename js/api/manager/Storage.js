'use strict';

(function(exports){

var system = window.localStorage;
if(typeof system == "undefined")
{
	system = {
		map: {},
		setItem: function(key, value){
			this.map[key] = value;
		},

		getItem: function(key) {
			return this.map[key];
		}

	}
};

exports.Storage = {
	namespace: 'atw',
	setItem: function(key, value) {
		value = JSON.stringify(value);
		system.setItem(this.createKey(key), value);
	},

	getItem: function(key) {
		var value = system.getItem(this.createKey(key));
		return JSON.parse(value);
	},

	createKey: function(key) {
		return key + "_" + this.namespace;
	}

};


})(window.Api = window.Api || {});