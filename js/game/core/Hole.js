'use strict';

(function(exports){

function Hole(ground)
{
	this.ground     = ground;
	this.letterFish = null;
};

Hole.prototype.suck = function()
{
	if(!this.isFull())	// Garde une meduse
	{
		if(this.ground.getLetterFish() && this.ground.getLetterFish().isAlive())
		{
			this.letterFish = this.ground.getLetterFish();		// Le trou recupere le poisson du ground
			this.letterFish.setHole(this);
			this.ground.setLetterFish(null);					// Tandis que le ground perd son poisson

		}

	}

};

Hole.prototype.free = function()
{
	this.letterFish = null;
	return this;
};

Hole.prototype.isFull        = function() { return this.getLetterFish(); };
Hole.prototype.getLetterFish = function() { return this.letterFish; };
Hole.prototype.getGround     = function() { return this.ground; };


exports.Hole = Hole;

})(window.Game = window.Game || {});