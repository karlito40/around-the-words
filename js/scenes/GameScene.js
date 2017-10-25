'use strict';
(function(exports){

function GameScene(level, retry)
{
	exports.BaseScene.call(this, 'GameScene', 'game_scene');

	this.level = level;
	this.retry = retry;
	this.isGameScene = true;

	this.game = new Game.MYGame({
		level: this.level,
		scene: this
	});

	this.game.worldComplete = this.level.getWorld().isComplete();

	this.timersAnim        = {};
	this.hangedLetterTest  = {};
	this.pearlsRequest     = [];
	this.progressAnimQueue = [];
	this.goalAnims         = [];

	this.lastHangedWord = null;
	this.nbPearl = 0;
	this.nbShopBonus = 0;
	this.viewState = GameScene.GAME_VIEW;
	this.soundTheme = ['world_' + this.level.getWorld().getKey()];


};

GameScene.constructor = GameScene;
GameScene.prototype = Object.create(exports.BaseScene.prototype);

GameScene.prototype.logic = function() {
	var self = this,
		player = ATW.App.getPlayer(),
		btnMenu = this.view.getElementById('btnMenu'),
		btnRestart = this.view.getElementById('btnRestart'),
		fireWave = this.view.getElementById('fireWave'),
		btnCancel = this.view.getElementById('btnCancel'),
		btnSubmit = this.view.getElementById('btnSubmit'),
		btnPause = this.view.getElementById('btnPause'),
		btnResume = this.view.getElementById('btnResume'),
		bonusMap = this.view.getElementById('bonusMap');

	this.fields = this.view.getElementById('fields');
	this.timerBmp = this.view.getElementById('timerBmp');
	this.lastHangedWord = null;

	this.game.prepare();


	// --------------------------------------------------------------
	// Bonus handler
	// --------------------------------------------------------------
	bonusMap.map.forEach(function(btn){

		btn.onHit = function bonusOnHit(){
			var cBonus = ATW.Datas.BONUS[btn.bid]
				, player = ATW.App.getPlayer()
				, bonus = player.getBonus(cBonus.id)
				, isUnlock = (cBonus.tuto_key && !player.isTutoFisnish(cBonus.tuto_key)) ? false : true;

			if(!isUnlock) {
				self.resumeHandler();
				return;
			}

			var _activeBonus = function() {
				self.resumeHandler();
				self.game.useBonus(cBonus, false, function(hasBeenConsumed){

					if(hasBeenConsumed)
					{
						ATW.App.getPlayer().getAchievementManager().dispatch('USE_MANUAL_BONUS', {ref: cBonus.key});
						self.consumeBonusHandler(cBonus);
					}

				});

			}


			if(bonus && bonus.getQuantity()) {
				_activeBonus();
			} else {
				var product = Util.Shop.findProductByKey(cBonus.key);
				Util.Shop.instaShop(product, function(){
					player.incrBonus(cBonus.id);
					self.updateBonus(cBonus.id);
					_activeBonus();
				}, function(res){}, function(){
					// $parent.removeClass('loading');
				});

			}

		}

	});


	// --------------------------------------------------------------
	// Buttons
	// --------------------------------------------------------------
	if(btnMenu) {
		btnMenu.onHit = function(){
			var levelScene = new Scene.LevelScene(self.level.getWorld());
			levelScene.start();
		}
	}

	if(btnRestart) btnRestart.onHit = this.restart.bind(this);
	if(btnPause) btnPause.onHit = this.pauseHandler.bind(this);
	if(btnResume) btnResume.onHit = this.resumeHandler.bind(this);


	if(fireWave) {
		fireWave.onHit = function(){
			if(self.game.isFreeze) self.game.resume(false, true);
			self.game.wave(true);
		}
	}

	btnCancel.onHit = function(){
		self.game.resetWord(true);
	}

	btnSubmit.onHit = function(){
		self.game.submitWord();
	}


	// --------------------------------------------------------------
	// Game Handler
	// --------------------------------------------------------------
	this.game.onStartTimer        = this.startTimerHandler.bind(this);
	this.game.onLifeChange        = this.changeLifeHandler.bind(this);
	this.game.onWave              = this.waveHandler.bind(this);
	this.game.onScore             = this.scoreHandler.bind(this);
	this.game.onWaveCut           = this.waveCutHandler.bind(this);
	this.game.onEmptyAlert        = this.emptyAlertHandler.bind(this);
	this.game.onEnd               = this.endHandler.bind(this);
	this.game.onHangingProgress   = this.refreshHangedWord.bind(this);
	this.game.onHourglassTimer    = this.hourglassTimerHandler.bind(this);
	this.game.onEatPearls         = this.eatPearlsHandler.bind(this);
	this.game.onFishMouseDown     = this.onFishMouseDownHandler.bind(this);
	this.game.onProgressObjective = this.onProgressObjectiveHandler.bind(this);
	this.game.onFreeze            = this.freezeHandler.bind(this);
	this.game.onConsumeBonus      = this.consumeBonusHandler.bind(this);
	this.game.onTuto              = this.onTutoGameHandler.bind(this);

	this.game.onHangedLetterError = function(letter) { self.highlightHangedLetter(letter, true); };


	var levelId = this.level.getId()
		, world = this.level.getWorld();

	console.log('----> levelId', levelId);
	world.setLastVisited(levelId);
	ATW.App.getDataManager().getApi().call('World', 'POST', {
		on: 'me',
		data: {
			id: world.getId(),
			lastVisited: levelId
		}
	}, function(response){});

	if(!this.retry) {
		this.prepareGame();
	} else {
		var popupLevel = new UI.PopupLevel(this.level, true);
		popupLevel.onClose = function(){
			self.prepareGame();
		}
		popupLevel.open();
	}

};

GameScene.prototype.prepareGame = function(){
	var self = this;
	var player = ATW.App.getPlayer();
	if(!player.isOnSession())
	{
		var cLife = player.life;
		player.life  = Math.max(0, cLife-1);
		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				life: player.life
			}
		}, function(res){
			self.handleStartLife = function() {
				player.myUpdate(res);
			}
		});
	}


	if(this.game.isReady) this.readyGoHandler();
	else this.game.onReady = this.readyGoHandler.bind(this);
};

GameScene.prototype.readyGoHandler = function() {
	var self = this
		, mode = this.level.getMode()
		, tutos = this.getPrimaryTutoList()
		, player = ATW.App.getPlayer();



	var popRef = null;
	for(var key in tutos)
	{
		if(!tutos[key]()){ continue; }

		if(key == 'pearl')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var ground = this.game.grid.hasPearl
				, parent = this.fields;
				var boundingGround = {
					x: ground.getLeft() + parent.position.x + 12,
					y: ground.getTop() + parent.position.y,
					width: 50,
					height: 70
				};

				var pearlBoardTuto = new UI.PopupTutoBoard([
					{
						hit: boundingGround,
						txt: _ts('nouvelle_perle'),
						arrowDir: 'toBottom',
						transparentBorder: true
					}
				]);

				pearlBoardTuto.onComplete = function(){ p.open(); }
				pearlBoardTuto.open();
			}

		}
		else if(key == 'board_spawn_locked')
		{
			var tutoActive = !player.isTutoFisnish(key);
			if(tutoActive)
			{
				var p = new UI.PopupTutoBoard([
					{ txt: _ts('nouvelle_meduse_bloque') }
				]);
				p.open();

				player.finishTuto(key);
				ATW.App.getDataManager().getApi().call('Tuto', 'POST', {
					on: 'me',
					data: {
						key: key
					}
				});
			}
		}
		else if(key == 'first_bomb')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstBombTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouvelle_bombe') }
				]);

				firstBombTuto.onComplete = function(){ p.open(); }
				firstBombTuto.open();
			}
		}
		else if(key == 'wall')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstWallTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_mur')
					}
				]);

				firstWallTuto.onComplete = function(){
					p.open();
				};

				firstWallTuto.open();
			}
		}
		else if(key == 'hole')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstHoleTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_trou')
					}
				]);

				firstHoleTuto.onComplete = function(){
					p.open();
				}

				firstHoleTuto.open();
			}
		}
		else if(key == 'survival_mode')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var survivalModeTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouveau_mode_survie') }
				]);

				survivalModeTuto.onComplete = function(){ p.open();	}
				survivalModeTuto.open();
			}
		}
		else if (key == 'miley_cyrus')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var fireWave = self.view.getElementById('fireWave')
				, waveContainer = self.view.getElementById('waveContainer');

				var boundingFire = {
					x: fireWave.position.x + waveContainer.position.x - fireWave.width/2-3,
					y: fireWave.position.y - 5,
					width: fireWave.width,
					height: fireWave.height
				}

				var wbModeTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouveau_mode_sauvetage') },
					{
						hit: boundingFire,
						txt: _ts('mode_sauvetage_explication', {
							':wave': ' ' + this.level.getNbWave(),
							':endpoint': ' '+this.level.getMode().getEndPoint()
						})
					}
				]);

				popRef = new UI.PopupTutoBoard([
					{
						hit: boundingFire,
						noCheck: false,
						txt: _ts('sauvetage_vague')
					}
				]);
				wbModeTuto.onComplete = function(){
					p.open();
					p.onClose2 = function()	{ popRef.open(); }
				}

				wbModeTuto.open();
			}
		}
		else if(key == 'hanged')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				// var forceWord = this.game.mysteryWord;
				var forceWord = _ts('tuto_pendu_a_tester');
				this.game.hangedTuto = true;
				var hangedModeTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_mode_pendu', {
							':prompt': ' '+forceWord
						})
					}
				]);

				hangedModeTuto.onComplete = function(){ p.open(); }
				hangedModeTuto.open();
			}
		}
		else if(key == 'simple')
		{

			var tutoActive = !player.isTutoFisnish('level1');
			if(tutoActive)
			{
				// var $descri = self.$node.find('#descritionMd');
				// var boundingObj = DOMHelper.getNoScaleBoundingClient($descri[0], TutoBoardPopup.border);
				// boundingObj[0] += 50;
				// boundingObj[1] += 5;
				// boundingObj[2] -= 100;

				var descri = self.view.getElementById('groupTitle')
				, boundingObj = {
					x: descri.position.x,
					y: descri.position.y,
					width: descri.width,
					height: descri.height
				};

				var p = new UI.PopupTutoBoard([
					{
						// hit: DOMHelper.boundingSubstract([612, 560, 57, 55], TutoBoardPopup.border),
						// transparentBorder: true,
						txt: _ts('voici_classique'),
						// arrowDir: 'toLeft'
					},
					{
						hit: boundingObj,
						txt: _ts('objectifs_classique_explication', {
							':x': ' '+ mode.getEndPoint()
						}),
						noArrow: true
					}
				]);
				p.open();
			}
		}
		else
		{
			var p = new UI.PopupTuto(key);
			p.open();

			var tutoActive = p.active;
		}

		if(tutoActive) break;
	}


	if(!tutoActive)
	{
		var key = null;
		if(this.level.hasTuto() === 1) key = 'goals';
		else if (this.level.hasTuto() === 3) key = 'word_length';

		this.secondaryTutoPres(key, self.launch123Go.bind(self));
	}
	else
	{
		var u = (!popRef) ? p : popRef;
		u.onComplete = u.onClose = function(){
			setTimeout(function(){
				self.secondaryTutoPres(key, self.launch123Go.bind(self));
			}, 300);
		}
	}
};

GameScene.prototype.getPrimaryTutoList = function() {
	var self = this
		, mode = this.level.getMode();
	return {
		goals: function(){ return (self.level.hasTuto() === 1);	},	// ok
		pearl: function(){ return self.game.grid.hasPearl; },	// ok
		board_spawn_locked: function(){ return self.game.grid.hasFishLocked; }, //ok
		first_bomb: function(){ return self.game.grid.hasBomb; },	// ok
		wall: function(){ return self.game.grid.hasWall; },	// ok
		hole: function(){ return self.game.grid.hasHole; }, // ok
		survival_mode: function(){ return mode.isSurvival(); }, // ok
		miley_cyrus: function(){ return mode.isWreckingBall(); }, // ok
		simple: function() { return mode.isSimple(); }, // ok
		hanged: function(){ return mode.isHanged(); }, // ok
		crossword: function(){ return mode.isCrossword(); }
	}
};

GameScene.prototype.secondaryTutoPres = function(key, onDone) {
	if(key && (key == 'goals' || key == 'word_length'))
	{

		if(key == 'goals')
		{
			var goals = this.level.getMode().findGoals();

			if(!ATW.isMobile()) {
			 	var parent = this.view.getElementById('groupGauge')
				, firstGoal = this.view.getElementById('score-0')
				, line = this.view.getElementById('lineScore-0')
				, bounding = {
					x: line.position.x + parent.position.x + firstGoal.position.x,
					y: line.position.y + parent.position.y + firstGoal.position.y,
					width: firstGoal.width,
					height: firstGoal.height
				}
			} else {

				var parent = this.view.getElementById('starGauge')
				, firstGoal = this.view.getElementById('onStar-0')
				, bounding = {
					x: parent.position.x + firstGoal.position.x - firstGoal.width/2,
					y: parent.position.y + firstGoal.position.y - firstGoal.height/2,
					width: firstGoal.width,
					height: firstGoal.height
				}


			}


			var tutoBoard = new UI.PopupTutoBoard([
				{
					hit: bounding,
					// noArrow: true,
					txt: _ts('ton_objectif_est_x_pts', {
						':x': ' ' + goals[0]
					})
				}
			]);
		}
		else
		{
			// var $descri = self.$node.find('#descritionMd');

			// var bounding = DOMHelper.getNoScaleBoundingClient($descri[0], TutoBoardPopup.border);
			// bounding[0] += 60;
			// bounding[1] += 5;
			// bounding[2] -= 120;

			var descri = this.view.getElementById('groupTitle')
			, bounding = {
				x: descri.position.x,
				y: descri.position.y,
				width: descri.width,
				height: descri.height
			};

			var tutoBoard = new UI.PopupTutoBoard([
				{
					hit: bounding,
					txt: _ts('objectif_longueur_p1')
				},{
					hit: bounding,
					txt: _ts('objectif_longueur_p2')
				},{
					hit: bounding,
					txt: _ts('objectif_longueur_p3')
				}
			]);
		}
		// tutoBoard.onComplete = this.launch123Go.bind(this);
		tutoBoard.onComplete = onDone;
		tutoBoard.open();

	}
	else
	{
		onDone();
	}

};

GameScene.prototype.launch123Go = function(){
	Util.Sound.fxPlay('fx/ready_3 2 1_GO');
	this._flash("3 2 1 Go!", this.launchGame.bind(this))
};


GameScene.prototype.launchGame = function() {
	if(!this.open) return;

	console.log('GameScene::launchGame');
	this.game.start();

	// Copy paste mygohandler

	this.refreshHangedWord();
};

GameScene.prototype.startTimerHandler = function(resume, id)
{
	if(id == Game.MYGame.WAVE_TIMER) this._rope(resume);
	else this._hourglass(resume);

};

GameScene.prototype.freezeHandler = function(isFreeze)
{
	var sparkle = this.view.getElementById('sparkle');
	if(!sparkle) return;

	var frontRope = this.view.getElementById('frontRope')

	if(isFreeze)
	{
		for(var i in this.timersAnim)
		{
			if(this.timersAnim[i]) this.timersAnim[i].pause();
		}

		sparkle.stop();
		sparkle.alpha = 0;

		var frozenFixture = new PIXI.TilingSprite(PIXI.Texture.fromFrame('fixture_rope_freeze'), 48, 452)
			, frozenRope = new PIXI.TilingSprite(PIXI.Texture.fromFrame('freeze_rope'), 22, 587)
			, sparkleFreeze = PIXI.Sprite.fromFrame('sparkle_freeze');

		frozenRope.height = frontRope.height;
		frozenRope.position.x = 1;
		frontRope.addChild(frozenRope);

		sparkleFreeze.position.y = frontRope.height - 15;
		sparkleFreeze.position.x = -10;
		frontRope.addChild(sparkleFreeze);

		frozenFixture.height = frontRope.height;
		frozenFixture.position.x = -9;
		frontRope.addChild(frozenFixture);

		frontRope.frozenThing = [frozenRope, frozenFixture, sparkleFreeze];

	}
	else
	{
		for(var i in this.timersAnim) if(this.timersAnim[i]) this.timersAnim[i].resume();

		sparkle.alpha = 0;
		sparkle.play();

		var frozenThing = frontRope.frozenThing;
		for(var i=0; i<frozenThing.length; i++) {
			frontRope.removeChild(frozenThing[i]);
		}

		frontRope.frozenThing = [];
	}



};

GameScene.prototype.consumeBonusHandler = function(cBonus)
{
	var player = ATW.App.getPlayer();
	if(player.consumeBonus(cBonus.id))
	{
		var bonus = player.getBonus(cBonus.id);
		ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
			on: 'me',
			data: {
				quantity: bonus.getQuantity(),
				id: cBonus.id
			}
		});
	}

	this.updateBonus(cBonus.id);
};


GameScene.prototype.updateBonus = function(bid) {
	var player = ATW.App.getPlayer()
		, bonus = player.getBonus(bid)
		, quantity = (bonus) ? bonus.getQuantity() : 0
		, qtyText = this.view.getElementById('bonusText-' + bid)
		, pearlSprite = this.view.getElementById('bonusPearl-' + bid);


	var s = 'x' + quantity;
	if(!quantity) {
		var product = Util.Shop.findProductByKey(bonus.getKey());
		s = product.price.toString();
		pearlSprite.alpha = 1;
	} else {
		pearlSprite.alpha = 0;
	}


	Util.DisplayText.updateShadowText(qtyText, s);


	// var $line = this.$node.find('#line-' + bid);

	// var $bonus = $line.find('#bonus-' + bid);
	// $line.removeClass('loading');

	// var $quantity = $bonus.next('.quantity');
	// $quantity.removeClass('x0')
	// 	.find('.txt')
	// 	.html('x'+quantity);

	// if(!quantity)
	// {
	// 	$quantity.addClass('x0');
	// }
};

GameScene.prototype.endHandler = function()
{
	console.log('GameScene::endHandler');
	if(!this.level.getId()) return;


	this.hasEnd = true;

	if(this.level.getMode().isHanged() && this.game.mysteryWord != this.game.hangedWord)
	{
		// Affiche le mot mystere
		this.updateDescription(this.game.mysteryWord.toUpperCase());
	}

	if(this.game.hasWin()) this.saveGame();

	this.dispatchAchievement();

	this.saveStat();

	this.stopRunningAnimation();
	this.endAnim();

};

GameScene.prototype.updateDescription = function(text){
	var groupTitle = this.view.getElementById('groupTitle');
	var descriptionText = this.view.getElementById('descriptionText')
		, children = descriptionText.children
		, childrenLength = descriptionText.children.length;

	for(var i=0; i<childrenLength; i++) {
		children[i].setText(text);
	}

	// descriptionText.position.x = ~~(groupTitle.width/2 - descriptionText.width/2);
	descriptionText.position.x = ~~(groupTitle.oriWidth/2 - descriptionText.width/2);
};

GameScene.prototype.refreshHangedWord = function()
{
	if(!this.level.getMode().isHanged()) return;

	var hangedWord = this.game.getHangedWord();
	if(!this.lastHangedWord || this.lastHangedWord != hangedWord)
	{


		this.updateDescription(hangedWord.toUpperCase());


		var isEmpty = true;
		for(var i in hangedWord)
		{
			if(hangedWord[i] != '_')
			{
				this.highlightHangedLetter(hangedWord[i]);
				isEmpty = false;
			}

		}

		if(isEmpty && this.hangedLetterTest)
		{


			for(var letter in this.hangedLetterTest){
				var v = this.hangedLetterTest[letter];
				for(var fishId in v) {

					var fish = v[fishId]
						, letterContainer = this.view.getElementById('letter-'+fish.id)
						, frontLetter = letterContainer.children[1];

					letterContainer.cacheAsBitmap = null;

					frontLetter.tint = 0xFFFFFF;
					frontLetter.updateText();

					letterContainer.cacheAsBitmap = true;

					UI.Fish.toDefault(fish);

				}
			}


			this.hangedLetterTest = {};
		}

		this.lastHangedWord = hangedWord;
	}


};



GameScene.prototype.highlightHangedLetter = function(letter, isError)
{
	letter = letter.toUpperCase();
	if(this.hangedLetterTest[letter]) return;
	else if(!this.hangedLetterTest[letter]) this.hangedLetterTest[letter] = {};

	var fishesByLetter = this.game.grid.fishesByLetter()
		, fishSection = fishesByLetter[letter]
		, nbFish = fishSection.length;

	for(var i=0; i<nbFish; i++) {
		var fish = fishSection[i]
			, letterContainer = fish.view.storage.textContainer
			, frontLetter = letterContainer.children[1];

		letterContainer.cacheAsBitmap = null;
		if(isError) {
			frontLetter.tint = 0xff5e5e;
			fish.ghost = true;

			UI.Fish.toDefault(fish);
		} else {
			frontLetter.tint = 0x00ff06;
		}

		frontLetter.updateText();

		letterContainer.cacheAsBitmap = true;
		this.hangedLetterTest[letter][fish.id] = fish;

	}

};


GameScene.prototype.eatPearlsHandler = function(pearls)
{
	var nbPearlWon = 0
		, cPearls = ATW.Datas.PEARLS;
	for(var i in pearls)
	{
		var pearlID = pearls[i].id;
		var pearl = cPearls[pearlID];
		var drop = Util.Math2.castInt(pearl.drop);
		this.nbPearl += drop;
		nbPearlWon += drop;
	}


	if(nbPearlWon)
	{
		Util.Sound.fxPlay('fx/perle');

		var self = this
			, player = ATW.App.getPlayer()
			, api = ATW.App.getDataManager().getApi()
			, updateData = {}
			, pearlText = this.view.getElementById('headerPearlText');

		player.incrPearls(nbPearlWon);
		this.level.incrPearls(nbPearlWon);

		ATW.App.refreshPearl();
		// pearlText.setText(player.getPearls().toString());
		// pearlText.updateText();
		// pearlText.position.x = pearlText.rightOri - pearlText.width;

		this.pearlsRequest.push(function(){
			api.call('User', 'POST', {
				on: 'me',
				data: {
					pearls: player.getPearls()
				}
			}, function(res){
				if(self.pearlsRequest > 1)
				{
					self.pearlsRequest.splice(0, t.length-1);
					self.pearlsRequest[0]();
				}
				else
				{
					self.pearlsRequest = [];
				}

			});

			updateData.world_id  = self.level.getWorld().getId();
			updateData.level_id  = self.level.getId();
			updateData.first_name = player.getFirstName();
			updateData.pearlsGrind = self.level.getPearls();

			api.call('Score', 'POST', {
				on: 'me',
				data: updateData
			});

		});

		if(this.pearlsRequest.length == 1) this.pearlsRequest[0]();


	}
};


GameScene.prototype.onFishMouseDownHandler = function()
{
	var mode = this.level.getMode();
	if(!mode.isHanged()) return;

	var btnSubmit = this.view.getElementById('btnSubmit')
		, btnSubmitUnselectable = this.view.getElementById('btnSubmitUnselectable')
		, currentWord = this.game.word.getCurrent('_');

	if(currentWord.length == mode.getX())
	{
		btnSubmit.alpha = 1;
		btnSubmitUnselectable.alpha = 0;
		btnSubmitUnselectable.visible = false;
	}
	else
	{
		btnSubmit.alpha = 0;
		btnSubmitUnselectable.alpha = 1;
	}

};

GameScene.prototype.pause = function()
{
	console.log('GameScene::pause')
	this.game.pause();
	this.toggle();


};

GameScene.prototype.resume = function()
{
	console.log('GameScene::resume');
	this.game.resume();
	this.toggle();
};

GameScene.prototype.toggle = function()
{
	// console.log('GameScene::toggle deprecated')
	// return;


	if(this.game.isPlaying() && this.viewState == GameScene.GAME_VIEW
		|| ( (!this.game.isPlaying() && !this.game.isFreeze) && this.viewState == GameScene.PAUSE_VIEW )
	) {
		console.log('not allow');
		return false;
	}

	if(this.viewState == GameScene.GAME_VIEW)
	{
		for(var i in this.timersAnim)
		{
			var t = this.timersAnim[i];
			if(t) t.pause();

		}

		this.viewState = GameScene.PAUSE_VIEW;
	}
	else
	{


		this.viewState = GameScene.GAME_VIEW;
	}


	return true;

};

GameScene.prototype.onTutoGameHandler = function(tutoKey, onComplete, saveOnFire)
{
	var self = this
		, player = ATW.App.getPlayer()
		, force = false
		, dontSave = false;

	if(saveOnFire)
	{
		force = true;
		dontSave = true;
	}


	var onCloseHandler = function()
	{

		if(Game.Grid.TutoToBonus[tutoKey] && Game.Grid.BonusWord[Game.Grid.TutoToBonus[tutoKey]])
		{
			// On vient de debloquer un bonus
			var cBonus = Util.Bonus.findByTuto(tutoKey);
			if(cBonus)
			{
				var btnBonus = self.view.getElementById('btnBonus-' + cBonus.id);
				btnBonus.alpha = 1;
				btnBonus.buttonMode = true;

				player.incrBonus(cBonus.id);
				self.updateBonus(cBonus.id);
				ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
					on: 'me',
					data: {
						quantity: player.getBonus(cBonus.id).getQuantity(),
						id: cBonus.id
					}
				});

				self.game.useBonus(cBonus, true);

			}
		}
	}



	var p = new UI.PopupTuto(tutoKey, force, dontSave);
	p.open();

	if(force) p.save();

	if(p && p.active)
	{
		this.pause();

		p.onClose = function(){

			onCloseHandler();
			self.resume();

			if(onComplete) onComplete();

		}
	}
	else if(onComplete) onComplete();

};


GameScene.prototype.pauseHandler = function(){
	var pauseContainer = this.view.getElementById('pauseContainer');
	if(this.viewState == GameScene.PAUSE_VIEW || pauseContainer.visible) return;

	var filterPause = this.view.getElementById('filterPause');
	filterPause.interactive = true;
	filterPause.mousedown = filterPause.touchstart = this.resumeHandler.bind(this);


	pauseContainer.alpha = 0;
	pauseContainer.visible = true;

	TweenLite.to(pauseContainer, 0.4, {alpha: 1});

	this.pause();
};

GameScene.prototype.resumeHandler = function(){
	if(this.viewState == GameScene.GAME_VIEW) return;

	var pauseContainer = this.view.getElementById('pauseContainer');

	TweenLite.to(pauseContainer, 0.4, {alpha: 0, onComplete: function(){
		pauseContainer.visible = false;
	}});

	this.resume();

};



GameScene.prototype.hourglassTimerHandler = function(t)
{
	var o = t.getCurrent();
	this.timerBmp.setText(o.min + ':' + o.sec);
};



GameScene.prototype.handleProgressQueue = function()
{
	if(this.progressAnimQueue && this.progressAnimQueue.length)
	{
		var nextAnim = this.progressAnimQueue.pop();
		nextAnim();

	}
	else
	{
		this.tlProgress = null;
	}
};


GameScene.prototype.onProgressObjectiveHandler = function()
{

	var self = this
		, tilingGauge      = this.view.getElementById('tilingGauge')
		, frontMobileGauge = this.view.getElementById('frontMobileGauge')
		, backMobileGauge = this.view.getElementById('backMobileGauge')
		, headGauge        = this.view.getElementById('headGauge')
		, barShape         = this.view.getElementById('barShape')
		, scoreText        = this.view.getElementById('scoreText')
		, cGoal            = this.game.goal
		, mode             = this.level.getMode()
		, goals            = mode.findGoals()
		, isIncreasing     = (goals[2] > goals[0])
		, nextGoal         = this.game.appStar
		, totalHeight      = (backMobileGauge) ? backMobileGauge.width : barShape.height-40
		, ratio            = 0
		, heightGoal       = ~~(totalHeight/goals.length)
		, headHeight       = (headGauge) ? headGauge.height : 0
		, myStar           = this.game.getStar();

	this.updateDescriptionObj();

	if(nextGoal < goals.length)
	{
		var oldGoal = (goals[nextGoal-1]) ? goals[nextGoal-1] : 0;
		if(isIncreasing) ratio = Math.min((cGoal - oldGoal)/(goals[nextGoal] - oldGoal), 1);
		else ratio = Math.min((goals[nextGoal] - oldGoal)/(cGoal - oldGoal), 1);

	}

	var y = ~~((heightGoal * this.game.appStar) + (heightGoal*ratio));
	y -= headHeight;
	y = Math.max(0, y);
	var animGoal = function(tl, goalId)
	{
		var onStar = self.view.getElementById('onStar-' + goalId)
			, offStar = self.view.getElementById('offStar-' + goalId);

		var startAt = 0.3 * (goalId) + 0.1;
		tl.to(offStar, 0.15, {alpha: 0}, 'yolo+='+startAt);
		tl.to(onStar, 0.15, {alpha: 1}, 'yolo+='+startAt);

		Util.Sound.fxPlay('fx/etoile_' + (parseInt(goalId, 10)+1));
	}


	var progressAnim = function(){
		if(self.lastCGoal && self.lastCGoal > cGoal)
		{
			self.handleProgressQueue();
			return;
		}
		self.lastCGoal = cGoal;

		var totalDuration = 3;

		if(tilingGauge) {
			var dest = tilingGauge.oriY - y;
			var distance = tilingGauge.position.y - dest;
		} else {
			var dest = y;
			var distance = dest - frontMobileGauge.width;
		}

		if(!y) {
			var duration = 0;
		} else {
			var duration = (totalDuration / totalHeight) *  (distance);
		}

		Util.DisplayText.updateShadowText(scoreText, self.game.score.toString());

		self.tlProgress = new TimelineMax();
		if(tilingGauge) {
			self.tlProgress.to(tilingGauge, duration, {height: y}, 'yolo');

			self.tlProgress.to(tilingGauge.position, duration, {y: dest}, 'yolo');
			self.tlProgress.to(headGauge.position, duration, {y: dest - headHeight + 2}, 'yolo');

			scoreText.position.x = scoreText.centerX - (scoreText.width/2);

			var margin = (y > 20) ? 20 : 0;
			self.tlProgress.to(scoreText.position, duration, {y: dest + margin}, 'yolo');
		} else {
			self.tlProgress.to(frontMobileGauge, duration, {width: dest}, 'yolo');
		}

		if(self.goalAnims.length < goals.length)
		{
			for(var i=self.goalAnims.length; i<goals.length; i++)
			{
				var objY = ~~(totalHeight/3)*(i+1) -headHeight;
				var newStar = (y >= objY && myStar >= i+1);
				if(newStar) {
					animGoal(self.tlProgress, i);
					self.goalAnims.push(true);
				}
			}

		}

		self.tlProgress.call(function(){
			self.handleProgressQueue();
		});

	}

	if(!this.tlProgress) progressAnim();
	else this.progressAnimQueue.push(progressAnim);





};

GameScene.prototype.updateDescriptionObj = function(){

	var mode = this.level.getMode(),
		game = this.game,
		newDesc = mode.getDescription(game.obj1, game.getStar(), game.score, true);

	if(!mode.isHanged())
	{
		if(newDesc !== true) this.updateDescription(newDesc);
		else this.updateDescription( Util.String2.strip(_ts('faire_maximum_de_points')) );
	}
	else
	{
		if(newDesc !== true) {
			var groupTitle = this.view.getElementById('groupTitle')
				, timerContainer = this.view.getElementById('timerContainer')
				, titleBmp       = this.view.getElementById('titleBmp')
				, children       = titleBmp.children
				, childrenLength = titleBmp.children.length;

			for(var i=0; i<childrenLength; i++) {
				children[i].setText(newDesc + ' | ');
			}

			timerContainer.position.x = titleBmp.position.x + titleBmp.width + 15;

		}

		this.lastHangedWord = null;

	}


};

GameScene.prototype.endAnim = function()
{

	var classNames = []
		, cssTexts = [{
			top:-50
		}]
		, textResult
		, tips = null
		, assetsField = this.view.getElementById('assetsField');

	// --------------------------------------------------------------
	// Flash result
	// --------------------------------------------------------------
	if(this.game.hasWin())
	{
		classNames.push('greenCornerTxt');
		textResult = _ts('gagne');
	}
	else
	{
		classNames.push('redCornerTxt');
		textResult = _ts('perdu');
	}


	if(this.game.endReason != Game.MYGame.END_FLOW)
	{
		switch(this.game.endReason)
		{
			case Game.MYGame.END_NO_POSSIBILITY:
				if(this.game.iFish > 0) tips = _ts('aucun_mot_restant');

				break;
		}

		if(tips)
		{
			classNames.push(classNames[0]);
			classNames[0] = 'greyCornerTxt';

			cssTexts.push(cssTexts[0]);
			cssTexts[0] = false;
			textResult = [tips, textResult];
		}

	}

	this._flash(textResult, null, 2, classNames, cssTexts);


	// --------------------------------------------------------------
	// Fish animations
	// --------------------------------------------------------------
	var tl = new TimelineMax()
		,  childrenAsset = assetsField.children
		 , durationGameOpacity = 1
		 , atGameOpacity = '-=1'
		 , fishesView = []
		 , fishesViewScales = []
		 , job = null;

	// var $fishes = $('.fish');

	// TweenMax.to($('#ropeContainer, #hourglassContainer, #descritionMd'), 0.4, {autoAlpha: 0});
	// TweenMax.to($('#ropeContainer, #hourglassContainer, #descritionMd, #bonusControl'), 0.4, {autoAlpha: 0});

	if(this.game.hasWin()) job = function(f) { UI.Fish.toValidate(f, tl); };
	else job = function(f) { UI.Fish.toError(f, tl); };

	this.game.getGrid().eachFish(function(f){
		job(f);
		fishesView.push(f.view);
		fishesViewScales.push(f.view.scale);
	});


	tl.to(fishesView, 0.2, {alpha: 0}, '+=1');
	tl.to(fishesViewScales, 0.2, {y: 1.3}, '-=0.2');
	atGameOpacity = 0.5;

	// var $game = this.$node.find('#game');
	// tl.to($game, durationGameOpacity, {autoAlpha: 0.5, ease: Power2.easeIn}, atGameOpacity);

	tl.call(this.resultScene.bind(this));
};

GameScene.prototype.resultScene = function()
{
	console.log('GameScene::resultScene');

	var scene = (this.game.hasWin()) ? new Scene.WinScene(this.game) : new Scene.DefeatScene(this.game);
	scene.start();

};



GameScene.prototype.close = function()
{
	if(!this.game.hasWin() && this.handleStartLife)
	{
		this.handleStartLife();
		this.handleStartLife = null;
	}

	this.game.cleanAll();
	this.stopRunningAnimation();


	Scene.BaseScene.prototype.close.call(this);

};




GameScene.prototype.saveGame = function()
{
	var app = ATW.App
		, world = this.level.getWorld()
		, worldId = world.getId()
		, levelId = this.level.getId()
		, newScore = (!this.level.getScore() || this.game.getScore() > this.level.getScore())
		, newStar  = (this.game.getStar() > this.level.getStar())
		, lessStar = (this.game.getStar() < this.level.getStar())
		, newDuration = ( !lessStar && (!this.level.getDuration() || this.game.getTotalDuration() < this.level.getDuration()) );
	if(newScore || newStar || newDuration || this.nbPearl)
	{
		var updateData = {};

		if(newScore) updateData.score = this.game.getScore();
		if(newStar) updateData.star = this.game.getStar();
		if(newDuration) updateData.duration = this.game.getTotalDuration();

		this.level.update(updateData);

		updateData.world_id  = worldId;
		updateData.level_id  = levelId;
		updateData.first_name = app.getPlayer().getFirstName();

		app.getDataManager().getApi().call('Score', 'POST', {
			on: 'me',
			data: updateData
		});

	}

	if(!app.getPlayer().isOnSession())
	{
		var cLife = app.getPlayer().life;
		app.getPlayer().life  = cLife+1;

		app.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				// lastVisited: app.getPlayer().getLastVisited(),
				life: app.getPlayer().life
			}
		}, function(res){
			app.getPlayer().myUpdate(res);
		});
	}


};


GameScene.prototype.dispatchAchievement = function()
{
	var world = this.level.getWorld()
		, app = ATW.App
		, am = app.getPlayer().getAchievementManager()
		, nbEmptyGrid = this.game.getIEmptyGrid();

	am.dispatch('GET_POINTS_IN_WORD', { ref: world.getId() }, world.getScore(), true);

	if(this.game.getLife() == this.level.getLife()) {
		am.dispatch('PERFECT_LEVEL', { ref: this.level.getId() });
	}

	if(this.nbPearl) {
		am.dispatch('GET_PEARLS', {ref: {nb: this.nbPearl}}, this.nbPearl);
	}

	if(nbEmptyGrid)	{
		am.dispatch('GET_EMPTY_GRID', {ref: {nb: nbEmptyGrid}}, nbEmptyGrid);
	}

	am.save();
};


GameScene.prototype.stopRunningAnimation = function()
{

	for(var i in this.timersAnim)
	{
		if(this.timersAnim[i])
		{
			this.timersAnim[i].kill();
			this.timersAnim[i] = null;
		}
	}
};


GameScene.prototype.saveStat = function()
{
	var statTrack = {
		level_id: this.level.getId(),
		is_won: (this.game.hasWin()) ? 1 : 0,
		is_reload: (this.displayObjs) ? 1 : 0,
		nb_pearl: this.nbPearl,
		score: this.game.getScore(),
		at_wave: this.game.iWave,
		nb_grid_empty: this.game.getIEmptyGrid(),
		nb_error_word: this.game.getIError(),
		nb_next: this.game.iNext,
		nb_letter_left: this.game.nbLeftFish,
		nb_free_bonus: this.game.nbGiftBonus,
		nb_used_bonus: this.game.nbUsedBonus,
		nb_shp_bonus: this.nbShopBonus
	};

	if(this.level.getMode().isCrossword())
	{
		statTrack.cw_avg_complete = this.game.getAvgCrossword();
	}

	if(statTrack.is_won)
	{
		statTrack.nb_star         = this.game.getStar();
		statTrack.nb_lfe_left    = this.game.getLife();
		statTrack.avg_word_length = this.game.getAvgWordLength();
	} else if(!this.game.getStar() && !this.game.hasCompleteObj()) {
		statTrack.lost_by_all = 1;
	} else if(!this.game.getStar()) {
		statTrack.lost_by_star = 1;
	} else {
		statTrack.lost_by_obj = 1;
	}

	ATW.App.getDataManager().getApi().call('LStat', 'POST', {
		on: 'add',
		data: statTrack
	}, function(res){

	});
};




GameScene.prototype.emptyAlertHandler = function(pts)
{
	var self = this;

	if(this.game.forceLaunchWave)
	{
		this.game.forceLaunchWave = false;
		this.game.wave();
	}
	else if(this.game.timers[Game.MYGame.WAVE_TIMER] && this.game.timers[Game.MYGame.WAVE_TIMER].duration > 1000)
	{
		setTimeout(function(){
			self.game.wave();
		}, 300);
	}



	this._flash([_ts('grille_vide')], null, 0.1, ['greenCornerTxt']);
	Util.Sound.fxPlay('fx/grille_vide');

};


GameScene.prototype.scoreHandler = function(points, type, isGold)
{
	if(typeof type != "undefined" && type == 'CL_BD') return;

	var selectedMap = this.game.getSelectedMap(),
		lastFish = selectedMap[selectedMap.length-1];
	if(!lastFish) return;

	var ground = lastFish.getGround(),
		css = {
			left: ground.getLeft() + 40,
			top: ground.getTop() + 40
		};

	this._scoreAnim(points, css, isGold);
};


GameScene.prototype._scoreAnim = function(points, css, isGold)
{
	if(!points) return;

	var tint = 0x70ff61;
	var shadow = 0x00972f;
	if(isGold) {
		tint = 0xffe611;
		shadow = 0xab6811;
	}

	var self = this
	, text = new PIXI.BitmapText("+" + _ts('x_pts', {':x': points}), {
		font: '40px FredokaOne-Regular',
		tint: tint
	});
	text = Util.DisplayText.shadow(text, 3, 1, shadow, 0.9);
	text.pivot.x = ~~(text.width/2);
	text.pivot.y = ~~(text.height/2);

	text.position.x =  css.left + this.fields.position.x;
	text.position.y = css.top + this.fields.position.y;
	this.addChild(text);

	var tl = new TimelineMax();
	tl.to(text.position, 2, {y: text.position.y - 80, ease: Power2.easeOut});
	tl.to(text, 0.25, {alpha: 0}, '-=0.25');

	tl.call(function(){
		self.removeChild(text);
	});

};


GameScene.prototype.waveHandler = function()
{
	var quantityLeft = this.game.getQuantityLeft();
	// console.log('WaveHandler::quantityLeft', quantityLeft);
	if(quantityLeft < 0) return;

	var fireWaveText = this.view.getElementById('fireWaveText');
	if(!fireWaveText) return;

	for(var i=0; i<fireWaveText.children.length; i++) {
		fireWaveText.children[i].setText(quantityLeft.toString());
	}

	fireWaveText.position.x = -fireWaveText.width/2;
	fireWaveText.position.y = -fireWaveText.height/2;
	if(this.level.getMode().isWreckingBall()){
		fireWaveText.position.y = 10;
	}


	if(quantityLeft == 0) {
		var fireWave = this.view.getElementById('fireWave');
		fireWave.onHit = null;
		fireWave.setTexture(PIXI.Texture.fromFrame('ig_firewave_bg_empty'));

	}
};

GameScene.prototype.waveCutHandler = function(points)
{
	console.log('GameScene::waveCutHandler', points);
	var left = this.fields.width + 20;
	if(ATW.isMobile()){
		left -= 300;
	};

	this._scoreAnim(points, {
		left: left,
		top: +30
	});
};



GameScene.prototype.changeLifeHandler = function(quantity)
{

	var lifeText = this.view.getElementById('lifeText'),
		ghostIco = this.view.getElementById('ghostIco'),
		color = (quantity > 0) ? 0x33FF33 : 0xFF0000,
		self = this;

	if(this.lifeTl)
	{
		this.lifeTl.clear();
		this.lifeTl = null;
	}


	lifeText.setText(this.game.getLife().toString());
	lifeText.updateText();

	lifeText.tint    = color;
	lifeText.pivot.x = ~~(lifeText.width/2);
	lifeText.pivot.y = ~~(lifeText.height/2);

	if(!ATW.isMobile()) lifeText.position.x = ghostIco.position.x - lifeText.pivot.x - 10;
	else lifeText.position.x = ghostIco.position.x + ghostIco.width - lifeText.pivot.x + 30;

	lifeText.position.y = 12 + lifeText.pivot.y;

	lifeText.scale.x = lifeText.scale.y = 2;


	var colorTween = {color: lifeText.tint};
	var tl = new TimelineMax();
	tl.to(colorTween, 0.2, {colorProps: {color: 0xFFFFFF}, onUpdate: function(){
		lifeText.tint = parseInt(Util.Color.rgbToHex(colorTween.color), 16);
		lifeText.updateText();
	}}, 'start');

	tl.to(lifeText.scale, 0.2, {x:1, y:1}, 'start');
	tl.call(function(){
		if(self.lifeTl || self.game.life > 3) return;

		self.lifeTl = new TimelineMax({repeat: -1, repeatDelay:0.2});
		self.lifeTl.to(lifeText.scale, 0.2, {x: 1.5, y:1.5});

		self._addAnim(self.lifeTl);
	});



};




GameScene.prototype._rope = function(resume)
{
	var sec = this.game.getTimer(Game.MYGame.WAVE_TIMER).getDuration()/1000
		, frontRope = this.view.getElementById('frontRope')
		, fireWave = this.view.getElementById('fireWave')
		, sparkle = this.view.getElementById('sparkle');

	if(!resume) {
		if(!ATW.isMobile()) {
			frontRope.height = 578;
			sparkle.position.y = sparkle.oriY;
			sparkle.alpha = 1;
		} else {
			frontRope.width = 0;
		}

	}

	if(this.timersAnim[Game.MYGame.WAVE_TIMER])
	{
		this.timersAnim[Game.MYGame.WAVE_TIMER].clear();
		this.timersAnim[Game.MYGame.WAVE_TIMER] = null;
	}

	if(this.timersAnim['pulseFirewave'])
	{
		this.timersAnim['pulseFirewave'].clear();
		this.timersAnim['pulseFirewave'] = null;
		fireWave.scale.x = fireWave.scale.y = 1.1;
	}

	this.timersAnim[Game.MYGame.WAVE_TIMER] = new TimelineMax();
	if(!ATW.isMobile()) {
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(frontRope, sec, {height:17, ease: Linear.easeNone}, 'start');
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(sparkle.position, sec, {y:-5, ease: Linear.easeNone}, 'start');
	} else {
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(frontRope, sec, {width:341, ease: Linear.easeNone}, 'start');
	}


	var midSec = sec/2;
	this.timersAnim['pulseFirewave'] = new TimelineMax({delay: midSec, repeat:-1, repeatDelay: 0.23});
	this.timersAnim['pulseFirewave'].to(fireWave.scale, 0.5, {x:1.3, y:1.3, ease: Elastic.easeOut});
};


GameScene.prototype._hourglass = function(resume)
{

	return;

	var sec = this.game.getTimer(MYGame.HOURGLASS_TIMER).getOriDuration()/1000;
	var $hourglass = this.$node.find('#hourglassContainer .hourglass');



	if(this.timersAnim[MYGame.HOURGLASS_TIMER])
	{
		this.timersAnim[MYGame.HOURGLASS_TIMER].kill();
		this.timersAnim[MYGame.HOURGLASS_TIMER] = null;
	}

	this.timersAnim[MYGame.HOURGLASS_TIMER] = new TimelineMax();
	this.timersAnim[MYGame.HOURGLASS_TIMER].to($hourglass.find('.bottomSand'), sec, {
		height: 18,
		ease: Linear.easeNone
	}, 'start');
	this.timersAnim[MYGame.HOURGLASS_TIMER].to($hourglass.find('.topSand'), sec, {
		height: 0,
		ease: Linear.easeNone
	}, 'start');


};



GameScene.prototype._flash = function(text, cb, endDuration, classNames, cssTexts)
{
	var container = new PIXI.DisplayObjectContainer(),
		baseClassName = 'greyCornerTxt',
		tl = new TimelineMax(),
		time = 0,
		word, element, duration, i,
		self = this;

	if(typeof endDuration == "undefined" || endDuration == null) var endDuration = 0.6;

	if(typeof text == "string") var words = text.split(" ");
	else var words = text;

	var wordCount = words.length;

	this.addChild(container);

	var oriTxt = {autoAlpha:0, scale:0, z:0.01};
	var toScale = 1.2;
	for(i = 0; i < wordCount; i++)
	{
		word = words[i];
		var isSentenceEnd = i==wordCount-1,
			className = (classNames && classNames[i]) ? classNames[i] : baseClassName
			, fontSize = (word.length > 7 && word.indexOf(' ') != -1) ? 130 : 180
			, tint = 0xFFFFFF
			, shadow = 0x0d0d0d
			, shadowAlpha = 0.5;

		if(className == 'greenCornerTxt') {
			tint = 0x70ff61;
			shadow = 0x00972f;
			shadowAlpha = 1;
		} else if(className == 'redCornerTxt') {
			tint = 0xff5a42;
			shadow = 0xbd1417;
			shadowAlpha = 1;
		}

   		var element = new PIXI.BitmapText(word, {
   			font: fontSize+"px FredokaOne-Regular",
   			tint: tint,
   			align: "center"
   		});
   		element = Util.DisplayText.shadow(element, 2, 0, shadow, shadowAlpha);

   		var renderTexture = new PIXI.RenderTexture(~~element.width+1, ~~element.height+20);
   		var sprite = new PIXI.Sprite(renderTexture);
   		sprite.anchor.x = sprite.anchor.y = 0.5;
   		sprite.position.x = ATW.gameMidWidth();
   		sprite.position.y = ATW.gameMidHeight();
		container.addChild(sprite);

		renderTexture.render(element);


		duration = Math.max(0.5, word.length * 0.08);
		if (isSentenceEnd)
		{
			duration += endDuration;
    	}


    	TweenLite.set(sprite, {alpha:0});
    	TweenLite.set(sprite.scale, {x:0, y:0});
		tl.to(sprite.scale, duration, {x:1.2, y:1.2,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
		 	.to(sprite, duration, {alpha:1, ease:SlowMo.ease.config(0.25, 0.9, true)}, time);
    	time += duration - 0.05;
    	if (isSentenceEnd) time += endDuration;

  	}

  	tl.call(function(){
  		self.removeChild(container);
  		if(cb) cb();
  	});
};

GameScene.prototype.restart = function(){

	var player = ATW.App.getPlayer();

	this.onClose = function(){

		if(!player.hasLife() && !player.isOnSession()) {
			var levelScene = new Scene.LevelScene(this.level.getWorld());
			levelScene.start();
			levelScene.firePopupLife();
		} else {
			var gameScene = new Scene.GameScene(this.level, true);
			gameScene.start();
		}

	}

	this.close();



};

GameScene.GAME_VIEW = 0;
GameScene.PAUSE_VIEW = 1;

exports.GameScene = GameScene;

})(window.Scene = window.Scene || {});





