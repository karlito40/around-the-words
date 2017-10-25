'use strict';
(function(exports){

function LevelScene(world) {
	exports.BaseScene.call(this, 'LevelScene', 'level_scene');
	this.world = world;

	this.hasPopupOpen = false;
	this.soundTheme = ['world_' + this.world.getKey()];
};

LevelScene.prototype.constructor = LevelScene;
LevelScene.prototype = Object.create(exports.BaseScene.prototype);

LevelScene.prototype.logic = function() {

	var self = this
		, roadContainer = this.view.getElementById('roadContainer')
		, tilingBg = this.view.getElementById('tilingBg')
		, titleSprite = this.view.getElementById('titleSprite')
		, scroller = new PIXIScroller.Scroll(roadContainer, {
			width: ATW.gameMidWidth()
		});

	var lastVisited = this.world.getLastVisited();
	if(!lastVisited) {
		var cfLevels = ATW.Datas.WORLDS[this.world.getId()].levels;
		for(var i in cfLevels) {
			lastVisited = cfLevels[i];
			break;
		}


	}

	TweenLite.to(titleSprite.position, 0.3, {y:titleSprite.toY} );

	this.cameraTo(lastVisited);


	ATW.App.getDataManager().getOnlineApi().call('Score', 'GET', {
			on: 'repartition',
			data: {
				worldId: this.world.getId()
			}
		}, function(response){
			console.log('response', response);

			if(!response.repartition || !self.open) return;

			self.addRepartition(response.repartition);
		}
	);

};

LevelScene.prototype.addRepartition = function(repartition) {
	var view = this.view
		, roadContainer = view.getElementById('roadContainer');

	for(var worldLevelId in repartition)
	{
		var levelRepartition = repartition[worldLevelId]
			, levelId = worldLevelId.split('-')[1]
			, friend = levelRepartition[Util.Math2.randomInt(0, levelRepartition.length-1)];


		var point = view.getElementById('point-' + levelId)
			, circleProfil = Util.DisplayObject.circleProfil(friend.fbId);
			console.log(levelId, point);

		var friendContainer = new PIXI.Graphics();
		friendContainer.beginFill(0xFFFFFF)
			.drawCircle(0, 0, 40)
			.endFill();

		circleProfil.position.x = -circleProfil.width/2 +3;
		circleProfil.position.y = -circleProfil.height/2 +3;

		friendContainer.addChild(circleProfil);

		friendContainer.scale.x = friendContainer.scale.y = 0.8;
		friendContainer.position.x = point.position.x + point.width + 20;
		friendContainer.position.y = point.y - 25;
		roadContainer.addChild(friendContainer);


	}



}



LevelScene.prototype.cameraTo = function(levelId) {
	if(!levelId) return;

	var roadContainer = this.view.getElementById('roadContainer')
		, point = this.view.getElementById('point-' + levelId);

	var toX = -point.position.x + ATW.gameMidWidth();
	TweenLite.to(roadContainer.position, 0.6, {x: toX, ease: Power3.easeIntOut});

	var avatarTo = {
		x: point.position.x + 2,
		y: point.position.y - 60
	};

	if(!this.avatar) {
		this.avatar = Prefab.avatar_prefab(this.world.getKey());
		this.avatar.scale.x = this.avatar.scale.y = 0.6;
		this.avatar.position.x = avatarTo.x;
		this.avatar.position.y = avatarTo.y;
		roadContainer.addChild(this.avatar);
	} else {
		TweenLite.to(this.avatar.position, 0.6, {x: avatarTo.x, y: avatarTo.y});
	}

};



LevelScene.prototype.onEnterPoint = function(level){
	if(this.hasPopupOpen) return;

	this.cameraTo(level.getId());

	var self = this
	, popupLevel = new UI.PopupLevel(level);

	popupLevel.onClose = function(){
		self.hasPopupOpen = false;
	};
	popupLevel.onSlide = function(level){
		self.cameraTo(level.getId());
	};
	popupLevel.open();

	this.hasPopupOpen = true;
};


LevelScene.prototype.previousAction = function() {
	var worldScene = new Scene.WorldScene();
	worldScene.start();
};


exports.LevelScene = LevelScene;

})(window.Scene = window.Scene || {});