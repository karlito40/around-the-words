(function(exports){

var Achievement;
exports.Achievement = Achievement = {};

Achievement.castByKey = function(){
	var res = {};

	var achievements = ATW.Datas.ACHIEVEMENTS;
	var achievementtypes = ATW.Datas.ACHIEVEMENTTYPES;
	for(var id in achievements)
	{
		var cfAch  = achievements[id];
		var achKey = achievementtypes[cfAch.actype_id].key;

		if(!res[achKey])
		{
			res[achKey] = {};
		}

		res[achKey][cfAch.id] = new Model.Achievement(cfAch);
	}

	return res;
};

Achievement.getTypeKey = function(achId) {
	var c = this.getType(achId);
	return c.key;
};

Achievement.getTypeDescription = function(achId) {
	var c = this.getType(achId);
	return c.name;
};

Achievement.getType = function(achId) {
	var cAchs = ATW.Datas.ACHIEVEMENTS
		, achTypes = ATW.Datas.ACHIEVEMENTTYPES;
	return achTypes[cAchs[achId].actype_id];
};



}) (window.Util = window.Util || {});