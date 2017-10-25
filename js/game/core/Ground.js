'use strict';
(function(exports){
function Ground(grid, groundParam, line, col, position)
{
	this.grid = grid;
	this.id         = Ground.id++;
	this.index      = this.id;
	this.line       = line;
	this.col        = col;
	this.foundation = groundParam.gd;
	this.view       = groundParam.view;
	this.subView = null;
	if(this.isLDLostLife())
	{
		this.subView = this.view;
		this.view = null;
	}

	if(groundParam.groundType)
	{
		var gdTypeMap = Util.Ground.findByGdType(groundParam.groundType.id);
		if(gdTypeMap && gdTypeMap.length)
		{
			this.view = gdTypeMap[Util.Math2.randomInt(0, gdTypeMap.length-1)].id;
		}
	}
	// console.log('groundParam', groundParam);
	this.bonus      = null;
	if(groundParam.bonus && groundParam.bonus != Game.Grid.BONUS_HOLE && groundParam.bonus != Game.Grid.BONUS_WALL)
	{
		this.addBonus(new Model.Bonus({
				id: Util.Bonus.findByKey(groundParam.bonus).id
			})
		);
	}


	this.hole       = null;
	this.left       = position.left;
	this.top        = position.top;
	this.wall       = 0;
	this.width      = Ground.WIDTH;
	this.height     = Ground.HEIGHT;

	this.spawnPearl = groundParam.dropPearl;
	this.pearl = null;

	this.letterFish = null;
	if(groundParam.letter)
	{
		// this.letterFish = LetterFish.create(groundParam.letter, grid.game);
		this.letterFish = Game.LetterFish.create(groundParam.letter, grid.game.getLevel().getDifficultyTpl());
		this.letterFish.moveTo(this);
	}

	if(this.foundation == Game.Ground.LD_HOLE)
	{
		this.createHole();
	}
	else if(this.foundation == Game.Ground.LD_WALL)
	{
		// console.log('createWall');
		this.createWall();
	}
};

Ground.prototype.isEqualTo = function(ground) { return (ground.id == this.id); };

Ground.prototype.dropPearl = function()
{
	if(!this.spawnPearl) return;

	this.pearl = this.spawnPearl;

};

Ground.prototype.createHole = function()
{
	this.hole = new Game.Hole(this);
	this.hole.suck();
};

Ground.prototype.getAvailableHoleFish = function()
{
	if(!this.letterFish && this.hole && this.hole.getLetterFish()){
		return this.hole.getLetterFish();
	}

	return null;
};


Ground.prototype.addHole = function()
{
	this.foundation = Game.Ground.LD_HOLE;
	this.createHole();
};

Ground.prototype.attackWall = function()
{
	// console.log('attackWall', this.wall);
	this.wall--;
	return this;
};

Ground.prototype.isWallAccept = function()
{
	return (this.foundation == Game.Ground.LD_WALL && !this.hasWall());
};

Ground.prototype.isLDWall = function()
{
	return (this.foundation == Game.Ground.LD_WALL);
};

Ground.prototype.isLDHole = function()
{
	return (this.foundation == Game.Ground.LD_HOLE);
};


Ground.prototype.isSolid = function()
{
	return (this.foundation != Game.Ground.LD_GAP && this.foundation != Game.Ground.LD_X);
};

Ground.prototype.isNothing = function()
{
	return this.foundation == Game.Ground.LD_X;
};

Ground.prototype.isLDLostLife = function()
{
	return (this.foundation == Game.Ground.LD_LOST_LIFE);
};

// Envoie un poisson vers une nouvelle destination
Ground.prototype.sendFishTo = function(ground)
{
	var sendOccured = false;
	if(this.letterFish)
	{
		sendOccured = true;
	}

	ground.receiveFish(this.letterFish);
	this.letterFish = null;
	return sendOccured;
};

// Reception d'un poisson
Ground.prototype.receiveFish = function(letterFish)
{
	this.letterFish = letterFish;
	if(this.letterFish)
	{
		this.letterFish.moveTo(this);
	}

	if(this.hole)	// Le trou essaye d'aspirer la meduse
	{
		this.hole.suck();
	}
};

Ground.prototype.addBonus = function(bonus)
{
	this.bonus = bonus;
};

Ground.prototype.createWall = function()
{
	this.wall = 3;
};

Ground.prototype.getHole       = function() { return this.hole; };
Ground.prototype.hasWall       = function() { return this.wall > 0 };
Ground.prototype.hasBonus      = function() { return this.bonus; };
Ground.prototype.hasLetterFish = function() { return this.letterFish; };
Ground.prototype.hasHole       = function() { return this.hole; };
Ground.prototype.hasPearl      = function() { return this.pearl; };

// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
Ground.prototype.getId         = function() { return this.id; };
Ground.prototype.getFoundation = function() { return this.foundation; };
Ground.prototype.getLeft       = function() { return this.left; };
Ground.prototype.getTop        = function() { return this.top; };
Ground.prototype.getLetterFish = function() { return this.letterFish; };
Ground.prototype.getPosition   = function() { return {top: this.top, left: this.left}; };
Ground.prototype.getBonus      = function() { return this.bonus; };
Ground.prototype.getLine       = function() { return this.line; };
Ground.prototype.getWall       = function() { return this.wall; };
Ground.prototype.getCol        = function() { return this.col; };
Ground.prototype.getWidth      = function() { return this.width; };
Ground.prototype.getHeight     = function() { return this.height; };
Ground.prototype.getIndex      = function() { return this.index; };
Ground.prototype.getHitArea = function() {
	return [this.left, this.top, this.width, this.height];
};
Ground.prototype.getViewUrl    = function() {
	if(!this.view) {
		return false;
	}
	return this.view;
};

Ground.prototype.getSubViewUrl    = function() {
	if(!this.subView) {
		return false;
	}
	return UrlHelper.getGround(this.subView);
};
Ground.prototype.getPearl      = function() { return this.pearl; };

// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
Ground.prototype.setFoundation = function(foundation) { this.foundation = foundation; };
Ground.prototype.setLetterFish = function(letterFish) { this.letterFish = letterFish; };
Ground.prototype.setBonus      = function(bonus) { this.bonus = bonus; };
Ground.prototype.setPearl      = function(pearl) { this.pearl = pearl; };

Ground.id = 0;

Ground.WIDTH     = 79;
Ground.HEIGHT    = 121;
Ground.THICKNESS = 42;

Ground.LD_BASE      = 'LD_BASE';		// Case de base
Ground.LD_GAP       = 'LD_GAP';			// Case "saut"
Ground.LD_LOST_LIFE = 'LD_LOST_LIFE';	// Case de terminaison
Ground.LD_X         = 'LD_X';			// Case inexistante
Ground.LD_WALL      = 'LD_WALL';		// Case autorisant la presence de mur
Ground.LD_HOLE      = 'LD_HOLE';

Ground.LdList = [Ground.LD_BASE, Ground.LD_GAP, Ground.LD_LOST_LIFE, Ground.LD_X, Ground.LD_WALL, Ground.LD_HOLE];


exports.Ground = Ground;

})(window.Game = window.Game || {});