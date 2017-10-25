'use strict';

(function(partials){

partials.heart_bar_partial = function build_heart_bar_partial(builder){
	var player = ATW.App.getPlayer()
		, isFullLife = player.isFullLife()
		, mobileScale = 0.75
		, heartContainer = new PIXI.DisplayObjectContainer()
		, heartCache = new PIXI.DisplayObjectContainer()
		, myLife = player.life
		, heightHeart = 43;


	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, 160, heightHeart, 40)
		.endFill();
	graph.alpha = 0.3;

	heartCache.addChild(graph);

	var heartIco = Util.DisplayObject.sprite(player.normalSessionIn ? 'app_golden_heart' : 'app_heart');
	heartIco.position.x = -20;
	if(player.normalSessionIn) heartIco.position.y = -8;
	else heartIco.position.y = -3;

	heartCache.addChild(heartIco);

	heartCache.cacheAsBitmap = true;
	heartContainer.addChild(heartCache);

	var moreHeart = Util.DisplayObject.button('button_more');
	moreHeart.scale.x = moreHeart.scale.y = 1.05;
	moreHeart.position.x = graph.width - 20;
	moreHeart.position.y = ~~(moreHeart.height/2) + -2;
	console.log('(isFullLife || player.normalSessionIn)', (isFullLife || player.normalSessionIn));
	if(isFullLife || player.normalSessionIn) {
		moreHeart.visible = false;
		// moreHeart.alpha = 0;
	}

	moreHeart.refId = 'moreHeart';
	builder.save(moreHeart, true);
	heartContainer.addChild(moreHeart);

	var text = (isFullLife) ? _ts('Plein') : '';
	var timeLeft = new PIXI.BitmapText(text, {font: "25px FredokaOne-Regular"});
	timeLeft.position.x = 45;
	timeLeft.position.y = 11;
	timeLeft.refId = 'timeLeft';
	builder.save(timeLeft, true);
	heartContainer.addChild(timeLeft);

	var s = (!player.normalSessionIn) ? myLife.toString() : '';
	var lifeText = new PIXI.BitmapText(s, {font: "30px FredokaOne-Regular"});
	lifeText = Util.DisplayText.shadow(lifeText, 3, 0, 0x0d0d0d, 0.6);
	lifeText.position.x = ~~(10 - lifeText.width/2);
	lifeText.position.y = 9;
	lifeText.refId = 'headerLifeText';
	builder.save(lifeText, true);

	heartContainer.addChild(lifeText);

	if(player.normalSessionIn) {
		var infinity = PIXI.Sprite.fromFrame('app_infinity');
		infinity.position.x = -5;
		infinity.position.y = 12;
		heartContainer.addChild(infinity);
	}

	if(ATW.isMobile()) heartContainer.scale.x = heartContainer.scale.y = mobileScale;

	heartContainer.normalSessionIn = player.normalSessionIn;

	return heartContainer;
};



})(window.Partial = window.Partial || {});