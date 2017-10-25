'use strict';

(function(exports){

function Api(){};

Api.prototype.call = function(/* use arguments */)
{

	if(!arguments.length || arguments.length > 4)
	{
		throw new Error("Api::call arguments invalides");
	}
	var callback = null;
	var lastIndex = arguments.length-1;
	var lastArgument = arguments[lastIndex];
	if(typeof lastArgument == "function")
	{
		callback = lastArgument;
	}


	var path     = arguments[0];
	var method   = (!(lastIndex == 1 && callback) && typeof arguments[1] != "undefined") ? arguments[1] : "get";
	var params   = (!(lastIndex == 2 && callback) && typeof arguments[2] != "undefined") ? arguments[2] : null;

	method = method.toLowerCase();
	if(method != "get" && method != "post" && method != "delete")
	{
		throw new Error('Api::call method{get,post,delete} accepte');
	}
	return this._call(path, method, params, callback);

};


Api.prototype._call = function(path, method, params, callback)
{
	throw new Error('Api::_call doit etre surcharge');

};

exports.Api = Api;

})(window.Api = window.Api || {});