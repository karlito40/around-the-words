'use strict';

(function(exports){

var Bonus = {};

Bonus.get = function() {
	var response = {};
	return response;
};

Bonus.post = function(params) {
	var data = params.data;

	this._handleUpdate(data);

	return {success: true};
};

Bonus.delete = function(){};

Bonus._handleUpdate = function(data){
	if(!data.bonusMap) {
		this._handleSingleUpdate(data);
	} else {
		this._handleMultipleUpdate(data.bonusMap);
	}

	return {success: true};
};

Bonus._handleSingleUpdate = function(data) {
	var list = Api.Storage.getItem('bonus') || {};
	this._setList(list, data);
	this._save(list);
};

Bonus._handleMultipleUpdate = function(bonusMap) {
	var list = Api.Storage.getItem('bonus') || {};
	for(var bid in bonusMap) {
		this._setList(list, bonusMap[bid]);
	}

	this._save(list);
};

Bonus._setList = function(list, data, dontSave){
	var x = {
		id: data.id,
		quantity: data.quantity
	};

	list[x.id] = x;

};

Bonus.getFormatList = function(){
	return Api.Storage.getItem('bonus') || {};
};


Bonus._save = function(list){
	Api.Storage.setItem('bonus', list)
};

exports.Bonus = Bonus;

})(window.Api = window.Api || {});

