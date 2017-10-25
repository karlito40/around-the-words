'use strict';

(function(exports){

function PopupTutoBoard(pages, onComplete){
	Util.Popup.call(this);

	this.filterAlpha = 0;
	this.pages       = pages || [];
	this.onComplete  = onComplete;
	this.pos         = 0;
	this.tls         = {};

};

PopupTutoBoard.constructor = PopupTutoBoard;
PopupTutoBoard.prototype = Object.create(Util.Popup.prototype);

PopupTutoBoard.prototype.create = function(){

	var teacher = PIXI.Sprite.fromFrame('tuto_teacher');
	if(ATW.isMobile()) {
		teacher.scale.x = teacher.scale.y = 0.8;
		teacher.position.x = -50;

	}

	teacher.position.y = ATW.gameHeight() - teacher.height;

	this.addChild(teacher);

	this.addBubble();

	this.filter.interactive = true;
	this.filter.touchstart = this.filter.mousedown = function toto(){};

};


PopupTutoBoard.prototype.addBubble = function(first_argument) {
	var self = this;
	if(this.currentBubble) this.removeChild(this.currentBubble);

	var page = this.getPage();
	if(!page) return false;

	this.cleanPage();

	this.currentBubble = new PIXI.DisplayObjectContainer();

	var text = Util.String2.strip(page.txt)
		, bubbleWidth = 400
		, currentPos = this.pos;

	var textBmp = Util.DisplayText.wrap(text, {
		font: "20px FredokaOne-Regular",
		// font: "17px FredokaOne-Regular",
		tint: 0x4c5b7b,
		// letterMax: 39,
		letterMax: 30,
		align: "left",
		// maxWidth: bubbleWidth- 20,
		maxWidth: bubbleWidth,
		lineHeight: 24
	});

	var bubbleGraph = new PIXI.Graphics();
	bubbleGraph.beginFill(0xFFFFFF)
		.drawRoundedRect(0, 0, bubbleWidth, textBmp.height + 40, 20)
		.endFill();

	this.currentBubble.addChild(bubbleGraph);

	textBmp.position.y = 20;
	textBmp.position.x = 20;
	this.currentBubble.addChild(textBmp);

	if(!page.noCheck) {
		var check = PIXI.Sprite.fromFrame('tuto_bubble_ok');
		check.position.x = this.currentBubble.width - check.width + 20;
		check.position.y = this.currentBubble.height - check.height +20;
		this.currentBubble.addChild(check);
	}

	this.currentBubble.position.y = ATW.gameHeight() - 150;
	if(this.currentBubble.position.y + this.currentBubble.height > ATW.gameHeight()) {
		this.currentBubble.position.y = ATW.gameHeight() - this.currentBubble.height - 40;
	}

	this.currentBubble.position.x = -this.currentBubble.width;


	if(page.hit) {
		var hit = page.hit
			, padding = 30;

		this.hitGraph = new PIXI.Graphics();

		var alpha = (page.transparentBorder) ? 0 : 1

		this.hitGraph.beginFill(0x000000, 0)
			.lineStyle(5, 0xFFFFFF, alpha)
			.drawRoundedRect(0, 0, hit.width + padding, hit.height + padding, 10)
			.endFill();


		var midWidth = ~~(this.hitGraph.width/2)
			, midHeight = ~~(this.hitGraph.height/2);

		this.hitGraph.pivot.x = midWidth;
		this.hitGraph.pivot.y = midHeight;
		this.hitGraph.position.x = hit.x - padding/2 + midWidth;
		this.hitGraph.position.y = hit.y - padding/2 + midHeight;

		this.hitGraph.interactive = true;
		this.hitGraph.mousedown = this.hitGraph.touchstart = function(){
			if(currentPos == self.pos) self.nextPage();
			if(page.onClick) page.onClick();
		}

		this.addChild(this.hitGraph);


		this.tlHit = new TimelineMax({repeat: -1, yoyo: true})
		this.tlHit.to(this.hitGraph.scale, 0.3, {x:1.1, y:1.1});

		var targetDir = '';
		if(page.arrowDir) targetDir = page.arrowDir;
		else targetDir = (hit.x > 100) ? 'toRight' : 'toLeft';

		if(!page.noArrow) {
			this.arrowSprite = PIXI.Sprite.fromFrame('tuto_bubble_target');
			var margin = 30;


			this.tlArrow = new TimelineMax({repeat: -1});
			var duration = 1;
			switch(targetDir)
			{
				case 'toBottom':
					this.arrowSprite.rotation = Util.Math2.degToRad(90);
					this.arrowSprite.position.x = hit.x + hit.width/2 + this.arrowSprite.width/2;
					this.arrowSprite.position.y = hit.y - this.arrowSprite.height - margin;
					this.tlArrow.to(this.arrowSprite.position, duration, {y: this.arrowSprite.position.y + 20}, 'start');
					break;
				case 'toTop':
					this.arrowSprite.rotation = Util.Math2.degToRad(-90);
					this.arrowSprite.position.x = hit.x + hit.width/2 + this.arrowSprite.width/2 - 60;
					this.arrowSprite.position.y = hit.y + hit.height + margin + this.arrowSprite.height;
					this.tlArrow.to(this.arrowSprite.position, duration, {y: this.arrowSprite.position.y - 20}, 'start');
					break;

				case 'toLeft':
					this.arrowSprite.position.y = hit.y + hit.height/2 + margin;
					this.arrowSprite.position.x = hit.x + hit.width + this.arrowSprite.width + margin;
					this.arrowSprite.rotation = Util.Math2.degToRad(-180);
					this.tlArrow.to(this.arrowSprite.position, duration, {x: this.arrowSprite.position.x - 20}, 'start');
					break;
				case 'toRight':
					this.arrowSprite.position.y = hit.y + hit.height/2 - this.arrowSprite.height/2;
					this.arrowSprite.position.x = hit.x - this.arrowSprite.width - margin;
					this.tlArrow.to(this.arrowSprite.position, duration, {x: this.arrowSprite.position.x + 20}, 'start');

					break;
			}

			this.tlArrow.to(this.arrowSprite.scale, 0.4, {x: 1.25, y: 1.25}, 'start');

			this.addChild(this.arrowSprite);
		}


	}


	this.addChild(this.currentBubble);

	TweenLite.to(this.currentBubble.position, 0.3, {x: 100, ease: Elastic.easeOut})

	this.currentBubble.interactive = true;
	this.currentBubble.touchstart = this.currentBubble.mousedown = function(){
		if(page.noCheck) return;
		if(currentPos == self.pos) self.nextPage();
	}


	return true;
};


PopupTutoBoard.prototype.getPage = function() {
	if(this.pos >= this.pages.length) return false;
	return this.pages[this.pos];
};

PopupTutoBoard.prototype.nextPage = function(){
	this.pos++;

	var page = this.addBubble();
	if(!page) {
		if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.resume();
		if(this.onComplete) this.onComplete();

		this.close();
	}
};

PopupTutoBoard.prototype.cleanPage = function()
{
	if(this.tlHit) {
		this.tlHit.clear();
		this.tlHit = null;
	}

	if(this.hitGraph) {
		this.removeChild(this.hitGraph);
		this.hitGraph = null;
	}

	if(this.tlArrow) {
		this.tlArrow.clear();
		this.tlArrow = null;
	}

	if(this.arrowSprite) {
		this.removeChild(this.arrowSprite);
		this.arrowSprite = null;
	}
};

PopupTutoBoard.prototype.addPage = function(page)
{
	this.pages.push(page);
};

PopupTutoBoard.prototype.unshiftPage = function(page)
{
	this.pages.unshift(page);
};

PopupTutoBoard.prototype.open = function()
{
	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.pause();

	Util.Popup.prototype.open.call(this);
};

PopupTutoBoard.prototype.close = function()
{
	this.cleanPage();
	Util.Popup.prototype.close.call(this);
};



exports.PopupTutoBoard = PopupTutoBoard;

})(window.UI = window.UI || {});


