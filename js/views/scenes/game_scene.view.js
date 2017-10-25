'use strict';
(function(views){

views.game_scene = function build_game_scene(builder) {

	var scene = builder.container,
		level = scene.level,
		worldKey = level.getWorld().getKey(),
		game = scene.game,
		grid = game.getGrid(),
		mode = level.getMode(),
		fields = createFields(scene, builder, grid),
		boundedBox = Util.Screen.boundedBox(),
		pauseContainer = new PIXI.DisplayObjectContainer();

	var texture = PIXI.Texture.fromFrame('world_background_ingame');
	var bg = new PIXI.TilingSprite(texture, 1024, ATW.gameHeight());
	bg.anchor.x = bg.anchor.y = 0.5;
	bg.position.x = ATW.gameMidWidth();
	bg.position.y = ATW.gameMidHeight();

	builder.add(bg);


	// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------

	var headerContainer = Partial.header_partial(builder, boundedBox, {
		btnTrophy: false,
		btnCart: false,
		btnMessage: false
	}, ATW.isMobile());


	// --------------------------------------------------------------
	// Panel de gauche
	// --------------------------------------------------------------
	if(!ATW.isMobile()) {
		var worldMin = new PIXI.DisplayObjectContainer();

		var worldIcoGroup = new PIXI.DisplayObjectContainer();
		var graph = new PIXI.Graphics();
		graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 130, 45, 40)
			.endFill();
		graph.position.x = 15;
		graph.position.y = 7;
		graph.alpha = 0.3;
		worldIcoGroup.addChild(graph);


		var worldIco = PIXI.Sprite.fromFrame(worldKey + '-ico');
		worldIcoGroup.addChild(worldIco);

		var levelName = new PIXI.BitmapText(level.getName(), {font: "25px FredokaOne-Regular"});
		levelName.position.x = 75;
		levelName.position.y = 20;
		worldIcoGroup.addChild(levelName);

		worldIcoGroup.cacheAsBitmap = true;
		worldIcoGroup.position.x = -10;
		worldIcoGroup.position.y = -10;
		worldMin.addChild(worldIcoGroup);


		worldMin.position.y = 100;
		worldMin.position.x = boundedBox.x + 25;

		builder.add(worldMin);
	}


	var bonusGroup = createBonusList(builder, boundedBox);
	if(bonusGroup && !ATW.isMobile()) {
		bonusGroup.position.y = 300;
		bonusGroup.position.x = boundedBox.x + 70;
		builder.add(bonusGroup);
	}




	// --------------------------------------------------------------
	// Panel de droite
	// --------------------------------------------------------------
	var ghostContainer = new PIXI.DisplayObjectContainer(),
		ghostCache = new PIXI.DisplayObjectContainer(),
		graphWidth = 150,
		graphHeight = 45;

	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, graphWidth, graphHeight, 40)
		.endFill();

	graph.alpha = 0.3;

	var ghostIco = PIXI.Sprite.fromFrame('ig_ghost');
	ghostIco.scale.x = ghostIco.scale.y = 0.7;

	if(!ATW.isMobile()) ghostIco.position.x = graphWidth - ghostIco.width;
	else ghostIco.position.x = 0

	ghostIco.position.y = ~~(graphHeight/2 - ghostIco.height/2);
	ghostIco.refId = 'ghostIco';
	builder.save(ghostIco);

	ghostCache.addChild(graph);
	ghostCache.addChild(ghostIco);
	ghostCache.cacheAsBitmap = true;

	ghostContainer.addChild(ghostCache);

	var lifeText = new PIXI.BitmapText(game.life.toString(), {font: "25px FredokaOne-Regular"});
	if(!ATW.isMobile())  lifeText.position.x = ghostIco.position.x - lifeText.width - 10;
	else lifeText.position.x = ghostIco.position.x + ghostIco.width + 20;

	lifeText.position.y = 12;
	lifeText.refId = "lifeText";
	builder.save(lifeText);

	ghostContainer.addChild(lifeText);

	if(ATW.isMobile()) {
		ghostContainer.position.x = boundedBox.x + 20;
		ghostContainer.position.y = 20;
	} else {
		ghostContainer.position.x = boundedBox.xMax - ghostContainer.width - 20;
		ghostContainer.position.y = 100;
	}

	ghostContainer.refId = 'ghostContainer';
	builder.add(ghostContainer);

	// --------------------------------------------------------------
	// Jauge
	// --------------------------------------------------------------
	var gauge = createGauge(builder, mode, boundedBox);
	if(!ATW.isMobile()) {
		gauge.position.x = boundedBox.xMax - gauge.width + 45;
		gauge.position.y = 360;
	} else {

	}

	builder.add(gauge);


	// --------------------------------------------------------------
	// Titre & description
	// --------------------------------------------------------------
	var objText = createTitle(builder, mode);
	objText.position.x = ~~(ATW.gameMidWidth() - objText.width/2);
	// objText.position.y = fields.position.y - objText.height - 20;
	objText.position.y += fields.position.y - objText.height - 30;

	builder.add(objText);


	// --------------------------------------------------------------
	// Game
	// --------------------------------------------------------------
	fields.refId = 'fields';
	builder.add(fields);

	var waveContainer = createWave(builder, game);
	if(waveContainer) {
		if(ATW.isMobile()) {
			waveContainer.position.x = boundedBox.xMax - waveContainer.width - 10;
			waveContainer.position.y = 20;
		} else {
			waveContainer.position.x = fields.width + fields.position.x + 20;
			waveContainer.position.y = fields.position.y;
		}

		builder.add(waveContainer);
	}

	var wordContainer = createWordContainer(builder, fields, mode);
	wordContainer.oriPosition = {};
	wordContainer.oriPosition.x = wordContainer.position.x = ~~ (ATW.gameMidWidth() - wordContainer.width/2) + 35;
	wordContainer.oriPosition.y = wordContainer.position.y = fields.position.y + fields.height + 25;


	builder.add(wordContainer);


	// --------------------------------------------------------------
	// Interaction button
	// --------------------------------------------------------------
	if(!ATW.isMobile()) {
		var footerBtn = new PIXI.DisplayObjectContainer();

		var btnMenu = new UI.Button(PIXI.Texture.fromFrame('button_menu'));
		btnMenu.scale.x = btnMenu.scale.y = 0.8;
		btnMenu.position.x = boundedBox.x + btnMenu.width/2+ 20;
		btnMenu.refId = "btnMenu";
		builder.save(btnMenu);

		footerBtn.addChild(btnMenu);

		var btnRestart = new UI.Button(PIXI.Texture.fromFrame('button_reload'));
		// btnRestart.position.x = btnMenu.width + 10;
		btnRestart.position.x = boundedBox.xMax - btnRestart.width/2 - 20;
		btnRestart.scale.x = btnRestart.scale.y = 0.8;
		btnRestart.refId = "btnRestart";
		builder.save(btnRestart);

		footerBtn.addChild(btnRestart);

		footerBtn.position.y = ATW.gameHeight() - footerBtn.height;

		builder.add(footerBtn);
	} else {

		var btnPause = Util.DisplayObject.button('mobile-button-pause');
		btnPause.scale.x = btnPause.scale.y = 0.8;
		btnPause.position.x = ATW.gameMidWidth();
		btnPause.position.y = ATW.gameHeight() - ~~(btnPause.height/2) - 20;
		btnPause.refId = 'btnPause';

		builder.add(btnPause);
	}


	// --------------------------------------------------------------
	// Pause Scene
	// --------------------------------------------------------------
	if(ATW.isMobile()) {
		var	filter = new PIXI.Graphics();
		filter.beginFill(0x000000)
			.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
			.endFill();

		filter.alpha = 0.55;
		filter.refId = 'filterPause';
		builder.add(filter);
		pauseContainer.addChild(filter);

		// --- Header ---
		headerContainer.position.y = 60;
		pauseContainer.addChild(headerContainer);

		// --- Bonus ---
		bonusGroup.position.x = 60;
		bonusGroup.position.y = 400;
		pauseContainer.addChild(bonusGroup);


		// --- Footer ---
		var footerContainer = new PIXI.DisplayObjectContainer()
			, footerBg = PIXI.Sprite.fromFrame('ingame-pause-background')
			, buttonsContainer = new PIXI.DisplayObjectContainer();

		footerBg.position.x = ATW.gameMidWidth() - ~~(footerBg.width/2);
		footerBg.position.y = ATW.gameHeight() - footerBg.height;

		footerContainer.addChild(footerBg);

		var btnMenu = Util.DisplayObject.button('button_menu');
		btnMenu.scale.x = btnMenu.scale.y = 1.3;
		btnMenu.position.x = boundedBox.x + btnMenu.width/2 + 30;
		btnMenu.refId = "btnMenu";
		builder.save(btnMenu);

		buttonsContainer.addChild(btnMenu);

		var btnResume = Util.DisplayObject.button('button_previous');
		btnResume.scale.x = btnResume.scale.y = 1.7;
		btnResume.position.x = ATW.gameMidWidth();
		btnResume.refId = "btnResume";
		builder.save(btnResume);

		buttonsContainer.addChild(btnResume);

		var btnRestart = new Util.DisplayObject.button('button_reload');
		btnRestart.scale.x = btnRestart.scale.y = 1.4;
		btnRestart.position.x = boundedBox.xMax - ~~(btnRestart.width/2) - 30;
		btnRestart.refId = "btnRestart";
		builder.save(btnRestart);

		buttonsContainer.addChild(btnRestart);

		buttonsContainer.position.y = ATW.gameHeight() - 90;
		footerContainer.addChild(buttonsContainer);

		pauseContainer.addChild(footerContainer);

		pauseContainer.visible = false;
		pauseContainer.refId = 'pauseContainer';
		builder.add(pauseContainer);
	}


};

function createTitle(builder, mode) {
	var hasHourglass = mode.hasHourglass()
		, group = new PIXI.DisplayObjectContainer()
		, desc = mode.getDescription(0, 0, 0, true)
		, title = (!mode.isHanged()) ? _ts('Objectif') : desc + ' | ';


	var titleBmp = new PIXI.BitmapText(title, {font: "35px FredokaOne-Regular"});
	titleBmp = Util.DisplayText.shadow(titleBmp, 2, 0, 0x0d0d0d, 0.3);
	titleBmp.refId = 'titleBmp';
	builder.save(titleBmp);

	group.addChild(titleBmp);

	if(mode.isHanged()) desc = '';
	var descriptionText = new PIXI.BitmapText(desc, {font: "27px FredokaOne-Regular"});
	descriptionText = Util.DisplayText.shadow(descriptionText, 2, 0, 0x0d0d0d, 0.3);
	descriptionText.position.y = titleBmp.height + 5;
	group.addChild(descriptionText);



	titleBmp.position.x = ~~(group.width/2 - titleBmp.width/2);
	if(hasHourglass) {
		titleBmp.position.y = -5;

		var timerContainer = new PIXI.DisplayObjectContainer()
			, o = Util.Date.msToObject(parseInt(mode.getDuration()*1000,10))
			, timerBmp = new PIXI.BitmapText(o.min+':'+o.sec, {font: "35px FredokaOne-Regular"})
			, timerSprite = new PIXI.Sprite.fromFrame('ig_timer');

		timerSprite.position.x = timerBmp.width + 5;
		timerSprite.position.y = -2;

		timerBmp.refId = 'timerBmp';
		builder.save(timerBmp);

		timerContainer.addChild(timerBmp);
		timerContainer.addChild(timerSprite);

		timerContainer.position.y = titleBmp.position.y;
		timerContainer.position.x = titleBmp.position.x + titleBmp.width + 15;

		timerContainer.refId = 'timerContainer';
		builder.save(timerContainer);

		group.addChild(timerContainer);

	}

	group.oriWidth = group.width;
	descriptionText.position.x = ~~(group.width/2 - descriptionText.width/2);

	descriptionText.refId = 'descriptionText';
	builder.save(descriptionText);

	group.refId = 'groupTitle';

	return group;

};

function createWordContainer(builder, fields, mode) {
	var container = new PIXI.DisplayObjectContainer(),
		cacheContainer = new PIXI.DisplayObjectContainer(),
		textContainer = new PIXI.DisplayObjectContainer();

	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRect(0, 0, fields.width - 55, 50)
		.endFill();
	graph.alpha = 0.3;


	var btnCancel = new UI.Button(PIXI.Texture.fromFrame('button_cross'));
	btnCancel.position.y = (graph.height/2);
	btnCancel.refId = 'btnCancel';
	builder.save(btnCancel);


	var btnSubmit = new UI.Button(PIXI.Texture.fromFrame('button_validate'));
	btnSubmit.position.y = (graph.height/2);
	btnSubmit.position.x = graph.width;
	btnSubmit.refId = 'btnSubmit';
	builder.save(btnSubmit);


	cacheContainer.addChild(graph);

	cacheContainer.cacheAsBitmap = true;
	container.addChild(cacheContainer);

	container.addChild(btnCancel);
	container.addChild(btnSubmit);


	if(mode.isHanged()) {
		var btnSubmitUnselectable = Util.DisplayObject.button('button_validate_unselectable');
		btnSubmitUnselectable.buttonMode = false;
		btnSubmitUnselectable.position = btnSubmit.position;
		btnSubmitUnselectable.refId = 'btnSubmitUnselectable';
		builder.save(btnSubmitUnselectable);

		container.addChild(btnSubmitUnselectable);

		btnSubmit.alpha = 0;
	}


	textContainer.position.y = 9;
	container.addChild(textContainer);

	textContainer.refId = "textSubmit";
	builder.save(textContainer);

	container.refId = "wordContainer";
	container.alpha = 0;

	return container;
};


function createGauge(builder, mode, boundedBox){
	var group = new PIXI.DisplayObjectContainer(),
		goals       = mode.findGoals(),
		starsLength = goals.length;

	if(ATW.isMobile()) {
		var back = PIXI.Sprite.fromFrame('mobile_gauge_star_back')
			, stars = mode.findGoalsPos(back.width)
			, front = new PIXI.TilingSprite(PIXI.Texture.fromFrame('mobile_gauge_star_front'), 272, 29)
		 	, starGauge = new PIXI.DisplayObjectContainer()
		 	, ptsGroup = new PIXI.DisplayObjectContainer();

		front.width = 0;
		front.refId = 'frontMobileGauge';
		builder.save(front);

		back.refId = 'backMobileGauge';
		builder.save(back);


		starGauge.addChild(back);
		starGauge.addChild(front);

		var starContainer = new PIXI.DisplayObjectContainer();
		for(var i=0; i<starsLength; i++) {
			var offStar = PIXI.Sprite.fromFrame('ig_star_off')
				, onStar = PIXI.Sprite.fromFrame('ig_star_on')
				, pos = stars[i];

			offStar.scale.x = offStar.scale.y = 1.7;
			offStar.position.x = pos.y - ~~(offStar.width/2);
			offStar.refId = 'offStar-' + i;
			builder.save(offStar);

			onStar.scale.x = onStar.scale.y = 1.7;
			onStar.position.x = offStar.position.x + 5;
			onStar.alpha = 0;
			onStar.refId = 'onStar-' + i;
			builder.save(onStar)

			starContainer.addChild(offStar);
			starContainer.addChild(onStar);



		}

		starContainer.position.y = -15;

		starGauge.addChild(starContainer);
		group.addChild(starGauge);


		var graph = new PIXI.Graphics();
			graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 220, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		ptsGroup.addChild(graph);

		var ptsSprite = PIXI.Sprite.fromFrame('app_pts');
		ptsSprite.scale.x = ptsSprite.scale.y = 1.2;
		ptsSprite.position.x = -2;
		ptsSprite.position.y = -5;

		ptsGroup.addChild(ptsSprite);

		var scoreText = new PIXI.BitmapText("0", {font: "31px FredokaOne-Regular"})
		scoreText = Util.DisplayText.shadow(scoreText, 3, 0, 0x61605e, 0.7);
		scoreText.position.x = ptsSprite.position.x + ptsSprite.width + 15;
		scoreText.position.y = ~~(graph.height/2 - scoreText.height/2);
		ptsGroup.addChild(scoreText);

		ptsGroup.position.x = boundedBox.x + 10;
		ptsGroup.position.y = ATW.gameHeight() - ptsGroup.height - 25;
		group.addChild(ptsGroup);


		starGauge.scale.x = starGauge.scale.y = 0.75;
		starGauge.position.x = boundedBox.xMax - starGauge.width - 10;
		starGauge.position.y = ATW.gameHeight() - starGauge.height - 25;

		scoreText.refId = 'scoreText';
		builder.save(scoreText);

		starGauge.refId = 'starGauge';
		builder.save(starGauge);

	} else {
		var barShape    = PIXI.Sprite.fromFrame('game_bar_bg'),
			back        = PIXI.Sprite.fromFrame('ig_gauge_back'),
			front       = PIXI.Sprite.fromFrame('ig_gauge_front'),
			stars       = mode.findGoalsPos(barShape.height-40),
			staticStuff = new PIXI.DisplayObjectContainer(),
			dynStuff  = new PIXI.DisplayObjectContainer();

		back.position.y  = barShape.height - back.height + 5;
		back.position.x  = ~~(barShape.width/2 - back.width/2);
		front.position.y = barShape.height - front.height + 20;
		front.position.x = ~~(barShape.width/2 - front.width/2);

		var footGauge = PIXI.Sprite.fromFrame('gauge_obj1_foot');
		footGauge.position.x = barShape.position.x + 5;
		footGauge.position.y = barShape.height - footGauge.height;

		barShape.refId = 'barShape';
		builder.save(barShape);

		staticStuff.addChild(back),
		staticStuff.addChild(barShape);
		staticStuff.addChild(footGauge);

		// Affiche les scores a atteindre
		for(var i=0; i<starsLength; i++) {
			var pos = stars[i],
				score = goals[i];

			// Ligne de separation
			var line = PIXI.Sprite.fromFrame('gauge_line');
			line.position.y = barShape.height - pos.y;
			line.position.x = 12;
			line.refId = 'lineScore-'+i;
			builder.save(line);

			var text = new PIXI.BitmapText(score.toString(), {font: "22px FredokaOne-Regular"});
			text.position.y = ~~(line.height/2 - text.height/2) - 3;
			text.position.x = ~~(line.width/2 - text.width/2);
			console.log('score', score);
			text.refId = 'score-'+i;
			builder.save(text);

			line.addChild(text);
			staticStuff.addChild(line);

			// Etoile
			var offStar = PIXI.Sprite.fromFrame('ig_star_off');
			offStar.position.x = line.position.x + line.width + 15;
			offStar.position.y = line.position.y + ~~(line.height/2 - offStar.height/2);
			dynStuff.addChild(offStar);
			offStar.refId = 'offStar-' + i;
			builder.save(offStar);

			var onStar = PIXI.Sprite.fromFrame('ig_star_on');
			onStar.position.x = offStar.position.x + 3;
			onStar.position.y = offStar.position.y;
			onStar.alpha = 0;
			dynStuff.addChild(onStar);
			onStar.refId = 'onStar-' + i;
			builder.save(onStar)
		}

		var texture = PIXI.Texture.fromFrame('gauge_obj1_tile');
		var tilingGauge = new PIXI.TilingSprite(texture, 87, barShape.height);
		tilingGauge.height = 0;
		tilingGauge.position.x = footGauge.position.x;
		tilingGauge.oriY = tilingGauge.position.y = footGauge.position.y - tilingGauge.height;


		var headGauge = PIXI.Sprite.fromFrame('gauge_obj1_head');
		headGauge.position.y = tilingGauge.position.y - headGauge.height +2;
		headGauge.position.x = footGauge.position.x;

		var myScore = 0;
		var scoreText = new PIXI.BitmapText(myScore.toString(), {font: "17px FredokaOne-Regular"});
		scoreText = Util.DisplayText.shadow(scoreText, 2, 0, 0x0d0d0d, 0.3);
		scoreText.centerX = barShape.position.x + ~~(barShape.width/2);
		scoreText.position.x = scoreText.centerX - ~~(scoreText.width/2);
		scoreText.position.y = barShape.height - 25;

		dynStuff.addChild(headGauge);
		dynStuff.addChild(tilingGauge);
		dynStuff.addChild(front);
		dynStuff.addChild(scoreText);

		headGauge.refId = 'headGauge';
		builder.save(headGauge);

		tilingGauge.refId = 'tilingGauge';
		builder.save(tilingGauge);

		scoreText.refId = 'scoreText';
		builder.save(scoreText);

		staticStuff.cacheAsBitmap = true;
		group.addChild(staticStuff);
		group.addChild(dynStuff);

		group.refId = 'groupGauge';
	}



	return group;
}


function createBonusList(builder, boundedBox){
	var bonusGroup = new PIXI.DisplayObjectContainer(),
		i = 0,
		_t = Util.Bonus,
		lastBonus = null,
		map = [],
		bonusMap = {refId: 'bonusMap', map:map},
		player = ATW.App.getPlayer();

	builder.save(bonusMap);

	var bonusList = [
		_t.findByKey('BONUS_JOKER'),
		_t.findByKey('BONUS_LIFE'),
		_t.findByKey('BONUS_FREEZE'),
		_t.findByKey('BONUS_DOUBLE'),
		_t.findByKey('BONUS_BONUS')
	];

	if(!ATW.isMobile()) {
		// Liste les bonus
		bonusList.forEach(function(b){
			var bid = b.id,
				isUnlock = (b.tuto_key && !player.isTutoFisnish(b.tuto_key)) ? false : true;
				// isUnlock = true;

			var texture = PIXI.Texture.fromFrame('bonus-' + bid);
			var btnBonus = new UI.Button(texture);
			if(lastBonus) btnBonus.position.y = lastBonus.position.y + lastBonus.height + 25;

			var bonus = player.getBonus(bid);
			var qty = (bonus) ? bonus.getQuantity() : 0;
			var s = "x" + qty;
			if(!qty) {
				var product = Util.Shop.findProductByKey(b.key);
				s = product.price.toString();
			}

			var pearlSprite = PIXI.Sprite.fromFrame('app_pearl');
			pearlSprite.scale.x = pearlSprite.scale.y = 0.65;
			pearlSprite.position.x = -15;
			pearlSprite.position.y = 10;
			btnBonus.addChild(pearlSprite);
			pearlSprite.refId = 'bonusPearl-' + bid;
			builder.save(pearlSprite);
			if(qty) {
				pearlSprite.alpha = 1;
			}

			var qtyText = new PIXI.BitmapText(s, {font: "40px FredokaOne-Regular"});
			qtyText = Util.DisplayText.shadow(qtyText, 2, 0, 0x0d0d0d, 0.5);
			qtyText.position.x = 10;
			qtyText.position.y = 10;
			btnBonus.addChild(qtyText);
			qtyText.refId = 'bonusText-' + bid;
			builder.save(qtyText);


			lastBonus = btnBonus;

			if(!isUnlock) {
				btnBonus.alpha = 0;
				btnBonus.buttonMode = false;
			}

			bonusGroup.addChild(btnBonus);


			btnBonus.bid = bid;
			btnBonus.refId = 'btnBonus-' + bid;
			builder.save(btnBonus);
			map.push(btnBonus);

			i++;

		});

	} else {
		var maxWidth = boundedBox.xMax - boundedBox.x;
		var lineContainer = new PIXI.DisplayObjectContainer();

		bonusList.forEach(function(b){
			var bid = b.id,
				isUnlock = (b.tuto_key && !player.isTutoFisnish(b.tuto_key)) ? false : true,
				margin = 70;

			var btnBonus = Util.DisplayObject.button('bonus-' + bid);
			if(lineContainer.width + btnBonus.width + margin > maxWidth) {
				bonusGroup.addChild(lineContainer);

				var oldLine = lineContainer;
				lineContainer = new PIXI.DisplayObjectContainer();
				lineContainer.position.y = oldLine.position.y + oldLine.height + 40;

			}

			btnBonus.scale.x = btnBonus.scale.y = 1.6;
			btnBonus.position.x = lineContainer.width;

			var bonus = player.getBonus(bid);
			var qty = (bonus) ? bonus.getQuantity() : 0;

			var s = "x" + qty;
			if(!qty) {
				var product = Util.Shop.findProductByKey(b.key);
				s = product.price.toString();
			}

			var pearlSprite = PIXI.Sprite.fromFrame('app_pearl');
			pearlSprite.scale.x = pearlSprite.scale.y = 0.65;
			pearlSprite.position.x = -15;
			pearlSprite.position.y = 10;
			btnBonus.addChild(pearlSprite);
			pearlSprite.refId = 'bonusPearl-' + bid;
			builder.save(pearlSprite);
			if(qty) {
				pearlSprite.alpha = 0;
			}


			var qtyText = new PIXI.BitmapText(s, {font: "40px FredokaOne-Regular"});
			qtyText = Util.DisplayText.shadow(qtyText, 2, 0, 0x0d0d0d, 0.5);
			qtyText.position.x = 10;
			qtyText.position.y = 10;
			btnBonus.addChild(qtyText);
			qtyText.refId = 'bonusText-' + bid;
			builder.save(qtyText);

			if(!isUnlock) {
				btnBonus.alpha = 0;
				btnBonus.buttonMode = false;
			}

			if(lineContainer.width >0) btnBonus.position.x += margin;

			lineContainer.addChild(btnBonus);

			btnBonus.bid = bid;
			btnBonus.refId = 'btnBonus-' + bid;
			builder.save(btnBonus);
			map.push(btnBonus);

			i++;

		});

		bonusGroup.addChild(lineContainer);
		for(var j=0; j<bonusGroup.children.length; j++) {
			var line = bonusGroup.children[j];
			line.position.x = maxWidth/2 - line.width/2;
		}

	}


	return (i) ? bonusGroup : null;
};

function createGameBackground() {
	var width = 570,
		height = 577,
		radius = 7,
		// x = (ATW.gameMidWidth() - width/2),
		x = 0,
		// y = (ATW.gameMidHeight() - height/2) +20;
		y = 0;

	var gameBackground = new PIXI.Graphics();
	gameBackground.beginFill(0x07bff8)
		.drawRoundedRect (x, y, width, height, radius)
		.endFill();

	return gameBackground;
};


function createWave(builder, game) {
	var mode = game.getLevel().getMode();

	if(mode.needFullGrid() && !mode.isWreckingBall()) return;

	var group = new PIXI.DisplayObjectContainer();
	var ropeContainer = new PIXI.DisplayObjectContainer();

	if(!ATW.isMobile()) {
		var bgRope = PIXI.Sprite.fromFrame('bg_rope');
		ropeContainer.addChild(bgRope);

		var texture = PIXI.Texture.fromFrame('default_rope');
		var frontRope = new PIXI.TilingSprite(texture, bgRope.width, bgRope.height);
		frontRope.refId = 'frontRope';
		builder.save(frontRope);
		ropeContainer.addChild(frontRope);

		// Etincelle
		var textures = [];
		for(var i=1; i<5; i++) textures.push(PIXI.Texture.fromFrame("sparkle_base_" + i));
		var sparkle = new PIXI.MovieClip(textures);
		sparkle.oriY = sparkle.position.y = frontRope.position.y + frontRope.height - sparkle.height + 22;
		sparkle.position.x = -9;
		sparkle.loop = true;
		sparkle.animationSpeed = 0.25;
		sparkle.refId = 'sparkle';
		sparkle.alpha = 0;
		sparkle.play();

		builder.save(sparkle);

		ropeContainer.addChild(sparkle);

		ropeContainer.position.y = 15;

		group.addChild(ropeContainer);
	} else {
		var back = PIXI.Sprite.fromFrame('mobile_wave_back')
			, front = new PIXI.TilingSprite(PIXI.Texture.fromFrame('mobile_wave_front'), 341, 43);

		front.width = 0;

		front.refId = 'frontRope';
		builder.save(front);

		ropeContainer.addChild(back);
		ropeContainer.addChild(front);

		group.addChild(ropeContainer);
	}

	if(!mode.isWreckingBall()) {
		var btnFirewave = new Util.DisplayObject.button('ig_firewave_bg');
		btnFirewave.position.y = 25;
		btnFirewave.position.x = 5;
		if(ATW.isMobile()) {
			btnFirewave.scale.x = btnFirewave.scale.y = 1.2;
			btnFirewave.position.x = ropeContainer.width - btnFirewave.width/2 + 30;
			btnFirewave.position.y -= 4;
		}

	} else {
		var btnFirewave = new Util.DisplayObject.button('button_detonator');
		btnFirewave.position.y = -18;

		if(ATW.isMobile) {
			btnFirewave.position.x = ropeContainer.width - btnFirewave.width/2 + 25;
			btnFirewave.position.y = 20;
		}
	}

	var text = new PIXI.BitmapText(game.getQuantityLeft().toString(), {font: "25px FredokaOne-Regular"});
	text = Util.DisplayText.shadow(text, 2, 0, 0x0d0d0d, 0.3);
	text.position.x = -text.width/2;
	text.position.y = -text.height/2;
	if(mode.isWreckingBall()) {
		text.position.y = 10;
	}

	text.refId = "fireWaveText";
	builder.save(text);

	btnFirewave.addChild(text);
	// btnFirewave.scale.x = btnFirewave.scale.y = 1.1;
	btnFirewave.position.x += 5;
	btnFirewave.refId = "fireWave";

	builder.save(btnFirewave);
	group.addChild(btnFirewave);


	group.refId = 'waveContainer';

	return group;
};


function createFields(scene, builder, grid){
	var grounds = new PIXI.DisplayObjectContainer()
		, assets = new PIXI.DisplayObjectContainer()
		, fields = new PIXI.DisplayObjectContainer()
		, background = createGameBackground()
		, groundsDyn = new PIXI.DisplayObjectContainer();

	background.position.x = -8;
	background.position.y = 20;
	grounds.addChild(background);

	// Utiliser une render texture pour optimiser
	grid.eachGround(function(ground){
		var viewUrl = ground.getViewUrl(),
			groundSprite = null,
			addTo = groundsDyn;
		if(viewUrl) {
			groundSprite = PIXI.Sprite.fromFrame('ground-' + ground.view);
			addTo = grounds
		}

		if(ground.isLDLostLife()) {
			var texture = PIXI.Texture.fromFrame('ground-6');
			var lostLife = new PIXI.TilingSprite(texture, Game.Ground.WIDTH-2, 20);
			lostLife.position.x = ground.getLeft() + 1;
			lostLife.position.y = ground.getTop() + 2;
			groundsDyn.addChild(lostLife);

			var tl = new TimelineMax({repeat:-1});
			tl.to(lostLife.tilePosition, 7, {x: Game.Ground.WIDTH-2, ease:Linear.easeNone});

			scene._addAnim(tl);

		}


		if(!groundSprite) return;

		if(ground.hasHole()){
			var holeSprite = PIXI.Sprite.fromFrame('hole_game');
			holeSprite.position.x = ~~(groundSprite.width/2 - holeSprite.width/2);
			holeSprite.position.y = 4;
			groundSprite.addChild(holeSprite);
		}


		groundSprite.position.x += ground.getLeft();
		groundSprite.position.y += ground.getTop();
		addTo.addChild(groundSprite);

		if(ground.hasPearl()) {
			var pearlContainer = new PIXI.DisplayObjectContainer();

			var pearl = PIXI.Sprite.fromFrame('app_pearl');

			var shadow = PIXI.Sprite.fromFrame('pearl_shadow')
			shadow.scale.x = 0.92;
			shadow.scale.y = 0.55;
			shadow.position.x = ~~(pearl.width/2 - shadow.width/2) + 2;
			shadow.position.y = pearl.height - 22;

			pearlContainer.addChild(shadow);
			pearlContainer.addChild(pearl);


			pearlContainer.position.x = groundSprite.position.x + (groundSprite.width/2 - pearlContainer.width/2);
			pearlContainer.position.y = groundSprite.position.y + 5;

			pearlContainer.cacheAsBitmap = true;
			assets.addChild(pearlContainer);

			pearlContainer.refId = "pearl_" + ground.getId();
			builder.save(pearlContainer);


		}

		if(ground.hasWall()) {
			var wall = PIXI.Sprite.fromFrame('wall_' + ground.wall);
			wall.position.y = groundSprite.position.y + groundSprite.height - wall.height - 15;
			wall.position.x = groundSprite.position.x;
			wall.refId = "wall-" + ground.id;
			builder.save(wall);

			assets.addChild(wall);

		}



		if(ground.hasBonus()) {
			var bonus = ground.getBonus();
			if(!bonus.isBomb()) {
				throw new Error('createFields bonus != bonus need to be implemented');
			} else {
				// Ajoute une bombe sur la scene

				var bombContainer = new PIXI.DisplayObjectContainer();

				var cacheContainer = new PIXI.DisplayObjectContainer();

				var blackBomb = PIXI.Sprite.fromFrame('bomb');
				var redBomb = PIXI.Sprite.fromFrame('bomb_red');

				var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
				shadow.scale.x = 0.92;
				shadow.scale.y = 0.55;
				shadow.position.x = ~~(blackBomb.width/2 - shadow.width/2) + 2;
				shadow.position.y = blackBomb.height - 22;

				cacheContainer.addChild(shadow);
				cacheContainer.addChild(blackBomb);

				cacheContainer.cacheAsBitmap = true;
				bombContainer.addChild(cacheContainer);
				bombContainer.addChild(redBomb);

				bombContainer.position.x = groundSprite.position.x + (groundSprite.width/2 - bombContainer.width/2);
				bombContainer.position.y = groundSprite.position.y - 15;

				assets.addChild(bombContainer);

				bombContainer.refId = "bonus_" + ground.getId();
				builder.save(bombContainer);

				var tl = new TimelineMax({repeat: -1, yoyo: true});
				tl.to(redBomb, 1, {alpha: 0});
				scene._addAnim(tl);

				bonus.anim = tl;
			}

		}

	});


	grounds.cacheAsBitmap = true;
	fields.addChild(grounds);
	fields.addChild(groundsDyn);
	fields.addChild(assets);

	groundsDyn.refId = "groundsDyn";
	builder.save(groundsDyn);

	assets.refId = "assetsField";
	builder.save(assets);

	fields.position.x = ~~(ATW.gameWidth()/2 - fields.width/2) + 8;
	fields.position.y = ~~(ATW.gameHeight()/2 - fields.height/2);

	return fields;

};


})(window.View = window.View || {});