'use strict';

(function(namespace) {

function LoadingScene()
{
	namespace.BaseScene.call(this, 'LoadingScene', 'loading_scene');

	this.soundTheme = [];
	this.fadeIn = false;
	this.loadedAsset = false;
	this.loadedDictionary = false;
	this.loadedDatas = false;
	this.minDisplay = ATW.config.loading.minDisplay;
};

LoadingScene.prototype.constructor = LoadingScene;
LoadingScene.prototype = Object.create(namespace.BaseScene.prototype);



LoadingScene.prototype.logic = function() {
	var self = this;

	this.startAt = (new Date()).getTime();

	// setTimeout(function(){

		self.globeAnim(
			// function(){

			// 	if(!ATW.config.test.desactiveDico) {
			// 		self.loadDictionaries();
			// 	} else {
			// 		self.loadedDictionary = true;
			// 	}
			// 	self.loadAssets();
			// 	self.loadDatas();

			// }
		);


	// }, 500);

	if(!ATW.config.test.desactiveDico) this.loadDictionaries();
	else this.loadedDictionary = true;

	this.loadAssets();
	this.loadDatas();

};

LoadingScene.prototype.loadAppRequests = function()
{
	var messenger = ATW.App.getPlayer().getMessenger(),
	fbManager = Api.FBManager;

	fbManager.findMyAppRequests(function(appRequests){
		var mapAppRequest = {};

		for(var i in appRequests){
			var appRequest = appRequests[i];

			// Permet d'eliminer les doublons
			var simpleId = (appRequest.data) ? appRequest.data + '_' + appRequest.from.id : null;


			if(!simpleId || mapAppRequest[simpleId]) {
				if(fbManager.getFB()){
					fbManager.getFB().api('/' + appRequest.id, 'delete');
				}

			} else {
				mapAppRequest[simpleId] = true;
				if(appRequest.data) {
					appRequest.data = JSON.parse(appRequest.data);
				}

				messenger.addRequest(appRequest);
			}
		}

		ATW.App.refreshMessenger();

		console.log('messenger', messenger.requests);

	});


};


LoadingScene.prototype.loadDictionaries = function(cb){
	if(EXPORT_PLATFORM == 'facebook') {
		this.loadedDictionary = true;
		this.handleCompleteLoad();
	} else {
		var self = this
		, cLoad = 0
		, toLoads = [
			{key: 'dico_array.fr', map: "DictionaryArray", create: "dictioArray"},
			{key: 'dico_sort.fr', map: "DictionarySort", create: "dictioSort"}
		];


		var nbDico = toLoads.length;

		for(var i=0; i<nbDico; i++) {
			var toLoad = toLoads[i];
			var dictionaryLoader = new Game.DictionaryLoader(toLoad.key);
			dictionaryLoader.onComplete = (function(toLoad){
				return function(error, res){
					if(error) throw new Error("LoadingScene:: Could not load " + toLoad.key);

					ATW[toLoad.create] = new Game[toLoad.map](res);

					cLoad++;

					if(cLoad == nbDico) {
						self.loadedDictionary = true;
						self.handleCompleteLoad();
					}
				}
			})(toLoad);
			dictionaryLoader.load();
		}

	}






};

LoadingScene.prototype.loadDatas = function(){
	var lang = navigator.language.slice(0, 2);

	var langAccepted = ['fr', 'it', 'en', 'de', 'es'];
	if(langAccepted.indexOf(lang) == -1) {
		lang = langAccepted[0];
	}

	var locale = '';
	if(lang == 'en') locale = lang + "_GB";
	else locale = lang + "_" + lang.toUpperCase();

	var files = [
		'difficulties',
		'lettervalues',
		'worlds',
		'decorations',
		'assets',
		'splashs',
		'bonus',
		'levels',
		'modes',
		'waves',
		'letterdrops',
		'grounds',
		'groundobject',
		'pearls',
		'sprites',
		'configs',
		'avatar',
		'tutos',
		'achievements',
		'achievementtypes',
		'shops',
		'shopcats',
		'sellers',
		'dailyreward'
	];

	var baseFile = 'resources/datas/';
	var nbFile = files.length;
	var nbLoad = 0;

	ATW.Datas = {};

	var platformCDN = Util.Url.getPlatformCDN()
		, self = this;
	files.forEach(function(val){
		var url = baseFile + val +'_' + locale + '.json';

		var jsonloader = new PIXI.JsonLoader(platformCDN.baseUri + url, true);
		jsonloader.on('loaded', function(){

			return function(e){
				ATW.Datas[val.toUpperCase()] = e.content.json || e.content.content.json;
				// if(val.toUpperCase() == 'LEVELS') {
				// 	ATW.Datas.LEVELS[11].mode_id = 6;
				// }

				nbLoad++;

				if(nbLoad >= nbFile) {
					self.loadPlayer();
				}

			}


		}(val));

		jsonloader.load();

	});
};

LoadingScene.prototype.initPlayer = function(c)
{
	ATW.App.initPlayer(c);
	this.loadedDatas = true;
	this.handleCompleteLoad();

};

LoadingScene.prototype.loadPlayer = function(){


	if(EXPORT_PLATFORM == 'facebook') {
		this.initPlayer(dt);
	} else {
		var self = this;
		ATW.App.getDataManager().getApi().call('User', 'GET', {
			on: 'me'
		}, function(res){
			self.initPlayer(res.me);
		});
	}


};

LoadingScene.prototype.loadAssets = function(){
	var self = this;
	var label = this.view.getElementById('label');

    var exportCDN = Util.Url.getPlatformCDN();

	// On charge l'integrale des images
	var assetsToLoad = [
		exportCDN.baseUri + "resources/animations/anim1.json",
		exportCDN.baseUri + "resources/worlds/worlds.json",
		exportCDN.baseUri + "resources/worlds/world_france_road.json",
		exportCDN.baseUri + "resources/worlds/world_mexico_road.json",
		exportCDN.baseUri + "resources/worlds/world_usa_road.json",
		exportCDN.baseUri + "resources/worlds/world_tanzania_road.json",
		exportCDN.baseUri + "resources/worlds/world_japan_road.json",
		exportCDN.baseUri + "resources/levels.json",
		exportCDN.baseUri + "resources/scene.json"
	];

	ATW.config.splashs.images.forEach(function(val){
		assetsToLoad.push(exportCDN.baseUri + val);
	});

	var loader = new PIXI.AssetLoader(assetsToLoad, exportCDN.crossOrigin);

	loader.onComplete = function(){
		self.loadedAsset = true;
		self.handleCompleteLoad();
	};

	loader.load();
};

LoadingScene.prototype.globeAnim = function(cb, reverse, timeScale){
	if(EXPORT_PLATFORM != 'facebook') return;

	// return;
	var self = this;

	// Lance l'anim
	var map = this.view.getElementById('map');
	var logo = this.view.getElementById('logo');


	var tl = new TimelineMax({repeat: -1});
	tl.to(map.tilePosition, ATW.config.loading.globeSpeed, {x: -map.width, ease: Linear.easeNone});

	this._addAnim(tl);

};


LoadingScene.prototype.handleCompleteLoad = function(){
	if(!this.loadedAsset || !this.loadedDictionary || !this.loadedDatas) return;


	Game.Char.setPoints(ATW.Datas.LETTERVALUES);

	Mobile.Store.init();
	this.loadAppRequests();

	var d = new Date();
	var currentTime = d.getTime();

	// Le temps ecoule entre l'affichage de la popup et la completion de loading
	var timePass = currentTime - this.startAt;
	var fireIn = Math.max(1, (this.minDisplay - timePass));

	var self = this;
	setTimeout(this.nextScene.bind(this), fireIn);

};

LoadingScene.prototype.nextScene = function(){
	var self = this;
	// this.globeAnim(function(){
		if(!ATW.config.test.desactiveSplash) {
			var splashScene = new Scene.SplashScene();
			splashScene.onSplashComplete = function() {
				var scene = self.getNextScene();
				scene.start();
			}
			splashScene.start();
		} else {
			var scene = self.getNextScene();
			scene.start();
		}



	// }, true, 10);


};

LoadingScene.prototype.getNextScene = function()
{
	var scene = new Scene.HomeScene();
	// var scene = new Scene.WinScene(getTestGame());
	// var scene = new Scene.DefeatScene(getTestGame());
	return scene;

};






namespace.LoadingScene = LoadingScene;

})(window.Scene = window.Scene || {});


