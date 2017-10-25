'use strict';
(function(exports){

function MYGame(param)
{
	this.scene = param.scene;
	this.endReason         = null;
	this.level             = param.level;
	this.life              = this.level.getLife();
	this.timers            = {};
	this.words             = [];
	this.word              = new Game.Word();
	this.fishes            = {};
	this.score             = 0;
	this.appStar              = 0;
	this.standAnimation    = {};
	this.hoverAnimation    = {};
	this.playing     = false;
	this.goal        = 0;
	this.obj1        = 0;
	this.iWave       = 0;

	this.nbUsedBonus = 0;
	this.startAt           = null;
	this.pauseAt           = null;
	this.pauseDuration     = 0;
	this.totalDuration     = 0;
	this.pearls            = [];
	this.selectedFishesMap = [];
	this.dirBuilder        = null;

	this.nbGiftBonus    = 0;
	this.nbSavedFish     = 0;
	this.iEmptyGrid     = 0;
	this.iError         = 0;
	this.scoreMax       = 0;
	this.emptyGridScore = 0;
	this.wavesScore     = 0;
	this.iNext          = 0;
	this.isRealWord = null;
	this.currentTimeout = {};
	this.online = ATW.App.getDataManager().isOnline();

	var cLevel = this.level.getConf();

	this.grid  = new Game.Grid(this, JSON.parse(cLevel.grid), cLevel.background_color);
	this.iFish = this.grid.nbInitFish;

	this.tuto = cLevel.tuto;

	this.level.getWaveHandler().init(this);

	this.nbGeneratedWord = 0;
	if(this.level.getMode().isCrossword())
	{
		this.nbGeneratedWord = this.level.getMode().getStar3();
	}

	this.isReady = false;
	if(!this.generateMysteryWord())
	{
		this.isReady = true;
	}

	this.highscore    = this.level.getScore();
	this.highstar     = this.level.getStar();
	this.highduration = this.level.getDuration();

	this.immuneWave = 0;
	this.immunity = false;
	this.kills = {};
	this.isFreeze = false;
	this.builderShow = false;
	this.isSubmiting = false;
	this.hangedBonus = null;
	this.hangedError = {};

	this.animateBombs = {
		tls: {},
		i: 0
	};

	this.waveEnable = true;
	this.wordsSummarize = [];
	this.writtenBonus = {};


};


/**
* Lance d'une nouvelle vague
*/
MYGame.prototype.wave = function(isManual)
{
	if(!this.waveForce
		&& (!this.waveEnable
				|| !this.playing
				|| (this.iWave && this.level.getMode().needFullGrid() && !this.level.getMode().isWreckingBall()))

	) {
		return false;
	}

	this.waveForce = false;

	if(isManual)
	{
		if(this.level.getNbWave() != -1 && this.getQuantityLeft() <= 0) return false;

		this.iNext++;
	}


	console.log("Nouvelle vague", this.getQuantityLeft());
	Util.Sound.fxPlay('fx/vague');
	this.waveEnable = false;

	var self = this;

	this.immunity = false;
	if(this.immuneWave)
	{
		this.immunity = true;
		this.immuneWave--;
	}

	this.iWave++;

	if(this.hasTimer(MYGame.WAVE_TIMER))
	{
		// Ajoute un score en fonction du temps restant
		var secLeft = Math.max(0, this.getTimer(MYGame.WAVE_TIMER).getDuration()/1000);
		var points = ~~(secLeft * Util.Math2.castInt(ATW.Datas.CONFIGS.GAME_WAVE_SEC_COEFF));

		this.wavesScore += points;
		this._addPoints(points, this.onWaveCut);

		this.killTimer(MYGame.WAVE_TIMER);
	}

	this.handleObjective('new_wave');

	// --------------------------------------------------------------
	// Recupère les nouveaux poisonns pour les ajouter a notre grille
	// --------------------------------------------------------------

	var waveQuantity = this.level.getNbWave();

	this.wordTutoBoard = null;
	var isFirstTuto = false;
	var currentLevelTuto = this.level.hasTuto();

	if(currentLevelTuto === 0 && this.iWave == 1)
	{
		// Tuto niveau 1 vague 1
		isFirstTuto = true;
		var refWord = _ts('tuto_ecrit_joue');

		this.wordTutoBoard = refWord.toUpperCase().split('');
		var x = this.wordTutoBoard.slice(0);
		x.push('M');

		var freshFish = Game.Grid.generateWord(this.grid, x);
	}
	else if(currentLevelTuto === 1 && this.iWave <= 2)
	{
		if(this.iWave == 1)
		{
			var randWord = _ts('tuto_ecrit_deux');
			randWord = randWord.toLowerCase();

			this.wordTutoBoard = randWord.split('');
			var clone = this.wordTutoBoard.slice(0);
			if(ATW.App.getPlayer().getLang() != 'es' && ATW.App.getPlayer().getLang() != 'it'){
				clone.push('T');
			} else {
				clone.push('O');
			}
			var freshFish = Game.Grid.generateWord(this.grid, clone);
		}
		else
		{
			this.forceWord = _ts('tuto_ecrit_points');
			this.forceWord = this.forceWord.toLowerCase();
			// var ri = rand(0, this.forceWord.length-1);
			if(ATW.App.getPlayer().getLang() != 'es' && ATW.App.getPlayer().getLang() != 'it') {
				var ri = this.forceWord.toUpperCase().indexOf('T');
			} else {
				var ri = this.forceWord.toUpperCase().indexOf('O');
			}
			var x = this.forceWord.slice(0,ri) + this.forceWord.slice(ri+1);
			x = x.toUpperCase();

			var freshFish = Game.Grid.generateWord(this.grid, x.split(''));

		}
	}
	else if(currentLevelTuto === 2 && this.iWave == 1)
	{
		var freshFish = Game.Grid.generateWord(this.grid, ['B','E','Q', 'R', 'A'], true);
	}
	else
	{
		var freshFish = (waveQuantity == -1 || this.iWave <= waveQuantity) ? this.level.getWaveHandler().next() : [];
		if(this.hangedTuto)
		{
			var wordToInclude = _ts('tuto_pendu_a_tester');
			this.wordTutoBoard = wordToInclude.split('');
		}

	}

	self.activeTutoWave = (currentLevelTuto === 0 && this.iWave == 2);

	var dir = (!this.level.getMode().needFullGrid()) ? 1 : -1;

	if(this.onWave) this.onWave();


	// --------------------------------------------------------------
	// Fait descendre tous les poissons
	// --------------------------------------------------------------

	var generateWords = null;
	var mode = this.level.getMode();
	// Definit la strategie de generation de mot
	if(mode.isCrossword())
	{
		generateWords = {
			words: mode.getStar3(),
			acceptedRange: mode.getArg2(),
			inline: false
		};
	}
	else if(mode.isWreckingBall())
	{

	}
	else if(mode.isHanged())
	{

		if(this.hangedTuto) {
			generateWords = {
				wordHanged: _ts('tuto_pendu_a_tester').toUpperCase()
			};
		}

	}
	else if(this.tuto[this.iWave] && !ATW.App.getPlayer().isTutoFisnish(this.tuto[this.iWave]))
	{
		generateWords = {
			word: Game.Grid.TutoToBonus[this.tuto[this.iWave]],
			tuto: true,
			noRand: true
		};
	}


	var translate = this.grid.drop(freshFish.res, dir, generateWords);


	this.iFish += this.grid.getNbLastDrop();

	// --------------------------------------------------------------
	// Animation des elements
	// --------------------------------------------------------------
	var nbFishDead = 0;
	if(translate.length)
	{
		var fishesByLetter = {};
		for(var i=0; i<translate.length; i++) {
			var trans   = translate[i];

			if(trans.updateWallOnGround)
			{
				var ground = trans.updateWallOnGround;
				UI.Ground.destructWall(this.view, ground);

				if(trans.updateWallOnGround.hasLetterFish())
				{
					var uGround = trans.updateWallOnGround,
						wallFish = uGround.getLetterFish();

					TweenLite.to(wallFish.view.scale, 0.4, {y: 1.3, x: 0.9, ease: Elastic.easeOut});
					TweenLite.to(wallFish.view.scale, 0.2, {y: 1, x: 1});
				}

			}

			var fish = trans.fish;
			if(!fish) continue;

			fish.onKill = function(f){
				var gr = f.getGround();
				if(gr.hasHole() && gr.getLetterFish())
				{
					var foreignFish = gr.getLetterFish();
					Util.Sound.fxPlay('fx/meduse_tombe_trou');

					gr.getHole().suck();

					self.addMaskHole(foreignFish);
					TweenMax.to(foreignFish.view.position, 0.4, {y: '+=' + ATW.config.game.HOLE_SHIFT_TOP_BY, delay:0.3});
				}

			}


			if(!fishesByLetter[fish.getLetter()]) fishesByLetter[fish.getLetter()] = [];
			fishesByLetter[fish.getLetter()].push(fish);


			var instructions = [];
			var tlTranslate = new TimelineMax();

			if(!fish.created)
			{
				var groundRececeiver = trans.groundRececeiver;

				fish.onHit = function(fish){
					return function() {self.select(fish)};
				}(fish)

				UI.Fish.createView(this.view, fish);
				fish.view.position.x += groundRececeiver.getLeft() + 5;
				var toTop = fish.view.position.y + groundRececeiver.getTop() - 25;
				if(fish.isInHole()) toTop += ATW.config.game.HOLE_SHIFT_TOP_BY;

				fish.view.position.y = trans.position.top;
				fish.view.alpha = 0;
				// this.assetsField.addChildAt(fish.view, 1);
				this.assetsField.addChildAt(fish.view, 0);

				tlTranslate.to(fish.view, 0.65, {alpha:1}, 'start');
				tlTranslate.to(fish.view.position, 0.65, {y: toTop}, 'start');
			}
			else if(!mode.isWreckingBall())
			{
				// var currentTop = $fish.position().top;
				// var oriTop = trans.position.top - AroundTheWords.FISH_SHIFT_BY;
				var oriTop = trans.position.top + 20;
				if(fish.isInHole()) oriTop += ATW.config.game.HOLE_SHIFT_TOP_BY;


				if(!trans.jump)
				{
					if(fish.isAlive()) tlTranslate.to(fish.view.position, 0.65, {y: oriTop}, 'start');
					else tlTranslate.to(fish.view.position, 0.4, {y: oriTop}, 'start');
				}
				else
				{
					var onComp = (
						function(fish, topDest) {
							return function() {
								fish.view.position.y = topDest;
							}
						}
					)(fish, oriTop);
					tlTranslate.to(fish.view, 0.2, {alpha: 0, onComplete: onComp}, 'start');
					tlTranslate.to(fish.view, 0.15, {alpha: 1});


				}

			}

			if(trans.destroyBonus)
			{
				var groundReceiver = trans.groundRececeiver
					, bonus = this.view.getElementById('bonus_' + groundReceiver.getId());

				tlTranslate.to(bonus, 0.3, {alpha:0, onComplete: function(bonus){
					return function(){
						self.assetsField.removeChild(bonus);
					}
				}(bonus)}, "-=0.25");
				tlTranslate.to(bonus.position, 0.3, {y:groundReceiver.getTop()-21, ease:Back.easeOut}, "-=0.25");

			}

			if(trans.destroyPearl)
			{
				var groundReceiver = trans.groundRececeiver
					, pearl = this.view.getElementById('pearl_' + groundReceiver.getId());

				pearl.cacheAsBitmap =  null;
				tlTranslate.to(pearl, 0.3, {alpha:0, onComplete: function(pearl){
					return function(){
						self.assetsField.removeChild(pearl);
					}
				}(pearl)}, "-=0.25");
				tlTranslate.to(pearl.position, 0.3, {y:groundReceiver.getTop()-21, ease:Back.easeOut}, "-=0.25");


			}


			// Detruit les poissons morts
			if(!fish.isAlive() && !fish.isValidate())
			{

				if(mode.isWreckingBall() && fish.getGround())
				{
					this._explodeAnim(fish.getGround());
				}

				nbFishDead++;
				// FishAnimator.toError($fish, tlTranslate, fish);
				UI.Fish.toError(fish, tlTranslate);

				instructions.push(function(pFish) {
					return function(){
						self.tutoKillFishAllow = true;
						self.killFish(pFish, null, function(){
							self.addHeartBreak(pFish);
						});
					};
				}(fish));

			}
			else if(fish.hasEat())
			{
				var bonus = fish.getBonus();
				if(bonus && bonus.isBomb() && bonus.anim)
				{
					bonus.anim.clear();
					bonus.anim = null;
				}
				UI.Fish.toBig(fish, tlTranslate);
			}

			if(fish.isInHole()) {
				Util.Sound.fxPlay('fx/meduse_tombe_trou');

				this.addMaskHole(fish);

			} else {
				var ground = fish.getGround();

				if(ground.hasHole() && ground.getHole().getLetterFish()) {

					var foreignFish = ground.getHole().getLetterFish();
					// replace l'index
					this.assetsField.setChildIndex(foreignFish.view, 0);

				}

				fish.view.mask = null;


			}


			var executeInstruction = function(pInstructions){
				return function(){
					// Lance toutes les instructions
					for(var x in pInstructions)
					{
						pInstructions[x]();
					}

					if(self.activeTutoWave)
					{
						// var $fireWave = $('#fireWave');
						var fireWave = self.view.getElementById('fireWave')
							, waveContainer = self.view.getElementById('waveContainer');

						var boundingFire = {
							x: fireWave.position.x + waveContainer.position.x - fireWave.width/2,
							y: fireWave.position.y + waveContainer.position.y - fireWave.height/2 ,
							width: fireWave.width,
							height: fireWave.height
						};

						// if(!ATW.isMobile()){
						// 	boundingFire
						// }

						var sqLeft = self.getQuantityLeft();
						var s5 = _ts('vague_explication');

						var tutoBoardWave = new UI.PopupTutoBoard([
							{
								hit: boundingFire,
								txt: Util.String2.strtr(
									s5, {
										':x' : sqLeft
									}
								),
								noArrow: true
							},

							{
								hit: boundingFire,
								txt: _ts('declencher_vague'),
								noCheck: true,

								onEnter: function() {
									// $fireWave.mouseenter();
								},
								onLeave: function() {
									// $fireWave.mouseleave();
								},
								onClick: function() {
									Scene.BaseScene.current.resume();
									// self.waveForce = true;
									self.displayContinueTuto = true;
									fireWave.onHit();
								}
							}



						]);
						tutoBoardWave.open();

						self.activeTutoWave = false;
						return;
					}



					if(!self.wordTutoBoard) return;

					self.launchWordTutoBoard(self.wordTutoBoard, fishesByLetter, isFirstTuto);
					self.wordTutoBoard = null;
					isFirstTuto = false;


				};
			}(instructions);

			tlTranslate.call(executeInstruction);

		}



		if(nbFishDead)
		{
			var _decrLife = function _decrLife(by){
				if(self.immunity) return;

				self._changeL(by);
			}


			// La destruction des lettres ne doit pas impacter notre mot
			var nbSelectedDead = this.countNbSelectedDead();
			if(nbSelectedDead)
			{
				this.submitWord(function(res){
					if(!res.success){
						_decrLife(-nbFishDead);
					} else {
						_decrLife(-nbFishDead+nbSelectedDead);
					}
				});

			}
			else
			{
				_decrLife(-nbFishDead);
			}
		}


	}

	setTimeout( function() {
		self.waveEnable = true;
	}, 500);



	if(nbFishDead) Util.Sound.fxPlay('fx/meduse_tombe_plateau');


	// Le mode simple se termine lorsqu'on ne peut plus faire de mot
	var realNbFish = this.iFish - nbFishDead;

	if(this.life<=0)
	{
		this.handleWaveContinue(MYGame.END_FLOW);
	}
	else
	{
		var self = this;
		this.handlePossibility(this.handleWaveContinue.bind(this), function(){
			self.handleWaveContinue(MYGame.END_NO_POSSIBILITY);
		});
	}

	if(this.grid.currentTuto.length)
	{
		this.resetWord(true);
		for(var i in this.grid.currentTuto)
		{
			var fish = this.grid.currentTuto[i];
			fish.onHit();

		}


		var self = this;
		var tutoKey = this.tuto[this.iWave];
		var dontPopup = false;
		if(!ATW.App.getPlayer().isTutoFisnish(tutoKey))
		{
			self.dontFireBonusEnd = true;
			setTimeout(function(){


				// var $validWord = $('#validWord');
				var validWord = self.view.getElementById('btnSubmit');

				if(!self.boundingSubmit)
				{
						var wordContainer = self.view.getElementById('wordContainer');
						self.boundingSubmit = {
							// x: validWord.position.x + validWord.width/2 - 10,
							x: wordContainer.position.x + validWord.position.x - validWord.width/2,
							// y: validWord.position.y -10,
							y: validWord.position.y +wordContainer.position.y -validWord.height/2,
							width: validWord.width,
							height: validWord.height
						};

				}

				var boardTxt = '';
				if(tutoKey == 'joker') boardTxt = _ts('ecrire_mot_joker');
				else if(tutoKey == 'aide') boardTxt = _ts('ecrire_mot_aide');
				else if(tutoKey == 'bouh')
				{
				 	boardTxt = _ts('ecrire_mot_bouh', {
				 		':x': 5
				 	});

				}
				else if(tutoKey == 'stop')
				{
					boardTxt = _ts('ecrire_mot_stop', {
						':x': 10
					});

				}
				else if(tutoKey == 'double') boardTxt = _ts('ecrire_mot_double');
				else if(tutoKey == 'cinq')
				{
					boardTxt = _ts('ecrire_mot_cinq', {
						':x': 5
					});
				}
				else if(tutoKey == 'glace')
				{
					boardTxt = _ts('ecrire_mot_glace', {
						':x': ATW.Datas.CONFIGS.GAME_FREEZE_TIME
					});

				}
				else
				{
					self.onTuto(tutoKey);
				}

				if(boardTxt.length)
				{
					var t = new UI.PopupTutoBoard([
						{
							hit: self.boundingSubmit,
							noCheck: true,
							txt: boardTxt,
							onEnter: function() {
								// $validWord.mouseenter();
							},
							onLeave: function() {
								// $validWord.mouseleave();

							},
							onClick: function() {
								// $validWord.click();
								validWord.onHit();
							}
						}
					]);

					t.onComplete = function(){
						self.onTuto(tutoKey, null, true);
					};

					t.open();
				}
			}, 250);
		}

	}

	if(this.displayContinueTuto) {
		var tutoContinue = new UI.PopupTutoBoard([{
			txt: _ts('continue_a_jouer'),
			noArrow: true
		}]);
		tutoContinue.open();
		this.displayContinueTuto = false;
	}

	console.log('=== Wave handler end');

	return true;
};

MYGame.prototype.handleWaveContinue = function(endReason)
{
	if(endReason)
	{
		var self = this;
		setTimeout(function(){
			self.end(endReason);
		}, 1000);
	}
	else
	{
		var mode = this.level.getMode();
		if(!mode.needFullGrid()  || mode.isWreckingBall())
		{

			this.createTimer(MYGame.WAVE_TIMER);
		}

		if(!this.hasTimer(MYGame.HOURGLASS_TIMER) && mode.hasHourglass())
		{
			this.createTimer(MYGame.HOURGLASS_TIMER);

		}

	}


};

MYGame.prototype.addHeartBreak = function(fish)
{
	if(this.level.getMode().isHanged()) return;

	var ground = fish.getGround()
		, container = new PIXI.DisplayObjectContainer()
		, self = this;

	container.position.x = ground.getLeft() + 8;
	container.position.y = ground.getTop();

	var ghost = PIXI.Sprite.fromFrame('ig_ghost');
	ghost.alpha = 0;
	container.addChild(ghost);


	var txt = new PIXI.BitmapText('-1', {font: "45px FredokaOne-Regular"});
	txt = Util.DisplayText.shadow(txt, 3, 1, 0x365ad2, 0.7);
	txt.position.x = ghost.width/2 - txt.width/2;
	txt.position.y = 10;
	txt.alpha = 0;
	container.addChild(txt);

	this.assetsField.addChild(container);

	var tl = new TimelineMax();

	tl.to(ghost.position, 0.5, { y: ghost.position.y - 25}, 'start');
	tl.to(ghost, 0.2, { alpha: 1 }, 'start');
	tl.to(ghost, 0.35, { alpha: 0 }, 'start+=0.4');
	tl.to(txt.position, 0.8, {y: txt.position.y - 30}, 'start+=0.2');
	tl.to(txt, 0.2, {alpha:1}, 'start+=0.2');
	tl.to(txt, 0.4, {alpha:0}, 'start+=0.6');

	tl.call(function(){
		self.assetsField.removeChild(container);
	});

};


MYGame.prototype.addMaskHole = function(fish) {
	var ground = fish.getGround();
	var maskHole = new PIXI.Graphics();
	maskHole.beginFill()
	// maskHole.beginFill(0xde7b1b)
		.drawRoundedRect(0 , 0, 75, 150, fish.view.width)
		.endFill();
	maskHole.position.x = ground.getLeft() + 1;
	maskHole.position.y = ground.getTop() - 78;

	// maskHole.alpha = 0.8;
	this.assetsField.addChild(maskHole);
	fish.view.mask = maskHole;
};

MYGame.prototype.countNbSelectedDead = function()
{
	var nb = 0;
	for(var i in this.selectedFishesMap)
	{
		if(!this.selectedFishesMap[i].isAlive()) nb++;
	}
	return nb;
};

MYGame.prototype.killFish = function(fish, tl, cb)
{
	if(this.kills[fish.getId()]) return;

	if(!tl) var tl = new TimelineMax();


	var self = this;

	this.iFish -= 1;
	this.iFish = Math.max(this.iFish, 0);

	this.kills[fish.getId()] = true;

	if(this.iFish <= 0 && !this.endReason)
	{
		if(!this.level.getMode().isWreckingBall() || this.getQuantityLeft() > 0)
		{
			var wonScore = Util.Math2.castInt(ATW.Datas.CONFIGS.GAME_CLEAN_BOARD);
			this.emptyGridScore += wonScore;

			this._addPoints(wonScore, null, 'CL_BD');
			this.iEmptyGrid++;
			this.onEmptyAlert(wonScore);
		}

		if(this.level.hasTuto() === 1 && !this.emptyGridTuto)
		{
			this.emptyGridTuto = true;

			var emptyGrid = new UI.PopupTutoBoard([
				{
					txt: _ts('grille_vide_realiser', {
						':x': ' '+wonScore
					})
				},
				{
					txt: _ts('objectif_continue')
				}
			]);

			emptyGrid.open();

		}
	}


	fish.kill();

	// var $fish = $('#fish-' + fish.getId());
	var self = this;
	tl.to(fish.view, 0.15, {
		alpha: 0,
		onComplete: function() {
			// $fish.remove();
			self.assetsField.removeChild(fish.view);
			self.cleanFish(fish.getId());

			if(cb){
				cb();
			}

		}
	}, 'killfish');

	if(this.level.hasTuto() === 2 && !this.tutoKillFish && this.tutoKillFishAllow)
	{
		this.tutoKillFish = true;


		var t = new UI.PopupTutoBoard([
			{
				txt: _ts('oh_non_perte_fantome')
			}
		]);

		t.onComplete = function()
		{

			var highlightCountTuto = function()
			{

				// var $gameLife = $('#gameLife');
				// var bounding = DOMHelper.getNoScaleBoundingClient($gameLife[0], UI.PopupTutoBoard.border, 50);
				var ghostContainer = self.view.getElementById('ghostContainer');
				var bounding = {
					x: ghostContainer.position.x,
					y: ghostContainer.position.y,
					width: ghostContainer.width,
					height: ghostContainer.height
				}
				var t2 = new UI.PopupTutoBoard([
					{
						hit: bounding,
						txt: Util.String2.strtr(_ts('tu_as_droit_a_x_fantomes'), {
							':x': self.life
						})
					}
				]);
				t2.open();
			};

			var p = new UI.PopupTuto('kill_fish', true, true);
			p.open();

			if(p.active) p.onClose = highlightCountTuto;
			else highlightCountTuto();

		}

		t.open();
	}

};

MYGame.prototype.cleanFish = function(fishID)
{

	Game.LetterFish.delete(fishID);
};


MYGame.prototype.handleObjective = function(fromType)
{
	var hasProgress = false;
	var hasProgressObj1 = false;
	var mode = this.level.getMode();
	var delay = 0;
	var self = this;
	if(!this.level.isScoringActive())
	// if(false)
	{
		switch(mode.getKey())
		{

			case 'SIMPLE':
				// hasProgress = (fromType == 'valid_word');
				if(fromType == 'valid_word')
				{
					this.obj1++;
					hasProgressObj1 = true;
				}
				break;

			case 'HANGED':
				// Trouves un mot de x lettres en y vagues


				if(fromType == 'valid_word' && this.mysteryWord == this.hangedWord)
				{
					this.obj1++;
					hasProgressObj1 = true;

					delay = 1000;

					self.generateMysteryWord();
					setTimeout(function(){
						self.onHangingProgress();
					}, delay + 500);

				}
				break;

			case 'SURVIVAL':
				// hasProgress = (fromType == 'new_wave');
				if(fromType == 'new_wave' && this.iWave > 1)
				{
					this.obj1++;
					hasProgressObj1 = true;

				}

				break;


			case 'WRECKING_BALL':
				// hasProgress = (fromType == 'valid_word' && this.iFish <= mode.getY());

				if(fromType == 'valid_word')
				{
					// this.goal = this.iFish-1; // Le -1 palie au ++ d'apres ;)
					// this.goal += this.words[this.words.length-1].length - 1;
					this.obj1 += this.words[this.words.length-1].length;
					hasProgressObj1 = true;
				}

				break;

			case 'CROSSWORD':
				if(fromType == 'valid_word')
				{
					this.obj1++;
				}
				break;
		}
	}
	else if(fromType == 'add_score')
	{
		this.obj1 += this.score;
	}

	hasProgress = (fromType == 'add_score');
	if(hasProgress)
	{
		// this.goal = this.score - 1;
		this.goal = this.score;
	}

	if(hasProgress || hasProgressObj1)
	{
		// this.goal++;

		// Met a jour notre nombre d'etoile si besoin
		var starsGoal = this.level.getMode().findGoals();
		var isIncreasing = (starsGoal[2] > starsGoal[0]);
		for(var seekStar=this.appStar; seekStar<starsGoal.length; seekStar++)
		{
			var cond = (isIncreasing) ? (starsGoal[seekStar] <= this.goal) : (starsGoal[seekStar] >= this.goal);
			if(cond)
			{
				this.appStar = seekStar + 1;
			}
		}

		var progressEnd = function()
		{
			if(self.onProgressObjective) self.onProgressObjective();
			if(self.level.getMode().isFinish(self.appStar)) self.end(MYGame.END_FLOW);

		}

		if(!delay) progressEnd();
		else setTimeout(progressEnd, delay);


	}
};

MYGame.prototype.tryHangedLetter = function(letter, fireCb)
{
	var hangingProgress = false;
	// Recherche les emplacements de cette lettre dans notre mot mystere
	for(var i=0; i<this.mysteryWord.length; i++)
	{
		if(this.mysteryWord[i].toUpperCase() == letter.toUpperCase() && this.hangedWord[i]== '_')
		{
			hangingProgress = true;
			// this.hangedWord[i] = fsLetter;
			this.hangedWord = this.hangedWord.substr(0, i) + letter + this.hangedWord.substr(i + 1);;
		}
	}

	if(fireCb && hangingProgress && this.onHangingProgress)
	{
		this.onHangingProgress();
	}

	return hangingProgress;
};


MYGame.prototype.cleanLag = function(){
	if(!this.loaderLag) return;

	if(this.lag) {
		this.lagOnStop();
		this.lag = false;
	}
	clearTimeout(this.loaderLag);
	this.loaderLag = null;
};

MYGame.prototype.submitWordHandler = function(cb)
{
	console.log('MYGame::submitWordHandler');
	var self = this
		, mode = this.level.getMode()
		, isCrossword = mode.isCrossword()
		, isHanged = mode.isHanged()
		, currentWord = this.word.getCurrent()
		, oriWord = this.word.getCurrent()
		, jokers = null
		, error = false
		, existWord = true
		, delayClean = 0
		, isDouble = false
		, nbKillF = 0
		, pearlsGain = [];

	this.forceWord = null;


	this.cleanLag();

	if(mode.isHanged() && currentWord.length != mode.getX()) return;

	if(oriWord.indexOf(Game.LetterFish.JOKER) != -1)
	{
		jokers = {};
		for(var i=0; i<oriWord.length; i++)
		{
			var letter = oriWord[i];
			if(letter == Game.LetterFish.JOKER) jokers[i] = true;

		}
	}

	// this.word.applyJoker();


	console.log('this.isRealWord', this.isRealWord);
	if( this.isRealWord /*|| Grid.BonusWord[currentWord.toUpperCase()]*/
	// if( true
		&& ( !mode.isCrossword() || (mode.isCrossword() && currentWord.length >= mode.getArg2()) )
	) {
		this.hangedBonus = null;


		// Anime les jokers
		if(this.isRealWord != true && oriWord.indexOf(Game.LetterFish.JOKER) != -1)
		{
			this.word.setCurrent(this.isRealWord);

			for(var i in oriWord)
			{
				if(oriWord[i] == Game.LetterFish.JOKER)
				{
					this.selectedFishesMap[i].setLetter(this.isRealWord[i]);
					// UI.Fish.simpleLetter(this.selectedFishesMap[i]);
				}

			}

			this.refreshWord();
			delayClean = 350;
		}

		var wordScore = this.word.getScore(),
			wordDone = this.word.getCurrent(),
			unallow = (!mode.isSimple() || wordDone.length >= mode.getX()) ? false : true;

		this.words.push(wordDone);

		// Supprime les lettres utilisées
		for(var fishId in this.fishes)
		{
			var fish = Game.LetterFish.find(fishId);

			if(!fish) continue;
			if(fish.isDouble()) isDouble = true;
			if(!isHanged) fish.setValidate(true);

			fish.setGrey(unallow);

			if(!isCrossword && !isHanged)
			{
				fish.setHp(0);
				this.nbSavedFish++;
			}

			var tl = new TimelineMax();

			// var $fish = $('#fish-' + fish.getId());
			var completeValidation = null;
			if(isHanged)
			{
				completeValidation = function(fish){
					return function(){
						UI.Fish.toDefault(fish);
					}
				}(fish);
			}
			UI.Fish.toValidate(fish, tl, completeValidation);

			// --------------------------------------------------------------
			// Utilisation des bonus en validation de mot
			// --------------------------------------------------------------
			var bonusKey = (fish.hasBonus()) ? fish.getBonus().getKey() : null;
			fish.setBonus(null);

			if(bonusKey)
			{
				switch(bonusKey)
				{
					case Game.Grid.BONUS_BOMB:
						// Explose la grille a l'endroit indique
						var ground = fish.getGround();
						var result = this.grid.explode(ground.getLine(), ground.getCol());

						for(var i in result)
						{
							if(result[i].fishId != null)
							{
								var delay = (result[i].ground.isEqualTo(ground)) ? 0 : 200;
								this._explodeAnim(result[i].ground, delay);
								var f = Game.LetterFish.find(result[i].fishId);

								if(!this.fishes[result[i].fishId])
								{
									nbKillF++;
									UI.Fish.toError(f, tl);
									this.killFish(f, tl, function(pFish){
										return function(){
											self.addHeartBreak(pFish);
										}
									}(f));

								}
								else
								{
									this.killFish(f, tl);
								}
							}

						}

						break;

					default:
						if(!isHanged)
						{
							this.killFish(fish, tl);
						}
						else if(fish.oldLetter)
						{
							fish.setLetter(fish.oldLetter);
							fish.oldLetter = null;
							Game.LetterFish.regenLetter(fish);
						}

						break;
				}

			}
			else if(!isCrossword && !isHanged)
			{
				this.killFish(fish, tl);
			}


			// Sauvegarde les perles récupérés
			// Pb en mot croisé
			if(fish.hasPearl())
			{
				if(!fish.doNotEatAgain)
				{
					this.pearls.push(fish.getPearl());
					pearlsGain.push(fish.getPearl());


					fish.doNotEatAgain = true;
				}


				if(!isCrossword && !isHanged)
				{
					fish.setPearl(null);
				}

			}


		}

		if(nbKillF) this._changeL(-nbKillF);
		if(this.onEatPearls && this.pearls.length) this.onEatPearls(pearlsGain);


		// Dans le cas d'un pendu on regarde si la premiere lettre se trouve dans le mot
		if(mode.isHanged())
		{

			var hasProgress = false;
			var checkWord = this.word.getCurrent();
			var pagesTuto = [];
			var lettersTest = {};
			var hangedTutoDone = {};
			for(var i in checkWord)
			{
				var letter = checkWord[i];
				var isOk = false;
				if(this.tryHangedLetter(checkWord[i]))
				{
					hasProgress = true;
					isOk = true;
				}

				if(this.hangedTuto) {
					var tutoKey = '';
					if(isOk) {
						tutoKey = 'tuto_pendu_progress';
					} else if(!lettersTest[letter]) {
						tutoKey = 'tuto_pendu_error';
					} else {
						tutoKey = 'tuto_pendu_error_again';
					}

					if(!hangedTutoDone[tutoKey]) {
						pagesTuto.push({
							txt: _ts(tutoKey, {
								':letter': '|'+letter.toUpperCase()+'|'
							})
						});

						if(tutoKey == 'tuto_pendu_error_again'){
							pagesTuto.push({
								txt: _ts('continue_a_jouer')
							});
						}

						hangedTutoDone[tutoKey] = true;
					}
				}

				lettersTest[letter] = true;
			}

			if(pagesTuto.length) {

				var tutoBoard = new UI.PopupTutoBoard(pagesTuto);
				tutoBoard.open();
			}


			if(hasProgress)
			{
				this.onHangingProgress();
				this._checkHangedLetterError();
			}
			else
			{
				this.handleError({check: true});
			}

			this.hangedTuto = false;

		}




		if(!unallow) {
			this.handleObjective('valid_word');
			unallow = false;
		}

		// Se trouvait avant la boucle avant
		console.log('wordScore', wordScore);
		var points = wordScore * wordDone.length;
		if(isDouble) points *= 2;


		var addCb = null;

		if(this.level.hasTuto() === 1 && !this.tutoWordScore)
		{
			this.tutoWordScore = true;
			addCb = function(){
				var t = new UI.PopupTutoBoard([
					{
						txt: _ts('bravo_gain_points', {
							':x': ' '+points
						})
					}
				]);

				t.onComplete = function(){
					var tutoSkip = function()
					{
						// var $fireWave = $('#fireWave');
						// var boundingFire = DOMHelper.getNoScaleBoundingClient($fireWave[0], UI.PopupTutoBoard.border);

						var fireWave = self.view.getElementById('fireWave')
							, waveContainer = self.view.getElementById('waveContainer');

						var boundingFire = {
							x: fireWave.position.x + waveContainer.position.x - fireWave.width/2,
							y: fireWave.position.y - 5,
							width: fireWave.width,
							height: fireWave.height
						}

						var skip = new UI.PopupTutoBoard([
							{
								hit: boundingFire,
								txt: _ts('tuto_aucun_mot'),
								noCheck: true,
								onEnter: function() {
									// $fireWave.mouseenter();
								},
								onLeave: function() {
									// $fireWave.mouseleave();
								},
								onClick: function() {
									Scene.BaseScene.current.resume();
									fireWave.onHit();
									Scene.BaseScene.current.pause();
								}
							},

							{
								txt: _ts('passer_vague_utilite')
							},
							{
								txt: _ts('ecrire_maintenant_mot', {
									//':word': '|points|'
									':word': ' '+_ts('tuto_ecrit_points').toUpperCase()
								})
							}
						]);

						skip.onComplete = function(){

							self.launchWordTutoBoard(_ts('tuto_ecrit_points').toUpperCase().split(''), self.grid.fishesByLetter(), false);

						};

						skip.open();
					};

					var p = new UI.PopupTuto('word_score', true, true);
					p.open();
					if(p.active) p.onClose = tutoSkip;
					else tutoSkip();
				};


				t.open();
			};

			self.forceLaunchWave = true;
		}


		this._addPoints(points, null, null, addCb, isDouble);
		this.saveWordRef(wordDone, points, unallow, jokers, isDouble);


		// Fake process
		setTimeout(function(){
			self.handleWordAchievement(wordDone, jokers);
		}, 1);


		// --------------------------------------------------------------
		// Ajoute notre mot trouve a notre liste de mots valide
		// --------------------------------------------------------------


		if(!this.dontFireBonusEnd){
			setTimeout(function(){

				var checkBonus = wordDone.toLowerCase();
				if(Game.Grid.BonusWord[checkBonus] && Game.Grid.BonusToTuto[checkBonus] && ATW.App.getPlayer().isTutoFisnish(Game.Grid.BonusToTuto[checkBonus]))
				{
					var bonusMap = Game.Grid.BonusWord[checkBonus];
					for(var i=0; i<bonusMap.length; i++)
					{
						var bonusKey = bonusMap[i];
						var cBonus   = ConfigBonusHelper.findByKey(bonusKey);
						self.useBonus(cBonus, true);
					}
				}
			}, 350);
		}
		this.dontFireBonusEnd = false;

		this.handlePossibility(null, function(){
			self.end(MYGame.END_NO_POSSIBILITY);
		});




	}
	else
	{
		this.iError++;
		error = true;
		existWord = false;
	}

	if(error)
	{
		Util.Sound.fxPlay('fx/mot_refuse');

		var mode = this.level.getMode();
		if(existWord) this.handleError();

		var copyFishesMap = this.selectedFishesMap.slice(0);
		var nbFishes = copyFishesMap.length;
		var nbErrorDone = 0;

		// Reinitialise le mot lorsque toutes les meduses sont sorties du mode erreur
		for(var i in copyFishesMap)
		{
			var fish = copyFishesMap[i];

			UI.Fish.toError(fish, null, function(fish){
				return function(){ UI.Fish.toDefault(fish) }
			}(fish))
		}


	}
	else
	{
		Util.Sound.fxPlay('fx/mot_valide');
	}

	if(cb) cb({success: !error});


	if(!delayClean) this.cleanWord();
	else setTimeout(this.cleanWord.bind(this), delayClean);

};

MYGame.prototype.submitWord = function(cb)
{

	if(this.isSubmiting
		|| !this.word.getCurrent().length
		|| (this.forceWord && this.word.getCurrent() != this.forceWord))
	{
		return;
	}

	var lowerWord = this.word.getCurrent().toLowerCase()
		, self = this;


	this.isSubmiting = true;

	if(!this.online) this.isRealWord = null;

	if(!this.isRealWord && Game.Grid.BonusWord[lowerWord]) {
		this.isRealWord = true;
	}


	if(this.isRealWord !== null)
	{
		this.submitWordHandler(cb);
	}
	else if(!this.online)
	{
		this.testWord(function(){
			self.submitWordHandler(cb);
		});
	}
	else
	{
		this.onTestWordEnd = function(){ self.submitWordHandler(cb); }
		this.loaderLag = setTimeout(function(){
			self.lag = true;
			self.lagOnSubmit();
		}, 300);

	}


};

MYGame.prototype._checkHangedLetterError = function()
{
	if(!this.level.getMode().isHanged()) return;


	var cWord = this.word.getCurrent();
	var nbError = 0;
	for(var i in cWord)
	{
		var letter = cWord[i];

		if(! this.hangedError[letter] && this.mysteryWord.indexOf(letter) == -1)
		{
			this.hangedError[letter] = true;
			this.onHangedLetterError(letter);
			nbError++;
		}
	}

	this._changeL(-nbError);

};

MYGame.prototype.handleError = function(data)
{
	switch(this.level.getMode().getKey())
	{
		case Model.Mode.HANGED:
			// Sauvegarde une lettre
			if(data && data.check) this._checkHangedLetterError();
			break;

		case Model.Mode.WRECKING_BALL:
		case Model.Mode.CROSSWORD:
			this._changeL(-1);
			break;
	}
};


MYGame.prototype.handleWordAchievement = function(wordDone, jokers)
{
	return;

	if(this.helps && this.helps[wordDone.toLowerCase()]) return;

	// wordDone = wordDone.toUpperCase();
	var am = ATW.App.getPlayer().getAchievementManager();
	am.dispatch('WRITE_WORD', {ref: wordDone});

	if(this.timers[MYGame.WAVE_TIMER] && this.timers[MYGame.WAVE_TIMER].getDurationDone() <= 1000) {
		am.dispatch('FIRST_SEC_SAVE', {}, wordDone.length);
	}

	if(this.timers[MYGame.WAVE_TIMER] && !this.timers[MYGame.WAVE_TIMER].getDuration()) {
		am.dispatch('LAST_SEC_SAVE', {}, wordDone.length);
	}

	var mapLetterCount = {};
	for(var i=0; i<wordDone.length; i++)
	{
		var letter = wordDone[i];
		if(!mapLetterCount)
		{
			mapLetterCount[letter] = 0;
		}
		mapLetterCount[letter]++;
		am.dispatch('USE_LETTER', {ref: letter});
	}

	for(var i in mapLetterCount)
	{
		am.dispatch('USE_LETTER_IN_WORD', {ref: {
			letter:letter,
			nb: mapLetterCount[i]
		}} );
	}


	am.dispatch('WORD_MASTER', {ref: wordDone.length});
};

// --------------------------------------------------------------
// Reinitialise le mot courant
// --------------------------------------------------------------

MYGame.prototype.initFillWord = function()
{
	if(this.level.getMode().isHanged())
	{
		var current = "";
		for(var i=0; i<this.mysteryWord.length; i++)
		{
			current += '_';
		}

		this.word.setCurrent(current);
	}

};

MYGame.prototype.resetWord = function(display)
{


	this.word              = new Game.Word();
	this.testWord();
	this.initFillWord();

	this.fishes            = {};
	this.dirBuilder        = null;

	var nbSelectedFish = this.selectedFishesMap.length;
	for(var i=0; i<nbSelectedFish; i++) UI.Fish.toDefault(this.selectedFishesMap[i]);

	this.selectedFishesMap = [];


	if(display) this.refreshWord();


};

MYGame.prototype.cleanWord = function()
{
	this.word              = new Game.Word();
	this.testWord();
	this.initFillWord();

	this.fishes            = {};
	this.dirBuilder        = null;
	this.selectedFishesMap = [];
	this.isSubmiting = false;

	this.refreshWord();
};


MYGame.prototype._addBombAnimation = function(ground, $bomb)
{
	if(!$bomb)
	{
		var $ground = $("#ground-" + ground.getId());
		var $bomb = $ground.find('.bomb');
	}


	var id = 'bomb-' + this.animateBombs.i;
	$bomb.attr('id', id); // Nous permettra de kill l'animation lorsque la bombe est detruite

	var $front = $bomb.find('.front');
	ground.getBonus().setNodeID(id);
	var tl = new TimelineMax({repeat: -1, yoyo: true});
	tl.to($front, 1, {autoAlpha: 0});

	this.animateBombs.tls[id] = tl;
	this.animateBombs.i++;
};

MYGame.prototype.end = function(reason)
{
	if(this.endReason) return;

	var waitTutoEnd = false;
	if(this.endReason == MYGame.END_NO_POSSIBILITY && ATW.App.getPlayer().isTutoFisnish('board_no_possibility'))
	{
		waitTutoEnd = true;

		var self = this;
		var tutoBoard = new UI.PopupTutoBoard([
			{
				txt:_ts('aucun_mot_possible_explication')
			}
		]);
		tutoBoard.onComplete = function(){
			ATW.App.getPlayer().finishTuto('board_no_possibility');
			App.getDataManager().getApi().call('Tuto', 'POST', {
				on: 'me',
				data: {
					key: 'board_no_possibility'
				}
			});

			self.onEnd();

		};

		tutoBoard.open();
	}

	this.nbLeftFish = this.iFish;

	this.desactiveKeyboard();
	this.endReason = reason;
	this.killTimers();

	if(this.startAt)
	{
		this.totalDuration = Util.Date.diffMSDate(new Date(), this.startAt);
		this.totalDuration -= this.pauseDuration;
	}

	this.playing = false;
	this.startAt = null;

	this.resetWord(true);

	if(!waitTutoEnd && this.onEnd) this.onEnd();
};

MYGame.prototype.cleanAll = function()
{
	for(var fishID in this.standAnimation) this.cleanFish(fishID);

	this.killTimers();
	this.desactiveKeyboard();

};


MYGame.prototype.getAvgWordLength = function()
{
	if(!this.words.length) return 0;

	var totalLength = 0;
	for(var i in this.words) totalLength += this.words[i].length;


	return (totalLength/this.words.length).toFixed(2);
};

MYGame.prototype._changeL = function(nb)
{
	if(!nb) return;


	this.life += nb;
	this.life = Math.max(0, this.life);
	this.onLifeChange(nb);

	if(this.life <= 0)
	{

		var self = this;
		setTimeout(function(){
			self.end(MYGame.END_FLOW);
		}, 1000);

	}

	Util.Sound.fxPlay('fx/coeur');
};

MYGame.prototype.launchWordTutoBoard = function(write, fishesByLetter, isFirstTuto)
{
	var self = this;
	var tutoBoard = new UI.PopupTutoBoard();

	var fsTxt = _ts('commence_par_cliquer_sur_lettre');
	var defTxt = _ts('maintenant_sur_lettre');
	if(isFirstTuto)
	{
		var endTxt = _ts('enfin_sur_lettre');
	}
	else
	{
		var endTxt = _ts('enfin_sur_lettre_puis_valide');
	}

	var letterIndexes = {};
	for(var i=0; i<write.length; i++)
	{

		var letter = write[i];

		if(typeof letterIndexes[letter] == "undefined")
		{
			var letterIndex = letterIndexes[letter] = 0;
		}
		else
		{
			var letterIndex = ++letterIndexes[letter];
		}

		if(!fishesByLetter[letter] || !fishesByLetter[letter][letterIndex])
		{
			continue;
		}

		var fish = fishesByLetter[letter][letterIndex]
			, fishView = fish.view
			, parent = self.view.getElementById('fields');

		var boundingGround = {
			x: parent.position.x + fishView.position.x - fishView.width/2,
			y: parent.position.y + fishView.position.y - fishView.height/2,
			width: fishView.width,
			height: fishView.height
		};

		var useTxt = defTxt;
		if(i == 0) useTxt = fsTxt;
		else if(i == write.length-1) useTxt = endTxt;

		tutoBoard.addPage({
			hit: boundingGround,
			txt: Util.String2.strtr(useTxt, {':char': letter.toUpperCase()}),
			noCheck: true,
			arrowDir: 'toBottom',
			onEnter: function(fish) {
				return function(){
					// fish.mouseenter();
				}
			}(fish),
			onLeave: function(fish) {
				return function(){
					// fish.mouseleave();
				}
			}(fish),
			onClick: function(fish) {
				return function(){
					fish.onHit();
				}
			}(fish)
		});

	}

	if(this.hangedTuto)
	{
		tutoBoard.unshiftPage({
			txt: _ts('ecrire_maintenant_mot', {
				':word': write.join('')
			})
		});
	}

	// var $validWord = $('#validWord');
	var validWord = self.view.getElementById('btnSubmit');
	if(!this.boundingSubmit)
	{
		var wordContainer = self.view.getElementById('wordContainer');
		this.boundingSubmit = {
			// x: validWord.position.x + validWord.width/2 - 10,
			x: wordContainer.position.x + validWord.position.x - validWord.width/2,
			// y: validWord.position.y -10,
			y: validWord.position.y +wordContainer.position.y -validWord.height/2,
			width: validWord.width,
			height: validWord.height
		};

		// console.log('this.boundingSubmit', this.boundingSubmit);
	}

	if(isFirstTuto)
	{
		var s4 = _ts('voila_tu_sais_selectionner');

		tutoBoard.addPage({
			txt: s4
		});

		var self = this;
		tutoBoard.onComplete = function(){
			var p = new UI.PopupTuto('submit_word', true, true);
			p.open();
			p.onClose = function(){

				var descri = self.view.getElementById('groupTitle')
					, boudingDescri = {
						x: descri.position.x,
						y: descri.position.y,
						width: descri.width,
						height: descri.height
					};

				var tutoBoard2 = new UI.PopupTutoBoard([
					{
						hit: self.boundingSubmit,
						// txt: 'Valide ton mot en cliquant ici.',
						txt: _ts('valide_mot_en_cliquant_ici'),
						noCheck: true,
						onEnter: function() {
							// $validWord.mouseenter();
						},
						onLeave: function() {
							// $validWord.mouseleave();

						},
						onClick: function() {
							// $validWord.click();
							validWord.onHit();
						}
					},
					{
						hit: boudingDescri,
						txt: Util.String2.strtr(
							_ts('objectif_progression'), {
								':x': ' '+ self.level.getMode().getProgressLeft(1)
						}),
						noArrow: true
					}
				]);
				tutoBoard2.open();
			}


		};
	}
	else
	{
		tutoBoard.addPage({
			hit: this.boundingSubmit,
			txt: _ts('valide_mot_en_cliquant_ici'),
			noCheck: true,
			onEnter: function() {
				// $validWord.mouseenter();
			},
			onLeave: function() {
				// $validWord.mouseleave();

			},
			onClick: function() {
				validWord.onHit();
				// $validWord.click();
			}
		});
	}


	tutoBoard.open();

};

MYGame.prototype.select = function(fish)
{
	// if(!this.playing && !this.isFreeze) return;

	if(this.isSubmiting
		|| !fish.isAlive()
		|| (fish.isInHole() && fish.getGround().hasLetterFish())
		|| fish.errorState
		|| this.endReason
	) {
		return;
	}

	var self = this,
		now = new Date(),
		oldSelectDate = this.lastSelectDate,
		isSelected = this.fishes[fish.getId()];

	if (isSelected && oldSelectDate
		&& Util.Date.diffMSDate(now, oldSelectDate) < 220
		&& this.lastSelectedFish
		&& this.lastSelectedFish.isEqualTo(fish)
		// && $('#validWord').hasClass('display')
	) {
		if(!this.isSubmiting) this.submitWord();

		if(this.currentTimeout[fish.getId()])
		{
			clearTimeout(this.currentTimeout[fish.getId()]);
			this.currentTimeout[fish.getId()] = null;
		}

		this.lastSelectedFish = null;
	} else {

		if(isSelected)
		{
			this.currentTimeout[fish.getId()] = setTimeout(function(){
				self.handleFish(fish);
			}, 140);
		}
		else
		{
			this.handleFish(fish);
		}

		this.lastSelectedFish = fish;
		this.lastSelectDate = now;
	}

};

MYGame.prototype.handleFish = function(fish)
{
	var fishView = fish.view,
		wordLength = this.word.getCurrent().length,
		lastLetterUnselect = false;

	if(this.selectedFishesMap.length > 1)
	{
		var selectedMap = this.selectedFishesMap;
		var lastIndex = selectedMap.length-1;
		var lastFish = selectedMap[lastIndex];

		if(fish.isEqualTo(lastFish))
		{
			delete this.fishes[fish.getId()];
			this.selectedFishesMap.splice(lastIndex, 1);
			if(!this.level.getMode().isHanged())
			{
				this.word.removeLastChar(fish.isGhost());
				this.testWord();
			}
			else
			{
				this.word.removeLastChar(fish.isGhost(), "_");
				this.testWord();
				this.word.fill("_", this.mysteryWord.length - this.word.getCurrent().length);
			}


			UI.Fish.toDefault(fish);
			lastLetterUnselect = true;

		}
	}

	if(!lastLetterUnselect)
	{
		if(!this.fishes[fish.getId()])
		{
			this.fishes[fish.getId()] = true;
			this.selectedFishesMap.push(fish);

			if(!this.level.getMode().isHanged() || this.word.getCurrent().indexOf("_") == -1)
			{
				this.word.appendChar(fish.getLetter(), fish.isGhost());
				this.testWord();
			}
			else
			{
				var current = this.word.getCurrent();

				var tmp = "";
				for(var x=0; x<current.length; x++)
				{
					if(current[x] == "_")
					{
						break;
					}

					tmp += current[x];
				}

				this.word.setCurrent(tmp);
				this.word.appendChar(fish.getLetter(), fish.isGhost());
				this.testWord();
				this.word.fill("_", this.mysteryWord.length - this.word.getCurrent().length);


			}


			UI.Fish.toSelect(fish)
		}
		else
		{
			this.resetWord(false);
		}
	}

	fishView.scale.x = fishView.scale.y = 1.3;
	TweenLite.to(fishView.scale, 0.4, {x: 1, y: 1, ease: Elastic.easeOut});

	Util.Sound.fxPlay('fx/clic_meduse');

	this.refreshWord();
	this.onFishMouseDown();

};

MYGame.prototype.prepare = function() {
	this.view = this.scene.view
	this.assetsField = this.view.getElementById('assetsField');

	var self = this;
	this.grid.eachFish(function(fish){
		fish.onHit = function(){
			self.select(fish);
		};

		UI.Fish.createView(self.view, fish);

		var groundRececeiver = fish.getGround();
		fish.view.position.x += groundRececeiver.getLeft() + 5;
		fish.view.position.y = groundRececeiver.getTop() +10;
		self.assetsField.addChildAt(fish.view, 0);
	})
};

MYGame.prototype.refreshWord = function()
{
	var textSubmit = this.view.getElementById('textSubmit'),
		wordContainer = this.view.getElementById('wordContainer'),
		currentWord = this.word.getCurrent(),
		wordLength = currentWord.length;


	textSubmit.removeChildren();

	var label = new PIXI.BitmapText(currentWord.toUpperCase(), {font: "35px FredokaOne-Regular"});
	label = Util.DisplayText.shadow(label, 2, 1, 0x0d0d0d, 0.9);
	label.position.x = ~~(wordContainer.width/2 - label.width/2) - 25;

	textSubmit.addChild(label);

	if(!wordLength || (this.level.getMode().isHanged() && this.word.getCurrent().indexOf('_') == 0))
	{
		this.builderShow = false;
		TweenLite.to(wordContainer, 0.2, {alpha:0});
		TweenLite.to(wordContainer.position, 0.2, {y: wordContainer.oriPosition.y + 89});
		TweenLite.to(wordContainer.scale, 0.2, {y: 0});
	}
	else if (!this.builderShow)
	{
		wordContainer.position.y = wordContainer.oriPosition.y + 89;
		wordContainer.scale.y = 0;
		TweenLite.to(wordContainer, 0.2, {alpha:1});
		TweenLite.to(wordContainer.position, 0.2, {y: wordContainer.oriPosition.y});
		TweenLite.to(wordContainer.scale, 0.2, {y:1});


		this.builderShow = true;
	}

};

MYGame.prototype.testWord = function(cb)
{
	if(!cb && !this.online) return;
	console.log('testing word ...');

	this.isRealWord = null;
	this.onTestWordEnd = null;
	if(this.online && this.testingABC) this.testingABC.abort();
	if(!this.word.getCurrent().length) return;

	var self = this;
	this.testingABC = Util.Dictionary.exist(this.word.getCurrent(), function(value){
		self.isRealWord = value
		if(self.onTestWordEnd) self.onTestWordEnd();
		else if(cb) cb();

		self.onTestWordEnd = null;
	});

};

MYGame.prototype._addPoints = function(points, customCb, type, addCb, isGold)
{
	if(ATW.App.getPlayer().scoreAccelerator)
	{
		points = Math.ceil(points*1.1);
	}

	console.log('MYGame::_addPoints', points);

	this.score += points;
	this.handleObjective('add_score');
	if(customCb) customCb(points)
	else if(this.onScore) this.onScore(points, type, isGold);


	if(addCb) addCb();

};



MYGame.prototype.useBonus = function(cBonus, gift, cb)
{
	var consumeBonus = true;
	if( !cBonus || (!gift && !ATW.App.getPlayer().hasBonus(cBonus.id)) )
	{
		if(cb) cb(false);
		return false;
	}

	if(gift && this.writtenBonus[cBonus.key])
	{
		if(cb) cb(false);
		return false;
	}

	if(gift)
	{
		this.nbGiftBonus++;
		this.writtenBonus[cBonus.key] = true;
	}
	else
	{
		this.nbUsedBonus++;
	}

	switch(cBonus.key)
	{
		case Game.Grid.BONUS_LIFE:
			this._changeL(5);
			Util.Sound.fxPlay('fx/bonus_l');
			break;

		case Game.Grid.BONUS_JOKER:
			var fish = this.grid.addJoker();
			if(!fish)
			{
				if(cb) cb(false);
				return false;
			}

			if(this.fishes[fish.getId()])
			{
				this.resetWord(true);
			}

			Game.LetterFish.regenLetter(fish);
			Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());

			break;

		case Game.Grid.BONUS_DOUBLE:
			var fish = this.grid.addDouble();
			if(!fish)
			{
				if(cb) cb(false);
				return false;
			}

			if(this.fishes[fish.getId()])
			{
				this.resetWord(true);
			}

			Game.LetterFish.regenLetter(fish);
			Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());

			break;

		case Game.Grid.BONUS_BOMB:

			if(this.level.getMode().isCrossword())
			{
				if(cb) cb(false);
				return false;
			}

			var ground = this.grid.addBomb();

			if(ground)
			{

				var $ground = $("#ground-" + ground.getId());
				tpl($ground, "#groundFoundationTpl", {
					ground: ground
				});

				// --------------------------------------------------------------
				//  Le poisson mange aussitot son repas
				// --------------------------------------------------------------
				if(ground.hasLetterFish())
				{
					var fish = ground.getLetterFish();
					fish.giveFood();

					var tl = new TimelineMax();
					var $bonus = $ground.find('.bonus');
					tl.to($bonus, 0.3, {autoAlpha:0, onComplete: function(){
						$bonus.remove();
					}});

					var $fish   = $('#fish-' + fish.getId());
					FishAnimator.toBig($fish, tl, fish);

				}
				else
				{

					this._addBombAnimation(ground, $ground.find('.bomb'));
				}

			}
			break;

		case Game.Grid.BONUS_FREEZE:
			if((!this.hasTimer(MYGame.WAVE_TIMER) && !this.hasTimer(MYGame.HOURGLASS_TIMER)) || this.isFreeze) {
				if(cb) cb(false);
				return false;
			}

			// this.pause(10);
			this.pause(ATW.Datas.CONFIGS.GAME_FREEZE_TIME, true);
			this.isFreeze = true;
			this.onFreeze(this.isFreeze);
			Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());

			break;

		case Game.Grid.BONUS_SWAP:
			var result = this.grid.addSwap();

			var tl = new TimelineMax();
			for(var i in result)
			{
				var fish    = result[i];
				var $fish   = $('#fish-' + fish.getId());
				var $letter = $fish.find('.letter');
				var $score  = $fish.find('.score');

				var onComplete = function(xFish){
					return function(){
						$score.html(xFish.getScore());
						$letter.html(xFish.getLetter());
					}
				}(fish);

				tl.to($fish, 0.2, {autoAlpha:0, onComplete: onComplete});
				tl.to($fish, 0.2, {autoAlpha:1});
			}

			break;

		case Game.Grid.BONUS_BONUS:
			var mode = this.level.getMode();
			if(mode.isSimple() || mode.isSurvival())
			{
				consumeBonus = false;

				var sortedLetter = this.grid.getSortedLetter();
				var self = this;

				// Il peut y'avoir des probs entre le moment ou la vague est lancée et la reception du call
				Util.Dictionary.findLargerWord(sortedLetter, function(largerWord){
					if(!largerWord.length)
					{
						if(cb) cb(false);
						return;
					}


					var fishesByLetter = self.grid.fishesByLetter();
					var fishes = [];


					for(var i=0; i<largerWord.length; i++)
					{
						var c = largerWord[i];
						if(!fishesByLetter[c] || !fishesByLetter[c].length) return;

						var fishesSection = fishesByLetter[c];
						var rI = Util.Math2.randomInt(0, fishesSection.length-1);
						fishes.push(fishesSection[rI]);
						fishesSection.splice(rI, 1);

					}

					self.resetWord(true);
					for(var i in fishes)
					{
						var fish = fishes[i];
						console.log('fish', fish.id);
						fish.onHit();
					}

					if(!self.helps) self.helps = {};
					self.helps[self.word.getCurrent().toLowerCase()] = true;

					if(cb) cb(true);

					Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());


				});




			}
			else if(mode.isHanged())
			{
				var fishesByLetter = this.grid.fishesByLetter();

				if(!this.hangedBonus || !fishesByLetter[this.hangedBonus])
				{
					var missingsLetter = this.getMissingLetter(false, true);

					do
					{
						var rI = Util.Math2.randomInt(0, missingsLetter.length-1);
						var letterFound = missingsLetter[rI].toUpperCase();
						missingsLetter.splice(rI, 1);
						var discover = (fishesByLetter[letterFound]) ? letterFound : false;

					} while(missingsLetter.length && !discover)


					if(!discover)
					{
						if(cb) cb(false);
						return false;
					}

					this.hangedBonus = discover;
				}

				this.resetWord(true);

				var randIndex = rand(0, fishesByLetter[this.hangedBonus].length-1);
				var fish = fishesByLetter[this.hangedBonus][randIndex];

				fish.onHit();

				Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());


			}
			else if(mode.isWreckingBall())
			{
				this.resetWord(true);
				// Détruit 2 lettres
				var fishes = this.grid.killFishes(2);
				var word = '';
				for(var i in fishes)
				{
					word += fishes[i].getLetter();
					this.killFish(fishes[i]);
				}

				this.words.push(word);
				this.handleObjective('valid_word');

				var self = this;
				this.handlePossibility(null, function(){
					self.end(MYGame.END_NO_POSSIBILITY);
				});

				Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());


			}
			else if(mode.isCrossword())
			{
				// Affiche un mot que le joueur n’a pas encore trouvé
				var crosswords = this.grid.getWords();

				for(var i in crosswords)
				{
					var toFound = crosswords[i];
					// Le mot n'a pas encore été trouvé so lets fire this shit
					if(this.words.indexOf(toFound) == -1)
					{
						var fishes = this.grid.wordsFish[toFound];

						this.resetWord(true);
						for(var i in fishes)
						{
							var fish = fishes[i];
							$('#fish-' + fish.getId()).mousedown();
						}

					}
				}

				Util.Sound.fxPlay('fx/' + cBonus.key.toLowerCase());


			}

			break;

		case Game.Grid.BONUS_WALL:
			var ground = this.grid.addWall();
			if(ground && ground.hasWall())
			{
				var $ground = $("#ground-" + ground.getId());
				$ground.append('<div class="wall"/>');
			}

			break;

		case Game.Grid.BONUS_HELP:
			alert('not implemented yet');
			break;

		case Game.Grid.BONUS_HOLE:
			var ground = this.grid.addHole();

			if(ground && ground.hasHole())
			{
				var $ground = $("#ground-" + ground.getId());
				$ground.removeClass(Ground.LdList.join(' '));
				$ground.addClass(ground.getFoundation());
				$ground.find('.foundation .key').html(ground.getFoundation());
			}
			break;

		default:
			throw new Error("Game::useBonus Le bonus " + bonusKey + " n'est pas implemente");


	}

	if(!gift)
	{
		if(cb && consumeBonus) cb(true);
		if(!cb) this.onConsumeBonus(cBonus);

		return true;
	}

	if(cb) cb(-1);
	return -1;
};


MYGame.prototype.handlePossibility = function(onPossibility, onNoPossibility)
{
	var noPossibility = ((this.level.getMode().isSimple() || this.level.getMode().isWreckingBall() || this.level.getMode().isSurvival())
		&& this.level.getNbWave() != -1
		&& this.iWave >= this.level.getNbWave()
		// && AroundTheWords.END_CHECK_LARGERWORD_ON_NBDEATH <= 6
		&& this.iFish <= ATW.config.game.END_CHECK_LARGERWORD_ON_NBDEATH);

	if(this.level.getMode().isWreckingBall() && this.level.getNbWave() != -1 && this.getQuantityLeft() < 0 )
	{
		onNoPossibility();
		return;
	}

	if(noPossibility && this.grid.hasJoker())
	{
		if(onPossibility) onPossibility();

		return;
	}

	// On doit s'assurer qu'il ne reste pas de mot a faire sur la grille
	if(noPossibility)
	{
		// && !this.grid.findLargerWord(AroundTheWords.END_CHECK_LARGERWORD_LENGTH).length
		var sortedLetter = this.grid.getSortedLetter();

		if(!sortedLetter.length)
		{
			onNoPossibility();
		}
		else
		{
			Util.Dictionary.findLargerWord(sortedLetter, function(largerWord){
				if(!largerWord.length) onNoPossibility();
				else if(onPossibility) onPossibility();

			});
		}

	}
	else if(onPossibility)
	{
		onPossibility();

	}

	// return bool;
};


MYGame.prototype.generateMysteryWord = function()
{
	var mode = this.level.getMode();
	if(!mode.isHanged())
	{
		return false;
	}

	if(!this.mysteries)
	{
		this.cptMystery = 0;
		var self = this;

		var isTuto = !ATW.App.getPlayer().isTutoFisnish('hanged');
		Util.Dictionary.generateRandWord(40, mode.getX(), function(list){
			self.mysteries = list;
			if(isTuto) {
				self.mysteries[0] = _ts('tuto_pendu_a_decouvrir');
			}

			self.generateMysteryWordHandler();
			self.isReady = true;
			if(self.onReady)
			{
				self.onReady();
			}
		}, isTuto);
	}
	else
	{
		this.cptMystery++;
		this.generateMysteryWordHandler();
	}

	return true;

};

MYGame.prototype.generateMysteryWordHandler = function()
{
	if(!this.mysteries[this.cptMystery])
	{
		throw new Error('not enough words');
	}

	this.mysteryWord = this.mysteries[this.cptMystery].toLowerCase();
	this.hangedWord = '';
	this.hangedError = {};

	var mode = this.level.getMode();


	for(var i=0; i<this.mysteryWord.length; i++)
	{
		this.hangedWord += '_';
	}

	this.word.setCurrent(this.hangedWord);

	if(this.needResetStatus) Game.LetterFish.resetStatusAll();


	this.needResetStatus = true;
	return true;
};


// --------------------------------------------------------------
// Demarre les vagues de lettre
// --------------------------------------------------------------
MYGame.prototype.start = function()
{
	this.startAt = new Date();
	this.playing = true;

	this.activeKeyboard();
	this.wave();
};

MYGame.prototype.desactiveKeyboard = function()
{
	this.keyboardActive = false;
	// stage.keydown();
};

MYGame.prototype.activeKeyboard = function()
{
	if(this.keyboardActive) return;

	var self = this;

	this.keyboardActive = true;

	// $(document).keydown(function (e){
	// 	e.preventDefault();
	// 	switch(e.which)
	// 	{
	// 		// case Keyboard.keyCode.SHIFT:
	// 		case Keyboard.keyCode.DELETE:
	// 		case Keyboard.keyCode.BACKSPACE:
	// 			self.resetWord(true);
	// 			break;
	// 		// La touche "entree" permet de confirmer un mot
	// 		case Keyboard.keyCode.ENTER:
	// 			self.submitWord();
	// 			break;

	// 		// La touche "N" lance une nouvelle vague
	// 		case Keyboard.keyCode.SPACE:
	// 		case Keyboard.keyCode.n:
	// 			self.wave(true);
	// 			break;
	// 	}

	// 	return false;
	// });
};

MYGame.prototype.resume = function(dontRestart, force)
{
	if(!force && (this.playing || this.isFreeze))
	{
		return;
	}

	this.activeKeyboard();

	if(this.pauseAt)
	{
		this.pauseDuration += Util.Date.diffMSDate( new Date(), this.pauseAt );
		this.pauseAt = null;
	}

	this.playing = true;
	if(!dontRestart)
	{
		for(var i in this.timers)
		{
			this.timers[i].restart();
		}
		// this.timer.restart();
	}

};

MYGame.prototype.saveWordRef = function(word, points, unallow, jokers, isGold)
{
	if(points > this.scoreMax)
	{
		this.scoreMax = points;
	}
	this.wordsSummarize.push({
		ref: word,
		pts: points,
		unallow: unallow,
		jokers: jokers,
		isGold: isGold,
		id: this.wordsSummarize.length
	});
};

MYGame.prototype.pause = function(duration, isFreeze)
{
	if(!this.playing)
	{
		return;
	}

	if(!isFreeze) {
		this.desactiveKeyboard();
	}

	this.pauseAt = new Date();

	this.playing = false;

	var self = this;
	var first = true;
	for(var id in this.timers)
	{
		if(duration)
		{
			this.timers[id].onRestart = (function(idX, firstX){
				return function() {
					if(this.onStartTimer) {
						this.onStartTimer(true, idX);
					}

					self.timers[id].onRestart = null;
					if(firstX && self.isFreeze) {
						self.isFreeze = false;
						self.onFreeze(self.isFreeze);
						self.resume(true);
					}
				}
			})(id, first);
		}
		this.timers[id].pause(duration);
		first = false;
	}

};




MYGame.prototype.getDurationString = function() {
	var o = Util.Date.msToObject(this.totalDuration);
	return o.hour + ':' + o.min + ':' + o.sec;
};

MYGame.prototype.getHighdurationString = function() {
	var o = Util.Date.msToObject(this.highduration);
	return o.hour + ':' + o.min + ':' + o.sec;
};



MYGame.prototype.getGrid          = function() { return this.grid; };
// MYGame.prototype.getHeap       = function() { return this.heap; }
MYGame.prototype.getStar          = function() { return this.appStar; };
MYGame.prototype.getLife          = function() { return this.life; };
MYGame.prototype.getScore         = function() { return this.score; };
MYGame.prototype.hasCompleteObj = function() { return this.obj1 >= this.level.getMode().getEndPoint(); };
MYGame.prototype.hasWin           = function() {
	var mode = this.level.getMode();
	return (this.appStar > 0
		&& this.obj1 >= this.level.getMode().getEndPoint()
		&& (this.life || mode.isSurvival() || mode.isWreckingBall() || mode.isHanged() || mode.isSimple() )
	);
};
MYGame.prototype.getLevel         = function() { return this.level; };
MYGame.prototype.isPlaying        = function() { return this.playing; };
// MYGame.prototype.getTimer         = function() { return this.timer; }
MYGame.prototype.getTimer         = function(id) { return this.timers[id]; };
MYGame.prototype.getPearls        = function() { return this.pearls; };
MYGame.prototype.getMysteryWord   = function() { return this.mysteryWord; };
MYGame.prototype.getHangedWord    = function() { return this.hangedWord; };
MYGame.prototype.getHighscore     = function() { return this.highscore; };
MYGame.prototype.getHighstar      = function() { return this.highstar; };
MYGame.prototype.getTotalDuration = function() { return this.totalDuration; };
MYGame.prototype.getHighduration  = function() { return this.highduration; };
MYGame.prototype.getSelectedMap   = function() { return this.selectedFishesMap; };
MYGame.prototype.getMissingLetter = function(randomize, getMap)
{
	var map = [];
	var missingLetter = null;
	// Donne une lettre du pendu
	for(var i=0; i<this.mysteryWord.length; i++)
	{
		// Lettre inconnu
		if(this.hangedWord[i] == '_')
		{
			var letter = this.mysteryWord[i];
			var score = Game.Char.getWeight(letter);

			map.push(letter);
			if(!missingLetter || missingLetter.score < score)
			{
				missingLetter = {
					letter: letter,
					score: score
				};
			}

		}
	}

	if(getMap)
	{
		return map;
	}


	if(randomize && map.length)
	{
		missingLetter = {
			letter: map[rand(0, map.length-1)]
		};
	}

	return missingLetter;
};

MYGame.prototype._explodeAnim = function(ground, delay)
{
	var self = this,
		textures = [];

	for(var i=1; i<7; i++) textures.push(PIXI.Texture.fromFrame("bomb_explode_" + i));


	var ex = function(){

		var mv = new PIXI.MovieClip(textures);
		mv.position.x = ground.getLeft() - 22;
		mv.position.y = ground.getTop() - 22;
		mv.animationSpeed = 0.4;
		mv.loop = false;
		mv.onComplete = function(){
			mv.alpha = 0;
			setTimeout(function(){
				self.assetsField.removeChild(mv);
			}, 50);

		}
		mv.play();

		self.assetsField.addChild(mv);

		Util.Sound.fxPlay('fx/meduse_bombe');
	};

	if(!delay) ex();
	else setTimeout(ex, delay);

};


MYGame.prototype.killTimers = function()
{
	for(var i in this.timers) this.killTimer(i);

};

MYGame.prototype.getWordsSummarize = function()
{
	return this.wordsSummarize;
};

MYGame.prototype.killTimer = function(id)
{
	if(this.timers[id])
	{
		this.timers[id].kill();
		this.timers[id] = null;
		delete this.timers[id];
	}
};

MYGame.prototype.hasTimer = function(id)
{
	return this.timers[id];
};

MYGame.prototype.createTimer = function(id)
{
	console.log('createTimer', id);
	var self = this;
	if(id == MYGame.WAVE_TIMER)
	{
		this.timers[id] = new Util.TimerSec({
			secondes: this.level.getWaveHandler().getTimeout(),
			onMyEnd: function(){
				console.log('Ask new wave');
				self.wave();
			},
			onMyUpdate: function(t){
				if(self.onWaveTimer) self.onWaveTimer(t);
			}
		});
	}
	else
	{
		// var $timer = $('#descritionMd #timer .txt');
		var mode = this.level.getMode();
		this.timers[id] = new Util.TimerSec({
			secondes: mode.getDuration(),
			onMyEnd: function(){
				self.end(MYGame.END_FLOW);
			},
			onMyUpdate: function(t){
				if(self.onHourglassTimer) self.onHourglassTimer(t);

			}
		});

	}

	if(this.onStartTimer) this.onStartTimer(false, id);

	this.timers[id].onRestart = function() {
		if(self.onStartTimer) self.onStartTimer(true, id);
	}

	this.timers[id].myGo();

	return this.timers[id];

};



MYGame.prototype.getAvgCrossword = function()
{
	var progress = this.nbGeneratedWord - this.grid.getWords().length;
	return ~~((progress/ this.nbGeneratedWord)*100);
};

MYGame.prototype.getQuantityLeft = function()
{
	var quantityLeft =  this.level.getNbWave() - this.iWave;
	return quantityLeft;
};



MYGame.prototype.getIEmptyGrid = function(){ return this.iEmptyGrid; };
MYGame.prototype.getIError = function(){ return this.iError; };


MYGame.WAVE_TIMER      = 'WAVE_TIMER';
MYGame.HOURGLASS_TIMER = 'HOURGLASS_TIMER';

MYGame.DIR_NE = 'NE';
MYGame.DIR_NW = 'NW';
MYGame.DIR_SE = 'SE';
MYGame.DIR_SW = 'SW';
MYGame.DIR_E  = 'E';
MYGame.DIR_W  = 'W';
MYGame.DIR_S  = 'S';
MYGame.DIR_N  = 'N';
MYGame.DIRS   = [MYGame.DIR_NE, MYGame.DIR_NW, MYGame.DIR_SE, MYGame.DIR_SW, MYGame.DIR_E, MYGame.DIR_W, MYGame.DIR_S, MYGame.DIR_N];
MYGame.MODE_CLASSIC = 0;
MYGame.MODE_ENDLESS = 1;

MYGame.END_FLOW           = 'FLOW';
MYGame.END_NO_POSSIBILITY = 'NO_POSSIBILITY';


exports.MYGame = MYGame;

})(window.Game = window.Game || {});