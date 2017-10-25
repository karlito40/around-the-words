'use strict';
(function(exports){
var Fish = {};

Fish.standingAvatar = function(scene, $avatar, o)
{
	if(!o) var o = {};
	if(!o.in) o.in = {scaleY: 0.75};
	if(!o.out) o.out = {scale: 0.8};

	var tl = new TimelineMax({repeat: -1, repeatDelay: 0});
	tl.to($avatar, 1.2, o.in);
	tl.to($avatar, 1.3, o.out);

	scene._addAnim(tl, 'avatar');
};

Fish._switchMode = function(fish, wantedState, tl, progress)
{
	if(!tl) var tl = new TimelineMax();

	var positionIni = "start",
		positionEnd = "start",
		fishView = fish.view;

	if(progress)
	{
		positionIni = "+=0";
		positionEnd = "-=0.3";
	}
	var wantedCorpulence = (fish.isFat()) ? Fish.CORPULENCE.BIG : Fish.CORPULENCE.NORMAL;
	// if(fishView.corpulence != wantedCorpulence || fishView.state != Fish.STATE.DEFAULT){
		tl.to(fishView.currentDisplay, 0.17, {alpha: 0}, positionIni);
	// }

	if(fish.ghost){
		wantedState = (Fish.STATE.SELECTED == wantedState )? Fish.STATE.GHOST_SELECTED : Fish.STATE.GHOST;
		wantedCorpulence = Fish.CORPULENCE.NORMAL;
	}

	var idDisplay = wantedState +"-"+ wantedCorpulence;;
	fishView.state = wantedState;
	fishView.corpulence = wantedCorpulence;

	fishView.currentDisplay = fishView.storage[idDisplay];
	tl.to(fishView.currentDisplay, 0.17, {alpha: 1}, positionEnd);
};

Fish.toSelect = function(fish, tl)
{
	if(!tl) var tl = new TimelineMax();

	this._switchMode(fish, Fish.STATE.SELECTED, tl);
	this.smile(fish, tl, 0.3);
};


Fish.toDefault = function(fish, tl)
{
	if(!tl) var tl = new TimelineMax();
	this._switchMode(fish, Fish.STATE.DEFAULT, tl);
};




Fish.toError = function(fish, tl, onComplete)
{
	fish.errorState = true;


	if(!tl) var tl = new TimelineMax();

	this._switchMode(fish, Fish.STATE.ERROR, tl);

	tl.call(function(){
		fish.errorState = false;
		if(onComplete) onComplete();

	});

};



Fish.smile = function(fish, tl, at)
{
	if(!tl) var tl = new TimelineMax();
	if(!at) var at = 0;

	var view = fish.view,
		oriExpr = (fish.isFat()) ? view.storage['fatExp'] : view.storage['basicalExp'];

	var newExpr = view.storage['smileExp'];
	tl.to(oriExpr, 0.2, {alpha: 0}, '+=' + at);
	tl.to(newExpr, 0.2, {alpha: 1}, '-=0.2');

	tl.to(newExpr, 0.2, {alpha: 0}, '+=0.2');
	tl.to(oriExpr, 0.2, {alpha: 1}, '-=0.2');

};

Fish.eat = function(fish, tl, at)
{
	if(!tl) var tl = new TimelineMax();
	if(!at) var at = 0;

	var view = fish.view;

	tl.to(view.storage[view.smiling], 0.2, {alpha: 0}, '+=' + at);

	view.smiling = 'fatExp';
	tl.to(view.storage[view.smiling], 0.2, {alpha: 1}, '-=0.2');
};


Fish.toValidate = function(fish, tl, onComplete)
{

	if(!tl) var tl = new TimelineMax();

	var wantedState = (fish.isGrey()) ? Fish.STATE.GREY : Fish.STATE.VALIDATED;
	this._switchMode(fish, wantedState, tl);
	if(onComplete) tl.call(onComplete);

};

Fish.toBig = function(fish, tl)
{
	var view = fish.view;

	if(!tl) var tl = new TimelineMax();

	switch(fish.getBonus())
	{
		case Game.Grid.BONUS_JOKER:
			var textContainer = view.storage['textContainer'];
			textContainer.cacheAsBitmap = null;
			var onComplete = function(fish) {
				return function(){
					var newLetter = fish.getLetter();

					var childrens = textContainer.children;
					for(var i=0; i<childrens.length; i++) {
						var children = childrens[i];
						children.setText(newLetter);
					}

					var text = new PIXI.BitmapText(newLetter, {font: "44px FredokaOne-Regular"});
					textContainer.position.x = ~~(view.width/2 - text.width/2);

				}
			}(fish);

			tl.to(textContainer, 0.2, {alpha:0, onComplete: onComplete});
			tl.to(textContainer, 0.2, {alpha:1});
			tl.call(function(){
				textContainer.cacheAsBitmap = true;
			});

			break;

		case Game.Grid.BONUS_BOMB:
		case Game.Grid.BONUS_HOLE:
		case Game.Grid.BONUS_HELP:
		case Game.Grid.BONUS_BONUS:
		case Game.Grid.BONUS_SWAP:
			// $letter.html(fish.getLetter());
			break;
	}

	var stomach = view.storage['stomach'],
		foodOpacity = 0.8,
		food = null;

	stomach.removeChildren();

	if(fish.hasBonus())
	{
		var groundObject = fish.getBonus().getGroundObject();
		food = PIXI.Sprite.fromFrame('object-' + groundObject.id);

		if(fish.getBonus().isBomb()) foodOpacity = 0.5;
	}
	else if(fish.hasPearl()) {
		food = PIXI.Sprite.fromFrame('app_pearl');
		food.position.y = 13;
		food.position.x = -2;
	}


	var doProgress = (tl) ? true : false
	this._switchMode(fish, view.state, tl, doProgress);


	this.eat(fish, tl);

	if(food)
	{
		food.position.x += ~~(view.width/2 - food.width/2);
		food.position.y += 5;

		food.alpha = 0;
		food.scale.x = food.scale.y = 0;

		stomach.addChild(food);

		tl.to(food, 0.3, {alpha: foodOpacity}),

		tl.to(food, 0.3, {alpha:foodOpacity}, "-=0.85");
		tl.to(food.scale, 0.3, {x:1, y:1}, "-=1.25");
	}

};


Fish.simpleLetter = function(fish)
{
	if(!fish) return;

	var view = fish.view
		, textContainer = view.storage['textContainer']
		, newLetter = fish.getLetter()
		, tl = new TimelineMax();

	textContainer.cacheAsBitmap = null;

	tl.to(textContainer, 0.1, {alpha:0, onComplete: function(){
		var childrens = textContainer.children;
		for(var i=0; i<childrens.length; i++) {
			var children = childrens[i];
			children.setText(newLetter);
		}

		textContainer.cacheAsBitmap = true;
	}});
	tl.to(textContainer, 0.1, {alpha:1});
};

Fish.addJoker = function(fish) {
	var accessoriesContent = fish.accessoriesContent;

	var sprite = PIXI.Sprite.fromFrame('ig_joker');
	accessoriesContent.addChild(sprite);
};


Fish.createView = function(builder, fish)
{
	fish.created = true;


	var letter = fish.getLetter().toUpperCase(),
		container = new PIXI.DisplayObjectContainer(),
		revert = true;

	fish.view = container;

	container.state = Fish.STATE.DEFAULT;
	container.corpulence = Fish.CORPULENCE.NORMAL;
	container.storage = {};

	var bgDefault = new PIXI.Sprite(PIXI.Texture.fromFrame('blue_fish_default'));

	var bgFat = PIXI.Sprite.fromFrame('blue_fish_big');
	bgFat.position.x = ~~(bgDefault.width/2 - bgFat.width/2);
	bgFat.position.y = -3;
	bgFat.alpha = 0;

	var bgSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('yellow_fish_default'))
	bgSelected.position.y = -1;
	bgSelected.alpha = 0;

	var bgValidated = new PIXI.Sprite(PIXI.Texture.fromFrame('green_fish_default'))
	bgValidated.position.y = -1;
	bgValidated.alpha = 0;

	var bgGrey = new PIXI.Sprite(PIXI.Texture.fromFrame('grey_fish_default'))
	bgGrey.position.y = -1;
	bgGrey.alpha = 0;

	var bgError = new PIXI.Sprite(PIXI.Texture.fromFrame('red_fish_default'))
	bgError.alpha = 0;

	var bgGhost = new PIXI.Sprite(PIXI.Texture.fromFrame('ig_ghost_board'))
	bgGhost.alpha = 0;
	bgGhost.position.x = 2;

	var bgGhostSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('ig_ghost_board_selected'))
	bgGhostSelected.alpha = 0;
	bgGhostSelected.position.x = 2;

	var bgFatSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('yellow_fish_big'))
	bgFatSelected.position.x = ~~(bgDefault.width/2 - bgFatSelected.width/2);
	bgFatSelected.position.y = -1;
	bgFatSelected.alpha = 0;

	var bgFatValidated = new PIXI.Sprite(PIXI.Texture.fromFrame('green_fish_big'))
	bgFatValidated.position.x = ~~(bgDefault.width/2 - bgFatValidated.width/2);
	bgFatValidated.position.y = -1;
	bgFatValidated.alpha = 0;


	var bgFatGrey = new PIXI.Sprite(PIXI.Texture.fromFrame('grey_fish_big'))
	bgFatGrey.position.x = ~~(bgDefault.width/2 - bgFatGrey.width/2);
	bgFatGrey.position.y = -1;
	bgFatGrey.alpha = 0;

	var bgFatError = new PIXI.Sprite(PIXI.Texture.fromFrame('red_fish_big'))
	bgFatError.position.x = ~~(bgDefault.width/2 - bgFatError.width/2);
	bgFatError.position.y = -1;
	bgFatError.alpha = 0;



	var text = new PIXI.BitmapText(letter, {font: "44px FredokaOne-Regular"});
	var textContainer = Util.DisplayText.shadow(text, 2, 1, 0x080808, 0.5);
	textContainer.position.x = ~~(bgDefault.width/2 - text.width/2)-2;
	textContainer.position.y = 15;

	// textContainer.refId = "letter-" + fish.id;
	// builder.save(textContainer);

	textContainer.cacheAsBitmap = true;

	var accessoriesContent = new PIXI.DisplayObjectContainer();

	var basicalExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_default'));
	basicalExp.position.y = bgDefault.height - basicalExp.height - 13;
	basicalExp.position.x = ~~(bgDefault.width/2 - basicalExp.width/2) + 3;

	var smileExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_smile'));
	smileExp.position.y = bgDefault.height - smileExp.height - 13;
	smileExp.position.x = ~~(bgDefault.width/2 - smileExp.width/2) + 3;
	smileExp.alpha = 0;

	var fatExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_eat'));
	fatExp.position.y = bgDefault.height - fatExp.height - 13;
	fatExp.position.x = ~~(bgDefault.width/2 - fatExp.width/2) + 3;
	fatExp.alpha = 0;

	var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
	shadow.position.y = bgDefault.height - shadow.height +5;
	shadow.position.x = 6;

	var stomach = new PIXI.DisplayObjectContainer();


	container.addChild(shadow);

	// --------------------------------------------------------------
	// normal state
	// --------------------------------------------------------------
	container.storage[Fish.STATE.DEFAULT + "-" + Fish.CORPULENCE.NORMAL] = bgDefault;
	container.addChild(bgDefault);

	container.storage[Fish.STATE.SELECTED + "-" + Fish.CORPULENCE.NORMAL] = bgSelected;
	container.addChild(bgSelected);

	container.storage[Fish.STATE.VALIDATED + "-" + Fish.CORPULENCE.NORMAL] = bgValidated;
	container.addChild(bgValidated);

	container.storage[Fish.STATE.GREY + "-" + Fish.CORPULENCE.NORMAL] = bgGrey;
	container.addChild(bgGrey);

	container.storage[Fish.STATE.ERROR + "-" + Fish.CORPULENCE.NORMAL] = bgError;
	container.addChild(bgError);

	container.storage[Fish.STATE.GHOST + "-" + Fish.CORPULENCE.NORMAL] = bgGhost;
	container.addChild(bgGhost);

	container.storage[Fish.STATE.GHOST_SELECTED + "-" + Fish.CORPULENCE.NORMAL] = bgGhostSelected;
	container.addChild(bgGhostSelected);

	// --------------------------------------------------------------
	// big state
	// --------------------------------------------------------------
	container.storage[Fish.STATE.DEFAULT + "-" + Fish.CORPULENCE.BIG] = bgFat;
	container.addChild(bgFat);

	container.storage[Fish.STATE.SELECTED + "-" + Fish.CORPULENCE.BIG] = bgFatSelected;
	container.addChild(bgFatSelected);

	container.storage[Fish.STATE.VALIDATED + "-" + Fish.CORPULENCE.BIG] = bgFatValidated;
	container.addChild(bgFatValidated);

	container.storage[Fish.STATE.GREY + "-" + Fish.CORPULENCE.BIG] = bgFatGrey;
	container.addChild(bgFatGrey);

	container.storage[Fish.STATE.ERROR + "-" + Fish.CORPULENCE.BIG] = bgFatError;
	container.addChild(bgFatError);


	// --------------------------------------------------------------
	// Body
	// --------------------------------------------------------------

	container.storage['stomach'] = stomach;
	container.addChild(stomach);

	container.storage['basicalExp'] = basicalExp;
	container.addChild(basicalExp);

	container.storage['smileExp'] = smileExp;
	container.addChild(smileExp);

	container.storage['fatExp'] = fatExp;
	container.addChild(fatExp);

	container.storage['accessoriesContent'] = accessoriesContent;
	container.addChild(accessoriesContent);


	container.storage['textContainer'] = textContainer;
	container.addChild(textContainer);

	container.smiling = 'basicalExp';

	container.pivot.x = ~~(container.width/2);
	container.pivot.y = ~~(container.height/2);
	container.position.x += container.pivot.x;
	container.position.y += container.pivot.y;

	Game.LetterFish.regenLetter(fish);


	container.interactive = true;
	container.touchstart = container.mousedown = function(){
		if(fish.onHit) fish.onHit();
	}

	container.currentDisplay = container.storage[container.state + "-"+ container.corpulence];


	return container;
};

Fish.STATE                 = {};
Fish.STATE.DEFAULT         = 'default';
Fish.STATE.SELECTED        = 'selected';
Fish.STATE.VALIDATED       = 'validated';
Fish.STATE.GREY            = 'grey';
Fish.STATE.ERROR           = 'error';
Fish.STATE.GHOST           = 'ghost';
Fish.STATE.GHOST_SELECTED = 'ghost_selected';

Fish.CORPULENCE        = {};
Fish.CORPULENCE.NORMAL = 'normal';
Fish.CORPULENCE.BIG    = 'obese';

exports.Fish = Fish;
})(window.UI = window.UI || {});