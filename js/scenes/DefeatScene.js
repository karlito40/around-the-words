'use strict';
(function(exports){

function DefeatScene(game)
{
	exports.EndScene.call(this, game, 'DefeatScene', 'defeat_scene');
};

DefeatScene.constructor = DefeatScene;
DefeatScene.prototype = Object.create(exports.EndScene.prototype);

DefeatScene.prototype.logic = function() {
	exports.EndScene.prototype.logic.call(this);

	var self = this;

	if(!ATW.App.getPlayer().isTutoFisnish('first_defeat'))
	{
		var s3 = _ts('premiere_defaite_explication');
		var tuto = new UI.PopupTutoBoard([
			{
				txt: s3,
				noArrow: true
			}
		], function(){
			var p = new UI.PopupTuto('first_defeat');
			p.open();

		});

		tuto.open();

	}


	var btnShopLevel = this.view.getElementById('btnShopLevel');
	if(btnShopLevel) {
		btnShopLevel.onHit = function(){
			var currentLevel = self.game.getLevel();
			if(!currentLevel.isBuyable()) return;


			var product = Util.Shop.findProductByKey('LEVEL');
			product.worldId = currentLevel.getWorld().getId();
			product.levelId = currentLevel.getId();
			Util.Shop.instaShop(product, function(){
				currentLevel.shop();
				self.goToNextLevel();
			});

		}
	}

	this.anim();



};


DefeatScene.prototype.anim = function()
{
	console.log('anim');
	var groupLevelName = this.view.getElementById('groupLevelName'),
	 	scoreBmp = this.view.getElementById('scoreBmp'),
	 	lineObj1 = this.view.getElementById('lineObj1'),
	 	lineObjStar = this.view.getElementById('lineObjStar')
	;


	var tl = new TimelineMax({delay: 0.5});
	var cStar = 1;
	var stagTo = [];

	stagTo.push(groupLevelName);
	stagTo.push(scoreBmp);
	stagTo.push(lineObj1);
	stagTo.push(lineObjStar);

	tl.staggerTo(stagTo, 1, {alpha: 1}, 0.3);



}

exports.DefeatScene = DefeatScene;

})(window.Scene = window.Scene || {});


