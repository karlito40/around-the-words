'use strict';

(function(exports){

function PopupShop(goCat)
{
	Util.Popup.call(this);
	this.goCat = goCat;

};

PopupShop.constructor = PopupShop;
PopupShop.prototype = Object.create(Util.Popup.prototype);

PopupShop.prototype.create = function()
{

	var self = this
		, player = ATW.App.getPlayer();

	if(!this.goCat) this.categories();
	else this.section(this.goCat);


	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);

};

PopupShop.prototype.createTitle = function(txt, color, shadow) {
	var titleBmp = new PIXI.BitmapText(txt, {font: "45px FredokaOne-Regular", tint:color});
	titleBmp = Util.DisplayText.shadow(titleBmp, 6, 0, shadow, 0.9);
	titleBmp.position.x = ATW.gameMidWidth() - titleBmp.width/2;
	titleBmp.position.y = 100;

	return titleBmp;
};

PopupShop.prototype.categories = function()
{
	var self = this;
	this.cleanPage();

	this.currentPage = new PIXI.DisplayObjectContainer();

	var titleBmp = this.createTitle(_ts('Boutique'), 0xdd6ee8, 0x8840aa)
	this.currentPage.addChild(titleBmp);

	var catContainer = new PIXI.DisplayObjectContainer();
	var shopCats = ATW.Datas.SHOPCATS;
	var x = 0;
	for(var scID in shopCats){
		var shCat = shopCats[scID];

		if(!parseInt(shCat.invisible, 10)) continue;

		var colorTheme = (shCat.key == 'PEARL') ? 'green' : 'blue';

		var container = this.createBloc(colorTheme);

		var catIco = PIXI.Sprite.fromFrame('sh-cat-'+shCat.id);
		catIco.position.x = container.width/2 - catIco.width/2;
		if(shCat.key == 'PEARL') {
			catIco.position.x -= 3;
		}

		catIco.position.y = container.height/2 - catIco.height/2;

		container.addChild(catIco);

		var ribbon = this.createRibbon(colorTheme, _2(shCat.name));
		ribbon.position.x = -2;
		ribbon.position.y = 180;
		container.addChild(ribbon);

		container.position.x = x;

		container.buttonMode = true;
		container.interactive = true;
		container.mousedown = container.touchstart = function(shCat){
			return function() {self.section(shCat)}
		}(shCat)

		catContainer.addChild(container);


		x = container.width + container.position.x + 20;
	}

	catContainer.position.x = ATW.gameMidWidth() - catContainer.width/2;
	catContainer.position.y = ATW.gameMidHeight() - catContainer.height/2;
	this.currentPage.addChild(catContainer);

	this.addChild(this.currentPage);


};

PopupShop.prototype.section = function(shCat) {

	var self = this,
		 targetShops = ATW.Datas.SHOPS[shCat.id],
		 player = ATW.App.getPlayer();

	if(!targetShops) return;

	this.cleanPage();

	var colorTheme = (shCat.key == 'PEARL') ? 'green' : 'blue';


	this.currentPage = new PIXI.DisplayObjectContainer();

	if(shCat.key == 'PEARL') {
		var color = 0x65d5b9
			, shadow = 0x318071;
	} else {
		var color = 0x1ad0f0
			, shadow = 0x0fa3d9;
	}

	var titleBmp = this.createTitle(_2(shCat.name), color, shadow);
	this.currentPage.addChild(titleBmp);

	var cfsBonus = ATW.Datas.BONUS;
	var productsContainer = new PIXI.DisplayObjectContainer();

	var x = 0, y =0, nbInline = 0;
	for(var key in targetShops) {
		var product = targetShops[key]
			, headerHeight = 43;


		var isBuyable = true;
		if(product.bonus) {
			for(var j in product.bonus.content) {
				var cf = product.bonus.content[j];
				if(!cf.bonus_id) continue;

				var cBonus = cfsBonus[cf.bonus_id];
				if(cBonus.tuto_key && !player.isTutoFisnish(cBonus.tuto_key)) {
					isBuyable = false;
					break;
				}
			}
		}


		var container = this.createBloc(colorTheme);

		var header = new PIXI.Graphics();
		header.beginFill(0x63cabb)
			.drawRoundedRect(0, 0, container.width-12, headerHeight, 20)
			.endFill();
		header.position.x = 5;
		header.position.y = 5;

		var nameBmp = new PIXI.BitmapText( _2(product.name), {font: "22px FredokaOne-Regular"});
		nameBmp = Util.DisplayText.shadow(nameBmp, 2, 0, shadow);
		nameBmp.position.x = 7;
		nameBmp.position.y = 10;
		header.addChild(nameBmp);

		container.addChild(header);

		var icoProduct = PIXI.Sprite.fromFrame('sh-' + product.id);
		icoProduct.position.x = container.width/2 - icoProduct.width/2;
		icoProduct.position.y = container.height/2 - icoProduct.height/2 + 20;
		container.addChild(icoProduct);

		if(product.pearl) {
			var qtyContainer = new PIXI.DisplayObjectContainer()
				, pearlSprite = PIXI.Sprite.fromFrame('app_pearl');

			pearlSprite.scale.x = pearlSprite.scale.y = 0.55;

			qtyContainer.addChild(pearlSprite);

			var qtyBmp = new PIXI.BitmapText(product.pearl.toString(), {font: "22px FredokaOne-Regular"});
			qtyBmp = Util.DisplayText.shadow(qtyBmp, 2, 0, shadow);

			qtyBmp.position.x = pearlSprite.position.x + pearlSprite.width + 5;
			qtyBmp.position.y = 5;

			qtyContainer.addChild(qtyBmp);

			qtyContainer.position.y = header.position.y + header.height + 3;
			qtyContainer.position.x = container.width/2 - qtyContainer.width/2;

			container.addChild(qtyContainer);
		}


		var sellerKey = ATW.Datas.SELLERS[shCat.seller_id].key
			, moneyIco = (sellerKey == 'FB') ? '€' : ''
			, price = product.price

		var cfButton = {};
		if(!product.pearl) {
			cfButton.pearlIco = true;
		}
		var btnShop = Util.DisplayObject.buttonGreen(price + moneyIco, cfButton);

		if(isBuyable) {
			btnShop.onHit = function(product) {
				return function() { self.buy(product); }
			}(product)

			btnShop.position.y = container.height - btnShop.height/2 - 8;
			btnShop.position.x = container.width/2 - btnShop.width/2;

			container.addChild(btnShop);
		} else {
			var graphFilter = new PIXI.Graphics();
			graphFilter.beginFill(0x000000, 0.7)
				.drawRoundedRect(0,0, container.width, container.height, 30)
				.endFill()

			container.addChild(graphFilter);
		}

		container.position.x = x;

		if(container.position.x + container.width> ATW.gameWidth()|| nbInline >=3) {
			container.position.x = 0;
			y = productsContainer.height + 15;
			nbInline = 0;

		}
		nbInline++;

		container.position.y = y;
		productsContainer.addChild(container);

		x = container.position.x + container.width + 15;

	}

	productsContainer.position.x = ATW.gameMidWidth() - productsContainer.width/2;
	productsContainer.position.y = ATW.gameMidHeight() - productsContainer.height/2;

	var dist = productsContainer.position.y -  (titleBmp.position.y + titleBmp.height);
	if(dist < 30) productsContainer.position.y += 30 - dist;

	this.currentPage.addChild(productsContainer);

	this.addChild(this.currentPage);

};

PopupShop.prototype.buy = function(product) {
	if(this.isBuying) return;

	this.isBuying = true;

	var self = this;

	var seller = Util.Shop.instaShop(product, function(){
		self.addLoading();

	}, function(res){
		setTimeout(function(){
			self.removeLoading();
			self.isBuying = false;
			self.animReward(product);

		}, 600);
	}, function(){
		// self.acceptShopping();
	}, function(){
		self.isBuying = false;
		self.removeLoading();
		// self.$node.find('.bubblingG').remove();
		// self.close();
	});

	if(!seller) this.isBuying = false;
};

PopupShop.prototype.animReward = function(product)
{
	var self = this;

	this.isAnim = true;

	var rewardAnimator = new PIXI.DisplayObjectContainer();

	if(product.bonus)
	{
		var x = 0;
		for(var bID in product.bonus.content)
		{
			var sprite = PIXI.Sprite.fromFrame('bonus-' + bID);
			sprite.position.x = x;
			x = sprite.width + sprite.position.x + 15;
			rewardAnimator.addChild(sprite);
		}
	}
	else if(product.pearl)
	{
		var sprite = PIXI.Sprite.fromFrame('app_pearl');
		rewardAnimator.addChild(sprite);

	}

	rewardAnimator.position.y = ATW.gameMidHeight() - rewardAnimator.height/2;
	rewardAnimator.position.x = ATW.gameMidWidth() - rewardAnimator.width/2;
	rewardAnimator.scale.x = rewardAnimator.scale.y = 0;
	this.addChild(rewardAnimator);

	var tl = new TimelineMax();

	tl.to(this.currentPage, 0.4, {alpha: 0});
	tl.to(rewardAnimator, 0.4, {alpha: 1}, 'start');
	tl.to(rewardAnimator.scale, 0.4, {x: 1, y: 1}, 'start');
	tl.from(rewardAnimator.position, 0.8, {y: '+=80', ease: Power2.easeOut}, 'start');
	tl.to(rewardAnimator, 1.2, {rotation: Util.Math2.degToRad(-360), ease: Power2.easeIn}, 'start+=1.3');
	tl.to(rewardAnimator.scale, 1.2, {x:5, y:5, ease: Power2.easeIn}, 'start+=1.3');
	tl.to(rewardAnimator, 0.5, {alpha:0}, '-=0.5');

	tl.call(function(){
		self.isAnim = false;
		self.removeChild(rewardAnimator);
		TweenMax.to(self.currentPage, 0.5, {alpha: 1});
	});
};


PopupShop.prototype.addLoading = function()
{
	this.removeLoading();

	this.loading = new PIXI.DisplayObjectContainer();
	var bg = new PIXI.Graphics();
	bg.beginFill(0x000000, 0.5)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.loading.addChild(bg);

	var textBmp = new PIXI.BitmapText('Loading...', {font: "40px FredokaOne-Regular"});
	textBmp.position.x = ATW.gameMidWidth() - textBmp.width/2;
	textBmp.position.y = ATW.gameMidHeight() - textBmp.height/2;
	this.loading.addChild(textBmp);

	this.loading.interactive = true;
	this.loading.touchstart = this.loading.mousedown = function() {}

	this.addChild(this.loading);


};

PopupShop.prototype.removeLoading = function()
{
	if(!this.loading) return;

	this.removeChild(this.loading);
	this.loading = null;
};



PopupShop.prototype.createRibbon = function(theme, txt) {
	var sprite = PIXI.Sprite.fromFrame('sh_ribbon_' + theme);

	var colorTxt = (theme == 'green') ? 0x2b7062 : 0x0c7fa9;

	var txtBmp = new PIXI.BitmapText(txt, {font: "26px FredokaOne-Regular", tint: colorTxt});
	txtBmp.position.x = sprite.width/2 - txtBmp.width/2;
	txtBmp.position.y = 5;
	sprite.addChild(txtBmp)


	return sprite;


};

PopupShop.prototype.createBloc = function(theme){

	var bc = PIXI.Sprite.fromFrame('sh_background_' + theme);

	var container = new PIXI.Graphics();
	container.beginFill(this.getColorStroke(theme))
		.drawRoundedRect(0,0, bc.width +8, bc.height+8, 30)
		.endFill()

	bc.position.x = container.width/2 - bc.width/2;
	bc.position.y = container.height/2 - bc.height/2;
	container.addChild(bc);

	return container;
};

PopupShop.prototype.getColorStroke = function(theme){
	return (theme == 'green') ? 0x2b7062 : 0x0c7fa9;


};

PopupShop.prototype.cleanPage = function()
{
	if(this.currentPage) {
		this.removeChild(this.currentPage);
		this.currentPage = null;
	}
};


exports.PopupShop = PopupShop;

})(window.UI = window.UI || {});