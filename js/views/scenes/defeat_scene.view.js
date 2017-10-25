'use strict';

(function(views){

views.defeat_scene = function build_defeat_scene(builder) {
	var boundedBox = Util.Screen.boundedBox()
		, game = builder.container.game
		, level = game.getLevel()
		, mode = level.getMode()
		, myScore = game.getScore()
		, player = ATW.App.getPlayer()
		, levelName = level.getName();


	var isBuyable = (!player.isTutoFisnish('first_defeat')) ? false : level.isBuyable();

	var bg = PIXI.Sprite.fromFrame('defeat_background');
	Util.Screen.toFullScreen(bg);
	bg.position.x = ~~(ATW.gameMidWidth() - bg.width/2);

	builder.add(bg);

	var flame = PIXI.Sprite.fromFrame('flame');
	Util.Screen.toFullScreen(flame);
	flame.position.x = ~~(ATW.gameMidWidth() - flame.width/2);

	builder.add(flame);


	Partial.header_partial(builder, boundedBox);

	var t = Util.String2.noAccent(_ts('defaite'));
	var defeatTitle = new PIXI.BitmapText(t.toUpperCase(), {font: '60px FredokaOne-Regular', tint: 0xf58c28});
	defeatTitle = Util.DisplayText.shadow(defeatTitle, 5, 3, 0xa00101, 1);
	defeatTitle.position.x = ~~(ATW.gameMidWidth() - defeatTitle.width/2);
	defeatTitle.position.y = 150;

	builder.add(defeatTitle);

	var textures = [];
	for(var i=1; i<24; i++) textures.push(PIXI.Texture.fromFrame("crying_fish_" + i));

	var cryingFish = new PIXI.MovieClip(textures);
	cryingFish.position.x = ~~(ATW.gameMidWidth() - cryingFish.width/2);
	cryingFish.position.y = defeatTitle.position.y + defeatTitle.height + 70;
	cryingFish.loop = true;
	cryingFish.animationSpeed = 0.25;
	cryingFish.play();


	var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
	shadow.scale.x = 2.3;
	shadow.scale.y = 0.8;

	shadow.position.x = cryingFish.position.x + cryingFish.width/2 - shadow.width/2 + 5;
	shadow.position.y = cryingFish.position.y + cryingFish.height - shadow.height + 12;

	var heartBreak = PIXI.Sprite.fromFrame('ig_heartbreak_rotate');
	heartBreak.position.x = cryingFish.position.x + cryingFish.width;
	heartBreak.position.y = cryingFish.position.y - 20;

	var lifeBmp = new PIXI.BitmapText('-1', {font: '55px FredokaOne-Regular'});
	lifeBmp = Util.DisplayText.shadow(lifeBmp, 2, 0, 0x0d0d0d, 0.3);
	lifeBmp.position.x = 38;
	lifeBmp.position.y = 40;
	heartBreak.addChild(lifeBmp);


	builder.add(shadow);
	builder.add(cryingFish);
	builder.add(heartBreak);


	var groupLevelName = Prefab.level_name(levelName);
	groupLevelName.position.y = cryingFish.position.y + cryingFish.height + 30;
	groupLevelName.position.x = ~~(ATW.gameMidWidth() - groupLevelName.width/2);
	groupLevelName.cacheAsBitmap = true;
	groupLevelName.refId = "groupLevelName";
	groupLevelName.alpha = 0;
	builder.add(groupLevelName);


	var scoreBmp = Prefab.level_score_end(myScore);
	scoreBmp.position.x = ~~(ATW.gameMidWidth() - scoreBmp.width/2);
	scoreBmp.position.y = groupLevelName.y + groupLevelName.height + 20;
	scoreBmp.cacheAsBitmap = true;
	scoreBmp.refId = "scoreBmp";
	scoreBmp.alpha = 0;
	builder.add(scoreBmp);


	// --------------------------------------------------------------
	// Obj 1
	// --------------------------------------------------------------

	var lineObj1 = Prefab.level_obj_end((game.obj1 >= level.getMode().getEndPoint()), mode.getDescription(0, 0, 0, true));
	lineObj1.position.y = scoreBmp.position.y + scoreBmp.height + 70;
	lineObj1.position.x = ~~(ATW.gameMidWidth() - lineObj1.width/2);
	lineObj1.refId = "lineObj1";
	lineObj1.alpha = 0;
	builder.add(lineObj1);


	// --------------------------------------------------------------
	// Obj star
	// --------------------------------------------------------------

	var lineObjStar = Prefab.level_obj_end((game.getStar() >= 1), _ts('obtenir_x_etoiles', {':x': 1}));
	lineObjStar.position.y = lineObj1.position.y + lineObj1.height + 10;
	lineObjStar.position.x = ~~(ATW.gameMidWidth() - lineObjStar.width/2);
	lineObjStar.refId = "lineObjStar";
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

	var buttonId = (player.life) ? 'button_reload' : 'app_more_heart';
	var btnReload = new UI.Button(PIXI.Texture.fromFrame(buttonId));
	btnReload.position.x = btnMenu.position.x + btnMenu.width + 15;
	btnReload.refId = "btnReload";
	builder.save(btnReload);

	bottomInteraction.addChild(btnReload);

	if(isBuyable) {

		var btnShopLevel = new UI.Button(PIXI.Texture.fromFrame('button_sh_next_level'));
		btnShopLevel.position.x = btnReload.position.x + btnReload.width + 40;
		btnShopLevel.refId = 'btnShopLevel';

		var text = _ts('passer_le_niveau');
		var textBmp = Util.DisplayText.wrap(text, {
			font: "18px FredokaOne-Regular",
			letterMax: 7,
			align: "center",
			maxWidth: 60,
			lineHeight: 18
		});
		textBmp.position.y = -textBmp.height/2;
		textBmp.position.x = -58;
		btnShopLevel.addChild(textBmp);

		var appPearl = PIXI.Sprite.fromFrame('app_pearl');
		appPearl.scale.x = appPearl.scale.y = 0.65;
		appPearl.position.x = 40;
		appPearl.position.y = 7;
		btnShopLevel.addChild(appPearl);

		var product = Util.Shop.findProductByKey('LEVEL');
		var priceBmp = new PIXI.BitmapText(product.price.toString(), {font: '25px FredokaOne-Regular'});
		priceBmp = Util.DisplayText.shadow(priceBmp, 2, 0, 0x0d0d0d, 0.5);
		priceBmp.position.x = 65;
		priceBmp.position.y = 20;
		btnShopLevel.addChild(priceBmp);

		builder.save(btnShopLevel);
		bottomInteraction.addChild(btnShopLevel);


	}

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
