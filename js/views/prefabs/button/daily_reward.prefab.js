'use strict';

(function(prefabs){

prefabs.daily_reward_btn = function build_daily_reward_btn_prefab(){
	var player = ATW.App.getPlayer();

	if(!player.hasDailyReward()) {
		var sprite = null;
		if(player.heartAccelerator) {
			sprite = PIXI.Sprite.fromFrame('HEART_ACCELERATOR');
		} else if(player.scoreAccelerator) {
			sprite = PIXI.Sprite.fromFrame('SCORE_ACCELERATOR');
		} else if(player.timeBooster) {
			sprite = PIXI.Sprite.fromFrame('TIME_BOOSTER');
		}

		if(sprite) {
			sprite.anchor.x = sprite.anchor.y = 0.5;
			return sprite;
		}

	} else {
		return Util.DisplayObject.button('button_reward');
	}
};



})(window.Prefab = window.Prefab || {});