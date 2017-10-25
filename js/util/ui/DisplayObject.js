'use strict';
(function(namespace){

var DisplayObject = {};

DisplayObject.center = function(target, displayObject) {
	this.centerX(target.width, displayObject);
	this.centerY(target.height, displayObject);
};

DisplayObject.centerX = function(targetWidth, displayObject) {
	displayObject.position.x = ~~(targetWidth/2 - displayObject.width/2);

	if(typeof displayObject.anchor == "undefined") return;
	displayObject.position.x += ~~(displayObject.width * displayObject.anchor.x);
};

DisplayObject.centerY = function(targetHeight, displayObject) {
	displayObject.position.y = ~~(targetHeight/2 - displayObject.height/2);

	if(typeof displayObject.anchor == "undefined") return;
	displayObject.position.y += ~~(displayObject.height * displayObject.anchor.y);
};

DisplayObject.sprite = function(frame) {
	return new PIXI.Sprite(PIXI.Texture.fromFrame(frame));
};

DisplayObject.button = function(frame) {
	var texture = PIXI.Texture.fromFrame(frame);
	return new UI.Button(texture);
};

DisplayObject.buttonColor = function(text, theme, cf) {
	var group = new PIXI.DisplayObjectContainer();

	var leftSide = PIXI.Sprite.fromFrame('button_'+theme+'_left');
	group.addChild(leftSide);

	var s = new PIXI.BitmapText(text, {font: "20px FredokaOne-Regular"});
	s = Util.DisplayText.shadow(s, 2, 0, 0x0d0d0d, 0.3);

	if(cf && cf.pearlIco) {
		var pearl = PIXI.Sprite.fromFrame('app_pearl');
		pearl.scale.x = pearl.scale.y = 0.5;
		pearl.position.x = s.width +5;
		pearl.position.y = -7;
		s.addChild(pearl);

		s.position.y = 5;

	}

	group.strText = s;

	var texture = PIXI.Texture.fromFrame('button_'+theme+'_repeat');
	var center = new PIXI.TilingSprite(texture, 1, leftSide.height);

	center.position.x = leftSide.position.x + leftSide.width-1;
	center.width = s.width + 3;
	s.position.x = 1;
	s.position.y += center.height/2 - s.height/2;
	center.addChild(s);

	group.addChild(center);

	var rightSide = PIXI.Sprite.fromFrame('button_'+theme+'_right');
	rightSide.position.x = center.position.x + center.width -1;
	group.addChild(rightSide);


	group.hitArea = new PIXI.Rectangle(0, 0, group.width, group.height);

	group.interactive = true;
	group.buttonMode = true;
	group.touchstart = group.mousedown = function(){
		group.rotation = Util.Math2.degToRad(-15);

		TweenMax.to(group, 0.4, {rotation: 0, ease: Elastic.easeOut});
		Util.Sound.fxPlay('fx/clic_bouton');

		if(group.onHit) group.onHit();
	}

	return group;
};


DisplayObject.buttonGreen = function(text, cf){
	return this.buttonColor(text, 'green', cf);

};

DisplayObject.buttonBlue = function(text, cf) {
	return this.buttonColor(text, 'blue', cf);
};

DisplayObject.xMax = function(displayObject){
	return displayObject.width + displayObject.position.x;
};

DisplayObject.circleProfil = function(fbId) {
	var width = 75, height = 75, container = new PIXI.DisplayObjectContainer();

	var profilPic = PIXI.Sprite.fromImage('https://graph.facebook.com/'+fbId+'/picture?width=' + width + '&height=' + height, true);
	// var profilPic = PIXI.Sprite.fromImage('https://graph.facebook.com/100/picture?width=' + width + '&height=' + height, true);
	var mask = new PIXI.Graphics();
	mask.beginFill(0x000000);
	mask.drawCircle(~~(width/2), ~~(height/2), ~~(width/2));
	mask.endFill();

	container.addChild(profilPic);
	container.addChild(mask);

	profilPic.mask = mask;

	return container;
};


DisplayObject.roundedRectProfil = function(fbId) {
	var width = 75, height = 75, container = new PIXI.DisplayObjectContainer();

	var profilPic = PIXI.Sprite.fromImage('https://graph.facebook.com/'+fbId+'/picture?width=' + width + '&height=' + height, true);
	var mask = new PIXI.Graphics();
	mask.beginFill(0x000000);
	mask.drawRoundedRect(0, 0, width, height, 15);
	mask.endFill();

	container.addChild(profilPic);
	container.addChild(mask);

	profilPic.mask = mask;

	return container;
};





namespace.DisplayObject = DisplayObject;


})(window.Util = window.Util || {});

