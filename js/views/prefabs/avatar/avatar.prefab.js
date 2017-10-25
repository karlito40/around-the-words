'use strict';

(function(prefabs){

prefabs.avatar_prefab = function build_avatar_prefab(worldKey, bottomPivot){

	var prefab = new PIXI.DisplayObjectContainer();

	var tpl = ATW.config.avatars[worldKey];
	var customs = tpl.body;

	var inside = null;
	if(customs.length)
	{
		inside = new PIXI.DisplayObjectContainer();
		for(var i in customs)
		{
			var custom = customs[i]
				, item = ATW.Datas.AVATAR[custom.key]
				, sprite = PIXI.Sprite.fromFrame(custom.key);

			sprite.position.x = item.x;
			sprite.position.y = item.y;

			inside.addChild(sprite);

		}

	}

	var shadow = PIXI.Sprite.fromFrame('av_common_shadow')
		, skin = PIXI.Sprite.fromFrame(tpl.skin);

	shadow.position.y = skin.height - 20;
	shadow.position.x = 7;

	prefab.addChild(shadow);
	prefab.addChild(skin);

	if(inside) prefab.addChild(inside);

	if(bottomPivot) {
		prefab.pivot.x = prefab.width/2;
		prefab.pivot.y = prefab.height;

	}


	return prefab;
};

})(window.Prefab = window.Prefab || {});