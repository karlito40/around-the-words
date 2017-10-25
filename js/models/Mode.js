(function(exports){

function Mode(id, level)
{
	this.cf = ATW.Datas.MODES[id];
	this.level = level;
};

Mode.prototype.hasHourglass = function()
{
	return (
		this.getDuration() != -1
		&& (
			this.isCrossword()
			|| this.isWreckingBall()
			|| this.isHanged()
			// || this.isSurvival()
		)
	);
};

Mode.prototype.getEndPoint = function()
{
	return Util.Math2.castInt(ATW.Datas.LEVELS[this.level.getId()].obj_endpoint);
};


Mode.prototype.needFullGrid = function()
{
	return (this.isWreckingBall() || this.isCrossword() || this.isHanged()) ;
};


Mode.prototype.getProgressLeft = function(cGoal)
{
	return this.getEndPoint() - cGoal;
};

Mode.prototype.getDescription = function(cGoal, currentStar, currentScore, dontSpan)
{

	var endPoint = this.getEndPoint();
	var goals = this.findGoals();
	var isScoringObj = false;
	// if(currentStar >= goals.length)
	if(cGoal >= endPoint)
	{
		if(currentStar > 0)
		{
			return true;

		}

		isScoringObj = true;

	}


	if(this.level.isScoringActive() || isScoringObj)
	{
		var y = goals[currentStar] - currentScore;
		var txt = '<span>' + y + '</span>';
		if(dontSpan)
		{
			txt = y;
		}

		return _ts('obtenir_x_points', {
			':x' : txt
		});
	}

	var newY = endPoint - cGoal;

	if(!dontSpan)
	{
		newY = '<span>' + newY + '</span>';
	}


	var naturalDesc = _2(this.cf.description);
	switch(this.getKey())
	{
		case Mode.CROSSWORD:
			var a2 = this.getArg2();
			if(!a2)
			{
				naturalDesc = _2(this.cf.description2);
			}

			return Util.String2.strtr(naturalDesc, {
				':x': this.getX(),
				// ':y': y,
				':y': newY,
				':arg2': a2
			});

		case Mode.WRECKING_BALL:
		case Mode.SURVIVAL:
		case Mode.HANGED:
			return Util.String2.strtr(naturalDesc, {
				':x': this.getX(),
				// ':y': y
				':y': newY
			});
		case Mode.SIMPLE:

			if(!Util.Math2.castInt(this.getX()))
			{
				naturalDesc = _2(this.cf.description2);
			}

			return Util.String2.strtr(naturalDesc, {
				':nb_wave': this.level.getNbWave(),
				':x': this.getX(),
				// ':y': y
				':y': newY
			});

	}

	return naturalDesc;

};

Mode.prototype.hasDisplayHighduration = function(){	return (this.isWreckingBall() || this.isCrossword()); };

Mode.prototype.isSimple       = function() { return (this.getKey() == 'SIMPLE'); };
Mode.prototype.isHanged       = function() { return (this.getKey() == 'HANGED'); };
Mode.prototype.isSurvival     = function() { return (this.getKey() == 'SURVIVAL'); };
Mode.prototype.isWreckingBall = function() { return (this.getKey() == 'WRECKING_BALL'); };
Mode.prototype.isCrossword    = function() { return (this.getKey() == 'CROSSWORD'); };

Mode.prototype.getX = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return cLevel.mode_arg1;
};

Mode.prototype.getY = function(currentStar)
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return cLevel.obj_star1;
};


Mode.prototype.findGoalsPos = function(totalHeight)
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];

	var stars = [
		{y: ~~(totalHeight/3), value: Util.Math2.castInt(cLevel.obj_star1)},
		{y: ~~(totalHeight/3)*2, value: Util.Math2.castInt(cLevel.obj_star2)},
		{y: totalHeight, value: Util.Math2.castInt(cLevel.obj_star3)}
	];

	return stars;
};


Mode.prototype.getStar3 = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return Util.Math2.castInt(cLevel.obj_star3);
};


Mode.prototype.findGoals = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return [Util.Math2.castInt(cLevel.obj_star1), Util.Math2.castInt(cLevel.obj_star2), Util.Math2.castInt(cLevel.obj_star3)];
};

Mode.prototype.getArg2 = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return Util.Math2.castInt(cLevel.mode_arg2);
};

Mode.prototype.getDuration = function()
{
	if(this.isHanged())
	{
		return this.getArg2();
	}
	else if(this.isSurvival())
	{
		return this.getEndPoint();
	}

	return  this.getX();


};


Mode.prototype.isFinish = function(star)
{
	if(!this.cf.stop)
	{
		return false;
	}

	var goals = this.findGoals();
	return (star >= goals.length);
};


Mode.prototype.getId          = function() { return this.cf.id; };
Mode.prototype.getKey         = function() { return this.cf.key; };
Mode.prototype.getName        = function() { return this.cf.name; };


Mode.CROSSWORD     = 'CROSSWORD';
Mode.WRECKING_BALL = 'WRECKING_BALL';
Mode.SURVIVAL      = 'SURVIVAL';
Mode.HANGED        = 'HANGED';
Mode.SIMPLE        = 'SIMPLE';


Mode.tutoRef = {};
Mode.tutoRefManual = {};

Mode.tutoRef[Mode.CROSSWORD] = 'crossword';
Mode.tutoRef[Mode.WRECKING_BALL] = 'miley_cyrus';
Mode.tutoRef[Mode.SURVIVAL] = 'survival_mode';
Mode.tutoRef[Mode.HANGED] = 'hanged';
Mode.tutoRef[Mode.SIMPLE] = 'first_game';

Mode.tutoRefManual[Mode.CROSSWORD] = 'crossword';
Mode.tutoRefManual[Mode.WRECKING_BALL] = 'miley_cyrus_manual';
Mode.tutoRefManual[Mode.SURVIVAL] = 'survival_mode_manual';
Mode.tutoRefManual[Mode.HANGED] = 'hanged';
Mode.tutoRefManual[Mode.SIMPLE] = 'simple_manual';


exports.Mode = Mode;

})(window.Model = window.Model || {});