'use strict';

(function(exports){

var World = {};


World.post = function(params){
	var data = params.data
		, worldId = data.id
		, cWorld = ATW.Datas.WORLDS[worldId];

	if(!cWorld) return {success: false};

	if(typeof data.enterOnce != "undefined") return this.handleUpdate(worldId, {enterOnce: true});
	if(typeof data.lastVisited != "undefined") return this.handleUpdate(worldId, {lastVisited: data.lastVisited});

	if(!data.b) return {success: false};

	return this.handleUpdate(worldId, {bought: true});

};

World.handleUpdate = function(worldId, bindData) {
	var list = this.getFormatList()
		, myWorld = list[worldId] || {};


	if(bindData.friend) {
		if(!myWorld.friends) myWorld.friends = [];
		myWorld.friends.push(bindData.friend);

		delete bindData.friend;
	}

	for(var key in bindData) {
		myWorld[key] = bindData[key];
	}

	list[worldId] = myWorld;
	Api.Storage.setItem('world', list);

	return {success: true};

};

World.getFormatList = function() {
	return Api.Storage.getItem('world') || {};
};


exports.World = World;

})(window.Api = window.Api || {});