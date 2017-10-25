'use strict';

(function(prefabs){

prefabs.world_prefab = function build_world_prefab(cWorld, showStat, highlight){
	var worldKey = cWorld.key
		, back2 = null
		, prefab = new PIXI.DisplayObjectContainer()
		, uWorld = ATW.App.getPlayer().getWorld(cWorld)
		, isOpen = uWorld.isOpen();
	// isOpen = true;
	if(!isOpen) showStat = false;

	prefab.highlight = highlight;

	prefab.storage = {};

	var title = PIXI.Sprite.fromFrame(worldKey + '-title');
	title.position.y = -250;

	var ground = Util.DisplayObject.sprite(worldKey + '-ground');
	var back1 = Util.DisplayObject.sprite(worldKey + '-back_1');
	try {
		back2 = Util.DisplayObject.sprite(worldKey + '-back_2');
	} catch(error) {}

	var back3 = Util.DisplayObject.sprite(worldKey + '-back_3');
	var fore1 = Util.DisplayObject.sprite(worldKey + '-fore_1');
	var fore2 = Util.DisplayObject.sprite(worldKey + '-fore_2');
	var pedestal = Util.DisplayObject.sprite(worldKey + '-pedestal');
	pedestal.position.y = 260;
	pedestal.position.x = -150;
	prefab.storage.pedestal = pedestal;

	var socialPedestal = Util.DisplayObject.sprite(worldKey + '-pedestal');
	socialPedestal.position.y = 260;
	socialPedestal.position.x = 150;

	prefab.storage.socialPedestal = socialPedestal;
	if(false && !ATW.isMobile() && !highlight) {
		socialPedestal.alpha = 0;
		pedestal.alpha = 0;
	}

	var shadow = PIXI.Sprite.fromFrame(worldKey + '-shadow');
	shadow.position.y = 320;
	shadow.position.x = 0;


	var cacheContainer = new PIXI.DisplayObjectContainer();

	if(!isOpen) {
		var tints = [back1, back3, ground, fore1, fore2, title];
		if(back2) {
			tints.push(back2);
		}
		tints.forEach(function(v){
			v.tint = 0x899799;
		});

		prefab.tints = tints;

	}

	prefab.addChild(back1);
	if(back2) prefab.addChild(back2);
	prefab.addChild(back3);
	prefab.addChild(ground);
	prefab.addChild(fore1);
	prefab.addChild(fore2);
	if(showStat) {
		prefab.addChild(title);

		var frontUnlocked = new PIXI.DisplayObjectContainer()

		prefab.addChild(pedestal);
		prefab.addChild(socialPedestal);

		var avatar = Prefab.avatar_prefab(cWorld.key, true, true);
		avatar.position.y = pedestal.height - 80;
		avatar.position.x = avatar.width/2 - 60;
		pedestal.addChild(avatar);

		prefab.storage.avatar = avatar;
		if(false && !ATW.isMobile() && !highlight){
			avatar.alpha = 0;
		}


	} else if(!isOpen) {
		prefab.addChild(title);
	}


	// if(ATW.isMobile()) prefab.addChild(shadow);
	prefab.addChild(shadow);


	if(showStat) {
		var nbStar = uWorld.sumStar()
			, starGroup = new PIXI.DisplayObjectContainer();

		var graph = new PIXI.Graphics();
		graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 160, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		var appStar = PIXI.Sprite.fromFrame('app_star');
		appStar.position.x = -12;
		appStar.position.y = -3;

		starGroup.addChild(graph);
		starGroup.addChild(appStar);

		starGroup.position.x = -starGroup.width/2;
		starGroup.position.y = 280;

		var text = new PIXI.BitmapText(nbStar + "/" + uWorld.getMaxStar(), {font: "31px FredokaOne-Regular", tint: 0xffff47});
		text = Util.DisplayText.shadow(text, 3, 0, 0x966c00, 0.7);
		text.position.x = ~~(graph.width/2 - text.width/2) + 15;
		text.position.y = ~~(graph.height/2 - text.height/2);

		starGroup.addChild(text);


		prefab.addChild(starGroup);


		var ptsGroup = new PIXI.DisplayObjectContainer();
		var graph = new PIXI.Graphics();
			graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 220, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		ptsGroup.addChild(graph);


		prefab.storage.ptsGroup = ptsGroup;
		prefab.storage.starGroup = starGroup;

		if(false && !ATW.isMobile() && !highlight) {
			ptsGroup.alpha = 0;
			starGroup.alpha = 0;
		}

		var ptsSprite = PIXI.Sprite.fromFrame('app_pts');
		ptsSprite.position.x = -2;
		ptsSprite.position.y = -2;

		ptsGroup.addChild(ptsSprite);

		var text = new PIXI.BitmapText(uWorld.getScore().toString(), {font: "31px FredokaOne-Regular"});
		text = Util.DisplayText.shadow(text, 3, 0, 0x61605e, 0.7);
		text.position.x = ~~(graph.width/2 - text.width/2) + 15;
		text.position.y = ~~(graph.height/2 - text.height/2);
		ptsGroup.addChild(text);


		ptsGroup.position.x = -ptsGroup.width/2 - 10;
		ptsGroup.position.y = 350;

		prefab.addChild(ptsGroup);

	}

	// isOpen = false;
	if(!isOpen) {
		var previousUnlocked = uWorld.prevHasFinishAllLvl();
		// previousUnlocked = true;
		// Display friends
		var padlock = PIXI.Sprite.fromFrame('world_padlock');
		padlock.scale.x = padlock.scale.y = 0.4;
		// previousUnlocked = true;
		if(previousUnlocked) {
			var lockContainer = new PIXI.DisplayObjectContainer();

			padlock.position.y = -190;

			lockContainer.addChild(padlock);

			var unlockedIn = new PIXI.BitmapText( _ts('debloquer_dans'), {font: "27px FredokaOne-Regular"});
			unlockedIn = Util.DisplayText.shadow(unlockedIn, 2, 0, 0x0d0d0d, 0.6);
			unlockedIn.position.y = padlock.position.y + padlock.height - 22;
			unlockedIn.position.x = -~~(unlockedIn.width/2);
			lockContainer.addChild(unlockedIn);



			var totalStar = ATW.App.getPlayer().getStar();
			var atStarText = new PIXI.BitmapText(totalStar + "/" + cWorld.star, {font: "27px FredokaOne-Regular"});
			atStarText = Util.DisplayText.shadow(atStarText, 2, 0, 0x0d0d0d, 0.6);
			atStarText.position.x = -~~(atStarText.width/2);
			atStarText.position.y = unlockedIn.position.y + unlockedIn.height + 10;
			lockContainer.addChild(atStarText);

			var minStar = PIXI.Sprite.fromFrame('level_star_center');
			minStar.scale.x = minStar.scale.y = 0.6;
			minStar.position.x = atStarText.position.x + atStarText.width + 10 + minStar.width/2;
			minStar.position.y = atStarText.position.y + 10;
			lockContainer.addChild(minStar);

			var orText = new PIXI.BitmapText(_ts('Ou').toUpperCase(), {font: "42px FredokaOne-Regular"});
			orText = Util.DisplayText.shadow(orText, 2, 0, 0x0d0d0d, 0.6);
			orText.position.x = -~~(orText.width/2);
			orText.position.y = atStarText.position.y + atStarText.height + 25;
			lockContainer.addChild(orText);

			var friends = uWorld.getFriends()
				, friendsContainer = new PIXI.DisplayObjectContainer()
				, lastBc = null;

			var player = ATW.App.getPlayer();

			prefab.storage.socialSlot = [];
			for(var i=0; i<cWorld.nb_friend_need; i++) {
				var isUnlock = (friends.length > i)
					, friendInvite = PIXI.Sprite.fromFrame('friend_invite_bg')
					, friendBc = new PIXI.DisplayObjectContainer();

				var friend = friends[i] || null;
				if(friend) {
					var friendId = (friend.bought) ? player.fbId : friend.fbId;
					if(!friendId) {
						var exportCDN = Util.Url.getPlatformCDN();
						var url = exportCDN.baseUri + "resources/undefined_profil.png";
						var pos = {
							x: 25,
							y: 20
						};
					} else {
						var url = "https://graph.facebook.com/"+friendId+"/picture?width=65&height=65";
						var pos = {
							x: 16,
							y: 14
						};

					}
					var profilPic = PIXI.Sprite.fromImage(url);
					profilPic.position.x = pos.x;
					profilPic.position.y = pos.y;

					friendInvite.addChild(profilPic);

				}


				if(lastBc) friendBc.position.x = lastBc.position.x + lastBc.width + 10;
				lastBc = friendBc;

				if(i==1) friendBc.position.y = 55;

				friendBc.addChild(friendInvite);

				var orText2, btnShop, btnInvite;
				var player = ATW.App.getPlayer();
				// player.fbId = 0;
				if(!isUnlock) {
					if(player.fbId) {
						// Inviter bouton
						btnInvite = Util.DisplayObject.buttonBlue(_ts('inviter'));
						btnInvite.position.x = friendBc.width/2 - btnInvite.width/2;
						btnInvite.position.y = friendBc.height -5;

						orText2 = new PIXI.BitmapText(_ts('Ou').toLowerCase(), {font: "24px FredokaOne-Regular"});
						orText2 = Util.DisplayText.shadow(orText2, 2, 0, 0x0d0d0d, 0.5);
						orText2.position.y = btnInvite.position.y + btnInvite.height + 3;
						orText2.position.x = friendInvite.width/2 - orText2.width/2;
					}

					btnShop = Util.DisplayObject.buttonGreen(uWorld.getPrice().toString(), {
						pearlIco: true
					});
					btnShop.position.x = friendBc.width/2 - btnShop.width/2;

					if(player.fbId) {
						btnShop.position.y = orText2.position.y + orText2.height +15;
					} else {
						btnShop.position.y = friendBc.height -5;
					}


					prefab.storage.socialSlot.push({
						btnShop: btnShop,
						btnInvite: btnInvite,
						friendPicContainer: friendInvite,
						orText2: orText2,
						container: friendBc
					});

					if(btnInvite) {
						friendBc.addChild(btnInvite);
					}

					if(orText2) {
						friendBc.addChild(orText2);
					}

					friendBc.addChild(btnShop);



				}

				friendsContainer.addChild(friendBc);

			}

			friendsContainer.position.x = -~~(friendsContainer.width/2);
			friendsContainer.position.y = orText.position.y + orText.height + 25;

			prefab.storage.lockContainer = lockContainer;

			lockContainer.addChild(friendsContainer);
			prefab.addChild(lockContainer);


		} else {
			padlock.position.y = -70;
			prefab.addChild(padlock);

			var s2 = Util.DisplayText.wrap(_ts('terminez_niveau_anterieur'), {
				font: "27px FredokaOne-Regular",
				letterMax: 30,
				align: "center",
				maxWidth: 320,
				lineHeight: 40
			});

			s2.position.x = -~~(s2.width/2) + 35;
			prefab.addChild(s2);

		}

	}



	return prefab;
};

})(window.Prefab = window.Prefab || {});