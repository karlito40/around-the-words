'use strict';

(function(exports){

function PopupTuto(key, force, dontSave)
{
	Util.Popup.call(this)

	this.key = key;
	this.cf = ATW.Datas.TUTOS[this.key];
	this.active = false;
	this.force = force;
	this.dontSave = dontSave;
};

PopupTuto.constructor = PopupTuto;
PopupTuto.prototype = Object.create(Util.Popup.prototype);

PopupTuto.prototype.getPart = function()
{
	var parts = this.cf.parts
		, cpt = 0
		, part = null;

	for(var key in parts) {

		if(cpt == this.current) {
			part = parts[key];
			break;
		}

		cpt++;

	}

	return part;

};

PopupTuto.prototype.addPart = function()
{
	var self = this;
	if(this.currentPart) {
		var tl = new TimelineMax();
		tl.to(this.currentPart.position, 0.4, {x: -this.currentPart.width}, 'start');
		tl.to(this.currentPart, 0.4, {rotation: Util.Math2.degToRad(-30)}, 'start');
		tl.to(this.currentPart.scale, 0.4, {x:0.5, y: 0.5}, 'start');

		tl.call(function(currentPart){
			return function() {
				self.removeChild(currentPart);
			}
		}(this.currentPart))

	}

	var part = this.getPart();
	if(!part) return false;

	this.currentPart = new PIXI.DisplayObjectContainer();

	var textContainer = new PIXI.DisplayObjectContainer()
		, widthContainer = 500
		, title = Util.String2.strip(_2(part.name))
		, description = _2(part.description);

	description = description.replace(new RegExp('<br>', 'g'), ' ');
	description = description.replace(/\s+/g,' ').trim();
	description = Util.String2.strip(description);

	var titleBmp = new PIXI.BitmapText(title, {font: "30px FredokaOne-Regular", tint: 0x81ab3f});
	titleBmp.position.x = widthContainer/2 - titleBmp.width/2;
	textContainer.addChild(titleBmp);

	var descriptionBmp = Util.DisplayText.wrap(description, {
		font: "22px FredokaOne-Regular",
		tint: 0x5e5f4f,
		letterMax: 40,
		align: "left",
		maxWidth: widthContainer,
		lineHeight: 24
	});
	// var descriptionBmp = new PIXI.BitmapText(description, {font: "22px FredokaOne-Regular", tint: 0x5e5f4f});
	descriptionBmp.position.y = textContainer.height + 20;
	descriptionBmp.position.x = 20;
	textContainer.addChild(descriptionBmp);

	var graph = new PIXI.Graphics();
	graph.beginFill(0xFFFFFF)
		.drawRoundedRect(0, 0, widthContainer, textContainer.height + 40, 20)
		.endFill();


	this.currentPart.addChild(graph);

	textContainer.position.y = 20;
	this.currentPart.addChild(textContainer);

	// this.currentPart.position.x = ATW.gameMidWidth() - widthContainer/2;
	this.currentPart.position.y = ATW.gameMidHeight() - this.currentPart.height/2;
	this.currentPart.position.x = ATW.gameWidth() + this.currentPart.width;
	this.addChild(this.currentPart);

	TweenLite.to(this.currentPart.position, 0.3, {x: ATW.gameMidWidth() - widthContainer/2, ease: Elastic.easeOut})

	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = function(){};

	this.currentPart.interactive = true;
	this.currentPart.mousedown = this.currentPart.touchstart = this.nextPart.bind(this);

	return true;

};

PopupTuto.prototype.nextPart = function()
{
	this.current++;
	var allow = this.addPart();

	if(!allow) this.endTuto();

};

PopupTuto.prototype.endTuto = function()
{

	if(!this.dontSave) this.save();
	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.resume();
	if(this.onClose2) this.onClose2();

	this.close();
};

PopupTuto.prototype.create = function()
{

	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.pause();

	this.active = true;
	this.current = 0;

	this.addPart();


};

PopupTuto.prototype.open = function()
{
	var player = ATW.App.getPlayer();
	if(!this.force && player.isTutoFisnish(this.key)) return;

	Util.Popup.prototype.open.call(this);
};

PopupTuto.prototype.save = function()
{
	ATW.App.getPlayer().finishTuto(this.key);

	ATW.App.getDataManager().getApi().call('Tuto', 'POST', {
		on: 'me',
		data: {
			key: this.key
		}
	});
};

exports.PopupTuto = PopupTuto;

})(window.UI = window.UI || {});