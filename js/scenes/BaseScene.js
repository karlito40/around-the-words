'use strict';
(function(namespace){

function BaseScene(className, viewName)
{
	PIXI.DisplayObjectContainer.call(this);

	this.soundTheme = [];

	this.className = className;
	this.viewName = viewName;
	this.open = false;
	this.position.x = 0;
    this.position.y = 0;
    this.visible = false;
    // this.alpha = 1;
    this.fadeIn = true;
	this.anims = {};
	this.popups = {};
};

BaseScene.constructor = BaseScene;
BaseScene.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

BaseScene.current = null;


BaseScene.prototype.start = function()
{

	console.log('Start ' + this.className);
	if(this.open) return;

	if(BaseScene.current && BaseScene.current != this)
	{
		var oldScene = BaseScene.current;

		for(var i=0; i<oldScene.soundTheme.length; i++) {
			var oldTheme = oldScene.soundTheme[i];
			// On coupe le son si l'ancien theme n'est pas present sur la nouvelle scene
			if( this.soundTheme.indexOf(oldTheme) == -1 ) {
				Util.Sound.stop(oldTheme);
			}
		}
	}

	for(var i=0; i<this.soundTheme.length; i++) {
		// this.handleSoundLoaded(this.soundTheme[i]);
		Util.Sound.play(this.soundTheme[i]);
	}



	// var hasTransition = false;
	if(BaseScene.current) {
		BaseScene.current.close();
		// hasTransition = true;
	}

	BaseScene.current = this;

	this.open = true;

	this.create();

	ATW.stage.addChild(this);

	this.visible = true;
	this.blackScreen = new PIXI.Graphics();
	this.blackScreen.beginFill(0x000000)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.addChild(this.blackScreen);

	this.blackScreen.alpha = 1;

	if(this.fadeIn) {
		var tl = new TimelineMax();

		// if(hasTransition) {
		// 	this.blackScreen.alpha = 0;
		// 	tl.to(this.blackScreen, ATW.config.scene.fadeOut, {alpha:1});
		// }
		tl.to(this.blackScreen, ATW.config.scene.fadeIn, {alpha:0, onComplete: this.onReady});
		// TweenLite.to(this, ATW.config.scene.fadeIn, {alpha:1, onComplete: this.onReady});
		// this.alpha = 1;
		// this.position.x = 400;
		// TweenLite.to(this.position, ATW.config.scene.fadeIn, {x:0, onComplete: this.onReady, ease: Power3.easeOut});
	} else  {
		this.blackScreen.alpha = 0;
		if(this.onReady) this.onReady();
	}

	this.bindBasicButtons();

	this.logic();
};

BaseScene.prototype.bindBasicButtons = function()
{
	if(!this.view) return;

	var self = this
		, previousBtn = this.view.getElementById('button_previous')
		, dailyRewardBtn = this.view.getElementById('button_daily_reward')
		, moreHeart = this.view.getElementById('moreHeart')
		, morePearl = this.view.getElementById('morePearl')
		, trophy = this.view.getElementById('trophy')
		, btnNotif = this.view.getElementById('btnNotif')
		, cart = this.view.getElementById('cart');

	if(previousBtn) previousBtn.onHit = this.previousAction.bind(this);
	if(moreHeart) moreHeart.onHit = this.firePopupLife.bind(this);
	if(trophy) {
		trophy.onHit = function(){
			var popupAchievement = new UI.PopupAchievement();
			popupAchievement.open();
		}
	}

	if(btnNotif) {
		btnNotif.onHit = function(){
			var popupNotif = new UI.PopupNotif();
			popupNotif.open();
		}

	}

	if(cart) {
		cart.onHit = function(){
			var pop = new UI.PopupShop();
			pop.open();
		}
	}

	if(morePearl) {
		morePearl.onHit = function(){
			// alert('toto');
			var pop = new UI.PopupShop(Util.ShopCat.findByKey('PEARL'));
			pop.open();
		}
	}

	if(dailyRewardBtn) {
		dailyRewardBtn.onHit = function(){
			var pop = new UI.PopupDailyReward(self);
			pop.open();
		}
	}



};


BaseScene.prototype.firePopupLife = function()
{
	// alert('okok');
	var t = new UI.PopupHeart();
	t.open();
};

BaseScene.prototype.create = function()
{
	if(!this.viewName) return;

	this.view = new UI.ViewBuilder(this.viewName, this);
	this.view.build();

};

BaseScene.prototype.updatePearlText = function(){
	var nbPearlText = this.view.getElementById('nbPearlText');
	if(!nbPearlText) return;

	nbPearlText.setText(ATW.App.getPlayer().getPearls().toString());
	nbPearlText.updateText();
	nbPearlText.position.x = nbPearlText.rightOri - nbPearlText.width;
};


BaseScene.prototype.close = function()
{
	if(!this.open) return;

	this.removePopups();
	BaseScene.current = null;
	this.open = false;
	this._clean();

	if(this.onClose) this.onClose();


};

BaseScene.prototype.restart = function()
{
	this.reset = true;
	this.restartLogic();
	this.close();
};

BaseScene.prototype._clean = function()
{

	ATW.stage.removeChild(this);

	this.onClearHandler();
	this._stopAnims();
};

BaseScene.prototype.restartLogic = function()
{
	var restartScene = new Scene[this.className]();
	restartScene.start();
};

BaseScene.prototype.onClearHandler = function()
{

};

BaseScene.prototype.logic = function()
{

};

BaseScene.prototype.previousAction = function()
{

};


BaseScene.prototype._stopAnims = function(namespace, reset)
{
	if(namespace)
	{
		this._stopAnimsHandler(namespace, reset);
	}
	else
	{
		for(var namespace in this.anims)
		{
			this._stopAnimsHandler(namespace, reset);
		}
	}

};

BaseScene.prototype._stopAnimsHandler = function(namespace, reset)
{
	if(!this.anims[namespace])
	{
		return;
	}

	for(var i in this.anims[namespace])
	{
		if(reset)
		{
			this.anims[namespace][i].pause(0);
		}
		this.anims[namespace][i].kill();
	}
	delete this.anims[namespace];
};

BaseScene.prototype.hasAnim = function(namespace)
{
	return this.anims[namespace];
};

BaseScene.prototype._addAnim = function(tl, namespace)
{
	if(!namespace)
	{
		var namespace = 'default';
	}
	if(!this.anims[namespace])
	{
		this.anims[namespace] = [];
	}
	this.anims[namespace].push(tl);
};


BaseScene.prototype.addPopup = function(popup)
{
	this.popups[popup.id] = popup;
	ATW.stage.addChild(popup);
};

BaseScene.prototype.removePopups = function()
{
	console.log('removePopups');
	for(var id in this.popups) {
		ATW.stage.removeChild(this.popups[id]);
	}

	this.popups = {};
};


BaseScene.prototype.removePopup = function(popup)
{
	if(!this.popups[popup.id]) return;

	ATW.stage.removeChild(popup);

	delete this.popups[popup.id];
};

namespace.BaseScene = BaseScene;

})(window.Scene = window.Scene || {});
