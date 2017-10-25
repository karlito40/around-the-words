'use strict';

(function(namespace) {

function DictionarySort(map){

	namespace.Dictionary.call(this, map);
};

DictionarySort.prototype.constructor = DictionarySort;
DictionarySort.prototype = Object.create(namespace.Dictionary.prototype);

DictionarySort.prototype.getIndex = function(index) {
	return this.map[index] || false;
};

namespace.DictionarySort = DictionarySort;

})(window.Game = window.Game || {});