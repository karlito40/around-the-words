'use strict';
(function(namespace){


function SplashScene()
{
    namespace.BaseScene.call(this, 'SplashScene');

    this.soundTheme = ['menu'];
    this.splashs = ATW.config.splashs.images;
    this.cursor = 0;
    this.displayFor = ATW.config.splashs.displayFor;
};

SplashScene.prototype.constructor = SplashScene;
SplashScene.prototype = Object.create(namespace.BaseScene.prototype);


SplashScene.prototype.create = function()
{
    this.next();
};

SplashScene.prototype.launchGame = function()
{

    this.gameScene = new GameScene();
    this.gameScene.onRestartSubmit = this.launchGame.bind(this);

    this.gameScene.start();
};


SplashScene.prototype.next = function()
{
    if(this.cursor >= this.splashs.length) {
        // this.launchGame();
        this.onSplashComplete()
        return;
    }

    var useFadeIn = false;
    if(this.bg){
        TweenLite.to(this.bg, ATW.config.scene.fadeOut, {alpha: 0});
        useFadeIn = true;
    }

    var platformCDN = Util.Url.getPlatformCDN()
    , texture = PIXI.Texture.fromFrame(platformCDN.baseUri + this.splashs[this.cursor], platformCDN.crossOrigin);

    this.bg =  new PIXI.Sprite(texture);

    Util.Screen.toFullScreen(this.bg);



    this.bg.anchor.x = 0.5;
    this.bg.anchor.y = 0.5;
    this.bg.alpha = (useFadeIn) ? 0 : 1;
    this.bg.position.x = ~~(ATW.config.game.width/2);
    this.bg.position.y = ~~(ATW.config.game.height/2);

    this.addChild(this.bg);

    if(useFadeIn) {
        TweenLite.to(this.bg, ATW.config.scene.fadeOut, {alpha: 1});
    }

    this.cursor++;

    setTimeout(this.next.bind(this), this.displayFor);
};

namespace.SplashScene = SplashScene;

})(window.Scene = window.Scene || {});