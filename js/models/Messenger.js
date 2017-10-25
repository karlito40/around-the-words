'use strict';

(function(exports){

function Messenger(data)
{
	this.reset();

	// this.genId = Messenger.ids++;
	for(var i in data) {
		var currentData = data[i];
		this.addSVRequest(currentData);
	}


};

Messenger.ids = 0;

Messenger.prototype.addSVRequest = function(request) {
	this.addRequest({
		db: true,
		id: request.id,
		// from: {id: request.fbFrom},
		from: {id: request.from},
		// receiver: {id: data.fbReceiver},
		message: request.message,
		data: {
			type: request.type
		}
	});
};

Messenger.prototype.reset = function() {
	// this.requests = [];
	this.requests = {};
	this.nbRequest = 0;
};

Messenger.prototype.addRequest = function(request){

	this.requests[request.id] = request;
	// this.requests.push(request);
	this.nbRequest++;
};

Messenger.prototype.total = function(){
	return this.nbRequest;
};

Messenger.prototype.isEmpty = function(){
	// return !this.total();
	return this.nbRequest;
};

Messenger.prototype.getRequests = function(){
	return this.requests;
};

Messenger.prototype.getRequest = function(i) {
	return this.requests[i] || false;
};

Messenger.prototype.deleteRequest = function(i) {
	// this.requests.splice(this.requests.indexOf(i), 1);
	if(this.requests[i]) {
		var rq = this.requests[i];

		if(!rq.db){
			if(Api.FBManager.getFB()){
				Api.FBManager.getFB().api('/' + i, 'delete');
				// fbManager.getFB().api('/' + rq.id, 'delete');
			}
		} else {
			ATW.App.getDataManager().getApi().call('Notif', 'Delete', {
			  on: i,
			  data: {}
			}, function(res){});
		}
		this.nbRequest--;
		delete this.requests[i];
		// this.requests.splice(i, 1);
	}
};


exports.Messenger = Messenger;

})(window.Model = window.Model ||{});