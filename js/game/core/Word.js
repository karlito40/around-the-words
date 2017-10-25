'use strict';
(function(exports){

function Word(word)
{
	this.reset(word);
};

Word.prototype.appendChar = function(c, isGhost)
{
	this.current += c.toLowerCase();
	if(!isGhost) this.score += Game.Char.getWeight(c);
};

Word.prototype.fill = function(withChar, by)
{
	for(var w=0; w<by; w++) this.current += withChar;
};

Word.prototype.reset = function(word)
{
	this.current = (word) ? word : "";
	this.score = 0;
};

Word.prototype.removeLastChar = function(isGhost, ignore)
{
	if(ignore)
	{
		var lastIndex = this.current.indexOf(ignore);

		if(lastIndex == -1) lastIndex = this.current.length-1;
		else lastIndex -= 1;
	}
	else
	{
		var lastIndex = this.current.length-1;
	}

	var c         = this.current[lastIndex];
	this.current  = this.current.substr(0, lastIndex);

	if(!isGhost) this.score -= Game.Char.getWeight(c);


};

Word.prototype.applyJoker = function()
{
	if(!this.hasJoker())
	{
		return this.current;
	}

	var tab = this.current.split(LetterFish.JOKER);

	if(tab.length == 1)
	{
		return this.current;
	}

	var result = this._checkABC(tab[0], tab, 0, this.current.length);
	if(result)
	{
		this.current = result;
		return this.current;
	}

	return false;
};

Word.prototype.hasJoker = function() { return (this.current.indexOf(LetterFish.JOKER) !== -1); };

Word.prototype._checkABC = function(start, tab, i, sizeWord)
{
	if(i == tab.length - 1){
		return DictionaryHelper.startBy(start, sizeWord);
	}

	var wordFound, c;
	var abc = DictionaryHelper.createAbc(true);
	for(var j=0; j<abc.length; j++)
	{
		c = String.fromCharCode(abc[j]);

		wordFound = DictionaryHelper.startBy(start + c, sizeWord);
		if(wordFound){
			res = this._checkABC(start + c + tab[i + 1], tab, i + 1, sizeWord);
			if(res){
				return res;
			}
		}
	}

	return false;
};

Word.prototype.setCurrent = function(current) { this.current = current; };


Word.prototype.getCurrent = function(ignore) {
	if(ignore)
	{
		var lastIndex = this.current.indexOf(ignore);
		if(lastIndex == -1) lastIndex = this.current.length;

		return this.current.substr(0, lastIndex);;

	}

	return this.current;
};
Word.prototype.getScore   = function() { return this.score; };

exports.Word = Word;

})(window.Game = window.Game || {});