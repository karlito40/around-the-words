'use strict';

(function(namespace){

function Dictionary(map){
	this.map = map;
};

Dictionary.prototype.getMap = function() {
	return this.map;
};

namespace.Dictionary = Dictionary;

})(window.Game = window.Game || {});
