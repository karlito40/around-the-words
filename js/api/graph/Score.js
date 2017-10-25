'use strict';

(function(exports){

var Score = {};

Score.get = function(params){

	var response = {};
	switch(params.on) {
		default:
			throw new Error('Score::get ' + params.on + ' need to be implemented');
	}

	return response;

};

Score.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

Score.delete = function(){
	Api.Storage.setItem('score', []);
};

Score._handleUpdate = function(data){
	var scoreList = Api.Storage.getItem('score') || []
		, worldId = data.world_id
		, levelId = data.level_id
		, scoreObject = this._getScoreObject(scoreList, worldId, levelId)
		, player = ATW.App.getPlayer()
		, update = {};

	if(typeof data['score'] != "undefined") update['score'] = parseInt(data['score'], 10);
	if(typeof data['star'] != "undefined") update['star'] = parseInt(data['star'], 10);
	if(typeof data['duration'] != "undefined") update['duration'] = parseInt(data['duration'], 10);
	if(typeof data['pearlsGrind'] != "undefined") update['pearlsGrind'] = parseInt(data['pearlsGrind'], 10);
	if(typeof data['bought'] != "undefined") update['bought'] = data['bought'];

	if(!scoreObject) {

		scoreObject = this._createOne();
		scoreObject['worldId']   = worldId;
		scoreObject['levelId']   = levelId;
		// scoreObject['uid']       = userId;
		// scoreObject['fbId']      = player.fbId;
		scoreObject['lang']      = player.lang;
		scoreObject['firstName'] = data['first_name'];

		scoreList.push(scoreObject);
	}

	for(var key in update) scoreObject[key] = update[key];

	Api.Storage.setItem('score', scoreList);

	return {};
};

Score._getScoreObject = function(list, worldId, levelId){
	var listLength = list.length;

	for(var i=0; i<listLength; i++){
		var o = list[i];
		if(o.worldId == worldId && o.levelId == levelId){
			return o;
		}
	}

	return null;
};


Score._createOne = function(){
	return {
		// fbId: '',
        levelId: null,
        worldId: null,
        bought: false,
        score: 0,
        star: 0,
        pearlsGrind: 0,
        lang: 'fr',
        duration: 0,
        firstName: 'Default'
    }

};

Score.getFormatList = function(){
	var list = Api.Storage.getItem('score') || []
		, listLength = list.length
		, fm = {};
	for(var i=0; i<listLength; i++) {
		var doc = list[i]
			, worldId = doc.worldId
			, levelId = doc.levelId
			, o = {};

		o = {
			id: levelId,
            score: parseInt(doc['score'], 10),
            star: parseInt(doc['star'], 10),
            bought: (doc['bought'] == 1),
            duration: parseInt(doc['duration'], 10),
            pearlsGrind: (doc['pearlsGrind']) ? parseInt(doc['pearlsGrind'], 10) : 0
        };

		if(!fm[worldId]) fm[worldId] = {};
		if(!fm[worldId].levels) fm[worldId].levels = {};

		fm[worldId].levels[levelId] = o;

	}

	return fm;
};


exports.Score = Score;

})(window.Api = window.Api || {});

