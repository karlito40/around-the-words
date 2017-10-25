'use strict';

(function(exports){

var Achievement = {};

Achievement.get = function(params){

	var response = {};
	return response;

};

Achievement.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};


Achievement._handleUpdate = function(data) {

	var achievementsCf = ATW.Datas.ACHIEVEMENTS;
	var myachievements = this.getFormatList();

	for(var keyType in data) {
		var achievements = data[keyType];

		for(var achId in achievements) {
			var achievement = achievements[achId];

			if(!achievementsCf[achId]) continue;


			if(!myachievements[keyType]) myachievements[keyType] = {};

			myachievements[keyType][achId] = {
				id: achId,
				progress: Util.Math2.castInt(achievement.progress),
				reward: achievement.reward
			}

		}


	}

	Api.Storage.setItem('achievement', myachievements);


	return {success: true};


};

Achievement.getFormatList = function(){
   // var achievementsCf = ATW.Datas.ACHIEVEMENTS;
   // var achievementsTypeCf = ATW.Datas.ACHIEVEMENTTYPES;

	var list = Api.Storage.getItem('achievement') || {};


	return list;
};


exports.Achievement = Achievement;

})(window.Api = window.Api || {});

