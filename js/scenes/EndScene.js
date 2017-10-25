'use strict';
(function(exports){

function EndScene(game, sceneName, viewName)
{
	this.game = game;
	exports.BaseScene.call(this, sceneName, viewName);
	this.soundTheme = ['menu'];
};

EndScene.constructor = EndScene;
EndScene.prototype = Object.create(exports.BaseScene.prototype);

EndScene.prototype.logic = function() {
	var self = this
		, btnMenu = this.view.getElementById("btnMenu")
		, btnReload = this.view.getElementById("btnReload")
		, btnNext = this.view.getElementById("btnNext")
		, btnAbc = this.view.getElementById("btnAbc")
		, btnLeaderboard = this.view.getElementById("btnLeaderboard");

	if(btnMenu){
		btnMenu.onHit = function(){
			var levelScene = new Scene.LevelScene(self.game.level.getWorld());
			levelScene.start();
		}
	}

	if(btnReload) btnReload.onHit = this.reloadHandler.bind(this);
	if(btnNext) btnNext.onHit = this.goToNextLevel.bind(this);


	var level = this.game.level;
	Util.LeaderboardHelper.removeFriend(level.getWorld().getId(), level.getId());
	Util.LeaderboardHelper.removeWorld(level.getWorld().getId(), level.getId());

	btnAbc.onHit = this.showListingWord.bind(this);
	btnLeaderboard.onHit = this.showLeaderboard.bind(this);


};


EndScene.prototype.showLeaderboard = function()
{
	var pop = new UI.PopupLeaderboard(this.game.level);
	pop.open();
};

EndScene.prototype.showListingWord = function()
{
	var self = this
		, container = new PIXI.DisplayObjectContainer()
		, alphaFilter = 0.55
		, filter = new PIXI.Graphics();

	filter.beginFill(0x000000, alphaFilter)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();


	container.addChild(filter);

	var content = new PIXI.DisplayObjectContainer();
	var header = new PIXI.DisplayObjectContainer();

	var abcIco = PIXI.Sprite.fromFrame('app_abc');
	header.addChild(abcIco)

	var s = Util.String2.strip(_ts('liste_des_mots'));
	var titleBmp = Util.DisplayText.wrap(s, {
		font: "25px FredokaOne-Regular",
		letterMax: 10,
		align: "left",
		maxWidth: 60,
		lineHeight: 26
	});
	titleBmp.position.x = abcIco.position.x + abcIco.width;
	titleBmp.position.y = abcIco.position.y + abcIco.height/2 - titleBmp.height/2;

	header.addChild(titleBmp);

	header.position.x = 20;

	content.addChild(header);



	var scrollbarContainer = new PIXI.DisplayObjectContainer();
	var words = this.game.getWordsSummarize();
	// words = [];
	// for(var i=0; i<100; i++) {
	// 	words.push({
	// 		ref: 'toto'+i,
	// 		pts: 12
	// 	});
	// }

	var max = false;
	var y = 0;
	for(var key in words){

		var o = words[key]
		, doMax = false;

		if(!max && o.pts == this.game.scoreMax)
		{
			doMax = true;
			max = true;
		}

		var tintOri = 0xFFFFFF;
		if(doMax) tintOri = 0x94d245;

		var statContainer = new PIXI.DisplayObjectContainer();
		var letterContainer = new PIXI.DisplayObjectContainer();

		if(!o.jokers) {
			var word = Util.String2.capitalise(o.ref);
			var wordBmp = new PIXI.BitmapText(word, {
				font: "23px FredokaOne-Regular",
				tint: tintOri
			});
			letterContainer.addChild(wordBmp);
		} else {

			var word = o.ref;
			var x = 0;
			for(var i=0; i<word.length; i++) {
				var letter = word[i]
					, tintSpecial = null;

				if(!i) letter = letter.toUpperCase();
				else letter = letter.toLowerCase();

				if(o.jokers[i]) tintSpecial = 0xffd737;

				var letterBmp = new PIXI.BitmapText(letter, {
					font: "23px FredokaOne-Regular",
					tint: tintSpecial || tintOri
				});

				letterBmp.position.x = x;
				x = letterBmp.position.x + letterBmp.width + 1;

				letterContainer.addChild(letterBmp);

			}

		}

		statContainer.addChild(letterContainer);
		var ptsBmp = new PIXI.BitmapText(o.pts + " Pts", {
			font: "23px FredokaOne-Regular",
			tint: tintOri
		});
		ptsBmp.position.y = letterContainer.height + 8;
		ptsBmp.position.x = 200;
		statContainer.addChild(ptsBmp);

		if(o.isGold){
			var x2 = PIXI.Sprite.fromFrame('app_x2');
			x2.position.x = ptsBmp.position.x - x2.width - 5;
			x2.position.y = ptsBmp.position.y
			statContainer.addChild(x2);
		}


		statContainer.position.y = y;
		scrollbarContainer.addChild(statContainer);

		y = statContainer.position.y + statContainer.height + 20;

	}

	var overflow = new PIXI.DisplayObjectContainer();
	var mask = new PIXI.Graphics();
	mask.beginFill()
	mask.drawRect(0, 0, scrollbarContainer.width, 370);
	mask.endFill();

	overflow.addChild(scrollbarContainer);
	overflow.addChild(mask);

	overflow.mask = mask;

	overflow.position.x = 200 - overflow.width/2;
	overflow.position.y = 130;


	content.addChild(overflow);

	var scroll = new PIXIScroller.ScrollBar(overflow, {
		height:370
	});


	var line = new PIXI.Graphics();
	line.beginFill(0xFFFFFF)
		.drawRoundedRect(0, 0, 400, 5, 20)
		.endFill();

	line.position.y = 550;

	content.addChild(line);

	var emptyGridContainer = new PIXI.DisplayObjectContainer();

	var emptyGridBmp = new PIXI.BitmapText(_ts('grille_vide'), {
		font: "23px FredokaOne-Regular"
	});

	emptyGridContainer.addChild(emptyGridBmp);

	var emptyGridScore = new PIXI.BitmapText(this.game.emptyGridScore + " Pts", {
		font: "23px FredokaOne-Regular"
	});

	emptyGridScore.position.x = 400 - emptyGridScore.width - 5;
	emptyGridContainer.addChild(emptyGridScore);

	emptyGridContainer.position.y = line.position.y + 20;

	content.addChild(emptyGridContainer);


	var waveContainer = new PIXI.DisplayObjectContainer();

	var waveBmp = new PIXI.BitmapText(_ts('vague'), {
		font: "23px FredokaOne-Regular"
	});

	waveContainer.addChild(waveBmp);

	var waveScoreBmp = new PIXI.BitmapText(this.game.wavesScore + " Pts", {
		font: "23px FredokaOne-Regular"
	});
	waveScoreBmp.position.x = 400 - waveScoreBmp.width - 5;
	waveContainer.addChild(waveScoreBmp);

	waveContainer.position.y = emptyGridContainer.position.y + emptyGridContainer.height + 15;

	content.addChild(waveContainer);

	content.position.x = ATW.gameMidWidth() - content.width/2;
	content.position.y = 200;

	container.addChild(content);

	this.addChild(container);

	container.alpha = 0;
	TweenLite.to(container, 0.3, {alpha:1});

	filter.interactive = true;
	filter.mousedown = filter.touchstart = function(){
		TweenLite.to(container, 0.3, {alpha:0, onComplete: function(){
			self.removeChild(container);
		}});

	};



};


EndScene.prototype.goToNextLevel = function()
{
	var cLevel = this.game.getLevel().getConf();
	var cNextLevel = Util.Level.getNext(cLevel);
	if(cNextLevel)
	{
		var world = this.game.getLevel().getWorld();
		var scene = new Scene.GameScene(world.getLevel(cNextLevel), true);
	}
	else
	{
		var scene = new Scene.WorldScene();
	}

	scene.start();

};


EndScene.prototype.reloadHandler = function() {
	var app = ATW.App
		, player = app.getPlayer()
		, level = this.game.getLevel();


	if(!player.hasLife() && !player.isOnSession()) {
		var levelScene = new Scene.LevelScene(level.getWorld());
		levelScene.start();
		levelScene.firePopupLife();

	} else {
		var gameScene = new Scene.GameScene(level, true);
		gameScene.start();
	}



};


exports.EndScene = EndScene;

})(window.Scene = window.Scene || {});



