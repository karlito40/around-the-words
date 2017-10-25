'use strict';

(function(namespace) {

function DictionaryArray(map){
	namespace.Dictionary.call(this, map);
};

DictionaryArray.prototype.constructor = DictionaryArray;
DictionaryArray.prototype = Object.create(namespace.Dictionary.prototype);

DictionaryArray.prototype.rand = function() {
	var ri = ~~(Math.random() * this.map.length);
	return this.map[ri];
};

namespace.DictionaryArray = DictionaryArray;

})(window.Game = window.Game || {});