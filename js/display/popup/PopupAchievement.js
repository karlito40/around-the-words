'use strict';

(function(exports){

function PopupAchievement(key, force, dontSave)
{
	Util.Popup.call(this);

	this.achList = [];
	this.page = 0;
	this.nbDisplay = 5;
	this.nbPage = 0;
	this.circleHighlight = 1;
	this.circleHidden = 0.3;

	this.circles = [];
};

PopupAchievement.constructor = PopupAchievement;
PopupAchievement.prototype = Object.create(Util.Popup.prototype);

PopupAchievement.prototype.create = function()
{

	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);

	var self = this
		, player = ATW.App.getPlayer();

	player.getAchievementManager().each(function(ach){
		self.achList.push(ach);
	});

	this.nbPage = Math.ceil(this.achList.length/this.nbDisplay);

	var titleBmp = new PIXI.BitmapText(_ts('succes'), {font: "45px FredokaOne-Regular", tint:0xffca31});
	titleBmp = Util.DisplayText.shadow(titleBmp, 6, 0, 0xc76218, 0.9);
	titleBmp.position.x = ATW.gameMidWidth() - titleBmp.width/2;
	titleBmp.position.y = 100;
	this.addChild(titleBmp);

	this.addPage();

	// Ajoute les points
	var pointContainer = new PIXI.DisplayObjectContainer();
	var x = 0;
	for(var i=0; i<this.nbPage; i++) {
		var circle = new PIXI.Graphics();
		var alpha = (this.page == i) ? this.circleHighlight : this.circleHidden;
		circle.beginFill(0xFFFFFF, 1)
			.drawCircle(0, 0, 9)
			.endFill();

		circle.alpha = alpha;
		circle.position.x = x;
		x = circle.width + circle.position.x + 15;
		pointContainer.addChild(circle);

		circle.interactive = true;
		circle.mousedown = circle.touchstart = function(page){
			return function(){
				self.gotoPage(page);
			}
		}(i)

		this.circles.push(circle);
	}

	pointContainer.position.x = ATW.gameMidWidth() - pointContainer.width/2;
	pointContainer.position.y = this.pageContainer.position.y + this.pageContainer.height + 30;

	this.addChild(pointContainer);


	this.leftArrow = Util.DisplayObject.button('app_left_arrow')
	this.rightArrow = Util.DisplayObject.button('app_right_arrow');

	this.rightArrow.position.x = this.leftArrow.width + 30;

	this.leftArrow.alpha = 0;

	this.leftArrow.onHit = this.prevPage.bind(this);
	this.rightArrow.onHit = this.nextPage.bind(this);


	if(ATW.isMobile()) {
		var arrowContainer = new PIXI.DisplayObjectContainer();

		arrowContainer.addChild(this.leftArrow);
		arrowContainer.addChild(this.rightArrow);

		arrowContainer.position.x = ATW.gameMidWidth() - arrowContainer.width/2 + this.leftArrow.width/2;
		arrowContainer.position.y = pointContainer.position.y + 80;

		this.addChild(arrowContainer);


	} else {
		this.rightArrow.position.y = this.leftArrow.position.y = ATW.gameMidHeight();
		this.leftArrow.position.x = this.pageContainer.position.x - this.leftArrow.width;
		this.rightArrow.position.x = this.pageContainer.position.x + this.pageContainer.width + this.rightArrow.width;

		this.addChild(this.rightArrow);
		this.addChild(this.leftArrow);

	}


};

PopupAchievement.prototype.prevPage = function(){
	if(this.page <= 0) return;

	this.gotoPage(this.page - 1);
};

PopupAchievement.prototype.nextPage = function(){
	if(this.page >= this.nbPage-1) return;
	this.gotoPage(this.page + 1);
};

PopupAchievement.prototype.gotoPage = function(page){
	TweenLite.to(this.circles[this.page], 0.2, {alpha: this.circleHidden});
	this.page = page;
	TweenLite.to(this.circles[this.page], 0.2, {alpha: this.circleHighlight});

	this.rightArrow.alpha = (this.page < this.nbPage-1) ? 1 : 0;
	this.leftArrow.alpha = (this.page > 0) ? 1 : 0;


	this.addPage();
};



PopupAchievement.prototype.addPage = function()
{
	var startAt = this.nbDisplay * this.page
		, endAt = startAt + this.nbDisplay
		, section = this.achList.slice(startAt, endAt)
		, self = this;




	if(this.pageContainer) {
		this.removeChild(this.pageContainer);
		this.pageContainer = null;
		// return;
	}


	this.pageContainer = new PIXI.DisplayObjectContainer();
	var y = 0;
	section.forEach(function(ach){
		y = self.createAch(ach, y);
	});

	this.pageContainer.position.x = ATW.gameMidWidth() - this.pageContainer.width/2;
	this.pageContainer.position.y = 175;

	this.addChild(this.pageContainer);

};


PopupAchievement.prototype.createAch = function(ach, y, anim) {

	var height = 120
		, widthLeft = 500
		, widthRight = 290
		, line = new PIXI.DisplayObjectContainer()
		, hasGift = ach.hasGift()
		, isComplete = (!hasGift) ? ach.isComplete() : false
		, self = this;

	// isComplete = true;
	// hasGift = (!isComplete);


	if(!isComplete) {
		var fillColor = 0xffca31
			, strokeColor = 0xf39a1b
			, titleColor = 0xFFFFFF
			, titleShadow = 0xc76218
			, secondaryColor = 0xd49229;
	} else {
		var fillColor = 0x6a6a6a
			, strokeColor = 0x5a5a5a
			, titleColor = 0xb3b3b3
			, titleShadow = 0x747474
			, secondaryColor = 0xb3b3b3;
	}

	if(ATW.isMobile()) widthLeft = 550;

	var leftGraph = new PIXI.Graphics();



	leftGraph.beginFill(fillColor, 1)
		.lineStyle(5, strokeColor, 1)
		.drawRoundedRect(0, 0, widthLeft, height, 20)
		.endFill()

	leftGraph.interactive = true;
	leftGraph.touchstart = leftGraph.mousedown = function(){}
	line.addChild(leftGraph);


	if(!ATW.isMobile()) {
		var rightGraph = new PIXI.Graphics();
		rightGraph.beginFill(fillColor, 1)
			.lineStyle(5, strokeColor, 1)
			.drawRoundedRect(0, 0, widthRight, height, 20)

		rightGraph.position.x = leftGraph.position.x + leftGraph.width + 10;

		rightGraph.interactive = true;
		rightGraph.touchstart = rightGraph.mousedown = function(){}

		line.addChild(rightGraph);

	}

	var infoContainer = new PIXI.DisplayObjectContainer();

	var name = ach.getName();
	var nameBmp = new PIXI.BitmapText(name, {font: "24px FredokaOne-Regular"})
	nameBmp = Util.DisplayText.shadow(nameBmp, 2, 0, titleShadow, 0.9);

	var description = ach.getDescription();

	// var descriptionBmp = new PIXI.BitmapText(description, {font: "22px FredokaOne-Regular", tint: 0xd49229});

	var descriptionBmp = Util.DisplayText.wrap(description, {
		font: "22px FredokaOne-Regular",
		tint: secondaryColor,
		letterMax: 30,
		align: "left",
		maxWidth: widthLeft - 20,
		lineHeight: 24
	});



	infoContainer.position.x = 10;
	infoContainer.position.y = 10;
	infoContainer.addChild(nameBmp);

	descriptionBmp.position.y = nameBmp.position.y +nameBmp.height + 10;
	descriptionBmp.position.x = 10;
	infoContainer.addChild(descriptionBmp);

	line.addChild(infoContainer);

	var progressContainer = new PIXI.DisplayObjectContainer();

	if(!isComplete) {

		if(hasGift) {
			var btnGift = Util.DisplayObject.buttonGreen(_ts('recuperer'));

			if(ATW.isMobile()) {
				btnGift.position.y = 20;
			} else {
				btnGift.position.y = 30;
				btnGift.position.x = 10;
			}

			btnGift.onHit = function(ach, line) {
				return function(){ self.rewardHandler(ach, line); }
			}(ach, line)
			progressContainer.addChild(btnGift);

		} else {
			var titleProgressBmp = new PIXI.BitmapText(_ts('progression'), {font: "24px FredokaOne-Regular"});
			titleProgressBmp = Util.DisplayText.shadow(titleProgressBmp, 2, 0, titleShadow, 0.9);
			progressContainer.addChild(titleProgressBmp);

			var graphProgress = new PIXI.Graphics();
			graphProgress.beginFill(0x949494)
				.drawRect(0, 0, 170, 26)
				.endFill();
			graphProgress.position.y = titleProgressBmp.position.y + titleProgressBmp.height+10;
			if(!ATW.isMobile()) {
				graphProgress.position.y += 10;
			}
			graphProgress.position.x = -5;

			var percent = ach.getPercent();
			var percentBmp = new PIXI.BitmapText(percent + '%', {font: "22px FredokaOne-Regular"});
			percentBmp = Util.DisplayText.shadow(percentBmp, 2, 0, 0x7e7e7e, 1);
			percentBmp.position.x = graphProgress.position.x + graphProgress.width/2 - percentBmp.width/2;
			percentBmp.position.y = graphProgress.position.y + 3;


			var maxWidth = graphProgress.width;
			var texture = PIXI.Texture.fromFrame('gradient_progress_achievement');
			var percentBar = new PIXI.TilingSprite(texture, 1, 26);
			percentBar.width = ~~(graphProgress.width * (percent/100));

			graphProgress.addChild(percentBar);

			progressContainer.addChild(graphProgress);
			progressContainer.addChild(percentBmp);

		}


	} else {
		var sprite = PIXI.Sprite.fromFrame('sh_completed');
		if(ATW.isMobile()) {
			sprite.scale.x = sprite.scale.y = 0.8;
			sprite.position.x = -20;
		} else {
			sprite.position.x = -20;
			sprite.position.y = -10;
		}

		progressContainer.addChild(sprite);
	}



	if(ATW.isMobile()) progressContainer.position.x = widthLeft - progressContainer.width - 10;
	else progressContainer.position.x = rightGraph.position.x + 20;

	progressContainer.position.y = 10;
	line.addChild(progressContainer);

	var rewardContainer = new PIXI.DisplayObjectContainer();

	if(ach.getPearls()){
		var pearl = PIXI.Sprite.fromFrame('app_pearl');
		rewardContainer.addChild(pearl);

		var qtyBmp = new PIXI.BitmapText('x' + ach.getPearls().toString(), {font: "35px FredokaOne-Regular"});
		qtyBmp = Util.DisplayText.shadow(qtyBmp, -2, 2, 0x7e7e7e, 0.9);
		// qtyBmp.position.y = 32;
		qtyBmp.position.y = 32;
		qtyBmp.position.x = -20;
		rewardContainer.addChild(qtyBmp)

	} else {
		ach.getRewards().forEach(function(rw){
			if(rw.bonus_id)
			{
				var bonus = PIXI.Sprite.fromFrame('bonus-' + rw.bonus_id);

				var isDouble = (ATW.Datas.BONUS[rw.bonus_id].key == 'BONUS_DOUBLE');
				if(isDouble) {
					bonus.scale.x = bonus.scale.y = 0.7;
					bonus.position.x = -20;
					bonus.position.y = -3;
				} else {
					bonus.scale.x = bonus.scale.y = 0.8;
					bonus.position.x = -22;
					bonus.position.y = -3;
				}

				rewardContainer.addChild(bonus);


				var qtyBmp = new PIXI.BitmapText('x' + rw.quantity.toString(), {font: "35px FredokaOne-Regular"});
				qtyBmp = Util.DisplayText.shadow(qtyBmp, -2, 2, 0x7e7e7e, 0.9);
				if(isDouble){
					qtyBmp.position.y = 32;
					qtyBmp.position.x = -8;
				} else {
					qtyBmp.position.y = 32;
					qtyBmp.position.x = -20;
				}


				rewardContainer.addChild(qtyBmp);


			}
		});
	}

	rewardContainer.scale.x = rewardContainer.scale.y = 1;

	if(ATW.isMobile()) {
		rewardContainer.position.x += widthLeft - rewardContainer.width + 30;
		rewardContainer.position.y += 62;
	} else {
		rewardContainer.position.x += rightGraph.position.x + rightGraph.width - rewardContainer.width;
		rewardContainer.position.y += 40;
	}


	line.addChild(rewardContainer);
	if(isComplete) {
		var check = PIXI.Sprite.fromFrame('sh_check');
		check.scale.x = check.scale.y = 0.9;
		check.position.x = rewardContainer.position.x - 20;
		check.position.y = rewardContainer.position.y + 5;

		line.addChild(check);
	}


	line.position.y = y;

	this.pageContainer.addChild(line);

	if(anim) {
		line.position.x = -line.width;
		TweenLite.to(line.position, 0.3, {x: 0, ease: Elastic.easeOut})


	}





	return line.position.y + line.height + 10;
};

PopupAchievement.prototype.rewardHandler = function(ach, line)
{
	if(!ach.hasGift() || ach.processing) return;
	console.log('rewardHandler', ach.getId());

	ach.processing = true;
	// ach.progress = 55555555;

	var app = ATW.App
		, player = app.getPlayer();

	if(ach.getPearls()) {
		player.incrPearls(ach.getPearls());
		app.refreshPearl();
		app.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				pearls: player.getPearls()
			}
		});
	}
	else
	{
		ach.getRewards().forEach(function(rw){
			var qty = Util.Math2.castInt(rw.quantity);
			if(rw.bonus_id)
			{
				player.incrBonus(rw.bonus_id, qty);
				app.getDataManager().getApi().call('Bonus', 'POST', {
					on: 'me',
					data: {
						quantity:player.getBonus(rw.bonus_id).getQuantity(),
						id: rw.bonus_id,
					}
				});
			}
		});


	}


	ach.reward = true;
	ach.hasUpdate = true;

	var am = player.getAchievementManager();
	am.nbGiftLeft--;
	am.save(true);

	app.refreshAwardNotif();


	var self = this;

	var tl = new TimelineMax();
	tl.to(line.position, 0.4, {x: -line.width}, 'start');
	tl.to(line, 0.4, {rotation: Util.Math2.degToRad(-30)}, 'start');
	tl.to(line.scale, 0.4, {x:0.5, y: 0.5}, 'start');

	tl.call(function(line){
		return function() {
			try{
				self.pageContainer.removeChild(line);
			} catch(e) {}
		}
	}(line))



	this.createAch(ach, line.position.y, true);



};

exports.PopupAchievement = PopupAchievement;

})(window.UI = window.UI || {});