'use strict';

(function(namespace){

function DictionaryLoader(key){
	this.key = key;

    var exportCDN = Util.Url.getPlatformCDN();

	this.loader = new PIXI.JsonLoader(exportCDN.baseUri + 'resources/dictionaries/' + key + '.json', exportCDN.crossOrigin);
};

DictionaryLoader.prototype.load = function() {
	var self = this;
	this.loader.on('error', function(e){
		self.onComplete(e);
	})
	this.loader.on('loaded', function(e){
		console.log('load');
		self.onComplete(null, e.content.json || e.content.content.json);
	});
	this.loader.load();

};

namespace.DictionaryLoader = DictionaryLoader;

})(window.Game = window.Game || {});

