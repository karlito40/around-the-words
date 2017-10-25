(function(exports){

function World(data)
{
	this.bought = data.bought;
	this.levels = {};
	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			case 'levels':
				for(var levelId in val) this.addLevel(val[levelId]);
				break;

			default:
				this[baseKey] = val;
		}
	}

	this.opponent = null;
};

World.prototype.setEnterOnce = function(bool){	this.enterOnce = bool; };
World.prototype.isEnterOnce = function(){return this.enterOnce;};


World.prototype.addLevel = function(data)
{
	this.levels[data.id] = new Model.Level(data);
	this.levels[data.id].setWorld(this);
	this.levels[data.id].setId(data.id);
};

World.prototype.getFriends = function()
{
	return this.friends || [];
};

World.prototype.addFriend = function()
{
	if(!this.friends)
	{
		this.friends = [];
	}

	this.friends.push({
		bought: true
	});

};


// --------------------------------------------------------------
// Le nombre d'étoiles que l'on a recolté dans ce monde
// --------------------------------------------------------------
World.prototype.sumStar = function()
{
	if(this.isFake())
	{
		return 0;
	}

	var myStar = 0;
	for(var i in this.levels)
	{
		myStar += this.levels[i].getStar();
	}

	return myStar;
};

World.prototype.getMaxStar = function()
{
	return ATW.Datas.WORLDS[this.id].star_max;
};

World.prototype.getPrice = function()
{
	var friends = this.getFriends();
	var product = Util.Shop.findProductByKey('FRIEND_BASE');
	var price = Util.Math2.castInt(product.price);

	return price - (Util.Math2.castInt(ATW.Datas.CONFIGS.SHOP_FRIEND_DECR_BY)*friends.length);

};

World.prototype.getStarNeed = function()
{
	return (ATW.Datas.WORLDS[this.id].star - App.getPlayer().getStar());
};

World.prototype.prevHasFinishAllLvl = function()
{
	var cWorld = ATW.Datas.WORLDS[this.id];
	// Le monde est ouvert si l'utilisateur a complete son antecedent
	var cPreviousWorld = Util.World.getPrevious(cWorld);
	if(!cPreviousWorld)
	{
		// console.log('previous nop')
		return false;
	}

	var prevWorld = this.user.getWorld(cPreviousWorld);
	if(prevWorld.isFake())
	{
		// console.log('previous fake')
		return false;
	}

	if(!prevWorld.hasFinishAllLvl())
	{
		// console.log('dernier level non complete')
		return false;
	}

	return true;

};

World.prototype.getName = function()
{
	return ATW.Datas.WORLDS[this.id].name;
};

// --------------------------------------------------------------
// Verifie l'ouverture d'un monde
// --------------------------------------------------------------
World.prototype.isOpen = function()
{
	if(this.bought)
	{
		return true;
	}

	var cWorld = ATW.Datas.WORLDS[this.id];
	// Le monde est accessible par defaut
	if(Util.World.isAccessible(cWorld))
	{
		return true;
	}

	if(!this.prevHasFinishAllLvl())
	{
		return false;
	}


	var friends = this.getFriends();
	if(friends.length >= cWorld.nb_friend_need)
	{
		return true;
	}

	return (this.getStarNeed() <= 0);
};

World.prototype.hasFinishAllLvl = function()
{
	var cWorld = ATW.Datas.WORLDS[this.id];

	for(var i in cWorld.levels)
	{
		var levelId = cWorld.levels[i];
		if(!this.levels[levelId] || !this.levels[levelId].getStar())
		{
			return false;
		}

	}

	return true;
};


// --------------------------------------------------------------
// Le monde est il termine ?
// --------------------------------------------------------------
World.prototype.isComplete = function()
{
	if(this.isFake())
	{
		return false;
	}

	return (this.sumStar() >= ATW.Datas.WORLDS[this.id].star && this.hasFinishAllLvl());
};

World.prototype.getScore = function(){
	if(this.isFake())
	{
		return 0;
	}

	var score = 0;
	for(var id in this.levels) {
		score += this.levels[id].getScore();
	}
	return score;
};

World.prototype.getLevel = function(cLevel)
{
	if(!this.levels) this.levels = {};

	if(!this.levels[cLevel.id])
	{
		this.levels[cLevel.id] = new Model.Level({
			fake: true,
			world: this,
			id: cLevel.id
		});
	}

	return this.levels[cLevel.id];
};

World.prototype.shop = function()
{
	this.fake = false;
	this.bought = true;
};


World.prototype.getConf = function() { return ATW.Datas.WORLDS[this.id]; };
World.prototype.getKey = function() { return ATW.Datas.WORLDS[this.id].key; };
World.prototype.isFake  = function(){ return this.fake; };
World.prototype.setId   = function(id){ this.id = id; };
World.prototype.getId   = function() { return this.id; };
World.prototype.setUser = function(user) { this.user = user; };
World.prototype.getUser = function() { return this.user; };

World.prototype.getOpponent = function() { return this.opponent; };
World.prototype.setOpponent = function(opponent)
{
	this.opponent = opponent;
};


World.prototype.getLastVisited = function()
{
	return this.lastVisited;
};

World.prototype.setLastVisited = function(lastVisited)
{
	this.lastVisited = lastVisited;
};


exports.World = World;

})(window.Model = window.Model || {});