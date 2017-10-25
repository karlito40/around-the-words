(function(exports){

exports.FBManager = {

	FB: null,
	apiStand: [],

	isActive: function() {
		return this.FB;
	},

	api: function(graph, callback){
		if(!this.FB) {
			this.apiStand.push({
				graph: graph,
				callback: callback
			});
			return;
		}

		this.FB.api(graph, function(response) {
			callback(response);
		});

	},

	flush: function(){
		for(var i in this.apiStand) {
			var o = this.apiStand[i];

			this.api(o.graph, o.callback);
		}

		this.apiStand = [];
	},


	appRequest: function(o, callback){
		if(!this.FB) {
			return;
		}

		o.method = 'apprequests';
		this.FB.ui(o, callback);
	},

	ui: function(o, cb){
		if(!this.FB){
			return false;
		}

		this.FB.ui(o, cb);
		return true;
	},


	findMyAppRequests: function(callback){
		this.findAppRequests(ATW.App.getPlayer().fbId, callback);
	},

	findAppRequests: function(userId, callback) {
		this.api(userId + '/apprequests', function(response){
			if(callback) {
				var data = response.data || {};
				callback(data);
			}
		});
	},

	getFB: function(){
		return this.FB;
	},

	setFB: function(FB) {
		this.FB = FB;
	}



};



})(window.Api = window.Api || {});