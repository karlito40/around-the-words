'use strict';

(function(partials){

partials.bottom_partial = function build_header_partial(builder, boundedBox, cfs){

	var group = new PIXI.DisplayObjectContainer();


	if(cfs && cfs.button_previous) {
		var btnPrevious = Util.DisplayObject.button('button_previous');
		btnPrevious.scale.x = btnPrevious.scale.y = 1.05;
		btnPrevious.position.x += boundedBox.x + btnPrevious.width/2 + 20;
		btnPrevious.position.y += btnPrevious.height/2;
		btnPrevious.refId = "button_previous";
		builder.save(btnPrevious);

		group.addChild(btnPrevious);
	}


	if(cfs && cfs.daily_reward) {
		var btnReward = Prefab.daily_reward_btn();
		if(btnReward) {
			btnReward.position.x = boundedBox.xMax - btnReward.width/2 - 20;
			btnReward.position.y = btnReward.height/2 - 5;
			btnReward.refId = 'button_daily_reward';
			builder.save(btnReward);

			group.addChild(btnReward);
		}

	}

	// group.position.x = boundedBox.x;
	group.position.y = ATW.gameHeight() - group.height - 25;
	group.refId = 'footerBar';
	builder.add(group);

};

})(window.Partial = window.Partial || {});