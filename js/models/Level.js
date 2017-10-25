'use strict';
(function(exports){

function Level(data)
{
	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			default:
				this[baseKey] = val;
		}
	}

	this.mode = null;
	this.waveHandler = null;

	var cLevel = ATW.Datas.LEVELS[data.id];
	this.mode = new Model.Mode(cLevel.mode_id, this);

	var difficultyTpl = new Model.DifficultyTemplate(cLevel.difficulty_id, this);
	var dropTpl       = new Model.LetterDropTemplate(cLevel.drop_id, difficultyTpl, cLevel.wave_quantity);
	this.waveHandler  = new Model.WaveTemplate(cLevel.wave_id, dropTpl);

	this.opponent = null;
	this.pearlsGrind = Util.Math2.castInt(data.pearlsGrind) || 0;

};

Level.prototype.getDifficultyTpl = function()
{
	return this.waveHandler.drop.difficulty;
};

Level.prototype.getNbWave = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	switch(this.mode.getKey())
	{
		case 'WRECKING_BALL':
		case 'HANGED':
				return this.waveHandler.getDrop().cfMaxQuantity;
		case 'SURVIVAL':
		case 'SIMPLE':
			return this.waveHandler.getDrop().getMaxQuantity();

		// case 'SURVIVAL':
		// 	return -1;
		case 'CROSSWORD':
			return 1;
	}


};


Level.prototype.addPearl = function(pearls)
{
	this.pearlsGrind += pearls;
};

Level.prototype.hasTuto = function()
{

	var order = this.getOrder(),
		player = ATW.App.getPlayer();
	if((!player.isTutoFisnish('level1') && order == 0)
		|| (!player.isTutoFisnish('level2') && order == 1)
		|| (!player.isTutoFisnish('level3') && order == 2)
		|| (!player.isTutoFisnish('level4') && order == 3)
	) {
		return order;
	}

	return false;

};

Level.prototype.getName = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.name;
};

Level.prototype.update = function(data)
{
	for(var i in data)
	{
		this[i] = data[i];
	}

	if(this.fake)
	{
		this.world.fake = false;
		this.fake = false;

	}

	ATW.App.getPlayer().reset();
};


// --------------------------------------------------------------
// Verifie l'ouverture d'un niveau
// --------------------------------------------------------------
Level.prototype.isOpen = function()
{
	var debug = (this.id == 1);
	var cLevel = ATW.Datas.LEVELS[this.id];

	// Le monde est accessible par defaut
	if(Util.Level.isAccessible(cLevel))
	{
		return true;
	}

	// Le niveau est ouvert si l'utilisateur a complete son antecedent
	var cPreviousLevel = Util.Level.getPrevious(cLevel);
	if(!cPreviousLevel)
	{
		return false;
	}

	return this.world.getLevel(cPreviousLevel).isComplete();
};

// --------------------------------------------------------------
// Le level est il termine ?
// --------------------------------------------------------------
// Level.prototype.isComplete = function(){ return (this.star); }
Level.prototype.isComplete = function(){
	return this.star || this.bought;
};

// --------------------------------------------------------------
// Le level est il termine a 100% ?
// --------------------------------------------------------------
Level.prototype.isCompletelyOver = function()
{
	if(!this.over)
	{
		return false;
	}
	return this.over;
};


Level.prototype.getStar = function()
{
	if(!this.star)
	{
		return 0;
	}
	return Util.Math2.castInt(this.star);
};

Level.prototype.getScore = function()
{
	if(!this.score)
	{
		return 0;
	}
	return Util.Math2.castInt(this.score);
};

Level.prototype.getHighScore = function()
{
	if(!this.highScore)
	{
		return 0;
	}

	return Util.Math2.castInt(this.highScore);
};


Level.prototype.getNext = function()
{
	var cNext = Util.Level.getNext(ATW.Datas.LEVELS[this.id]);
	if(!cNext)
	{
		return false;
	}

	return this.world.getLevel(cNext);

};

Level.prototype.shop = function()
{
	this.fake = false;
	this.bought = true;
}

Level.prototype.isBuyable = function()
{
	return this.isFake();
};


Level.prototype.getPrevious = function()
{
	var cPrev = Util.Level.getPrevious(ATW.Datas.LEVELS[this.id]);
	if(!cPrev)
	{
		return false;
	}

	return this.world.getLevel(cPrev);
};

// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
Level.prototype.getLife = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.life;
};
Level.prototype.getConf  = function() { return ATW.Datas.LEVELS[this.id]; };
Level.prototype.getGrid  = function() { return this.grid; };
Level.prototype.isFake   = function() { return this.fake; };
Level.prototype.getId    = function() { return this.id; };
Level.prototype.getWorld = function() { return this.world; };
Level.prototype.getMode  = function() { return this.mode; };
Level.prototype.getOpponent = function() { return this.opponent; };
Level.prototype.getPoint = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return {x: cLevel.point_x, y:cLevel.point_y};
};
Level.prototype.getWaveHandler = function(){ return this.waveHandler; };
Level.prototype.getSpawnPearl = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.spawn_pearl;
};

Level.prototype.isScoringActive = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.scoring;
};


Level.prototype.getOrder = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return Util.Math2.castInt(cLevel.order);
};

Level.prototype.getDuration = function()
{
	return this.duration || 0;
};

Level.prototype.getPearls = function(){ return this.pearlsGrind; };
Level.prototype.incrPearls = function(by) {
	this.pearlsGrind += by;
};


Level.prototype.setOpponent = function(opponent)
{
	this.opponent = opponent;
};

Level.prototype.getPointFrame = function(){
	var pointFrame = 'world_point_off';
	if(this.isComplete()) pointFrame = 'world_point_done';
	else if(this.isOpen()) pointFrame = 'world_point_todo';

	return pointFrame;
};


// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
Level.prototype.setWorld = function(world) { this.world = world; };
Level.prototype.setId    = function(id) { this.id = id; };

exports.Level = Level;

})(window.Model = window.Model || {});