'use strict';
(function(views){

views.world_scene = function build_world_scene(builder) {
	var boundedBox = Util.Screen.boundedBox();

	// --------------------------------------------------------------
	// Worlds slider
	// --------------------------------------------------------------
	// if(ATW.isMobile()) {
	if(true) {
		// createFirstWorld(builder);

		var blur = PIXI.Sprite.fromFrame('world_glow');
		blur.position.x = ATW.gameMidWidth() - blur.width/2;
		blur.position.y = ATW.gameMidHeight() - blur.height/2;
		builder.add(blur);

		var worldDatas = ATW.Datas.WORLDS;
		builder.createWorld = function(i, cWorld, cfPrefab) {
			var centerX = ATW.gameMidWidth()
				, centerY = ATW.gameMidHeight()
				, c = 0;

			if(!cWorld) {
				for(var worldID in worldDatas){
					if(c == i) {
						var cWorld = worldDatas[worldID];
					}

					c++;

				}
			}

			var world = new UI.World(cWorld, true)
			, worldPrefab = world.prefab;

			worldPrefab.position.x = centerX;
			worldPrefab.position.y = centerY;
			worldPrefab.refId = 'world_' + i;

			if(cfPrefab) {
				for(var key in cfPrefab) {
					worldPrefab[key]= cfPrefab[key];
				}
			}

			builder.add(worldPrefab, true);

			return worldPrefab;
		}

		builder.createWorld(0);
		// var i=0;
		// for(var worldID in worldDatas){
		// 	var o = {};
		// 	if(i) o.visible = false;
		// 	builder.createWorld(i++, worldDatas[worldID], o);
		// }


		createSlideArrow(builder, boundedBox);

	} else {
		createWorlds(builder);
	}

		// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------
	Partial.header_partial(builder, boundedBox);

	// --------------------------------------------------------------
	// Bottom bar
	// --------------------------------------------------------------
	Partial.bottom_partial(builder, boundedBox, {
		button_previous: true,
		daily_reward: true
	});


};

function createSlideArrow(builder, boundedBox) {
	var leftArrow = Util.DisplayObject.button('app_left_arrow')
		, rightArrow = Util.DisplayObject.button('app_right_arrow')
		, centerY = ATW.gameMidHeight();

	leftArrow.refId = 'leftArrow';
	rightArrow.refId = 'rightArrow';

	leftArrow.position.x = boundedBox.x + ~~(leftArrow.width/2) + 15;
	leftArrow.position.y = centerY;
	leftArrow.alpha = 0;
	leftArrow.visible = false;

	rightArrow.position.x = boundedBox.xMax - (rightArrow.width/2) - 15;
	rightArrow.position.y = centerY;

	builder.add(leftArrow);
	builder.add(rightArrow);

};



function createWorlds(builder, options) {

	var centerX = ATW.gameMidWidth(),
		scaleHighlight = builder.container.scaleHighlight,
		scaleSecondary = builder.container.scaleSecondary,
		scaleAll = 0.8
		// , depth = new Util.Depth({x: centerX}, 300, 1.2)
		;

	var buildWorlds = [];

	var i = 0
		, lastPrefab = null
		, worldDatas = ATW.Datas.WORLDS;
	for(var worldID in worldDatas){
		var cWorld = worldDatas[worldID];
		var world = new UI.World(cWorld, true, (!i));
		var worldPrefab = world.prefab;

		var widthOri = worldPrefab.width;

		worldPrefab.position.y = ATW.gameMidHeight();
		if(lastPrefab) {
			worldPrefab.position.x = lastPrefab.position.x + lastPrefab.width;
			worldPrefab.position.x -= widthOri - world.prefab.width;
		}
		worldPrefab.scale.x = worldPrefab.scale.y = scaleSecondary;
		worldPrefab.refId = 'world_'+ i;

		builder.save(worldPrefab);


		buildWorlds.push(world.prefab);

		lastPrefab = world.prefab;
		i++;
	}

	var worldContainer = new PIXI.DisplayObjectContainer();
	worldContainer.position.x = ATW.gameMidWidth();
	worldContainer.refId = "worldContainer";

	// for(var i=buildWorlds.length-1; i>=0; i--) {
	for(var i=0; i<buildWorlds.length; i++) {
		worldContainer.addChild(buildWorlds[i]);
	}


	// worldMexico.prefab.scale.x = worldMexico.prefab.scale.y = scaleHighlight;

	builder.add(worldContainer);
};


})(window.View = window.View || {});