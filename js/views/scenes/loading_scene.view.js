'use strict';

(function(views){

views.loading_scene = function build_loading_scene(builder) {

	var group = new PIXI.DisplayObjectContainer();

	// --------------------------------------------------------------
	// Creation de la bulle et du background
	// --------------------------------------------------------------
	var bubble = new PIXI.Sprite(PIXI.Texture.fromFrame('main_loader_background'));
	Util.Screen.toFullScreen(bubble);


	// var map = new PIXI.TilingSprite(PIXI.Texture.fromFrame('main_loader_map'), 1024, 768)
	if(EXPORT_PLATFORM == 'facebook') {
		var map = new PIXI.TilingSprite(PIXI.Texture.fromFrame('main_loader_map'), 1024, 614);
	} else {
		var map = new PIXI.Sprite(PIXI.Texture.fromFrame('main_loader_map'));

	}


	map.refId = "map";

	map.scale.x = map.scale.y = 1.2;
	if(EXPORT_PLATFORM != 'facebook') {
		map.position.x = ~~(bubble.width/2 - map.width/2);
	}

	// map.position.y = ~~(bubble.height/2 - map.height/2) - 70;
	map.position.y = ~~(bubble.height/2 - map.height/2) - 60;

	// map.alpha = 0;


	group.addChild(map);
	group.addChild(bubble);

	group.position.x = ~~(ATW.gameMidWidth() - group.width/2);
	group.position.y = ~~(ATW.gameMidHeight() - group.height/2);
	if(ATW.gameWidth() < 1000) group.position.x -= 30;


	builder.add(group)

	// --------------------------------------------------------------
	// Ajout du logo
	// --------------------------------------------------------------
	var logo = new PIXI.Sprite(PIXI.Texture.fromFrame('app_logo'));

	if(ATW.gameWidth() > 1000) logo.scale.x = logo.scale.y = 0.8;
	else logo.scale.x = logo.scale.y = 0.65;

	logo.anchor.x = logo.anchor.y = 0.5;

	logo.position.x = ATW.gameMidWidth();
	if(ATW.gameWidth() < 1000) logo.position.x -= 5;
	else logo.position.x += 25
	logo.position.y = ATW.gameMidHeight() - 40;
	// logo.alpha = 0;

	logo.refId = "logo";

	builder.add(logo);


	// --------------------------------------------------------------
	// Chargement
	// --------------------------------------------------------------
	// var label = new PIXI.BitmapText('Chargement...', {font: "60px FredokaOne-Regular", align:"center"});
	// var text = new PIXI.BitmapText('Chargement...', {font: "60px FredokaOne-Regular"});
	var text = new PIXI.BitmapText(_ts('Chargement') + '...', {font: "60px FredokaOne-Regular"});
	var label = Util.DisplayText.shadow(text, 4, 1, 0x0d0d0d, 0.5);

	label.refId = "label";
	label.position.y = ATW.gameHeight() - label.height - 60;
	Util.DisplayObject.centerX(ATW.gameWidth(), label);

	builder.add(label);


	// --------------------------------------------------------------
	// Sauvegarde les refs
	// --------------------------------------------------------------
	builder.save(map);

};


})(window.View = window.View || {});
