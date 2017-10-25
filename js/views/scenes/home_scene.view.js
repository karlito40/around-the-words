'use strict';
(function(views){

views.home_scene = function build_home_scene(builder) {

	var boundedBox = Util.Screen.boundedBox();

	// --------------------------------------------------------------
	// Background
	// --------------------------------------------------------------
	var bg = Util.DisplayObject.sprite('home_background');
	Util.Screen.toFullScreen(bg);
	Util.DisplayObject.center(ATW.gameDim(), bg);

	builder.add(bg);


	// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------
	Partial.header_partial(builder, boundedBox);


	// --------------------------------------------------------------
	// Logo
	// --------------------------------------------------------------
	var logo = Util.DisplayObject.sprite('app_logo');
	logo.scale.x = logo.scale.y = 0.6;

	Util.DisplayObject.center(ATW.gameDim(), logo);
	logo.position.y -= 200;

	builder.add(logo);

	// --------------------------------------------------------------
	// Play
	// --------------------------------------------------------------
	var play = Util.DisplayObject.button('button_play');
	play.scale.x = play.scale.y = 1.6;

	Util.DisplayObject.center(ATW.gameDim(), play);
	play.position.y +=  100;

	play.refId = "play";
	builder.add(play);


	// --------------------------------------------------------------
	// F4F
	// --------------------------------------------------------------
	var margin = 10;
	var F4F = Util.DisplayObject.button('app_f4f');
	F4F.position.x = boundedBox.xMax - F4F.width - margin + ~~(F4F.width/2);
	F4F.position.y = ATW.gameHeight() - F4F.height - margin + ~~(F4F.height/2);

	builder.add(F4F);


	// --------------------------------------------------------------
	// Setting
	// --------------------------------------------------------------

	margin = 20
	var setting = Util.DisplayObject.button('button_setting');
	setting.scale.x = setting.scale.y = 1.2;
	setting.position.x = margin + ~~(setting.width/2) + boundedBox.x;
	setting.position.y = ATW.gameHeight() - setting.height - margin + ~~(setting.height/2);
	setting.refId = 'setting';

	builder.add(setting);

	var textureKey = (ATW.App.getPlayer().sound) ? 'button_sound_off' : 'button_sound_on';
	var soundBtn = Util.DisplayObject.button('button_sound_off');
	soundBtn.scale.x = soundBtn.scale.y = 1.2;
	soundBtn.position.y = setting.position.y - soundBtn.height - 30;
	soundBtn.position.x = boundedBox.x + soundBtn.width/2 + 30;
	soundBtn.visible = false;
	soundBtn.refId = 'soundBtn';

	builder.add(soundBtn);


	var langContainer = new PIXI.DisplayObjectContainer();
	var x = 0;
	for(var locale in LOCALE_LIST)
	{
		var lang = locale[0] + locale[1];
		var langBtn = Util.DisplayObject.button('lang_' + lang);
		langBtn.lang = lang;
		langBtn.scale.x = langBtn.scale.y = 1.2;
		langBtn.position.x = x;

		x = langBtn.position.x + langBtn.width + 15;

		langContainer.addChild(langBtn);

	}


	langContainer.position.y = soundBtn.position.y - langContainer.height - 15;
	langContainer.position.x = boundedBox.x + 69;
	langContainer.refId = 'langContainer';
	langContainer.visible = false;

	builder.add(langContainer);


};


})(window.View = window.View || {});
