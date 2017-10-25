'use strict';

(function(prefabs){

prefabs.world_leader_prefab = function world_leader_prefab(builder, leader){
	var prefab = new PIXI.DisplayObjectContainer()
	, circleLeader = PIXI.Sprite.fromFrame('circle_leader')
	, crown = PIXI.Sprite.fromFrame('crown');

	// Profil Pics
	var pic = Util.DisplayObject.circleProfil(leader.fbId);
	pic.position.x = 2;
	pic.position.y = 3;
	circleLeader.addChild(pic);

	crown.position.y = -42;
	crown.position.x = 35;
	circleLeader.addChild(crown);

	// Info
	var infoContainer = new PIXI.DisplayObjectContainer(),
	bgInfo = PIXI.Sprite.fromFrame('leader_info_bg'),
	encart = PIXI.Sprite.fromFrame('app_encart_yellow');

	infoContainer.addChild(bgInfo);

	encart.scale.x = encart.scale.y = 1.2;

	// var titleBmp = new PIXI.BitmapText(_ts('champion'), {font: "20px FredokaOne-Regular", tint: 0xFF0000});
	var titleBmp = new PIXI.BitmapText(_ts('champion'), {font: "18px FredokaOne-Regular", tint: 0x97855b});
	titleBmp = Util.DisplayText.shadow(titleBmp, 1, 1, 0xFFFFFF, 1);
	titleBmp.position.x = ~~(encart.width/2 - titleBmp.width/2) - 20;
	titleBmp.position.y = ~~(encart.height/2 - titleBmp.height/2) - 10;
	encart.addChild(titleBmp);

	encart.position.x = ~~(bgInfo.width/2 - encart.width/2);
	encart.position.y = 10;
	infoContainer.addChild(encart);

	var nameBmp = new PIXI.BitmapText(leader.firstName, {font: "20px FredokaOne-Regular", tint: 0x97855b})
	nameBmp = Util.DisplayText.shadow(nameBmp, 2, 0, 0xFFFFFF, 1);
	nameBmp.position.y = encart.position.y + encart.height - 8;
	nameBmp.position.x = bgInfo.width/2 - nameBmp.width/2;
	infoContainer.addChild(nameBmp);

	var scoreBmp = new PIXI.BitmapText(leader.score.toString(), {font: "20px FredokaOne-Regular", tint: 0x97855b})
	scoreBmp = Util.DisplayText.shadow(scoreBmp, 2, 0, 0xFFFFFF, 1);
	scoreBmp.position.y = nameBmp.position.y + nameBmp.height + 12;
	scoreBmp.position.x = bgInfo.width/2 - nameBmp.width/2;
	infoContainer.addChild(scoreBmp);

	var ptsIco = PIXI.Sprite.fromFrame('app_pts_orange');
	ptsIco.position.x = scoreBmp.position.x + scoreBmp.width + 5;
	ptsIco.position.y = scoreBmp.position.y - 3;
	infoContainer.addChild(ptsIco);
	infoContainer.alpha = 0;

	var shadow = PIXI.Sprite.fromFrame('av_common_shadow');
	shadow.position.y = infoContainer.height + circleLeader.height + 10;
	shadow.position.x = 35;
	prefab.addChild(shadow);


	prefab.addChild(infoContainer);

	circleLeader.position.x = ~~(infoContainer.width/2 - circleLeader.width/2) - 25;
	circleLeader.position.y = infoContainer.height + 20;
	prefab.addChild(circleLeader);

	prefab.showInfo = function(ori){
		// infoContainer.visible = (!infoContainer.visible);
		if(infoContainer.isShining) {
			TweenLite.to(infoContainer.position, 0.2, {
				y: ori.y + 30
			});
			TweenLite.to(infoContainer, 0.2, {alpha: 0});
		} else {
			TweenLite.to(infoContainer.position, 0.2, {
				y: ori.y - 30
			});
			TweenLite.to(infoContainer, 0.2, {alpha: 1});
		}

		infoContainer.isShining = (!infoContainer.isShining);


	};

	return prefab;
};

})(window.Prefab = window.Prefab || {});