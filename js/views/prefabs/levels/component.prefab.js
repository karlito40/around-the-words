'use strict';

(function(prefabs){

prefabs.level_name = function build_level_name_prefab(levelName){
	var prefab = new PIXI.DisplayObjectContainer()
		, widthGraph = 100
		, heightGraph = 50
		, graph = new PIXI.Graphics();

	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, widthGraph, heightGraph, 40)
		.endFill();
	graph.alpha = 0.3;

	var levelNameBmp = new PIXI.BitmapText(levelName, {font: '32px FredokaOne-Regular'});
	levelNameBmp = Util.DisplayText.shadow(levelNameBmp, 3, 0, 0x0d0d0d, 0.7);

	levelNameBmp.position.x = ~~(widthGraph/2 - levelNameBmp.width/2);
	levelNameBmp.position.y = ~~(heightGraph/2 - levelNameBmp.height/2);

	prefab.addChild(graph);
	prefab.addChild(levelNameBmp);

	return prefab;
};

prefabs.level_score_end = function build_level_score_end_prefab(myScore){
	var scoreBmp = new PIXI.BitmapText(myScore.toString(), {font: '60px FredokaOne-Regular'});
	scoreBmp = Util.DisplayText.shadow(scoreBmp, 3, 0, 0x0d0d0d, 0.5);

	return scoreBmp;
};


prefabs.level_obj_end = function build_level_obj_end_prefab(cond, text) {
	var validString = (cond) ? 'valid' : 'bad'
		, shadow = (validString == 'valid') ? 0x307ef2 : 0xeb382f
		, checkbox = PIXI.Sprite.fromFrame('ig_checkbg_' + validString)
		, check = PIXI.Sprite.fromFrame('ig_chk_' + validString)
		, line = new PIXI.DisplayObjectContainer()
		, textBmp = new PIXI.BitmapText(text, {font: "28px FredokaOne-Regular"});

	textBmp = Util.DisplayText.shadow(textBmp, 2, 1, shadow, 0.8);


	check.position.x = -2;
	check.position.y = -2;
	checkbox.addChild(check);

	textBmp.position.x = check.width + 10;

	line.addChild(checkbox);
	line.addChild(textBmp);

	line.cacheAsBitmap = true;

	return line;
};




})(window.Prefab = window.Prefab || {});