'use strict';

(function(namespace) {

function HomeScene() {
	namespace.BaseScene.call(this, 'HomeScene', 'home_scene');

	this.soundTheme = ['menu'];
};

HomeScene.prototype.constructor = HomeScene;
HomeScene.prototype = Object.create(namespace.BaseScene.prototype);

HomeScene.prototype.logic = function() {
	if(ATW.config.test.desactiveHome) {
		this.onPlayHandler();
		return;
	}

	var soundBtn = this.view.getElementById('soundBtn'),
		setting = this.view.getElementById('setting'),
		playBtn = this.view.getElementById('play'),
		langContainer = this.view.getElementById('langContainer'),
		player = ATW.App.getPlayer(),
		self = this;


	for(var i=0; i<langContainer.children.length; i++) {
		var ch = langContainer.children[i];

		if(!ch.lang) continue;

		ch.onHit = function(ch){
			return function(){
				Util.LeaderboardHelper.reset();
				I18N.Manager.set(ch.lang);
				self.restart();

			};
		}(ch);


	}


	soundBtn.onHit = function(){
		player.sound = (player.sound) ? 0 : 1;
		var textureKey = (player.sound) ? 'button_sound_off' : 'button_sound_on';
		soundBtn.setTexture(PIXI.Texture.fromFrame(textureKey));

		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				sound: player.sound
			}
		}, function(res){

		});

		if(!player.sound) Util.Sound.stopAll();
		else self.restart();

	};


	setting.onHit = function(){
		langContainer.alpha = soundBtn.alpha = 0;
		langContainer.visible = soundBtn.visible = !soundBtn.visible;

		if(soundBtn.visible) {
			TweenLite.to([soundBtn, langContainer], 0.3, {alpha: 1});
		}
	};



	playBtn.onHit = this.onPlayHandler.bind(this);

};

HomeScene.prototype.onPlayHandler = function(){
	var worldScene = new Scene.WorldScene();
	worldScene.start();
};

namespace.HomeScene = HomeScene;

})(window.Scene = window.Scene || {});