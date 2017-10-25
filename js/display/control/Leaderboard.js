'use strict';
(function(namespace){

function Leaderboard(level, withScene) {
	PIXI.DisplayObjectContainer.call(this);
	this.level = level;
	this.withScene = withScene;

};

Leaderboard.prototype.constructor = Leaderboard;
Leaderboard.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Leaderboard.prototype.create = function()
{


	var self = this;
	var player = ATW.App.getPlayer();
	this.header = new PIXI.DisplayObjectContainer();

	this.flagContainer = new PIXI.DisplayObjectContainer();


	this.friendIco = PIXI.Sprite.fromFrame('flag_friend');
	this.friendIco._name = 'friend';
	this.friendIco.interactive = true;
	this.friendIco.mousedown = this.friendIco.touchstart = function(){
		self.switchLeaderboard(self.friendIco, self.countryIco);
	};

	this.countryIco = PIXI.Sprite.fromFrame('flag_' + I18N.Manager.lang);
	this.countryIco._name = 'country';
	this.countryIco.interactive = true;
	this.countryIco.mousedown = this.countryIco.touchstart = function(){
		self.switchLeaderboard(self.countryIco, self.friendIco);
	};

	this.flagContainer.addChild(this.friendIco);

	this.countryIco.position.x = this.friendIco.position.x + this.friendIco.width - 30;
	this.countryIco.position.y = - 20;
	this.countryIco.tint = 0x3d3d3d;
	this.flagContainer.addChildAt(this.countryIco, 0);

	this.flagContainer.position.x = 60;

	this.header.addChild(this.flagContainer);


	this.highlightPos = {
		x: this.friendIco.position.x,
		y: this.friendIco.position.y
	};

	this.subPos = {
		x: this.countryIco.position.x,
		y: this.countryIco.position.y
	};


	this.textBmp = new PIXI.BitmapText(_ts('Amis'), {
		font: "50px FredokaOne-Regular"
	});
	this.textBmp.position.x = 86;
	this.textBmp.position.y = 90;
	this.header.addChild(this.textBmp);

	this.addChild(this.header);

	var contentContainer = new PIXI.DisplayObjectContainer();

	this.friendContainer = new PIXI.DisplayObjectContainer();
	contentContainer.addChild(this.friendContainer);

	this.worldContainer = new PIXI.DisplayObjectContainer();
	this.worldContainer.visible = false;
	contentContainer.addChild(this.worldContainer);

	contentContainer.position.y = 160;

	this.addChild(contentContainer);

	var worldId = this.level.getWorld().getId()
	, levelId = this.level.getId();

	Util.LeaderboardHelper.loadWorld(worldId, levelId, function(response){
		self.addRanking(self.worldContainer, response.ranking);
	});

	Util.LeaderboardHelper.loadFriend(worldId, levelId, function(response){
		var nbPpl = self.addRanking(self.friendContainer, response.ranking);
		if(!nbPpl) {
			self.switchLeaderboard(self.countryIco, self.friendIco);
		}
	});
};

Leaderboard.prototype.switchLeaderboard = function(highlight, sub)
{

	TweenLite.to(highlight.position, 0.2, this.highlightPos);
	TweenLite.to(sub.position, 0.2, this.subPos);

	sub.tint = 0x3d3d3d;
	highlight.tint = 0xFFFFFF;

	this.flagContainer.setChildIndex(sub, 0);
	if(highlight._name == 'friend') {
		this.textBmp.setText(_ts('Amis'));
		this.worldContainer.visible = false;
		this.friendContainer.visible = true;
	} else {
		this.textBmp.setText(LOCALE_LIST[ATW.App.getPlayer().getLocale()]);
		this.worldContainer.visible = true;
		this.friendContainer.visible = false;
	}


};

Leaderboard.prototype.addRanking = function(container, ranking)
{
	if(!ranking) return 0;


	var ranking = ranking.leaderboard
	, nbPpl = 0
	, drawLine = false;

	var y = 0;
	for(var type in ranking)
	{
		for(var  i in ranking[type])
		{
			var o = ranking[type][i];

			var box = new PIXI.DisplayObjectContainer();

			if(drawLine) {
				var line = new PIXI.Graphics();
				line.beginFill(0xFFFFFF)
					.drawRoundedRect(0, 0, 400, 5, 20)
					.endFill();

				line.position.y = y - 5;
				line.position.x = -15;
				box.addChild(line);
				y = line.position.y + 10;
			}



			var cup = null;
			var posBmp = new PIXI.BitmapText(o.pos.toString(), {
				font: "40px FredokaOne-Regular"
			});

			if(o.pos <= 3) {

				if(o.pos == 1) cup = PIXI.Sprite.fromFrame('gold_cup');
				else if(o.pos == 2) cup = PIXI.Sprite.fromFrame('silver_cup');
				else if(o.pos == 3) cup = PIXI.Sprite.fromFrame('bronze_cup');

				posBmp.position.x = cup.width/2 - posBmp.width/2 - 2;
				posBmp.position.y = 8;
				cup.addChild(posBmp);

				cup.position.y = 5;
				box.addChild(cup);

			} else {
				cup = new PIXI.DisplayObjectContainer();
				posBmp.position.x = 8;
				posBmp.position.y = 21;
				cup.addChild(posBmp);
				box.addChild(cup);
			}


			var profil = Util.DisplayObject.roundedRectProfil(o.fbId);
			profil.scale.x = profil.scale.y = 1;
			profil.position.x = 65;
			box.addChild(profil);

			var statContainer = new PIXI.DisplayObjectContainer();
			var scoreBmp = new PIXI.BitmapText(o.score.toString(), {
				font: "40px FredokaOne-Regular"
			});

			var firstNameBmp = new PIXI.BitmapText(o.firstName, {
				font:"30px FredokaOne-Regular"
			});
			firstNameBmp.position.y = scoreBmp.height + 8;

			statContainer.addChild(scoreBmp);
			statContainer.addChild(firstNameBmp);

			statContainer.position.x = 158;
			statContainer.position.y = 3;

			box.addChild(statContainer);


			box.position.y = y;
			y = box.position.y + box.height + 15;

			container.addChild(box);

			drawLine = false;
			nbPpl++;
		}

		drawLine = true;
	}

	if(!nbPpl)
	{
		// var txt = _ts('premier_arrive_sur_niveau');
		var txtBmp = Util.DisplayText.wrap(_ts('premier_arrive_sur_niveau'), {
			font: "20px FredokaOne-Regular",
			letterMax: 30,
			align: "center",
			maxWidth: 200,
			lineHeight: 22
		});

		container.addChild(txtBmp);


	}
	return nbPpl;
};


namespace.Leaderboard = Leaderboard;

})(window.UI = window.UI || {});