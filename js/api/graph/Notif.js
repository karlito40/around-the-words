'use strict';

(function(exports){

var Notif = {};

Notif.nbUpdate = 0;
Notif.get = function(params){

	var response = {};
	return response;

};

Notif.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

Notif.delete = function(params){
	if(typeof params.on == "undefined") Api.Storage.setItem('notif', []);
	else {
		var list = this.getFormatList();
		delete list[params.on];
		// list.splice(Util.Math2.castInt(params.on), 1);

		Api.Storage.setItem('notif', list);
	}
};

Notif._handleUpdate = function(data) {
	var o = {
		type: data.type,
		message: data.message,
		// id: data.id
		id: Date.now() + Notif.nbUpdate
	}

	Notif.nbUpdate++;

	var notifs = this.getFormatList();
	notifs[o.id] = o;
	// notifs.push(o);


	Api.Storage.setItem('notif', notifs)

	return {
		request: o,
		success: true
	};
};

Notif.getFormatList = function(){

	return Api.Storage.getItem('notif') || {};

};
exports.Notif = Notif;

})(window.Api = window.Api || {});

