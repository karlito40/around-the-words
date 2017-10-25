'use strict';

(function(exports){

var Shop = {};

Shop.get = function() {
	var response = {};


	return response;
};

Shop.post = function(params) {
	var data = params.data;

	var userDataRq = data['u'];

	var res = Api.User._handleUpdate(userDataRq);

	if(data.b) {
		Api.Bonus._handleUpdate(data.b);
	}

	if(data.friend) {
		// throw new Error('Api::Shop friend need to be implemented')
		var worldId = data.friend['worldId'];
		Api.World.handleUpdate(worldId, {'friend': 0});
	}

	if(data.level){
		data.level.bought = true;
		Api.Score._handleUpdate(data.level);
	}

	return res;
};

Shop.delete = function(){};

exports.Shop = Shop;

})(window.Api = window.Api || {});

