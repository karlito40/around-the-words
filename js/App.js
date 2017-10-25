(function(exports){
exports.App = {
	player: null,
	// dataManager: new Api.DataManager(false),
	dataManager: new Api.DataManager(typeof dt != "undefined"),
	notifQueue: [],


	initPlayer: function(data)
	{
		var self = this;
		var user = new Model.User(data);

		var updateLifeCtx = function()
		{
			if(!Scene.BaseScene.current) return;
			var scene = Scene.BaseScene.current
				, timeLeft = scene.view.getElementById('timeLeft')
				, headerLifeText = scene.view.getElementById('headerLifeText')
				, moreHeart = scene.view.getElementById('moreHeart');

			if(!timeLeft) return;

			var s = (!user.normalSessionIn) ? user.life.toString() : '';
			Util.DisplayText.updateShadowText(headerLifeText, s);

			if(user.normalSessionIn)
			{
				moreHeart.visible = false;
			}
			else if(user.isFullLife())
			{
				timeLeft.setText(_ts('Plein'));
				moreHeart.visible = false;
			} else {
				moreHeart.visible = true;
			}
		}

		user.onMyUpdate = function(){
			if(self.timerLife)
			{
				self.timerLife.kill();
				self.timerLife = null;
			}


			var scene = Scene.BaseScene.current;
			var refHeart = function(){
				var heartContainer = scene.view.getElementById('heartContainer')
					, headerContainer = scene.view.getElementById('headerContainer');

				if(headerContainer && heartContainer && heartContainer.normalSessionIn != user.normalSessionIn) {
					console.log('yep');
					var oldPosition = heartContainer.position;
					headerContainer.removeChild(heartContainer);
					heartContainer = Partial.heart_bar_partial(scene.view);
					heartContainer.position = oldPosition;
					headerContainer.addChild(heartContainer);

				}
			}

			if(scene) refHeart();

			if(user.lifeRegenAt || user.normalSessionAt)
			{
				var isSession = user.normalSessionIn;
				self.timerLife = new Util.TimerSec({
					secondes: (isSession) ? user.normalSessionIn : user.lifeRegenIn,

					onMyEnd: function(){
						if(isSession)
						{
							ATW.App.getDataManager().getApi().call('User', 'POST', {
								on: 'me',
								data: {
									immunity: 0
								}
							}, function(res){
								// $('.cLifeBar').removeClass('golden');
								refHeart();
								user.myUpdate(res);
							});

						}
						else
						{

							user.life++;

							ATW.App.getDataManager().getApi().call('User', 'POST', {
								on: 'me',
								data: {
									life: user.life,
									lifeRegenAt: 0
								}
							}, function(res){
								user.myUpdate(res);
							});
						}
					},

					onMyUpdate: function(t){
						if(!Scene.BaseScene.current) return;

						var scene = Scene.BaseScene.current;
						if(!scene.view) return;

						var timeLeft = scene.view.getElementById('timeLeft');

						if(!timeLeft) return;

						var o = t.getCurrent()
							, s = '';

						if(o.hour) s += o.hour + ':';
						s += o.min + ':' + o.sec;

						timeLeft.setText(s);



					}
				});

				self.timerLife.myGo();
			}

			updateLifeCtx();
		}

		user.onMyUpdate();



		user.getAchievementManager().onComplete = function(achievement)
		{
			self.addNotification(null, achievement.getDescription());
			self.refreshAwardNotif();

			ATW.App.getDataManager().getApi().call('Notif', 'POST', {
				on: user.fbId,
				data: {
					message: 'ach:' + achievement.getNameId(),
					type: 'MESSAGE'
				}
			}, function(res){
				if(!res.request) return;

				user.getMessenger()
					.addSVRequest(res.request);

				ATW.App.refreshMessenger();
			});

		}

		this.setPlayer(user);
	},

	refreshPearl: function()
	{
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;


		var pearlText = view.getElementById('headerPearlText')
		if(!pearlText) return;
		pearlText.setText(ATW.App.getPlayer().getPearls().toString());
		pearlText.updateText();
		pearlText.position.x = pearlText.rightOri - pearlText.width;
	},

	instaShop: function(price, toBuy, onAllow, onRes, discountId, onDisallow)
	{

		if(this.player.getPearls() >= price)
		{
			var addPearl = (toBuy && toBuy.u && toBuy.u.pearls) ? toBuy.u.pearls : 0;
			this.player.incrPearls(addPearl-price);

			var o = Util.Object.merge({
				u: {
					pearls: this.player.getPearls()
				}
			}, toBuy);

			this.player.myUpdate(o);

			this.dataManager.getApi().call('Shop', 'POST', {
				on: 'me',
				data: o
			}, onRes);

			if(Scene.BaseScene.current) {
				Scene.BaseScene.current.updatePearlText();
			}

			if(onAllow) onAllow();
		}
		else
		{
			if(onDisallow) onDisallow();
			if(Util.Popup.current) Util.Popup.current.close();

			// alert('!! ~~ [Insert Popup Store Here] ~~ !! Please be kind °_°');
			// var s = new ShopPopup(ConfigShopCat.findByKey('PEARL').id);
			var s = new UI.PopupShop(Util.ShopCat.findByKey('PEARL'));
			s.open();
		}
	},


	refreshAwardNotif: function(){
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;


		var containerNumber = view.getElementById('nbAchievementContainer')
		if(!containerNumber) return;

		var nbGiftLeft = ATW.App.getPlayer().getAchievementManager().getNbGiftLeft();
		containerNumber.updateNb(nbGiftLeft);
	},


	refreshMessenger: function()
	{
		console.log('App::refreshMessenger');
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;

		var containerNumber = view.getElementById('nbNotifContainer')
		if(!containerNumber) return;

		var nb = ATW.App.getPlayer().getMessenger().total();
		containerNumber.updateNb(nb);

	},


	addNotification: function(img, txt){
		var self = this;
		this.notifQueue.push(function(){

			var notif = new PIXI.DisplayObjectContainer();
			var bg = new PIXI.Graphics();
			bg.beginFill(0x000000, 0.7)
				.drawRoundedRect(0, 0, 500, 45, 10)
				.endFill();

			var cup = PIXI.Sprite.fromFrame('gold_cup');
			cup.scale.x = cup.scale.y = 0.45;
			cup.position.x = 10;
			cup.position.y = 9;

			var textBmp = new PIXI.BitmapText(txt, {font: '22px FredokaOne-Regular'});
			textBmp = Util.DisplayText.shadow(textBmp, 3, 1, 0xff9c0e, 0.8);
			textBmp.position.x = cup.width + cup.position.x + 18;
			textBmp.position.y = bg.height/2 - textBmp.height/2 - 2;

			var chk = PIXI.Sprite.fromFrame('ig_chk_valid');
			chk.position.x = bg.width - chk.width - 15;
			chk.position.y = 10;

			notif.addChild(bg);
			notif.addChild(cup);
			notif.addChild(textBmp);
			notif.addChild(chk);

			notif.interactive = true;
			notif.touchstart = notif.mousedown = function(){
				if(notif.done) return;
				notif.done = true;
				if(self.tlNotif)
				{
					self.tlNotif.clear();
					self.tlNotif = null;
				}

				TweenLite.to(notif, 0.3, {alpha: 0, onComplete: function(){
					ATW.stage.removeChild(notif);
					self._launchNotification();
				}})
			};

			notif.position.x = ATW.gameMidWidth() - notif.width/2;
			notif.position.y = 40;

			notif.alpha = 0;
			notif.scale.x = notif.scale.y = 0;

			ATW.stage.addChild(notif);

			self.tlNotif = new TimelineMax();
			self.tlNotif.to(notif, 0.15, {alpha:1}, 'start');
			self.tlNotif.to(notif.scale, 0.15, {x:1, y:1}, 'start');
			self.tlNotif.to(notif, 0.4, {alpha:0}, '+=1.7');
			self.tlNotif.call(function(){
				if(notif.done) return;

				notif.done = true;
				self.tlNotif = null;
				ATW.stage.removeChild(notif);
				self._launchNotification();
			});

			Util.Sound.fxPlay('fx/achievement');

		});

		if(this.notifQueue.length == 1 && !self.tlNotif) this._launchNotification();

	},


	_launchNotification: function()
	{
		if(!this.notifQueue.length) return;

		var f = this.notifQueue.pop();
		f();

	},

	setPlayer: function(player) { this.player = player; },
	getDataManager: function() { return this.dataManager; },
	getPlayer: function() { return this.player; },
	hasPlayer: function() { return this.getPlayer(); }
};



})(window.ATW = window.ATW || {});