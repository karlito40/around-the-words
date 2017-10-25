'use strict';
(function(exports){

function AchievementManager()
{
	this.achievements = Util.Achievement.castByKey();
	this.hasUpdate = false;
	this.nbGiftLeft = 0;
};

AchievementManager.prototype.setAchievement = function(achievement)
{
	var achKey = achievement.getKey();
	if(!this.achievements[achKey])
	{
		this.achievements[achKey] = {};
	}

	if(
		(!this.achievements[achKey][achievement.getId()] || !this.achievements[achKey][achievement.getId()].isComplete())
		&& achievement.hasGift())
	{
		this.nbGiftLeft++;
	}

	this.achievements[achKey][achievement.getId()] = achievement;
};

AchievementManager.prototype.dispatch = function(key, content, by, replace)
{
	if(!this.achievements[key])
	{
		return false;
	}

	var achList = this.achievements[key];
	for(var i in achList)
	{
		var b = achList[i].incr(content, by, replace);
		if(b)
		{
			achList[i].hasUpdate = true;
			this.hasUpdate = true;

			if(achList[i].isComplete())
			{
				this.nbGiftLeft++;
				if(this.onComplete) this.onComplete(achList[i]);
			}
		}
	}

	return this.hasUpdate;
};

AchievementManager.prototype.getNbGiftLeft = function()
{
	return this.nbGiftLeft;
};

AchievementManager.prototype.save = function(force, rwId)
{
	if(!force && !this.hasUpdate)
	{
		return;
	}
	this.hasUpdate = false;

	var data = {};
	for(var key in this.achievements)
	{
		var achList = this.achievements[key];


		for(var id in achList)
		{
			if(!achList[id].hasUpdate) continue;

			if(!data[key]) data[key] = {};

			data[key][id] = achList[id].getResume();
			achList[id].hasUpdate = true;
		}

	}

	ATW.App.getDataManager().getApi().call('Achievement', 'POST', {
		on: 'me',
		data: data
	}, function(res){});

};

AchievementManager.prototype.each = function(cb, byCategory, exclude)
{
	if(byCategory)
	{
		through = {};
		for(var key in this.achievements)
		{
			if(!through[key]) through[key] = {};
			var achList = this.achievements[key];

			for(var id in achList)
			{
				var a = achList[id];
				var cat = a.getCategory();

				if(!through[key][cat]) through[key][cat] = [];

				through[key][cat].push(a);

			}

			// console.log('through', key, through[key]);
			for(var cat in through[key])
			{

				through[key][cat].sort(function(ach1, ach2){
					if(ach1.x > ach2.x) return 1;
					if(ach1.x < ach2.x) return -1;

					return 0;
				});

				var oldAch = null;
				for(var k in through[key][cat])
				{
					if(!oldAch || oldAch.isComplete()) {
						cb(through[key][cat][k]);
						oldAch = through[key][cat][k];
					}

				}
			}



		}

	}
	else
	{
		for(var key in this.achievements)
		{
			var achList = this.achievements[key];

			for(var id in achList)
			{
				cb(achList[id]);
			}

		}
	}


};



AchievementManager.prototype.getAchievements = function(key)
{
	return this.achievements[key];
};

AchievementManager.prototype.getAchievement = function(cAchievement)
{
	var key = ConfigAchievementHelper.getTypeKey(cAchievement.id);

	if(!key || !this.achievements[key] || !this.achievements[key][cAchievement.id]) {
		return false;
	}

	return this.achievements[key][cAchievement.id];
}

exports.AchievementManager = AchievementManager;

})(window.Model = window.Model || {});