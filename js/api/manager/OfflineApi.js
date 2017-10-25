'use strict';

(function(exports){

function OfflineApi(){};

OfflineApi.prototype = Object.create(Api.Api.prototype);
OfflineApi.prototype.constructor = OfflineApi;

OfflineApi.prototype._call = function(path, method, params, callback)
{
	var response = {};
	if(Api[path]) {
		response = Api[path][method](params);
	} else {
		console.log('OfflineApi::_call ' + path + ' need to be implemented');
	}

	if(callback) callback(response);

};


exports.OfflineApi = OfflineApi;

})(window.Api = window.Api || {});