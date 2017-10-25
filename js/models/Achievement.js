'use strict';

(function(exports){


function Achievement(data)
{
	this.id = data.id;

	this.progress = data.progress || 0;
	this.progress = Util.Math2.castInt(this.progress);
	this.reward = data.reward || false;

	this.x = parseInt(data.x, 10);
	this.y = data.y;
	this.z = data.z;

	if(typeof this.x == "undefined"
		|| typeof this.y == "undefined"
		|| typeof this.z == "undefined"
	) {
		var cf = ATW.Datas.ACHIEVEMENTS[this.id];
		this.x = parseInt(cf.x, 10);
		this.y = cf.y;
		this.z = cf.z;
	}

};

Achievement.prototype.getCategory = function()
{
	var key = this.getKey();
	return this.y || 0;
};

Achievement.prototype.getDescription = function()
{
	var cf = Util.Achievement.getType(this.id);
	var y = this.y;
	if(y && y.indexOf("~") === 0) {
		y = _ts('bonus_'+y.slice(1).toLowerCase()+'_ecrit');
		y = y.toUpperCase();
	}

	return Util.String2.strtr(_2(cf.name), {
		':x': this.x,
		':y': y,
		':z': this.z
	});
};

Achievement.prototype.getRewards = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].rws;
};

Achievement.prototype.getPearls = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].pearls;
};

Achievement.prototype.hasGift = function()
{
	return (this.isComplete() && !this.reward);
};

Achievement.prototype.getEndPoint = function()
{
	var r = 0;
	var key = this.getKey();
	switch(key)
	{

		case 'GET_PEARLS':
		case 'WRITE_WORD':
		case 'USE_MANUAL_BONUS':
		case 'USE_LETTER':
		case 'GET_POINTS_IN_WORD':
		case 'WORD_MASTER':
		case 'GET_EMPTY_GRID':
		case 'LEVEL_BY_EMPTY_GRID':
		case 'LAST_SEC_SAVE':
		case 'FIRST_SEC_SAVE':
		case 'GET_FRIENDS':
		case 'DUEL_FRIENDS':
		case 'DUEL_SEND':
		case 'RAND_DUEL_WON':
			r = this.x;
			break;

		case 'USE_LETTER_IN_WORD':
		case 'PERFECT_LEVEL':
			r = 1;
			break;

		default:
			console.log('Achievement::getEndPoint():' + key + ' not implemented yet');
	}

	return Util.Math2.castInt(r);
};

Achievement.prototype.isObjFill = function(ref)
{
	switch(this.getKey())
	{
		case 'WRITE_WORD':   // OK
			// var checkWord = ref;
			var y = this.y;
			if(y && y.indexOf("~") === 0) {
				y = _ts('bonus_'+y.slice(1).toLowerCase()+'_ecrit');
			}
			return (ref.toUpperCase() == y.toUpperCase());

		case 'USE_LETTER':   // OK
			return (ref.toUpperCase() == this.y.toUpperCase());

		case 'USE_LETTER_IN_WORD':
			return (ref.letter.toUpperCase() == this.y.toUpperCase() && ref.nb >= Util.Math2.castInt(this.x));

		case 'GET_POINTS_IN_WORD':
			// Ref : WORLD ID
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.y));

		case 'USE_MANUAL_BONUS':
		case 'WORD_MASTER':
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.y));

		case 'PERFECT_LEVEL':
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.x));

		case 'GET_PEARLS':
		case 'GET_EMPTY_GRID':
			return ref.nb > 0;

		case 'FIRST_SEC_SAVE':
		case 'LAST_SEC_SAVE':
			return true;

	}

	return false;
};

Achievement.prototype.incr = function(content, by, replace)
{

	if(this.isComplete()
		|| (content && content.ref && !this.isObjFill(content.ref))
	) {
		return false;
	}

	if(!by)
	{
		by = 1;
	}

	if(!replace)
	{
		this.progress += by;
	}
	else
	{
		this.progress = by;
	}

	return true;
};


Achievement.prototype.getPercent = function()
{
	return ~~Math.min((this.progress / this.getEndPoint())*100, 100);
};

Achievement.prototype.isComplete = function()
{


	return (this.progress >= this.getEndPoint());
};

Achievement.prototype.getKey = function()
{
	return Util.Achievement.getTypeKey(this.id);
};

Achievement.prototype.getName = function()
{
	return _2(ATW.Datas.ACHIEVEMENTS[this.id].name);
};

Achievement.prototype.getNameId = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].name;
};

Achievement.prototype.getResume = function() {
	return {
		id: Util.Math2.castInt(this.id),
		progress: this.progress,
		reward: this.reward
	};
};
Achievement.prototype.getProgress = function() { return this.progress; };
Achievement.prototype.getId = function() { return this.id; };

exports.Achievement = Achievement;

})(window.Model = window.Model || {});