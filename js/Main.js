'use strict';
(function(namespace){

function Main()
{
	var rendererOptions = {
	    resolution:1
	};

	namespace.stage = new PIXI.Stage(0x005f82);
    this.renderer = new PIXI.CanvasRenderer(ATW.config.game.width, ATW.config.game.height, rendererOptions);
    this.resize();

    if(!navigator.isCocoonJS) window.onresize = this.resize.bind(this);

    document.body.appendChild(this.renderer.view);

   	I18N.Manager.init();
    this.update();

    var exportCDN = Util.Url.getPlatformCDN()
	, assetsToLoad = [
		exportCDN.baseUri + "resources/common.json",
		exportCDN.baseUri + "resources/loading.json",
		exportCDN.baseUri + "resources/fonts/FredokaOne-Regular.fnt"
	];

	var loader = new PIXI.AssetLoader(assetsToLoad, exportCDN.crossOrigin);
	loader.onComplete = this.ready.bind(this);

	loader.load();



};



Main.prototype.ready = function(){
	this.bg = new PIXI.TilingSprite(PIXI.Texture.fromFrame('world_dark_background'), ATW.gameWidth(), ATW.gameHeight());
	namespace.stage.addChild(this.bg);

	var loadingScene = new Scene.LoadingScene();
	loadingScene.start();
};


Main.prototype.resize = function() {

	var width = window.innerWidth || document.body.clientWidth;
	var height = window.innerHeight || document.body.clientHeight;

	var ratio = height / ATW.config.app.height;

	this.renderer.view.style.height = height + 'px';
	this.renderer.view.style.width  = width + 'px';

	var newWidth = (width / ratio);
	this.renderer.resize(newWidth, ATW.config.app.height);
	ATW.setGameWidth(newWidth);
	ATW.setGameHeight(ATW.config.app.height);
	ATW.config.ratio = ratio;
};


Main.prototype.update = function(){
	this.renderer.render(namespace.stage);
	requestAnimFrame(this.update.bind(this));
};

namespace.Main = Main;

})(window.ATW = window.ATW || {});


