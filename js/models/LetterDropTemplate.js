'use strict';

(function(exports){

function LetterDropTemplate(dropId, difficulty, quantity)
{
	this.id          = dropId;
	this.difficulty  = difficulty;
	this.cfMaxQuantity = this.maxQuantity = quantity;
	this.letters     = [];
	this.fullGrid = false;
};

LetterDropTemplate.prototype.init = function(game)
{

	this.game = game;

	if(game.getLevel().getMode().needFullGrid())
	{
		this.fullGrid = true;
		this.maxQuantity = game.getGrid().getNbSolidLine();
	}

	this._createTpl();
	this.reset();

};

LetterDropTemplate.prototype.reset = function()
{
	LetterDropTemplate.dropAt = null;
	this.difficulty.init();

	this.cursor = 0;
	var map     = [];

	for(var i=0; i<this.maxQuantity; i++)
	{
		map.push(this._createLine(i));
	}

	this.letters = map;
};

LetterDropTemplate.prototype._createLine = function(i)
{
	var grid = this.game.getGrid();
	if(!this.fullGrid)
	{
		// on doit remplir la ligne d'une quantité de lettre comprise entre this.tpl[i].min && this.tpl[i].max
		var useTpl = (this.tpl[i]) ? this.tpl[i] : this.tpl[this.tpl.length - 1];

		var minTpl = parseInt(useTpl.min); // proba de remplissage
		var maxTpl = parseInt(useTpl.max); // proba de remplissage
		var min = ~~((minTpl/100) * grid.getNbSolidCol());
		var max = ~~((maxTpl/100) * grid.getNbSolidCol());

		min = Math.max(1, min);
		max = Math.min(max, grid.getNbSolidCol());
		min = Math.min(min, max);

		var toGenerate = Util.Math2.randomInt(min, max);
	}
	else
	{
		var toGenerate = grid.getNbSolidCol();
	}

	return Game.Grid.generateHeapLetter(grid, this.difficulty, toGenerate);
};

LetterDropTemplate.prototype.use = function()
{

	if(this.fullGrid && this.cursor)
	{
		this.reset();
	}

	var nbLine = (!this.fullGrid) ? 1 : this.maxQuantity;

	var lettersFish = [];
	var length      = 0;


	for(var i=0; i<nbLine; i++)
	{
		var lettersLine = (this.letters[this.cursor]) ? this.letters[this.cursor] : this._createLine(this.cursor);

		var lFish           = null;
		var lettersFishLine = [];

		for(var j=0; j<lettersLine.length; j++)
		{
			lFish = null;
			if(lettersLine[j])	// Verifie la presence de la lettre (peut etre null)
			{
				// Construit une nouvelle meduse
				lFish = Game.LetterFish.create(lettersLine[j], this.difficulty);
				length++;
			}
			lettersFishLine.push(lFish);
		}

		lettersFish.push(lettersFishLine);

		this.cursor++;
		if(this.cursor >= this.letters.length)
		{
			break;
		}
	}


	return {
		res: lettersFish,
		length: length
	};
};

LetterDropTemplate.prototype._createTpl = function()
{
	if(!this.tpl) this.tpl = JSON.parse(ATW.Datas.LETTERDROPS[this.id].tpl);

	return this.tpl;
};

LetterDropTemplate.prototype.getTemplate    = function(){ return this._createTpl; };
LetterDropTemplate.prototype.getMaxQuantity = function(){ return this.maxQuantity; };
LetterDropTemplate.prototype.getQuantityLeft = function()
{
	return this.maxQuantity - this.cursor;
};

LetterDropTemplate.prototype.getCursor = function() { return this.cursor; };


exports.LetterDropTemplate = LetterDropTemplate;

})(window.Model = window.Model || {});