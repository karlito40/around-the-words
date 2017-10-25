'use strict';

(function(views){

views.win_scene = function build_win_scene(builder) {
	var game = builder.container.game
		, level = game.getLevel()
		, mode = level.getMode()
		, myHighstar = Math.min(level.getStar(), 3)
		, myStar = game.appStar
		, levelName = level.getName()
		, myScore = game.getScore()
		, boundedBox = Util.Screen.boundedBox();
	var bg = PIXI.Sprite.fromFrame('win_background');
	Util.Screen.toFullScreen(bg);

	bg.position.x = ~~(ATW.gameMidWidth() - bg.width/2);
	builder.add(bg);

	Partial.header_partial(builder, boundedBox);

	var winTitle = new PIXI.BitmapText(_ts('victoire').toUpperCase(), {font: '60px FredokaOne-Regular', tint: 0xffea34});
	winTitle = Util.DisplayText.shadow(winTitle, 5, 3, 0xfda134, 1);

	winTitle.position.x = ~~(ATW.gameMidWidth() - winTitle.width/2);
	winTitle.position.y = 150;

	builder.add(winTitle);

	var marginTop = 10
		, marginLeft = 15
		, starContainer = new PIXI.DisplayObjectContainer();

	switch(myStar){

		case 3:
			var star1 = PIXI.Sprite.fromFrame('big_star_left');
			star1.position.y = marginTop;
			starContainer.addChild(star1);

			var star2 = PIXI.Sprite.fromFrame('big_star_center');
			star2.position.x = star1.width + marginLeft;
			starContainer.addChild(star2);

			var star3 = PIXI.Sprite.fromFrame('big_star_right');
			star3.position.x = star2.position.x + star2.width + marginLeft;
			star3.position.y = marginTop;
			starContainer.addChild(star3);

			break;

		case 2:
			var star1 = PIXI.Sprite.fromFrame('big_star_left');
			starContainer.addChild(star1);

			var star2 = PIXI.Sprite.fromFrame('big_star_right');
			star2.position.x = star1.width + marginLeft;
			starContainer.addChild(star2);
			break;

		case 1:
			var star1 = PIXI.Sprite.fromFrame('big_star_center');
			starContainer.addChild(star1);

			break;

	}

	if(star1) star1.alpha = 0;
	if(star2) star2.alpha = 0;
	if(star3) star3.alpha = 0;

	starContainer.position.x = ~~(ATW.gameMidWidth() - starContainer.width/2);
	starContainer.position.y = winTitle.position.y + winTitle.height + 20;
	starContainer.refId = 'starContainer';

	builder.add(starContainer);


	var groupLevelName = Prefab.level_name(levelName);
	groupLevelName.position.y = starContainer.position.y + starContainer.height + 5;
	groupLevelName.position.x = ~~(ATW.gameMidWidth() - groupLevelName.width/2);
	groupLevelName.cacheAsBitmap = true;
	groupLevelName.refId = 'groupLevelName';
	groupLevelName.alpha = 0;
	builder.add(groupLevelName);

	var scoreBmp = Prefab.level_score_end(myScore);
	scoreBmp.position.x = ~~(ATW.gameMidWidth() - scoreBmp.width/2);
	scoreBmp.position.y = groupLevelName.y + groupLevelName.height + 20;
	scoreBmp.cacheAsBitmap = true;
	scoreBmp.refId = 'scoreBmp';
	scoreBmp.alpha = 0;

	builder.add(scoreBmp);

	var s = null;
	if( mode.isSimple() ||  mode.isHanged() || mode.isCrossword() ) {
		s = _ts('mots_trouves') + " : " + game.getWordsSummarize().length;
	} else if( mode.isSurvival() ) {
		s = _ts('vagues_survecus') + " : " + game.iWave;
	} else if( mode.isWreckingBall() ) {
		s = _ts('meduses_sauvees') + " : " + game.nbSavedFish
	} else {
		s = _ts('temps') + " : " + game.getDurationString();
	}

	var tipsBmp = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
	tipsBmp = Util.DisplayText.shadow(tipsBmp, 3, 0, 0x0d0d0d, 0.5);
	tipsBmp.position.x = ~~(ATW.gameMidWidth() - tipsBmp.width/2)
	tipsBmp.position.y =  scoreBmp.position.y + scoreBmp.height + 40;
	tipsBmp.refId = 'tipsBmp';
	tipsBmp.alpha = 0;

	builder.add(tipsBmp);


	var highscoreBmp = new PIXI.BitmapText(_2('highscore') + " : " + level.getScore(), {font: "35px FredokaOne-Regular"});
	highscoreBmp = Util.DisplayText.shadow(highscoreBmp, 3, 0, 0x0d0d0d, 0.5);
	highscoreBmp.position.x = ~~(ATW.gameMidWidth() - highscoreBmp.width/2);
	highscoreBmp.position.y = tipsBmp.position.y + highscoreBmp.height + 10;
	highscoreBmp.refId = 'highscoreBmp';
	highscoreBmp.alpha = 0;

	builder.add(highscoreBmp);

	var highstarContainer = new PIXI.DisplayObjectContainer();
	var lastStar = null;
	for(var i=0; i<myHighstar; i++) {
		var star = PIXI.Sprite.fromFrame('app_min_star');

		if(lastStar) {
			star.position.x = lastStar.width + lastStar.position.x + 8;
		}

		star.scale.x = star.scale.y = 1.4;

		highstarContainer.addChild(star);
		lastStar = star;
	}

	highstarContainer.position.x = highscoreBmp.position.x + highscoreBmp.width + 20;
	highstarContainer.position.y = highscoreBmp.position.y + 2;

	builder.add(highstarContainer);

	// --------------------------------------------------------------
	// Obj 1
	// --------------------------------------------------------------

	var lineObj1 = Prefab.level_obj_end((game.obj1 >= level.getMode().getEndPoint()), mode.getDescription(0, 0, 0, true));

	lineObj1.position.y = highscoreBmp.position.y + highscoreBmp.height + 50;
	lineObj1.position.x = ~~(ATW.gameMidWidth() - lineObj1.width/2);
	lineObj1.refId = 'lineObj1';
	lineObj1.alpha = 0;
	builder.add(lineObj1);


	// --------------------------------------------------------------
	// Obj star
	// --------------------------------------------------------------

	var lineObjStar = Prefab.level_obj_end((game.getStar() >= 1), _ts('obtenir_x_etoiles', {':x': 1}));

	lineObjStar.position.y = lineObj1.position.y + lineObj1.height + 10;
	lineObjStar.position.x = ~~(ATW.gameMidWidth() - lineObjStar.width/2);
	lineObjStar.refId = 'lineObjStar';
	lineObjStar.alpha = 0;

	builder.add(lineObjStar);


	// --------------------------------------------------------------
	// Bottom interaction
	// --------------------------------------------------------------
	var bottomInteraction = new PIXI.DisplayObjectContainer();

	var btnMenu = new UI.Button(PIXI.Texture.fromFrame('button_menu'));
	btnMenu.refId = "btnMenu";
	builder.save(btnMenu);

	bottomInteraction.addChild(btnMenu);

	var btnReload = new UI.Button(PIXI.Texture.fromFrame('button_reload'));
	btnReload.position.x = btnMenu.position.x + btnMenu.width + 15;
	btnReload.refId = "btnReload";
	builder.save(btnReload);

	bottomInteraction.addChild(btnReload);

	var btnNext = new UI.Button(PIXI.Texture.fromFrame('button_play_small'));
	btnNext.position.x = btnReload.position.x + btnReload.width + 15;
	btnNext.refId = "btnNext";
	builder.save(btnNext);

	bottomInteraction.addChild(btnNext);


	bottomInteraction.scale.x = bottomInteraction.scale.y = 0.9;
	bottomInteraction.position.x = ~~(ATW.gameMidWidth() - bottomInteraction.width/2 + btnMenu.width/2);
	bottomInteraction.position.y = ATW.gameHeight() - bottomInteraction.height/2 -10;

	builder.add(bottomInteraction);

	var subInteraction = new PIXI.DisplayObjectContainer()
		, btnLeaderboard = Util.DisplayObject.button('button_leaderboard')
		, btnAbc = Util.DisplayObject.button('button_abc');

	btnLeaderboard.refId = "btnLeaderboard";
	builder.save(btnLeaderboard);

	subInteraction.addChild(btnLeaderboard);

	btnAbc.scale.x = btnAbc.scale.y = 0.6;
	btnAbc.position.x = btnLeaderboard.position.x + btnLeaderboard.width+ 15;
	btnAbc.position.y = -4;
	btnAbc.refId = "btnAbc";
	builder.save(btnAbc);

	subInteraction.addChild(btnAbc);

	subInteraction.scale.x = subInteraction.scale.y = 0.9;
	subInteraction.position.x = ATW.gameMidWidth() - subInteraction.width/2 + btnLeaderboard.width/2;
	subInteraction.position.y = bottomInteraction.position.y - bottomInteraction.height - 10;

	builder.add(subInteraction);

};


})(window.View = window.View || {});
