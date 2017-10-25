(function(exports){

function User(data)
{
	this.worlds = {};
	this.bonusMap = {};
	this.life = 0;
	this.achievementManager = new Model.AchievementManager();
	this.messenger = new Model.Messenger(data.notifs);

	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			case 'worlds':
				for(var worldId in val)
				{
					this.worlds[worldId] = new Model.World(val[worldId]);
					this.worlds[worldId].setId(worldId);
					this.worlds[worldId].setUser(this);
				}
				break;

			case 'bonusMap':
				for(var bonusId in val)
				{
					this.bonusMap[bonusId] = new Model.Bonus(val[bonusId]);
				}
				break;

			case 'achievements':
				for(var achKey in val)
				{
					var achievementsList = val[achKey];
					for(var achID in achievementsList)
					{
						this.achievementManager.setAchievement(new Model.Achievement(achievementsList[achID]));
					}


				}
				break;

			default:
				this[baseKey] = val;
		}
	}

	// if(!this.pearls || this.pearls < 1000) {
	// 	this.pearls = 9999;
	// 	alert('Debug 999 pearls gift');
	// }
	this.reset();
};

User.prototype.hasDailyReward = function(){	return this.waitingDailyGift; };

User.prototype.getBMapResume = function() {
	var o = {};
	for(var i in this.bonusMap)
	{
		o[i] = this.bonusMap[i].getResume();
	}

	return o;
};

User.prototype.isFullLife = function()
{
	return (Util.Math2.castInt(ATW.Datas.CONFIGS.GEN_MAX_LIFE) == this.life);
};


User.prototype.getLife = function(){ return this.life; }
User.prototype.hasLife = function(){ return this.getLife(); }

User.prototype.consumeBonus = function(bonusID)
{
	if(!this.hasBonus(bonusID))
	{
		return false;
	}

	return this.bonusMap[bonusID].decr();
};

User.prototype.incrBonus = function(bonusID, by)
{
	if(!this.hasBonus(bonusID))
	{
		this.addBonus(bonusID);
	}

	this.bonusMap[bonusID].incr(by);
};

User.prototype.addBonus = function(bonusID)
{
	this.bonusMap[bonusID] = new Model.Bonus({
		id: bonusID
	});
};

User.prototype.myUpdate = function(res)
{
	if(!res.u)
	{
		return;
	}

	for(var key in res.u)
	{
		if(key == 'bonusMap')
		{
			var resBonusMap = res.u[key];
			for(var bID in resBonusMap)
			{
				if(!this.hasBonus(bID))
				{
					this.addBonus(bID);
				}
				this.bonusMap[bID].setQuantity(resBonusMap[bID].quantity);
			}
		}
		else
		{
			this[key] = res.u[key];
		}

	}


	if(this.onMyUpdate)
	{
		this.onMyUpdate();
	}
};


User.prototype.reset = function()
{
	this.star = null;
};

User.prototype.incrPearls = function(by)
{
	if(!this.pearls) this.pearls = by;
	else this.pearls = Util.Math2.castInt(this.pearls) + by;
};

User.prototype.getPearls = function()
{
	return Util.Math2.castInt(this.pearls) || 0;
};


User.prototype.getWorld = function(cWorld, keys)
{
	if(!this.worlds) this.worlds = {};
	if(!this.worlds[cWorld.id])
	{
		this.worlds[cWorld.id] = new Model.World({
			fake: true,
			id: cWorld.id,
			user: this
		});
	}

	var world = this.worlds[cWorld.id];
	if(!keys)
	{
		return world;
	}

	if(keys.length == 1)
	{
		return world[keys[0]];
	}

	var data = {};
	for(var i in keys)
	{
		data[keys[i]] = world[keys[i]];
	}

	return data;
};

User.prototype.getStar = function()
{
	if(this.star != null)
	{
		return this.star;
	}

	if(!this.worlds)
	{
		return 0;
	}

	this.star = 0;
	for(var i in this.worlds)
	{
		this.star += this.worlds[i].sumStar();
	}

	return this.star;
};

User.prototype.hasBonus = function(bonusID)
{
	return ( this.bonusMap[bonusID] );
};


User.prototype.getBonus       = function(bonusID) { return this.bonusMap[bonusID]; };
User.prototype.getBonusMap    = function() { return this.bonusMap; };
User.prototype.getWorlds      = function() { return this.worlds; };

User.prototype.isTutoFisnish = function(key)
{
	// return true;
	return (this.tutos && this.tutos[key]) ? true : false;
};

User.prototype.finishTuto = function(key)
{
	if(!this.tutos)
	{
		this.tutos = {};
	}
	this.tutos[key] = {done: true};
};

User.prototype.setPearls = function(pearls)
{
	this.pearls = pearls;
};

User.prototype.getName = function()
{
	return this.firstName + ' ' + this.lastName;
};

User.prototype.getFirstName = function()
{
	return this.firstName;
};

User.prototype.getLastName = function()
{
	return this.lastName;
};

User.prototype.getLang = function()
{
	return this.lang;
};


User.prototype.setLanguage = function(lang, locale){
	this.lang = lang;
	this.locale = locale;
};

User.prototype.getTimeAccelLeft = function()
{
	if(!App.getPlayer().timeAccelLeft) return null;
	return App.getPlayer().timeAccelLeft - DateHelper.getAccelElapseTime();
};

User.prototype.createAccel = function(key) {
	this[key] = true;
};



User.prototype.getLocale = function()
{
	return this.locale;
};

User.prototype.isOnSession = function()
{
	return this.normalSessionAt;
};

User.prototype.getAchievementManager = function()
{
	return this.achievementManager;
};

User.prototype.getMessenger = function()
{
	return this.messenger;
};

exports.User = User;

})(window.Model = window.Model || {});