(function(exports){

function Popup()
{
	PIXI.DisplayObjectContainer.call(this);

	this.filterAlpha = 0.55;
	this.isOpen = false;
	this.id = Popup._id++;
};

Popup.constructor = Popup;
Popup.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Popup.current = null;
Popup._id = 0;

Popup.prototype.open = function(){
	var self = this;
	Popup.current = this;
	this.isOpen = true;
	this.alpha = 0;

	this.addFilter();

	this.create();

	if(this.closeBtn) this.closeBtn.onHit = this.close.bind(this);

	// ATW.stage.addChild(this);
	Scene.BaseScene.current.addPopup(this);

	TweenLite.to(this, 0.5, {alpha:1});
};

Popup.prototype.create = function(){};



Popup.prototype.addFilter = function(){
	this.filter = new PIXI.Graphics();
	this.filter.beginFill(0x000000)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.filter.alpha = this.filterAlpha;

	this.addChild(this.filter);

};

Popup.prototype.close = function(){
	if(!this.isOpen) return;

	Popup.current = null;

	this.isOpen = false;

	if(this.onClose)
	{
		this.onClose();
	}

	var self = this;
	TweenMax.to(this, 0.3, {alpha:0, onComplete:function(){
		// ATW.stage.removeChild(self);
		Scene.BaseScene.current.removePopup(self);
	}});


};

exports.Popup = Popup;


})(window.Util = window.Util || {});
