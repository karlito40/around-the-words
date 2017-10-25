'use strict';

(function(exports){

function PopupNotif(key, force, dontSave)
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

PopupNotif.constructor = PopupNotif;
PopupNotif.prototype = Object.create(Util.Popup.prototype);

PopupNotif.prototype.create = function()
{


	var self = this
		, player = ATW.App.getPlayer();

	var titleBmp = new PIXI.BitmapText(_ts('notification'), {font: "45px FredokaOne-Regular", tint:0x4aaee1});
	titleBmp = Util.DisplayText.shadow(titleBmp, 3, 0, 0xFFFFFF, 0.9);
	titleBmp.position.x = ATW.gameMidWidth() - titleBmp.width/2;
	titleBmp.position.y = 100;
	this.addChild(titleBmp);

	var widthMax = (!ATW.isMobile()) ? 630 : 550
		, paddingY = 40
		, paddingX = 40;
	var insiderContainer = new PIXI.DisplayObjectContainer();

	this.nbMessage = 0;
	var requests = player.getMessenger().getRequests()
		, messagesContainer = new PIXI.DisplayObjectContainer()
		, y = 0;

	for(var rqID in requests) {
		this.nbMessage++;
		var request = requests[rqID];

		var fromFbId = request.from.id;

		var line = new PIXI.DisplayObjectContainer()
			, friendContainer = PIXI.Sprite.fromFrame('friend_invite_bg')
			, letter = PIXI.Sprite.fromFrame('letter');

		letter.position.y = friendContainer.height - 35;
		letter.position.x = friendContainer.width - 45;

		var pic = PIXI.Sprite.fromImage("https://graph.facebook.com/"+fromFbId+"/picture?width=62&height=62");
		pic.position.x = 18;
		pic.position.y = 15;
		friendContainer.addChild(pic);

		friendContainer.addChild(letter);


		var mess = request.message;
		// mess = 'Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices, nec descensurum quemquam ad hanc accusationem fuisse, cui,';
		var messid = mess.slice(0, 4);
		if(messid == 'ach:') {
			mess = _ts('message_succes_termine', {
				':title': _2(mess.slice(4))
			})
		} else if(messid == 'messid') {

		}

		mess = Util.String2.textCut(mess, 75, '...');


		// var textBmp = new PIXI.BitmapText(mess, {font: '22px FredokaOne-Regular'});
		var textBmp = Util.DisplayText.wrap(mess, {
			font: "20px FredokaOne-Regular",
			tint: 0xFFFFFF,
			letterMax: 20,
			align: "left",
			maxWidth: widthMax - friendContainer.width - 30,
			lineHeight: 24
		});


		textBmp.position.x = friendContainer.position.x + friendContainer.width + 20;
		textBmp.position.y = friendContainer.height/2 - textBmp.height/2 - 10;

		var textBtn = _ts('accepter');
		if(request.data.type == 'HEART') textBtn = _ts('envoyer');

		var btn = Util.DisplayObject.buttonBlue(textBtn);
		btn.position.x = widthMax - btn.width - 45;
		btn.position.y = friendContainer.height/2 - btn.height/2 - 10;
		btn.onHit = function(rqID, line, container, btn) {
			return function (){
				self.requestHandler(rqID, line, container, btn);
			}
		}(rqID, line, messagesContainer, btn);

		line.addChild(btn);


		line.addChild(friendContainer);
		line.addChild(textBmp);


		line.position.y = y;

		messagesContainer.addChild(line)

		y = line.position.y + line.height + 20;
	}

	insiderContainer.addChild(messagesContainer);

	if(!this.nbMessage) {
		var textBmp = new PIXI.BitmapText( _2('aucun_message'), {font: '22px FredokaOne-Regular'});
		textBmp = Util.DisplayText.shadow(textBmp, 2, 0, 0x0d0d0d, 0.4);
		insiderContainer.addChild(textBmp);
	}

	var overflowHeight = 600;

	var overflow = new PIXI.DisplayObjectContainer();
	var mask = new PIXI.Graphics();
	mask.beginFill()
	mask.drawRect(0, 0, insiderContainer.width, overflowHeight);
	mask.endFill();

	overflow.mask = mask;

	overflow.addChild(insiderContainer);
	overflow.addChild(mask);


	var graphContainer = new PIXI.Graphics();
	graphContainer.beginFill(0x4aaee1)
		.lineStyle(6, 0xFFFFFF)
		.drawRoundedRect(0, 0, widthMax, overflowHeight + paddingY)
		.endFill();

	overflow.position.y = paddingY/2;
	overflow.position.x = paddingX/2;

	graphContainer.addChild(overflow);

	var scroll = new PIXIScroller.ScrollBar(overflow, {
		height:overflowHeight
	});

	graphContainer.position.x = ATW.gameMidWidth() - graphContainer.width/2;
	graphContainer.position.y = titleBmp.position.y + titleBmp.height + 40;

	this.addChild(graphContainer);


	this.filter.interactive = true;
	// this.filter.mousedown = this.filter.touchstart = this.close.bind(this);

	this.filter.mousedown = this.filter.touchstart = function(){};

	var boundedBox = Util.Screen.boundedBox();
	var btnPrevious = Util.DisplayObject.button('button_previous');
	btnPrevious.position.y = ATW.gameHeight() - btnPrevious.height/2 - 27;
	btnPrevious.position.x = boundedBox.x + btnPrevious.width/2 + 22;
	btnPrevious.onHit = this.close.bind(this);
	this.addChild(btnPrevious);

};

PopupNotif.prototype.requestHandler = function(rqID, line, messagesContainer, btn) {

	var app = ATW.App
		, player = app.getPlayer()
		, messenger = player.getMessenger();

	// messagesContainer.removeChild(line);
	line.removeChild(btn);
	line.alpha = 0.5;

	var request = messenger.getRequest(rqID);
	if(!request) return;

	if(!request.db) {
		app.getDataManager().getApi().call('Social', 'POST', {
			on: request.data.type,
			data: request.data
		}, function(response){});
	}


	if(request.data && request.data.type) this.sendBack(request.data);

	messenger.deleteRequest(rqID);
	this.nbMessage--;
	if(this.nbMessage <= 0) this.close();


	app.refreshMessenger();
};

PopupNotif.prototype.sendBack = function(data)
{
	var app = ATW.App
		, player = app.getPlayer();

	switch(data.type)
	{
		case 'ADD_WORLD':
			if(data.receiver) {


				app.getDataManager().getApi().call('Notif', 'POST', {

					on: data.receiver,
					data: {
						message: _ts('demande_monde_retour', {
							':user': player.firstName,
							':world': _2(ATW.Datas.WORLDS[data.worldId].name)
						}, true),
						type: 'MESSAGE'
					}
				}, function(res){});

			}

			break;

		case 'HEART':
			if(data.receiver) {


				app.getDataManager().getApi().call('Notif', 'POST', {
					on: data.receiver,
					data: {
						message: _ts('demande_coeur_retour', {
							':user': player.firstName
						}, true),
						type: 'ACCEPT_HEART'
					}
				}, function(res){});

			}
			break;

		case 'ACCEPT_HEART':
			app.getDataManager().getApi().call('Social', 'POST', {
				on: data.type,
				data: data
			}, function(response){
				player.myUpdate(response);
			});
			break;

	}
};

exports.PopupNotif = PopupNotif;

})(window.UI = window.UI || {});