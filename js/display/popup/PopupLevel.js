'use strict';

(function(exports){

function PopupLevel(level, restart){
	Util.Popup.call(this);
	this.level = level;
	this.restart = restart;
};

PopupLevel.constructor = PopupLevel;
PopupLevel.prototype = Object.create(Util.Popup.prototype);

PopupLevel.prototype.create = function(){

	this.createLevel();

	this.filter.interactive = true;
	this.filter.touchstart = this.filter.mousedown = this.close.bind(this);

};

PopupLevel.prototype.createLevel = function(anim)
{
	var widthLevel = 350,
		heightLevel = 400,
		myStar = this.level.getStar(),
		levelOrder = this.level.getOrder() +1,
		mode = this.level.getMode(),
		goals = mode.findGoals(),
		self = this,
		player = ATW.App.getPlayer();

	// --------------------------------------------------------------
	// Obj container
	// --------------------------------------------------------------
	this.levelContainer = new PIXI.DisplayObjectContainer();

	var pointFrame = this.level.getPointFrame();

	// Arriere plan
	var bgLevel = PIXI.Sprite.fromFrame((pointFrame == 'world_point_done') ? 'level_bg_green' : 'level_bg_blue');
	this.levelContainer.addChild(bgLevel);

	this.levelContainer.scale.x = this.levelContainer.scale.y = 1.2;
	this.levelContainer.position.x = ~~(ATW.gameMidWidth() - this.levelContainer.width/2);
	this.levelContainer.position.y = ~~(ATW.gameMidHeight() - this.levelContainer.height/2);

	// Point
	var point = PIXI.Sprite.fromFrame(pointFrame);
	point.scale.x = point.scale.y = 1.3;
	point.position.x = ~~(this.levelContainer.width/2 - point.width/2) - 35;
	point.position.y = -~~(point.height/2) - 5;

	var text = new PIXI.BitmapText(levelOrder.toString(), {font: "35px FredokaOne-Regular"});
	var label = Util.DisplayText.shadow(text, 2, 1, 0x0d0d0d, 0.3);
	label.position.x = ~~(point.width/2 - label.width/2) - 11;
	label.position.y = 5;

	point.addChild(label);

	this.levelContainer.addChild(point);

	// Mode icone
	var modeIco = PIXI.Sprite.fromFrame('level_mode_' + mode.getKey().toLowerCase());
	modeIco.position.x = 10;
	modeIco.position.y = 10;
	this.levelContainer.addChild(modeIco);

	// var helpIco = PIXI.Sprite.fromFrame('level_help');
	var helpIco = Util.DisplayObject.button('level_help');
	helpIco.onHit = this.helpHandler.bind(this);
	helpIco.position.x = widthLevel - helpIco.width/2 - 10;
	helpIco.position.y =  7 + helpIco.height/2;
	this.levelContainer.addChild(helpIco);

		// Etoiles
	var starsDispo = ['left', 'center', 'right'],
			oldSprite = null,
			sprite = null,
			starContainer = new PIXI.DisplayObjectContainer();
	for(var i=0; i<starsDispo.length; i++)
	{
		var on = (myStar > i);
		var starKey = 'level_star_' + starsDispo[i] + '_med';
		if(!on) {
			starKey += '_grey';
		}

		var sprite = PIXI.Sprite.fromFrame(starKey);
		if(oldSprite) {
			sprite.position.x = oldSprite.width + oldSprite.position.x + 25;
		}

		if(i != 1) {
			sprite.position.y = 20;
		}

		oldSprite = sprite;

		starContainer.addChild(sprite);
	}

	// starContainer.position.x = 55;
	starContainer.position.x = ~~(widthLevel/2 - starContainer.width/2);
	starContainer.position.y = 30;

	this.levelContainer.addChild(starContainer);


	// Arrow
	var arrow = PIXI.Sprite.fromFrame('level_obj_arrow');
	arrow.anchor.x = arrow.anchor.y = 0.5;
	switch(myStar) {
		case 0:
			arrow.position.x = 114;
			arrow.position.y = 120;
			arrow.rotation = Util.Math2.degToRad(-40);
			break;

		case 1:
			arrow.position.x = 175;
			arrow.position.y = 102;
			break;

		case 2:
			arrow.position.x = 230;
			arrow.position.y = 125;
			arrow.rotation = Util.Math2.degToRad(40);
			break;

		default:
			arrow.position.x = 272;
			arrow.position.y = 170;
			arrow.rotation = Util.Math2.degToRad(70);

			break;

	}


	this.levelContainer.addChild(arrow);



	// Objectif jauge
	var circleBg = PIXI.Sprite.fromFrame('level_obj_bg');
	circleBg.anchor.x = circleBg.anchor.y = 0.5;
	circleBg.position.x = ~~(widthLevel/2);
	circleBg.position.y = ~~(heightLevel/2);

	this.levelContainer.addChild(circleBg);

	// Objectif texte
	var style = {font: "20px FredokaOne-Regular"};
	var margin = 10;
	var objGroupText = new PIXI.DisplayObjectContainer();

	var objTitle = new PIXI.BitmapText(_ts('Objectif'), style)
	objTitle = Util.DisplayText.shadow(objTitle, 2, 1, 0x0d0d0d, 0.3);

	objGroupText.addChild(objTitle);

	var goalString = '';
	if(goals[myStar]) {
		goalString = _ts('x_pts', {
			':x': goals[myStar]
		});
	} else {
		goalString = _ts('Defi');
	}

	var goalText = new PIXI.BitmapText(goalString, style);
	goalText = Util.DisplayText.shadow(goalText, 2, 0, 0x0d0d0d, 0.3);
	goalText.position.y = objTitle.height + margin;
	objGroupText.addChild(goalText);

	var andText = new PIXI.BitmapText('&', style);
	andText = Util.DisplayText.shadow(andText, 2, 0, 0x0d0d0d, 0.3);
	andText.position.y = goalText.position.y + goalText.height + margin;
	objGroupText.addChild(andText);

	objGroupText.position.x = ~~(widthLevel/2 - objGroupText.width/2);
	objGroupText.position.y = ~~(heightLevel/2 - 55);

	objTitle.position.x = objGroupText.width/2 - objTitle.width/2;
	goalText.position.x = objGroupText.width/2 - goalText.width/2;
	andText.position.x = objGroupText.width/2 - andText.width/2;


	this.levelContainer.addChild(objGroupText);


	// Encart
	var bgEncart = PIXI.Sprite.fromFrame('app_encart');
	bgEncart.anchor.x = bgEncart.anchor.y = 0.5;
	bgEncart.position.y = ~~(heightLevel/2) + 80;
	bgEncart.position.x = ~~(widthLevel/2);

	var textEncart = Util.DisplayText.wrap(mode.getDescription(0, 0, 0, true), {
		font: '24px FredokaOne-Regular',
		tint: 0x8a7d53,
		lineHeight: 30,
		letterMax: 18,
		maxWidth: widthLevel,
		align: 'center'
	});
	textEncart.position.y = bgEncart.position.y- textEncart.height/2 -18;

	this.levelContainer.addChild(bgEncart);
	this.levelContainer.addChild(textEncart);



	// Meilleure score
	var name =_ts('meilleur_score').toUpperCase();
	var highcoreTitle =new PIXI.BitmapText(name, {font:"28px FredokaOne-Regular"})

	highcoreTitle = Util.DisplayText.shadow(highcoreTitle, 2, 1, 0x0d0d0d, 0.3);
	highcoreTitle.position.x = ~~(widthLevel/2 - highcoreTitle.width/2);
	highcoreTitle.position.y = heightLevel - highcoreTitle.height - 55;


	this.levelContainer.addChild(highcoreTitle);

	var pts =_ts('x_pts', {
		':x': this.level.getScore()
	});
	var highcoreScore =new PIXI.BitmapText(pts, {font:"28px FredokaOne-Regular"})

	highcoreScore = Util.DisplayText.shadow(highcoreScore, 2, 1, 0x0d0d0d, 0.3);
	highcoreScore.position.x = ~~(widthLevel/2 - highcoreScore.width/2);
	highcoreScore.position.y = highcoreTitle.position.y + highcoreTitle.height + 10;

	this.levelContainer.addChild(highcoreScore);


	Util.LeaderboardHelper.loadFriend(this.level.getWorld().getId(), this.level.getId(), function(res){
		if(!self.level.getOpponent()) return;

		var profil = Util.DisplayObject.roundedRectProfil(self.level.getOpponent().fbId);
		profil.scale.x = profil.scale.y = 0.58;
		profil.position.x = 295;
		profil.position.y = 140;
		self.levelContainer.addChild(profil);


	});


	// --------------------------------------------------------------
	// Footer interaction
	// --------------------------------------------------------------
	var marginBtn = 15;

	var key = (player.life) ? 'button_go' : 'app_more_heart';
	var goBtn = Util.DisplayObject.button(key);
	goBtn.position.y = heightLevel + 30 + ~~(goBtn.height/2);
	goBtn.position.x = ~~(widthLevel/2);
	goBtn.onHit = function(){
		self.close();

		if(self.restart) return;

		if(player.life) {
			self.launchLevel();
		} else {
			var t = new UI.PopupHeart();
			t.onClose = function(){
				if(player.life) self.launchLevel();
			}

			t.open();
		}

	}

	this.levelContainer.addChild(goBtn);

	if(navigator.onLine) {
		var leaderboardBtn = Util.DisplayObject.button('button_leaderboard');
		leaderboardBtn.position.x = goBtn.position.x + goBtn.width - 8;
		leaderboardBtn.position.y = goBtn.position.y + 50;
		leaderboardBtn.onHit = this.displayLeaderboard.bind(this);

		this.levelContainer.addChild(leaderboardBtn);
	}

	if(!this.restart) {

		this.leftArrow = Util.DisplayObject.button('app_left_arrow');
		this.rightArrow = Util.DisplayObject.button('app_right_arrow');

		this.leftArrow.scale.x = this.leftArrow.scale.y = 0.65;
		this.leftArrow.position.y = heightLevel + marginBtn + this.leftArrow.height/2;
		this.leftArrow.position.x = goBtn.position.x - this.leftArrow.width - 70;

		this.rightArrow.scale.x = this.rightArrow.scale.y = 0.65;
		this.rightArrow.position.y = heightLevel + marginBtn + this.rightArrow.height/2;
		this.rightArrow.position.x = goBtn.position.x + goBtn.width - 10;

		this.refreshArrow();

		this.levelContainer.addChild(this.leftArrow);
		this.levelContainer.addChild(this.rightArrow);
	}

	if(anim) {
		TweenLite.from(this.levelContainer.position, 0.18, {x: ATW.gameWidth()/*, ease:Elastic.easeOut*/});
	}

	this.addChild(this.levelContainer);

};

PopupLevel.prototype.displayLeaderboard = function()
{
	var pop = new UI.PopupLeaderboard(this.level);
	pop.open();

};

PopupLevel.prototype.gotoLevel = function(level)
{
	if(!level || !level.isOpen()) return;

	this.removeChild(this.levelContainer);

	this.level = level;
	if(this.onSlide) this.onSlide(this.level);

	this.createLevel(true);
};


PopupLevel.prototype.refreshArrow = function()
{
	var previousLevel = this.level.getPrevious(),
		nextLevel = this.level.getNext(),
		self = this;

	this.leftArrow.onHit = function(){
		self.gotoLevel(previousLevel);
	}

	this.rightArrow.onHit = function(){
		self.gotoLevel(nextLevel);
	}

	this.leftArrow.visible = (previousLevel) ? true : false;
	this.rightArrow.visible = (nextLevel && nextLevel.isOpen()) ? true : false;

};

PopupLevel.prototype.helpHandler = function()
{
	var tutoKey = Model.Mode.tutoRefManual[this.level.getMode().getKey()];
	var p = new UI.PopupTuto(tutoKey, true, false);
	p.open();
};

PopupLevel.prototype.launchLevel = function()
{
	var gameScene = new Scene.GameScene(this.level);
	gameScene.start();
};


exports.PopupLevel = PopupLevel;

})(window.UI = window.UI || {});


