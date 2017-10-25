'use strict';

(function(exports){

function DataManager(online)
{
	this.online = online;
	this.apis   = {};
};

DataManager.ONLINE = "OnlineApi";
DataManager.OFFLINE = "OfflineApi";


DataManager.prototype.getOnlineApi = function(){
	return this.getApi(DataManager.ONLINE);
};

DataManager.prototype.getOfflineApi = function() {
	return this.getApi(DataManager.OFFLINE);
};

DataManager.prototype.getApi = function(apiName)
{
	if(!apiName) {
		var apiName = (this.online) ? DataManager.ONLINE : DataManager.OFFLINE;
	}

	if(!this.apis[apiName]) {
		this.apis[apiName] = new Api[apiName]();
	}

	return this.apis[apiName];
};

DataManager.prototype.isOnline = function() { return this.online; };


DataManager.prototype.setOnline = function(online)
{
	return this.online;
};



exports.DataManager = DataManager;

})(window.Api = window.Api || {});