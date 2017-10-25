'use strict';

(function(exports) {


function DifficultyTemplate(difficultyId, level)
{
	this.id            = difficultyId;
	this.nbLetter      = 0;
	this.hasBeenInit   = false;
	this.level         = level;
	this.genereateEach = this.level.getMode().isHanged();
};

DifficultyTemplate.prototype.init = function()
{
	this.tpl = null;
	this._createTpl();
	this.hasBeenInit = true;
	this.letterMap = [];

	this.resetBag();
};

DifficultyTemplate.prototype.resetBag = function()
{
	this.generatedLetter = {};
	this.vowelPercent = Game.Char.getVowelPercent();	// Pourcentage originel
	this.vowels = [];
	this.consonnes = [];



	for(var i in this.tpl)
	{
		var inf = this.tpl[i];
		var nbLetter = parseInt(inf.value, 10);
		var pushIn = (Game.Char.isVowel(inf.letter)) ? this.vowels : this.consonnes;


		for(var i=0; i<nbLetter; i++)
		{
			pushIn.push(inf.letter);
		}

	}

};

DifficultyTemplate.prototype.generateLetterMap = function()
{
	if(!this.genereateEach || (this.letterMap && this.letterMap.length))
	{
		return;
	}

	this.letterMap = [];

	for(var i in this.tpl)
	{
		var inf = this.tpl[i];
		this.letterMap.push(inf.letter);
	}
};

DifficultyTemplate.prototype.letter = function()
{

	if(this.genereateEach)
	{
		this.generateLetterMap();

		var index = Util.Math2.randomInt(0, this.letterMap.length-1);
		var letter = this.letterMap.splice(index, 1);


		return letter[0];
	}



	// 1) Definit le tirage au sort d'une voyelle ou d'une consonne
	var selectedTab = null;
	if(this.vowels.length && !this.consonnes.length)
	{
		selectedTab = this.vowels;
	}
	else if(this.consonnes.length && !this.vowels.length)
	{
		selectedTab = this.consonnes;
	}


	if(! selectedTab)
	{
		var r = Math.random();
		if(r <= this.vowelPercent)
		{
			selectedTab = this.vowels;
			// 1.5) Au tirage d'une voyelle on reinitialise les pourcentages
			this.vowelPercent = Game.Char.getVowelPercent();
		}
		else
		{
			selectedTab = this.consonnes;
			// 2) Le tirage d'une consonne augmente la probabilité de tirer une voyelle
			var upBy = 0.15;
			this.vowelPercent = Math.min(this.vowelPercent + upBy, 1);

		}
	}


	var index = Util.Math2.randomInt(0, selectedTab.length-1);
	var letter = selectedTab.splice(index, 1);

	this.generatedLetter[letter] = letter;

	if(!this.vowels.length && !this.consonnes.length)
	{
		this.resetBag();
	}

	return letter[0];


};

DifficultyTemplate.prototype._createTpl = function()
{
	if(!this.tpl)
	{
		this.tpl = JSON.parse(ATW.Datas.DIFFICULTIES[this.id].tpl);
	}
	return this.tpl;
};

DifficultyTemplate.prototype.getTemplate = function(){ return this._createTpl; };

exports.DifficultyTemplate = DifficultyTemplate;

}) (window.Model = window.Model || {});