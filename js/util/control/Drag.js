'use strict';
(function(exports){
	function Drag (displayObject, debug) {
		this.displayObject = displayObject;
		this.oriInteractive = this.displayObject.interactive;
		this.displayObject.interactive = true;
		this.debug = debug;

		this.play = true;	 // est ce que le drag est autorisé ?
		this.active = false; // est ce que l'utilisateur appuie sur sa souris ?
		this.start = {x: 0, y:0};
		this.displayObject.touchstart = this.displayObject.mousedown = this.down.bind(this);
		this.displayObject.touchmove = this.displayObject.mousemove = this.move.bind(this);
		this.displayObject.touchend = this.displayObject.mouseup = this.up.bind(this);
		this.tween = null;
		// this.lastTime = null;
		this.addPanel();
	};

	Drag.prototype.down = function(interactionData) {
		this.active = true;
		this.start = interactionData.getLocalPosition(ATW.stage);
	};

	Drag.prototype.move = function(interactionData) {
		if(!this.active || !this.play) return;

		// var now = new Date().getTime();
		// if(this.lastTime && (now - this.lastTime) < 10) return;

		// this.lastTime = now;

		if(this.tween) this.tween.kill()

		var cursor = interactionData.getLocalPosition(ATW.stage);
		this.displayObject.position.x += cursor.x - this.start.x;
		this.displayObject.position.y += cursor.y - this.start.y;

		// this.tween = TweenLite.to(this.displayObject.position, 1.5, {
		// 	x: this.displayObject.position.x + (cursor.x -this.start.x),
		// 	y: this.displayObject.position.y + (cursor.y -this.start.y),
		// 	ease: Power2.easeOut
		// });

		this.start = cursor;
		this.updateDebug();
	};

	Drag.prototype.up = function(interactionData) {
		this.active = false;
	};

	Drag.prototype.desactive = function() {
		this.play = false;
		this.displayObject.interactive = this.oriInteractive;
	};

	Drag.prototype.reactive = function() {
		this.play = true;
		this.displayObject.interactive = this.oriInteractive;
	};

	Drag.prototype.addPanel = function() {
		if(!this.debug) return;

		this.panel = new PIXI.BitmapText(this._getDebugText(), {font: "20px FredokaOne-Regular"});
		this.displayObject.addChild(this.panel);
	};

	Drag.prototype.updateDebug = function(){
		if(!this.debug) return;

		this.panel.setText(this._getDebugText());
	};

	Drag.prototype._getDebugText = function(){
		return '[' + this.displayObject.position.x + ', ' + this.displayObject.position.y + ']';
	};

	Util.Drag = Drag;
})(window.Util = window.Util || {});