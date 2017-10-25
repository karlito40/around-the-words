'use strict';

(function(exports){
var Url = {};

Url.getPlatformCDN = function(){
	var o = {};
  	o.crossOrigin = false;
    o.baseUri = '';
    if(EXPORT_PLATFORM == 'facebook') {
    	o.baseUri = CDN;
    	o.crossOrigin = true;
    }


    return o;
};

exports.Url = Url;

})(window.Util = window.Util || {});
