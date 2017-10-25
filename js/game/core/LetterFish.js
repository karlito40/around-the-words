'use strict';
(function(exports){

function LetterFish(letter, difficulty)
{
	this.id         = LetterFish.id++;
	this.index      = 0;
	this.oldLetter = this.letter = letter;
	this.xM2 = (this.letter.indexOf(LetterFish.DOUBLE) != -1);
	if(this.xM2)
	{
		this.letter = this.letter[0];
	}
	if(this.letter == LetterFish.DOUBLE)
	{
		// this.letter = CharHelper.rand();
		this.letter = difficulty.letter();
		if(this.letter.indexOf(LetterFish.DOUBLE) != -1){
			this.letter = this.letter.slice(1);
		}
	}

	this.bonus      = null;
	this.hp         = 1;
	this.ground     = null;
	this.eat        = false;
	this.hole     = null;
	this.pearl      = null;
	this.stomach    = null;
	this.validate   = false;
	this.hasBeenKill = false;
	this.grey = false;
	this.ghost = false;

	this._createScore();
};



LetterFish.prototype._createScore = function()
{
	this.score = Game.Char.getWeight(this.letter);
};



LetterFish.prototype.isJoker = function()
{
	return (this.letter == LetterFish.JOKER);
};

/**
*  Remplace la lettre courante par une lettre aleatoire
*/
LetterFish.prototype.randLetter = function()
{
	if(this.letter == LetterFish.JOKER)
	{
		return false;
	}

	this.letter = Game.Char.rand();
	this._createScore();
	return true;
};

/**
* Ingurgite ce qui se trouve sur le sol au moment de se deplacer
*/
LetterFish.prototype.moveTo = function(ground)
{
	this.ground = ground;

	if(this.ground)
	{
		this.index = this.ground.getIndex();

		switch(this.ground.getFoundation())
		{
			case Game.Ground.LD_BASE:
			case Game.Ground.LD_GAP:
			case Game.Ground.LD_X:
				break;

			case Game.Ground.LD_LOST_LIFE:
				this.hp -= 1;
				this.hp = Math.max(0, this.hp);
				break;

		}
	}

	this.giveFood();
};

LetterFish.prototype.giveFood = function()
{
	this.eat = false;
	this.stomach = null;

	if(!this.ground)
	{
		return;
	}

	if(this.ground.hasBonus())
	{
		this.pearl = null;	// L'ancienne perle est perdue
		this.bonus = this.ground.getBonus();

		this.ground.setBonus(null);
		this.eat = true;

		this.activeBonus();
	}
	else if(this.ground.hasPearl())
	{
		this.bonus = null;	// L'ancien bonus est perdu
		this.pearl = this.ground.getPearl();

		this.ground.setPearl(null);
		this.eat = true;
	}
};

LetterFish.prototype.isFat = function(){ return (this.bonus || this.pearl); };

LetterFish.prototype.activeBonus = function(bonus)
{
	if(bonus)
	{
		this.bonus = bonus;
	}

	if(!this.bonus)
	{
		return;
	}

	switch(this.bonus.getKey())
	{
		case Game.Grid.BONUS_JOKER:
			this.oldLetter = this.letter;
			this.letter = LetterFish.JOKER;
			break;

		case Game.Grid.BONUS_DOUBLE:
			// this.oldLetter = this.letter;
			// this.letter = this.letter + LetterFish.DOUBLE;
			this.xM2 = true;
			break;

		case Game.Grid.BONUS_BOMB:
		case Game.Grid.BONUS_HOLE:
		case Game.Grid.BONUS_HELP:
		case Game.Grid.BONUS_BONUS:
		case Game.Grid.BONUS_SWAP:
			break;
	}
};

LetterFish.prototype.kill = function()
{
	if(this.hasBeenKill)
	{
		return;
	}

	this.hasBeenKill = true;
	this.hp = 0;


	if(this.hole)
	{
		this.hole.free();
	}
	else if(this.ground && this.ground.getLetterFish() && this.ground.getLetterFish().isEqualTo(this))
	{
		this.ground.setLetterFish(null);
	}

	if(this.onKill)
	{
		this.onKill(this);
	}
};

LetterFish.prototype.resetStatus = function()
{
	this.grey        = false;
	this.ghost       = false;
	this.validate    = false;
	this.hasBeenKill = false;
};


LetterFish.prototype.isEqualTo = function(fish) { return this.id == fish.getId(); };

LetterFish.prototype.isAlive  = function() { return this.hp > 0 };
LetterFish.prototype.isInHole = function() { return this.hole; };
LetterFish.prototype.hasEat   = function() { return this.eat; };
LetterFish.prototype.hasBonus = function() { return this.bonus; };
LetterFish.prototype.hasPearl = function() { return this.pearl; };
// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
LetterFish.prototype.getHole = function() { return this.hole; };
LetterFish.prototype.getColor   = function() { return this.color; };
LetterFish.prototype.getBonus   = function() { return this.bonus; };
LetterFish.prototype.getLetter  = function() { return this.letter; };
LetterFish.prototype.getId      = function() { return this.id; };
LetterFish.prototype.getGround  = function() { return this.ground; };
LetterFish.prototype.getScore   = function() { return this.score; };
LetterFish.prototype.getWidth   = function() { return this.width; };
LetterFish.prototype.getHeight  = function() { return this.height; };
LetterFish.prototype.getIndex   = function()
{
/*	if(this.isInHole())
	{
		return this.index+1;
	}*/
	return this.index;
}
LetterFish.prototype.getPearl   = function() { return this.pearl; };
LetterFish.prototype.isValidate = function() { return this.validate; };
LetterFish.prototype.getCharCode = function() {
	return this.letter.toLowerCase().charCodeAt(0);
};

// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
LetterFish.prototype.setBonus     = function(bonus) { this.bonus = bonus; };
// LetterFish.prototype.setInHole = function(bool) { this.inHole = bool; }
LetterFish.prototype.setHole      = function(hole) { this.hole = hole; };
LetterFish.prototype.setIndex     = function(index) { this.index = index; };
LetterFish.prototype.setLetter    = function(letter)
{
	this.letter = letter;
};
LetterFish.prototype.setPearl     = function(pearl) { this.pearl = pearl; };
LetterFish.prototype.setValidate  = function(validate) { this.validate = validate; };
LetterFish.prototype.setHp        = function(hp) { this.hp = hp; };
LetterFish.prototype.setGrey = function(bool) { this.grey = bool; };
LetterFish.prototype.isGhost = function() { return this.ghost; };
LetterFish.prototype.isGrey = function()
{
	return this.grey;
};

LetterFish.prototype.getTop = function()
{
	if(!this.ground)
	{
		return 0;
	}
	var ori = this.ground.getTop() - AroundTheWords.FISH_SHIFT_BY;
	return (this.isInHole()) ? ori + AroundTheWords.HOLE_SHIFT_TOP_BY : ori;

};

LetterFish.prototype.isDouble = function() { return this.xM2; };


// --------------------------------------------------------------
// STATIC
// --------------------------------------------------------------
LetterFish.JOKER = '?';
LetterFish.DOUBLE = '*';
LetterFish.id    = 0;
LetterFish._map  = {};

// LetterFish.maxIndex     = 1000;
// LetterFish.currentIndex = LetterFish.maxIndex;
LetterFish.find = function(fishId) {
	return LetterFish._map[fishId];
};
LetterFish.delete = function(fishId) {
	if(LetterFish._map[fishId]) {
		LetterFish._map[fishId].kill();
		delete LetterFish._map[fishId];
	}
};

LetterFish.resetStatusAll = function()
{
	for(var i in LetterFish._map)
	{
		LetterFish._map[i].resetStatus();
	}
};

LetterFish.each = function(cb)
{
	for(var i in LetterFish._map)
	{
		cb(LetterFish._map[i]);
	}
};


LetterFish.create = function(letter, difficulty) {
	var lFish = new LetterFish(letter, difficulty);
	LetterFish._map[lFish.getId()] = lFish;

	return lFish;
};

LetterFish.regenLetter = function(fish)
{
	if(fish.isJoker()) {

		var view = fish.view
			, sprite = PIXI.Sprite.fromFrame('ig_joker')
		 	, accessoriesContent = view.storage.accessoriesContent;
	 	if(view.storage.textContainer) {
			view.removeChild(view.storage.textContainer);
			delete view.storage.textContainer;
		}

		accessoriesContent.addChild(sprite);
		sprite.position.x = -5;
		sprite.position.y = -12;

	} else if (fish.isDouble()) {
		var view = fish.view
			, sprite = PIXI.Sprite.fromFrame('ig_x2')
		 	, accessoriesContent = view.storage.accessoriesContent;

 		accessoriesContent.addChild(sprite);
 		sprite.position.x = -9;
 		sprite.position.y = 40;

	}
};





LetterFish.avaiableClassName = 'jokerType doubleType';

exports.LetterFish = LetterFish;

})(window.Game = window.Game || {});