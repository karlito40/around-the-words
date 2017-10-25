'use strict';

(function(exports){
exports.Shop = {

	_cacheByKey: null,
	loadingContainer: null,

	findProductByKey: function(key) {
		if(!this._cacheByKey) {
			this._cacheByKey = {};

			var shops = ATW.Datas.SHOPS;
			for(var catID in shops){
				var groupProduct = shops[catID];

				for(var productId in groupProduct) {
					var product = groupProduct[productId];

					if(!product.key) continue;
					this._cacheByKey[product.key] = product;

				}

			}

		}

		return this._cacheByKey[key];

	},

	findMobileProducts: function(os)
	{
		var productList = [];
		var shops = ATW.Datas.SHOPS;
		for(var catID in shops){
			var groupProduct = shops[catID];

			for(var productId in groupProduct) {
				var product = groupProduct[productId];
				if(product[os]) {
					productList.push(product[os]);
				}

			}

		}


		return productList;
	},


	instaShop: function(cProduct, onAllow, onRes, onDisallow, onCancel)
	{
		var self = this
			, cSeller = ATW.Datas.SELLERS[cProduct.seller_id]
			, player = ATW.App.getPlayer()
			, toBuy = {
				u: {}
			};

		if(cProduct.bonus)
		{

			toBuy.u.bonusMap = {};
			var prodBonusContent = cProduct.bonus.content;
			for(var i in prodBonusContent)
			{
				var val = prodBonusContent[i];
				var qty = Util.Math2.castInt(val.qty);

				if(player.hasBonus(val.bonus_id))
				{
					qty += player.getBonus(val.bonus_id).getQuantity();
				}

				toBuy.u.bonusMap[val.bonus_id] = {
					quantity: qty,
					id: val.bonus_id
				};


			}
		}
		else if(cProduct.pearl)
		{
			toBuy.u.pearls = cProduct.pearl;
		}
		else if(cProduct.key == 'UNLIMITED_SESSION')
		{
			toBuy.u.immunity = 1;
		}
		else if(cProduct.key == 'NEED_LOVE')
		{
			toBuy.u.life = 5;
		}
		else if(cProduct.key == 'FRIEND_BASE')
		{
			toBuy.friend = {
				worldId: cProduct.worldId
			};
		}
		else if(cProduct.key.slice(0, 5) == 'BONUS')
		{
			var cBonus = Util.Bonus.findByKey(cProduct.key);
			var nextQty = (player.getBonus(cBonus.id)) ? player.getBonus(cBonus.id).getQuantity()+1 : 1;

			toBuy.b = {
				id: cBonus.id,
				quantity: nextQty
			};
		}
		else if(cProduct.key == 'LEVEL')
		{
			toBuy.level = {
				world_id: cProduct.worldId,
				level_id: cProduct.levelId,
				first_name: player.getFirstName(),
				bought: true
			}
		}
		else
		{
			throw new Error('There is nothing to buy');
		}

		var discountId = cProduct.disc_id;
		var discountAvailable = (discountId && DISC[discountId]) ? 1 : 0;

		if(cSeller.key == 'APP')
		{
			toBuy.productId = cProduct.id;
			toBuy.price = cProduct.price;
			ATW.App.instaShop(cProduct.price, toBuy, onAllow, onRes, discountId, onDisallow);
			return cSeller.key;
		}
		else if(cSeller.key == 'FB')
		{
			this.createLoadingContainer();

			if(typeof Cocoon != "undefined") {
				Mobile.Store.purchase(cProduct, {
					success: function(productId) {
						var player = ATW.App.getPlayer();
						player.incrPearls(cProduct.pearl);
						ATW.App.refreshPearl();
						self.deleteLoadingContainer();

						ATW.App.getDataManager().getApi().call('User', 'POST', {
							on: 'me',
							data: {
								pearls: player.pearls
							}
						}, function(res){});

						if(onRes) onRes();

					},
					error: function(productId, message){
						self.handlePurchaseError(message);
					}
				});
			} else {

				var graph = WEB_URI + 'facebook.php?action=graph&type=product&shId=' + cProduct.id + '&fromDiscount=' + discountAvailable + '&myLocale='+ATW.App.getPlayer().getLocale();

				var self = this;

				if( !Api.FBManager.ui({
						method: 'pay',
						action: 'purchaseitem',
						product: graph
				    },
					function (data) {


						if(!data || data.error_code) {
							self.handlePurchaseError('Purchase cancel');

							if(onCancel) onCancel();
							return;
						}


						if(onAllow) onAllow();


						if(data.payment_id) {
							self.checkPayment(data.payment_id, onRes);
						}

					})
				) {
					return false;
				}
			}


			return cSeller.key;

		}
		else
		{
			throw new Error('seller '+seller.key+' need to be implemented');
		}
	},


	checkPayment: function(requestId, onRes)
	{


		var self = this;
		setTimeout(function(){
			ATW.App.getDataManager().getApi().call('User', 'GET', {
				on: 'payment',
				data: {
					requestId: requestId
				}
			}, function(response) {
				if(!response.status || response.status != 'completed'){
					self.checkPayment(requestId, onRes);
					return;
				}

				self.deleteLoadingContainer();

				if(onRes) onRes(response);

				ATW.App.getPlayer().myUpdate(response);
				ATW.App.refreshPearl();

			});
		}, 600);
	},



    createLoadingContainer: function(){
        this.loadingContainer = new PIXI.DisplayObjectContainer();

		var blackScreen = new PIXI.Graphics();
		blackScreen.beginFill(0x000000);
		blackScreen.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight());
		blackScreen.endFill();
		blackScreen.hitArea = new PIXI.Rectangle(0, 0, ATW.gameWidth(), ATW.gameHeight());
		blackScreen.alpha = 0.7;


		this.loadingContainer.addChild(blackScreen);

		var centerTextBmp = new PIXI.BitmapText(_ts('Chargement') + "...", {
			font: "40px FredokaOne-Regular"
		});

		centerTextBmp.position.x = ~~(ATW.gameMidWidth() - centerTextBmp.width/2);
		centerTextBmp.position.y = ~~(ATW.gameMidHeight() - centerTextBmp.height/2);

		this.loadingContainer.addChild(centerTextBmp);

		this.loadingContainer.centerTextBmp = centerTextBmp;
		this.loadingContainer.blackScreen = blackScreen;

        ATW.stage.addChild(this.loadingContainer);

    },

    deleteLoadingContainer: function(){
        if(!this.loadingContainer) return;
        ATW.stage.removeChild(this.loadingContainer);
        this.loadingContainer = null;
    },

    handlePurchaseError: function(message) {
    	if(!this.loadingContainer) return;

		var centerTextBmp = this.loadingContainer.centerTextBmp;
		centerTextBmp.setText(message);
		centerTextBmp.updateText();

		centerTextBmp.position.x = ~~(ATW.gameMidWidth() - centerTextBmp.width/2);
		centerTextBmp.position.y = ~~(ATW.gameMidHeight() - centerTextBmp.height/2);


		var blackScreen = this.loadingContainer.blackScreen;
		blackScreen.interactive = true;
		blackScreen.mousedown = blackScreen.touchstart = this.deleteLoadingContainer.bind(this);

		setTimeout(this.deleteLoadingContainer.bind(this), 2000);



    }


};

})(window.Util = window.Util || {});