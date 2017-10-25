'use strict';

(function(partials){

partials.header_partial = function build_header_partial(builder, boundedBox, p, delay){

	var player = ATW.App.getPlayer(),
		DO = Util.DisplayObject,
		centerGroup = new PIXI.DisplayObjectContainer(),
		marginRight = 15,
		scale = 1.2,
		displayCenterGroup = false,
		player = ATW.App.getPlayer(),
		nbPearl = player.getPearls(),
		headerContainer = new PIXI.DisplayObjectContainer(),
		mobileScale = 0.75,
		mobileScaleBtn = 0.95,
		heightHeart = 43;


	// --------------------------------------------------------------
	// Trophee
	// --------------------------------------------------------------
	if(!p || p.btnTrophy) {
		var trophy = Util.DisplayObject.button('button_trophy');
		if(ATW.isMobile()) trophy.scale.x = trophy.scale.y = mobileScaleBtn;

		trophy.position.x = ~~(trophy.width/2);
		trophy.position.y = ~~(trophy.height/2);

		var nbGiftLeft = ATW.App.getPlayer().getAchievementManager().getNbGiftLeft();
		var nbGiftBmp = new PIXI.BitmapText(nbGiftLeft.toString(), {font: "25px FredokaOne-Regular"});

		var containerNumberAch = new PIXI.Graphics();
		containerNumberAch.beginFill(0xFF0000, 1)
				.lineStyle(3, 0xFFFFFF, 1)
				.drawRoundedRect(0, 0, 25, 35, 10)
				.endFill()

		containerNumberAch.position.x = 17;
		containerNumberAch.position.y = 10;

		containerNumberAch.updateNb = function(nb, dontUpdateText) {
			if(!dontUpdateText) {
				nbGiftBmp.setText(nb.toString());
				nbGiftBmp.updateText();
			}

			nbGiftBmp.position.y = 7;
			nbGiftBmp.position.x = containerNumberAch.width/2 - 2 - nbGiftBmp.width/2;
			containerNumberAch.alpha =	(!nb) ? 0 : 1;

		}

		containerNumberAch.updateNb(nbGiftLeft, true);

		containerNumberAch.addChild(nbGiftBmp);
		containerNumberAch.refId = 'nbAchievementContainer';
		builder.add(containerNumberAch);

		trophy.addChild(containerNumberAch);

		trophy.refId = 'trophy';
		builder.add(trophy);


		centerGroup.addChild(trophy);
		displayCenterGroup = true;
	}

	// --------------------------------------------------------------
	// Shop
	// --------------------------------------------------------------
	if(!p || p.btnCart) {
		var cart = Util.DisplayObject.button('button_cart');
		if(ATW.isMobile()) cart.scale.x = cart.scale.y = mobileScaleBtn;

		cart.position.x = DO.xMax(trophy) + marginRight + ~~(cart.width/2 - trophy.width/2);
		cart.position.y = ~~(cart.height/2);

		cart.refId = 'cart';
		builder.add(cart);

		centerGroup.addChild(cart);
		displayCenterGroup = true;
	}

	// --------------------------------------------------------------
	// Message
	// --------------------------------------------------------------
	if(!p || p.btnMessage) {
		var message = Util.DisplayObject.button('button_notif');
		if(ATW.isMobile()) message.scale.x = message.scale.y = mobileScaleBtn;

		var nbNotif = ATW.App.getPlayer().getMessenger().total();
		var nbNotifBmp = new PIXI.BitmapText(nbNotif.toString(), {font: "25px FredokaOne-Regular"});

		var containerNumberNotif = new PIXI.Graphics();
		containerNumberNotif.beginFill(0xFF0000, 1)
				.lineStyle(3, 0xFFFFFF, 1)
				.drawRoundedRect(0, 0, 25, 35, 10)
				.endFill()

		containerNumberNotif.position.x = 17;
		containerNumberNotif.position.y = 10;


		containerNumberNotif.updateNb = function(nb, dontUpdateText) {
			if(!dontUpdateText) {
				nbNotifBmp.setText(nb.toString());
				nbNotifBmp.updateText();
			}

			nbNotifBmp.position.y = 7;
			nbNotifBmp.position.x = containerNumberNotif.width/2 - 2 - nbNotifBmp.width/2;
			containerNumberNotif.alpha = (!nb) ? 0 : 1;

		}

		containerNumberNotif.updateNb(nbNotif, true);

		containerNumberNotif.addChild(nbNotifBmp);
		containerNumberNotif.refId = 'nbNotifContainer';
		builder.add(containerNumberNotif);

		message.addChild(containerNumberNotif);

		message.position.x = DO.xMax(cart) + marginRight;
		message.position.y = ~~(message.height/2);

		message.refId = 'btnNotif';
		builder.add(message);

		centerGroup.addChild(message);
		displayCenterGroup = true;
	}

	if(displayCenterGroup) {
		DO.centerX(ATW.gameWidth(), centerGroup);
		centerGroup.position.y = 10;

		headerContainer.addChild(centerGroup);
	}

	// --------------------------------------------------------------
	// Heart
	// --------------------------------------------------------------
	var heartContainer = Partial.heart_bar_partial(builder);
	heartContainer.position.x = boundedBox.x + 20;
	heartContainer.position.y = 27;
	heartContainer.refId = 'heartContainer';
	builder.save(heartContainer);

	headerContainer.addChild(heartContainer)

	// --------------------------------------------------------------
	// Pearl
	// --------------------------------------------------------------
	var pearlContainer = new PIXI.DisplayObjectContainer();

	var text = new PIXI.BitmapText(nbPearl.toString(), {font: "25px FredokaOne-Regular"});
	text.refId = "headerPearlText";
	builder.save(text);


	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, 170, heightHeart, 40)
		.endFill();
	graph.alpha = 0.3;

	var pearl = Util.DisplayObject.sprite('app_pearl');
	pearl.scale.x = pearl.scale.y = 0.85;
	pearl.position.y = -2;


	var more = Util.DisplayObject.button('button_more');
	more.scale.x = more.scale.y = 1.05;
	more.position.x = graph.width - 20;
	more.position.y = ~~(more.height/2);
	more.refId = 'morePearl';
	builder.save(more);

	var cacheContainer = new PIXI.DisplayObjectContainer();
	cacheContainer.addChild(graph);
	cacheContainer.addChild(pearl);
	cacheContainer.cacheAsBitmap = true;

	pearlContainer.addChild(cacheContainer);

	text.rightOri = more.position.x - more.width/2  - 10;
	text.position.x = text.rightOri - text.width;
	text.position.y = 12;
	text.refId = 'nbPearlText';
	builder.save(text);


	pearlContainer.addChild(text);
	pearlContainer.addChild(more);

	if(ATW.isMobile()) pearlContainer.scale.x = pearlContainer.scale.y = mobileScale;

	pearlContainer.position.x =  boundedBox.xMax - pearlContainer.width - 12;
	pearlContainer.position.y = 27;

	headerContainer.addChild(pearlContainer);

	if(!delay) {
		headerContainer.refId = 'headerContainer';
		builder.add(headerContainer);
	}

	return headerContainer;

};



})(window.Partial = window.Partial || {});