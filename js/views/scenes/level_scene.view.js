'use strict';
(function(views){
views.level_scene = function build_level_scene(builder) {
	var boundedBox = Util.Screen.boundedBox();

	var bg = new PIXI.TilingSprite(PIXI.Texture.fromFrame('world_background'), ATW.gameWidth(), ATW.gameHeight());
	bg.refId = "tilingBg";
	builder.add(bg);


	// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------
	Partial.header_partial(builder, boundedBox);

	// --------------------------------------------------------------
	// Bottom bar
	// --------------------------------------------------------------


	var nbRoad = 3;
	var roadContainer = new PIXI.DisplayObjectContainer();
	roadContainer.refId = "roadContainer";

	var myWorld = builder.container.world;
	var worldId = myWorld.getId();
	var cfWorld = ATW.Datas.WORLDS[worldId];

	var titleSprite = PIXI.Sprite.fromFrame(cfWorld.key + '-title');
	titleSprite.position.x = ATW.gameMidWidth() - ~~(titleSprite.width/2);
	titleSprite.position.y = ATW.gameHeight();
	titleSprite.refId = "titleSprite";
	titleSprite.toY = ATW.gameHeight() - titleSprite.height - 25;
	builder.add(titleSprite);


	Partial.bottom_partial(builder, boundedBox, {
		button_previous: true
	});


	// --------------------------------------------------------------
	// Monde courant
	// --------------------------------------------------------------
	var currentWorld = new UI.World(cfWorld);
	currentWorld.prefab.position.x = ~~(currentWorld.prefab.width/2);
	currentWorld.prefab.position.y = ~~(currentWorld.prefab.height/2);
	roadContainer.addChild(currentWorld.prefab);

	// --------------------------------------------------------------
	// Arriere plan
	// --------------------------------------------------------------
	var x = currentWorld.prefab.width;
	for(var i=1; i<=nbRoad; i++) {
		var scheme = new PIXI.Sprite.fromFrame(cfWorld.key + '_scheme' + i);
		scheme.position.x = x;
		x += scheme.width-2;
		roadContainer.addChild(scheme);
	}


	Util.Object.each(cfWorld.levels, function(levelId){
		var cLevel = ATW.Datas.LEVELS[levelId],
			order = parseInt(cLevel.order, 10),
			level = myWorld.getLevel(cLevel);


		var pointFrame = level.getPointFrame();

		var pointAvailable = (pointFrame != "world_point_off");


		var point = PIXI.Sprite.fromFrame(pointFrame);
		point.position.x = cLevel.point_x + 15;
		point.position.y = cLevel.point_y + 5;

		var s = order + 1;
		s = s.toString();
		var text = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
		var label = Util.DisplayText.shadow(text, 2, 1, 0x0d0d0d, 0.3);
		label.position.x = ~~(point.width/2 - label.width/2);
		label.position.y = 5;

		point.addChild(label);

		var starGroup = new PIXI.DisplayObjectContainer()
			, star =  Math.min(level.getStar(), 3)
			, margin = 5;

		if(star) {
			switch(star) {
				case 3:
					var leftStar = PIXI.Sprite.fromFrame('level_star_left');
					starGroup.addChild(leftStar);

					var centerStar = PIXI.Sprite.fromFrame('level_star_center');
					centerStar.position.y = 10;
					centerStar.position.x = leftStar.width + margin;
					starGroup.addChild(centerStar);

					var rightStar = PIXI.Sprite.fromFrame('level_star_right');
					rightStar.position.x = centerStar.width + centerStar.position.x + margin;
					starGroup.addChild(rightStar);


					break;

				case 2:
					var leftStar = PIXI.Sprite.fromFrame('level_star_left');
					starGroup.addChild(leftStar);

					var rightStar = PIXI.Sprite.fromFrame('level_star_right');
					rightStar.position.x = leftStar.width + leftStar.position.x + margin;
					starGroup.addChild(rightStar);

					break;

				case 1:
					var centerStar = PIXI.Sprite.fromFrame('level_star_center');
					starGroup.addChild(centerStar);

			}

			starGroup.position.x = point.position.x + ~~(point.width/2 - starGroup.width/2);
			starGroup.position.y = point.position.y + point.height + 10;

			roadContainer.addChild(starGroup);
		}

		point.refId = 'point-'+level.getId();

		builder.save(point);

		roadContainer.addChild(point);

		if(pointAvailable) {
			point.interactive = true;
			point.touchstart = point.mousedown = function(level){
				return function(){
					builder.container.onEnterPoint(level)
				}
			}(level);
		}

	});




	roadContainer.position.y = 130;

	builder.add(roadContainer);


};



})(window.View = window.View || {});