'use strict';
(function(exports){

var Ground = {};

Ground.destructWall = function(view, ground) {

	var wallId = 'wall-' + ground.id
		, assetsField = view.getElementById('assetsField')
		, oldWall = view.getElementById(wallId)
		, newWall = PIXI.Sprite.fromFrame('wall_' + ground.wall)
		, attachTo = assetsField;

	newWall.position.y = oldWall.y;
	if(ground.wall == 1) newWall.position.y += 23;
	else if(ground.wall == 0) {
		newWall.position.y += 10;
		attachTo = view.getElementById('groundsDyn');
	}

	newWall.position.x = oldWall.x;
	newWall.refId = wallId;
	newWall.alpha = 0;

	view.save(newWall, true);
	attachTo.addChild(newWall);

	TweenLite.to(oldWall, 0.3, {alpha: 0, onComplete: function(){
		assetsField.removeChild(oldWall);
	}});
	TweenLite.to(newWall, 0.3, {alpha: 1});

	Util.Sound.fxPlay('fx/meduse_mur');
};


exports.Ground = Ground;


})(window.UI = window.UI || {});