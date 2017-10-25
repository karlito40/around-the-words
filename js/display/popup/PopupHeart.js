'use strict';

(function(exports){

function PopupHeart() { Util.Popup.call(this) };


PopupHeart.constructor = PopupHeart;
PopupHeart.prototype = Object.create(Util.Popup.prototype);

PopupHeart.prototype.create = function() {
	var player = ATW.App.getPlayer()
		, needLove = !player.life;

	var bg = PIXI.Sprite.fromFrame('pink_radius');
	bg.scale.x = bg.scale.y = 1.1;
	bg.position.x = ATW.gameMidWidth() - ~~(bg.width/2);
	bg.position.y = ATW.gameMidHeight() - ~~(bg.height/2);
	this.addChild(bg);

	this.closeBtn = Util.DisplayObject.button('popup_cross_exit');
	this.closeBtn.scale.x = this.closeBtn.scale.y = 1.2;
	this.closeBtn.position.x = bg.position.x + bg.width - 4;
	this.closeBtn.position.y = bg.position.y + 5;

	this.addChild(this.closeBtn);

	var insider = new PIXI.DisplayObjectContainer();


	var s = (needLove) ? _ts('manque_amour') : _ts('obtenez_coeur');
	var titleBmp = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
	titleBmp.position.x = bg.width/2 - titleBmp.width/2;
	titleBmp.position.y = 20;

	insider.addChild(titleBmp);

	var space = 55;
	if(!needLove) {
		// var tipsBmp = new PIXI.BitmapText(_ts('demander_coeur_supplementaire'), {font: "20px FredokaOne-Regular"});
		var tipsBmp = Util.DisplayText.wrap(_ts('demander_coeur_supplementaire'), {
			font: "22px FredokaOne-Regular",
			letterMax: 45,
			align: "center",
			maxWidth: bg.width - 10,
			lineHeight: 22
		});
		tipsBmp.position.y = insider.height + 45;
		// tipsBmp.position.x = bg.width/2 - tipsBmp.width/2;

		insider.addChild(tipsBmp);
		space = 35;
	}


	if(Api.FBManager.isActive()) {
		var askFriend = Util.DisplayObject.buttonBlue(_ts('demander_a_vos_amis'));
		askFriend.scale.x = askFriend.scale.y = 1.15;
		askFriend.position.x = bg.width/2 - askFriend.width/2;
		askFriend.position.y = insider.height + space;

		insider.addChild(askFriend);

		askFriend.onHit = this.askFriendHandler.bind(this);

	} else {
		var unallowBmp = new PIXI.BitmapText("Indisponible", {font: "25px FredokaOne-Regular"});
		unallowBmp.position.y = insider.height + space;
		unallowBmp.position.x = bg.width/2 - unallowBmp.width/2;
		insider.addChild(unallowBmp);
	}


	var bigHeart = PIXI.Sprite.fromFrame('app_big_hearth');
	bigHeart.scale.x = bigHeart.scale.y = 1.2;
	bigHeart.position.x = bg.width/2 - bigHeart.width/2;
	bigHeart.position.y = insider.height + space;
	insider.addChild(bigHeart);

	var orBmp = new PIXI.BitmapText(_ts('Ou').toUpperCase(), {font: "35px FredokaOne-Regular"});
	orBmp.position.y = insider.height + 30;
	orBmp.position.x = bg.width/2 - orBmp.width/2;
	insider.addChild(orBmp);

	var s2 = (needLove)
				? _ts('refaire_plein_coeur')
				: _ts('obtenir_coeur_illimites_n_canvas', {':x': (ATW.Datas.CONFIGS.GEN_GAME_INFINITE_SESSION_SEC/60/60)});

	var shopTipBmp = Util.DisplayText.wrap(s2, {
		font: "21px FredokaOne-Regular",
		letterMax: 40,
		align: "center",
		maxWidth: bg.width - 30,
		lineHeight: 22
	});
	shopTipBmp.position.y = insider.height + 40;
	shopTipBmp.position.x = 20;
	insider.addChild(shopTipBmp);

	var product = Util.Shop.findProductByKey('NEED_LOVE');
	var nb = product.price;
	if(!needLove) {
		product = Util.Shop.findProductByKey('UNLIMITED_SESSION');
		nb = product.price;
	}

	var shopBtn = Util.DisplayObject.buttonGreen(nb.toString(), {
		pearlIco: true
	});
	shopBtn.scale.x = shopBtn.scale.y = 1.2;
	shopBtn.position.x = bg.width/2 - shopBtn.width/2;
	shopBtn.position.y = insider.height + 40;
	insider.addChild(shopBtn);

	insider.position = bg.position;


	this.addChild(insider);

	// this.interactive = true;
	// this.touchstart = this.mousedown = function toto(){}

	// bg.interactive = true;
	// bg.touchstart = bg.mousedown = function toto(){}


	shopBtn.onHit = this.shopBtnHandler.bind(this);
};


PopupHeart.prototype.askFriendHandler = function()
{
	console.log('PopupHeart::askFriendHandler');

	if(!Api.FBManager.isActive()) return;

	var player = ATW.App.getPlayer();

	var handleResponse = function(response){
		if(response.to) {
			var to =response.to, nb = to.length;
			for(var i=0; i<nb; i++) {
				EXCLUDE_HEARTS.push(to[i]);
			}
		}


		ATW.App.getDataManager().getApi().call('Social', 'POST', {
			on: 'ASK_HEART',
			data: {
				ids: to
			}
		}, function(response){

		});


	};

	if(FB_NAMESPACE == 'aroundthewords')	// Comportement normal
	{

		var objectId = '1399895963634003';

		Api.FBManager.ui({
			method: 'apprequests',
			message: _ts('demande_coeur', {
				':user':player.firstName
			}),
			data: {
				type: 'HEART',
				receiver:player.fbId
			},
			action_type: 'askfor',
			object_id: objectId,
			exclude_ids: EXCLUDE_HEARTS
	    }, handleResponse);

	}
	else
	{
		Api.FBManager.ui({
			method: 'apprequests',
			message: 'Coeur debug.',
			data: {
				type: 'HEART',
				receiver:player.fbId
			},
			exclude_ids: EXCLUDE_HEARTS
	    }, handleResponse);

	};


};

PopupHeart.prototype.shopBtnHandler = function()
{
	console.log('PopupHeart::shopBtnHandler');

	var player = ATW.App.getPlayer()
		, self = this
		, needLove = !player.life
		, shopHelper = Util.Shop;

	if(needLove) {
		console.log('we need love');
		var product = shopHelper.findProductByKey('NEED_LOVE');

		shopHelper.instaShop(product, function(){}, function(res){
			player.myUpdate(res);
			self.close();
		});


	} else {
		console.log('we need an unlimited session');
		var product = shopHelper.findProductByKey('UNLIMITED_SESSION');
		shopHelper.instaShop(product, function(){
			// $('.cLifeBar').addClass('golden');
		}, function(res){
			player.myUpdate(res);
			self.close();
		});
	}



};



exports.PopupHeart = PopupHeart;

})(window.UI = window.UI || {});