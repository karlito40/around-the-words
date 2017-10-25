'use strict';

(function(exports){

function PopupDailyReward(scene)
{
	this.footerBar = scene.view.getElementById('footerBar');
	this.footerBarBtn = scene.view.getElementById('button_daily_reward');

	this.dr = null;

	var cfRewards = ATW.Datas.DAILYREWARD;
	for(var i in cfRewards)
	{
		this.dr = cfRewards[i];
		break;
	}


	this.availableRewards = [];
	var jackpot = null
	, useJackpot = false
	, cfsBonus = ATW.Datas.BONUS
	, player = ATW.App.getPlayer();

	for(var i in this.dr.rewards) {
		var r = this.dr.rewards[i];

		if(r.key == 'JACKPOT') {
			jackpot = r;
			continue;
		}

		if(!r.bonus_id) {
			this.availableRewards.push(r);
		} else {
			var bonus = cfsBonus[r.bonus_id];
			if(player.isTutoFisnish(bonus.tuto_key)) {
				this.availableRewards.push(r);
				useJackpot = true;
			}
		}
	}

	if(useJackpot) this.availableRewards.push(jackpot);

	this.realProbaHelper = new Util.Probability(this.availableRewards, 'real_proba');
	this.fakeProbaHelper = new Util.Probability(this.availableRewards, 'fake_proba');

	Util.Popup.call(this);

};

PopupDailyReward.constructor = PopupDailyReward;
PopupDailyReward.prototype = Object.create(Util.Popup.prototype);

PopupDailyReward.prototype.create = function()
{

	var container = new PIXI.DisplayObjectContainer()
	, title = PIXI.Sprite.fromFrame('popup_dr_title')
	, cushion = PIXI.Sprite.fromFrame('popup_dr_cushion')
	, self = this;

	container.addChild(title);

	this.shapes = [];

	var x=0;
	for(var i=0; i<this.dr.nb_pieces; i++) {
		var shape = new PIXI.DisplayObjectContainer()
			, close = PIXI.Sprite.fromFrame('popup_dr_box_close')
			, open = PIXI.Sprite.fromFrame('popup_dr_box_open');


		open.alpha = 0;

		shape.addChild(close);
		shape.addChild(open);

		shape.storage = {
			openState: open,
			closeState: close
		};

		shape.interactive = true;
		shape.mousedown = shape.touchstart = function(shape, i){
			return function(){
				self.choice(shape, i);
			}
		}(shape, i);

		this.shapes.push(shape);

		if(i == 0) shape.position.x = 65;
		else if(i == 1) shape.position.x = 215;
		else shape.position.x = 370;

		shape.position.y = -160;
		cushion.addChild(shape);
	}


	var tipHeight = 45, tipWidth = 530;
	var tipContainer = new PIXI.Graphics();
	tipContainer.beginFill(0x000000, 0.7)
		.drawRoundedRect(0,0, tipWidth, tipHeight, 20)
		.endFill();


	var tipBmp = new PIXI.BitmapText(_2(this.dr.tips), {font: "24px FredokaOne-Regular"});
	tipBmp.position.x =  tipContainer.width/2 - tipBmp.width/2;
	tipBmp.position.y = tipContainer.height/2 - tipBmp.height/2;
	tipContainer.addChild(tipBmp);

	cushion.position.y = container.height + 140;

	container.addChild(cushion);

	title.position.x = container.width/2 - title.width/2;

	tipContainer.position.y = container.height + 20;
	tipContainer.position.x = container.width/2 - tipContainer.width/2;
	container.addChild(tipContainer);

	this.btnAccept = Util.DisplayObject.buttonGreen(_ts('recuperer'));
	this.btnAccept.visible = false;
	this.btnAccept.scale.x = this.btnAccept.scale.y = 1.3;
	this.btnAccept.position.y = container.height + 30;
	this.btnAccept.position.x = container.width/2 - this.btnAccept.width/2;
	this.btnAccept.onHit = this.acceptHandler.bind(this);

	container.addChild(this.btnAccept);


	container.position.x = ATW.gameMidWidth() - container.width/2;
	container.position.y = 130;

	this.addChild(container);

	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);


};

PopupDailyReward.prototype.acceptHandler = function()
{
	if(this.acceptHandlerDone) return;

	this.acceptHandlerDone = true;

	this.footerBar.removeChild(this.footerBarBtn);

	var boundedBox = Util.Screen.boundedBox();

	var newBtn = Prefab.daily_reward_btn();
	newBtn.position.x = boundedBox.xMax - newBtn.width/2 - 20;
	newBtn.position.y = newBtn.height/2 - 5;

	this.footerBar.addChild(newBtn);
	this.close();
};


PopupDailyReward.prototype.animDiscover = function(shape, reward, stay)
{
	// var $shapeOff = $chosenPiece.find('.shape.off');
	// var $shapeOn = $chosenPiece.find('.shape.on');

	var shapeOn = shape.storage.openState
		, shapeOff = shape.storage.closeState
		, rewardSprite = null;

	var highlightKey = '';

	if(reward.bonus_id)
	{
		highlightKey = 'bonus-' + reward.bonus_id;

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);

	}
	else if(reward.pearl)
	{
		highlightKey = 'app_pearl';

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);
	}
	else if(reward.key)
	{
		highlightKey = reward.key;

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);
	}

	rewardSprite.position.y = 165;

	var openDuration = 0.25;
	if(stay)
	{
		this.tlStay = new TimelineMax({repeat: -1, yoyo: true});
		this.tlStay.to(rewardSprite.position, 0.3, {y: '-=30', scaleX: 0.8, scaleY: 1.2}, 'start');
		this.tlStay.to(rewardSprite.scale, 0.3, {x: 0.8, y: 1.2}, 'start');
	}
	else
	{
		var tlVanished = new TimelineMax();
		tlVanished.to(rewardSprite.scale,  0.8, {x: 1.5, y:1.5});
		tlVanished.to(rewardSprite,  0.5, {alpha:0}, '-=0.5');
		tlVanished.to(shapeOn, 0.3, {alpha:0}, 'shape');
		tlVanished.to(shapeOff, 0.3, {alpha:1}, 'shape');

		openDuration = 0.5;
	}

	var tl = new TimelineMax();

	tl.to(shapeOn, openDuration, {alpha:1}, 'start');
	tl.to(shapeOff, openDuration, {alpha:0}, 'start');

};

PopupDailyReward.prototype.choice = function(shape, i) {
	if(this.choiceDone) return;

	this.choiceDone = true;

    var reward = this.realProbaHelper.rand()
    	, self = this;
    this.animDiscover(shape, reward, true);
    this.btnAccept.visible = true;

    setTimeout(function(){
		var staggerBy = 500;
		self.shapes.forEach(function(shape, key){
			if(key != i) {
				var fakeReward = self.fakeProbaHelper.rand();
				setTimeout(function(){
					self.animDiscover(shape, fakeReward);
				}, staggerBy);

				staggerBy += staggerBy;

			}

		})
	}, 300)

    var player = ATW.App.getPlayer();
    player.waitingDailyGift = false;

    var baseData = {waitingDailyGift: false};
    // var baseData = {};
	if(reward.bonus_id)
	{
		player.incrBonus(reward.bonus_id, reward.qty);
		ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
			on: 'me',
			data: {
				id: reward.bonus_id,
				quantity: player.getBonus(reward.bonus_id).getQuantity()
			}
		});

		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: baseData
		}, function(res){});
	}
	else if(reward.pearl)
	{
		player.incrPearls(reward.qty);
		ATW.App.refreshPearl();

		baseData.pearls = player.getPearls();

		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: baseData
		}, function(res){});
	}
	else if(reward.key)
	{
		switch(reward.key)
		{
			case 'HEART_ACCELERATOR':
				// App.getPlayer().heartAccelerator = true;
				player.createAccel("heartAccelerator");
				baseData.heartAccelerator = true;

				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();
				});
				break;

			case 'SCORE_ACCELERATOR':
				player.createAccel("scoreAccelerator");
				baseData.scoreAccelerator = true;
				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();

				});
				break;

			case 'TIME_BOOSTER':
				// App.getPlayer().timeBooster = true;
				player.createAccel("timeBooster");
				baseData.timeBooster = true;
				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();

				});
				break;

			case 'JACKPOT':
				var drRewards = this.availableRewards;

				baseData.bonusMap = {};
				for(var i in drRewards)
				{
					drReward = drRewards[i];
					if(drReward.bonus_id)
					{
						player.incrBonus(drReward.bonus_id, drReward.qty);
						baseData.bonusMap[drReward.bonus_id] = {
							quantity: player.getBonus(drReward.bonus_id).getQuantity(),
							id: drReward.bonus_id
						};
					}

				}

				App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){});

				break;

			default:
				break;
		}
	}

};


exports.PopupDailyReward = PopupDailyReward;

})(window.UI = window.UI || {});