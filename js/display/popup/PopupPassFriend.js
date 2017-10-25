'use strict';

(function(exports){

function PopupPassFriend(myScore, opponent, game, isLeader){
	Util.Popup.call(this);

	this.myScore = myScore;
	this.opponent = opponent;
	this.game = game;
	this.isLeader = isLeader;
};

PopupPassFriend.constructor = PopupPassFriend;
PopupPassFriend.prototype = Object.create(Util.Popup.prototype);

PopupPassFriend.prototype.create = function(){

	var container = PIXI.Sprite.fromFrame('levvel_bg_green');

	var title = (this.isLeader) ? _('champion_battu') : _ts('ami_battu');
	var titleBmp = new PIXI.BitmapText(title, {
		font: "25px FredokaOne-Regular"
	});

	titleBmp.position.x = container.width/2 - titleBmp.width/2;

	container.addChild(titleBmp);

	var middle = new PIXI.DisplayObjectContainer();

	if(me.fbId) {
		var url = "https://graph.facebook.com/" + me.fbId + "/picture?width=75&height=75";
	} else {
		var exportCDN = Util.Url.getPlatformCDN();
		var url = exportCDN.baseUri + "resources/undefined_profil.png";
	}

	var myPic = PIXI.Sprite.fromImage(url);



	container.addChild(middle)





	this.addChild(container);


	this.filter.interactive = true;
	this.filter.touchstart = this.filter.mousedown = this.close.bind(this);



};


exports.PopupPassFriend = PopupPassFriend;

})(window.UI = window.UI || {});


