'use strict';
(function(exports){

function WorldScene() {
	this.scaleHighlight = 1.1;
	this.scaleSecondary = 0.8;
	this.leaders = {};
	exports.BaseScene.call(this, 'WorldScene', 'world_scene');

	this.soundTheme = ['menu'];

};

WorldScene.prototype.constructor = WorldScene;
WorldScene.prototype = Object.create(exports.BaseScene.prototype);

WorldScene.prototype.logic = function() {
	var self = this
		, nbWorld = 0
		, worldDatas = ATW.Datas.WORLDS;

	this.currentWorld = 0;
	this.worldsIds = {};
	// Ajoute les evenements sur le monde
	for(var worldId in worldDatas) {
		var world = this.view.getElementById('world_'+nbWorld);
		this.worldsIds[worldId] = nbWorld;

		if(world) this.attachWorldEvent(world);
		nbWorld++;
	}

	// if(ATW.isMobile()) this.mobileBehavior(nbWorld);
	if(true) this.mobileBehavior(nbWorld);
	else this.defaultBehavior(nbWorld);

	var p = new UI.PopupTuto('welcome');
	p.open();

	var player = ATW.App.getPlayer();
	ATW.App.getDataManager().getOnlineApi().call('Score', 'GET', {
		on: 'world_leaders',
			data: {}
		}, function(response){
			console.log('WorldScene::response.leaders', response.leaders);

			if(!response.leaders || !self.open) return;

			self.leaders = response.leaders;
			var cWorlds = ATW.Datas.WORLDS;
			for(var worldId in self.leaders) {
				var leader = self.leaders[worldId];
				if(leader.fbId != player.fbId)
				{
					player.getWorld(cWorlds[worldId])
						.setOpponent(leader);

				}

				// if(!ATW.isMobile()){
				if(false){
					var targetWorld = self.worldsIds[worldId];
					var worldPrefab = self.view.getElementById('world_'+targetWorld);
					self.attachLeader(worldPrefab);
				} else if(self.currentWorldPrefab && self.currentWorldPrefab.worldId == worldId) {
					self.attachLeader(self.currentWorldPrefab);
				}


			}


		}
	);




};

WorldScene.prototype.attachWorldEvent = function(worldPrefab)
{
	var self = this;
	this.attachLeader(worldPrefab);

	worldPrefab.interactive = true;
	worldPrefab.hitArea = new PIXI.Rectangle(-150, -150, 300, 300);

	// if(ATW.isMobile()) {
	if(true) {
		worldPrefab.mousedown = worldPrefab.touchstart = function(){

			var cWorld = ATW.Datas.WORLDS[worldPrefab.worldId];
			var uWorld = ATW.App.getPlayer().getWorld(cWorld)

			if(uWorld.isOpen()) self.goToWorld(worldPrefab.worldId);

		};

	} else {
		var cWorld = ATW.Datas.WORLDS[worldPrefab.worldId];
		var uWorld = ATW.App.getPlayer().getWorld(cWorld);

		worldPrefab.mouseup = worldPrefab.touchend = function(){

			if(!uWorld.isOpen()) return;

			if(worldPrefab.highlight) {
				self.goToWorld(worldPrefab.worldId);
			} else {
				self.target(self.worldsIds[worldPrefab.worldId], true);
			}
		};
	}

	var socialSlot = worldPrefab.storage.socialSlot;
	if(socialSlot) {
		var total = socialSlot.length;
		for(var i=0; i<total; i++) {
			var slot = socialSlot[i];

			if(slot.btnShop) {
				slot.btnShop.onHit = function(worldPrefab, slot){
					return function(){
						self.slotShop(worldPrefab, slot, socialSlot);
					};
				}(worldPrefab, slot);
			}

			if(slot.btnInvite) {
				slot.btnInvite.onHit = function(worldPrefab, slot){
					return function(){
						self.slotInvite(worldPrefab, slot);
					};
				}(worldPrefab, slot);
			}

		}

	}


};

WorldScene.prototype.slotShop = function(worldPrefab, slot, socialSlots)
{
	console.log('WorldScene::slotShop');
	var self = this;
	var worldId = worldPrefab.worldId
		, cWorlds = ATW.Datas.WORLDS
		, player = ATW.App.getPlayer();

	var world = ATW.App.getPlayer().getWorld(cWorlds[worldId]);
	var friendPrice = world.getPrice();

	var product = Util.Shop.findProductByKey('FRIEND_BASE');
	var cloneProduct = {};
	for(var i in product) cloneProduct[i] = product[i];

	cloneProduct.worldId = worldId;
	cloneProduct.price = friendPrice;
	Util.Shop.instaShop(cloneProduct, function(){

		var fbId = player.fbId;

		if(!fbId) {
			var exportCDN = Util.Url.getPlatformCDN();
			var url = exportCDN.baseUri + "resources/undefined_profil.png";
			var pos = {
				x: 25,
				y: 20
			};
		} else {
			var url = "https://graph.facebook.com/"+fbId+"/picture?width=65&height=65";
			var pos = {
				x: 16,
				y: 14
			};
		}
		var pic = PIXI.Sprite.fromImage(url);

		pic.position.x = pos.x;
		pic.position.y = pos.y;

		slot.friendPicContainer.addChild(pic);

		world.addFriend();

		var newPrice = world.getPrice();

		for(var i=0; i<socialSlots.length; i++) {
			var foreignSlot = socialSlots[i];
			var btnShop = foreignSlot.btnShop;

			if(btnShop) Util.DisplayText.updateShadowText(btnShop.strText, newPrice.toString());

		}

		if(slot.btnInvite) {
			slot.container.removeChild(slot.btnInvite);
		}

		if(slot.orText2) {
			slot.container.removeChild(slot.orText2);
		}

		slot.container.removeChild(slot.btnShop);

		// world.isOpen = function() { return true; }

		if(world.isOpen())
		// if(true)
		{
			worldPrefab.removeChild(worldPrefab.storage.lockContainer);
			worldPrefab.tints.forEach(function(v){
				v.tint = 0xFFFFFF;
			});

			self.goToWorld(worldPrefab.worldId);

		}

	}, function(r) {});


};

WorldScene.prototype.slotInvite = function(worldPrefab, slot)
{
	var worldId = worldPrefab.worldId
		, cWorlds = ATW.Datas.WORLDS
		, objectId = '714338798660537'
		, player = ATW.App.getPlayer();

	Api.FBManager.ui({
		method: 'apprequests',
		message: _ts('demande_monde', {
			':user': player.firstName,
			':world': _2(cWorlds[worldId].name)
		}),
		data: {
			type: 'ADD_WORLD',
			receiver: player.fbId,
			worldId: worldId
		},
		action_type: 'askfor',
		object_id: objectId
    }, function(response){
        // console.log('response', response);
    });



};

WorldScene.prototype.attachLeader = function(worldPrefab)
{
	var worldId = worldPrefab.worldId;
	var cWorld = ATW.Datas.WORLDS[worldId]
	var world = ATW.App.getPlayer().getWorld(cWorld);

	if(!this.leaders[worldId] || !world.isOpen()) return;

	var socLeader = Prefab.world_leader_prefab(this.view, this.leaders[worldId]);
	socLeader.position.x = 62;
	socLeader.position.y = 20;
	socLeader.interactive = true;
	socLeader.mousedown = socLeader.touchstart = function(){
		var ori = {x: socLeader.position.x, y:socLeader.position.y};
		socLeader.showInfo(ori);
	};

	worldPrefab.addChild(socLeader);
};




WorldScene.prototype.mobileBehavior = function(nbWorld) {

	var leftArrow = this.view.getElementById('leftArrow')
		, rightArrow = this.view.getElementById('rightArrow')
		, firstWorld = this.view.getElementById('world_0')
		, self = this;

	this.currentWorldPrefab = firstWorld;


	this.addStandingAvatar(firstWorld);

	var displayWorld = function(i) {
		var w = self.view.getElementById('world_' + self.currentWorld);

		// var dest = (i > self.currentWorld) ? -600 : 600;

		if(ATW.isMobile()) {
			var dest = (i > self.currentWorld) ? -w.width : ATW.gameWidth() + w.width/2;

			TweenLite.to(w.position, 0.2, {x: dest, onComplete: function(){
				self.view.container.removeChild(w);
			}});
		} else {
			self.view.container.removeChild(w);
		}




		self.currentWorld = i;
		var freshWorld = self.view.createWorld(self.currentWorld);
		freshWorld.scale.x = freshWorld.scale.y = 0.5;
		self.currentWorldPrefab = freshWorld;

		self.attachWorldEvent(freshWorld);

		TweenLite.to(freshWorld.scale, 0.6, {x: 1, y:1, ease: Back.easeOut});
		self.addStandingAvatar(freshWorld);

		if(self.currentWorld > 0) {
			leftArrow.alpha = 1;
			leftArrow.visible = true;
		} else {
			leftArrow.alpha = 0;
			leftArrow.visible = false;
		}

		if(self.currentWorld <nbWorld -1) {
			rightArrow.alpha = 1;
			rightArrow.visible = true;
		} else {
			rightArrow.alpha = 0;
			rightArrow.visible = false;
		}
	}


	leftArrow.onHit = function(){
		if(self.currentWorld <= 0) return;
		displayWorld(self.currentWorld-1);

	}

	rightArrow.onHit = function(){
		if(self.currentWorld >= nbWorld-1) return;
		displayWorld(self.currentWorld+1);
	}





};

WorldScene.prototype.defaultBehavior = function(nbWorld){
	var worldContainer = this.view.getElementById('worldContainer')
		, firstWorld = this.view.getElementById('world_0')
		, section = (worldContainer.width - ATW.gameMidWidth())/nbWorld
		, targetedWorld
		, worldPrefab
		, midWorld = firstWorld.width/2
		self = this;



	this.scroller = new PIXIScroller.Scroll(worldContainer, {
		width: ATW.gameMidWidth()
	});

	this.target(this.currentWorld);



};

WorldScene.prototype.addStandingAvatar = function(world) {
	this.cleanStanding();

	var avatar = world.storage.avatar;
	if(!avatar) return;

	this.standingTl = new TimelineMax({repeat: -1, repeatDelay: 0});
	this.standingTl.to(avatar.scale, 1.2, {y:0.9});
	this.standingTl.to(avatar.scale, 1.3, {x:1, y:1});
};

WorldScene.prototype.close = function()
{
	this.cleanStanding();
	Scene.BaseScene.prototype.close.call(this);

};


WorldScene.prototype.cleanStanding = function(){
	if(!this.standingTl)  return;

	this.standingTl.clear();
	this.standingTl = null;
};


WorldScene.prototype.target = function(i, move) {
	var worldContainer = this.view.getElementById('worldContainer');

	this.scroller.amplitude = 0;

	if(move && i != this.currentWorld) {
		var old = this.view.getElementById('world_' + this.currentWorld);
		old.highlight = false;
		old.storage.ptsGroup.alpha = 0;
		old.storage.starGroup.alpha = 0;
		old.storage.avatar.alpha = 0;
		old.storage.socialPedestal.alpha = 0;
		old.storage.pedestal.alpha = 0;
		TweenLite.to(old.scale, 0.4, {x: this.scaleSecondary, y: this.scaleSecondary });
	}

	this.currentWorld = i;
	var worldPrefab = this.view.getElementById('world_' + this.currentWorld);
	worldPrefab.highlight = true;
	worldPrefab.storage.ptsGroup.alpha = 1;
	worldPrefab.storage.starGroup.alpha = 1;
	worldPrefab.storage.avatar.alpha = 1;
	worldPrefab.storage.socialPedestal.alpha = 1;
	worldPrefab.storage.pedestal.alpha = 1;


	TweenLite.to(worldPrefab.scale, 1.2, {x: this.scaleHighlight, y:this.scaleHighlight, ease: Elastic.easeOut});

	if(move) {
		TweenLite.to(worldContainer.position, 0.4, {x: -worldPrefab.position.x + ATW.gameMidWidth()});
	}
};

WorldScene.prototype.goToWorld = function(worldId) {
	var cWorld = ATW.Datas.WORLDS[worldId];
	var world = ATW.App.getPlayer().getWorld(cWorld);

	Util.Sound.fxPlay('fx/voice_world_' + world.getKey());


	if(!world.isEnterOnce())
	{
		if(typeof FB != "undefined")
		{
			FB.api('/me/'+FB_NAMESPACE+':enter', 'post', {
				world : OPEN_GRAPH + '&type=world&method=enter&worldid='+world.getId()+'&v='+APP_VERSION+ '&myLocale='+ATW.App.getPlayer().getLocale()
			}, function(responseAPI) {
			    console.log('og enter world', responseAPI);
			});
		}

		world.setEnterOnce(true);

		ATW.App.getDataManager().getApi().call('World', 'POST', {
			on: 'me',
			data: {
				enterOnce: true,
				id: world.getId()
			}
		}, function(response){

		});

		var friends = world.getFriends();
		var statTracker = {};
		if(!friends.length){
			statTracker.by_star = 1;
		} else {
			var nbHelp = 0;
			friends.forEach(function(friend){
				if(friend.fbId != ATW.App.getPlayer().fbId)
				{
					nbHelp++;
				}
			});

			var s = 'friends_used_' + nbHelp;
			statTracker[s] = 1;
		}

		statTracker.world_id = world.getId();


		ATW.App.getDataManager().getApi().call('WStat', 'POST', {
			on: 'add',
			data: statTracker
		});

	}

	var levelScene = new Scene.LevelScene(world);
	levelScene.start();
};

WorldScene.prototype.previousAction = function() {
	var homeScene = new Scene.HomeScene();
	homeScene.start();
};

exports.WorldScene = WorldScene;

})(window.Scene = window.Scene || {});
