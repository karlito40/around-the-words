'use strict';
(function(namespace){

function Button(texture) {
	PIXI.Sprite.call(this, texture);

	this.isButton = true;
	this.buttonMode = true;
	this.interactive = true;
	this.touchstart = this.mousedown = this.hitHandler.bind(this);
	this.anchor.x = this.anchor.y = 0.5;
	this.oriScale = null;
	this.tween = null;
};

Button.prototype.constructor = Button;
Button.prototype = Object.create(PIXI.Sprite.prototype);

Button.prototype.hitHandler = function() {
	this.anim();
	Util.Sound.fxPlay('fx/clic_bouton');

	if(this.onHit) this.onHit();
};

Button.prototype.anim = function(){
	if(!this.oriScale){
		this.oriScale = {
			x: this.scale.x,
			y: this.scale.y
		}
	}

	this.scale.x += 0.3;
	this.scale.y += 0.3;

	if(this.tween) this.tween.kill();

	this.tween = TweenMax.to(this.scale, 0.4, {x: this.oriScale.x, y: this.oriScale.y, ease: Elastic.easeOut});
};





namespace.Button = Button;

})(window.UI = window.UI || {});