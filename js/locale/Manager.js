(function(exports){
var Manager = {
	lang: null,
	locale: null
};

Manager.init = function(){
	var lang = null;
	if (typeof dt != "undefined") {
		lang = dt.lang;
	} else {
		var o = Api.Storage.getItem('i18n');
		if(o) {
			lang = o.lang;
		}
	}
	this.set(lang);

	this.hasBeenInit = true;

};

Manager.set = function(myLang){
	if(!myLang) {
		if(typeof dt != "undefined") {
			var myLang = dt.lang;

		} else {
			var myLang = navigator.language.slice(0, 2);
		}
	}

	if(!LANG_TO_LOCAL[myLang]) {
		myLang = 'en';
	}

	var locale = LANG_TO_LOCAL[myLang];

	var player = ATW.App.getPlayer();
	if(player) {
		player.setLanguage(myLang, locale);
	}

	this.lang = myLang;
	this.locale = locale;


	var myLocale = LANG_TO_LOCAL[myLang];
	Gettext.setLocale(myLocale);
	loadTrad();

	if(this.hasBeenInit) {
		if(typeof dt == "undefined") {
			Api.Storage.setItem('i18n', {lang: myLang, locale: locale})
		} else {
			ATW.App.getDataManager().getApi().call('User', 'POST', {
				on: 'me',
				data: {
					lang: myLang,
					locale: locale
				}
			});
		}

		var files = [
			'difficulties',
			'lettervalues'
		];

		var baseFile = 'resources/datas/';
		var nbFile = files.length;
		var nbLoad = 0;

		var platformCDN = Util.Url.getPlatformCDN()
		, self = this;
		files.forEach(function(val){
			var url = baseFile + val +'_' + locale + '.json';

			var jsonloader = new PIXI.JsonLoader(platformCDN.baseUri + url, true);
			jsonloader.on('loaded', function(){

				return function(e){
					ATW.Datas[val.toUpperCase()] = e.content.json || e.content.content.json;

					nbLoad++;

					if(nbLoad >= nbFile) {
						Game.Char.setPoints(ATW.Datas.LETTERVALUES);
					}

				}


			}(val) );

			jsonloader.load();
		});

	}


};

exports.Manager = Manager;

})(window.I18N = window.I18N || {});


