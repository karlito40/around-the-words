

/**** locale/Manager.js ****/
(function(exports){
var Manager = {};

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

	}


	var myLocale = LANG_TO_LOCAL[myLang];
	Gettext.setLocale(myLocale);
	loadTrad();
};

exports.Manager = Manager;

})(window.I18N = window.I18N || {});




/**** util/common/Url.js ****/
'use strict';

(function(exports){
var Url = {};

Url.getPlatformCDN = function(){
	var o = {};
  	o.crossOrigin = false;
    o.baseUri = '';
    if(EXPORT_PLATFORM == 'facebook') {
    	o.baseUri = CDN;
    	o.crossOrigin = true;
    }


    return o;
};

exports.Url = Url;

})(window.Util = window.Util || {});


/**** util/common/Object.js ****/
'use strict';
(function(exports){

exports.Object = {
	first: function(o){
		for(var i in o) {
			return o[i];
		}

		return null;
	},

	merge: function(o1, o2){

		for(var key in o2)
		{
			if(o1[key]) o1[key] = this.merge(o1[key], o2[key]);
			else o1[key] = o2[key];
		}

		return o1
	},

	each: function(o, cb){
		for(var key in o) {
			cb(o[key], o);
		}
	}
};

})(window.Util = window.Util || {});



/**** util/common/Array.js ****/
'use strict';
(function(exports){

exports.Array = {
	shuffle: function(o){
    	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    	return o;
	}
};


})(window.Util = window.Util || {});

/**** util/common/Color.js ****/
'use strict';


(function(exports){
var Color = {};

Color.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

Color.rgbToHex = function(rgb) {
	var rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "0x" + this.componentToHex( parseInt(rgb[1]) ) + this.componentToHex( parseInt(rgb[2]) ) + this.componentToHex( parseInt(rgb[3]) );
};

Color.hexaToColor = function(hexa){
	return '#' + hexa.toString().slice(2);
};

Color.colorToHexa = function(color) {
	return '0x' + color.toString().slice(1);
};


exports.Color = Color;

})(window.Util = window.Util || {});


/**** util/common/Date.js ****/
'use strict';

(function(exports) {
exports.Date = {
	openAt: Date.now(),
	accelAt: Date.now(),

	getOpenElapseTime: function()
	{
		var time = new Date().getTime();
		return time - this.openAt;
	},

	getAccelElapseTime: function()
	{
		var time = new Date().getTime();
		return time - this.accelAt;
	},

	refreshAccelAt: function(){
		this.accelAt = new Date().getTime();
	},


	msToObject: function(duration)
	{
		var now = new Date();
		var date = new Date(now.getTime() + duration);

		var diff = {};                           // Initialisation du retour
	    var tmp = date - now;


	    diff.ms = Math.floor(tmp%1000);

	    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
	    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

	    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
	    diff.min = tmp % 60;                    // Extraction du nombre de minutes

	    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
	    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

	    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
	    diff.day = tmp;

		diff.min = (diff.min.toString().length < 2)
							? '0' + diff.min
							: diff.min;

		diff.sec = (diff.sec.toString().length < 2)
							? '0' + diff.sec
							: diff.sec;

		diff.ms = (diff.ms.toString().length < 2)
							? '0' + diff.ms
							: diff.ms;

		return diff;
	},


	formatString: function(duration)
	{
		var o = DateHelper.msToObject(duration);
		return o.hour + ':' + o.min + ':' + o.sec;
	},


	diffMSDate: function(d1, d2)
	{
		return d1 - d2;
	},


	getMidnight: function(){
		var d = new Date();
		d.setHours(0,0,0,0);

		var ts = d.getTime();
		return ts;
	}



};

})(window.Util = window.Util || {});

/**** util/math/Math2.js ****/
'use strict';
(function(namespace){

var Math2 = {};

Math2.random = function(from, to)
{
	return Math.random()*(to-from) + from;
};

Math2.randomPlusMinus = function(chance)
{
	chance = chance ? chance : 0.5;
	return (Math.random() > chance) ? -1 : 1;
};

Math2.randomInt = function(from, to)
{
	to += 1;
	return Math.floor(Math.random()*(to-from) + from);
};

Math2.randomBool = function(chance)
{
	chance = chance ? chance : 0.5;
	return (Math.random() < chance) ? true : false;
};


Math2.degToRad = function(degrees)
{
  return degrees * Math.PI / 180;
};

Math2.compare = function(i1, i2)
{
	if(i1 == i2) return 0;

	return (i1 > i2) ? 1 : -1;
};


Math2.percent = function(current, reach)
{
	return ~~((current/reach)*100);
};

Math2.castInt = function(nb)
{
	return parseInt(nb, 10);
};

namespace.Math2 = Math2;

})(window.Util = window.Util || {});


/**** util/math/Depth.js ****/
'use strict';
(function(exports){
	function Depth(ref, scalingLevel, scaleOri){
		this.ref = ref;
		this.scalingLevel = scalingLevel;
		this.scaleOri = scaleOri || 1;
	};

	Depth.prototype.get = function(point) {
		var distance = Math.abs(this.ref.x - point.x);
		if(!distance) return this.scaleOri;

		var scale = (this.scaleOri/distance) * this.scalingLevel;
		return Math.min(scale, this.scaleOri);
	};

	exports.Depth = Depth;
})(window.Util = window.Util || {});

/**** util/math/Timer.js ****/
(function(exports){
function Timer(config) {
	this.duration = 0; // En seconde

	this.refresh(config);

	this.onMyEnd    = config.onMyEnd || null;
	this.onMyUpdate = config.onMyUpdate || null;
	this.onRestart = config.onRestart || null;
	this.isPause  = false;
	this.timer    = null;
	this.interval = 1000;
};


Timer.prototype.myGo = function(){
	this.update();
	this.timer = setInterval(this.update.bind(this), this.interval);
};

Timer.prototype.refresh = function(config) {
	var sec2ms = 1000;

	if(typeof config.minutes != "undefined") {
		this.duration = (config.minutes * 60) * sec2ms;
	} else if (typeof config.secondes != "undefined") {
		this.duration = config.secondes * sec2ms;
	} else if(typeof config.duration != "undefined") {
		this.duration = duration;
	} else {
		throw new Error('Timer::duration need');
	}

	this.oriDuration = this.duration;
};

Timer.prototype.getProgress = function() { return this.duration/this.oriDuration; };
Timer.prototype.getDurationDone = function () { return (this.oriDuration - this.duration); };

Timer.prototype.update = function(){

	if(this.duration <= 0 ){
		this.stop();
		return;
	}
	this.duration = this.duration - this.interval;

	if(this.onMyUpdate) {
		this.onMyUpdate(this);
	}
};

Timer.prototype.isLaunch = function(){
	return (this.timer == null);
};

Timer.prototype.getCurrent = function( ){
	return Util.Date.msToObject(this.duration);
};

Timer.prototype.toString = function(){
	var o = Util.Date.msToObject(this.duration);
	return o.min + ':' + o.sec + ':' + o.ms;

};

Timer.prototype.pause = function(durationSec) {
	if(this.isPause) {
		return;
	}
	var self = this;
	this.isPause = true;
	if(this.timer){
		clearInterval(this.timer);
	}

	if(durationSec) {
		setTimeout(function(){
			self.restart();
		}, durationSec * 1000);
	}
};

Timer.prototype.restart = function() {
	if(this.isPause) {
		if(this.onRestart) {
			this.onRestart();
		}
		this.isPause = false;
		this.timer = setInterval(this.update.bind(this), this.interval);
	}
};

Timer.prototype.stop = function() {
	if(this.timer){
		clearInterval(this.timer);
		if(this.onMyEnd) {
			this.onMyEnd();
		}
	}

};

Timer.prototype.kill = function(){
	if(this.timer) {
		this.onMyEnd = null;
		this.onMyUpdate = null;
		clearInterval(this.timer);
	}
};

Timer.prototype.getDuration = function(){ return this.duration; };
Timer.prototype.getOriDuration = function(){ return this.oriDuration; };

exports.Timer = Timer;

})(window.Util = window.Util || {});

/**** util/math/TimerSec.js ****/
(function(exports){

function TimerSec(config) {
	Util.Timer.call(this, config);
	this.interval = 1000;
};

TimerSec.prototype = Object.create(Util.Timer.prototype);
TimerSec.prototype.constructor = TimerSec;

TimerSec.prototype.toString = function(raw){
	if(raw) return Timer.prototype.toString.call(this);

	var now = new Date();
	var date = new Date(now.getTime() + this.duration);

	var diff = {};                           // Initialisation du retour
    var tmp = date - now;

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;


	var hours = diff.hour;
	// var minutes = diff.min;
	var minutes = (diff.min.toString().length < 2)
						? '0' + diff.min
						: diff.min;

	var seconds = (diff.sec.toString().length < 2)
						? '0' + diff.sec
						: diff.sec;

	var s = "";

	if(hours > 0) {
		minutes = (minutes.toString().length < 2) ? '0' + minutes.toString() : minutes;
		s += hours + ":";
	}
	s = seconds;
	return s;

};


exports.TimerSec = TimerSec;

})(window.Util = window.Util || {});

/**** util/math/Probability.js ****/
'use strict';

(function(exports) {


function Probability(objects, probaKey)
{
	this.probaKey = probaKey || 'probability';
	this.objects = objects;
	this.arr   = [];
	// this.freq  = [];
	this.panel = [];

	var total = 0, currentProbability = null;
	for(var key in this.objects)
	{
		var o = this.objects[key];
		this.arr.push(o);

		var currentProbability = o[this.probaKey];
		// this.freq.push(currentProbability);

		total += currentProbability;
		this.panel.push(total);
	}
};


Probability.prototype.rand = function()
{
	var range = {
		min: 0,
		max: this.panel[this.panel.length-1]
	};
	var randVal = Util.Math2.randomInt(range.min, range.max);
	var ceilObj = this.ceil(randVal);

	return this.arr[ceilObj.index];
};

Probability.prototype.ceil = function(val)
{
	var ceilObj = {
		val: this.panel[0],
		index: 0
	};

	for(var i=1; i<this.panel.length; i++)
	{
		var panelVal = this.panel[i];

		ceilObj.val = panelVal;
		ceilObj.index = i;

		if(panelVal >= val) return ceilObj;

	}

	return ceilObj;

};


exports.Probability = Probability;

})(window.Util = window.Util || {});

/**** util/text/DisplayText.js ****/
'use strict';
(function(namespace){

namespace.DisplayText = {

	shadow: function(textOri, fromTop, fromLeft, tint, alpha) {
		var shadow = new PIXI.BitmapText(textOri.text, {font: textOri.fontSize + "px " + textOri.fontName, tint: tint});
		shadow.position.x = textOri.position.x + fromLeft;
		shadow.position.y = textOri.position.x + fromTop;
		shadow.alpha = alpha;

		var group = new PIXI.DisplayObjectContainer();
		group.addChild(shadow);
		group.addChild(textOri);

		return group;
	},



	updateShadowText: function(container, text, render){
		var children = container.children
			, nb = children.length;
		for(var i=0; i<nb; i++) {
			children[i].setText(text);
			if(render) {
				children[i].updateText();
			}
		}

	},

	wrap: function(textOri, style) {
		var splitText = [],
			textLength = textOri.length,
			group = new PIXI.DisplayObjectContainer(),
			letterMax = style.letterMax || 50,
			lineHeight = style.lineHeight || 20,
			center = (style.align && style.align == "center"),
			maxWidth = style.maxWidth,
			lastSpaceIndex = 0,
			nbChar = 0,
			startAt = 0;
		for(var i=0; i<textLength; i++) {
			nbChar++;
			if(textOri[i] == ' ') lastSpaceIndex = i;

			if(nbChar >= letterMax && lastSpaceIndex > startAt) {
				splitText.push(textOri.slice(startAt, lastSpaceIndex));
				if(nbChar < textLength) nbChar = 0;
				startAt = lastSpaceIndex+1;

			}

		}
		if(nbChar) splitText.push(textOri.slice(startAt, textLength));
		var nbSegment = splitText.length;
		for(var i=0; i<nbSegment; i++) {
			var textEncart = new PIXI.BitmapText(splitText[i], style);
			textEncart.position.y = lineHeight*i;
			if(center && maxWidth) {
				textEncart.position.x = ~~(maxWidth/2 - textEncart.width/2)
			}
			group.addChild(textEncart);

		}


		return group;

	}

};

})(window.Util = window.Util || {});


/**** util/text/String2.js ****/
'use strict';
(function(namespace){

namespace.String2 = {
	strtr: function(string, o) {
		var s2 = string;
		for(var find in o) {
	 		var replaceBy = o[find];
	 		var regex = new RegExp(find, "g");

	 		s2 = s2.replace(regex, replaceBy);
	 	}

	 	return s2;
	},

	textCut: function(text, max, replace) {
		if(text.length > max) {
			text = text.substr(0, max);
			if(replace) {
				text += replace;
			}
		}

		return text;
	},


	sort: function(s) {
		var chars  = s.split('');
		chars.sort();
		return chars.join('');
	},

	strip: function(s) {
		return s.replace(/<[^>]*>?/g, '');
	}



};

})(window.Util = window.Util || {});




/**** util/text/Dictionary.js ****/
(function(exports){
exports.Dictionary = {

	_cacheExist: {},
	_cacheLargerWord: {},

	createAbc: function(doShuffle)
	{
		var abc = [];
		for(var code=CharHelper.code.a; code<=CharHelper.code.z; code++) abc.push(code);

		if(doShuffle) abc = shuffle(abc);
		return abc;
	},

	startBy: function(by, inLength)
	{
		// if(!dictionary[inLength])
		if(!AroundTheWords.tabDictionary[inLength]) return false;


		var elems = AroundTheWords.tabDictionary[inLength];
		for(var i in elems)
		{
			var checkWord = elems[i];

			if(checkWord.indexOf(by) == 0) return checkWord;

		}

		return false;
	},

	findLargerWord: function(sortedLetter, cb)
	{
		// console.log('findLargerWord', sortedLetter);
		if(typeof this._cacheLargerWord[sortedLetter] != "undefined")
		{
			if(cb)
			{
				cb(this._cacheLargerWord[sortedLetter])
			}
		}
		else
		{
			var self = this;
			ATW.App.getDataManager().getApi().call('Word', 'GET', {
				on: 'findLargerWord',
				data: {
					sortedLetter: sortedLetter
				}
			}, function(res){
				if(!res.error)
				{
					self._cacheLargerWord[sortedLetter] = res.lword;

					if(cb)
					{
						cb(res.lword)
					}

				}
			});
		}


	},

	generateRandWord: function(nb, length, cb, hangedTuto)
	{
		ATW.App.getDataManager().getApi().call('Word', 'GET', {
			on: 'generateRand',
			data: {
				hangedTuto: (hangedTuto) ? 1 : 0,
				nb: nb,
				length: length
			}
		}, function(res) {
			if(res.error)
			{
				return;
			}

			if(res.list && cb)
			{
				cb(res.list);
			}
		});
	},

	exist: function(word, cb)
	{
		var self = this;

		if(typeof this._cacheExist[word] != "undefined")
		{
			if(cb) cb(this._cacheExist[word])

			return null;
		}


		return ATW.App.getDataManager().getApi().call('Word', 'GET', {
			on: 'find',
			data: {
				word: word
			}
		}, function(res){
			console.log('res', res);
			if(res.error)
			{
				if(cb) cb(null);
			}
			else
			{
				self._cacheExist[word] = res.ex;
				if(cb) cb(self._cacheExist[word]);

			}

		});

	}
}

})(window.Util = window.Util || {});

/**** util/ui/Screen.js ****/
'use strict';
(function(namespace){

namespace.Screen = {

	toFullScreen: function(displayObject){

	    var compare = (displayObject.width < displayObject.height) ? 'width' : 'height';

	    if(displayObject[compare] < ATW.config.game[compare]) {
	        var ratio = ATW.config.game[compare]/displayObject[compare];
	        displayObject.scale.x = ratio;
	        displayObject.scale.y = ratio;
	    }

	},

	boundedBox: function(displayObject) {
		if(!displayObject) {
			var wrapper = ATW.config.wrapper;
			var midWidth = wrapper.width/2;
			var x = ~~(ATW.gameMidWidth() - midWidth)
			var xMax = ~~(ATW.gameMidWidth() + midWidth);

			return {
				x:  Math.max(0, x),
				xMax: Math.min(ATW.gameWidth(), xMax)
			}

		}

		return  {
			x: Math.max(0, displayObject.position.x),
			xMax: Math.min(ATW.gameWidth(), displayObject.position.x+displayObject.width)
		}
	}


};

})(window.Util = window.Util || {});


/**** util/ui/DisplayObject.js ****/
'use strict';
(function(namespace){

var DisplayObject = {};

DisplayObject.center = function(target, displayObject) {
	this.centerX(target.width, displayObject);
	this.centerY(target.height, displayObject);
};

DisplayObject.centerX = function(targetWidth, displayObject) {
	displayObject.position.x = ~~(targetWidth/2 - displayObject.width/2);

	if(typeof displayObject.anchor == "undefined") return;
	displayObject.position.x += ~~(displayObject.width * displayObject.anchor.x);
};

DisplayObject.centerY = function(targetHeight, displayObject) {
	displayObject.position.y = ~~(targetHeight/2 - displayObject.height/2);

	if(typeof displayObject.anchor == "undefined") return;
	displayObject.position.y += ~~(displayObject.height * displayObject.anchor.y);
};

DisplayObject.sprite = function(frame) {
	return new PIXI.Sprite(PIXI.Texture.fromFrame(frame));
};

DisplayObject.button = function(frame) {
	var texture = PIXI.Texture.fromFrame(frame);
	return new UI.Button(texture);
};

DisplayObject.buttonColor = function(text, theme) {
	var group = new PIXI.DisplayObjectContainer();

	var leftSide = PIXI.Sprite.fromFrame('button_'+theme+'_left');
	group.addChild(leftSide);

	var s = new PIXI.BitmapText(text, {font: "20px FredokaOne-Regular"});
	s = Util.DisplayText.shadow(s, 2, 0, 0x0d0d0d, 0.3);

	var texture = PIXI.Texture.fromFrame('button_'+theme+'_repeat');
	var center = new PIXI.TilingSprite(texture, 1, leftSide.height);

	center.position.x = leftSide.position.x + leftSide.width-1;
	center.width = s.width + 3;
	s.position.x = 1;
	s.position.y = center.height/2 - s.height/2;
	center.addChild(s);

	group.addChild(center);

	var rightSide = PIXI.Sprite.fromFrame('button_'+theme+'_right');
	rightSide.position.x = center.position.x + center.width -1;
	group.addChild(rightSide);


	group.hitArea = new PIXI.Rectangle(0, 0, group.width, group.height);

	group.interactive = true;
	group.buttonMode = true;
	group.touchstart = group.mousedown = function(){
		group.rotation = Util.Math2.degToRad(-15);

		TweenMax.to(group, 0.4, {rotation: 0, ease: Elastic.easeOut});

		if(group.onHit) group.onHit();
	}

	return group;
};


DisplayObject.buttonGreen = function(text){
	return this.buttonColor(text, 'green');

};

DisplayObject.buttonBlue = function(text) {
	return this.buttonColor(text, 'blue');
};

DisplayObject.xMax = function(displayObject){
	return displayObject.width + displayObject.position.x;
};

DisplayObject.circleProfil = function(fbId) {
	var width = 75, height = 75, container = new PIXI.DisplayObjectContainer();

	// var profilPic = PIXI.Sprite.fromImage('https://graph.facebook.com/'+fbId+'/picture?width=' + width + '&height=' + height, true);
	var profilPic = PIXI.Sprite.fromImage('https://graph.facebook.com/100/picture?width=' + width + '&height=' + height, true);
	var mask = new PIXI.Graphics();
	mask.beginFill(0x000000);
	mask.drawCircle(~~(width/2), ~~(height/2), ~~(width/2));
	mask.endFill();

	container.addChild(profilPic);
	container.addChild(mask);

	profilPic.mask = mask;

	return container;
}





namespace.DisplayObject = DisplayObject;


})(window.Util = window.Util || {});



/**** util/ui/Container.js ****/
'use strict';
(function(exports){
	var Container = {};

	Container.anchor = function(displayObjectContainer, x, y) {
		for(var i=displayObjectContainer.children.length-1; i>=0; i--) {
			var children = displayObjectContainer.children[i];
			if(children.anchor) {
				children.anchor.x = x;
				children.anchor.y = y;
			}
		}

	};

	exports.Container = Container;
})(window.Util = window.Util || {});


/**** util/ui/Popup.js ****/
(function(exports){

function Popup()
{
	PIXI.DisplayObjectContainer.call(this);

	this.filterAlpha = 0.55;
	this.isOpen = false;

};

Popup.constructor = Popup;
Popup.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Popup.current = null;

Popup.prototype.open = function(){
	var self = this;
	Popup.current = this;
	this.isOpen = true;
	this.alpha = 0;

	this.addFilter();

	this.create();

	if(this.closeBtn) this.closeBtn.onHit = this.close.bind(this);

	ATW.stage.addChild(this);

	TweenLite.to(this, 0.5, {alpha:1});
};

Popup.prototype.create = function(){};



Popup.prototype.addFilter = function(){
	this.filter = new PIXI.Graphics();
	this.filter.beginFill(0x000000)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.filter.alpha = this.filterAlpha;
	// this.filter.interactive = true;
	// this.filter.touchstart = this.filter.mousedown = function toto(){}

	this.addChild(this.filter);

};

Popup.prototype.close = function(){
	if(!this.isOpen) return;

	Popup.current = null;

	this.isOpen = false;

	if(this.onClose)
	{
		this.onClose();
	}

	var self = this;
	TweenMax.to(this, 0.3, {alpha:0, onComplete:function(){
		ATW.stage.removeChild(self);
	}});


};

exports.Popup = Popup;


})(window.Util = window.Util || {});


/**** util/control/Drag.js ****/
'use strict';
(function(exports){
	function Drag (displayObject, debug) {
		this.displayObject = displayObject;
		this.oriInteractive = this.displayObject.interactive;
		this.displayObject.interactive = true;
		this.debug = debug;

		this.play = true;	 // est ce que le drag est autorisé ?
		this.active = false; // est ce que l'utilisateur appuie sur sa souris ?
		this.start = {x: 0, y:0};
		this.displayObject.touchstart = this.displayObject.mousedown = this.down.bind(this);
		this.displayObject.touchmove = this.displayObject.mousemove = this.move.bind(this);
		this.displayObject.touchend = this.displayObject.mouseup = this.up.bind(this);
		this.tween = null;
		// this.lastTime = null;
		this.addPanel();
	};

	Drag.prototype.down = function(interactionData) {
		this.active = true;
		this.start = interactionData.getLocalPosition(ATW.stage);
	};

	Drag.prototype.move = function(interactionData) {
		if(!this.active || !this.play) return;

		// var now = new Date().getTime();
		// if(this.lastTime && (now - this.lastTime) < 10) return;

		// this.lastTime = now;

		if(this.tween) this.tween.kill()

		var cursor = interactionData.getLocalPosition(ATW.stage);
		this.displayObject.position.x += cursor.x - this.start.x;
		this.displayObject.position.y += cursor.y - this.start.y;

		// this.tween = TweenLite.to(this.displayObject.position, 1.5, {
		// 	x: this.displayObject.position.x + (cursor.x -this.start.x),
		// 	y: this.displayObject.position.y + (cursor.y -this.start.y),
		// 	ease: Power2.easeOut
		// });

		this.start = cursor;
		this.updateDebug();
	};

	Drag.prototype.up = function(interactionData) {
		this.active = false;
	};

	Drag.prototype.desactive = function() {
		this.play = false;
		this.displayObject.interactive = this.oriInteractive;
	};

	Drag.prototype.reactive = function() {
		this.play = true;
		this.displayObject.interactive = this.oriInteractive;
	};

	Drag.prototype.addPanel = function() {
		if(!this.debug) return;

		this.panel = new PIXI.BitmapText(this._getDebugText(), {font: "20px FredokaOne-Regular"});
		this.displayObject.addChild(this.panel);
	};

	Drag.prototype.updateDebug = function(){
		if(!this.debug) return;

		this.panel.setText(this._getDebugText());
	};

	Drag.prototype._getDebugText = function(){
		return '[' + this.displayObject.position.x + ', ' + this.displayObject.position.y + ']';
	};

	Util.Drag = Drag;
})(window.Util = window.Util || {});

/**** util/control/Scroll.js ****/
'use strict';
(function(exports){

function Scroll(displayObject, camera, column)
{

	this.displayObject = displayObject;

	this.ticker = this.frame = this.velocity = this.reference = this.amplitude = null;

	this.timeConstant = 175;
	this.min = this.displayObject.position.x;
	this.pressed = false;
	this.traveling = 0;
	// this.max = this.displayObject.height - boundary.height;
	this.max = this.displayObject.position.x - this.displayObject.width + camera.width;

    if(column) {
        this.snap = (this.max - this.min)/column;
    }

	this.displayObject.interactive = true;

	this.displayObject.touchstart = this.displayObject.mousedown = this.tap.bind(this);
	this.displayObject.touchmove = this.displayObject.mousemove = this.drag.bind(this);
	this.displayObject.touchend = this.displayObject.mouseup = this.release.bind(this);

};



Scroll.prototype.tap = function(interactionData)
{
	var cursor = interactionData.getLocalPosition(ATW.stage);

	this.pressed = true;
    this.reference = cursor.x;

    this.velocity = this.amplitude = 0;
    this.frame = this.displayObject.position.x;
    this.timestamp = Date.now();

    if(this.ticker) {
    	clearInterval(this.ticker);
    	this.ticker = null;
    }
    this.ticker = setInterval(this.track.bind(this), 100);
};

Scroll.prototype.drag = function(interactionData)
{
    if (!this.pressed) return;

	var cursor = interactionData.getLocalPosition(ATW.stage);
	var x, delta;
    x = cursor.x;

    delta = x - this.reference;

    if (delta > 2 || delta < -2) {
        this.reference = x;
        this.translate(this.displayObject.position.x + delta);
    }
};

Scroll.prototype.release = function(interactionData)
{
	this.pressed = false;

	if(this.ticker){
		clearInterval(this.ticker);
		this.ticker = null;
	}

  /*  if (this.velocity > 10 || this.velocity < -10) {
        // this.amplitude = 0.03 * this.velocity;
        this.amplitude = 0.025 * this.velocity;
        // this.amplitude = 0.025 * this.velocity;
        this.target = Math.round(this.displayObject.x + this.amplitude);
        this.timestamp = Date.now();
        requestAnimationFrame(this.autoTraject.bind(this));
    }*/

    this.target = this.displayObject.position.x;
    if (this.velocity > 10 || this.velocity < -10) {
        // this.amplitude = 0.025 * this.velocity;
        this.amplitude = 0.025 * this.velocity;
        this.target = this.displayObject.x + this.amplitude;

    }

    if(this.snap) {
        this.target = Math.round(this.target/this.snap) * this.snap;
    }
    this.amplitude = this.target - this.displayObject.position.x;

    this.timestamp = Date.now();
    requestAnimationFrame(this.autoTraject.bind(this));

};


Scroll.prototype.track = function()
{
	var now, elapsed, delta, v;

    now = Date.now();
    elapsed = now - this.timestamp;
    this.timestamp = now;
    delta = this.displayObject.position.x - this.frame;
    this.frame = this.displayObject.position.x;

    v = 1000 * delta / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
};


// autoScroll
Scroll.prototype.autoTraject = function()
{
    if (!this.amplitude) return;

    var elapsed = Date.now() - this.timestamp;
    var delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);
    if (delta > 0.5 || delta < -0.5) {
        // this.translate(this.displayObject.position.x - delta);
    	this.translate(this.target + delta);
    	requestAnimationFrame(this.autoTraject.bind(this));
	} else {
        this.translate(this.target);
    }

};

// scroll
Scroll.prototype.translate = function(x)
{
	if(x < this.max) {
		x = this.max
	} else if(x > this.min) {
		x = this.min;
	}

	var old = this.displayObject.position.x;
	this.displayObject.position.x = x;
    // console.log('this.current', this.displayObject.position.x);
	this.traveling += old - this.displayObject.position.x;

	if(this.onUpdate) this.onUpdate(this.traveling);
};

exports.Scroll = Scroll;


})(window.PIXIScroller = window.PIXIScroller || {});

/**** util/control/Sound.js ****/
'use strict';

(function(exports){

var Sound = exports.Sound = {};

Sound.fxPlay = function(){};
Sound.play = function(){};

exports.Sound = Sound;

})(window.Util = window.Util || {});

/**** util/config/Achievement.js ****/
(function(exports){

var Achievement;
exports.Achievement = Achievement = {};

Achievement.castByKey = function(){
	var res = {};

	var achievements = ATW.Datas.ACHIEVEMENTS;
	var achievementtypes = ATW.Datas.ACHIEVEMENTTYPES;
	for(var id in achievements)
	{
		var cfAch  = achievements[id];
		var achKey = achievementtypes[cfAch.actype_id].key;

		if(!res[achKey])
		{
			res[achKey] = {};
		}

		res[achKey][cfAch.id] = new Model.Achievement(cfAch);
	}

	return res;
};

Achievement.getTypeKey = function(achId) {
	var c = this.getType(achId);
	return c.key;
};

Achievement.getTypeDescription = function(achId) {
	var c = this.getType(achId);
	return c.name;
};

Achievement.getType = function(achId) {
	var cAchs = ATW.Datas.ACHIEVEMENTS
		, achTypes = ATW.Datas.ACHIEVEMENTTYPES;
	return achTypes[cAchs[achId].actype_id];
};



}) (window.Util = window.Util || {});

/**** util/config/Level.js ****/
(function(exports){

var Level;
exports.Level = Level = {};

Level._cacheOrder = null;

Level.isAccessible = function(cLevel)
{
	return !this.getPrevious(cLevel);
};

Level.getFirst = function(worldId)
{

	return ATW.Datas.LEVELS[WORLDS[worldId].levels[0]];
};

Level.getNext = function(cLevel)
{

	var nextID = ATW.Datas.WORLDS[cLevel.world_id].levels[cLevel.order+1]
	if(!nextID)
	{
		return false;
	}
	return ATW.Datas.LEVELS[nextID];
};

Level.getPrevious = function(cLevel)
{
	var previousID = ATW.Datas.WORLDS[cLevel.world_id].levels[cLevel.order-1];
	if(!previousID)
	{
		return false;
	}
	return ATW.Datas.LEVELS[previousID];
};

}) (window.Util = window.Util || {});

/**** util/config/Bonus.js ****/
(function(exports){

exports.Bonus = {
	_cacheByKey: null,
	_cacheByTuto: null,

	_createCache: function() {
		if(!this._cacheByKey) {
			this._cacheByTuto = {};
			this._cacheByKey = {};
			var bs = ATW.Datas.BONUS;
			for(var i in bs) {
				this._cacheByKey[bs[i].key] = bs[i];
				if(bs[i].tuto_key) {
					this._cacheByTuto[bs[i].tuto_key] = bs[i];
				}
			}
		}
	},

	findByKey: function(key) {
		this._createCache();
		return this._cacheByKey[key];
	},

	findByTuto: function(tut) {
		this._createCache();
		return this._cacheByTuto[tut];
	}
};

})(window.Util = window.Util || {});

/**** util/config/Shop.js ****/
'use strict';

(function(exports){
exports.Shop = {

	_cacheByKey: null,

	findProductByKey: function(key) {
		if(!this._cacheByKey) {
			this._cacheByKey = {};

			var shops = ATW.Datas.SHOPS;
			for(var catID in shops){
				var groupProduct = shops[catID];

				for(var productId in groupProduct) {
					var product = groupProduct[productId];

					if(!product.key) continue;
					this._cacheByKey[product.key] = product;

				}

			}

		}

		return this._cacheByKey[key];

	},


	instaShop: function(cProduct, onAllow, onRes, onDisallow, onCancel)
	{
		var self = this
			, cSeller = ATW.Datas.SELLERS[cProduct.seller_id]
			, player = ATW.App.getPlayer()
			, toBuy = {
				u: {}
			};

		if(cProduct.bonus)
		{

			toBuy.u.bonusMap = {};
			var prodBonusContent = cProduct.bonus.content;
			for(var i in prodBonusContent)
			{
				var val = prodBonusContent[i];
				var qty = Util.Math2.castInt(val.qty);

				if(player.hasBonus(val.bonus_id))
				{
					qty += player.getBonus(val.bonus_id).getQuantity();
				}

				toBuy.u.bonusMap[val.bonus_id] = {
					quantity: qty,
					id: val.bonus_id
				};


			}
		}
		else if(cProduct.pearl)
		{
			toBuy.u.pearls = cProduct.pearl;
		}
		else if(cProduct.key == 'UNLIMITED_SESSION')
		{
			toBuy.u.immunity = 1;
		}
		else if(cProduct.key == 'NEED_LOVE')
		{
			toBuy.u.life = 5;
		}
		else if(cProduct.key == 'FRIEND_BASE')
		{
			toBuy.friend = {
				worldId: cProduct.worldId
			};
		}
		else if(cProduct.key.slice(0, 5) == 'BONUS')
		{
			var cBonus = Util.Bonus.findByKey(cProduct.key);
			var nextQty = (player.getBonus(cBonus.id)) ? player.getBonus(cBonus.id).getQuantity()+1 : 1;

			toBuy.b = {
				id: cBonus.id,
				quantity: nextQty
			};
		}
		else if(cProduct.key == 'LEVEL')
		{
			toBuy.level = {
				world_id: cProduct.worldId,
				level_id: cProduct.levelId,
				first_name: player.getFirstName(),
				bought: true
			}
		}
		else
		{
			throw new Error('There is nothing to buy');
		}

		var discountId = cProduct.disc_id;
		var discountAvailable = (discountId && DISC[discountId]) ? 1 : 0;

		if(cSeller.key == 'APP')
		{
			toBuy.productId = cProduct.id;
			toBuy.price = cProduct.price;
			ATW.App.instaShop(cProduct.price, toBuy, onAllow, onRes, discountId, onDisallow);
			return cSeller.key;
		}
		else if(cSeller.key == 'FB')
		{
			console.log('Shop::instaShop FB need to be implemented');
			// var graph = WEB_URI + 'facebook.php?action=graph&type=product&shId=' + cProduct.id + '&fromDiscount=' + discountAvailable + '&myLocale='+App.getPlayer().getLocale();

			// var self = this;

			// if( !fbManager.ui({
			// 		method: 'pay',
			// 		action: 'purchaseitem',
			// 		product: graph
			//     },
			// 	function (data) {


			// 		if(!data || data.error_code) {
			// 			if(onCancel) onCancel();
			// 			return;
			// 		}


			// 		if(onAllow) onAllow();


			// 		if(data.payment_id) {
			// 			self.checkPayment(data.payment_id, onRes);
			// 		}

			// 	})
			// ) {
			// 	return false;
			// }

			// return cSeller.key;

		}
		else
		{
			throw new Error('seller '+seller.key+' need to be implemented');
		}
	},


	checkPayment: function(requestId, onRes)
	{


		var self = this;
		setTimeout(function(){
			App.getDataManager().getApi().call('User', 'GET', {
				on: 'payment',
				data: {
					requestId: requestId
				}
			}, function(response) {
				if(!response.status || response.status != 'completed'){
					self.checkPayment(requestId, onRes);
					return;
				}

				if(onRes) onRes(response);

				App.getPlayer().myUpdate(response);

				$('.moneyControl .txt').html(App.getPlayer().getPearls());

			});
		}, 600);
	}


};

})(window.Util = window.Util || {});

/**** util/config/ShopCat.js ****/
'use strict';
(function(exports){

	exports.ShopCat = {
		findByKey: function(key) {
			for(var i in ATW.Datas.SHOPCATS) {
				if(ATW.Datas.SHOPCATS[i].key == key) {
					return ATW.Datas.SHOPCATS[i];
				}
			}
			return false;
		}

	};

})(window.Util = window.Util || {});

/**** util/config/Ground.js ****/
(function(exports){
exports.Ground = {
	_cacheByGroundType: null,

	_createCache: function()
	{
		if(!this._cacheByGroundType)
		{
			this._cacheByGroundType = {};

			var cGrounds = ATW.Datas.GROUNDS;
			for(var i in cGrounds)
			{
				if(!this._cacheByGroundType[cGrounds[i].groundType_id])
				{
					this._cacheByGroundType[cGrounds[i].groundType_id] = [];
				}
				this._cacheByGroundType[cGrounds[i].groundType_id].push(cGrounds[i]);
			}
		}
	},

	findByGdType: function(gdTypeId) {
		this._createCache();
		return this._cacheByGroundType[gdTypeId];
	}

};

})(window.Util = window.Util || {});




/**** util/config/World.js ****/
'use strict';

(function(exports){
	exports.World = {

		cacheOrder: null,

		isAccessible: function(world)
		{
			return !this.getPrevious(world);
		},

		getPrevious: function(world)
		{
			this._createCacheOrder();
			return (this.cacheOrder[world.order-1]);
		},

		_createCacheOrder: function()
		{
			if(!this.cacheOrder)
			{
				var cWorlds = ATW.Datas.WORLDS;
				this.cacheOrder = {};
				for(var i in cWorlds)
				{
					var w = cWorlds[i];
					this.cacheOrder[w.order] = w;
				}
			}

			return this.cacheOrder;

		}
	};
}) (window.Util = window.Util || {});


/**** api/manager/DataManager.js ****/
'use strict';

(function(exports){

function DataManager(online)
{
	this.online = online;
	this.apis   = {};
};

DataManager.ONLINE = "OnlineApi";
DataManager.OFFLINE = "OfflineApi";


DataManager.prototype.getOnlineApi = function(){
	return this.getApi(DataManager.ONLINE);
};

DataManager.prototype.getOfflineApi = function() {
	return this.getApi(DataManager.OFFLINE);
};

DataManager.prototype.getApi = function(apiName)
{
	if(!apiName) {
		var apiName = (this.online) ? DataManager.ONLINE : DataManager.OFFLINE;
	}

	if(!this.apis[apiName]) {
		this.apis[apiName] = new Api[apiName]();
	}

	return this.apis[apiName];
};

DataManager.prototype.isOnline = function() { return this.online; };


DataManager.prototype.setOnline = function(online)
{
	return this.online;
};



exports.DataManager = DataManager;

})(window.Api = window.Api || {});

/**** api/manager/Api.js ****/
'use strict';

(function(exports){

function Api(){};

Api.prototype.call = function(/* use arguments */)
{

	if(!arguments.length || arguments.length > 4)
	{
		throw new Error("Api::call arguments invalides");
	}
	var callback = null;
	var lastIndex = arguments.length-1;
	var lastArgument = arguments[lastIndex];
	if(typeof lastArgument == "function")
	{
		callback = lastArgument;
	}


	var path     = arguments[0];
	var method   = (!(lastIndex == 1 && callback) && typeof arguments[1] != "undefined") ? arguments[1] : "get";
	var params   = (!(lastIndex == 2 && callback) && typeof arguments[2] != "undefined") ? arguments[2] : null;

	method = method.toLowerCase();
	if(method != "get" && method != "post" && method != "delete")
	{
		throw new Error('Api::call method{get,post,delete} accepte');
	}
	return this._call(path, method, params, callback);

};


Api.prototype._call = function(path, method, params, callback)
{
	throw new Error('Api::_call doit etre surcharge');

};

exports.Api = Api;

})(window.Api = window.Api || {});

/**** api/manager/OnlineApi.js ****/
'use strict';

(function(exports){

function OnlineApi(){};

OnlineApi.prototype = Object.create(Api.Api.prototype);
OnlineApi.prototype.constructor = OnlineApi;

OnlineApi.prototype._call = function(path, method, params, callback)
{
	var obscData = {
		graph: path,
		method: method,
		params: params,
		d: Date.now()
	};

 	// var sa = '1f87c7027a89d1a84ebdddab67b6193b' + ATW.App.getPlayer().fbId;
 	var sa = '1f87c7027a89d1a84ebdddab67b6193b';
	obscData = btoa(JSON.stringify(obscData));

	obscData = CryptoJS.MD5(obscData + sa) + "." + obscData;

	var data = {
		// path: "api/handle",
		enc: obscData
	};


	if(typeof signed_request != "undefined") data.signed_request = signed_request;

	var dataTab = [];
	for(var key in data) dataTab.push(key+'='+data[key]);

	var postData = dataTab.join('&');
	var xhr = new XMLHttpRequest();
	var url = 'api.php';
	if(EXPORT_PLATFORM != 'facebook') {
		url = WWW_PROD + url
	}

	xhr.open('GET', url + '?'+postData, true);
	// xhr.open('POST', 'api.php', true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	// xhr.setRequestHeader("Content-length", postData.length);
	xhr.setRequestHeader("Accept", "application/json, text/javascript");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	// xhr.send(postData);

	try{
		xhr.send(null);
	} catch(e) {
		if(callback) {
			callback({
				error: 1,
				message: "HTTP Request"
			});
		}

	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4) {
			if(xhr.status == 200) {
				var response = xhr.responseText;
				if(xhr.responseText[0] == '{') {
					response = JSON.parse(response);
				}

				if(response && response.maj) {
					IS_PATCHING = true;
					var patchScene = new PatchScene();
					patchScene.start();
				}

				if(callback) {
					callback(response);
				}

			} else if(callback) {
				callback({
					error: 1,
					message: "HTTP Request"
				});
			}


		}
	};

	return xhr;



	return $.ajax({
		type: "POST",
		dataType: "json",
		url: "api.php",
		data: data,
		success: function(response){
			if(response && response.maj) {
				IS_PATCHING = true;
				var patchScene = new PatchScene();
				patchScene.start();
			}

			if(callback) {
				callback(response);
			}
		},
		error : function(response) {
			if(callback) {
				callback({
					error: 1,
					message: "HTTP Request"
				});
			}
		}
	});
};

exports.OnlineApi = OnlineApi;

})(window.Api = window.Api || {});

/**** api/manager/OfflineApi.js ****/
'use strict';

(function(exports){

function OfflineApi(){};

OfflineApi.prototype = Object.create(Api.Api.prototype);
OfflineApi.prototype.constructor = OfflineApi;

OfflineApi.prototype._call = function(path, method, params, callback)
{
	var response = {};
	if(Api[path]) {
		response = Api[path][method](params);
	} else {
		console.log('OfflineApi::_call ' + path + ' need to be implemented');
	}

	if(callback) callback(response);

};


exports.OfflineApi = OfflineApi;

})(window.Api = window.Api || {});

/**** api/manager/Storage.js ****/
'use strict';

(function(exports){

var system = window.localStorage;
if(typeof system == "undefined")
{
	system = {
		map: {},
		setItem: function(key, value){
			this.map[key] = value;
		},

		getItem: function(key) {
			return this.map[key];
		}

	}
};

exports.Storage = {
	namespace: 'atw',
	setItem: function(key, value) {
		value = JSON.stringify(value);
		system.setItem(this.createKey(key), value);
	},

	getItem: function(key) {
		var value = system.getItem(this.createKey(key));
		return JSON.parse(value);
	},

	createKey: function(key) {
		return key + "_" + this.namespace;
	}

};


})(window.Api = window.Api || {});

/**** api/manager/FBManager.js ****/
(function(exports){

exports.FBManager = {

	FB: null,
	apiStand: [],

	api: function(graph, callback){
		if(!this.FB) {
			this.apiStand.push({
				graph: graph,
				callback: callback
			});
			return;
		}

		this.FB.api(graph, function(response) {
			callback(response);
		});

	},

	flush: function(){
		for(var i in this.apiStand) {
			var o = this.apiStand[i];

			this.api(o.graph, o.callback);
		}

		this.apiStand = [];
	},


	appRequest: function(o, callback){
		if(!this.FB) {
			return;
		}

		o.method = 'apprequests';
		this.FB.ui(o, callback);
	},

	ui: function(o, cb){
		if(!this.FB){
			return false;
		}

		this.FB.ui(o, cb);
		return true;
	},


	findMyAppRequests: function(callback){
		this.findAppRequests(App.getPlayer().fbId, callback);
	},

	findAppRequests: function(userId, callback) {
		this.api(userId + '/apprequests', function(response){
			if(callback) {
				var data = response.data || {};
				callback(data);
			}
		});
	},

	getFB: function(){
		return this.FB;
	},

	setFB: function(FB) {
		this.FB = FB;
	}



};



})(window.Api = window.Api || {});

/**** api/graph/Word.js ****/
'use strict';

(function(exports){

var Word = {};

Word.get = function(params){
	var response = {};
	switch(params.on) {
		case 'find':
			console.log('Word::find');
			var checkWord = params.data.word.toUpperCase(),
				exist;

			if(this._hasJoker(checkWord)){
				console.log('Word::find joker detected');

				exist = this._applyJoker(checkWord);

			} else {
				console.log('Word::find no joker detected');
				var sortedWord = Util.String2.sort(checkWord)
				, section = ATW.dictioSort.map[sortedWord.length];

				if(section && section[sortedWord]) exist = true;
			}

			response.ex = exist;
			console.log('Word::find result', checkWord, sortedWord, exist);

			break;


		case 'findLargerWord':
			console.log('Word::findLargerWord');

			var sortedLetter = params.data.sortedLetter.toUpperCase()
				, minLength = params.data.minLength || 1;

			response.lword = this._findLarger(sortedLetter, parseInt(minLength, 10));
			console.log('Word::findLargerWord result', response);

			break;

		case 'generateRand':
			console.log('Word::generateRand');
			var nb = parseInt(params.data.nb, 10)
				, length = parseInt(params.data.length, 10)
				, hangedTuto = parseInt(params.data.hangedTuto, 10);

			response.list = this._randWords(nb, length, hangedTuto);
			console.log('Word::generateRand result', response);

			break;


	}



	return response;


};
Word.post = function(){
	console.log('Word::post need to be implemented');
};
Word.delete = function(){
	console.log('Word::delete need to be implemented');
};


Word._hasJoker = function(s) {
	return (s.indexOf(Game.LetterFish.JOKER) != -1);
};

Word._applyJoker = function(s){
	var tab = s.split(Game.LetterFish.JOKER);

	if(tab.length == 1) return s;

	var result = this._checkABC(tab[0], tab, 0, s.length);
	return (result) ? result : false;
};



Word._checkABC = function(start, tab, i, sizeWord)
{
	if(i == tab.length - 1){
		return this._startBy(start, sizeWord);
	}

	var wordFound,
		c,
		res,
		abc = this._createAbc(true);
	for(var j=0; j<abc.length; j++)
	{
		c = String.fromCharCode(abc[j]);
		wordFound = this._startBy(start + c, sizeWord);
		if(wordFound){
			res = this._checkABC(start + c + tab[i + 1], tab, i + 1, sizeWord);
			if(res){
				return res;
			}
		}
	}

	return false;
};


Word._startBy = function(by, inLength)
{
	var elems = this._getArrayDictionary(inLength);
	if(!elems) return false;

	for(var i in elems)
	{
		var checkWord = elems[i];
		if(checkWord.indexOf(by) == 0) return checkWord;

	}

	return false;
};

Word._createAbc = function(doShuffle)
{
	var abc = []
		, codes = Game.Char.code;
	for(var code=codes.A; code<=codes.Z; code++) abc.push(code);

	if(doShuffle) abc = Util.Array.shuffle(abc);

	return abc;
};

Word._getLettersCount = function(sortedLetter) {
	var lettersCount = {}
		, l = sortedLetter.length
		, letter;


	for(var i=0; i<l; i++)
	{
		letter = sortedLetter[i];
		if(!lettersCount[letter]) lettersCount[letter] = 0;

		lettersCount[letter]++;
	}

	return lettersCount;

};

Word._getSortDictionary = function(i) {
	return ATW.dictioSort.map[i];
};

Word._getArrayDictionary = function(i) {
	return ATW.dictioArray.map[i]
};

Word._randWords = function(nb, length, hangedTuto) {
	var list = [],
		section = this._getArrayDictionary(length);

	if(!section) return list;

	var sectionCount = section.length
		, generated = {}
		, nbGenerated = 0
		, mysteryWord, isOk;
	for(var x=0; x<nb; x++)
	{
		do
		{
			mysteryWord = section[Util.Math2.randomInt(0, sectionCount)];
			isOk = true;

		} while ( !isOk || (generated[mysteryWord] && nbGenerated < sectionCount) )

		generated[mysteryWord] = true;
		list.push(mysteryWord);
		nbGenerated++;

		if(nbGenerated >= sectionCount) break;

		hangedTuto = false;
	}


	return list;

};

Word._findLarger = function(sortedLetter, minLength){
	if(!minLength) var minLength = 0;

	var l = sortedLetter.length;
	if(!l || l < minLength) return '';


	var inverse = true
		, lettersCount = this._getLettersCount(sortedLetter)
		, word = ''
		, startAt
		, currentSection;


	if(inverse) startAt = Math.min(l, 25);
	else startAt = 0;

	breakAll:
	for(var i = startAt; ((inverse && i>=minLength) || (!inverse && i<=25)) ; (inverse) ? i-- : i++)
	{
		currentSection = this._getSortDictionary(i);
		if(!currentSection) {
			continue;
		}

		// foreach($currentSection as $sortWord => $wordList)
		for(var sortWord in currentSection)
		{
			var wordList = currentSection[sortWord]
				, myLettersCount = {}
				, allow = false
				, sortedLength = sortWord.length;
			for(var j=0; j<sortedLength; j++)
			{
				var searchLetter = sortWord[j];
				allow = true;
				// Le mot ne peut etre formé a partir de notre letter count
				if(!lettersCount[searchLetter])
				{
					allow = false;
					break;
				}

				if(!myLettersCount[searchLetter]) myLettersCount[searchLetter] = 0;

				myLettersCount[searchLetter]++;

				if(myLettersCount[searchLetter] > lettersCount[searchLetter])
				{
					allow = false;
					break;
				}

			}

			if(allow)
			{
				word = wordList[Util.Math2.randomInt(0, wordList.length-1)];
				break breakAll;
			}

		}

	}

	return word;
};

exports.Word = Word;

})(window.Api = window.Api || {});

/**** api/graph/World.js ****/
'use strict';

(function(exports){

var World = {};


World.post = function(params){
	var data = params.data
		, worldId = data.id
		, cWorld = ATW.Datas.WORLDS[worldId];

	if(!cWorld) return {success: false};

	if(typeof data.enterOnce != "undefined") return this.handleUpdate(worldId, {enterOnce: true});
	if(typeof data.lastVisited != "undefined") return this.handleUpdate(worldId, {lastVisited: data.lastVisited});

	if(!data.b) return {success: false};

	return this.handleUpdate(worldId, {bought: true});

};

World.handleUpdate = function(worldId, bindData) {
	var list = this.getFormatList()
		, myWorld = list[worldId] || {};


	if(bindData.friend) {
		if(!myWorld.friends) myWorld.friends = [];
		myWorld.friends.push(bindData.friend);

		delete bindData.friend;
	}

	for(var key in bindData) {
		myWorld[key] = bindData[key];
	}

	list[worldId] = myWorld;
	Api.Storage.setItem('world', list);

	return {success: true};

};

World.getFormatList = function() {
	return Api.Storage.getItem('world') || {};
};


exports.World = World;

})(window.Api = window.Api || {});

/**** api/graph/User.js ****/
'use strict';

(function(exports){

var User = {};

User.get = function(params){

	var response = {};
	switch(params.on) {
		case 'me':
			var install = false;
			var player = Api.Storage.getItem('user');
            var update = {};

			if(!player) {
				player = {life:5};
                update.life = player.life;
				install = true;
			}


			player.worlds = Api.World.getFormatList();

			var scores = Api.Score.getFormatList();
			for(var worldId in scores) {
				var score = scores[worldId];
				for(var key in score) {
					if(!player.worlds[worldId]) player.worlds[worldId] = {};
					player.worlds[worldId][key] = scores[worldId][key];
				}

			}


			player.bonusMap = Api.Bonus.getFormatList();
			player.tutos = Api.Tuto.getFormatList();
			player.achievements = Api.Achievement.getFormatList();
			player.notifs = Api.Notif.getFormatList();


			var now = Date.now()
				, midnightTime = Util.Date.getMidnight()
				, lastDayConn  = (typeof player['lastDayConn'] != "undefined") ? parseInt(player['lastDayConn'], 10) : 0;;


			var msDay = 86400000;
			if((midnightTime - lastDayConn) >= msDay) {
				if(!install){
					update['waitingDailyGift'] = player['waitingDailyGift'] = true;
				}

				update['lastDayConn']  = 	 midnightTime;
				update['heartAccelerator'] = player['heartAccelerator'] = false;
				update['scoreAccelerator'] = player['scoreAccelerator'] = false;
				update['timeBooster']      = player['timeBooster'] = false;
			}

			player['timeAccelLeft'] = null;
			if(player['heartAccelerator']
				|| player['scoreAccelerator']
				|| player['timeBooster']
			) {
				player['timeAccelLeft'] = (midnightTime + msDay) - now;
			}

			// var regenLife = (int) Config::_get('configs', 'GEN_REGEN_LIFE_SEC');
			var regenLife = parseInt(ATW.Datas.CONFIGS.GEN_REGEN_LIFE_SEC, 10);
			var regenAt = parseInt(player['lifeRegenAt'], 10);

			var nbLifeWon = 0;
			if(player['waitingLife'])
			{
				nbLifeWon += player['waitingLife'];
				update['waitingLife'] = 0;
			}


			if(regenAt || nbLifeWon)
			{
				if(regenAt)
				{
					var diff = (Date.now()/1000) - regenAt;
					nbLifeWon = Math.min(Math.floor(diff/regenLife), 5);
				}

				if(nbLifeWon > 0)
				{
					console.log('nbLifeWon', nbLifeWon);
					// update = array_merge($update, User::addLife($nbLifeWon, $userData));
					var addLifeUpdate = User.addLife(nbLifeWon, player);
					for(var i in addLifeUpdate) update[i] = addLifeUpdate[i];
				}
			}


			User._handleUpdate(update);

			delete player['lastDayConn'];
			delete player['waitingLife'];

			this._regenIN(player);
			this._normalSessionIN(player);

			response.me = player;
			break;
		default:
			throw new Error('User::get ' + params.on + ' need to be implemented');

	}

	return response;

};


User.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

User.delete = function(){
	Api.Storage.setItem('user', {});
	Api.Score.delete();
};

User._handleUpdate = function(data, dontSave) {
	var save = (dontSave) ? false : true
		, player = ATW.App.getPlayer() || Api.Storage.getItem('user') || {}
		, response = {}
		, resUser = {}
		, configs = ATW.Datas.CONFIGS;

	if(data.bonusMap){
		Api.Bonus._handleUpdate(data);

		data.bonusMap = null;
		delete data.bonusMap;
	}

	if(typeof data.life != "undefined"){
		var newLife = parseInt(data['life'], 10)
			, maxLife = parseInt(configs.GEN_MAX_LIFE, 10);
		if(
			(!player['lifeRegenAt'] || data['lifeRegenAt'])
			&& newLife < maxLife
		) {
			var addSec = parseInt(configs.GEN_REGEN_LIFE_SEC, 10); // 2 minutes
			if(player['heartAccelerator']) addSec = Math.ceil(addSec/2);


			resUser['lifeRegenAt'] = data['lifeRegenAt'] = ~~(Date.now()/1000) + addSec;
			this._regenIN(resUser);
		}
		else if(newLife == maxLife)
		{
			resUser['lifeRegenAt'] = data['lifeRegenAt'] = 0;
			this._regenIN(resUser);
		}
		else
		{
			resUser['lifeRegenAt'] = player['lifeRegenAt'];
			this._regenIN(resUser);
		}

	}


	if(typeof data.immunity != "undefined")
	{

		var immunity = parseInt(data['immunity'], 10);
		delete data.immunity;

		if(immunity)
		{
			var addSec = parseInt(configs['GEN_GAME_INFINITE_SESSION_SEC'], 10);
			resUser['normalSessionAt'] = data['normalSessionAt'] = ~~(Date.now()/1000) + addSec;

			if(player['lifeRegenAt'])
			{
				var x = {
					lifeRegenAt: player['lifeRegenAt']
				};
				var remainingTime = this._regenIN(x);
				remainingTime = remainingTime['lifeRegenIn'];
				resUser['lifeRegenAt'] = data['lifeRegenAt'] = resUser['normalSessionAt'] + remainingTime;

				this._regenIN(resUser);
			}

		}
		else // Enleve l'immunite
		{
			if(player['lifeRegenAt'])
			{
				resUser['lifeRegenAt'] = player['lifeRegenAt'];
				this._regenIN(resUser);
			}

			resUser['normalSessionAt'] = data['normalSessionAt'] = 0;

		}

		this._normalSessionIN(resUser);

	}

	if(data['heartAccelerator']
		|| data['scoreAccelerator']
		|| data['timeBooster']
	) {
		var d = new Date();
		d.setHours(0,0,0,0);
		var midnightTime = d.getTime()/1000;

		resUser['timeAccelLeft'] = (midnightTime + 86400) - ~~(Date.now()/1000);
		resUser['timeAccelLeft'] *= 1000;

	}


	var storeData = Api.Storage.getItem('user') || {};
	for(var key in data) storeData[key] = player[key] = data[key];

	console.log('User::_handleUpdate save', storeData);

	if(save) Api.Storage.setItem('user', storeData);

	response.u = resUser;
	return response;

};

User._normalSessionIN = function(o) {
	var normalSessionAt = (o['normalSessionAt']) ? parseInt(o['normalSessionAt'], 10) : 0;

	if(normalSessionAt) o['normalSessionIn'] = normalSessionAt - ~~(Date.now()/1000);
	else o['normalSessionIn'] = 0;

};

User._regenIN = function(o) {
	if(!o['lifeRegenAt']) o['lifeRegenAt'] = 0;

	var regenAt = parseInt(o['lifeRegenAt'], 10);
	if(regenAt) o['lifeRegenIn'] = regenAt - ~~(Date.now()/1000);
	else o['lifeRegenIn'] = 0;

	return o;
};

User.addLife = function(nbLife, player){
	var update = {};
	// $maxLife = (int) Config::_get('configs', 'GEN_MAX_LIFE');
	var maxLife = ATW.Datas.CONFIGS.GEN_MAX_LIFE,
		myLife = player['life'] || 0
    	, newLife = Math.min(maxLife, player['life'] + nbLife);

    update['life'] = player['life'] = newLife;
    if(newLife == maxLife)
    {
        update['lifeRegenAt'] = player['lifeRegenAt'] = 0;
    }
    else
    {
        // $addSec = (int) Config::_get('configs', 'GEN_REGEN_LIFE_SEC');
        var addSec = ATW.Datas.CONFIGS.GEN_REGEN_LIFE_SEC;
        if(player['heartAccelerator'])
        {
            addSec = Math.ceil(addSec/2);
        }
        update['lifeRegenAt'] = player['lifeRegenAt'] = Date.now() + addSec;
    }

    return update;


};

exports.User = User;

})(window.Api = window.Api || {});



/**** api/graph/Score.js ****/
'use strict';

(function(exports){

var Score = {};

Score.get = function(params){

	var response = {};
	switch(params.on) {
		default:
			throw new Error('Score::get ' + params.on + ' need to be implemented');
	}

	return response;

};

Score.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

Score.delete = function(){
	Api.Storage.setItem('score', []);
};

Score._handleUpdate = function(data){
	var scoreList = Api.Storage.getItem('score') || []
		, worldId = data.world_id
		, levelId = data.level_id
		, scoreObject = this._getScoreObject(scoreList, worldId, levelId)
		, player = ATW.App.getPlayer()
		, update = {};

	if(typeof data['score'] != "undefined") update['score'] = parseInt(data['score'], 10);
	if(typeof data['star'] != "undefined") update['star'] = parseInt(data['star'], 10);
	if(typeof data['duration'] != "undefined") update['duration'] = parseInt(data['duration'], 10);
	if(typeof data['pearlsGrind'] != "undefined") update['pearlsGrind'] = parseInt(data['pearlsGrind'], 10);
	if(typeof data['bought'] != "undefined") update['bought'] = data['bought'];

	if(!scoreObject) {

		scoreObject = this._createOne();
		scoreObject['worldId']   = worldId;
		scoreObject['levelId']   = levelId;
		// scoreObject['uid']       = userId;
		// scoreObject['fbId']      = player.fbId;
		scoreObject['lang']      = player.lang;
		scoreObject['firstName'] = data['first_name'];

		scoreList.push(scoreObject);
	}

	for(var key in update) scoreObject[key] = update[key];

	Api.Storage.setItem('score', scoreList);

	return {};
};

Score._getScoreObject = function(list, worldId, levelId){
	var listLength = list.length;

	for(var i=0; i<listLength; i++){
		var o = list[i];
		if(o.worldId == worldId && o.levelId == levelId){
			return o;
		}
	}

	return null;
};


Score._createOne = function(){
	return {
		// fbId: '',
        levelId: null,
        worldId: null,
        bought: false,
        score: 0,
        star: 0,
        pearlsGrind: 0,
        lang: 'fr',
        duration: 0,
        firstName: 'Default'
    }

};

Score.getFormatList = function(){
	var list = Api.Storage.getItem('score') || []
		, listLength = list.length
		, fm = {};
	for(var i=0; i<listLength; i++) {
		var doc = list[i]
			, worldId = doc.worldId
			, levelId = doc.levelId
			, o = {};

		o = {
			id: levelId,
            score: parseInt(doc['score'], 10),
            star: parseInt(doc['star'], 10),
            bought: (doc['bought'] == 1),
            duration: parseInt(doc['duration'], 10),
            pearlsGrind: (doc['pearlsGrind']) ? parseInt(doc['pearlsGrind'], 10) : 0
        };

		if(!fm[worldId]) fm[worldId] = {};
		if(!fm[worldId].levels) fm[worldId].levels = {};

		fm[worldId].levels[levelId] = o;

	}

	return fm;
};


exports.Score = Score;

})(window.Api = window.Api || {});



/**** api/graph/Shop.js ****/
'use strict';

(function(exports){

var Shop = {};

Shop.get = function() {
	var response = {};


	return response;
};

Shop.post = function(params) {
	var data = params.data;

	var userDataRq = data['u'];

	var res = Api.User._handleUpdate(userDataRq);

	if(data.b) {
		Api.Bonus._handleUpdate(data.b);
	}

	if(data.friend) {
		throw new Error('Api::Shop friend need to be implemented')
	}

	if(data.level){
		data.level.bought = true;
		Api.Score._handleUpdate(data.level);
	}

	return res;
};

Shop.delete = function(){};

exports.Shop = Shop;

})(window.Api = window.Api || {});



/**** api/graph/Bonus.js ****/
'use strict';

(function(exports){

var Bonus = {};

Bonus.get = function() {
	var response = {};
	return response;
};

Bonus.post = function(params) {
	var data = params.data;

	this._handleUpdate(data);

	return {success: true};
};

Bonus.delete = function(){};

Bonus._handleUpdate = function(data){
	if(!data.bonusMap) {
		this._handleSingleUpdate(data);
	} else {
		this._handleMultipleUpdate(data.bonusMap);
	}

	return {success: true};
};

Bonus._handleSingleUpdate = function(data) {
	var list = Api.Storage.getItem('bonus') || {};
	this._setList(list, data);
	this._save(list);
};

Bonus._handleMultipleUpdate = function(bonusMap) {
	var list = Api.Storage.getItem('bonus') || {};
	for(var bid in bonusMap) {
		this._setList(list, bonusMap[bid]);
	}

	this._save(list);
};

Bonus._setList = function(list, data, dontSave){
	var x = {
		id: data.id,
		quantity: data.quantity
	};

	list[x.id] = x;

};

Bonus.getFormatList = function(){
	return Api.Storage.getItem('bonus') || {};
};


Bonus._save = function(list){
	Api.Storage.setItem('bonus', list)
};

exports.Bonus = Bonus;

})(window.Api = window.Api || {});



/**** api/graph/Tuto.js ****/
'use strict';

(function(exports){

var Tuto = {};

Tuto.get = function(params){};
Tuto.post = function(params){
	var data = params.data
		, tutoKey = data.key
		, cTutos = ATW.Datas.TUTOS
		, tuto = cTutos[tutoKey];


	if(!tuto
		&& tutoKey != 'level1'
		&& tutoKey != 'level2'
		&& tutoKey != 'level3'
		&& tutoKey != 'level4'
		&& tutoKey != 'first_defeat'
		&& tutoKey != 'board_no_possibility'
		&& tutoKey != 'board_pearl'
		&& tutoKey != 'board_spawn_locked'
	) {
		return {success: false};
	}


	var myTutos = this.getFormatList();
	if(myTutos[tutoKey]) return {success: false};

	myTutos[tutoKey] = {done: 1};
	Api.Storage.setItem('tuto', myTutos);

	return {success: true};

}
Tuto.delete = function(){};
Tuto.getFormatList = function(){ return Api.Storage.getItem('tuto') || {}; };

exports.Tuto = Tuto;

})(window.Api = window.Api || {});



/**** api/graph/Achievement.js ****/
'use strict';

(function(exports){

var Achievement = {};

Achievement.get = function(params){

	var response = {};
	return response;

};

Achievement.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};


Achievement._handleUpdate = function(data) {

	var achievementsCf = ATW.Datas.ACHIEVEMENTS;
	var myachievements = this.getFormatList();

	for(var keyType in data) {
		var achievements = data[keyType];

		for(var achId in achievements) {
			var achievement = achievements[achId];

			if(!achievementsCf[achId]) continue;


			if(!myachievements[keyType]) myachievements[keyType] = {};

			myachievements[keyType][achId] = {
				id: achId,
				progress: Util.Math2.castInt(achievement.progress),
				reward: achievement.reward
			}

		}


	}

	Api.Storage.setItem('achievement', myachievements);


	return {success: true};


};

Achievement.getFormatList = function(){
   // var achievementsCf = ATW.Datas.ACHIEVEMENTS;
   // var achievementsTypeCf = ATW.Datas.ACHIEVEMENTTYPES;

	var list = Api.Storage.getItem('achievement') || {};


	return list;
};


exports.Achievement = Achievement;

})(window.Api = window.Api || {});



/**** api/graph/Notif.js ****/
'use strict';

(function(exports){

var Notif = {};

Notif.nbUpdate = 0;
Notif.get = function(params){

	var response = {};
	return response;

};

Notif.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

Notif.delete = function(params){
	if(typeof params.on == "undefined") Api.Storage.setItem('notif', []);
	else {
		var list = this.getFormatList();
		delete list[params.on];
		// list.splice(Util.Math2.castInt(params.on), 1);

		Api.Storage.setItem('notif', list);
	}
};

Notif._handleUpdate = function(data) {
	var o = {
		type: data.type,
		message: data.message,
		// id: data.id
		id: Date.now() + Notif.nbUpdate
	}

	Notif.nbUpdate++;

	var notifs = this.getFormatList();
	notifs[o.id] = o;
	// notifs.push(o);


	Api.Storage.setItem('notif', notifs)

	return {
		request: o,
		success: true
	};
};

Notif.getFormatList = function(){

	return Api.Storage.getItem('notif') || {};

};
exports.Notif = Notif;

})(window.Api = window.Api || {});



/**** scenes/BaseScene.js ****/
'use strict';
(function(namespace){

function BaseScene(className, viewName)
{
	PIXI.DisplayObjectContainer.call(this);

	this.className = className;
	this.viewName = viewName;
	this.open = false;
	this.position.x = 0;
    this.position.y = 0;
    this.visible = false;
    // this.alpha = 1;
    this.fadeIn = true;
	this.anims = {};
};

BaseScene.constructor = BaseScene;
BaseScene.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

BaseScene.current = null;


BaseScene.prototype.start = function()
{

	console.log('Start ' + this.className);
	if(this.open) return;

	// var hasTransition = false;
	if(BaseScene.current) {
		BaseScene.current.close();
		// hasTransition = true;
	}

	BaseScene.current = this;

	this.open = true;

	this.create();

	ATW.stage.addChild(this);

	this.visible = true;
	this.blackScreen = new PIXI.Graphics();
	this.blackScreen.beginFill(0x000000)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.addChild(this.blackScreen);

	this.blackScreen.alpha = 1;

	if(this.fadeIn) {
		var tl = new TimelineMax();

		// if(hasTransition) {
		// 	this.blackScreen.alpha = 0;
		// 	tl.to(this.blackScreen, ATW.config.scene.fadeOut, {alpha:1});
		// }
		tl.to(this.blackScreen, ATW.config.scene.fadeIn, {alpha:0, onComplete: this.onReady});
		// TweenLite.to(this, ATW.config.scene.fadeIn, {alpha:1, onComplete: this.onReady});
		// this.alpha = 1;
		// this.position.x = 400;
		// TweenLite.to(this.position, ATW.config.scene.fadeIn, {x:0, onComplete: this.onReady, ease: Power3.easeOut});
	} else  {
		this.blackScreen.alpha = 0;
		if(this.onReady) this.onReady();
	}

	this.bindBasicButtons();

	this.logic();
};

BaseScene.prototype.bindBasicButtons = function()
{
	if(!this.view) return;

	var self = this
		, previousBtn = this.view.getElementById('button_previous')
		, dailyRewardBtn = this.view.getElementById('button_daily_reward')
		, moreHeart = this.view.getElementById('moreHeart')
		, morePearl = this.view.getElementById('morePearl')
		, trophy = this.view.getElementById('trophy')
		, btnNotif = this.view.getElementById('btnNotif')
		, cart = this.view.getElementById('cart');

	if(previousBtn) previousBtn.onHit = this.previousAction.bind(this);
	if(moreHeart) moreHeart.onHit = this.firePopupLife.bind(this);
	if(trophy) {
		trophy.onHit = function(){
			var popupAchievement = new UI.PopupAchievement();
			popupAchievement.open();
		}
	}

	if(btnNotif) {
		btnNotif.onHit = function(){
			var popupNotif = new UI.PopupNotif();
			popupNotif.open();
		}

	}

	if(cart) {
		cart.onHit = function(){
			var pop = new UI.PopupShop();
			pop.open();
		}
	}

	if(morePearl) {
		morePearl.onHit = function(){
			// alert('toto');
			var pop = new UI.PopupShop(Util.ShopCat.findByKey('PEARL'));
			pop.open();
		}
	}

	if(dailyRewardBtn) {
		dailyRewardBtn.onHit = function(){
			var pop = new UI.PopupDailyReward(self);
			pop.open();
		}
	}



};


BaseScene.prototype.firePopupLife = function()
{
	// alert('okok');
	var t = new UI.PopupHeart();
	t.open();
};

BaseScene.prototype.create = function()
{
	if(!this.viewName) return;

	this.view = new UI.ViewBuilder(this.viewName, this);
	this.view.build();

};

BaseScene.prototype.updatePearlText = function(){
	var nbPearlText = this.view.getElementById('nbPearlText');
	if(!nbPearlText) return;

	nbPearlText.setText(ATW.App.getPlayer().getPearls().toString());
	nbPearlText.updateText();
	nbPearlText.position.x = nbPearlText.rightOri - nbPearlText.width;
};


BaseScene.prototype.close = function()
{
	if(!this.open) return;


	BaseScene.current = null;
	this.open = false;
	this._clean();

	if(this.onClose) this.onClose();

	// TweenMax.to(this, ATW.config.scene.fadeOut, {alpha:0, onComplete: this._clean.bind(this)});
	// TweenMax.to(this.blackScreen, ATW.config.scene.fadeOut, {alpha:1, onComplete: this._clean.bind(this)});
	// TweenMax.to(this.position, 1.2, {x:ATW.gameWidth(), onComplete: this._clean.bind(this), ease: Power3.easeOut});

};

BaseScene.prototype.restart = function()
{
	this.reset = true;
	this.restartLogic();
	this.close();
};

BaseScene.prototype._clean = function()
{

	ATW.stage.removeChild(this);

	this.onClearHandler();
	this._stopAnims();
};

BaseScene.prototype.restartLogic = function()
{
	var restartScene = new window[this.className]();
	restartScene.start();
};

BaseScene.prototype.onClearHandler = function()
{

};

BaseScene.prototype.logic = function()
{

};

BaseScene.prototype.previousAction = function()
{

};


BaseScene.prototype._stopAnims = function(namespace, reset)
{
	if(namespace)
	{
		this._stopAnimsHandler(namespace, reset);
	}
	else
	{
		for(var namespace in this.anims)
		{
			this._stopAnimsHandler(namespace, reset);
		}
	}

};

BaseScene.prototype._stopAnimsHandler = function(namespace, reset)
{
	if(!this.anims[namespace])
	{
		return;
	}

	for(var i in this.anims[namespace])
	{
		if(reset)
		{
			this.anims[namespace][i].pause(0);
		}
		this.anims[namespace][i].kill();
	}
	delete this.anims[namespace];
};

BaseScene.prototype.hasAnim = function(namespace)
{
	return this.anims[namespace];
};

BaseScene.prototype._addAnim = function(tl, namespace)
{
	if(!namespace)
	{
		var namespace = 'default';
	}
	if(!this.anims[namespace])
	{
		this.anims[namespace] = [];
	}
	this.anims[namespace].push(tl);
};

namespace.BaseScene = BaseScene;

})(window.Scene = window.Scene || {});


/**** scenes/LoadingScene.js ****/
'use strict';

(function(namespace) {

function LoadingScene()
{
	namespace.BaseScene.call(this, 'LoadingScene', 'loading_scene');

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

		var jsonloader = new PIXI.JsonLoader(platformCDN.baseUri + url, 'crossOrigin');
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




/**** scenes/SplashScene.js ****/
'use strict';
(function(namespace){


function SplashScene()
{
    namespace.BaseScene.call(this, 'SplashScene');

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

/**** scenes/HomeScene.js ****/
'use strict';

(function(namespace) {

function HomeScene() {
	namespace.BaseScene.call(this, 'HomeScene', 'home_scene');
};

HomeScene.prototype.constructor = HomeScene;
HomeScene.prototype = Object.create(namespace.BaseScene.prototype);

HomeScene.prototype.logic = function() {
	if(ATW.config.test.desactiveHome) {
		this.onPlayHandler();
		return;
	}

	this.view.getElementById('play').onHit = this.onPlayHandler.bind(this);

};

HomeScene.prototype.onPlayHandler = function(){
	var worldScene = new Scene.WorldScene();
	worldScene.start();
};

namespace.HomeScene = HomeScene;

})(window.Scene = window.Scene || {});

/**** scenes/WorldScene.js ****/
'use strict';
(function(exports){

function WorldScene() {
	this.scaleHighlight = 1.1;
	this.scaleSecondary = 0.8;
	this.leaders = {};
	exports.BaseScene.call(this, 'WorldScene', 'world_scene');

};

WorldScene.prototype.constructor = WorldScene;
WorldScene.prototype = Object.create(exports.BaseScene.prototype);

WorldScene.prototype.logic = function() {
	var self = this
		, nbWorld = 0
		, worldDatas = ATW.Datas.WORLDS;

	this.currentWorld = 0;

	// Ajoute les evenements sur le monde
	for(var worldId in worldDatas) {
		var world = this.view.getElementById('world_'+nbWorld);
		if(world) this.attachWorldEvent(world);
		nbWorld++;
	}

	if(ATW.isMobile()) this.mobileBehavior(nbWorld);
	else this.defaultBehavior(nbWorld);

	var p = new UI.PopupTuto('welcome');
	p.open();

	var player = ATW.App.getPlayer();
	ATW.App.getDataManager().getOnlineApi().call('Score', 'GET', {
		on: 'world_leaders',
			data: {}
		}, function(response){
			console.log('WorldScene::response.leaders', response.leaders);

			if(!response.leaders) return;

			self.leaders = response.leaders;
			var cWorlds = ATW.Datas.WORLDS;
			for(var worldId in self.leaders) {
				var leader = self.leaders[worldId];
				if(leader.fbId != player.fbId)
				{
					player.getWorld(cWorlds[worldId])
						.setOpponent(leader);

				}

				if(self.currentWorldPrefab && self.currentWorldPrefab.worldId == worldId) {
					self.attachLeader(self.currentWorldPrefab);
				}


			}


		}
	);




};

WorldScene.prototype.attachWorldEvent = function(worldPrefab)
{
	var self = this;
	this.attachLeader(worldPrefab);

	worldPrefab.interactive = true;
	worldPrefab.hitArea = new PIXI.Rectangle(-150, -150, 300, 300);
	worldPrefab.mousedown = worldPrefab.touchstart = function(){
		if(worldPrefab.highlight || ATW.isMobile()) {
			var cWorld = ATW.Datas.WORLDS[worldPrefab.worldId];
			var uWorld = ATW.App.getPlayer().getWorld(cWorld)

			if(uWorld.isOpen()) self.goToWorld(worldPrefab.worldId);

		}
	}



};

WorldScene.prototype.attachLeader = function(worldPrefab)
{
	var worldId = worldPrefab.worldId;
	var cWorld = ATW.Datas.WORLDS[worldId]
	var world = ATW.App.getPlayer().getWorld(cWorld);

	if(!this.leaders[worldId] || !world.isOpen()) return;

	var socLeader = Prefab.world_leader_prefab(this.view, this.leaders[worldId]);
	socLeader.position.x = 62;
	socLeader.position.y = 20;
	socLeader.interactive = true;
	socLeader.mousedown = socLeader.touchstart = function(){
		var ori = {x: socLeader.position.x, y:socLeader.position.y};
		socLeader.showInfo(ori);
	};

	worldPrefab.addChild(socLeader);
};




WorldScene.prototype.mobileBehavior = function(nbWorld) {

	var leftArrow = this.view.getElementById('leftArrow')
		, rightArrow = this.view.getElementById('rightArrow')
		, firstWorld = this.view.getElementById('world_0')
		, self = this;

	this.currentWorldPrefab = firstWorld;


	this.addStandingAvatar(firstWorld);

	var displayWorld = function(i) {
		var w = self.view.getElementById('world_' + self.currentWorld);

		var dest = (i > self.currentWorld) ? -600 : 600;

		TweenLite.to(w.position, 0.2, {x: w.position.x +dest, onComplete: function(){
			self.view.container.removeChild(w);
		}});



		self.currentWorld = i;
		var freshWorld = self.view.createWorld(self.currentWorld);
		freshWorld.scale.x = freshWorld.scale.y = 0.5;
		self.currentWorldPrefab = freshWorld;

		self.attachWorldEvent(freshWorld);

		TweenLite.to(freshWorld.scale, 0.6, {x: 1, y:1, ease: Back.easeOut});
		self.addStandingAvatar(freshWorld);

		if(self.currentWorld > 0) {
			leftArrow.alpha = 1;
			leftArrow.visible = true;
		} else {
			leftArrow.alpha = 0;
			leftArrow.visible = false;
		}

		if(self.currentWorld <nbWorld -1) {
			rightArrow.alpha = 1;
			rightArrow.visible = true;
		} else {
			rightArrow.alpha = 0;
			rightArrow.visible = false;
		}
	}


	leftArrow.onHit = function(){
		if(self.currentWorld <= 0) return;
		displayWorld(self.currentWorld-1);

	}

	rightArrow.onHit = function(){
		if(self.currentWorld >= nbWorld-1) return;
		displayWorld(self.currentWorld+1);
	}





};

WorldScene.prototype.defaultBehavior = function(nbWorld){
	var worldContainer = this.view.getElementById('worldContainer')
		, firstWorld = this.view.getElementById('world_0')
		, section = (worldContainer.width - ATW.gameMidWidth())/nbWorld
		, targetedWorld
		, worldPrefab
		, midWorld = firstWorld.width/2
		self = this;



	var scroller = new PIXIScroller.Scroll(worldContainer, {
		width: ATW.gameMidWidth()
	}, nbWorld);

	this.target(this.currentWorld);


	scroller.onUpdate = function(traveling){
		targetedWorld = Math.round(traveling/section);
		if(targetedWorld >= nbWorld || targetedWorld<0) return;

		if(targetedWorld != self.currentWorld) {
			worldPrefab = self.view.getElementById('world_' + self.currentWorld);
			worldPrefab.highlight = false;
			TweenLite.to(worldPrefab.scale, 0.4, {x: self.scaleSecondary, y: self.scaleSecondary });

			self.target(targetedWorld);
		}

	}
};

WorldScene.prototype.addStandingAvatar = function(world) {
	this.cleanStanding();

	var avatar = world.storage.avatar;
	if(!avatar) return;

	this.standingTl = new TimelineMax({repeat: -1, repeatDelay: 0});
	this.standingTl.to(avatar.scale, 1.2, {y:0.9});
	this.standingTl.to(avatar.scale, 1.3, {x:1, y:1});
};

WorldScene.prototype.close = function()
{
	this.cleanStanding();
	Scene.BaseScene.prototype.close.call(this);

};


WorldScene.prototype.cleanStanding = function(){
	if(!this.standingTl)  return;

	this.standingTl.clear();
	this.standingTl = null;
};


WorldScene.prototype.target = function(i) {
	this.currentWorld = i;
	var worldPrefab = this.view.getElementById('world_' + this.currentWorld);
	worldPrefab.highlight = true;
	TweenLite.to(worldPrefab.scale, 1.2, {x: this.scaleHighlight, y:this.scaleHighlight, ease: Elastic.easeOut});
};

WorldScene.prototype.goToWorld = function(worldId) {
	var cWorld = ATW.Datas.WORLDS[worldId];
	var world = ATW.App.getPlayer().getWorld(cWorld)
	var levelScene = new Scene.LevelScene(world);
	levelScene.start();
};

WorldScene.prototype.previousAction = function() {
	var homeScene = new Scene.HomeScene();
	homeScene.start();
};

exports.WorldScene = WorldScene;

})(window.Scene = window.Scene || {});

/**** scenes/LevelScene.js ****/
'use strict';
(function(exports){

function LevelScene(world) {
	exports.BaseScene.call(this, 'LevelScene', 'level_scene');
	this.world = world;

	this.hasPopupOpen = false;
};

LevelScene.prototype.constructor = LevelScene;
LevelScene.prototype = Object.create(exports.BaseScene.prototype);

LevelScene.prototype.logic = function() {

	var roadContainer = this.view.getElementById('roadContainer')
		, tilingBg = this.view.getElementById('tilingBg')
		, scroller = new PIXIScroller.Scroll(roadContainer, {
			width: ATW.gameMidWidth()
		});

	var lastVisited = this.world.getLastVisited();
	this.cameraTo(lastVisited);

	App.getDataManager().getOnlineApi().call('Score', 'GET', {
			on: 'repartition',
			data: {
				worldId: this.world.getId()
			}
		}, function(response){
			console.log('response', response);

			/*
			if(!response.repartition || !self.open) return;

			var repartition = response.repartition;

			for(var worldLevelId in repartition)
			{
				var levelRepartition = repartition[worldLevelId];
				var levelId = worldLevelId.split('-')[1];
				var friend = levelRepartition[rand(0, levelRepartition.length-1)];
				var $level = self.$node.find('#level-' + levelId);
				var $friend = $level.find('.friend');

				if(friend.fbId == 1) friend.fbId = 5;

				 $friend.find('.pic')
					.css('backgroundImage', "url('https://graph.facebook.com/"+friend.fbId+"/picture?width=50&height=50')");

				TweenLite.to($friend, {autoAlpha:0});
				$friend.show();
				TweenMax.to($friend, 0.5, {autoAlpha:1});

				if(levelRepartition.length)
				{
					var $friendList = $('<div class="friendList"></div>');
					// $level.append($friendList);
					$friend.append($friendList);
					for(var i=0; i<levelRepartition.length; i++)
					{
						$friendList.append('<div>'+levelRepartition[i].firstName+'</div>');
					}
				}



			}*/
		}
	);



};

LevelScene.prototype.cameraTo = function(levelId) {
	if(!levelId) return;

	var roadContainer = this.view.getElementById('roadContainer')
		, point = this.view.getElementById('point-' + levelId);

	var toX = -point.position.x + ATW.gameMidWidth();
	TweenLite.to(roadContainer.position, 0.6, {x: toX, ease: Power3.easeIntOut});

	var avatarTo = {
		x: point.position.x + 2,
		y: point.position.y - 60
	};

	if(!this.avatar) {
		this.avatar = Prefab.avatar_prefab(this.world.getKey());
		this.avatar.scale.x = this.avatar.scale.y = 0.6;
		this.avatar.position.x = avatarTo.x;
		this.avatar.position.y = avatarTo.y;
		roadContainer.addChild(this.avatar);
	} else {
		TweenLite.to(this.avatar.position, 0.6, {x: avatarTo.x, y: avatarTo.y});
	}

};



LevelScene.prototype.onEnterPoint = function(level){
	if(this.hasPopupOpen) return;

	this.cameraTo(level.getId());

	var self = this
	, popupLevel = new UI.PopupLevel(level);

	popupLevel.onClose = function(){
		self.hasPopupOpen = false;
	};
	popupLevel.onSlide = function(level){
		self.cameraTo(level.getId());
	};
	popupLevel.open();

	this.hasPopupOpen = true;
};


LevelScene.prototype.previousAction = function() {
	var worldScene = new Scene.WorldScene();
	worldScene.start();
};


exports.LevelScene = LevelScene;

})(window.Scene = window.Scene || {});

/**** scenes/GameScene.js ****/
'use strict';
(function(exports){

function GameScene(level, retry)
{
	exports.BaseScene.call(this, 'GameScene', 'game_scene');
	this.level = level;
	this.retry = retry;
	this.isGameScene = true;

	this.game = new Game.MYGame({
		level: this.level,
		scene: this
	});

	this.timersAnim        = {};
	this.hangedLetterTest  = {};
	this.pearlsRequest     = [];
	this.progressAnimQueue = [];
	this.goalAnims         = [];

	this.lastHangedWord = null;
	this.nbPearl = 0;

	this.viewState = GameScene.GAME_VIEW;


};

GameScene.constructor = GameScene;
GameScene.prototype = Object.create(exports.BaseScene.prototype);

GameScene.prototype.logic = function() {
	var self = this,
		player = ATW.App.getPlayer(),
		btnMenu = this.view.getElementById('btnMenu'),
		btnRestart = this.view.getElementById('btnRestart'),
		fireWave = this.view.getElementById('fireWave'),
		btnCancel = this.view.getElementById('btnCancel'),
		btnSubmit = this.view.getElementById('btnSubmit'),
		btnPause = this.view.getElementById('btnPause'),
		btnResume = this.view.getElementById('btnResume'),
		bonusMap = this.view.getElementById('bonusMap');

	this.fields = this.view.getElementById('fields');
	this.timerBmp = this.view.getElementById('timerBmp');
	this.lastHangedWord = null;

	this.game.prepare();


	// --------------------------------------------------------------
	// Bonus handler
	// --------------------------------------------------------------
	bonusMap.map.forEach(function(btn){

		btn.onHit = function bonusOnHit(){
			var cBonus = ATW.Datas.BONUS[btn.bid]
				, player = ATW.App.getPlayer()
				, bonus = player.getBonus(cBonus.id)
				, isUnlock = (cBonus.tuto_key && !player.isTutoFisnish(cBonus.tuto_key)) ? false : true;

			if(!isUnlock) {
				self.resumeHandler();
				return;
			}

			var _activeBonus = function() {
				self.resumeHandler();
				self.game.useBonus(cBonus, false, function(hasBeenConsumed){

					if(hasBeenConsumed)
					{
						ATW.App.getPlayer().getAchievementManager().dispatch('USE_MANUAL_BONUS', {ref: cBonus.key});
						self.consumeBonusHandler(cBonus);
					}

				});

			}


			if(bonus && bonus.getQuantity()) {
				_activeBonus();
			} else {
				var product = Util.Shop.findProductByKey(cBonus.key);
				Util.Shop.instaShop(product, function(){
					player.incrBonus(cBonus.id);
					self.updateBonus(cBonus.id);
					_activeBonus();
				}, function(res){}, function(){
					// $parent.removeClass('loading');
				});

			}

		}

	});


	// --------------------------------------------------------------
	// Buttons
	// --------------------------------------------------------------
	if(btnMenu) {
		btnMenu.onHit = function(){
			var levelScene = new Scene.LevelScene(self.level.getWorld());
			levelScene.start();
		}
	}

	if(btnRestart) btnRestart.onHit = this.restart.bind(this);
	if(btnPause) btnPause.onHit = this.pauseHandler.bind(this);
	if(btnResume) btnResume.onHit = this.resumeHandler.bind(this);


	if(fireWave) {
		fireWave.onHit = function(){
			if(self.game.isFreeze) self.game.resume(false, true);
			self.game.wave(true);
		}
	}

	btnCancel.onHit = function(){
		self.game.resetWord(true);
	}

	btnSubmit.onHit = function(){
		self.game.submitWord();
	}


	// --------------------------------------------------------------
	// Game Handler
	// --------------------------------------------------------------
	this.game.onStartTimer        = this.startTimerHandler.bind(this);
	this.game.onLifeChange        = this.changeLifeHandler.bind(this);
	this.game.onWave              = this.waveHandler.bind(this);
	this.game.onScore             = this.scoreHandler.bind(this);
	this.game.onWaveCut           = this.waveCutHandler.bind(this);
	this.game.onEmptyAlert        = this.emptyAlertHandler.bind(this);
	this.game.onEnd               = this.endHandler.bind(this);
	this.game.onHangingProgress   = this.refreshHangedWord.bind(this);
	this.game.onHourglassTimer    = this.hourglassTimerHandler.bind(this);
	this.game.onEatPearls         = this.eatPearlsHandler.bind(this);
	this.game.onFishMouseDown     = this.onFishMouseDownHandler.bind(this);
	this.game.onProgressObjective = this.onProgressObjectiveHandler.bind(this);
	this.game.onFreeze            = this.freezeHandler.bind(this);
	this.game.onConsumeBonus      = this.consumeBonusHandler.bind(this);
	this.game.onTuto              = this.onTutoGameHandler.bind(this);

	this.game.onHangedLetterError = function(letter) { self.highlightHangedLetter(letter, true); };


	var levelId = this.level.getId()
		, world = this.level.getWorld();

	console.log('----> levelId', levelId);
	world.setLastVisited(levelId);
	ATW.App.getDataManager().getApi().call('World', 'POST', {
		on: 'me',
		data: {
			id: world.getId(),
			lastVisited: levelId
		}
	}, function(response){});

	if(!this.retry) {
		this.prepareGame();
	} else {
		var popupLevel = new UI.PopupLevel(this.level, true);
		popupLevel.onClose = function(){
			self.prepareGame();
		}
		popupLevel.open();
	}

};

GameScene.prototype.prepareGame = function(){
	var self = this;
	var player = ATW.App.getPlayer();
	if(!player.isOnSession())
	{
		var cLife = player.life;
		player.life  = Math.max(0, cLife-1);
		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				life: player.life
			}
		}, function(res){
			self.handleStartLife = function() {
				player.myUpdate(res);
			}
		});
	}


	if(this.game.isReady) this.readyGoHandler();
	else this.game.onReady = this.readyGoHandler.bind(this);
};

GameScene.prototype.readyGoHandler = function() {
	var self = this
		, mode = this.level.getMode()
		, tutos = this.getPrimaryTutoList()
		, player = ATW.App.getPlayer();



	var popRef = null;
	for(var key in tutos)
	{
		if(!tutos[key]()){ continue; }

		if(key == 'pearl')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var ground = this.game.grid.hasPearl
				, parent = this.fields;
				var boundingGround = {
					x: ground.getLeft() + parent.position.x + 12,
					y: ground.getTop() + parent.position.y,
					width: 50,
					height: 70
				};

				var pearlBoardTuto = new UI.PopupTutoBoard([
					{
						hit: boundingGround,
						txt: _ts('nouvelle_perle'),
						arrowDir: 'toBottom',
						transparentBorder: true
					}
				]);

				pearlBoardTuto.onComplete = function(){ p.open(); }
				pearlBoardTuto.open();
			}

		}
		else if(key == 'board_spawn_locked')
		{
			var tutoActive = !player.isTutoFisnish(key);
			if(tutoActive)
			{
				var p = new UI.PopupTutoBoard([
					{ txt: _ts('nouvelle_meduse_bloque') }
				]);
				p.open();

				player.finishTuto(key);
				ATW.App.getDataManager().getApi().call('Tuto', 'POST', {
					on: 'me',
					data: {
						key: key
					}
				});
			}
		}
		else if(key == 'first_bomb')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstBombTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouvelle_bombe') }
				]);

				firstBombTuto.onComplete = function(){ p.open(); }
				firstBombTuto.open();
			}
		}
		else if(key == 'wall')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstWallTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_mur')
					}
				]);

				firstWallTuto.onComplete = function(){
					p.open();
				};

				firstWallTuto.open();
			}
		}
		else if(key == 'hole')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var firstHoleTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_trou')
					}
				]);

				firstHoleTuto.onComplete = function(){
					p.open();
				}

				firstHoleTuto.open();
			}
		}
		else if(key == 'survival_mode')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var survivalModeTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouveau_mode_survie') }
				]);

				survivalModeTuto.onComplete = function(){ p.open();	}
				survivalModeTuto.open();
			}
		}
		else if (key == 'miley_cyrus')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				var fireWave = self.view.getElementById('fireWave')
				, waveContainer = self.view.getElementById('waveContainer');

				var boundingFire = {
					x: fireWave.position.x + waveContainer.position.x - fireWave.width/2-3,
					y: fireWave.position.y - 5,
					width: fireWave.width,
					height: fireWave.height
				}

				var wbModeTuto = new UI.PopupTutoBoard([
					{ txt: _ts('nouveau_mode_sauvetage') },
					{
						hit: boundingFire,
						txt: _ts('mode_sauvetage_explication', {
							':wave': ' ' + this.level.getNbWave(),
							':endpoint': ' '+this.level.getMode().getEndPoint()
						})
					}
				]);

				popRef = new UI.PopupTutoBoard([
					{
						hit: boundingFire,
						noCheck: false,
						txt: _ts('sauvetage_vague')
					}
				]);
				wbModeTuto.onComplete = function(){
					p.open();
					p.onClose2 = function()	{ popRef.open(); }
				}

				wbModeTuto.open();
			}
		}
		else if(key == 'hanged')
		{
			var p = new UI.PopupTuto(key)
				, tutoActive = !player.isTutoFisnish(key);

			if(tutoActive)
			{
				// var forceWord = this.game.mysteryWord;
				var forceWord = _ts('tuto_pendu_a_tester');
				this.game.hangedTuto = true;
				var hangedModeTuto = new UI.PopupTutoBoard([
					{
						txt: _ts('nouveau_mode_pendu', {
							':prompt': ' '+forceWord
						})
					}
				]);

				hangedModeTuto.onComplete = function(){ p.open(); }
				hangedModeTuto.open();
			}
		}
		else if(key == 'simple')
		{

			var tutoActive = !player.isTutoFisnish('level1');
			if(tutoActive)
			{
				// var $descri = self.$node.find('#descritionMd');
				// var boundingObj = DOMHelper.getNoScaleBoundingClient($descri[0], TutoBoardPopup.border);
				// boundingObj[0] += 50;
				// boundingObj[1] += 5;
				// boundingObj[2] -= 100;

				var descri = self.view.getElementById('groupTitle')
				, boundingObj = {
					x: descri.position.x,
					y: descri.position.y,
					width: descri.width,
					height: descri.height
				};

				var p = new UI.PopupTutoBoard([
					{
						// hit: DOMHelper.boundingSubstract([612, 560, 57, 55], TutoBoardPopup.border),
						// transparentBorder: true,
						txt: _ts('voici_classique'),
						// arrowDir: 'toLeft'
					},
					{
						hit: boundingObj,
						txt: _ts('objectifs_classique_explication', {
							':x': ' '+ mode.getEndPoint()
						}),
						noArrow: true
					}
				]);
				p.open();
			}
		}
		else
		{
			var p = new UI.PopupTuto(key);
			p.open();

			var tutoActive = p.active;
		}

		if(tutoActive) break;
	}


	if(!tutoActive)
	{
		var key = null;
		if(this.level.hasTuto() === 1) key = 'goals';
		else if (this.level.hasTuto() === 3) key = 'word_length';

		this.secondaryTutoPres(key, self.launch123Go.bind(self));
	}
	else
	{
		var u = (!popRef) ? p : popRef;
		u.onComplete = u.onClose = function(){
			setTimeout(function(){
				self.secondaryTutoPres(key, self.launch123Go.bind(self));
			}, 300);
		}
	}
};

GameScene.prototype.getPrimaryTutoList = function() {
	var self = this
		, mode = this.level.getMode();
	return {
		goals: function(){ return (self.level.hasTuto() === 1);	},	// ok
		pearl: function(){ return self.game.grid.hasPearl; },	// ok
		board_spawn_locked: function(){ return self.game.grid.hasFishLocked; }, //ok
		first_bomb: function(){ return self.game.grid.hasBomb; },	// ok
		wall: function(){ return self.game.grid.hasWall; },	// ok
		hole: function(){ return self.game.grid.hasHole; }, // ok
		survival_mode: function(){ return mode.isSurvival(); }, // ok
		miley_cyrus: function(){ return mode.isWreckingBall(); }, // ok
		simple: function() { return mode.isSimple(); }, // ok
		hanged: function(){ return mode.isHanged(); }, // ok
		crossword: function(){ return mode.isCrossword(); }
	}
};

GameScene.prototype.secondaryTutoPres = function(key, onDone) {
	if(key && (key == 'goals' || key == 'word_length'))
	{

		if(key == 'goals')
		{
			var goals = this.level.getMode().findGoals();

			if(!ATW.isMobile()) {
			 	var parent = this.view.getElementById('groupGauge')
				, firstGoal = this.view.getElementById('score-0')
				, line = this.view.getElementById('lineScore-0')
				, bounding = {
					x: line.position.x + parent.position.x + firstGoal.position.x,
					y: line.position.y + parent.position.y + firstGoal.position.y,
					width: firstGoal.width,
					height: firstGoal.height
				}
			} else {

				var parent = this.view.getElementById('starGauge')
				, firstGoal = this.view.getElementById('onStar-0')
				, bounding = {
					x: parent.position.x + firstGoal.position.x - firstGoal.width/2,
					y: parent.position.y + firstGoal.position.y - firstGoal.height/2,
					width: firstGoal.width,
					height: firstGoal.height
				}


			}


			var tutoBoard = new UI.PopupTutoBoard([
				{
					hit: bounding,
					// noArrow: true,
					txt: _ts('ton_objectif_est_x_pts', {
						':x': ' ' + goals[0]
					})
				}
			]);
		}
		else
		{
			// var $descri = self.$node.find('#descritionMd');

			// var bounding = DOMHelper.getNoScaleBoundingClient($descri[0], TutoBoardPopup.border);
			// bounding[0] += 60;
			// bounding[1] += 5;
			// bounding[2] -= 120;

			var descri = this.view.getElementById('groupTitle')
			, bounding = {
				x: descri.position.x,
				y: descri.position.y,
				width: descri.width,
				height: descri.height
			};

			var tutoBoard = new UI.PopupTutoBoard([
				{
					hit: bounding,
					txt: _ts('objectif_longueur_p1')
				},{
					hit: bounding,
					txt: _ts('objectif_longueur_p2')
				},{
					hit: bounding,
					txt: _ts('objectif_longueur_p3')
				}
			]);
		}
		// tutoBoard.onComplete = this.launch123Go.bind(this);
		tutoBoard.onComplete = onDone;
		tutoBoard.open();

	}
	else
	{
		onDone();
	}

};

GameScene.prototype.launch123Go = function(){
	Util.Sound.fxPlay('fx/ready_3 2 1_GO');
	this._flash("3 2 1 Go!", this.launchGame.bind(this))
};


GameScene.prototype.launchGame = function() {
	if(!this.open) return;

	console.log('GameScene::launchGame');
	this.game.start();

	// Copy paste mygohandler

	this.refreshHangedWord();
};

GameScene.prototype.startTimerHandler = function(resume, id)
{
	if(id == Game.MYGame.WAVE_TIMER) this._rope(resume);
	else this._hourglass(resume);

};

GameScene.prototype.freezeHandler = function(isFreeze)
{
	var sparkle = this.view.getElementById('sparkle');
	if(!sparkle) return;

	var frontRope = this.view.getElementById('frontRope')

	if(isFreeze)
	{
		for(var i in this.timersAnim)
		{
			if(this.timersAnim[i]) this.timersAnim[i].pause();
		}

		sparkle.stop();
		sparkle.alpha = 0;

		var frozenFixture = new PIXI.TilingSprite(PIXI.Texture.fromFrame('fixture_rope_freeze'), 48, 452)
			, frozenRope = new PIXI.TilingSprite(PIXI.Texture.fromFrame('freeze_rope'), 22, 587)
			, sparkleFreeze = PIXI.Sprite.fromFrame('sparkle_freeze');

		frozenRope.height = frontRope.height;
		frozenRope.position.x = 1;
		frontRope.addChild(frozenRope);

		sparkleFreeze.position.y = frontRope.height - 15;
		sparkleFreeze.position.x = -10;
		frontRope.addChild(sparkleFreeze);

		frozenFixture.height = frontRope.height;
		frozenFixture.position.x = -9;
		frontRope.addChild(frozenFixture);

		frontRope.frozenThing = [frozenRope, frozenFixture, sparkleFreeze];

	}
	else
	{
		for(var i in this.timersAnim) if(this.timersAnim[i]) this.timersAnim[i].resume();

		sparkle.alpha = 0;
		sparkle.play();

		var frozenThing = frontRope.frozenThing;
		for(var i=0; i<frozenThing.length; i++) {
			frontRope.removeChild(frozenThing[i]);
		}

		frontRope.frozenThing = [];
	}



};

GameScene.prototype.consumeBonusHandler = function(cBonus)
{
	var player = ATW.App.getPlayer();
	if(player.consumeBonus(cBonus.id))
	{
		var bonus = player.getBonus(cBonus.id);
		ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
			on: 'me',
			data: {
				quantity: bonus.getQuantity(),
				id: cBonus.id
			}
		});
	}

	this.updateBonus(cBonus.id);
};


GameScene.prototype.updateBonus = function(bid) {
	var player = ATW.App.getPlayer()
		, bonus = player.getBonus(bid)
		, quantity = (bonus) ? bonus.getQuantity() : 0
		, qtyText = this.view.getElementById('bonusText-' + bid)
		, pearlSprite = this.view.getElementById('bonusPearl-' + bid);


	var s = 'x' + quantity;
	if(!quantity) {
		var product = Util.Shop.findProductByKey(bonus.getKey());
		s = product.price.toString();
		pearlSprite.alpha = 1;
	} else {
		pearlSprite.alpha = 0;
	}


	Util.DisplayText.updateShadowText(qtyText, s);


	// var $line = this.$node.find('#line-' + bid);

	// var $bonus = $line.find('#bonus-' + bid);
	// $line.removeClass('loading');

	// var $quantity = $bonus.next('.quantity');
	// $quantity.removeClass('x0')
	// 	.find('.txt')
	// 	.html('x'+quantity);

	// if(!quantity)
	// {
	// 	$quantity.addClass('x0');
	// }
};

GameScene.prototype.endHandler = function()
{
	console.log('GameScene::endHandler');
	if(!this.level.getId()) return;


	this.hasEnd = true;

	if(this.level.getMode().isHanged() && this.game.mysteryWord != this.game.hangedWord)
	{
		// Affiche le mot mystere
		this.updateDescription(this.game.mysteryWord.toUpperCase());
	}

	if(this.game.hasWin()) this.saveGame();

	this.dispatchAchievement();

	this.saveStat();

	this.stopRunningAnimation();
	this.endAnim();

};

GameScene.prototype.updateDescription = function(text){
	var groupTitle = this.view.getElementById('groupTitle');
	var descriptionText = this.view.getElementById('descriptionText')
		, children = descriptionText.children
		, childrenLength = descriptionText.children.length;

	for(var i=0; i<childrenLength; i++) {
		children[i].setText(text);
	}

	// descriptionText.position.x = ~~(groupTitle.width/2 - descriptionText.width/2);
	descriptionText.position.x = ~~(groupTitle.oriWidth/2 - descriptionText.width/2);
};

GameScene.prototype.refreshHangedWord = function()
{
	if(!this.level.getMode().isHanged()) return;

	var hangedWord = this.game.getHangedWord();
	if(!this.lastHangedWord || this.lastHangedWord != hangedWord)
	{


		this.updateDescription(hangedWord.toUpperCase());


		var isEmpty = true;
		for(var i in hangedWord)
		{
			if(hangedWord[i] != '_')
			{
				this.highlightHangedLetter(hangedWord[i]);
				isEmpty = false;
			}

		}

		if(isEmpty && this.hangedLetterTest)
		{


			for(var letter in this.hangedLetterTest){
				var v = this.hangedLetterTest[letter];
				for(var fishId in v) {

					var fish = v[fishId]
						, letterContainer = this.view.getElementById('letter-'+fish.id)
						, frontLetter = letterContainer.children[1];

					letterContainer.cacheAsBitmap = null;

					frontLetter.tint = 0xFFFFFF;
					frontLetter.updateText();

					letterContainer.cacheAsBitmap = true;

					UI.Fish.toDefault(fish);

				}
			}


			this.hangedLetterTest = {};
		}

		this.lastHangedWord = hangedWord;
	}


};



GameScene.prototype.highlightHangedLetter = function(letter, isError)
{
	letter = letter.toUpperCase();
	if(this.hangedLetterTest[letter]) return;
	else if(!this.hangedLetterTest[letter]) this.hangedLetterTest[letter] = {};

	var fishesByLetter = this.game.grid.fishesByLetter()
		, fishSection = fishesByLetter[letter]
		, nbFish = fishSection.length;

	for(var i=0; i<nbFish; i++) {
		var fish = fishSection[i]
			, letterContainer = fish.view.storage.textContainer
			, frontLetter = letterContainer.children[1];

		letterContainer.cacheAsBitmap = null;
		if(isError) {
			frontLetter.tint = 0xff5e5e;
			fish.ghost = true;

			UI.Fish.toDefault(fish);
		} else {
			frontLetter.tint = 0x00ff06;
		}

		frontLetter.updateText();

		letterContainer.cacheAsBitmap = true;
		this.hangedLetterTest[letter][fish.id] = fish;

	}

};


GameScene.prototype.eatPearlsHandler = function(pearls)
{
	var nbPearlWon = 0
		, cPearls = ATW.Datas.PEARLS;
	for(var i in pearls)
	{
		var pearlID = pearls[i].id;
		var pearl = cPearls[pearlID];
		var drop = Util.Math2.castInt(pearl.drop);
		this.nbPearl += drop;
		nbPearlWon += drop;
	}


	if(nbPearlWon)
	{
		Util.Sound.fxPlay('fx/perle');

		var self = this
			, player = ATW.App.getPlayer()
			, api = ATW.App.getDataManager().getApi()
			, updateData = {}
			, pearlText = this.view.getElementById('headerPearlText');

		player.incrPearls(nbPearlWon);
		this.level.incrPearls(nbPearlWon);

		ATW.App.refreshPearl();
		// pearlText.setText(player.getPearls().toString());
		// pearlText.updateText();
		// pearlText.position.x = pearlText.rightOri - pearlText.width;

		this.pearlsRequest.push(function(){
			api.call('User', 'POST', {
				on: 'me',
				data: {
					pearls: player.getPearls()
				}
			}, function(res){
				if(self.pearlsRequest > 1)
				{
					self.pearlsRequest.splice(0, t.length-1);
					self.pearlsRequest[0]();
				}
				else
				{
					self.pearlsRequest = [];
				}

			});

			updateData.world_id  = self.level.getWorld().getId();
			updateData.level_id  = self.level.getId();
			updateData.first_name = player.getFirstName();
			updateData.pearlsGrind = self.level.getPearls();

			api.call('Score', 'POST', {
				on: 'me',
				data: updateData
			});

		});

		if(this.pearlsRequest.length == 1) this.pearlsRequest[0]();


	}
};


GameScene.prototype.onFishMouseDownHandler = function()
{
	var mode = this.level.getMode();
	if(!mode.isHanged()) return;

	var btnSubmit = this.view.getElementById('btnSubmit')
		, btnSubmitUnselectable = this.view.getElementById('btnSubmitUnselectable')
		, currentWord = this.game.word.getCurrent('_');

	if(currentWord.length == mode.getX())
	{
		btnSubmit.alpha = 1;
		btnSubmitUnselectable.alpha = 0;
		btnSubmitUnselectable.visible = false;
	}
	else
	{
		btnSubmit.alpha = 0;
		btnSubmitUnselectable.alpha = 1;
	}

};

GameScene.prototype.pause = function()
{
	console.log('GameScene::pause')
	this.game.pause();
	this.toggle();


};

GameScene.prototype.resume = function()
{
	console.log('GameScene::resume');
	this.game.resume();
	this.toggle();
};

GameScene.prototype.toggle = function()
{
	// console.log('GameScene::toggle deprecated')
	// return;


	if(this.game.isPlaying() && this.viewState == GameScene.GAME_VIEW
		|| ( (!this.game.isPlaying() && !this.game.isFreeze) && this.viewState == GameScene.PAUSE_VIEW )
	) {
		console.log('not allow');
		return false;
	}

	if(this.viewState == GameScene.GAME_VIEW)
	{
		for(var i in this.timersAnim)
		{
			var t = this.timersAnim[i];
			if(t) t.pause();

		}

		this.viewState = GameScene.PAUSE_VIEW;
	}
	else
	{


		this.viewState = GameScene.GAME_VIEW;
	}


	return true;

};

GameScene.prototype.onTutoGameHandler = function(tutoKey, onComplete, saveOnFire)
{
	var self = this
		, player = ATW.App.getPlayer()
		, force = false
		, dontSave = false;

	if(saveOnFire)
	{
		force = true;
		dontSave = true;
	}


	var onCloseHandler = function()
	{

		if(Game.Grid.TutoToBonus[tutoKey] && Game.Grid.BonusWord[Game.Grid.TutoToBonus[tutoKey]])
		{
			// On vient de debloquer un bonus
			var cBonus = Util.Bonus.findByTuto(tutoKey);
			if(cBonus)
			{
				var btnBonus = self.view.getElementById('btnBonus-' + cBonus.id);
				btnBonus.alpha = 1;
				btnBonus.buttonMode = true;

				player.incrBonus(cBonus.id);
				self.updateBonus(cBonus.id);
				ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
					on: 'me',
					data: {
						quantity: player.getBonus(cBonus.id).getQuantity(),
						id: cBonus.id
					}
				});

				self.game.useBonus(cBonus, true);

			}
		}
	}



	var p = new UI.PopupTuto(tutoKey, force, dontSave);
	p.open();

	if(force) p.save();

	if(p && p.active)
	{
		this.pause();

		p.onClose = function(){

			onCloseHandler();
			self.resume();

			if(onComplete) onComplete();

		}
	}
	else if(onComplete) onComplete();

};


GameScene.prototype.pauseHandler = function(){
	var pauseContainer = this.view.getElementById('pauseContainer');
	if(this.viewState == GameScene.PAUSE_VIEW || pauseContainer.visible) return;

	var filterPause = this.view.getElementById('filterPause');
	filterPause.interactive = true;
	filterPause.mousedown = filterPause.touchstart = this.resumeHandler.bind(this);


	pauseContainer.alpha = 0;
	pauseContainer.visible = true;

	TweenLite.to(pauseContainer, 0.4, {alpha: 1});

	this.pause();
};

GameScene.prototype.resumeHandler = function(){
	if(this.viewState == GameScene.GAME_VIEW) return;

	var pauseContainer = this.view.getElementById('pauseContainer');

	TweenLite.to(pauseContainer, 0.4, {alpha: 0, onComplete: function(){
		pauseContainer.visible = false;
	}});

	this.resume();

};



GameScene.prototype.hourglassTimerHandler = function(t)
{
	var o = t.getCurrent();
	this.timerBmp.setText(o.min + ':' + o.sec);
};



GameScene.prototype.handleProgressQueue = function()
{
	if(this.progressAnimQueue && this.progressAnimQueue.length)
	{
		var nextAnim = this.progressAnimQueue.pop();
		nextAnim();

	}
	else
	{
		this.tlProgress = null;
	}
};


GameScene.prototype.onProgressObjectiveHandler = function()
{

	var self = this
		, tilingGauge      = this.view.getElementById('tilingGauge')
		, frontMobileGauge = this.view.getElementById('frontMobileGauge')
		, backMobileGauge = this.view.getElementById('backMobileGauge')
		, headGauge        = this.view.getElementById('headGauge')
		, barShape         = this.view.getElementById('barShape')
		, scoreText        = this.view.getElementById('scoreText')
		, cGoal            = this.game.goal
		, mode             = this.level.getMode()
		, goals            = mode.findGoals()
		, isIncreasing     = (goals[2] > goals[0])
		, nextGoal         = this.game.appStar
		, totalHeight      = (backMobileGauge) ? backMobileGauge.width : barShape.height-40
		, ratio            = 0
		, heightGoal       = ~~(totalHeight/goals.length)
		, headHeight       = (headGauge) ? headGauge.height : 0
		, myStar           = this.game.getStar();

	this.updateDescriptionObj();

	if(nextGoal < goals.length)
	{
		var oldGoal = (goals[nextGoal-1]) ? goals[nextGoal-1] : 0;
		if(isIncreasing) ratio = Math.min((cGoal - oldGoal)/(goals[nextGoal] - oldGoal), 1);
		else ratio = Math.min((goals[nextGoal] - oldGoal)/(cGoal - oldGoal), 1);

	}

	var y = ~~((heightGoal * this.game.appStar) + (heightGoal*ratio));
	y -= headHeight;
	y = Math.max(0, y);
	var animGoal = function(tl, goalId)
	{
		var onStar = self.view.getElementById('onStar-' + goalId)
			, offStar = self.view.getElementById('offStar-' + goalId);

		var startAt = 0.3 * (goalId) + 0.1;
		tl.to(offStar, 0.15, {alpha: 0}, 'yolo+='+startAt);
		tl.to(onStar, 0.15, {alpha: 1}, 'yolo+='+startAt);

		Util.Sound.fxPlay('fx/etoile_' + (parseInt(goalId, 10)+1));
	}


	var progressAnim = function(){
		if(self.lastCGoal && self.lastCGoal > cGoal)
		{
			self.handleProgressQueue();
			return;
		}
		self.lastCGoal = cGoal;

		var totalDuration = 3;

		if(tilingGauge) {
			var dest = tilingGauge.oriY - y;
			var distance = tilingGauge.position.y - dest;
		} else {
			var dest = y;
			var distance = dest - frontMobileGauge.width;
		}

		if(!y) {
			var duration = 0;
		} else {
			var duration = (totalDuration / totalHeight) *  (distance);
		}

		Util.DisplayText.updateShadowText(scoreText, self.game.score.toString());

		self.tlProgress = new TimelineMax();
		if(tilingGauge) {
			self.tlProgress.to(tilingGauge, duration, {height: y}, 'yolo');

			self.tlProgress.to(tilingGauge.position, duration, {y: dest}, 'yolo');
			self.tlProgress.to(headGauge.position, duration, {y: dest - headHeight + 2}, 'yolo');

			scoreText.position.x = scoreText.centerX - (scoreText.width/2);

			var margin = (y > 20) ? 20 : 0;
			self.tlProgress.to(scoreText.position, duration, {y: dest + margin}, 'yolo');
		} else {
			self.tlProgress.to(frontMobileGauge, duration, {width: dest}, 'yolo');
		}

		if(self.goalAnims.length < goals.length)
		{
			for(var i=self.goalAnims.length; i<goals.length; i++)
			{
				var objY = ~~(totalHeight/3)*(i+1) -headHeight;
				var newStar = (y >= objY && myStar >= i+1);
				if(newStar) {
					animGoal(self.tlProgress, i);
					self.goalAnims.push(true);
				}
			}

		}

		self.tlProgress.call(function(){
			self.handleProgressQueue();
		});

	}

	if(!this.tlProgress) progressAnim();
	else this.progressAnimQueue.push(progressAnim);





};

GameScene.prototype.updateDescriptionObj = function(){

	var mode = this.level.getMode(),
		game = this.game,
		newDesc = mode.getDescription(game.obj1, game.getStar(), game.score, true);

	if(!mode.isHanged())
	{
		if(newDesc !== true) this.updateDescription(newDesc);
		else this.updateDescription( Util.String2.strip(_ts('faire_maximum_de_points')) );
	}
	else
	{
		if(newDesc !== true) {
			var groupTitle = this.view.getElementById('groupTitle')
				, timerContainer = this.view.getElementById('timerContainer')
				, titleBmp       = this.view.getElementById('titleBmp')
				, children       = titleBmp.children
				, childrenLength = titleBmp.children.length;

			for(var i=0; i<childrenLength; i++) {
				children[i].setText(newDesc + ' | ');
			}

			timerContainer.position.x = titleBmp.position.x + titleBmp.width + 15;

		}

		this.lastHangedWord = null;

	}


};

GameScene.prototype.endAnim = function()
{

	var classNames = []
		, cssTexts = [{
			top:-50
		}]
		, textResult
		, tips = null
		, assetsField = this.view.getElementById('assetsField');

	// --------------------------------------------------------------
	// Flash result
	// --------------------------------------------------------------
	if(this.game.hasWin())
	{
		classNames.push('greenCornerTxt');
		textResult = _ts('gagne');
	}
	else
	{
		classNames.push('redCornerTxt');
		textResult = _ts('perdu');
	}


	if(this.game.endReason != Game.MYGame.END_FLOW)
	{
		switch(this.game.endReason)
		{
			case Game.MYGame.END_NO_POSSIBILITY:
				if(this.game.iFish > 0) tips = _ts('aucun_mot_restant');

				break;
		}

		if(tips)
		{
			classNames.push(classNames[0]);
			classNames[0] = 'greyCornerTxt';

			cssTexts.push(cssTexts[0]);
			cssTexts[0] = false;
			textResult = [tips, textResult];
		}

	}

	this._flash(textResult, null, 2, classNames, cssTexts);


	// --------------------------------------------------------------
	// Fish animations
	// --------------------------------------------------------------
	var tl = new TimelineMax()
		,  childrenAsset = assetsField.children
		 , durationGameOpacity = 1
		 , atGameOpacity = '-=1'
		 , fishesView = []
		 , fishesViewScales = []
		 , job = null;

	// var $fishes = $('.fish');

	// TweenMax.to($('#ropeContainer, #hourglassContainer, #descritionMd'), 0.4, {autoAlpha: 0});
	// TweenMax.to($('#ropeContainer, #hourglassContainer, #descritionMd, #bonusControl'), 0.4, {autoAlpha: 0});

	if(this.game.hasWin()) job = function(f) { UI.Fish.toValidate(f, tl); };
	else job = function(f) { UI.Fish.toError(f, tl); };

	this.game.getGrid().eachFish(function(f){
		job(f);
		fishesView.push(f.view);
		fishesViewScales.push(f.view.scale);
	});


	tl.to(fishesView, 0.2, {alpha: 0}, '+=1');
	tl.to(fishesViewScales, 0.2, {y: 1.3}, '-=0.2');
	atGameOpacity = 0.5;

	// var $game = this.$node.find('#game');
	// tl.to($game, durationGameOpacity, {autoAlpha: 0.5, ease: Power2.easeIn}, atGameOpacity);

	tl.call(this.resultScene.bind(this));
};

GameScene.prototype.resultScene = function()
{
	console.log('GameScene::resultScene');

	var scene = (this.game.hasWin()) ? new Scene.WinScene(this.game) : new Scene.DefeatScene(this.game);
	scene.start();

};



GameScene.prototype.close = function()
{
	if(!this.game.hasWin() && this.handleStartLife)
	{
		this.handleStartLife();
		this.handleStartLife = null;
	}

	this.game.cleanAll();
	this.stopRunningAnimation();


	Scene.BaseScene.prototype.close.call(this);

};




GameScene.prototype.saveGame = function()
{
	var app = ATW.App
		, world = this.level.getWorld()
		, worldId = world.getId()
		, levelId = this.level.getId()
		, newScore = (!this.level.getScore() || this.game.getScore() > this.level.getScore())
		, newStar  = (this.game.getStar() > this.level.getStar())
		, lessStar = (this.game.getStar() < this.level.getStar())
		, newDuration = ( !lessStar && (!this.level.getDuration() || this.game.getTotalDuration() < this.level.getDuration()) );
	if(newScore || newStar || newDuration || this.nbPearl)
	{
		var updateData = {};

		if(newScore) updateData.score = this.game.getScore();
		if(newStar) updateData.star = this.game.getStar();
		if(newDuration) updateData.duration = this.game.getTotalDuration();

		this.level.update(updateData);

		updateData.world_id  = worldId;
		updateData.level_id  = levelId;
		updateData.first_name = app.getPlayer().getFirstName();

		app.getDataManager().getApi().call('Score', 'POST', {
			on: 'me',
			data: updateData
		});

	}

	if(!app.getPlayer().isOnSession())
	{
		var cLife = app.getPlayer().life;
		app.getPlayer().life  = cLife+1;

		app.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: {
				// lastVisited: app.getPlayer().getLastVisited(),
				life: app.getPlayer().life
			}
		}, function(res){
			app.getPlayer().myUpdate(res);
		});
	}


};


GameScene.prototype.dispatchAchievement = function()
{
	var world = this.level.getWorld()
		, app = ATW.App
		, am = app.getPlayer().getAchievementManager()
		, nbEmptyGrid = this.game.getIEmptyGrid();
	am.dispatch('GET_POINTS_IN_WORD', { ref: world.getId() }, world.getScore(), true);

	if(this.game.getLife() == this.level.getLife()) {
		am.dispatch('PERFECT_LEVEL', { ref: this.level.getId() });
	}

	if(this.nbPearl) {
		am.dispatch('GET_PEARLS', {ref: {nb: this.nbPearl}}, this.nbPearl);
	}

	if(nbEmptyGrid)	{
		am.dispatch('GET_EMPTY_GRID', {ref: {nb: nbEmptyGrid}}, nbEmptyGrid);
	}

	am.save();
};


GameScene.prototype.stopRunningAnimation = function()
{

	for(var i in this.timersAnim)
	{
		if(this.timersAnim[i])
		{
			this.timersAnim[i].kill();
			this.timersAnim[i] = null;
		}
	}
};


GameScene.prototype.saveStat = function()
{
	var statTrack = {
		level_id: this.level.getId(),
		is_won: (this.game.hasWin()) ? 1 : 0,
		is_reload: (this.displayObjs) ? 1 : 0,
		nb_pearl: this.nbPearl,
		score: this.game.getScore(),
		at_wave: this.game.iWave,
		nb_grid_empty: this.game.getIEmptyGrid(),
		nb_error_word: this.game.getIError(),
		nb_next: this.game.iNext,
		nb_letter_left: this.game.nbLeftFish,
		nb_free_bonus: this.game.nbGiftBonus,
		nb_used_bonus: this.game.nbUsedBonus,
		nb_shp_bonus: this.nbShopBonus
	};

	if(this.level.getMode().isCrossword())
	{
		statTrack.cw_avg_complete = this.game.getAvgCrossword();
	}

	if(statTrack.is_won)
	{
		statTrack.nb_star         = this.game.getStar();
		statTrack.nb_lfe_left    = this.game.getLife();
		statTrack.avg_word_length = this.game.getAvgWordLength();
	} else if(!this.game.getStar() && !this.game.hasCompleteObj()) {
		statTrack.lost_by_all = 1;
	} else if(!this.game.getStar()) {
		statTrack.lost_by_star = 1;
	} else {
		statTrack.lost_by_obj = 1;
	}

	ATW.App.getDataManager().getApi().call('LStat', 'POST', {
		on: 'add',
		data: statTrack
	}, function(res){

	});
};




GameScene.prototype.emptyAlertHandler = function(pts)
{
	var self = this;

	if(this.game.forceLaunchWave)
	{
		this.game.forceLaunchWave = false;
		this.game.wave();
	}
	else if(this.game.timers[Game.MYGame.WAVE_TIMER] && this.game.timers[Game.MYGame.WAVE_TIMER].duration > 1000)
	{
		setTimeout(function(){
			self.game.wave();
		}, 300);
	}



	this._flash([_ts('grille_vide')], null, 0.1, ['greenCornerTxt']);
	Util.Sound.fxPlay('fx/grille_vide');

};


GameScene.prototype.scoreHandler = function(points, type, isGold)
{
	if(typeof type != "undefined" && type == 'CL_BD') return;

	var selectedMap = this.game.getSelectedMap(),
		lastFish = selectedMap[selectedMap.length-1];
	if(!lastFish) return;

	var ground = lastFish.getGround(),
		css = {
			left: ground.getLeft() + 40,
			top: ground.getTop() + 40
		};

	this._scoreAnim(points, css, isGold);
};


GameScene.prototype._scoreAnim = function(points, css, isGold)
{
	if(!points) return;

	var tint = 0x70ff61;
	var shadow = 0x00972f;
	if(isGold) {
		tint = 0xffe611;
		shadow = 0xab6811;
	}

	var self = this
	, text = new PIXI.BitmapText("+" + _ts('x_pts', {':x': points}), {
		font: '40px FredokaOne-Regular',
		tint: tint
	});
	text = Util.DisplayText.shadow(text, 3, 1, shadow, 0.9);
	text.pivot.x = ~~(text.width/2);
	text.pivot.y = ~~(text.height/2);

	text.position.x =  css.left + this.fields.position.x;
	text.position.y = css.top + this.fields.position.y;
	this.addChild(text);

	var tl = new TimelineMax();
	tl.to(text.position, 2, {y: text.position.y - 80, ease: Power2.easeOut});
	tl.to(text, 0.25, {alpha: 0}, '-=0.25');

	tl.call(function(){
		self.removeChild(text);
	});

};


GameScene.prototype.waveHandler = function()
{
	var quantityLeft = this.game.getQuantityLeft();
	// console.log('WaveHandler::quantityLeft', quantityLeft);
	if(quantityLeft < 0) return;

	var fireWaveText = this.view.getElementById('fireWaveText');
	if(!fireWaveText) return;

	for(var i=0; i<fireWaveText.children.length; i++) {
		fireWaveText.children[i].setText(quantityLeft.toString());
	}

	fireWaveText.position.x = -fireWaveText.width/2;
	fireWaveText.position.y = -fireWaveText.height/2;
	if(this.level.getMode().isWreckingBall()){
		fireWaveText.position.y = 10;
	}


	if(quantityLeft == 0) {
		var fireWave = this.view.getElementById('fireWave');
		fireWave.onHit = null;
		fireWave.setTexture(PIXI.Texture.fromFrame('ig_firewave_bg_empty'));

	}
};

GameScene.prototype.waveCutHandler = function(points)
{
	console.log('GameScene::waveCutHandler', points);
	this._scoreAnim(points, {
		left: this.fields.width + 20,
		top: +30
	});
};



GameScene.prototype.changeLifeHandler = function(quantity)
{

	var lifeText = this.view.getElementById('lifeText'),
		ghostIco = this.view.getElementById('ghostIco'),
		color = (quantity > 0) ? 0x33FF33 : 0xFF0000,
		self = this;

	if(this.lifeTl)
	{
		this.lifeTl.clear();
		this.lifeTl = null;
	}


	lifeText.setText(this.game.getLife().toString());
	lifeText.updateText();

	lifeText.tint    = color;
	lifeText.pivot.x = ~~(lifeText.width/2);
	lifeText.pivot.y = ~~(lifeText.height/2);

	if(!ATW.isMobile()) lifeText.position.x = ghostIco.position.x - lifeText.pivot.x - 10;
	else lifeText.position.x = ghostIco.position.x + ghostIco.width - lifeText.pivot.x + 30;

	lifeText.position.y = 12 + lifeText.pivot.y;

	lifeText.scale.x = lifeText.scale.y = 2;


	var colorTween = {color: lifeText.tint};
	var tl = new TimelineMax();
	tl.to(colorTween, 0.2, {colorProps: {color: 0xFFFFFF}, onUpdate: function(){
		lifeText.tint = parseInt(Util.Color.rgbToHex(colorTween.color), 16);
		lifeText.updateText();
	}}, 'start');

	tl.to(lifeText.scale, 0.2, {x:1, y:1}, 'start');
	tl.call(function(){
		if(self.lifeTl || self.game.life > 3) return;

		self.lifeTl = new TimelineMax({repeat: -1, repeatDelay:0.2});
		self.lifeTl.to(lifeText.scale, 0.2, {x: 1.5, y:1.5});

		self._addAnim(self.lifeTl);
	});



};




GameScene.prototype._rope = function(resume)
{
	var sec = this.game.getTimer(Game.MYGame.WAVE_TIMER).getDuration()/1000
		, frontRope = this.view.getElementById('frontRope')
		, fireWave = this.view.getElementById('fireWave')
		, sparkle = this.view.getElementById('sparkle');

	if(!resume) {
		if(!ATW.isMobile()) {
			frontRope.height = 578;
			sparkle.position.y = sparkle.oriY;
			sparkle.alpha = 1;
		} else {
			frontRope.width = 0;
		}

	}

	if(this.timersAnim[Game.MYGame.WAVE_TIMER])
	{
		this.timersAnim[Game.MYGame.WAVE_TIMER].clear();
		this.timersAnim[Game.MYGame.WAVE_TIMER] = null;
	}

	if(this.timersAnim['pulseFirewave'])
	{
		this.timersAnim['pulseFirewave'].clear();
		this.timersAnim['pulseFirewave'] = null;
		fireWave.scale.x = fireWave.scale.y = 1.1;
	}

	this.timersAnim[Game.MYGame.WAVE_TIMER] = new TimelineMax();
	if(!ATW.isMobile()) {
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(frontRope, sec, {height:17, ease: Linear.easeNone}, 'start');
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(sparkle.position, sec, {y:-5, ease: Linear.easeNone}, 'start');
	} else {
		this.timersAnim[Game.MYGame.WAVE_TIMER].to(frontRope, sec, {width:341, ease: Linear.easeNone}, 'start');
	}


	var midSec = sec/2;
	this.timersAnim['pulseFirewave'] = new TimelineMax({delay: midSec, repeat:-1, repeatDelay: 0.23});
	this.timersAnim['pulseFirewave'].to(fireWave.scale, 0.5, {x:1.3, y:1.3, ease: Elastic.easeOut});
};


GameScene.prototype._hourglass = function(resume)
{

	return;

	var sec = this.game.getTimer(MYGame.HOURGLASS_TIMER).getOriDuration()/1000;
	var $hourglass = this.$node.find('#hourglassContainer .hourglass');



	if(this.timersAnim[MYGame.HOURGLASS_TIMER])
	{
		this.timersAnim[MYGame.HOURGLASS_TIMER].kill();
		this.timersAnim[MYGame.HOURGLASS_TIMER] = null;
	}

	this.timersAnim[MYGame.HOURGLASS_TIMER] = new TimelineMax();
	this.timersAnim[MYGame.HOURGLASS_TIMER].to($hourglass.find('.bottomSand'), sec, {
		height: 18,
		ease: Linear.easeNone
	}, 'start');
	this.timersAnim[MYGame.HOURGLASS_TIMER].to($hourglass.find('.topSand'), sec, {
		height: 0,
		ease: Linear.easeNone
	}, 'start');


};



GameScene.prototype._flash = function(text, cb, endDuration, classNames, cssTexts)
{
	var container = new PIXI.DisplayObjectContainer(),
		baseClassName = 'greyCornerTxt',
		tl = new TimelineMax(),
		time = 0,
		word, element, duration, i,
		self = this;

	if(typeof endDuration == "undefined" || endDuration == null) var endDuration = 0.6;

	if(typeof text == "string") var words = text.split(" ");
	else var words = text;

	var wordCount = words.length;

	this.addChild(container);

	var oriTxt = {autoAlpha:0, scale:0, z:0.01};
	var toScale = 1.2;
	for(i = 0; i < wordCount; i++)
	{
		word = words[i];
		var isSentenceEnd = i==wordCount-1,
			className = (classNames && classNames[i]) ? classNames[i] : baseClassName
			, fontSize = (word.length > 7 && word.indexOf(' ') != -1) ? 130 : 180
			, tint = 0xFFFFFF
			, shadow = 0x0d0d0d
			, shadowAlpha = 0.5;

		if(className == 'greenCornerTxt') {
			tint = 0x70ff61;
			shadow = 0x00972f;
			shadowAlpha = 1;
		} else if(className == 'redCornerTxt') {
			tint = 0xff5a42;
			shadow = 0xbd1417;
			shadowAlpha = 1;
		}

   		var element = new PIXI.BitmapText(word, {
   			font: fontSize+"px FredokaOne-Regular",
   			tint: tint,
   			align: "center"
   		});
   		element = Util.DisplayText.shadow(element, 2, 0, shadow, shadowAlpha);

   		var renderTexture = new PIXI.RenderTexture(~~element.width+1, ~~element.height+20);
   		var sprite = new PIXI.Sprite(renderTexture);
   		sprite.anchor.x = sprite.anchor.y = 0.5;
   		sprite.position.x = ATW.gameMidWidth();
   		sprite.position.y = ATW.gameMidHeight();
		container.addChild(sprite);

		renderTexture.render(element);


		duration = Math.max(0.5, word.length * 0.08);
		if (isSentenceEnd)
		{
			duration += endDuration;
    	}


    	TweenLite.set(sprite, {alpha:0});
    	TweenLite.set(sprite.scale, {x:0, y:0});
		tl.to(sprite.scale, duration, {x:1.2, y:1.2,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
		 	.to(sprite, duration, {alpha:1, ease:SlowMo.ease.config(0.25, 0.9, true)}, time);
    	time += duration - 0.05;
    	if (isSentenceEnd) time += endDuration;

  	}

  	tl.call(function(){
  		self.removeChild(container);
  		if(cb) cb();
  	});
};

GameScene.prototype.restart = function(){

	var player = ATW.App.getPlayer();

	this.onClose = function(){

		if(!player.hasLife() && !player.isOnSession()) {
			var levelScene = new Scene.LevelScene(this.level.getWorld());
			levelScene.start();
			levelScene.firePopupLife();
		} else {
			var gameScene = new Scene.GameScene(this.level, true);
			gameScene.start();
		}

	}

	this.close();



};

GameScene.GAME_VIEW = 0;
GameScene.PAUSE_VIEW = 1;

exports.GameScene = GameScene;

})(window.Scene = window.Scene || {});







/**** scenes/EndScene.js ****/
'use strict';
(function(exports){

function EndScene(game, sceneName, viewName)
{
	this.game = game;
	exports.BaseScene.call(this, sceneName, viewName);
};

EndScene.constructor = EndScene;
EndScene.prototype = Object.create(exports.BaseScene.prototype);

EndScene.prototype.logic = function() {
	var self = this
		, btnMenu = this.view.getElementById("btnMenu")
		, btnReload = this.view.getElementById("btnReload")
		, btnNext = this.view.getElementById("btnNext")

	if(btnMenu){
		btnMenu.onHit = function(){
			var levelScene = new Scene.LevelScene(self.game.level.getWorld());
			levelScene.start();
		}
	}

	if(btnReload) btnReload.onHit = this.reloadHandler.bind(this);
	if(btnNext) btnNext.onHit = this.goToNextLevel.bind(this);

};


EndScene.prototype.goToNextLevel = function()
{
	var cLevel = this.game.getLevel().getConf();
	var cNextLevel = Util.Level.getNext(cLevel);
	if(cNextLevel)
	{
		var world = this.game.getLevel().getWorld();
		var scene = new Scene.GameScene(world.getLevel(cNextLevel), true);
	}
	else
	{
		var scene = new Scene.WorldScene();
	}

	scene.start();

};


EndScene.prototype.reloadHandler = function() {
	var app = ATW.App
		, player = app.getPlayer()
		, level = this.game.getLevel();


	if(!player.hasLife() && !player.isOnSession()) {
		var levelScene = new Scene.LevelScene(level.getWorld());
		levelScene.start();
		levelScene.firePopupLife();

	} else {
		var gameScene = new Scene.GameScene(level, true);
		gameScene.start();
	}



};


exports.EndScene = EndScene;

})(window.Scene = window.Scene || {});





/**** scenes/WinScene.js ****/
'use strict';
(function(exports){

function WinScene(game)
{
	exports.EndScene.call(this, game, 'WinScene', 'win_scene');
};

WinScene.constructor = WinScene;
WinScene.prototype = Object.create(exports.EndScene.prototype);

WinScene.prototype.logic = function() {

	var hasTuto = this.game.getLevel().hasTuto();
	if(hasTuto !== false)
	{
		var levelRef = hasTuto+1;
		ATW.App.getPlayer().finishTuto('level' + levelRef);
		ATW.App.getDataManager().getApi().call('Tuto', 'POST', {
			on: 'me',
			data: {
				key: 'level' + levelRef
			}
		});

	}


	exports.EndScene.prototype.logic.call(this);


};



exports.WinScene = WinScene;

})(window.Scene = window.Scene || {});





/**** scenes/DefeatScene.js ****/
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




};

exports.DefeatScene = DefeatScene;

})(window.Scene = window.Scene || {});




/**** game/dictionary/DictionaryLoader.js ****/
'use strict';

(function(namespace){

function DictionaryLoader(key){
	this.key = key;

    var exportCDN = Util.Url.getPlatformCDN();

	this.loader = new PIXI.JsonLoader(exportCDN.baseUri + 'resources/dictionaries/' + key + '.json', exportCDN.crossOrigin);
};

DictionaryLoader.prototype.load = function() {
	var self = this;
	this.loader.on('error', function(e){
		self.onComplete(e);
	})
	this.loader.on('loaded', function(e){
		console.log('load');
		self.onComplete(null, e.content.json || e.content.content.json);
	});
	this.loader.load();

};

namespace.DictionaryLoader = DictionaryLoader;

})(window.Game = window.Game || {});



/**** game/dictionary/Dictionary.js ****/
'use strict';

(function(namespace){

function Dictionary(map){
	this.map = map;
};

Dictionary.prototype.getMap = function() {
	return this.map;
};

namespace.Dictionary = Dictionary;

})(window.Game = window.Game || {});


/**** game/dictionary/DictionaryArray.js ****/
'use strict';

(function(namespace) {

function DictionaryArray(map){
	namespace.Dictionary.call(this, map);
};

DictionaryArray.prototype.constructor = DictionaryArray;
DictionaryArray.prototype = Object.create(namespace.Dictionary.prototype);

DictionaryArray.prototype.rand = function() {
	var ri = ~~(Math.random() * this.map.length);
	return this.map[ri];
};

namespace.DictionaryArray = DictionaryArray;

})(window.Game = window.Game || {});

/**** game/dictionary/DictionarySort.js ****/
'use strict';

(function(namespace) {

function DictionarySort(map){

	namespace.Dictionary.call(this, map);
};

DictionarySort.prototype.constructor = DictionarySort;
DictionarySort.prototype = Object.create(namespace.Dictionary.prototype);

DictionarySort.prototype.getIndex = function(index) {
	return this.map[index] || false;
};

namespace.DictionarySort = DictionarySort;

})(window.Game = window.Game || {});

/**** game/core/MYGame.js ****/
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
							y: fireWave.position.y - 5,
							width: fireWave.width,
							height: fireWave.height
						}
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

/**** game/core/Word.js ****/
'use strict';
(function(exports){

function Word(word)
{
	this.reset(word);
};

Word.prototype.appendChar = function(c, isGhost)
{
	this.current += c.toLowerCase();
	if(!isGhost) this.score += Game.Char.getWeight(c);
};

Word.prototype.fill = function(withChar, by)
{
	for(var w=0; w<by; w++) this.current += withChar;
};

Word.prototype.reset = function(word)
{
	this.current = (word) ? word : "";
	this.score = 0;
};

Word.prototype.removeLastChar = function(isGhost, ignore)
{
	if(ignore)
	{
		var lastIndex = this.current.indexOf(ignore);

		if(lastIndex == -1) lastIndex = this.current.length-1;
		else lastIndex -= 1;
	}
	else
	{
		var lastIndex = this.current.length-1;
	}

	var c         = this.current[lastIndex];
	this.current  = this.current.substr(0, lastIndex);

	if(!isGhost) this.score -= Game.Char.getWeight(c);


};

Word.prototype.applyJoker = function()
{
	if(!this.hasJoker())
	{
		return this.current;
	}

	var tab = this.current.split(LetterFish.JOKER);

	if(tab.length == 1)
	{
		return this.current;
	}

	var result = this._checkABC(tab[0], tab, 0, this.current.length);
	if(result)
	{
		this.current = result;
		return this.current;
	}

	return false;
};

Word.prototype.hasJoker = function() { return (this.current.indexOf(LetterFish.JOKER) !== -1); };

Word.prototype._checkABC = function(start, tab, i, sizeWord)
{
	if(i == tab.length - 1){
		return DictionaryHelper.startBy(start, sizeWord);
	}

	var wordFound, c;
	var abc = DictionaryHelper.createAbc(true);
	for(var j=0; j<abc.length; j++)
	{
		c = String.fromCharCode(abc[j]);

		wordFound = DictionaryHelper.startBy(start + c, sizeWord);
		if(wordFound){
			res = this._checkABC(start + c + tab[i + 1], tab, i + 1, sizeWord);
			if(res){
				return res;
			}
		}
	}

	return false;
};

Word.prototype.setCurrent = function(current) { this.current = current; };


Word.prototype.getCurrent = function(ignore) {
	if(ignore)
	{
		var lastIndex = this.current.indexOf(ignore);
		if(lastIndex == -1) lastIndex = this.current.length;

		return this.current.substr(0, lastIndex);;

	}

	return this.current;
};
Word.prototype.getScore   = function() { return this.score; };

exports.Word = Word;

})(window.Game = window.Game || {});

/**** game/core/Ground.js ****/
'use strict';
(function(exports){
function Ground(grid, groundParam, line, col, position)
{
	this.grid = grid;
	this.id         = Ground.id++;
	this.index      = this.id;
	this.line       = line;
	this.col        = col;
	this.foundation = groundParam.gd;
	this.view       = groundParam.view;
	this.subView = null;
	if(this.isLDLostLife())
	{
		this.subView = this.view;
		this.view = null;
	}

	if(groundParam.groundType)
	{
		var gdTypeMap = Util.Ground.findByGdType(groundParam.groundType.id);
		if(gdTypeMap && gdTypeMap.length)
		{
			this.view = gdTypeMap[Util.Math2.randomInt(0, gdTypeMap.length-1)].id;
		}
	}
	// console.log('groundParam', groundParam);
	this.bonus      = null;
	if(groundParam.bonus && groundParam.bonus != Game.Grid.BONUS_HOLE && groundParam.bonus != Game.Grid.BONUS_WALL)
	{
		this.addBonus(new Model.Bonus({
				id: Util.Bonus.findByKey(groundParam.bonus).id
			})
		);
	}


	this.hole       = null;
	this.left       = position.left;
	this.top        = position.top;
	this.wall       = 0;
	this.width      = Ground.WIDTH;
	this.height     = Ground.HEIGHT;

	this.spawnPearl = groundParam.dropPearl;
	this.pearl = null;

	this.letterFish = null;
	if(groundParam.letter)
	{
		// this.letterFish = LetterFish.create(groundParam.letter, grid.game);
		this.letterFish = Game.LetterFish.create(groundParam.letter, grid.game.getLevel().getDifficultyTpl());
		this.letterFish.moveTo(this);
	}

	if(this.foundation == Game.Ground.LD_HOLE)
	{
		this.createHole();
	}
	else if(this.foundation == Game.Ground.LD_WALL)
	{
		// console.log('createWall');
		this.createWall();
	}
};

Ground.prototype.isEqualTo = function(ground) { return (ground.id == this.id); };

Ground.prototype.dropPearl = function()
{
	if(!this.spawnPearl) return;

	this.pearl = this.spawnPearl;

};

Ground.prototype.createHole = function()
{
	this.hole = new Game.Hole(this);
	this.hole.suck();
};

Ground.prototype.getAvailableHoleFish = function()
{
	if(!this.letterFish && this.hole && this.hole.getLetterFish()){
		return this.hole.getLetterFish();
	}

	return null;
};


Ground.prototype.addHole = function()
{
	this.foundation = Game.Ground.LD_HOLE;
	this.createHole();
};

Ground.prototype.attackWall = function()
{
	// console.log('attackWall', this.wall);
	this.wall--;
	return this;
};

Ground.prototype.isWallAccept = function()
{
	return (this.foundation == Game.Ground.LD_WALL && !this.hasWall());
};

Ground.prototype.isLDWall = function()
{
	return (this.foundation == Game.Ground.LD_WALL);
};

Ground.prototype.isLDHole = function()
{
	return (this.foundation == Game.Ground.LD_HOLE);
};


Ground.prototype.isSolid = function()
{
	return (this.foundation != Game.Ground.LD_GAP && this.foundation != Game.Ground.LD_X);
};

Ground.prototype.isNothing = function()
{
	return this.foundation == Game.Ground.LD_X;
};

Ground.prototype.isLDLostLife = function()
{
	return (this.foundation == Game.Ground.LD_LOST_LIFE);
};

// Envoie un poisson vers une nouvelle destination
Ground.prototype.sendFishTo = function(ground)
{
	var sendOccured = false;
	if(this.letterFish)
	{
		sendOccured = true;
	}

	ground.receiveFish(this.letterFish);
	this.letterFish = null;
	return sendOccured;
};

// Reception d'un poisson
Ground.prototype.receiveFish = function(letterFish)
{
	this.letterFish = letterFish;
	if(this.letterFish)
	{
		this.letterFish.moveTo(this);
	}

	if(this.hole)	// Le trou essaye d'aspirer la meduse
	{
		this.hole.suck();
	}
};

Ground.prototype.addBonus = function(bonus)
{
	this.bonus = bonus;
};

Ground.prototype.createWall = function()
{
	this.wall = 3;
};

Ground.prototype.getHole       = function() { return this.hole; };
Ground.prototype.hasWall       = function() { return this.wall > 0 };
Ground.prototype.hasBonus      = function() { return this.bonus; };
Ground.prototype.hasLetterFish = function() { return this.letterFish; };
Ground.prototype.hasHole       = function() { return this.hole; };
Ground.prototype.hasPearl      = function() { return this.pearl; };

// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
Ground.prototype.getId         = function() { return this.id; };
Ground.prototype.getFoundation = function() { return this.foundation; };
Ground.prototype.getLeft       = function() { return this.left; };
Ground.prototype.getTop        = function() { return this.top; };
Ground.prototype.getLetterFish = function() { return this.letterFish; };
Ground.prototype.getPosition   = function() { return {top: this.top, left: this.left}; };
Ground.prototype.getBonus      = function() { return this.bonus; };
Ground.prototype.getLine       = function() { return this.line; };
Ground.prototype.getWall       = function() { return this.wall; };
Ground.prototype.getCol        = function() { return this.col; };
Ground.prototype.getWidth      = function() { return this.width; };
Ground.prototype.getHeight     = function() { return this.height; };
Ground.prototype.getIndex      = function() { return this.index; };
Ground.prototype.getHitArea = function() {
	return [this.left, this.top, this.width, this.height];
};
Ground.prototype.getViewUrl    = function() {
	if(!this.view) {
		return false;
	}
	return this.view;
};

Ground.prototype.getSubViewUrl    = function() {
	if(!this.subView) {
		return false;
	}
	return UrlHelper.getGround(this.subView);
};
Ground.prototype.getPearl      = function() { return this.pearl; };

// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
Ground.prototype.setFoundation = function(foundation) { this.foundation = foundation; };
Ground.prototype.setLetterFish = function(letterFish) { this.letterFish = letterFish; };
Ground.prototype.setBonus      = function(bonus) { this.bonus = bonus; };
Ground.prototype.setPearl      = function(pearl) { this.pearl = pearl; };

Ground.id = 0;

Ground.WIDTH     = 79;
Ground.HEIGHT    = 121;
Ground.THICKNESS = 42;

Ground.LD_BASE      = 'LD_BASE';		// Case de base
Ground.LD_GAP       = 'LD_GAP';			// Case "saut"
Ground.LD_LOST_LIFE = 'LD_LOST_LIFE';	// Case de terminaison
Ground.LD_X         = 'LD_X';			// Case inexistante
Ground.LD_WALL      = 'LD_WALL';		// Case autorisant la presence de mur
Ground.LD_HOLE      = 'LD_HOLE';

Ground.LdList = [Ground.LD_BASE, Ground.LD_GAP, Ground.LD_LOST_LIFE, Ground.LD_X, Ground.LD_WALL, Ground.LD_HOLE];


exports.Ground = Ground;

})(window.Game = window.Game || {});

/**** game/core/Grid.js ****/
'use strict';
(function(exports){
function Grid(game, ldGrid, backgroundColor)
{
	this.game = game;
	this.backgroundColor = backgroundColor;

	this.nbLine = ldGrid.length;
	this.nbCol  = ldGrid[0].length;

	this.currentTuto = [];

	var margin    = 0;

	this.topMask = - margin - Game.Ground.WIDTH;

	this.map = [];
	this.words = [];

	var top, left, line = null;
	this.startCol     = null;
	this.endCol       = null;
	this.startLine    = null;
	this.endLine = null;
	this.startCol     = null;
	this.existCol     = {};
	this.nbSolidCol   = 0;
	this.nbSolidLine   = 0;
	this.nbLastDrop   = 0;
	this.lettersForce = {};
	this.wordsFish = {};
	this.hasPearl = false;
	this.hasWall = false;
	this.hasHole = false;
	this.hasBomb = false;
	this.hasFishLocked = false;
	this.nbInitFish = 0;

	var pearlsGround = {};
	var hasSpawnPearl = false;
	for(var i = 0; i<ldGrid.length; i++)
	{
		top         = (i * Game.Ground.HEIGHT) + (margin * i) - (i*Game.Ground.THICKNESS);
		line        = ldGrid[i];
		this.map[i] = [];
		for(var j = 0; j<line.length; j++)
		{
			left = (j * Game.Ground.WIDTH) + (margin * j);
			var gr = this.map[i][j] = new Game.Ground(this, line[j], i, j, {
				top: top,
				left: left
			});

			if(gr.hasLetterFish())
			{
				this.nbInitFish++;
			}

			if(gr.hasWall())
			{
				this.hasWall = true;
			}

			if(gr.hasHole())
			{
				this.hasHole = true;
			}

			if(gr.getLetterFish())
			{
				this.hasFishLocked = true;
			}

			if(gr.getBonus() && gr.getBonus().isBomb())
			{
				this.hasBomb = true;;
			}

			if(gr.spawnPearl)
			{
				if(!pearlsGround[gr.spawnPearl.id])
				{
					pearlsGround[gr.spawnPearl.id] = [];
				}
				hasSpawnPearl = true;
				pearlsGround[gr.spawnPearl.id].push(this.map[i][j]);
			}

			if(!this.existCol[j] && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.nbSolidCol++;
				this.existCol[j] = true;
			}

			if(this.startLine == null && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.startLine = i;
			}

			if((this.endLine == null || i > this.endLine) && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.endLine = i
			}

			if(this.startCol == null && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.startCol = j;
			}

			if((this.endCol == null || j>this.endCol) && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.endCol = j;
			}
		}
	}

	this.nbSolidLine = this.endLine - this.startLine + 1;

	// Ajoute des perles en fonction du template
	if(hasSpawnPearl)
	{
		var spawnPearls = this.game.level.getSpawnPearl();

		var myGrindingPearl = this.game.level.getPearls();
		for(var pearlID in pearlsGround)
		{
			var grounds = pearlsGround[pearlID];
			var qty = spawnPearls[pearlID];
			qty -= myGrindingPearl;
			var qtyMax = Math.min(Math.ceil(qty), grounds.length);


			for(var i=0; i<qtyMax; i++)
			{
				var proba = Math.min(qty-i, 1);
				var spawn = (proba < 1) ? (Math.random() <= proba) : true;

				if(spawn)
				{

					var rI = Util.Math2.randomInt(0, grounds.length-1);
					var gr = grounds[rI];

					this.hasPearl = gr;

					gr.dropPearl();

					grounds.splice(rI, 1);

					myGrindingPearl += 1;
				}

			}

		}
	}

};

// Récupère nb meduses aleatoirement
Grid.prototype.killFishes = function(nb)
{
	var fishes = [];

	this.eachGround(function(ground){
		if(ground.hasLetterFish())
		{
			fishes.push(ground.getLetterFish());
		}
	});

	var randFishes = [];
	if(fishes.length > nb)
	{
		for(var i=0; i<nb; i++)
		{
			var index = Util.Math2.randomInt(0, fishes.length-1);
			var fish = fishes[index];

			randFishes.push(fish);
			fish.kill();

			fishes.splice(index, 1);


			if(!fishes.length)
			{
				break;
			}
		}

	}
	else
	{
		randFishes = fishes;

		for(var i in randFishes)
		{
			var fish = randFishes[i];
			fish.kill();
		}

	}




	return randFishes;
};

Grid.prototype.getSortedLetter = function()
{
	var validFishes = {};
	var lettersCount = {};
	var builderWord = '';

	var job = function(fish){
		if(!fish.isAlive()) return;

		var letter = fish.getLetter().toLowerCase();
		if(!validFishes[letter])
		{
			validFishes[letter] = [];
			lettersCount[letter] = 0;
		}
		validFishes[letter].push(fish);

		lettersCount[letter]++;

		builderWord += letter;
	};


	// Récupère tous les ground comprenant un fish
	this.eachGround(function(ground){
		if(ground.hasLetterFish())
		{
			var fish = ground.getLetterFish();
			job(fish);
		}

		var holeFish = ground.getAvailableHoleFish();
		if(holeFish) job(holeFish);

	});

	builderWord =  Util.String2.sort(builderWord);
	builderWord = builderWord.replace(/[^a-zA-Z 0-9]+/g, '');
	return builderWord;

};

// Grid.prototype.findLargerWord = function(minLength, startAt, inverse)
// {

// 	// var fishWords = [
// 	// 	[{f1}, {f2} ..., {fn1}], // Word 1
// 	// 	[{f1}, {f2} ..., {fn2}], // Word n
// 	// ];

// 	var validFishes = {};	// Indexes par leurs lettres
// 	/*validFishes = {
// 		'A': [{f1}, {f2}],
// 		'B': ...
// 	}*/

// 	var lettersCount = {};
// 	var builderWord = '';

// 	var job = function(fish){
// 		if(!fish.isAlive())
// 		{
// 			return;
// 		}
// 		var letter = fish.getLetter().toLowerCase();
// 		if(!validFishes[letter])
// 		{
// 			validFishes[letter] = [];
// 			lettersCount[letter] = 0;
// 		}
// 		validFishes[letter].push(fish);

// 		lettersCount[letter]++;

// 		builderWord += letter;
// 	};


// 	// Récupère tous les ground comprenant un fish
// 	this.eachGround(function(ground){
// 		if(ground.hasLetterFish())
// 		{
// 			var fish = ground.getLetterFish();
// 			job(fish);
// 		}

// 		var holeFish = ground.getAvailableHoleFish();
// 		if(holeFish)
// 		{
// 			job(holeFish);
// 		}
// 	});

// 	// console.log('builderWord', builderWord);
// 	if(builderWord.length < minLength)
// 	{
// 		// return fishWords;
// 		return [];
// 	}

// 	var fishWords = [];

// 	var tmp =  StringHelper.sort(builderWord);
// 	tmp = tmp.replace(/[^a-zA-Z 0-9]+/g, '');
// 	var rawBuilder = builderWord = tmp;
// 	// Essaye de generer le plus grand mot possible

// 	var word = null;

// 	for(var i=0; i<rawBuilder.length; i++)
// 	{
// 		var builderWord = rawBuilder.substr(i, rawBuilder.length);
// 		var startAt = 0;
// 		var currentLength = builderWord.length;
// 		do
// 		{
// 			var s = builderWord.substr(startAt, currentLength);

// 			// Recherche la section du dico correspondante
// 			if(dictionary[s.length]
// 				&& dictionary[s.length][s]
// 				&& (!word || word.length < s.length)
// 			) {
// 				var section = dictionary[s.length][s];
// 				word = section[rand(0, section.length-1)];
// 			}

// 			currentLength--;
// 		} while(currentLength >= minLength);
// 	}

// 	if(!startAt)
// 	{
// 		var startAt = (builderWord.length < 10) ? builderWord.length : 10;
// 	}

// /*	if(inverse)
// 	{
// 		startAt = minLength;
// 	}
// */
// 	outer_loop:
// 	for(var i = startAt; ((!inverse && i>=minLength) || (inverse && i<=10)) ; (!inverse) ? i-- : i++)
// 	{
// 		var currentSection = dictionary[i];

// 		for(var sortedWord in currentSection)
// 		{
// 			var myLettersCount = {};
// 			var allow = false;
// 			for(var j=0; j<sortedWord.length; j++)
// 			{
// 				var searchLetter = sortedWord[j];
// 				allow = true;
// 				if(!lettersCount[searchLetter]) // Le mot ne peut etre formé a partir de notre letter count
// 				{
// 					allow = false;
// 					break;
// 				}

// 				if(!myLettersCount[searchLetter])
// 				{
// 					myLettersCount[searchLetter] = 0;
// 				}

// 				myLettersCount[searchLetter]++;

// 				if(myLettersCount[searchLetter] > lettersCount[searchLetter])
// 				{
// 					allow = false;
// 					break;
// 				}

// 			}

// 			if(allow)
// 			{
// 				word = currentSection[sortedWord][rand(0, currentSection[sortedWord].length-1)];
// 				break outer_loop;
// 			}

// 		}

// 	}


// 	if(!word)
// 	{
// 		return [];
// 	}


// 	for(var i in word)
// 	{
// 		var letter = word[i];
// 		fishWords.push(validFishes[letter][0]);
// 		validFishes[letter].splice(0, 1);
// 	}

// 	return fishWords;

// }

/*Grid.prototype.findWords = function(nb, minLength, maxLength)
{
	// var fishWords = [
	// 	[{f1}, {f2} ..., {fn1}], // Word 1
	// 	[{f1}, {f2} ..., {fn2}], // Word n
	// ];
	var fishWords = [];
	// Recherche par la fin
	for(var line=this.endLine; line>=0; line--)
	{
		for(var col=this.endCol; col>=0; col--)
		{

			for(var key in MYGame.DIRS)
			{
				var dir = MYGame.DIRS[key];
				var buildingWord = '';
				var fishes = [];
				this.throughDir(dir, line, col, maxLength, function(ground, checkLine, checkCol){
					if(ground.hasLetterFish())
					{
						var fish = ground.getLetterFish();
						buildingWord += fish.getLetter();
					}


					loopLength++;
				});
			}

		}
	}

	return fishWords;

}*/

Grid.prototype.injectWord = function(dir, word, lineStart, colStart)
{
	var cursor = 0;

	var overrideString = '';
	var allow = true;
	var self = this;
	var validLetters = {};
	var fishes = [];
	this.throughDir(dir, lineStart, colStart, word.length, function(ground, line, col){
		var id = line+'_'+col;
		var upperLetter = word[cursor].toUpperCase();
		if(self.lettersForce[id] && self.lettersForce[id] != upperLetter)
		{
			allow = false;
			overrideString += self.lettersForce[id].toLowerCase();	// La lettre actuelle ne peut pas etre modifiée
		}
		else
		{
			// overrideString += '?'; // La lettre courante peut etre modifie
			overrideString += LetterFish.JOKER; // La lettre courante peut etre modifie
			ground.getLetterFish().setLetter(upperLetter);
			fishes.push(ground.getLetterFish());
			validLetters[id] = upperLetter;
		}

		cursor++;
	});


	if(!allow)
	{
		return overrideString;
	}

	for(var i in validLetters)
	{
		this.lettersForce[i] = validLetters[i];
	}

	// Finalement le mot est gardé en mémoire.
	this.words.push(word);
	this.wordsFish[word] = fishes;

	return true;

};

Grid.prototype.throughDir = function(dir, line, col, length, cb)
{
	for(var i=0; i<length; i++)
	{
		if(!this.map[line] || !this.map[line][col])
		{
			return;
		}

		cb(this.map[line][col], line, col);

		switch(dir)
		{

			case MYGame.DIR_NE:
				line--;
				col++;
				break;

			case MYGame.DIR_NW:
				line--;
				col--;
				break;

			case MYGame.DIR_SE:
				line++;
				col++;
				break;

			case MYGame.DIR_SW:
				line++;
				col--;
				break;

			case MYGame.DIR_E:
				col++;
				break;

			case MYGame.DIR_W:
				col--;
				break;

			case MYGame.DIR_S:
				line++;
				break;

			case MYGame.DIR_N:
				line--;
				break;
		}


	}


};

Grid.prototype.fishesByLetter = function()
{
	var mapLetter = {};
	var addFish = function(f)
	{
		if(f.getLetter() == Game.LetterFish.JOKER) return;


		if(!mapLetter[f.getLetter()])
		{
			mapLetter[f.getLetter()] = [];
		}

		mapLetter[f.getLetter()].push(f);
	}
	this.eachGround(function(ground){

		if(ground.hasLetterFish())
		{
			addFish(ground.getLetterFish());
		}

		if(ground.getHole() && ground.getHole().getLetterFish())
		{
			addFish(ground.getHole().getLetterFish());
		}


	});

	return mapLetter;
};


/**
* Deplacement et ajout de poisson
*/

Grid.prototype.drop = function(freshFishs, dir, includeWords)
{
	this.currentTuto = [];

	// Enregistre toutes les translations effectués
	var translate = [];
	var lettersMap = {};

	// --------------------------------------------------------------
	// Deplacement
	// --------------------------------------------------------------

	var last, freeSlot, prevGround, ground, toPosition;
	for(var col=0; col<this.nbCol; col++)
	{
		// On parcours en commencant par le bas de la grille pour
		// recuperer la derniere position libre

		last = true; 	// La derniere case a la meme valeur que Ground.LD_LOST_LIFE
		freeSlot = -1;
		for(var line=(this.nbLine-1); line>=0; line--)
		{
			toPosition = null;
			ground = this.map[line][col];
			if(!ground.isSolid())
			{
				continue;
			}

			var fish = (ground.hasLetterFish()) ? ground.getLetterFish() : null;
			// if(fish)
			if(fish && fish.isAlive())
			{
				lettersMap[fish.getLetter()] = true;
			}

			// if(ground.getHole() && ground.getHole().getLetterFish())
			if(ground.getHole() && ground.getHole().getLetterFish()  && ground.getHole().getLetterFish().isAlive())
			{
				lettersMap[ground.getHole().getLetterFish().getLetter()] = true;
			}


			var fishId       = (fish) ? fish.getId() : null;
			var prevGround   = null;
			var destroyBonus = false;
			var destroyPearl = false;
			var updateWallOnGround = null;
			var jump = false;

			// Deplacement

			// if(fish && !fish.isInHole())
			if(fish && !fish.isInHole() && fish.isAlive())
			{
				if(this.game.getLevel().getMode().needFullGrid())
				{
					fish.hp = 0;
					ground.setLetterFish(null); // Sort le poisson du jeu
					toPosition = {top: this.height, left: ground.getLeft()};
				}
				else if(freeSlot != -1) // Deplacement autorise
				{
					if(!ground.hasWall())
					{
						prevGround      = this.map[freeSlot][col];
						var oldHasBonus = prevGround.hasBonus();
						var oldHasPearl = prevGround.hasPearl();
						if(ground.sendFishTo(prevGround)) // Le sol courant envoit son poisson au sol du dessous
						{
							toPosition   = prevGround.getPosition();
							destroyBonus = oldHasBonus && !prevGround.hasBonus();
							destroyPearl = oldHasPearl && !prevGround.hasPearl();
							jump = (prevGround.getLine() - ground.getLine() > 1);
						}
					}
					else
					{
						updateWallOnGround = ground.attackWall();
					}

				}
				else if(last)
				{

					if(!ground.hasWall())
					{
						// fish.moveTo(ground);
						ground.setLetterFish(null); // Sort le poisson du jeu
						toPosition = {top: this.height, left: ground.getLeft()};
					}
					else
					{
						updateWallOnGround = ground.attackWall();
					}


				}
			}

			last = false;

			// if(ground.hasLetterFish()))
			if(ground.hasLetterFish() && ground.getLetterFish().isAlive())
			{
				freeSlot = -1;	// Le slot n'est pas libre
			}
			else
			{
				freeSlot = line;	// Libere le slot
			}


			if(toPosition)
			{
				translate.push({
					position: toPosition,
					fish: fish,
					groundRececeiver: prevGround,
					ground: ground,
					destroyBonus: destroyBonus,
					destroyPearl: destroyPearl,
					updateWallOnGround: updateWallOnGround,
					jump: jump
				});
			}
			else if(updateWallOnGround)
			{
				translate.push({
					updateWallOnGround: updateWallOnGround
				});
			}

		}
	}

	// --------------------------------------------------------------
	// Ajoute la pioche a notre grille
	// --------------------------------------------------------------

	this.nbLastDrop = 0;
	if(freshFishs)
	{
		var freshFills = [];
		var freshFish = null, lFish = null, ground = null;
		for(var i in freshFishs)
		{
			freshFish = freshFishs[i];

			for(var col=0; col<this.nbCol; col++)
			{
				lFish = freshFish[col];

				if(!lFish)
				{
					continue;
				}

				var line = (dir == 1) ? 0 : this.nbLine-2;

				var cond = false;
				var isCompatible = true;

				var oldGround = null;
				do
				{

					ground = this.map[line][col];
					line += dir;

					cond = (!ground.isSolid());
					if(dir == -1 && !cond)
					{
						// cond = (ground.hasLetterFish());
						cond = (ground.hasLetterFish() && ground.getLetterFish().isAlive());
					}

				} while	(cond  && this.map[line]);

				var oldHasBonus = ground.hasBonus();
				var oldHasPearl = ground.hasPearl();

				var isFree = (!ground.hasLetterFish() || !ground.getLetterFish().isAlive());
				// if(ground && ground.isSolid() && !ground.hasLetterFish())
				if(ground && ground.isSolid() && isFree)
				{
					this.nbLastDrop++;

					ground.receiveFish(lFish);
					freshFills.push(ground);

					lettersMap[lFish.getLetter()] = true;

					var destroyBonus = oldHasBonus && !ground.hasBonus();
					var destroyPearl = oldHasPearl && !ground.hasPearl();

					var pos = ground.getPosition();
					pos.top = this.topMask;


					translate.push({
						position: pos,
						fish: lFish,
						groundRececeiver: ground,
						ground:ground,
						destroyBonus: destroyBonus,
						destroyPearl: destroyPearl,
						jump: true
					});
				}

			}

		}

		// --------------------------------------------------------------
		// Gestion des mots a inclure dans la vague
		// --------------------------------------------------------------
		this._includeWords(freshFills, includeWords, lettersMap);

	}


	return translate;
};


Grid.prototype._includeWords = function(freshFills, includeWords, lettersMap)
{
	if(!includeWords)
	{
		return;
	}

	if(includeWords.word)
	{
		this._includeWord(freshFills, includeWords);
	}

	if(includeWords.wordHanged)
	{
		this._includeWordHanged(freshFills, includeWords);
	}

	if(includeWords.words)
	{
		this._includeMapWords(freshFills, includeWords);
	}

	if(includeWords.letters)
	{
		this._includeLettersWords(freshFills, includeWords);
	}

	if(includeWords.forceLetter)
	{
		this._includeForceLetter(freshFills, includeWords, lettersMap);
	}

	if(includeWords.forceOneLetter)
	{
		this._includeForceOneLetter(freshFills, includeWords, lettersMap);
	}
};


Grid.prototype._includeWordHanged = function(freshFills, includeWords)
{
	var fishesByLetter = this.fishesByLetter();
	var lettersToDisplay = {};
	includeWords.wordHanged.split('').forEach(function(letter){
		if(!lettersToDisplay[letter]) lettersToDisplay[letter] = 1;
		else lettersToDisplay[letter]++;
	});
	for(var letter in lettersToDisplay) {
		var nb = lettersToDisplay[letter];

		if(typeof fishesByLetter[letter] != "undefined" && fishesByLetter[letter].length >= nb ) continue;

		;
		var nbLetterNeed = nb - fishesByLetter[letter].length;
		for(var i=0; i<nbLetterNeed; i++) {
			// Transforme des lettres
			for(var letterDist in fishesByLetter){
				var tab = fishesByLetter[letterDist];

				if(tab.length <= 1) continue;

				var fish = tab.shift();
				fish.setLetter(letter);

			}

		}

	}

	var fm = {};
	var letters = this.fishesByLetter();
	for(var l in letters) {
		fm[l] = letters[l].length;
	}
	// console.log('fm', fm);
};

Grid.prototype._includeWord = function(freshFills, includeWords)
{
	var word = includeWords.word;
	if(freshFills.length < word.length)
	{
		return false;
	}


	var freshCopy = freshFills.slice(0);
// console.log('freshCopy', freshCopy);
	if(includeWords.noRand)
	{
		freshCopy.sort(function(o1, o2){
			if (o1.id > o2.id) return 1;
			if (o1.id < o2.id) return -1;

			return 0;
		});

		var startMax = freshCopy.length - includeWords.word.length;
		var noRandAt = Util.Math2.randomInt(0, startMax-1);
	}


	outer_loop:
	for(var i in word)
	{
		var letter = word[i];

		do
		{
			if(includeWords.noRand)
			{
				var randGroundIndex = noRandAt++;

			}
			else
			{
				var randGroundIndex = Util.Math2.randomInt(0, freshCopy.length-1);
			}

			var randGround = freshCopy[randGroundIndex];
			var recipient = randGround;
			if(!randGround.getLetterFish())
			{
				recipient = randGround.getHole();
			}
			recipient.getLetterFish().setLetter(letter.toUpperCase());

			if(includeWords.tuto)
			{
				this.currentTuto.push(recipient.getLetterFish());
			}

			if(!includeWords.noRand)
			{
				freshCopy.splice(randGroundIndex, 1);
			}

			if(!freshCopy.length)
			{
				break outer_loop;
			}

		} while( (!recipient || !recipient.getLetterFish()) )
	}

};

Grid.prototype._includeForceLetter = function(freshFills, includeWords, lettersMap)
{
	var forceLetter = includeWords.forceLetter.toUpperCase();
	if(!freshFills.length || lettersMap[forceLetter])
	{
		return false;
	}

	var groundFocus = freshFills[Util.Math2.randomInt(0, freshFills.length-1)];

	var fish = groundFocus.getLetterFish() || groundFocus.getHole().getLetterFish();
	fish.setLetter(forceLetter);
	return forceLetter;
};

Grid.prototype._includeForceOneLetter = function(freshFills, includeWords, lettersMap)
{
	if(!freshFills.length){
		return;
	}

	var map = includeWords.forceOneLetter;
	if(!map.length)
	{
		return;
	}

	do
	{
		var randIndex = Util.Math2.randomInt(0, map.length-1);
		var letter = map[randIndex];
		var hasBeenInsert = this._includeForceLetter(freshFills, {
			forceLetter: letter
		}, lettersMap);

		map.splice(randIndex, 1);
	} while(map.length && !hasBeenInsert);
};

Grid.prototype._includeLettersWords = function(freshFills, includeWords)
{
	if(!freshFills.length){
		return;
	}
	var generatedWords = {};

	var wordMinLength = 3;
	var wordMaxLength = 5;
	var nbGrounds     = freshFills.length;
	// console.log('nbGrounds', nbGrounds);
	var nbLettersMax  = Math.min(includeWords.letters, nbGrounds);

	// console.log('nbLettersMax', nbLettersMax);
	var nbWordsMax = ~~(nbLettersMax/wordMinLength); // le nombre de mots maximum que l'on peut générer
	var nbWordsMin = ~~(nbLettersMax/wordMaxLength); // le nombre de mots minimum que l'on peut générer

	var nbWords = Util.Math2.randomInt(nbWordsMin, nbWordsMax); // genere un nombre de mots aléatoires
	// console.log('nbWords', nbWords);
	var todo = [];
	var nbLettersUsed = 0;
	var validIndexes = [];
	for(var i=0; i<nbWords; i++)
	{
		todo.push(wordMinLength);
		validIndexes.push(i);
		nbLettersUsed += wordMinLength;
	}

	// console.log('start todo', todo);

	// Ajuste le tableau pour contenir les nbLettersMax lettres souhaites
	while(nbLettersUsed < nbLettersMax)
	{
		var randIndex = Util.Math2.randomInt(0, validIndexes.length-1);
		var val = todo[validIndexes[randIndex]];
		var addLetter = Util.Math2.randomInt(1, wordMaxLength-val);

		todo[validIndexes[randIndex]] += addLetter;
		nbLettersUsed += addLetter;
		if(todo[validIndexes[randIndex]] >= wordMaxLength)
		{
			validIndexes.splice(randIndex, 1);
		}

	}

	var freshCopy = freshFills.slice(0);

	// console.log('end todo', todo);
	// Le tableau est maintenant bon; il nous reste plus qu'a générer les mots à partir de ce dernier

	for(var i=0; i<todo.length; i++)
	{
		var wordLength = todo[i];
		var index       = Util.Math2.randomInt(0, AroundTheWords.tabDictionary[wordLength].length-1);
		var randWord   = AroundTheWords.tabDictionary[wordLength][index];
		// console.log('randWord', randWord);

		var s = '';
		// Affecte chaque lettre du mot à un freshground
		for(var j=0; j<randWord.length; j++)
		{
			var randGroundIndex = Util.Math2.randomInt(0, freshCopy.length-1);
			var randGround = freshCopy[randGroundIndex];

			var letter = randWord[j];

			/*
TypeError: randGround is undefined
randGround.getLetterFish().setLetter(letter.toUpperCase());
			*/
			if(randGround.getLetterFish())
			{
				randGround.getLetterFish().setLetter(letter.toUpperCase());
			}
			else
			{
				randGround.getHole().getLetterFish().setLetter(letter.toUpperCase());
			}


			freshCopy.splice(randGroundIndex, 1);

			s += randGround.getLine() + '-' + randGround.getCol() + ' ';
		}

	}



};


Grid.prototype._includeMapWords = function(freshFills, includeWords)
{
	if(!freshFills.length){
		return;
	}

	var generatedWords = {};

	// Repertorie les sols qui se sont vues attribues une lettre //
	// Ce qui n'empeche pas de creer un mot avec cette derniere //

	var groundData = {};

	for(var i=0; i<includeWords.words; i++)
	{
		var nbTest = 0;
		do
		{
			// 1 - Choisit un sol aleatoire parmis ceux fraichement remplit
			var index       = Util.Math2.randomInt(0, freshFills.length-1);
			var groundFocus = freshFills[index];
			var line = groundFocus.getLine();
			var col  = groundFocus.getCol();
			// var data = (groundData[line] && groundData[line][col]) ? groundData[line][col] : null;

			if(!groundData[line])
			{
				groundData[line] = {}
			}

			if(!groundData[line][col])
			{
				groundData[line][col] = {
					// dirs: {}
					dirs: MYGame.DIRS.slice(0)
				};
			}

			// A partir de la on peut prendre une direction aleatoire et en definir sa longueur
			// var dir = MYGame.DIRS[rand(0, MYGame.DIRS.length-1)];


			// unallowDir = (data && data.dirs && data.dirs[dir]) ? true : false;
			unallowDir = (!groundData[line][col].dirs.length);

			if(!unallowDir)
			{

				// if(!groundData[line])
				// {
				// 	groundData[line] = {}
				// }

				// if(!groundData[line][col])
				// {
				// 	groundData[line][col] = {
				// 		// dirs: {}
				// 		dirs: MYGame.DIRS.slice(0)
				// 	};
				// }

				// groundData[line][col].dirs[dir] = true;

				var rDirIndex = Util.Math2.randomInt(0, groundData[line][col].dirs.length-1);
				var dir = groundData[line][col].dirs[rDirIndex];
				groundData[line][col].dirs.splice(rDirIndex, 1);


				var dirRange = this.range(dir, groundFocus, true);
				var acceptedRange = includeWords.acceptedRange;
				var wordLength = Util.Math2.randomInt(acceptedRange, dirRange);

				// Seul les mots de plus de 3 lettres sont acceptées

				if(dirRange < acceptedRange || !dictionary[wordLength])
				{
					unallowDir = true; // Continue a boucler gros
				}
				else
				{

					var hasBeenInjected = false;

					// On a plus qu'a trouver un mot de cette longueur
					do
					{
						// <!><!><!> Le mot doit prendre en compte les anciens mots deja placé <!><!><!>
						var dicSection = AroundTheWords.tabDictionary[wordLength];
						var randIndex = Util.Math2.randomInt(0, dicSection.length);
						var word = dicSection[randIndex];
					} while(generatedWords[word] || !word);

					// Wooow notre mot est OK
					// Il nous suffit maintenant de le placer dans la dir donnée //
					var injectedResult = this.injectWord(dir, word, line, col);
					if(injectedResult !== true)
					{

						var acceptedWord = new Word(injectedResult);
						var hasJoker = acceptedWord.hasJoker();
						var jokerResult = acceptedWord.applyJoker();

						if(!jokerResult || !hasJoker || generatedWords[jokerResult] || this.injectWord(dir, acceptedWord.getCurrent(), line, col) !== true)
						{
							unallowDir = true;
							// hasBeenInjected = true;
						}
						else
						{
							generatedWords[acceptedWord.getCurrent()] = true;
							// hasBeenInjected = true;
						}

					}
					else
					{
						generatedWords[word] = true;
						// hasBeenInjected = true;
					}


				}

			}

			if(nbTest > 100)
			{
				this._includeMapWords(freshFills, includeWords);
				return;
			}
			nbTest++;
		} while(unallowDir) // Reproduit le truc si la direction a deja ete utilise


	}
};



Grid.prototype.range = function(dir, ground, include)
{
	// Test.grid.range(Game.DIR_N, Test.grid.map[1][5])


	var line = ground.getLine();
	var col = ground.getCol();

	var range = (include && ground.hasLetterFish()) ? 1 : 0;
	do
	{
		var alive = false;

		switch(dir)
		{

			case MYGame.DIR_NE:
				line--;
				col++;
				break;

			case MYGame.DIR_NW:
				line--;
				col--;
				break;

			case MYGame.DIR_SE:
				line++;
				col++;
				break;

			case MYGame.DIR_SW:
				line++;
				col--;
				break;

			case MYGame.DIR_E:
				col++;
				break;

			case MYGame.DIR_W:
				col--;
				break;

			case MYGame.DIR_S:
				line++;
				break;

			case MYGame.DIR_N:
				line--;
				break;

			default:
				throw new Error('Grid::range ' + dir + ' not implemented yet');

		}

		if(this.map[line] && this.map[line][col] && this.map[line][col].hasLetterFish())
		{
			range++;
			alive = true;
		}

	} while(alive);




	return range;
};



/**
*	Ajoute un joker sur un de nos poissons
*/
Grid.prototype.addJoker = function()
{
	var self = this;

	// --------------------------------------------------------------
	// On commence par recuperer notre liste de poisson sans bonus
	// --------------------------------------------------------------
	var mapFish = [];
	this.eachGround(function(ground){

		if(ground.hasLetterFish()
			&& !ground.getLetterFish().hasBonus()
			&& !ground.getLetterFish().isJoker()
			&& !ground.getLetterFish().isDouble()
		) {
			mapFish.push(ground.getLetterFish());
		}

		if(ground.getHole()
			&& ground.getHole().getLetterFish()
			&& !ground.getHole().getLetterFish().hasBonus()
			&& !ground.getHole().getLetterFish().isJoker()
			&& !ground.getHole().getLetterFish().isDouble()
		) {
			mapFish.push(ground.getHole().getLetterFish());
		}

	});



	if(!mapFish.length)
	{
		return null;
	}

	// --------------------------------------------------------------
	// Tire un poisson aleatoire et ajoute un bonus joker
	// --------------------------------------------------------------
	var randI = Util.Math2.randomInt(0, mapFish.length - 1);
	var fish = mapFish[randI];
	// fish.activeBonus(Grid.BONUS_JOKER);
	fish.activeBonus(
		new Model.Bonus({
			id: Util.Bonus.findByKey(Game.Grid.BONUS_JOKER).id
		})

	);


	return fish;
};


Grid.prototype.addDouble = function()
{
	var self = this;

	// --------------------------------------------------------------
	// On commence par recuperer notre liste de poisson sans bonus
	// --------------------------------------------------------------
	var mapFish = [];
	this.eachGround(function(ground){

		if(ground.hasLetterFish()
			&& !ground.getLetterFish().hasBonus()
			&& !ground.getLetterFish().isJoker()
			&& !ground.getLetterFish().isDouble()
		) {
			mapFish.push(ground.getLetterFish());
		}

		if(ground.getHole()
			&& ground.getHole().getLetterFish()
			&& !ground.getHole().getLetterFish().hasBonus()
			&& !ground.getHole().getLetterFish().isJoker()
			&& !ground.getHole().getLetterFish().isDouble()
		) {
			mapFish.push(ground.getHole().getLetterFish());
		}

	});



	if(!mapFish.length)
	{
		return null;
	}

	// --------------------------------------------------------------
	// Tire un poisson aleatoire et ajoute un bonus joker
	// --------------------------------------------------------------
	var randI = Util.Math2.randomInt(0, mapFish.length - 1);
	var fish = mapFish[randI];
	// fish.activeBonus(Grid.BONUS_JOKER);
	fish.activeBonus(
		new Model.Bonus({
			id: Util.Bonus.findByKey(Game.Grid.BONUS_DOUBLE).id
		})

	);


	return fish;
};


/**
* Ajoute une bombe sur le terrain
*/
Grid.prototype.addBomb = function()
{
	var self = this;
	var mapGround = [];

	this.eachGround(function(ground){
		if(!ground.isSolid() || ground.isLDLostLife())
		{
			return;
		}

		// Une bombe ne peut etre pose sur une meduse ou un sol remplit
		// if(!ground.hasBonus() && (!ground.hasLetterFish() || !ground.getLetterFish().hasBonus()))
		if(!ground.hasBonus()
			&& !ground.hasPearl()
			&& (!ground.hasLetterFish() || !ground.getLetterFish().hasBonus())
			&& (!ground.hasLetterFish() || !ground.getLetterFish().hasPearl()))
		{
			mapGround.push(ground);
		}
	});


	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	// ground.addBonus(Grid.BONUS_BOMB);
	ground.addBonus(new Bonus({
			id: ConfigBonusHelper.findByKey(Grid.BONUS_BOMB).id
		})
	);

	return ground;


};

/**
* Explose tous les poissons autour du point donné
*/
Grid.prototype.explode = function(line, col)
{
	var pattern = [
		// Haut
		{line: line-1, col: col-1},
		{line: line-1, col: col},
		{line: line-1, col: col+1},

		// Centre
		{line: line, col: col-1},
		{line: line, col: col},
		{line: line, col: col+1},

		// Bas
		{line: line+1, col: col-1},
		{line: line+1, col: col},
		{line: line+1, col: col+1}
	];


	var result = [];
	var o, ground;
	for(var i in pattern)
	{
		o = pattern[i];
		if(this.map[o.line] && this.map[o.line][o.col])
		{
			var ground = this.map[o.line][o.col];
			var fishId = null;
			if(ground.hasLetterFish())
			{
				fishId = ground.getLetterFish().getId();
			}
			ground = this.map[o.line][o.col];
			ground.setLetterFish(null);
			result.push({
				ground: ground,
				fishId: fishId
			});
		}
	}

	return result;

};

/**
* Change toutes les lettres des poissons
*/
Grid.prototype.addSwap = function()
{
	var result = [];
	this.eachGround(function(ground){
		if(ground.hasLetterFish()) {
			var fish = ground.getLetterFish();
			var isAllow = fish.randLetter();
			if(isAllow)
			{
				result.push(fish);
			}
		}
	});

	return result;
}

/**
*	Ajoute un mur sur la grille
*/
Grid.prototype.addWall = function()
{
	var mapGround = [];
	this.eachGround(function(ground){
		if(!ground.hasPearl() && !ground.hasBonus() && ground.isWallAccept())
		{
			mapGround.push(ground);
		}
	});

	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	ground.addBonus(Grid.BONUS_WALL);
	ground.createWall();

	return ground;
};

Grid.prototype.hasJoker = function()
{
	for(var i=0; i<this.nbLine; i++) {
		for(var j=0; j<this.nbCol; j++) {
			if(this.map[i][j].hasLetterFish()
				&& this.map[i][j].getLetterFish().isJoker()
			) {
				return true;
			}
		}
	}

	return false;
};

/**
*	Ajoute
*/
Grid.prototype.addHole = function()
{
	var mapGround = [];
	this.eachGround(function(ground){
		if(!ground.isSolid())
		{
			return;
		}

		// Le trou ne peut atterir sur un mur
		if(!ground.isLDWall() && !ground.hasHole())
		{
			mapGround.push(ground);
		}
	});

	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	ground.addHole();

	return ground;
};

/**
*	Parcours les pavets de notre grille
*/
Grid.prototype.eachGround = function(callback)
{
	if(!callback)
	{
		throw new Error("Grid::eachGround a besoin d\'un callback");
	}

	for(var i=0; i<this.nbLine; i++) {
		for(var j=0; j<this.nbCol; j++) {
			callback(this.map[i][j]);
		}
	}
};

Grid.prototype.eachFish = function(callback)
{
	this.eachGround(function(ground){
		var fishesLeft = [];
		if(ground.getLetterFish())
		{
			callback(ground.getLetterFish());
		}

		if(ground.getHole() && ground.getHole().getLetterFish())
		{
			callback(ground.getHole().getLetterFish());
		}

	});
};

Grid.generateHeap = function(grid){
	var heapLine = [];
	var allowedCol = [];

	if(!grid.game.getLevel().getMode().isHanged())
	// if(true)
	{
		for(var j=0; j<grid.getNbCol(); j++)
		{
			if(grid.hasCol(j))
			{
				allowedCol.push(j);
			}

			heapLine.push(null);
		}
	}
	else
	{
		if(typeof Model.LetterDropTemplate.dropAt == "undefined" || Model.LetterDropTemplate.dropAt == null || Model.LetterDropTemplate.dropAt < grid.startLine)
		{
			Model.LetterDropTemplate.dropAt = grid.endLine;
		}

		var useLine = grid.map[Model.LetterDropTemplate.dropAt];
		for(var j=0; j<useLine.length; j++)
		{
			if(useLine[j].isSolid() && !useLine[j].isLDLostLife())
			{
				allowedCol.push(j);
			}

			heapLine.push(null);
		}

		Model.LetterDropTemplate.dropAt--;
	}


	return {
		allowedCol: allowedCol,
		heapLine: heapLine
	}
};

Grid.generateHeapLetter = function(grid, difficulty, toGenerate, suchAs)
{
	var heap = Grid.generateHeap(grid);

	for(var nbGenerate=0;nbGenerate<toGenerate;nbGenerate++)
	{
		if(!heap.allowedCol.length)
		{
			break;
		}

		// Récupère une colonne valide
		if(!suchAs)
		{
			var atIndex = Util.Math2.randomInt(0, heap.allowedCol.length-1);
		}
		else
		{
			var atIndex = 0;
		}

		var atCol = heap.allowedCol[atIndex];
		heap.allowedCol.splice(atIndex, 1);

		if(difficulty.letter)
		{
			heap.heapLine[atCol] = difficulty.letter();
		}
		else
		{
			if(!suchAs)
			{
				var rI = Util.Math2.randomInt(0, difficulty.length-1);
				var letter = difficulty.splice(rI, 1);
				letter = letter[0];
			}
			else
			{
				var letter = difficulty.splice(0, 1);
				letter = letter[0];
			}
			heap.heapLine[atCol] = letter;
		}

	}


	return heap.heapLine;

};

Grid.generateWord = function(grid, difficulty, suchAs)
{
	var heapLetter = Grid.generateHeapLetter(grid, difficulty, difficulty.length, suchAs);
	var freshFish = {
		res: [],
		length: 0
	};
	var length = 0;
	var fishesInLine = [];
	var fishes = [];
	for(var i in heapLetter)
	{
		if(heapLetter[i])
		{
			// fishes.push(LetterFish.create(heapLetter[i], game));
			fishes.push(Game.LetterFish.create(heapLetter[i], grid.game.getLevel().getDifficultyTpl()));
			length++;
		}
		else
		{
			fishes.push(null);
		}
	}
	fishesInLine.push(fishes);

	freshFish.res = fishesInLine;
	freshFish.length = length;
	return freshFish;
};


Grid.prototype.hasCol           = function(col) { return this.existCol[col]; };
Grid.prototype.getMap           = function(){ return this.map; };
// Grid.prototype.getWidth         = function() { return this.width; },
// Grid.prototype.getHeight        = function() { return this.height; },
Grid.prototype.getGround        = function(line, col) { return this.map[line][col]; };
Grid.prototype.getNbCol         = function() { return this.nbCol; };
Grid.prototype.getNbLine        = function() { return this.nbLine; };
// Grid.prototype.getBackgroundUrl = function() { return UrlHelper.getBackground(this.backgroundId); }
Grid.prototype.getBackgroundColor = function() { return this.backgroundColor; };
Grid.prototype.getNbSolidCol    = function() { return this.nbSolidCol; };
Grid.prototype.getNbSolidLine    = function() { return this.nbSolidLine; };
Grid.prototype.getStartCol      = function() { return this.startCol; };
Grid.prototype.getEndCol        = function() { return this.endCol; };
Grid.prototype.getStartLine     = function() { return this.startLine; };
Grid.prototype.getEndLine       = function() { return this.endLine; };
Grid.prototype.getWords         = function() { return this.words; };
Grid.prototype.getNbLastDrop    = function() { return this.nbLastDrop; };

Grid.BONUS_JOKER  = 'BONUS_JOKER';
Grid.BONUS_BOMB   = 'BONUS_BOMB';
Grid.BONUS_FREEZE = 'BONUS_FREEZE';
Grid.BONUS_HOLE   = 'BONUS_HOLE';
Grid.BONUS_HELP   = 'BONUS_HELP';
Grid.BONUS_BONUS  = 'BONUS_BONUS';
Grid.BONUS_SWAP   = 'BONUS_SWAP';
Grid.BONUS_WALL   = 'BONUS_WALL';
Grid.BONUS_LIFE   = 'BONUS_LIFE';
Grid.BONUS_DOUBLE   = 'BONUS_DOUBLE';

Grid.BonusList = [Grid.BONUS_JOKER, Grid.BONUS_BOMB, Grid.BONUS_HOLE, Grid.BONUS_HELP, Grid.BONUS_BONUS, Grid.BONUS_SWAP, Grid.BONUS_FREEZE, Grid.BONUS_WALL, Grid.BONUS_LIFE, Grid.BONUS_DOUBLE];
Grid.BonusWord = {};

exports.Grid = Grid;

})(window.Game = window.Game || {});

/**** game/core/Hole.js ****/
'use strict';

(function(exports){

function Hole(ground)
{
	this.ground     = ground;
	this.letterFish = null;
};

Hole.prototype.suck = function()
{
	if(!this.isFull())	// Garde une meduse
	{
		if(this.ground.getLetterFish() && this.ground.getLetterFish().isAlive())
		{
			this.letterFish = this.ground.getLetterFish();		// Le trou recupere le poisson du ground
			this.letterFish.setHole(this);
			this.ground.setLetterFish(null);					// Tandis que le ground perd son poisson

		}

	}

};

Hole.prototype.free = function()
{
	this.letterFish = null;
	return this;
};

Hole.prototype.isFull        = function() { return this.getLetterFish(); };
Hole.prototype.getLetterFish = function() { return this.letterFish; };
Hole.prototype.getGround     = function() { return this.ground; };


exports.Hole = Hole;

})(window.Game = window.Game || {});

/**** game/core/LetterFish.js ****/
'use strict';
(function(exports){

function LetterFish(letter, difficulty)
{
	this.id         = LetterFish.id++;
	this.index      = 0;
	this.oldLetter = this.letter = letter;
	this.xM2 = (this.letter.indexOf(LetterFish.DOUBLE) != -1);
	if(this.xM2)
	{
		this.letter = this.letter[0];
	}
	if(this.letter == LetterFish.DOUBLE)
	{
		// this.letter = CharHelper.rand();
		this.letter = difficulty.letter();
		if(this.letter.indexOf(LetterFish.DOUBLE) != -1){
			this.letter = this.letter.slice(1);
		}
	}

	this.bonus      = null;
	this.hp         = 1;
	this.ground     = null;
	this.eat        = false;
	this.hole     = null;
	this.pearl      = null;
	this.stomach    = null;
	this.validate   = false;
	this.hasBeenKill = false;
	this.grey = false;
	this.ghost = false;

	this._createScore();
};



LetterFish.prototype._createScore = function()
{
	this.score = Game.Char.getWeight(this.letter);
};



LetterFish.prototype.isJoker = function()
{
	return (this.letter == LetterFish.JOKER);
};

/**
*  Remplace la lettre courante par une lettre aleatoire
*/
LetterFish.prototype.randLetter = function()
{
	if(this.letter == LetterFish.JOKER)
	{
		return false;
	}

	this.letter = Game.Char.rand();
	this._createScore();
	return true;
};

/**
* Ingurgite ce qui se trouve sur le sol au moment de se deplacer
*/
LetterFish.prototype.moveTo = function(ground)
{
	this.ground = ground;

	if(this.ground)
	{
		this.index = this.ground.getIndex();

		switch(this.ground.getFoundation())
		{
			case Game.Ground.LD_BASE:
			case Game.Ground.LD_GAP:
			case Game.Ground.LD_X:
				break;

			case Game.Ground.LD_LOST_LIFE:
				this.hp -= 1;
				this.hp = Math.max(0, this.hp);
				break;

		}
	}

	this.giveFood();
};

LetterFish.prototype.giveFood = function()
{
	this.eat = false;
	this.stomach = null;

	if(!this.ground)
	{
		return;
	}

	if(this.ground.hasBonus())
	{
		this.pearl = null;	// L'ancienne perle est perdue
		this.bonus = this.ground.getBonus();

		this.ground.setBonus(null);
		this.eat = true;

		this.activeBonus();
	}
	else if(this.ground.hasPearl())
	{
		this.bonus = null;	// L'ancien bonus est perdu
		this.pearl = this.ground.getPearl();

		this.ground.setPearl(null);
		this.eat = true;
	}
};

LetterFish.prototype.isFat = function(){ return (this.bonus || this.pearl); };

LetterFish.prototype.activeBonus = function(bonus)
{
	if(bonus)
	{
		this.bonus = bonus;
	}

	if(!this.bonus)
	{
		return;
	}

	switch(this.bonus.getKey())
	{
		case Game.Grid.BONUS_JOKER:
			this.oldLetter = this.letter;
			this.letter = LetterFish.JOKER;
			break;

		case Game.Grid.BONUS_DOUBLE:
			// this.oldLetter = this.letter;
			// this.letter = this.letter + LetterFish.DOUBLE;
			this.xM2 = true;
			break;

		case Game.Grid.BONUS_BOMB:
		case Game.Grid.BONUS_HOLE:
		case Game.Grid.BONUS_HELP:
		case Game.Grid.BONUS_BONUS:
		case Game.Grid.BONUS_SWAP:
			break;
	}
};

LetterFish.prototype.kill = function()
{
	if(this.hasBeenKill)
	{
		return;
	}

	this.hasBeenKill = true;
	this.hp = 0;


	if(this.hole)
	{
		this.hole.free();
	}
	else if(this.ground && this.ground.getLetterFish() && this.ground.getLetterFish().isEqualTo(this))
	{
		this.ground.setLetterFish(null);
	}

	if(this.onKill)
	{
		this.onKill(this);
	}
};

LetterFish.prototype.resetStatus = function()
{
	this.grey        = false;
	this.ghost       = false;
	this.validate    = false;
	this.hasBeenKill = false;
};


LetterFish.prototype.isEqualTo = function(fish) { return this.id == fish.getId(); };

LetterFish.prototype.isAlive  = function() { return this.hp > 0 };
LetterFish.prototype.isInHole = function() { return this.hole; };
LetterFish.prototype.hasEat   = function() { return this.eat; };
LetterFish.prototype.hasBonus = function() { return this.bonus; };
LetterFish.prototype.hasPearl = function() { return this.pearl; };
// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
LetterFish.prototype.getHole = function() { return this.hole; };
LetterFish.prototype.getColor   = function() { return this.color; };
LetterFish.prototype.getBonus   = function() { return this.bonus; };
LetterFish.prototype.getLetter  = function() { return this.letter; };
LetterFish.prototype.getId      = function() { return this.id; };
LetterFish.prototype.getGround  = function() { return this.ground; };
LetterFish.prototype.getScore   = function() { return this.score; };
LetterFish.prototype.getWidth   = function() { return this.width; };
LetterFish.prototype.getHeight  = function() { return this.height; };
LetterFish.prototype.getIndex   = function()
{
/*	if(this.isInHole())
	{
		return this.index+1;
	}*/
	return this.index;
}
LetterFish.prototype.getPearl   = function() { return this.pearl; };
LetterFish.prototype.isValidate = function() { return this.validate; };
LetterFish.prototype.getCharCode = function() {
	return this.letter.toLowerCase().charCodeAt(0);
};

// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
LetterFish.prototype.setBonus     = function(bonus) { this.bonus = bonus; };
// LetterFish.prototype.setInHole = function(bool) { this.inHole = bool; }
LetterFish.prototype.setHole      = function(hole) { this.hole = hole; };
LetterFish.prototype.setIndex     = function(index) { this.index = index; };
LetterFish.prototype.setLetter    = function(letter)
{
	this.letter = letter;
};
LetterFish.prototype.setPearl     = function(pearl) { this.pearl = pearl; };
LetterFish.prototype.setValidate  = function(validate) { this.validate = validate; };
LetterFish.prototype.setHp        = function(hp) { this.hp = hp; };
LetterFish.prototype.setGrey = function(bool) { this.grey = bool; };
LetterFish.prototype.isGhost = function() { return this.ghost; };
LetterFish.prototype.isGrey = function()
{
	return this.grey;
};

LetterFish.prototype.getTop = function()
{
	if(!this.ground)
	{
		return 0;
	}
	var ori = this.ground.getTop() - AroundTheWords.FISH_SHIFT_BY;
	return (this.isInHole()) ? ori + AroundTheWords.HOLE_SHIFT_TOP_BY : ori;

};

LetterFish.prototype.isDouble = function() { return this.xM2; };


// --------------------------------------------------------------
// STATIC
// --------------------------------------------------------------
LetterFish.JOKER = '?';
LetterFish.DOUBLE = '*';
LetterFish.id    = 0;
LetterFish._map  = {};

// LetterFish.maxIndex     = 1000;
// LetterFish.currentIndex = LetterFish.maxIndex;
LetterFish.find = function(fishId) {
	return LetterFish._map[fishId];
};
LetterFish.delete = function(fishId) {
	if(LetterFish._map[fishId]) {
		LetterFish._map[fishId].kill();
		delete LetterFish._map[fishId];
	}
};

LetterFish.resetStatusAll = function()
{
	for(var i in LetterFish._map)
	{
		LetterFish._map[i].resetStatus();
	}
};

LetterFish.each = function(cb)
{
	for(var i in LetterFish._map)
	{
		cb(LetterFish._map[i]);
	}
};


LetterFish.create = function(letter, difficulty) {
	var lFish = new LetterFish(letter, difficulty);
	LetterFish._map[lFish.getId()] = lFish;

	return lFish;
};

LetterFish.regenLetter = function(fish)
{
	if(fish.isJoker()) {

		var view = fish.view
			, sprite = PIXI.Sprite.fromFrame('ig_joker')
		 	, accessoriesContent = view.storage.accessoriesContent;
	 	if(view.storage.textContainer) {
			view.removeChild(view.storage.textContainer);
			delete view.storage.textContainer;
		}

		accessoriesContent.addChild(sprite);
		sprite.position.x = -5;
		sprite.position.y = -12;

	} else if (fish.isDouble()) {
		var view = fish.view
			, sprite = PIXI.Sprite.fromFrame('ig_x2')
		 	, accessoriesContent = view.storage.accessoriesContent;

 		accessoriesContent.addChild(sprite);
 		sprite.position.x = -9;
 		sprite.position.y = 40;

	}
};





LetterFish.avaiableClassName = 'jokerType doubleType';

exports.LetterFish = LetterFish;

})(window.Game = window.Game || {});

/**** game/helpers/Char.js ****/
(function(exports){

var Char = {
	code:
	{
		A:65,
		Z:90,
		a: 97,
		z: 122
	},


	points: {},

	vowel:
	{
		map: ['A', 'E', 'I', 'O', 'U', 'Y'],
		letters: { A: 1, E: 1, I: 1, O: 1, U: 1, Y: 1 }
	},

	consonne:
	{
		map: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z', '?'],
		letters : {B: 1, C: 1, D: 1, F: 1, G: 1, H: 1, J: 1, K: 1, L: 1, M: 1, N: 1, P: 1, Q: 1, R: 1, S: 1, T: 1, V: 1, W: 1, X: 1, Z: 1, '?': 1}
	},

	rand: function()
	{
		// On pourrait aussi faire un alea en fonction du poid ..

		var letter = null;

		switch(rand(0, 2))
		{
			case 0:
			case 1:
				letter = this.vowel.map[rand(0, this.vowel.map.length-1)];
				break;
			case 2:
				letter = this.consonne.map[rand(0, this.consonne.map.length-1)];
				break;
		}

		// return letter.toLowerCase();
		return letter;

		// return String.fromCharCode(code).toLowerCase();
	},

	isVowel: function(c)
	{
		return this.vowel.letters[c.toUpperCase()] || false;
	},

	getVowelPercent: function()
	{
		return this.vowel.map.length/this.consonne.map.length;
	},

	getWeight: function(c)
	{
		var upperChar = c.toUpperCase();
		return this.points[upperChar] || 0;
	},

	setPoints: function(points)
	{
		this.points = points;
	}
};

exports.Char = Char;

})(window.Game = window.Game || {});

/**** display/template/ViewBuilder.js ****/
'use strict';

(function(namespace){

/**
 * View Builder simule un dom à partir d'une vue
 *
 * @class ViewBuilder
 * @constructor
 */
function ViewBuilder(viewName, attachTo, params){
	this.viewName = viewName;
	if(typeof View[this.viewName] == "undefined")
		throw new Error("ViewBuilder a besoin d'une vue existante pour fonctionner {"+viewName+"}");

	this.template = View[this.viewName];
	this.treeId = {};
	this.treeClass = {};
	this.container = attachTo || new PIXI.DisplayObjectContainer();
	this.buildDone = false;
	this.params = params || {};
};


ViewBuilder.prototype.build = function(){

	if(this.buildDone) return;
	this.buildDone = true;

	this.template(this);


};

ViewBuilder.prototype.add = function(displayObject, force) {

	if(force || this.isSavable(displayObject)) {
		this.save(displayObject, force);
	}
	this.container.addChild(displayObject);

};

ViewBuilder.prototype.isSavable = function(displayObject) {
	return (displayObject.refId || displayObject.refClass);
};

ViewBuilder.prototype.save = function(saveRef, force){
	// if(!saveRef.refId && !saveRef.refClass) {c
	if(!this.isSavable(saveRef)) {
		throw new Error("ViewBuilder::saveRef L'element ne peut etre sauvegarde que si au moins refId ou refClass est specifie");

	}

	this.saveRefId(saveRef, force);
	this.saveRefClass(saveRef, force);
};

ViewBuilder.prototype.saveRefId = function(saveRef, force) {
	if(!saveRef.refId) return;

	if(this.treeId[saveRef.refId] && ! force)
		throw new Error("ViewBuilder::saveRefId Impossible de sauvegarder la ref ID car un autre element occupe deja cet emplacement " + saveRef.refId);

	this.treeId[saveRef.refId] = saveRef;
};

ViewBuilder.prototype.saveRefClass = function(saveRef) {
	if(!saveRef.refClass) return;

	if(!this.treeClass[saveRef.refClass]) this.treeClass[saveRef.refClass] = [];

	this.treeClass[saveRef.refClass].push(saveRef);

};

ViewBuilder.prototype.setElementById = function(element) {
	this.treeId[id] = element;
};

ViewBuilder.prototype.getElementById = function(id) {
	return this.treeId[id] || false;
};

ViewBuilder.prototype.getElementsByClassName = function(className) {
	return this.treeClass[className] || false;
};


namespace.ViewBuilder = ViewBuilder;

})(window.UI = window.UI || {});




/**** display/control/Button.js ****/
'use strict';
(function(namespace){

function Button(texture) {
	PIXI.Sprite.call(this, texture);

	this.isButton = true;
	this.buttonMode = true;
	this.interactive = true;
	this.touchstart = this.mousedown = this.hitHandler.bind(this);
	this.anchor.x = this.anchor.y = 0.5;
	this.oriScale = null;
	this.tween = null;
};

Button.prototype.constructor = Button;
Button.prototype = Object.create(PIXI.Sprite.prototype);

Button.prototype.hitHandler = function() {
	this.anim();
	if(this.onHit) this.onHit();
};

Button.prototype.anim = function(){
	if(!this.oriScale){
		this.oriScale = {
			x: this.scale.x,
			y: this.scale.y
		}
	}

	this.scale.x += 0.3;
	this.scale.y += 0.3;

	if(this.tween) this.tween.kill();

	this.tween = TweenMax.to(this.scale, 0.4, {x: this.oriScale.x, y: this.oriScale.y, ease: Elastic.easeOut});
};





namespace.Button = Button;

})(window.UI = window.UI || {});

/**** display/world/World.js ****/
'use strict';
(function(exports){
	function World (cf, showStat) {
		this.key = cf.key;
		this.id = cf.id;
		// this.prefab = Prefab['world_'+ this.key + '_prefab']();
		this.prefab = Prefab['world_prefab'](cf, showStat);
		this.prefab.key = cf.key;
		this.prefab.worldId = cf.id;
		Util.Container.anchor(this.prefab, 0.5, 0.5);

		// this.prefab.pivot.x = this.prefab.width/2;
		// this.prefab.pivot.y = this.prefab.height/2;
	}

	exports.World = World;
})(window.UI = window.UI || {});

/**** display/popup/PopupLevel.js ****/
'use strict';

(function(exports){

function PopupLevel(level, restart){
	Util.Popup.call(this);
	this.level = level;
	this.restart = restart;
};

PopupLevel.constructor = PopupLevel;
PopupLevel.prototype = Object.create(Util.Popup.prototype);

PopupLevel.prototype.create = function(){

	this.createLevel();

	this.filter.interactive = true;
	this.filter.touchstart = this.filter.mousedown = this.close.bind(this);

};
PopupLevel.prototype.createLevel = function(anim)
{
	var widthLevel = 350,
		heightLevel = 400,
		myStar = this.level.getStar(),
		levelOrder = this.level.getOrder() +1,
		mode = this.level.getMode(),
		goals = mode.findGoals(),
		self = this,
		player = ATW.App.getPlayer();

	// --------------------------------------------------------------
	// Obj container
	// --------------------------------------------------------------
	this.levelContainer = new PIXI.DisplayObjectContainer();

	var pointFrame = this.level.getPointFrame();

	// Arriere plan
	var bgLevel = PIXI.Sprite.fromFrame((pointFrame == 'world_point_done') ? 'level_bg_green' : 'level_bg_blue');
	this.levelContainer.addChild(bgLevel);

	this.levelContainer.scale.x = this.levelContainer.scale.y = 1.2;
	this.levelContainer.position.x = ~~(ATW.gameMidWidth() - this.levelContainer.width/2);
	this.levelContainer.position.y = ~~(ATW.gameMidHeight() - this.levelContainer.height/2);

	// Point
	var point = PIXI.Sprite.fromFrame(pointFrame);
	point.scale.x = point.scale.y = 1.3;
	point.position.x = ~~(this.levelContainer.width/2 - point.width/2) - 35;
	point.position.y = -~~(point.height/2) - 5;

	var text = new PIXI.BitmapText(levelOrder.toString(), {font: "35px FredokaOne-Regular"});
	var label = Util.DisplayText.shadow(text, 2, 1, 0x0d0d0d, 0.3);
	label.position.x = ~~(point.width/2 - label.width/2) - 11;
	label.position.y = 5;

	point.addChild(label);

	this.levelContainer.addChild(point);

	// Mode icone
	var modeIco = PIXI.Sprite.fromFrame('level_mode_' + mode.getKey().toLowerCase());
	modeIco.position.x = 10;
	modeIco.position.y = 10;
	this.levelContainer.addChild(modeIco);

	// var helpIco = PIXI.Sprite.fromFrame('level_help');
	var helpIco = Util.DisplayObject.button('level_help');
	helpIco.onHit = this.helpHandler.bind(this);
	helpIco.position.x = widthLevel - helpIco.width/2 - 10;
	helpIco.position.y =  7 + helpIco.height/2;
	this.levelContainer.addChild(helpIco);

		// Etoiles
	var starsDispo = ['left', 'center', 'right'],
			oldSprite = null,
			sprite = null,
			starContainer = new PIXI.DisplayObjectContainer();
	for(var i=0; i<starsDispo.length; i++)
	{
		var on = (myStar > i);
		var starKey = 'level_star_' + starsDispo[i] + '_med';
		if(!on) {
			starKey += '_grey';
		}

		var sprite = PIXI.Sprite.fromFrame(starKey);
		if(oldSprite) {
			sprite.position.x = oldSprite.width + oldSprite.position.x + 25;
		}

		if(i != 1) {
			sprite.position.y = 20;
		}

		oldSprite = sprite;

		starContainer.addChild(sprite);
	}

	// starContainer.position.x = 55;
	starContainer.position.x = ~~(widthLevel/2 - starContainer.width/2);
	starContainer.position.y = 30;

	this.levelContainer.addChild(starContainer);


	// Arrow
	var arrow = PIXI.Sprite.fromFrame('level_obj_arrow');
	arrow.anchor.x = arrow.anchor.y = 0.5;
	switch(myStar) {
		case 0:
			arrow.position.x = 114;
			arrow.position.y = 120;
			arrow.rotation = Util.Math2.degToRad(-40);
			break;

		case 1:
			arrow.position.x = 175;
			arrow.position.y = 102;
			break;

		case 2:
			arrow.position.x = 230;
			arrow.position.y = 125;
			arrow.rotation = Util.Math2.degToRad(40);
			break;

		default:
			arrow.position.x = 272;
			arrow.position.y = 170;
			arrow.rotation = Util.Math2.degToRad(70);

			break;

	}


	this.levelContainer.addChild(arrow);



	// Objectif jauge
	var circleBg = PIXI.Sprite.fromFrame('level_obj_bg');
	circleBg.anchor.x = circleBg.anchor.y = 0.5;
	circleBg.position.x = ~~(widthLevel/2);
	circleBg.position.y = ~~(heightLevel/2);

	this.levelContainer.addChild(circleBg);

	// Objectif texte
	var style = {font: "20px FredokaOne-Regular"};
	var margin = 10;
	var objGroupText = new PIXI.DisplayObjectContainer();

	var objTitle = new PIXI.BitmapText(_ts('Objectif'), style)
	objTitle = Util.DisplayText.shadow(objTitle, 2, 1, 0x0d0d0d, 0.3);

	objGroupText.addChild(objTitle);

	var goalString = '';
	if(goals[myStar]) {
		goalString = _ts('x_pts', {
			':x': goals[myStar]
		});
	} else {
		goalString = _ts('Defi');
	}

	var goalText = new PIXI.BitmapText(goalString, style);
	goalText = Util.DisplayText.shadow(goalText, 2, 0, 0x0d0d0d, 0.3);
	goalText.position.y = objTitle.height + margin;
	objGroupText.addChild(goalText);

	var andText = new PIXI.BitmapText('&', style);
	andText = Util.DisplayText.shadow(andText, 2, 0, 0x0d0d0d, 0.3);
	andText.position.y = goalText.position.y + goalText.height + margin;
	objGroupText.addChild(andText);

	objGroupText.position.x = ~~(widthLevel/2 - objGroupText.width/2);
	objGroupText.position.y = ~~(heightLevel/2 - 55);

	objTitle.position.x = objGroupText.width/2 - objTitle.width/2;
	goalText.position.x = objGroupText.width/2 - goalText.width/2;
	andText.position.x = objGroupText.width/2 - andText.width/2;


	this.levelContainer.addChild(objGroupText);


	// Encart
	var bgEncart = PIXI.Sprite.fromFrame('app_encart');
	bgEncart.anchor.x = bgEncart.anchor.y = 0.5;
	bgEncart.position.y = ~~(heightLevel/2) + 80;
	bgEncart.position.x = ~~(widthLevel/2);

	var textEncart = Util.DisplayText.wrap(mode.getDescription(0, 0, 0, true), {
		font: '24px FredokaOne-Regular',
		tint: 0x8a7d53,
		lineHeight: 30,
		letterMax: 18,
		maxWidth: widthLevel,
		align: 'center'
	});
	textEncart.position.y = bgEncart.position.y- textEncart.height/2 -18;

	this.levelContainer.addChild(bgEncart);
	this.levelContainer.addChild(textEncart);



	// Meilleure score
	var name =_ts('meilleur_score').toUpperCase();
	var highcoreTitle =new PIXI.BitmapText(name, {font:"28px FredokaOne-Regular"})

	highcoreTitle = Util.DisplayText.shadow(highcoreTitle, 2, 1, 0x0d0d0d, 0.3);
	highcoreTitle.position.x = ~~(widthLevel/2 - highcoreTitle.width/2);
	highcoreTitle.position.y = heightLevel - highcoreTitle.height - 55;


	this.levelContainer.addChild(highcoreTitle);

	var pts =_ts('x_pts', {
		':x': this.level.getScore()
	});
	var highcoreScore =new PIXI.BitmapText(pts, {font:"28px FredokaOne-Regular"})

	highcoreScore = Util.DisplayText.shadow(highcoreScore, 2, 1, 0x0d0d0d, 0.3);
	highcoreScore.position.x = ~~(widthLevel/2 - highcoreScore.width/2);
	highcoreScore.position.y = highcoreTitle.position.y + highcoreTitle.height + 10;

	this.levelContainer.addChild(highcoreScore);


	// --------------------------------------------------------------
	// Footer interaction
	// --------------------------------------------------------------
	var marginBtn = 15;

	var key = (player.life) ? 'button_go' : 'app_more_heart';
	var goBtn = Util.DisplayObject.button(key);
	goBtn.position.y = heightLevel + 30 + ~~(goBtn.height/2);
	goBtn.position.x = ~~(widthLevel/2);
	goBtn.onHit = function(){
		self.close();

		if(self.restart) return;

		if(player.life) {
			self.launchLevel();
		} else {
			var t = new UI.PopupHeart();
			t.onClose = function(){
				if(player.life) self.launchLevel();
			}

			t.open();
		}

	}

	this.levelContainer.addChild(goBtn);


	if(!this.restart) {

		this.leftArrow = Util.DisplayObject.button('app_left_arrow');
		this.rightArrow = Util.DisplayObject.button('app_right_arrow');

		this.leftArrow.scale.x = this.leftArrow.scale.y = 0.65;
		this.leftArrow.position.y = heightLevel + marginBtn + this.leftArrow.height/2;
		this.leftArrow.position.x = goBtn.position.x - this.leftArrow.width - 70;

		this.rightArrow.scale.x = this.rightArrow.scale.y = 0.65;
		this.rightArrow.position.y = heightLevel + marginBtn + this.rightArrow.height/2;
		this.rightArrow.position.x = goBtn.position.x + goBtn.width - 10;

		this.refreshArrow();

		this.levelContainer.addChild(this.leftArrow);
		this.levelContainer.addChild(this.rightArrow);
	}

	if(anim) {
		TweenLite.from(this.levelContainer.position, 0.5, {x: ATW.gameWidth(), ease:Elastic.easeOut});
	}

	this.addChild(this.levelContainer);

};

PopupLevel.prototype.gotoLevel = function(level)
{
	if(!level || !level.isOpen()) return;

	this.removeChild(this.levelContainer);

	this.level = level;
	if(this.onSlide) this.onSlide(this.level);

	this.createLevel(true);
};


PopupLevel.prototype.refreshArrow = function()
{
	var previousLevel = this.level.getPrevious(),
		nextLevel = this.level.getNext(),
		self = this;

	this.leftArrow.onHit = function(){
		self.gotoLevel(previousLevel);
	}

	this.rightArrow.onHit = function(){
		self.gotoLevel(nextLevel);
	}

	this.leftArrow.visible = (previousLevel) ? true : false;
	this.rightArrow.visible = (nextLevel && nextLevel.isOpen()) ? true : false;

};

PopupLevel.prototype.helpHandler = function()
{
	var tutoKey = Model.Mode.tutoRefManual[this.level.getMode().getKey()];
	var p = new UI.PopupTuto(tutoKey, true, false);
	p.open();
};

PopupLevel.prototype.launchLevel = function()
{
	var gameScene = new Scene.GameScene(this.level);
	gameScene.start();
};


exports.PopupLevel = PopupLevel;

})(window.UI = window.UI || {});




/**** display/popup/PopupHeart.js ****/
'use strict';

(function(exports){

function PopupHeart() { Util.Popup.call(this) };


PopupHeart.constructor = PopupHeart;
PopupHeart.prototype = Object.create(Util.Popup.prototype);

PopupHeart.prototype.create = function() {
	var player = ATW.App.getPlayer()
		, needLove = !player.life;

	var bg = PIXI.Sprite.fromFrame('pink_radius');
	bg.scale.x = bg.scale.y = 1.1;
	bg.position.x = ATW.gameMidWidth() - ~~(bg.width/2);
	bg.position.y = ATW.gameMidHeight() - ~~(bg.height/2);
	this.addChild(bg);

	this.closeBtn = Util.DisplayObject.button('popup_cross_exit');
	this.closeBtn.scale.x = this.closeBtn.scale.y = 1.2;
	this.closeBtn.position.x = bg.position.x + bg.width - 4;
	this.closeBtn.position.y = bg.position.y + 5;

	this.addChild(this.closeBtn);

	var insider = new PIXI.DisplayObjectContainer();


	var s = (needLove) ? _ts('manque_amour') : _ts('obtenez_coeur');
	var titleBmp = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
	titleBmp.position.x = bg.width/2 - titleBmp.width/2;
	titleBmp.position.y = 20;

	insider.addChild(titleBmp);

	var space = 55;
	if(!needLove) {
		// var tipsBmp = new PIXI.BitmapText(_ts('demander_coeur_supplementaire'), {font: "20px FredokaOne-Regular"});
		var tipsBmp = Util.DisplayText.wrap(_ts('demander_coeur_supplementaire'), {
			font: "22px FredokaOne-Regular",
			letterMax: 45,
			align: "center",
			maxWidth: bg.width - 10,
			lineHeight: 22
		});
		tipsBmp.position.y = insider.height + 45;
		// tipsBmp.position.x = bg.width/2 - tipsBmp.width/2;

		insider.addChild(tipsBmp);
		space = 35;
	}



	var askFriend = Util.DisplayObject.buttonBlue(_ts('demander_a_vos_amis'));
	askFriend.scale.x = askFriend.scale.y = 1.15;
	askFriend.position.x = bg.width/2 - askFriend.width/2;
	askFriend.position.y = insider.height + space;
	insider.addChild(askFriend);

	var bigHeart = PIXI.Sprite.fromFrame('app_big_hearth');
	bigHeart.scale.x = bigHeart.scale.y = 1.2;
	bigHeart.position.x = bg.width/2 - bigHeart.width/2;
	bigHeart.position.y = insider.height + space;
	insider.addChild(bigHeart);

	var orBmp = new PIXI.BitmapText(_ts('Ou').toUpperCase(), {font: "35px FredokaOne-Regular"});
	orBmp.position.y = insider.height + 30;
	orBmp.position.x = bg.width/2 - orBmp.width/2;
	insider.addChild(orBmp);

	var s2 = (needLove)
				? _ts('refaire_plein_coeur')
				: _ts('obtenir_coeur_illimites_n_canvas', {':x': (ATW.Datas.CONFIGS.GEN_GAME_INFINITE_SESSION_SEC/60/60)});

	var shopTipBmp = Util.DisplayText.wrap(s2, {
		font: "21px FredokaOne-Regular",
		letterMax: 40,
		align: "center",
		maxWidth: bg.width - 30,
		lineHeight: 22
	});
	shopTipBmp.position.y = insider.height + 40;
	shopTipBmp.position.x = 20;
	insider.addChild(shopTipBmp);

	var product = Util.Shop.findProductByKey('NEED_LOVE');
	var nb = product.price;
	if(!needLove) {
		product = Util.Shop.findProductByKey('UNLIMITED_SESSION');
		nb = product.price;
	}

	var shopBtn = Util.DisplayObject.buttonGreen(nb.toString());
	shopBtn.scale.x = shopBtn.scale.y = 1.2;
	shopBtn.position.x = bg.width/2 - shopBtn.width/2;
	shopBtn.position.y = insider.height + 40;
	insider.addChild(shopBtn);

	insider.position = bg.position;


	this.addChild(insider);

	// this.interactive = true;
	// this.touchstart = this.mousedown = function toto(){}

	// bg.interactive = true;
	// bg.touchstart = bg.mousedown = function toto(){}


	askFriend.onHit = this.askFriendHandler.bind(this);
	shopBtn.onHit = this.shopBtnHandler.bind(this);
};


PopupHeart.prototype.askFriendHandler = function()
{
	console.log('PopupHeart::askFriendHandler');
};

PopupHeart.prototype.shopBtnHandler = function()
{
	console.log('PopupHeart::shopBtnHandler');

	var player = ATW.App.getPlayer()
		, self = this
		, needLove = !player.life
		, shopHelper = Util.Shop;

	if(needLove) {
		console.log('we need love');
		var product = shopHelper.findProductByKey('NEED_LOVE');

		shopHelper.instaShop(product, function(){}, function(res){
			player.myUpdate(res);
			self.close();
		});


	} else {
		console.log('we need an unlimited session');
		var product = shopHelper.findProductByKey('UNLIMITED_SESSION');
		shopHelper.instaShop(product, function(){
			// $('.cLifeBar').addClass('golden');
		}, function(res){
			player.myUpdate(res);
			self.close();
		});
	}



};



exports.PopupHeart = PopupHeart;

})(window.UI = window.UI || {});

/**** display/popup/PopupTuto.js ****/
'use strict';

(function(exports){

function PopupTuto(key, force, dontSave)
{
	Util.Popup.call(this)

	this.key = key;
	this.cf = ATW.Datas.TUTOS[this.key];
	this.active = false;
	this.force = force;
	this.dontSave = dontSave;
};

PopupTuto.constructor = PopupTuto;
PopupTuto.prototype = Object.create(Util.Popup.prototype);

PopupTuto.prototype.getPart = function()
{
	var parts = this.cf.parts
		, cpt = 0
		, part = null;

	for(var key in parts) {

		if(cpt == this.current) {
			part = parts[key];
			break;
		}

		cpt++;

	}

	return part;

};

PopupTuto.prototype.addPart = function()
{
	var self = this;
	if(this.currentPart) {
		var tl = new TimelineMax();
		tl.to(this.currentPart.position, 0.4, {x: -this.currentPart.width}, 'start');
		tl.to(this.currentPart, 0.4, {rotation: Util.Math2.degToRad(-30)}, 'start');
		tl.to(this.currentPart.scale, 0.4, {x:0.5, y: 0.5}, 'start');

		tl.call(function(currentPart){
			return function() {
				self.removeChild(currentPart);
			}
		}(this.currentPart))

	}

	var part = this.getPart();
	if(!part) return false;

	this.currentPart = new PIXI.DisplayObjectContainer();

	var textContainer = new PIXI.DisplayObjectContainer()
		, widthContainer = 500
		, title = Util.String2.strip(_2(part.name))
		, description = _2(part.description);

	description = description.replace(new RegExp('<br>', 'g'), ' ');
	description = description.replace(/\s+/g,' ').trim();
	description = Util.String2.strip(description);

	var titleBmp = new PIXI.BitmapText(title, {font: "30px FredokaOne-Regular", tint: 0x81ab3f});
	titleBmp.position.x = widthContainer/2 - titleBmp.width/2;
	textContainer.addChild(titleBmp);

	var descriptionBmp = Util.DisplayText.wrap(description, {
		font: "22px FredokaOne-Regular",
		tint: 0x5e5f4f,
		letterMax: 40,
		align: "left",
		maxWidth: widthContainer,
		lineHeight: 24
	});
	// var descriptionBmp = new PIXI.BitmapText(description, {font: "22px FredokaOne-Regular", tint: 0x5e5f4f});
	descriptionBmp.position.y = textContainer.height + 20;
	descriptionBmp.position.x = 20;
	textContainer.addChild(descriptionBmp);

	var graph = new PIXI.Graphics();
	graph.beginFill(0xFFFFFF)
		.drawRoundedRect(0, 0, widthContainer, textContainer.height + 40, 20)
		.endFill();


	this.currentPart.addChild(graph);

	textContainer.position.y = 20;
	this.currentPart.addChild(textContainer);

	// this.currentPart.position.x = ATW.gameMidWidth() - widthContainer/2;
	this.currentPart.position.y = ATW.gameMidHeight() - this.currentPart.height/2;
	this.currentPart.position.x = ATW.gameWidth() + this.currentPart.width;
	this.addChild(this.currentPart);

	TweenLite.to(this.currentPart.position, 0.3, {x: ATW.gameMidWidth() - widthContainer/2, ease: Elastic.easeOut})

	this.currentPart.interactive = true;
	this.currentPart.mousedown = this.currentPart.touchstart = this.nextPart.bind(this);

	return true;

};

PopupTuto.prototype.nextPart = function()
{
	this.current++;
	var allow = this.addPart();

	if(!allow) this.endTuto();

};

PopupTuto.prototype.endTuto = function()
{

	if(!this.dontSave) this.save();
	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.resume();
	if(this.onClose2) this.onClose2();

	this.close();
};

PopupTuto.prototype.create = function()
{

	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.pause();

	this.active = true;
	this.current = 0;

	this.addPart();


};

PopupTuto.prototype.open = function()
{
	var player = ATW.App.getPlayer();
	if(!this.force && player.isTutoFisnish(this.key)) return;

	Util.Popup.prototype.open.call(this);
};

PopupTuto.prototype.save = function()
{
	ATW.App.getPlayer().finishTuto(this.key);

	ATW.App.getDataManager().getApi().call('Tuto', 'POST', {
		on: 'me',
		data: {
			key: this.key
		}
	});
};

exports.PopupTuto = PopupTuto;

})(window.UI = window.UI || {});

/**** display/popup/PopupTutoBoard.js ****/
'use strict';

(function(exports){

function PopupTutoBoard(pages, onComplete){
	Util.Popup.call(this);

	this.filterAlpha = 0;
	this.pages       = pages || [];
	this.onComplete  = onComplete;
	this.pos         = 0;
	this.tls         = {};

};

PopupTutoBoard.constructor = PopupTutoBoard;
PopupTutoBoard.prototype = Object.create(Util.Popup.prototype);

PopupTutoBoard.prototype.create = function(){

	var teacher = PIXI.Sprite.fromFrame('tuto_teacher');
	if(ATW.isMobile()) {
		teacher.scale.x = teacher.scale.y = 0.8;
		teacher.position.x = -50;

	}

	teacher.position.y = ATW.gameHeight() - teacher.height;

	this.addChild(teacher);

	this.addBubble();

	this.filter.interactive = true;
	this.filter.touchstart = this.filter.mousedown = function toto(){};

};


PopupTutoBoard.prototype.addBubble = function(first_argument) {
	var self = this;
	if(this.currentBubble) this.removeChild(this.currentBubble);

	var page = this.getPage();
	if(!page) return false;

	this.cleanPage();

	this.currentBubble = new PIXI.DisplayObjectContainer();

	var text = Util.String2.strip(page.txt)
		, bubbleWidth = 400
		, currentPos = this.pos;

	var textBmp = Util.DisplayText.wrap(text, {
		font: "20px FredokaOne-Regular",
		// font: "17px FredokaOne-Regular",
		tint: 0x4c5b7b,
		// letterMax: 39,
		letterMax: 30,
		align: "left",
		// maxWidth: bubbleWidth- 20,
		maxWidth: bubbleWidth,
		lineHeight: 24
	});

	var bubbleGraph = new PIXI.Graphics();
	bubbleGraph.beginFill(0xFFFFFF)
		.drawRoundedRect(0, 0, bubbleWidth, textBmp.height + 40, 20)
		.endFill();

	this.currentBubble.addChild(bubbleGraph);

	textBmp.position.y = 20;
	textBmp.position.x = 20;
	this.currentBubble.addChild(textBmp);

	if(!page.noCheck) {
		var check = PIXI.Sprite.fromFrame('tuto_bubble_ok');
		check.position.x = this.currentBubble.width - check.width + 20;
		check.position.y = this.currentBubble.height - check.height +20;
		this.currentBubble.addChild(check);
	}

	this.currentBubble.position.y = ATW.gameHeight() - 150;
	if(this.currentBubble.position.y + this.currentBubble.height > ATW.gameHeight()) {
		this.currentBubble.position.y = ATW.gameHeight() - this.currentBubble.height - 40;
	}

	this.currentBubble.position.x = -this.currentBubble.width;


	if(page.hit) {
		var hit = page.hit
			, padding = 30;

		this.hitGraph = new PIXI.Graphics();

		var alpha = (page.transparentBorder) ? 0 : 1

		this.hitGraph.beginFill(0x000000, 0)
			.lineStyle(5, 0xFFFFFF, alpha)
			.drawRoundedRect(0, 0, hit.width + padding, hit.height + padding, 10)
			.endFill();


		var midWidth = ~~(this.hitGraph.width/2)
			, midHeight = ~~(this.hitGraph.height/2);

		this.hitGraph.pivot.x = midWidth;
		this.hitGraph.pivot.y = midHeight;
		this.hitGraph.position.x = hit.x - padding/2 + midWidth;
		this.hitGraph.position.y = hit.y - padding/2 + midHeight;

		this.hitGraph.interactive = true;
		this.hitGraph.mousedown = this.hitGraph.touchstart = function(){
			if(currentPos == self.pos) self.nextPage();
			if(page.onClick) page.onClick();
		}

		this.addChild(this.hitGraph);


		this.tlHit = new TimelineMax({repeat: -1, yoyo: true})
		this.tlHit.to(this.hitGraph.scale, 0.3, {x:1.1, y:1.1});

		var targetDir = '';
		if(page.arrowDir) targetDir = page.arrowDir;
		else targetDir = (hit.x > 100) ? 'toRight' : 'toLeft';

		if(!page.noArrow) {
			this.arrowSprite = PIXI.Sprite.fromFrame('tuto_bubble_target');
			var margin = 30;


			this.tlArrow = new TimelineMax({repeat: -1});
			var duration = 1;
			switch(targetDir)
			{
				case 'toBottom':
					this.arrowSprite.rotation = Util.Math2.degToRad(90);
					this.arrowSprite.position.x = hit.x + hit.width/2 + this.arrowSprite.width/2;
					this.arrowSprite.position.y = hit.y - this.arrowSprite.height - margin;
					this.tlArrow.to(this.arrowSprite.position, duration, {y: this.arrowSprite.position.y + 20}, 'start');
					break;
				case 'toTop':
					this.arrowSprite.rotation = Util.Math2.degToRad(-90);
					this.arrowSprite.position.x = hit.x + hit.width/2 + this.arrowSprite.width/2 - 60;
					this.arrowSprite.position.y = hit.y + hit.height + margin + this.arrowSprite.height;
					this.tlArrow.to(this.arrowSprite.position, duration, {y: this.arrowSprite.position.y - 20}, 'start');
					break;

				case 'toLeft':
					this.arrowSprite.position.y = hit.y + hit.height/2 + margin;
					this.arrowSprite.position.x = hit.x + hit.width + this.arrowSprite.width + margin;
					this.arrowSprite.rotation = Util.Math2.degToRad(-180);
					this.tlArrow.to(this.arrowSprite.position, duration, {x: this.arrowSprite.position.x - 20}, 'start');
					break;
				case 'toRight':
					this.arrowSprite.position.y = hit.y + hit.height/2 - this.arrowSprite.height/2;
					this.arrowSprite.position.x = hit.x - this.arrowSprite.width - margin;
					this.tlArrow.to(this.arrowSprite.position, duration, {x: this.arrowSprite.position.x + 20}, 'start');

					break;
			}

			this.tlArrow.to(this.arrowSprite.scale, 0.4, {x: 1.25, y: 1.25}, 'start');

			this.addChild(this.arrowSprite);
		}


	}


	this.addChild(this.currentBubble);

	TweenLite.to(this.currentBubble.position, 0.3, {x: 100, ease: Elastic.easeOut})

	this.currentBubble.interactive = true;
	this.currentBubble.touchstart = this.currentBubble.mousedown = function(){
		if(page.noCheck) return;
		if(currentPos == self.pos) self.nextPage();
	}


	return true;
};


PopupTutoBoard.prototype.getPage = function() {
	if(this.pos >= this.pages.length) return false;
	return this.pages[this.pos];
};

PopupTutoBoard.prototype.nextPage = function(){
	this.pos++;

	var page = this.addBubble();
	if(!page) {
		if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.resume();
		if(this.onComplete) this.onComplete();

		this.close();
	}
};

PopupTutoBoard.prototype.cleanPage = function()
{
	if(this.tlHit) {
		this.tlHit.clear();
		this.tlHit = null;
	}

	if(this.hitGraph) {
		this.removeChild(this.hitGraph);
		this.hitGraph = null;
	}

	if(this.tlArrow) {
		this.tlArrow.clear();
		this.tlArrow = null;
	}

	if(this.arrowSprite) {
		this.removeChild(this.arrowSprite);
		this.arrowSprite = null;
	}
};

PopupTutoBoard.prototype.addPage = function(page)
{
	this.pages.push(page);
};

PopupTutoBoard.prototype.unshiftPage = function(page)
{
	this.pages.unshift(page);
};

PopupTutoBoard.prototype.open = function()
{
	if(Scene.BaseScene.current.isGameScene) Scene.BaseScene.current.pause();

	Util.Popup.prototype.open.call(this);
};

PopupTutoBoard.prototype.close = function()
{
	this.cleanPage();
	Util.Popup.prototype.close.call(this);
};



exports.PopupTutoBoard = PopupTutoBoard;

})(window.UI = window.UI || {});




/**** display/popup/PopupAchievement.js ****/
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

/**** display/popup/PopupNotif.js ****/
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

		var line = new PIXI.DisplayObjectContainer()
			, friendContainer = PIXI.Sprite.fromFrame('friend_invite_bg')
			, letter = PIXI.Sprite.fromFrame('letter');

		letter.position.y = friendContainer.height - 35;
		letter.position.x = friendContainer.width - 45;
		friendContainer.addChild(letter);


		var mess = request.message;
		// mess = 'Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices, nec descensurum quemquam ad hanc accusationem fuisse, cui,';
		if(mess.slice(0, 4) == 'ach:') {
			mess = _ts('message_succes_termine', {
				':title': _2(mess.slice(4))
			})
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


	var graphContainer = new PIXI.Graphics();
	graphContainer.beginFill(0x4aaee1)
		.lineStyle(6, 0xFFFFFF)
		.drawRoundedRect(0, 0, widthMax, insiderContainer.height + paddingY)
		.endFill();

	insiderContainer.position.y = paddingY/2;
	insiderContainer.position.x = paddingX/2;

	graphContainer.addChild(insiderContainer);

	graphContainer.position.x = ATW.gameMidWidth() - graphContainer.width/2;
	graphContainer.position.y = titleBmp.position.y + titleBmp.height + 40;

	this.addChild(graphContainer);



	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);

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
							':world': _2(WORLDS[data.worldId].name)
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

/**** display/popup/PopupShop.js ****/
'use strict';

(function(exports){

function PopupShop(goCat)
{
	Util.Popup.call(this);
	this.goCat = goCat;

};

PopupShop.constructor = PopupShop;
PopupShop.prototype = Object.create(Util.Popup.prototype);

PopupShop.prototype.create = function()
{

	var self = this
		, player = ATW.App.getPlayer();

	if(!this.goCat) this.categories();
	else this.section(this.goCat);


	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);

};

PopupShop.prototype.createTitle = function(txt, color, shadow) {
	var titleBmp = new PIXI.BitmapText(txt, {font: "45px FredokaOne-Regular", tint:color});
	titleBmp = Util.DisplayText.shadow(titleBmp, 6, 0, shadow, 0.9);
	titleBmp.position.x = ATW.gameMidWidth() - titleBmp.width/2;
	titleBmp.position.y = 100;

	return titleBmp;
};

PopupShop.prototype.categories = function()
{
	var self = this;
	this.cleanPage();

	this.currentPage = new PIXI.DisplayObjectContainer();

	var titleBmp = this.createTitle(_ts('Boutique'), 0xdd6ee8, 0x8840aa)
	this.currentPage.addChild(titleBmp);

	var catContainer = new PIXI.DisplayObjectContainer();
	var shopCats = ATW.Datas.SHOPCATS;
	var x = 0;
	for(var scID in shopCats){
		var shCat = shopCats[scID];

		if(!parseInt(shCat.invisible, 10)) continue;

		var colorTheme = (shCat.key == 'PEARL') ? 'green' : 'blue';

		var container = this.createBloc(colorTheme);

		var catIco = PIXI.Sprite.fromFrame('sh-cat-'+shCat.id);
		catIco.position.x = container.width/2 - catIco.width/2;
		if(shCat.key == 'PEARL') {
			catIco.position.x -= 3;
		}

		catIco.position.y = container.height/2 - catIco.height/2;

		container.addChild(catIco);

		var ribbon = this.createRibbon(colorTheme, _2(shCat.name));
		ribbon.position.x = -2;
		ribbon.position.y = 180;
		container.addChild(ribbon);

		container.position.x = x;

		container.buttonMode = true;
		container.interactive = true;
		container.mousedown = container.touchstart = function(shCat){
			return function() {self.section(shCat)}
		}(shCat)

		catContainer.addChild(container);


		x = container.width + container.position.x + 20;
	}

	catContainer.position.x = ATW.gameMidWidth() - catContainer.width/2;
	catContainer.position.y = ATW.gameMidHeight() - catContainer.height/2;
	this.currentPage.addChild(catContainer);

	this.addChild(this.currentPage);


};

PopupShop.prototype.section = function(shCat) {

	var self = this,
		 targetShops = ATW.Datas.SHOPS[shCat.id],
		 player = ATW.App.getPlayer();

	if(!targetShops) return;

	this.cleanPage();

	var colorTheme = (shCat.key == 'PEARL') ? 'green' : 'blue';


	this.currentPage = new PIXI.DisplayObjectContainer();

	if(shCat.key == 'PEARL') {
		var color = 0x65d5b9
			, shadow = 0x318071;
	} else {
		var color = 0x1ad0f0
			, shadow = 0x0fa3d9;
	}

	var titleBmp = this.createTitle(_2(shCat.name), color, shadow);
	this.currentPage.addChild(titleBmp);

	var cfsBonus = ATW.Datas.BONUS;
	var productsContainer = new PIXI.DisplayObjectContainer();

	var x = 0, y =0, nbInline = 0;
	for(var key in targetShops) {
		var product = targetShops[key]
			, headerHeight = 43;


		var isBuyable = true;
		if(product.bonus) {
			for(var j in product.bonus.content) {
				var cf = product.bonus.content[j];
				if(!cf.bonus_id) continue;

				var cBonus = cfsBonus[cf.bonus_id];
				if(cBonus.tuto_key && !player.isTutoFisnish(cBonus.tuto_key)) {
					isBuyable = false;
					break;
				}
			}
		}


		var container = this.createBloc(colorTheme);

		var header = new PIXI.Graphics();
		header.beginFill(0x63cabb)
			.drawRoundedRect(0, 0, container.width-12, headerHeight, 20)
			.endFill();
		header.position.x = 5;
		header.position.y = 5;

		var nameBmp = new PIXI.BitmapText( _2(product.name), {font: "22px FredokaOne-Regular"});
		nameBmp = Util.DisplayText.shadow(nameBmp, 2, 0, shadow);
		nameBmp.position.x = 7;
		nameBmp.position.y = 10;
		header.addChild(nameBmp);

		container.addChild(header);

		var icoProduct = PIXI.Sprite.fromFrame('sh-' + product.id);
		icoProduct.position.x = container.width/2 - icoProduct.width/2;
		icoProduct.position.y = container.height/2 - icoProduct.height/2 + 20;
		container.addChild(icoProduct);

		if(product.pearl) {
			var qtyContainer = new PIXI.DisplayObjectContainer()
				, pearlSprite = PIXI.Sprite.fromFrame('app_pearl');

			pearlSprite.scale.x = pearlSprite.scale.y = 0.55;

			qtyContainer.addChild(pearlSprite);

			var qtyBmp = new PIXI.BitmapText(product.pearl.toString(), {font: "22px FredokaOne-Regular"});
			qtyBmp = Util.DisplayText.shadow(qtyBmp, 2, 0, shadow);

			qtyBmp.position.x = pearlSprite.position.x + pearlSprite.width + 5;
			qtyBmp.position.y = 5;

			qtyContainer.addChild(qtyBmp);

			qtyContainer.position.y = header.position.y + header.height + 3;
			qtyContainer.position.x = container.width/2 - qtyContainer.width/2;

			container.addChild(qtyContainer);
		}


		var sellerKey = ATW.Datas.SELLERS[shCat.seller_id].key
			, moneyIco = (sellerKey == 'FB') ? '€' : ''
			, price = product.price

		var btnShop = Util.DisplayObject.buttonGreen(price + moneyIco);

		if(isBuyable) {
			btnShop.onHit = function(product) {
				return function() { self.buy(product); }
			}(product)

			btnShop.position.y = container.height - btnShop.height/2 - 8;
			btnShop.position.x = container.width/2 - btnShop.width/2;

			container.addChild(btnShop);
		} else {
			var graphFilter = new PIXI.Graphics();
			graphFilter.beginFill(0x000000, 0.7)
				.drawRoundedRect(0,0, container.width, container.height, 30)
				.endFill()

			container.addChild(graphFilter);
		}

		container.position.x = x;

		if(container.position.x + container.width> ATW.gameWidth()|| nbInline >=3) {
			container.position.x = 0;
			y = productsContainer.height + 15;
			nbInline = 0;

		}
		nbInline++;

		container.position.y = y;
		productsContainer.addChild(container);

		x = container.position.x + container.width + 15;

	}

	productsContainer.position.x = ATW.gameMidWidth() - productsContainer.width/2;
	productsContainer.position.y = ATW.gameMidHeight() - productsContainer.height/2;

	var dist = productsContainer.position.y -  (titleBmp.position.y + titleBmp.height);
	if(dist < 30) productsContainer.position.y += 30 - dist;

	this.currentPage.addChild(productsContainer);

	this.addChild(this.currentPage);

};

PopupShop.prototype.buy = function(product) {
	if(this.isBuying) return;

	this.isBuying = true;

	var self = this;

	var seller = Util.Shop.instaShop(product, function(){
		self.addLoading();

	}, function(res){
		setTimeout(function(){
			self.removeLoading();
			self.isBuying = false;
			self.animReward(product);

		}, 600);
	}, function(){
		// self.acceptShopping();
	}, function(){
		self.isBuying = false;
		self.removeLoading();
		// self.$node.find('.bubblingG').remove();
		// self.close();
	});

	if(!seller) this.isBuying = false;
};

PopupShop.prototype.animReward = function(product)
{
	var self = this;

	this.isAnim = true;

	var rewardAnimator = new PIXI.DisplayObjectContainer();

	if(product.bonus)
	{
		var x = 0;
		for(var bID in product.bonus.content)
		{
			var sprite = PIXI.Sprite.fromFrame('bonus-' + bID);
			sprite.position.x = x;
			x = sprite.width + sprite.position.x + 15;
			rewardAnimator.addChild(sprite);
		}
	}
	else if(product.pearl)
	{
		var sprite = PIXI.Sprite.fromFrame('app_pearl');
		rewardAnimator.addChild(sprite);

	}

	rewardAnimator.position.y = ATW.gameMidHeight() - rewardAnimator.height/2;
	rewardAnimator.position.x = ATW.gameMidWidth() - rewardAnimator.width/2;
	rewardAnimator.scale.x = rewardAnimator.scale.y = 0;
	this.addChild(rewardAnimator);

	var tl = new TimelineMax();

	tl.to(this.currentPage, 0.4, {alpha: 0});
	tl.to(rewardAnimator, 0.4, {alpha: 1}, 'start');
	tl.to(rewardAnimator.scale, 0.4, {x: 1, y: 1}, 'start');
	tl.from(rewardAnimator.position, 0.8, {y: '+=80', ease: Power2.easeOut}, 'start');
	tl.to(rewardAnimator, 1.2, {rotation: Util.Math2.degToRad(-360), ease: Power2.easeIn}, 'start+=1.3');
	tl.to(rewardAnimator.scale, 1.2, {x:5, y:5, ease: Power2.easeIn}, 'start+=1.3');
	tl.to(rewardAnimator, 0.5, {alpha:0}, '-=0.5');

	tl.call(function(){
		self.isAnim = false;
		self.removeChild(rewardAnimator);
		TweenMax.to(self.currentPage, 0.5, {alpha: 1});
	});
};


PopupShop.prototype.addLoading = function()
{
	this.removeLoading();

	this.loading = new PIXI.DisplayObjectContainer();
	var bg = new PIXI.Graphics();
	bg.beginFill(0x000000, 0.5)
		.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
		.endFill();

	this.loading.addChild(bg);

	var textBmp = new PIXI.BitmapText('Loading...', {font: "40px FredokaOne-Regular"});
	textBmp.position.x = ATW.gameMidWidth() - textBmp.width/2;
	textBmp.position.y = ATW.gameMidHeight() - textBmp.height/2;
	this.loading.addChild(textBmp);

	this.loading.interactive = true;
	this.loading.touchstart = this.loading.mousedown = function() {}

	this.addChild(this.loading);


};

PopupShop.prototype.removeLoading = function()
{
	if(!this.loading) return;

	this.removeChild(this.loading);
	this.loading = null;
};



PopupShop.prototype.createRibbon = function(theme, txt) {
	var sprite = PIXI.Sprite.fromFrame('sh_ribbon_' + theme);

	var colorTxt = (theme == 'green') ? 0x2b7062 : 0x0c7fa9;

	var txtBmp = new PIXI.BitmapText(txt, {font: "26px FredokaOne-Regular", tint: colorTxt});
	txtBmp.position.x = sprite.width/2 - txtBmp.width/2;
	txtBmp.position.y = 5;
	sprite.addChild(txtBmp)


	return sprite;


};

PopupShop.prototype.createBloc = function(theme){

	var bc = PIXI.Sprite.fromFrame('sh_background_' + theme);

	var container = new PIXI.Graphics();
	container.beginFill(this.getColorStroke(theme))
		.drawRoundedRect(0,0, bc.width +8, bc.height+8, 30)
		.endFill()

	bc.position.x = container.width/2 - bc.width/2;
	bc.position.y = container.height/2 - bc.height/2;
	container.addChild(bc);

	return container;
};

PopupShop.prototype.getColorStroke = function(theme){
	return (theme == 'green') ? 0x2b7062 : 0x0c7fa9;


};

PopupShop.prototype.cleanPage = function()
{
	if(this.currentPage) {
		this.removeChild(this.currentPage);
		this.currentPage = null;
	}
};


exports.PopupShop = PopupShop;

})(window.UI = window.UI || {});

/**** display/popup/PopupDailyReward.js ****/
'use strict';

(function(exports){

function PopupDailyReward(scene)
{
	this.footerBar = scene.view.getElementById('footerBar');
	this.footerBarBtn = scene.view.getElementById('button_daily_reward');

	this.dr = null;

	var cfRewards = ATW.Datas.DAILYREWARD;
	for(var i in cfRewards)
	{
		this.dr = cfRewards[i];
		break;
	}


	this.availableRewards = [];
	var jackpot = null
	, useJackpot = false
	, cfsBonus = ATW.Datas.BONUS
	, player = ATW.App.getPlayer();

	for(var i in this.dr.rewards) {
		var r = this.dr.rewards[i];

		if(r.key == 'JACKPOT') {
			jackpot = r;
			continue;
		}

		if(!r.bonus_id) {
			this.availableRewards.push(r);
		} else {
			var bonus = cfsBonus[r.bonus_id];
			if(player.isTutoFisnish(bonus.tuto_key)) {
				this.availableRewards.push(r);
				useJackpot = true;
			}
		}
	}

	if(useJackpot) this.availableRewards.push(jackpot);

	this.realProbaHelper = new Util.Probability(this.availableRewards, 'real_proba');
	this.fakeProbaHelper = new Util.Probability(this.availableRewards, 'fake_proba');

	Util.Popup.call(this);

};

PopupDailyReward.constructor = PopupDailyReward;
PopupDailyReward.prototype = Object.create(Util.Popup.prototype);

PopupDailyReward.prototype.create = function()
{

	var container = new PIXI.DisplayObjectContainer()
	, title = PIXI.Sprite.fromFrame('popup_dr_title')
	, cushion = PIXI.Sprite.fromFrame('popup_dr_cushion')
	, self = this;

	container.addChild(title);

	this.shapes = [];

	var x=0;
	for(var i=0; i<this.dr.nb_pieces; i++) {
		var shape = new PIXI.DisplayObjectContainer()
			, close = PIXI.Sprite.fromFrame('popup_dr_box_close')
			, open = PIXI.Sprite.fromFrame('popup_dr_box_open');


		open.alpha = 0;

		shape.addChild(close);
		shape.addChild(open);

		shape.storage = {
			openState: open,
			closeState: close
		};

		shape.interactive = true;
		shape.mousedown = shape.touchstart = function(shape, i){
			return function(){
				self.choice(shape, i);
			}
		}(shape, i);

		this.shapes.push(shape);

		if(i == 0) shape.position.x = 65;
		else if(i == 1) shape.position.x = 215;
		else shape.position.x = 370;

		shape.position.y = -160;
		cushion.addChild(shape);
	}


	var tipHeight = 45, tipWidth = 530;
	var tipContainer = new PIXI.Graphics();
	tipContainer.beginFill(0x000000, 0.7)
		.drawRoundedRect(0,0, tipWidth, tipHeight, 20)
		.endFill();


	var tipBmp = new PIXI.BitmapText(_2(this.dr.tips), {font: "24px FredokaOne-Regular"});
	tipBmp.position.x =  tipContainer.width/2 - tipBmp.width/2;
	tipBmp.position.y = tipContainer.height/2 - tipBmp.height/2;
	tipContainer.addChild(tipBmp);

	cushion.position.y = container.height + 140;

	container.addChild(cushion);

	title.position.x = container.width/2 - title.width/2;

	tipContainer.position.y = container.height + 20;
	tipContainer.position.x = container.width/2 - tipContainer.width/2;
	container.addChild(tipContainer);

	this.btnAccept = Util.DisplayObject.buttonGreen(_ts('recuperer'));
	this.btnAccept.visible = false;
	this.btnAccept.scale.x = this.btnAccept.scale.y = 1.3;
	this.btnAccept.position.y = container.height + 30;
	this.btnAccept.position.x = container.width/2 - this.btnAccept.width/2;
	this.btnAccept.onHit = this.acceptHandler.bind(this);

	container.addChild(this.btnAccept);


	container.position.x = ATW.gameMidWidth() - container.width/2;
	container.position.y = 130;

	this.addChild(container);

	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);


};

PopupDailyReward.prototype.acceptHandler = function()
{
	if(this.acceptHandlerDone) return;

	this.acceptHandlerDone = true;

	this.footerBar.removeChild(this.footerBarBtn);

	var boundedBox = Util.Screen.boundedBox();

	var newBtn = Prefab.daily_reward_btn();
	newBtn.position.x = boundedBox.xMax - newBtn.width/2 - 20;
	newBtn.position.y = newBtn.height/2 - 5;

	this.footerBar.addChild(newBtn);
	this.close();
};


PopupDailyReward.prototype.animDiscover = function(shape, reward, stay)
{
	// var $shapeOff = $chosenPiece.find('.shape.off');
	// var $shapeOn = $chosenPiece.find('.shape.on');

	var shapeOn = shape.storage.openState
		, shapeOff = shape.storage.closeState
		, rewardSprite = null;

	var highlightKey = '';

	if(reward.bonus_id)
	{
		highlightKey = 'bonus-' + reward.bonus_id;

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);

	}
	else if(reward.pearl)
	{
		highlightKey = 'app_pearl';

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);
	}
	else if(reward.key)
	{
		highlightKey = reward.key;

		rewardSprite = PIXI.Sprite.fromFrame(highlightKey);
		rewardSprite.position.x = shape.width/2 - rewardSprite.width/2;
		shape.addChild(rewardSprite);
	}

	rewardSprite.position.y = 165;

	var openDuration = 0.25;
	if(stay)
	{
		this.tlStay = new TimelineMax({repeat: -1, yoyo: true});
		this.tlStay.to(rewardSprite.position, 0.3, {y: '-=30', scaleX: 0.8, scaleY: 1.2}, 'start');
		this.tlStay.to(rewardSprite.scale, 0.3, {x: 0.8, y: 1.2}, 'start');
	}
	else
	{
		var tlVanished = new TimelineMax();
		tlVanished.to(rewardSprite.scale,  0.8, {x: 1.5, y:1.5});
		tlVanished.to(rewardSprite,  0.5, {alpha:0}, '-=0.5');
		tlVanished.to(shapeOn, 0.3, {alpha:0}, 'shape');
		tlVanished.to(shapeOff, 0.3, {alpha:1}, 'shape');

		openDuration = 0.5;
	}

	var tl = new TimelineMax();

	tl.to(shapeOn, openDuration, {alpha:1}, 'start');
	tl.to(shapeOff, openDuration, {alpha:0}, 'start');

};

PopupDailyReward.prototype.choice = function(shape, i) {
	if(this.choiceDone) return;

	this.choiceDone = true;

    var reward = this.realProbaHelper.rand()
    	, self = this;
    this.animDiscover(shape, reward, true);
    this.btnAccept.visible = true;

    setTimeout(function(){
		var staggerBy = 500;
		self.shapes.forEach(function(shape, key){
			if(key != i) {
				var fakeReward = self.fakeProbaHelper.rand();
				setTimeout(function(){
					self.animDiscover(shape, fakeReward);
				}, staggerBy);

				staggerBy += staggerBy;

			}

		})
	}, 300)

    var player = ATW.App.getPlayer();
    player.waitingDailyGift = false;

    var baseData = {waitingDailyGift: false};
    // var baseData = {};
	if(reward.bonus_id)
	{
		player.incrBonus(reward.bonus_id, reward.qty);
		ATW.App.getDataManager().getApi().call('Bonus', 'POST', {
			on: 'me',
			data: {
				id: reward.bonus_id,
				quantity: player.getBonus(reward.bonus_id).getQuantity()
			}
		});

		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: baseData
		}, function(res){});
	}
	else if(reward.pearl)
	{
		player.incrPearls(reward.qty);
		ATW.App.refreshPearl();

		baseData.pearls = player.getPearls();

		ATW.App.getDataManager().getApi().call('User', 'POST', {
			on: 'me',
			data: baseData
		}, function(res){});
	}
	else if(reward.key)
	{
		switch(reward.key)
		{
			case 'HEART_ACCELERATOR':
				// App.getPlayer().heartAccelerator = true;
				player.createAccel("heartAccelerator");
				baseData.heartAccelerator = true;

				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();
				});
				break;

			case 'SCORE_ACCELERATOR':
				player.createAccel("scoreAccelerator");
				baseData.scoreAccelerator = true;
				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();

				});
				break;

			case 'TIME_BOOSTER':
				// App.getPlayer().timeBooster = true;
				player.createAccel("timeBooster");
				baseData.timeBooster = true;
				ATW.App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){
					player.myUpdate(res);
					Util.Date.refreshAccelAt();

				});
				break;

			case 'JACKPOT':
				var drRewards = this.availableRewards;

				baseData.bonusMap = {};
				for(var i in drRewards)
				{
					drReward = drRewards[i];
					if(drReward.bonus_id)
					{
						player.incrBonus(drReward.bonus_id, drReward.qty);
						baseData.bonusMap[drReward.bonus_id] = {
							quantity: player.getBonus(drReward.bonus_id).getQuantity(),
							id: drReward.bonus_id
						};
					}

				}

				App.getDataManager().getApi().call('User', 'POST', {
					on: 'me',
					data: baseData
				}, function(res){});

				break;

			default:
				break;
		}
	}

};


exports.PopupDailyReward = PopupDailyReward;

})(window.UI = window.UI || {});

/**** display/game/Fish.js ****/
'use strict';
(function(exports){
var Fish = {};

Fish.standingAvatar = function(scene, $avatar, o)
{
	if(!o) var o = {};
	if(!o.in) o.in = {scaleY: 0.75};
	if(!o.out) o.out = {scale: 0.8};

	var tl = new TimelineMax({repeat: -1, repeatDelay: 0});
	tl.to($avatar, 1.2, o.in);
	tl.to($avatar, 1.3, o.out);

	scene._addAnim(tl, 'avatar');
};

Fish._switchMode = function(fish, wantedState, tl, progress)
{
	if(!tl) var tl = new TimelineMax();

	var positionIni = "start",
		positionEnd = "start",
		fishView = fish.view;

	if(progress)
	{
		positionIni = "+=0";
		positionEnd = "-=0.3";
	}
	var wantedCorpulence = (fish.isFat()) ? Fish.CORPULENCE.BIG : Fish.CORPULENCE.NORMAL;
	// if(fishView.corpulence != wantedCorpulence || fishView.state != Fish.STATE.DEFAULT){
		tl.to(fishView.currentDisplay, 0.17, {alpha: 0}, positionIni);
	// }

	if(fish.ghost){
		wantedState = (Fish.STATE.SELECTED == wantedState )? Fish.STATE.GHOST_SELECTED : Fish.STATE.GHOST;
		wantedCorpulence = Fish.CORPULENCE.NORMAL;
	}

	var idDisplay = wantedState +"-"+ wantedCorpulence;;
	fishView.state = wantedState;
	fishView.corpulence = wantedCorpulence;

	fishView.currentDisplay = fishView.storage[idDisplay];
	tl.to(fishView.currentDisplay, 0.17, {alpha: 1}, positionEnd);
};

Fish.toSelect = function(fish, tl)
{
	if(!tl) var tl = new TimelineMax();

	this._switchMode(fish, Fish.STATE.SELECTED, tl);
	this.smile(fish, tl, 0.3);
};


Fish.toDefault = function(fish, tl)
{
	if(!tl) var tl = new TimelineMax();
	this._switchMode(fish, Fish.STATE.DEFAULT, tl);
};




Fish.toError = function(fish, tl, onComplete)
{
	fish.errorState = true;


	if(!tl) var tl = new TimelineMax();

	this._switchMode(fish, Fish.STATE.ERROR, tl);

	tl.call(function(){
		fish.errorState = false;
		if(onComplete) onComplete();

	});

};



Fish.smile = function(fish, tl, at)
{
	if(!tl) var tl = new TimelineMax();
	if(!at) var at = 0;

	var view = fish.view,
		oriExpr = (fish.isFat()) ? view.storage['fatExp'] : view.storage['basicalExp'];

	var newExpr = view.storage['smileExp'];
	tl.to(oriExpr, 0.2, {alpha: 0}, '+=' + at);
	tl.to(newExpr, 0.2, {alpha: 1}, '-=0.2');

	tl.to(newExpr, 0.2, {alpha: 0}, '+=0.2');
	tl.to(oriExpr, 0.2, {alpha: 1}, '-=0.2');

};

Fish.eat = function(fish, tl, at)
{
	if(!tl) var tl = new TimelineMax();
	if(!at) var at = 0;

	var view = fish.view;

	tl.to(view.storage[view.smiling], 0.2, {alpha: 0}, '+=' + at);

	view.smiling = 'fatExp';
	tl.to(view.storage[view.smiling], 0.2, {alpha: 1}, '-=0.2');
};


Fish.toValidate = function(fish, tl, onComplete)
{

	if(!tl) var tl = new TimelineMax();

	var wantedState = (fish.isGrey()) ? Fish.STATE.GREY : Fish.STATE.VALIDATED;
	this._switchMode(fish, wantedState, tl);
	if(onComplete) tl.call(onComplete);

};

Fish.toBig = function(fish, tl)
{
	var view = fish.view;

	if(!tl) var tl = new TimelineMax();

	switch(fish.getBonus())
	{
		case Game.Grid.BONUS_JOKER:
			var textContainer = view.storage['textContainer'];
			textContainer.cacheAsBitmap = null;
			var onComplete = function(fish) {
				return function(){
					var newLetter = fish.getLetter();

					var childrens = textContainer.children;
					for(var i=0; i<childrens.length; i++) {
						var children = childrens[i];
						children.setText(newLetter);
					}

					var text = new PIXI.BitmapText(newLetter, {font: "44px FredokaOne-Regular"});
					textContainer.position.x = ~~(view.width/2 - text.width/2);

				}
			}(fish);

			tl.to(textContainer, 0.2, {alpha:0, onComplete: onComplete});
			tl.to(textContainer, 0.2, {alpha:1});
			tl.call(function(){
				textContainer.cacheAsBitmap = true;
			});

			break;

		case Game.Grid.BONUS_BOMB:
		case Game.Grid.BONUS_HOLE:
		case Game.Grid.BONUS_HELP:
		case Game.Grid.BONUS_BONUS:
		case Game.Grid.BONUS_SWAP:
			// $letter.html(fish.getLetter());
			break;
	}

	var stomach = view.storage['stomach'],
		foodOpacity = 0.8,
		food = null;

	stomach.removeChildren();

	if(fish.hasBonus())
	{
		var groundObject = fish.getBonus().getGroundObject();
		food = PIXI.Sprite.fromFrame('object-' + groundObject.id);

		if(fish.getBonus().isBomb()) foodOpacity = 0.5;
	}
	else if(fish.hasPearl()) {
		food = PIXI.Sprite.fromFrame('app_pearl');
		food.position.y = 13;
		food.position.x = -2;
	}


	var doProgress = (tl) ? true : false
	this._switchMode(fish, view.state, tl, doProgress);


	this.eat(fish, tl);

	if(food)
	{
		food.position.x += ~~(view.width/2 - food.width/2);
		food.position.y += 5;

		food.alpha = 0;
		food.scale.x = food.scale.y = 0;

		stomach.addChild(food);

		tl.to(food, 0.3, {alpha: foodOpacity}),

		tl.to(food, 0.3, {alpha:foodOpacity}, "-=0.85");
		tl.to(food.scale, 0.3, {x:1, y:1}, "-=1.25");
	}

};


Fish.simpleLetter = function(fish)
{
	if(!fish) return;

	var view = fish.view
		, textContainer = view.storage['textContainer']
		, newLetter = fish.getLetter()
		, tl = new TimelineMax();

	textContainer.cacheAsBitmap = null;

	tl.to(textContainer, 0.1, {alpha:0, onComplete: function(){
		var childrens = textContainer.children;
		for(var i=0; i<childrens.length; i++) {
			var children = childrens[i];
			children.setText(newLetter);
		}

		textContainer.cacheAsBitmap = true;
	}});
	tl.to(textContainer, 0.1, {alpha:1});
};

Fish.addJoker = function(fish) {
	var accessoriesContent = fish.accessoriesContent;

	var sprite = PIXI.Sprite.fromFrame('ig_joker');
	accessoriesContent.addChild(sprite);
};


Fish.createView = function(builder, fish)
{
	fish.created = true;


	var letter = fish.getLetter().toUpperCase(),
		container = new PIXI.DisplayObjectContainer(),
		revert = true;

	fish.view = container;

	container.state = Fish.STATE.DEFAULT;
	container.corpulence = Fish.CORPULENCE.NORMAL;
	container.storage = {};

	var bgDefault = new PIXI.Sprite(PIXI.Texture.fromFrame('blue_fish_default'));

	var bgFat = PIXI.Sprite.fromFrame('blue_fish_big');
	bgFat.position.x = ~~(bgDefault.width/2 - bgFat.width/2);
	bgFat.position.y = -3;
	bgFat.alpha = 0;

	var bgSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('yellow_fish_default'))
	bgSelected.position.y = -1;
	bgSelected.alpha = 0;

	var bgValidated = new PIXI.Sprite(PIXI.Texture.fromFrame('green_fish_default'))
	bgValidated.position.y = -1;
	bgValidated.alpha = 0;

	var bgGrey = new PIXI.Sprite(PIXI.Texture.fromFrame('grey_fish_default'))
	bgGrey.position.y = -1;
	bgGrey.alpha = 0;

	var bgError = new PIXI.Sprite(PIXI.Texture.fromFrame('red_fish_default'))
	bgError.alpha = 0;

	var bgGhost = new PIXI.Sprite(PIXI.Texture.fromFrame('ig_ghost_board'))
	bgGhost.alpha = 0;
	bgGhost.position.x = 2;

	var bgGhostSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('ig_ghost_board_selected'))
	bgGhostSelected.alpha = 0;
	bgGhostSelected.position.x = 2;

	var bgFatSelected = new PIXI.Sprite(PIXI.Texture.fromFrame('yellow_fish_big'))
	bgFatSelected.position.x = ~~(bgDefault.width/2 - bgFatSelected.width/2);
	bgFatSelected.position.y = -1;
	bgFatSelected.alpha = 0;

	var bgFatValidated = new PIXI.Sprite(PIXI.Texture.fromFrame('green_fish_big'))
	bgFatValidated.position.x = ~~(bgDefault.width/2 - bgFatValidated.width/2);
	bgFatValidated.position.y = -1;
	bgFatValidated.alpha = 0;


	var bgFatGrey = new PIXI.Sprite(PIXI.Texture.fromFrame('grey_fish_big'))
	bgFatGrey.position.x = ~~(bgDefault.width/2 - bgFatGrey.width/2);
	bgFatGrey.position.y = -1;
	bgFatGrey.alpha = 0;

	var bgFatError = new PIXI.Sprite(PIXI.Texture.fromFrame('red_fish_big'))
	bgFatError.position.x = ~~(bgDefault.width/2 - bgFatError.width/2);
	bgFatError.position.y = -1;
	bgFatError.alpha = 0;



	var text = new PIXI.BitmapText(letter, {font: "44px FredokaOne-Regular"});
	var textContainer = Util.DisplayText.shadow(text, 2, 1, 0x080808, 0.5);
	textContainer.position.x = ~~(bgDefault.width/2 - text.width/2)-2;
	textContainer.position.y = 15;

	// textContainer.refId = "letter-" + fish.id;
	// builder.save(textContainer);

	textContainer.cacheAsBitmap = true;

	var accessoriesContent = new PIXI.DisplayObjectContainer();

	var basicalExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_default'));
	basicalExp.position.y = bgDefault.height - basicalExp.height - 13;
	basicalExp.position.x = ~~(bgDefault.width/2 - basicalExp.width/2) + 3;

	var smileExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_smile'));
	smileExp.position.y = bgDefault.height - smileExp.height - 13;
	smileExp.position.x = ~~(bgDefault.width/2 - smileExp.width/2) + 3;
	smileExp.alpha = 0;

	var fatExp = new PIXI.Sprite(PIXI.Texture.fromFrame('face_eat'));
	fatExp.position.y = bgDefault.height - fatExp.height - 13;
	fatExp.position.x = ~~(bgDefault.width/2 - fatExp.width/2) + 3;
	fatExp.alpha = 0;

	var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
	shadow.position.y = bgDefault.height - shadow.height +5;
	shadow.position.x = 6;

	var stomach = new PIXI.DisplayObjectContainer();


	container.addChild(shadow);

	// --------------------------------------------------------------
	// normal state
	// --------------------------------------------------------------
	container.storage[Fish.STATE.DEFAULT + "-" + Fish.CORPULENCE.NORMAL] = bgDefault;
	container.addChild(bgDefault);

	container.storage[Fish.STATE.SELECTED + "-" + Fish.CORPULENCE.NORMAL] = bgSelected;
	container.addChild(bgSelected);

	container.storage[Fish.STATE.VALIDATED + "-" + Fish.CORPULENCE.NORMAL] = bgValidated;
	container.addChild(bgValidated);

	container.storage[Fish.STATE.GREY + "-" + Fish.CORPULENCE.NORMAL] = bgGrey;
	container.addChild(bgGrey);

	container.storage[Fish.STATE.ERROR + "-" + Fish.CORPULENCE.NORMAL] = bgError;
	container.addChild(bgError);

	container.storage[Fish.STATE.GHOST + "-" + Fish.CORPULENCE.NORMAL] = bgGhost;
	container.addChild(bgGhost);

	container.storage[Fish.STATE.GHOST_SELECTED + "-" + Fish.CORPULENCE.NORMAL] = bgGhostSelected;
	container.addChild(bgGhostSelected);

	// --------------------------------------------------------------
	// big state
	// --------------------------------------------------------------
	container.storage[Fish.STATE.DEFAULT + "-" + Fish.CORPULENCE.BIG] = bgFat;
	container.addChild(bgFat);

	container.storage[Fish.STATE.SELECTED + "-" + Fish.CORPULENCE.BIG] = bgFatSelected;
	container.addChild(bgFatSelected);

	container.storage[Fish.STATE.VALIDATED + "-" + Fish.CORPULENCE.BIG] = bgFatValidated;
	container.addChild(bgFatValidated);

	container.storage[Fish.STATE.GREY + "-" + Fish.CORPULENCE.BIG] = bgFatGrey;
	container.addChild(bgFatGrey);

	container.storage[Fish.STATE.ERROR + "-" + Fish.CORPULENCE.BIG] = bgFatError;
	container.addChild(bgFatError);


	// --------------------------------------------------------------
	// Body
	// --------------------------------------------------------------

	container.storage['stomach'] = stomach;
	container.addChild(stomach);

	container.storage['basicalExp'] = basicalExp;
	container.addChild(basicalExp);

	container.storage['smileExp'] = smileExp;
	container.addChild(smileExp);

	container.storage['fatExp'] = fatExp;
	container.addChild(fatExp);

	container.storage['accessoriesContent'] = accessoriesContent;
	container.addChild(accessoriesContent);


	container.storage['textContainer'] = textContainer;
	container.addChild(textContainer);

	container.smiling = 'basicalExp';

	container.pivot.x = ~~(container.width/2);
	container.pivot.y = ~~(container.height/2);
	container.position.x += container.pivot.x;
	container.position.y += container.pivot.y;

	Game.LetterFish.regenLetter(fish);


	container.interactive = true;
	container.touchstart = container.mousedown = function(){
		if(fish.onHit) fish.onHit();
	}

	container.currentDisplay = container.storage[container.state + "-"+ container.corpulence];


	return container;
};

Fish.STATE                 = {};
Fish.STATE.DEFAULT         = 'default';
Fish.STATE.SELECTED        = 'selected';
Fish.STATE.VALIDATED       = 'validated';
Fish.STATE.GREY            = 'grey';
Fish.STATE.ERROR           = 'error';
Fish.STATE.GHOST           = 'ghost';
Fish.STATE.GHOST_SELECTED = 'ghost_selected';

Fish.CORPULENCE        = {};
Fish.CORPULENCE.NORMAL = 'normal';
Fish.CORPULENCE.BIG    = 'obese';

exports.Fish = Fish;
})(window.UI = window.UI || {});

/**** display/game/Ground.js ****/
'use strict';
(function(exports){

var Ground = {};

Ground.destructWall = function(view, ground) {

	var wallId = 'wall-' + ground.id
		, assetsField = view.getElementById('assetsField')
		, oldWall = view.getElementById(wallId)
		, newWall = PIXI.Sprite.fromFrame('wall_' + ground.wall)
		, attachTo = assetsField;

	newWall.position.y = oldWall.y;
	if(ground.wall == 1) newWall.position.y += 23;
	else if(ground.wall == 0) {
		newWall.position.y += 10;
		attachTo = view.getElementById('groundsDyn');
	}

	newWall.position.x = oldWall.x;
	newWall.refId = wallId;
	newWall.alpha = 0;

	view.save(newWall, true);
	attachTo.addChild(newWall);

	TweenLite.to(oldWall, 0.3, {alpha: 0, onComplete: function(){
		assetsField.removeChild(oldWall);
	}});
	TweenLite.to(newWall, 0.3, {alpha: 1});

	Util.Sound.fxPlay('fx/meduse_mur');
};


exports.Ground = Ground;


})(window.UI = window.UI || {});

/**** views/scenes/home_scene.view.js ****/
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

	builder.add(setting);



};


})(window.View = window.View || {});


/**** views/scenes/loading_scene.view.js ****/
'use strict';

(function(views){

views.loading_scene = function build_loading_scene(builder) {

	var group = new PIXI.DisplayObjectContainer();

	// --------------------------------------------------------------
	// Creation de la bulle et du background
	// --------------------------------------------------------------
	var bubble = new PIXI.Sprite(PIXI.Texture.fromFrame('main_loader_background'));
	Util.Screen.toFullScreen(bubble);


	// var map = new PIXI.TilingSprite(PIXI.Texture.fromFrame('main_loader_map'), 1024, 768)
	if(EXPORT_PLATFORM == 'facebook') {
		var map = new PIXI.TilingSprite(PIXI.Texture.fromFrame('main_loader_map'), 1024, 614);
	} else {
		var map = new PIXI.Sprite(PIXI.Texture.fromFrame('main_loader_map'));

	}


	map.refId = "map";

	map.scale.x = map.scale.y = 1.2;
	if(EXPORT_PLATFORM != 'facebook') {
		map.position.x = ~~(bubble.width/2 - map.width/2);
	}

	// map.position.y = ~~(bubble.height/2 - map.height/2) - 70;
	map.position.y = ~~(bubble.height/2 - map.height/2) - 60;

	// map.alpha = 0;


	group.addChild(map);
	group.addChild(bubble);

	group.position.x = ~~(ATW.gameMidWidth() - group.width/2);
	group.position.y = ~~(ATW.gameMidHeight() - group.height/2);
	if(ATW.gameWidth() < 1000) group.position.x -= 30;


	builder.add(group)

	// --------------------------------------------------------------
	// Ajout du logo
	// --------------------------------------------------------------
	var logo = new PIXI.Sprite(PIXI.Texture.fromFrame('app_logo'));

	if(ATW.gameWidth() > 1000) logo.scale.x = logo.scale.y = 0.8;
	else logo.scale.x = logo.scale.y = 0.65;

	logo.anchor.x = logo.anchor.y = 0.5;

	logo.position.x = ATW.gameMidWidth();
	if(ATW.gameWidth() < 1000) logo.position.x -= 5;
	else logo.position.x += 25
	logo.position.y = ATW.gameMidHeight() - 40;
	// logo.alpha = 0;

	logo.refId = "logo";

	builder.add(logo);


	// --------------------------------------------------------------
	// Chargement
	// --------------------------------------------------------------
	// var label = new PIXI.BitmapText('Chargement...', {font: "60px FredokaOne-Regular", align:"center"});
	// var text = new PIXI.BitmapText('Chargement...', {font: "60px FredokaOne-Regular"});
	var text = new PIXI.BitmapText(_ts('Chargement') + '...', {font: "60px FredokaOne-Regular"});
	var label = Util.DisplayText.shadow(text, 4, 1, 0x0d0d0d, 0.5);

	label.refId = "label";
	label.position.y = ATW.gameHeight() - label.height - 60;
	Util.DisplayObject.centerX(ATW.gameWidth(), label);

	builder.add(label);


	// --------------------------------------------------------------
	// Sauvegarde les refs
	// --------------------------------------------------------------
	builder.save(map);

};


})(window.View = window.View || {});


/**** views/scenes/world_scene.view.js ****/
'use strict';
(function(views){

views.world_scene = function build_world_scene(builder) {
	var boundedBox = Util.Screen.boundedBox();

	// --------------------------------------------------------------
	// Worlds slider
	// --------------------------------------------------------------
	if(ATW.isMobile()) {
		// createFirstWorld(builder);

		var blur = PIXI.Sprite.fromFrame('world_glow');
		blur.position.x = ATW.gameMidWidth() - blur.width/2;
		blur.position.y = ATW.gameMidHeight() - blur.height/2;
		builder.add(blur);

		var worldDatas = ATW.Datas.WORLDS;
		builder.createWorld = function(i, cWorld, cfPrefab) {
			var centerX = ATW.gameMidWidth()
				, centerY = ATW.gameMidHeight()
				, c = 0;

			if(!cWorld) {
				for(var worldID in worldDatas){
					if(c == i) {
						var cWorld = worldDatas[worldID];
					}

					c++;

				}
			}

			var world = new UI.World(cWorld, true)
			, worldPrefab = world.prefab;

			worldPrefab.position.x = centerX;
			worldPrefab.position.y = centerY;
			worldPrefab.refId = 'world_' + i;

			if(cfPrefab) {
				for(var key in cfPrefab) {
					worldPrefab[key]= cfPrefab[key];
				}
			}

			builder.add(worldPrefab, true);

			return worldPrefab;
		}

		builder.createWorld(0);
		// var i=0;
		// for(var worldID in worldDatas){
		// 	var o = {};
		// 	if(i) o.visible = false;
		// 	builder.createWorld(i++, worldDatas[worldID], o);
		// }


		createSlideArrow(builder, boundedBox);

	} else {
		createWorlds(builder);
	}

		// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------
	Partial.header_partial(builder, boundedBox);

	// --------------------------------------------------------------
	// Bottom bar
	// --------------------------------------------------------------
	Partial.bottom_partial(builder, boundedBox, {
		button_previous: true,
		daily_reward: true
	});


};

function createSlideArrow(builder, boundedBox) {
	var leftArrow = Util.DisplayObject.button('app_left_arrow')
		, rightArrow = Util.DisplayObject.button('app_right_arrow')
		, centerY = ATW.gameMidHeight();

	leftArrow.refId = 'leftArrow';
	rightArrow.refId = 'rightArrow';

	leftArrow.position.x = boundedBox.x + ~~(leftArrow.width/2) + 15;
	leftArrow.position.y = centerY;
	leftArrow.alpha = 0;
	leftArrow.visible = false;

	rightArrow.position.x = boundedBox.xMax - (rightArrow.width/2) - 15;
	rightArrow.position.y = centerY;

	builder.add(leftArrow);
	builder.add(rightArrow);

};



function createWorlds(builder, options) {

	var centerX = ATW.gameMidWidth(),
		scaleHighlight = builder.container.scaleHighlight,
		scaleSecondary = builder.container.scaleSecondary,
		scaleAll = 0.8
		// , depth = new Util.Depth({x: centerX}, 300, 1.2)
		;

	var buildWorlds = [];

	var i = 0
		, lastPrefab = null
		, worldDatas = ATW.Datas.WORLDS;
	for(var worldID in worldDatas){
		var cWorld = worldDatas[worldID];
		var world = new UI.World(cWorld, true);
		var worldPrefab = world.prefab;

		var widthOri = worldPrefab.width;

		worldPrefab.position.y = ATW.gameMidHeight();
		if(lastPrefab) {
			worldPrefab.position.x = lastPrefab.position.x + lastPrefab.width;
			worldPrefab.position.x -= widthOri - world.prefab.width;
		}
		worldPrefab.scale.x = worldPrefab.scale.y = scaleSecondary;
		worldPrefab.refId = 'world_'+ i;

		builder.save(worldPrefab);


		buildWorlds.push(world.prefab);

		lastPrefab = world.prefab;
		i++;
	}

	var worldContainer = new PIXI.DisplayObjectContainer();
	worldContainer.position.x = ATW.gameMidWidth();
	worldContainer.refId = "worldContainer";

	for(var i=buildWorlds.length-1; i>=0; i--) {
		worldContainer.addChild(buildWorlds[i]);
	}


	// worldMexico.prefab.scale.x = worldMexico.prefab.scale.y = scaleHighlight;

	builder.add(worldContainer);
};


})(window.View = window.View || {});

/**** views/scenes/level_scene.view.js ****/
'use strict';
(function(views){
views.level_scene = function build_level_scene(builder) {
	var boundedBox = Util.Screen.boundedBox();

	var bg = new PIXI.TilingSprite(PIXI.Texture.fromFrame('world_background'), ATW.gameWidth(), ATW.gameHeight());
	bg.refId = "tilingBg";
	builder.add(bg);


	// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------
	Partial.header_partial(builder, boundedBox);

	// --------------------------------------------------------------
	// Bottom bar
	// --------------------------------------------------------------


	var nbRoad = 3;
	var roadContainer = new PIXI.DisplayObjectContainer();
	roadContainer.refId = "roadContainer";

	var myWorld = builder.container.world;
	var worldId = myWorld.getId();
	var cfWorld = ATW.Datas.WORLDS[worldId];

	var titleSprite = PIXI.Sprite.fromFrame(cfWorld.key + '-title');
	titleSprite.position.x = ATW.gameMidWidth() - ~~(titleSprite.width/2);
	titleSprite.position.y = ATW.gameHeight() - titleSprite.height - 25;
	builder.add(titleSprite);


	Partial.bottom_partial(builder, boundedBox, {
		button_previous: true
	});


	// --------------------------------------------------------------
	// Monde courant
	// --------------------------------------------------------------
	var currentWorld = new UI.World(cfWorld);
	currentWorld.prefab.position.x = ~~(currentWorld.prefab.width/2);
	currentWorld.prefab.position.y = ~~(currentWorld.prefab.height/2);
	roadContainer.addChild(currentWorld.prefab);

	// --------------------------------------------------------------
	// Arriere plan
	// --------------------------------------------------------------
	var x = currentWorld.prefab.width;
	for(var i=1; i<=nbRoad; i++) {
		var scheme = new PIXI.Sprite.fromFrame(cfWorld.key + '_scheme' + i);
		scheme.position.x = x;
		x += scheme.width-2;
		roadContainer.addChild(scheme);
	}


	Util.Object.each(cfWorld.levels, function(levelId){
		var cLevel = ATW.Datas.LEVELS[levelId],
			order = parseInt(cLevel.order, 10),
			level = myWorld.getLevel(cLevel);


		var pointFrame = level.getPointFrame();

		var pointAvailable = (pointFrame != "world_point_off");


		var point = PIXI.Sprite.fromFrame(pointFrame);
		point.position.x = cLevel.point_x + 15;
		point.position.y = cLevel.point_y + 5;

		var s = order + 1;
		s = s.toString();
		var text = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
		var label = Util.DisplayText.shadow(text, 2, 1, 0x0d0d0d, 0.3);
		label.position.x = ~~(point.width/2 - label.width/2);
		label.position.y = 5;

		point.addChild(label);

		var starGroup = new PIXI.DisplayObjectContainer()
			, star =  Math.min(level.getStar(), 3)
			, margin = 5;

		if(star) {
			switch(star) {
				case 3:
					var leftStar = PIXI.Sprite.fromFrame('level_star_left');
					starGroup.addChild(leftStar);

					var centerStar = PIXI.Sprite.fromFrame('level_star_center');
					centerStar.position.y = 10;
					centerStar.position.x = leftStar.width + margin;
					starGroup.addChild(centerStar);

					var rightStar = PIXI.Sprite.fromFrame('level_star_right');
					rightStar.position.x = centerStar.width + centerStar.position.x + margin;
					starGroup.addChild(rightStar);


					break;

				case 2:
					var leftStar = PIXI.Sprite.fromFrame('level_star_left');
					starGroup.addChild(leftStar);

					var rightStar = PIXI.Sprite.fromFrame('level_star_right');
					rightStar.position.x = leftStar.width + leftStar.position.x + margin;
					starGroup.addChild(rightStar);

					break;

				case 1:
					var centerStar = PIXI.Sprite.fromFrame('level_star_center');
					starGroup.addChild(centerStar);

			}

			starGroup.position.x = point.position.x + ~~(point.width/2 - starGroup.width/2);
			starGroup.position.y = point.position.y + point.height + 10;

			roadContainer.addChild(starGroup);
		}

		point.refId = 'point-'+level.getId();
		builder.save(point);

		roadContainer.addChild(point);

		if(pointAvailable) {
			point.interactive = true;
			point.touchstart = point.mousedown = function(level){
				return function(){
					builder.container.onEnterPoint(level)
				}
			}(level);
		}

	});




	roadContainer.position.y = 130;

	builder.add(roadContainer);


};



})(window.View = window.View || {});

/**** views/scenes/game_scene.view.js ****/
'use strict';
(function(views){

views.game_scene = function build_game_scene(builder) {

	var scene = builder.container,
		level = scene.level,
		worldKey = level.getWorld().getKey(),
		game = scene.game,
		grid = game.getGrid(),
		mode = level.getMode(),
		fields = createFields(scene, builder, grid),
		boundedBox = Util.Screen.boundedBox(),
		pauseContainer = new PIXI.DisplayObjectContainer();

	var texture = PIXI.Texture.fromFrame('world_background_ingame');
	var bg = new PIXI.TilingSprite(texture, 1024, ATW.gameHeight());
	bg.anchor.x = bg.anchor.y = 0.5;
	bg.position.x = ATW.gameMidWidth();
	bg.position.y = ATW.gameMidHeight();

	builder.add(bg);


	// --------------------------------------------------------------
	// Header
	// --------------------------------------------------------------

	var headerContainer = Partial.header_partial(builder, boundedBox, {
		btnTrophy: false,
		btnCart: false,
		btnMessage: false
	}, ATW.isMobile());


	// --------------------------------------------------------------
	// Panel de gauche
	// --------------------------------------------------------------
	if(!ATW.isMobile()) {
		var worldMin = new PIXI.DisplayObjectContainer();

		var worldIcoGroup = new PIXI.DisplayObjectContainer();
		var graph = new PIXI.Graphics();
		graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 130, 45, 40)
			.endFill();
		graph.position.x = 15;
		graph.position.y = 7;
		graph.alpha = 0.3;
		worldIcoGroup.addChild(graph);


		var worldIco = PIXI.Sprite.fromFrame(worldKey + '-ico');
		worldIcoGroup.addChild(worldIco);

		var levelName = new PIXI.BitmapText(level.getName(), {font: "25px FredokaOne-Regular"});
		levelName.position.x = 75;
		levelName.position.y = 20;
		worldIcoGroup.addChild(levelName);

		worldIcoGroup.cacheAsBitmap = true;
		worldIcoGroup.position.x = -10;
		worldIcoGroup.position.y = -10;
		worldMin.addChild(worldIcoGroup);


		worldMin.position.y = 100;
		worldMin.position.x = boundedBox.x + 25;

		builder.add(worldMin);
	}


	var bonusGroup = createBonusList(builder, boundedBox);
	if(bonusGroup && !ATW.isMobile()) {
		bonusGroup.position.y = 210;
		bonusGroup.position.x = 70;
		builder.add(bonusGroup);
	}




	// --------------------------------------------------------------
	// Panel de droite
	// --------------------------------------------------------------
	var ghostContainer = new PIXI.DisplayObjectContainer(),
		ghostCache = new PIXI.DisplayObjectContainer(),
		graphWidth = 150,
		graphHeight = 45;

	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, graphWidth, graphHeight, 40)
		.endFill();

	graph.alpha = 0.3;

	var ghostIco = PIXI.Sprite.fromFrame('ig_ghost');
	ghostIco.scale.x = ghostIco.scale.y = 0.7;

	if(!ATW.isMobile()) ghostIco.position.x = graphWidth - ghostIco.width;
	else ghostIco.position.x = 0

	ghostIco.position.y = ~~(graphHeight/2 - ghostIco.height/2);
	ghostIco.refId = 'ghostIco';
	builder.save(ghostIco);

	ghostCache.addChild(graph);
	ghostCache.addChild(ghostIco);
	ghostCache.cacheAsBitmap = true;

	ghostContainer.addChild(ghostCache);

	var lifeText = new PIXI.BitmapText(game.life.toString(), {font: "25px FredokaOne-Regular"});
	if(!ATW.isMobile())  lifeText.position.x = ghostIco.position.x - lifeText.width - 10;
	else lifeText.position.x = ghostIco.position.x + ghostIco.width + 20;

	lifeText.position.y = 12;
	lifeText.refId = "lifeText";
	builder.save(lifeText);

	ghostContainer.addChild(lifeText);

	if(ATW.isMobile()) {
		ghostContainer.position.x = boundedBox.x + 20;
		ghostContainer.position.y = 20;
	} else {
		ghostContainer.position.x = boundedBox.xMax - ghostContainer.width - 20;
		ghostContainer.position.y = 100;
	}

	ghostContainer.refId = 'ghostContainer';
	builder.add(ghostContainer);

	// --------------------------------------------------------------
	// Jauge
	// --------------------------------------------------------------
	var gauge = createGauge(builder, mode, boundedBox);
	if(!ATW.isMobile()) {
		gauge.position.x = boundedBox.xMax - gauge.width + 45;
		gauge.position.y = 360;
	} else {

	}

	builder.add(gauge);


	// --------------------------------------------------------------
	// Titre & description
	// --------------------------------------------------------------
	var objText = createTitle(builder, mode);
	objText.position.x = ~~(ATW.gameMidWidth() - objText.width/2);
	// objText.position.y = fields.position.y - objText.height - 20;
	objText.position.y += fields.position.y - objText.height - 30;

	builder.add(objText);


	// --------------------------------------------------------------
	// Game
	// --------------------------------------------------------------
	fields.refId = 'fields';
	builder.add(fields);

	var waveContainer = createWave(builder, game);
	if(waveContainer) {
		if(ATW.isMobile()) {
			waveContainer.position.x = boundedBox.xMax - waveContainer.width - 10;
			waveContainer.position.y = 20;
		} else {
			waveContainer.position.x = fields.width + fields.position.x + 20;
			waveContainer.position.y = fields.position.y;
		}

		builder.add(waveContainer);
	}

	var wordContainer = createWordContainer(builder, fields, mode);
	wordContainer.oriPosition = {};
	wordContainer.oriPosition.x = wordContainer.position.x = ~~ (ATW.gameMidWidth() - wordContainer.width/2) + 35;
	wordContainer.oriPosition.y = wordContainer.position.y = fields.position.y + fields.height + 25;


	builder.add(wordContainer);


	// --------------------------------------------------------------
	// Interaction button
	// --------------------------------------------------------------
	if(!ATW.isMobile()) {
		var footerBtn = new PIXI.DisplayObjectContainer();

		var btnMenu = new UI.Button(PIXI.Texture.fromFrame('button_menu'));
		btnMenu.scale.x = btnMenu.scale.y = 0.8;
		btnMenu.position.x = boundedBox.x + btnMenu.width/2+ 20;
		btnMenu.refId = "btnMenu";
		builder.save(btnMenu);

		footerBtn.addChild(btnMenu);

		var btnRestart = new UI.Button(PIXI.Texture.fromFrame('button_reload'));
		// btnRestart.position.x = btnMenu.width + 10;
		btnRestart.position.x = boundedBox.xMax - btnRestart.width/2 - 20;
		btnRestart.scale.x = btnRestart.scale.y = 0.8;
		btnRestart.refId = "btnRestart";
		builder.save(btnRestart);

		footerBtn.addChild(btnRestart);

		footerBtn.position.y = ATW.gameHeight() - footerBtn.height;

		builder.add(footerBtn);
	} else {

		var btnPause = Util.DisplayObject.button('mobile-button-pause');
		btnPause.scale.x = btnPause.scale.y = 0.8;
		btnPause.position.x = ATW.gameMidWidth();
		btnPause.position.y = ATW.gameHeight() - ~~(btnPause.height/2) - 20;
		btnPause.refId = 'btnPause';

		builder.add(btnPause);
	}


	// --------------------------------------------------------------
	// Pause Scene
	// --------------------------------------------------------------
	if(ATW.isMobile()) {
		var	filter = new PIXI.Graphics();
		filter.beginFill(0x000000)
			.drawRect(0, 0, ATW.gameWidth(), ATW.gameHeight())
			.endFill();

		filter.alpha = 0.55;
		filter.refId = 'filterPause';
		builder.add(filter);
		pauseContainer.addChild(filter);

		// --- Header ---
		headerContainer.position.y = 60;
		pauseContainer.addChild(headerContainer);

		// --- Bonus ---
		bonusGroup.position.x = 60;
		bonusGroup.position.y = 400;
		pauseContainer.addChild(bonusGroup);


		// --- Footer ---
		var footerContainer = new PIXI.DisplayObjectContainer()
			, footerBg = PIXI.Sprite.fromFrame('ingame-pause-background')
			, buttonsContainer = new PIXI.DisplayObjectContainer();

		footerBg.position.x = ATW.gameMidWidth() - ~~(footerBg.width/2);
		footerBg.position.y = ATW.gameHeight() - footerBg.height;

		footerContainer.addChild(footerBg);

		var btnMenu = Util.DisplayObject.button('button_menu');
		btnMenu.scale.x = btnMenu.scale.y = 1.3;
		btnMenu.position.x = boundedBox.x + btnMenu.width/2 + 30;
		btnMenu.refId = "btnMenu";
		builder.save(btnMenu);

		buttonsContainer.addChild(btnMenu);

		var btnResume = Util.DisplayObject.button('button_previous');
		btnResume.scale.x = btnResume.scale.y = 1.7;
		btnResume.position.x = ATW.gameMidWidth();
		btnResume.refId = "btnResume";
		builder.save(btnResume);

		buttonsContainer.addChild(btnResume);

		var btnRestart = new Util.DisplayObject.button('button_reload');
		btnRestart.scale.x = btnRestart.scale.y = 1.4;
		btnRestart.position.x = boundedBox.xMax - ~~(btnRestart.width/2) - 30;
		btnRestart.refId = "btnRestart";
		builder.save(btnRestart);

		buttonsContainer.addChild(btnRestart);

		buttonsContainer.position.y = ATW.gameHeight() - 90;
		footerContainer.addChild(buttonsContainer);

		pauseContainer.addChild(footerContainer);

		pauseContainer.visible = false;
		pauseContainer.refId = 'pauseContainer';
		builder.add(pauseContainer);
	}


};

function createTitle(builder, mode) {
	var hasHourglass = mode.hasHourglass()
		, group = new PIXI.DisplayObjectContainer()
		, desc = mode.getDescription(0, 0, 0, true)
		, title = (!mode.isHanged()) ? _ts('Objectif') : desc + ' | ';


	var titleBmp = new PIXI.BitmapText(title, {font: "35px FredokaOne-Regular"});
	titleBmp = Util.DisplayText.shadow(titleBmp, 2, 0, 0x0d0d0d, 0.3);
	titleBmp.refId = 'titleBmp';
	builder.save(titleBmp);

	group.addChild(titleBmp);

	if(mode.isHanged()) desc = '';
	var descriptionText = new PIXI.BitmapText(desc, {font: "27px FredokaOne-Regular"});
	descriptionText = Util.DisplayText.shadow(descriptionText, 2, 0, 0x0d0d0d, 0.3);
	descriptionText.position.y = titleBmp.height + 5;
	group.addChild(descriptionText);



	titleBmp.position.x = ~~(group.width/2 - titleBmp.width/2);
	if(hasHourglass) {
		titleBmp.position.y = -5;

		var timerContainer = new PIXI.DisplayObjectContainer()
			, o = Util.Date.msToObject(parseInt(mode.getDuration()*1000,10))
			, timerBmp = new PIXI.BitmapText(o.min+':'+o.sec, {font: "35px FredokaOne-Regular"})
			, timerSprite = new PIXI.Sprite.fromFrame('ig_timer');

		timerSprite.position.x = timerBmp.width + 5;
		timerSprite.position.y = -2;

		timerBmp.refId = 'timerBmp';
		builder.save(timerBmp);

		timerContainer.addChild(timerBmp);
		timerContainer.addChild(timerSprite);

		timerContainer.position.y = titleBmp.position.y;
		timerContainer.position.x = titleBmp.position.x + titleBmp.width + 15;

		timerContainer.refId = 'timerContainer';
		builder.save(timerContainer);

		group.addChild(timerContainer);

	}

	group.oriWidth = group.width;
	descriptionText.position.x = ~~(group.width/2 - descriptionText.width/2);

	descriptionText.refId = 'descriptionText';
	builder.save(descriptionText);

	group.refId = 'groupTitle';

	return group;

};

function createWordContainer(builder, fields, mode) {
	var container = new PIXI.DisplayObjectContainer(),
		cacheContainer = new PIXI.DisplayObjectContainer(),
		textContainer = new PIXI.DisplayObjectContainer();

	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRect(0, 0, fields.width - 55, 50)
		.endFill();
	graph.alpha = 0.3;


	var btnCancel = new UI.Button(PIXI.Texture.fromFrame('button_cross'));
	btnCancel.position.y = (graph.height/2);
	btnCancel.refId = 'btnCancel';
	builder.save(btnCancel);


	var btnSubmit = new UI.Button(PIXI.Texture.fromFrame('button_validate'));
	btnSubmit.position.y = (graph.height/2);
	btnSubmit.position.x = graph.width;
	btnSubmit.refId = 'btnSubmit';
	builder.save(btnSubmit);


	cacheContainer.addChild(graph);

	cacheContainer.cacheAsBitmap = true;
	container.addChild(cacheContainer);

	container.addChild(btnCancel);
	container.addChild(btnSubmit);


	if(mode.isHanged()) {
		var btnSubmitUnselectable = Util.DisplayObject.button('button_validate_unselectable');
		btnSubmitUnselectable.buttonMode = false;
		btnSubmitUnselectable.position = btnSubmit.position;
		btnSubmitUnselectable.refId = 'btnSubmitUnselectable';
		builder.save(btnSubmitUnselectable);

		container.addChild(btnSubmitUnselectable);

		btnSubmit.alpha = 0;
	}


	textContainer.position.y = 9;
	container.addChild(textContainer);

	textContainer.refId = "textSubmit";
	builder.save(textContainer);

	container.refId = "wordContainer";
	container.alpha = 0;

	return container;
};


function createGauge(builder, mode, boundedBox){
	var group = new PIXI.DisplayObjectContainer(),
		goals       = mode.findGoals(),
		starsLength = goals.length;

	if(ATW.isMobile()) {
		var back = PIXI.Sprite.fromFrame('mobile_gauge_star_back')
			, stars = mode.findGoalsPos(back.width)
			, front = new PIXI.TilingSprite(PIXI.Texture.fromFrame('mobile_gauge_star_front'), 272, 29)
		 	, starGauge = new PIXI.DisplayObjectContainer()
		 	, ptsGroup = new PIXI.DisplayObjectContainer();

		front.width = 0;
		front.refId = 'frontMobileGauge';
		builder.save(front);

		back.refId = 'backMobileGauge';
		builder.save(back);


		starGauge.addChild(back);
		starGauge.addChild(front);

		var starContainer = new PIXI.DisplayObjectContainer();
		for(var i=0; i<starsLength; i++) {
			var offStar = PIXI.Sprite.fromFrame('ig_star_off')
				, onStar = PIXI.Sprite.fromFrame('ig_star_on')
				, pos = stars[i];

			offStar.scale.x = offStar.scale.y = 1.7;
			offStar.position.x = pos.y - ~~(offStar.width/2);
			offStar.refId = 'offStar-' + i;
			builder.save(offStar);

			onStar.scale.x = onStar.scale.y = 1.7;
			onStar.position.x = offStar.position.x + 5;
			onStar.alpha = 0;
			onStar.refId = 'onStar-' + i;
			builder.save(onStar)

			starContainer.addChild(offStar);
			starContainer.addChild(onStar);



		}

		starContainer.position.y = -15;

		starGauge.addChild(starContainer);
		group.addChild(starGauge);


		var graph = new PIXI.Graphics();
			graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 220, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		ptsGroup.addChild(graph);

		var ptsSprite = PIXI.Sprite.fromFrame('app_pts');
		ptsSprite.scale.x = ptsSprite.scale.y = 1.2;
		ptsSprite.position.x = -2;
		ptsSprite.position.y = -5;

		ptsGroup.addChild(ptsSprite);

		var scoreText = new PIXI.BitmapText("0", {font: "31px FredokaOne-Regular"})
		scoreText = Util.DisplayText.shadow(scoreText, 3, 0, 0x61605e, 0.7);
		scoreText.position.x = ptsSprite.position.x + ptsSprite.width + 15;
		scoreText.position.y = ~~(graph.height/2 - scoreText.height/2);
		ptsGroup.addChild(scoreText);

		ptsGroup.position.x = boundedBox.x + 10;
		ptsGroup.position.y = ATW.gameHeight() - ptsGroup.height - 25;
		group.addChild(ptsGroup);


		starGauge.scale.x = starGauge.scale.y = 0.75;
		starGauge.position.x = boundedBox.xMax - starGauge.width - 10;
		starGauge.position.y = ATW.gameHeight() - starGauge.height - 25;

		scoreText.refId = 'scoreText';
		builder.save(scoreText);

		starGauge.refId = 'starGauge';
		builder.save(starGauge);

	} else {
		var barShape    = PIXI.Sprite.fromFrame('game_bar_bg'),
			back        = PIXI.Sprite.fromFrame('ig_gauge_back'),
			front       = PIXI.Sprite.fromFrame('ig_gauge_front'),
			stars       = mode.findGoalsPos(barShape.height-40),
			staticStuff = new PIXI.DisplayObjectContainer(),
			dynStuff  = new PIXI.DisplayObjectContainer();

		back.position.y  = barShape.height - back.height + 5;
		back.position.x  = ~~(barShape.width/2 - back.width/2);
		front.position.y = barShape.height - front.height + 20;
		front.position.x = ~~(barShape.width/2 - front.width/2);

		var footGauge = PIXI.Sprite.fromFrame('gauge_obj1_foot');
		footGauge.position.x = barShape.position.x + 5;
		footGauge.position.y = barShape.height - footGauge.height;

		barShape.refId = 'barShape';
		builder.save(barShape);

		staticStuff.addChild(back),
		staticStuff.addChild(barShape);
		staticStuff.addChild(footGauge);

		// Affiche les scores a atteindre
		for(var i=0; i<starsLength; i++) {
			var pos = stars[i],
				score = goals[i];

			// Ligne de separation
			var line = PIXI.Sprite.fromFrame('gauge_line');
			line.position.y = barShape.height - pos.y;
			line.position.x = 12;
			line.refId = 'lineScore-'+i;
			builder.save(line);

			var text = new PIXI.BitmapText(score.toString(), {font: "22px FredokaOne-Regular"});
			text.position.y = ~~(line.height/2 - text.height/2) - 3;
			text.position.x = ~~(line.width/2 - text.width/2);
			console.log('score', score);
			text.refId = 'score-'+i;
			builder.save(text);

			line.addChild(text);
			staticStuff.addChild(line);

			// Etoile
			var offStar = PIXI.Sprite.fromFrame('ig_star_off');
			offStar.position.x = line.position.x + line.width + 15;
			offStar.position.y = line.position.y + ~~(line.height/2 - offStar.height/2);
			dynStuff.addChild(offStar);
			offStar.refId = 'offStar-' + i;
			builder.save(offStar);

			var onStar = PIXI.Sprite.fromFrame('ig_star_on');
			onStar.position.x = offStar.position.x + 3;
			onStar.position.y = offStar.position.y;
			onStar.alpha = 0;
			dynStuff.addChild(onStar);
			onStar.refId = 'onStar-' + i;
			builder.save(onStar)
		}

		var texture = PIXI.Texture.fromFrame('gauge_obj1_tile');
		var tilingGauge = new PIXI.TilingSprite(texture, 87, barShape.height);
		tilingGauge.height = 0;
		tilingGauge.position.x = footGauge.position.x;
		tilingGauge.oriY = tilingGauge.position.y = footGauge.position.y - tilingGauge.height;


		var headGauge = PIXI.Sprite.fromFrame('gauge_obj1_head');
		headGauge.position.y = tilingGauge.position.y - headGauge.height +2;
		headGauge.position.x = footGauge.position.x;

		var myScore = 0;
		var scoreText = new PIXI.BitmapText(myScore.toString(), {font: "17px FredokaOne-Regular"});
		scoreText = Util.DisplayText.shadow(scoreText, 2, 0, 0x0d0d0d, 0.3);
		scoreText.centerX = barShape.position.x + ~~(barShape.width/2);
		scoreText.position.x = scoreText.centerX - ~~(scoreText.width/2);
		scoreText.position.y = barShape.height - 25;

		dynStuff.addChild(headGauge);
		dynStuff.addChild(tilingGauge);
		dynStuff.addChild(front);
		dynStuff.addChild(scoreText);

		headGauge.refId = 'headGauge';
		builder.save(headGauge);

		tilingGauge.refId = 'tilingGauge';
		builder.save(tilingGauge);

		scoreText.refId = 'scoreText';
		builder.save(scoreText);

		staticStuff.cacheAsBitmap = true;
		group.addChild(staticStuff);
		group.addChild(dynStuff);

		group.refId = 'groupGauge';
	}



	return group;
}


function createBonusList(builder, boundedBox){
	var bonusGroup = new PIXI.DisplayObjectContainer(),
		i = 0,
		_t = Util.Bonus,
		lastBonus = null,
		map = [],
		bonusMap = {refId: 'bonusMap', map:map},
		player = ATW.App.getPlayer();

	builder.save(bonusMap);

	var bonusList = [
		_t.findByKey('BONUS_JOKER'),
		_t.findByKey('BONUS_LIFE'),
		_t.findByKey('BONUS_FREEZE'),
		_t.findByKey('BONUS_DOUBLE'),
		_t.findByKey('BONUS_BONUS')
	];

	if(!ATW.isMobile()) {
		// Liste les bonus
		bonusList.forEach(function(b){
			var bid = b.id,
				isUnlock = (b.tuto_key && !player.isTutoFisnish(b.tuto_key)) ? false : true;

			var texture = PIXI.Texture.fromFrame('bonus-' + bid);
			var btnBonus = new UI.Button(texture);
			if(lastBonus) btnBonus.position.y = lastBonus.position.y + lastBonus.height + 25;

			var bonus = player.getBonus(bid);
			var qty = (bonus) ? bonus.getQuantity() : 0;
			var s = "x" + qty;
			if(!qty) {
				var product = Util.Shop.findProductByKey(b.key);
				s = product.price.toString();
			}

			var pearlSprite = PIXI.Sprite.fromFrame('app_pearl');
			pearlSprite.scale.x = pearlSprite.scale.y = 0.65;
			pearlSprite.position.x = -15;
			pearlSprite.position.y = 10;
			btnBonus.addChild(pearlSprite);
			pearlSprite.refId = 'bonusPearl-' + bid;
			builder.save(pearlSprite);
			if(qty) {
				pearlSprite.alpha = 1;
			}

			var qtyText = new PIXI.BitmapText(s, {font: "40px FredokaOne-Regular"});
			qtyText = Util.DisplayText.shadow(qtyText, 2, 0, 0x0d0d0d, 0.5);
			qtyText.position.x = 10;
			qtyText.position.y = 10;
			btnBonus.addChild(qtyText);
			qtyText.refId = 'bonusText-' + bid;
			builder.save(qtyText);


			lastBonus = btnBonus;

			if(!isUnlock) {
				btnBonus.alpha = 0;
				btnBonus.buttonMode = false;
			}

			bonusGroup.addChild(btnBonus);

			btnBonus.bid = bid;
			btnBonus.refId = 'btnBonus-' + bid;
			builder.save(btnBonus);
			map.push(btnBonus);

			i++;

		});
	} else {
		var maxWidth = boundedBox.xMax - boundedBox.x;
		var lineContainer = new PIXI.DisplayObjectContainer();

		bonusList.forEach(function(b){
			var bid = b.id,
				isUnlock = (b.tuto_key && !player.isTutoFisnish(b.tuto_key)) ? false : true,
				margin = 70;

			var btnBonus = Util.DisplayObject.button('bonus-' + bid);
			if(lineContainer.width + btnBonus.width + margin > maxWidth) {
				bonusGroup.addChild(lineContainer);

				var oldLine = lineContainer;
				lineContainer = new PIXI.DisplayObjectContainer();
				lineContainer.position.y = oldLine.position.y + oldLine.height + 40;

			}

			btnBonus.scale.x = btnBonus.scale.y = 1.6;
			btnBonus.position.x = lineContainer.width;

			var bonus = player.getBonus(bid);
			var qty = (bonus) ? bonus.getQuantity() : 0;

			var s = "x" + qty;
			if(!qty) {
				var product = Util.Shop.findProductByKey(b.key);
				s = product.price.toString();
			}

			var pearlSprite = PIXI.Sprite.fromFrame('app_pearl');
			pearlSprite.scale.x = pearlSprite.scale.y = 0.65;
			pearlSprite.position.x = -15;
			pearlSprite.position.y = 10;
			btnBonus.addChild(pearlSprite);
			pearlSprite.refId = 'bonusPearl-' + bid;
			builder.save(pearlSprite);
			if(qty) {
				pearlSprite.alpha = 0;
			}


			var qtyText = new PIXI.BitmapText(s, {font: "40px FredokaOne-Regular"});
			qtyText = Util.DisplayText.shadow(qtyText, 2, 0, 0x0d0d0d, 0.5);
			qtyText.position.x = 10;
			qtyText.position.y = 10;
			btnBonus.addChild(qtyText);
			qtyText.refId = 'bonusText-' + bid;
			builder.save(qtyText);

			if(!isUnlock) {
				btnBonus.alpha = 0;
				btnBonus.buttonMode = false;
			}

			if(lineContainer.width >0) btnBonus.position.x += margin;

			lineContainer.addChild(btnBonus);

			btnBonus.bid = bid;
			btnBonus.refId = 'btnBonus-' + bid;
			builder.save(btnBonus);
			map.push(btnBonus);

			i++;

		});

		bonusGroup.addChild(lineContainer);
		for(var j=0; j<bonusGroup.children.length; j++) {
			var line = bonusGroup.children[j];
			line.position.x = maxWidth/2 - line.width/2;
		}

	}


	return (i) ? bonusGroup : null;
};

function createGameBackground() {
	var width = 570,
		height = 577,
		radius = 7,
		// x = (ATW.gameMidWidth() - width/2),
		x = 0,
		// y = (ATW.gameMidHeight() - height/2) +20;
		y = 0;

	var gameBackground = new PIXI.Graphics();
	gameBackground.beginFill(0x07bff8)
		.drawRoundedRect (x, y, width, height, radius)
		.endFill();

	return gameBackground;
};


function createWave(builder, game) {
	var mode = game.getLevel().getMode();

	if(mode.needFullGrid() && !mode.isWreckingBall()) return;

	var group = new PIXI.DisplayObjectContainer();
	var ropeContainer = new PIXI.DisplayObjectContainer();

	if(!ATW.isMobile()) {
		var bgRope = PIXI.Sprite.fromFrame('bg_rope');
		ropeContainer.addChild(bgRope);

		var texture = PIXI.Texture.fromFrame('default_rope');
		var frontRope = new PIXI.TilingSprite(texture, bgRope.width, bgRope.height);
		frontRope.refId = 'frontRope';
		builder.save(frontRope);
		ropeContainer.addChild(frontRope);

		// Etincelle
		var textures = [];
		for(var i=1; i<5; i++) textures.push(PIXI.Texture.fromFrame("sparkle_base_" + i));
		var sparkle = new PIXI.MovieClip(textures);
		sparkle.oriY = sparkle.position.y = frontRope.position.y + frontRope.height - sparkle.height + 22;
		sparkle.position.x = -9;
		sparkle.loop = true;
		sparkle.animationSpeed = 0.25;
		sparkle.refId = 'sparkle';
		sparkle.alpha = 0;
		sparkle.play();

		builder.save(sparkle);

		ropeContainer.addChild(sparkle);

		ropeContainer.position.y = 15;

		group.addChild(ropeContainer);
	} else {
		var back = PIXI.Sprite.fromFrame('mobile_wave_back')
			, front = new PIXI.TilingSprite(PIXI.Texture.fromFrame('mobile_wave_front'), 341, 43);

		front.width = 0;

		front.refId = 'frontRope';
		builder.save(front);

		ropeContainer.addChild(back);
		ropeContainer.addChild(front);

		group.addChild(ropeContainer);
	}

	if(!mode.isWreckingBall()) {
		var btnFirewave = new Util.DisplayObject.button('ig_firewave_bg');
		btnFirewave.position.y = 25;
		btnFirewave.position.x = 5;
		if(ATW.isMobile()) {
			btnFirewave.scale.x = btnFirewave.scale.y = 1.2;
			btnFirewave.position.x = ropeContainer.width - btnFirewave.width/2 + 30;
			btnFirewave.position.y -= 4;
		}

	} else {
		var btnFirewave = new Util.DisplayObject.button('button_detonator');
		btnFirewave.position.y = -18;

		if(ATW.isMobile) {
			btnFirewave.position.x = ropeContainer.width - btnFirewave.width/2 + 25;
			btnFirewave.position.y = 20;
		}
	}

	var text = new PIXI.BitmapText(game.getQuantityLeft().toString(), {font: "25px FredokaOne-Regular"});
	text = Util.DisplayText.shadow(text, 2, 0, 0x0d0d0d, 0.3);
	text.position.x = -text.width/2;
	text.position.y = -text.height/2;
	if(mode.isWreckingBall()) {
		text.position.y = 10;
	}

	text.refId = "fireWaveText";
	builder.save(text);

	btnFirewave.addChild(text);
	// btnFirewave.scale.x = btnFirewave.scale.y = 1.1;
	btnFirewave.position.x += 5;
	btnFirewave.refId = "fireWave";

	builder.save(btnFirewave);
	group.addChild(btnFirewave);


	group.refId = 'waveContainer';

	return group;
};


function createFields(scene, builder, grid){
	var grounds = new PIXI.DisplayObjectContainer()
		, assets = new PIXI.DisplayObjectContainer()
		, fields = new PIXI.DisplayObjectContainer()
		, background = createGameBackground()
		, groundsDyn = new PIXI.DisplayObjectContainer();

	background.position.x = -8;
	background.position.y = 20;
	grounds.addChild(background);

	// Utiliser une render texture pour optimiser
	grid.eachGround(function(ground){
		var viewUrl = ground.getViewUrl(),
			groundSprite = null,
			addTo = groundsDyn;
		if(viewUrl) {
			groundSprite = PIXI.Sprite.fromFrame('ground-' + ground.view);
			addTo = grounds
		}

		if(ground.isLDLostLife()) {
			var texture = PIXI.Texture.fromFrame('ground-6');
			var lostLife = new PIXI.TilingSprite(texture, Game.Ground.WIDTH-2, 20);
			lostLife.position.x = ground.getLeft() + 1;
			lostLife.position.y = ground.getTop() + 2;
			groundsDyn.addChild(lostLife);

			var tl = new TimelineMax({repeat:-1});
			tl.to(lostLife.tilePosition, 7, {x: Game.Ground.WIDTH-2, ease:Linear.easeNone});

			scene._addAnim(tl);

		}


		if(!groundSprite) return;

		if(ground.hasHole()){
			var holeSprite = PIXI.Sprite.fromFrame('hole_game');
			holeSprite.position.x = ~~(groundSprite.width/2 - holeSprite.width/2);
			holeSprite.position.y = 4;
			groundSprite.addChild(holeSprite);
		}


		groundSprite.position.x += ground.getLeft();
		groundSprite.position.y += ground.getTop();
		addTo.addChild(groundSprite);

		if(ground.hasPearl()) {
			var pearlContainer = new PIXI.DisplayObjectContainer();

			var pearl = PIXI.Sprite.fromFrame('app_pearl');

			var shadow = PIXI.Sprite.fromFrame('pearl_shadow')
			shadow.scale.x = 0.92;
			shadow.scale.y = 0.55;
			shadow.position.x = ~~(pearl.width/2 - shadow.width/2) + 2;
			shadow.position.y = pearl.height - 22;

			pearlContainer.addChild(shadow);
			pearlContainer.addChild(pearl);


			pearlContainer.position.x = groundSprite.position.x + (groundSprite.width/2 - pearlContainer.width/2);
			pearlContainer.position.y = groundSprite.position.y + 5;

			pearlContainer.cacheAsBitmap = true;
			assets.addChild(pearlContainer);

			pearlContainer.refId = "pearl_" + ground.getId();
			builder.save(pearlContainer);


		}

		if(ground.hasWall()) {
			var wall = PIXI.Sprite.fromFrame('wall_' + ground.wall);
			wall.position.y = groundSprite.position.y + groundSprite.height - wall.height - 15;
			wall.position.x = groundSprite.position.x;
			wall.refId = "wall-" + ground.id;
			builder.save(wall);

			assets.addChild(wall);

		}



		if(ground.hasBonus()) {
			var bonus = ground.getBonus();
			if(!bonus.isBomb()) {
				throw new Error('createFields bonus != bonus need to be implemented');
			} else {
				// Ajoute une bombe sur la scene

				var bombContainer = new PIXI.DisplayObjectContainer();

				var cacheContainer = new PIXI.DisplayObjectContainer();

				var blackBomb = PIXI.Sprite.fromFrame('bomb');
				var redBomb = PIXI.Sprite.fromFrame('bomb_red');

				var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
				shadow.scale.x = 0.92;
				shadow.scale.y = 0.55;
				shadow.position.x = ~~(blackBomb.width/2 - shadow.width/2) + 2;
				shadow.position.y = blackBomb.height - 22;

				cacheContainer.addChild(shadow);
				cacheContainer.addChild(blackBomb);

				cacheContainer.cacheAsBitmap = true;
				bombContainer.addChild(cacheContainer);
				bombContainer.addChild(redBomb);

				bombContainer.position.x = groundSprite.position.x + (groundSprite.width/2 - bombContainer.width/2);
				bombContainer.position.y = groundSprite.position.y - 15;

				assets.addChild(bombContainer);

				bombContainer.refId = "bonus_" + ground.getId();
				builder.save(bombContainer);

				var tl = new TimelineMax({repeat: -1, yoyo: true});
				tl.to(redBomb, 1, {alpha: 0});
				scene._addAnim(tl);

				bonus.anim = tl;
			}

		}

	});


	grounds.cacheAsBitmap = true;
	fields.addChild(grounds);
	fields.addChild(groundsDyn);
	fields.addChild(assets);

	groundsDyn.refId = "groundsDyn";
	builder.save(groundsDyn);

	assets.refId = "assetsField";
	builder.save(assets);

	fields.position.x = ~~(ATW.gameWidth()/2 - fields.width/2) + 8;
	fields.position.y = ~~(ATW.gameHeight()/2 - fields.height/2);

	return fields;

};


})(window.View = window.View || {});

/**** views/scenes/defeat_scene.view.js ****/
'use strict';

(function(views){

views.defeat_scene = function build_defeat_scene(builder) {
	var boundedBox = Util.Screen.boundedBox()
		, game = builder.container.game
		, level = game.getLevel()
		, mode = level.getMode()
		, myScore = game.getScore()
		, player = ATW.App.getPlayer()
		, levelName = level.getName();


	var isBuyable = (!player.isTutoFisnish('first_defeat')) ? false : level.isBuyable();

	var bg = PIXI.Sprite.fromFrame('defeat_background');
	Util.Screen.toFullScreen(bg);
	bg.position.x = ~~(ATW.gameMidWidth() - bg.width/2);

	builder.add(bg);

	var flame = PIXI.Sprite.fromFrame('flame');
	Util.Screen.toFullScreen(flame);
	flame.position.x = ~~(ATW.gameMidWidth() - flame.width/2);

	builder.add(flame);


	Partial.header_partial(builder, boundedBox);


	var defeatTitle = new PIXI.BitmapText(_ts('defaite').toUpperCase(), {font: '60px FredokaOne-Regular', tint: 0xf58c28});
	defeatTitle = Util.DisplayText.shadow(defeatTitle, 5, 3, 0xa00101, 1);
	defeatTitle.position.x = ~~(ATW.gameMidWidth() - defeatTitle.width/2);
	defeatTitle.position.y = 150;

	builder.add(defeatTitle);


	var textures = [];
	for(var i=1; i<24; i++) textures.push(PIXI.Texture.fromFrame("crying_fish_" + i));

	var cryingFish = new PIXI.MovieClip(textures);
	cryingFish.position.x = ~~(ATW.gameMidWidth() - cryingFish.width/2);
	cryingFish.position.y = defeatTitle.position.y + defeatTitle.height + 70;
	cryingFish.loop = true;
	cryingFish.animationSpeed = 0.25;
	cryingFish.play();


	var shadow = PIXI.Sprite.fromFrame('pearl_shadow');
	shadow.scale.x = 2.3;
	shadow.scale.y = 0.8;

	shadow.position.x = cryingFish.position.x + cryingFish.width/2 - shadow.width/2 + 5;
	shadow.position.y = cryingFish.position.y + cryingFish.height - shadow.height + 12;

	var heartBreak = PIXI.Sprite.fromFrame('ig_heartbreak_rotate');
	heartBreak.position.x = cryingFish.position.x + cryingFish.width;
	heartBreak.position.y = cryingFish.position.y - 20;

	var lifeBmp = new PIXI.BitmapText('-1', {font: '55px FredokaOne-Regular'});
	lifeBmp = Util.DisplayText.shadow(lifeBmp, 2, 0, 0x0d0d0d, 0.3);
	lifeBmp.position.x = 38;
	lifeBmp.position.y = 40;
	heartBreak.addChild(lifeBmp);


	builder.add(shadow);
	builder.add(cryingFish);
	builder.add(heartBreak);


	var groupLevelName = Prefab.level_name(levelName);
	groupLevelName.position.y = cryingFish.position.y + cryingFish.height + 30;
	groupLevelName.position.x = ~~(ATW.gameMidWidth() - groupLevelName.width/2);
	groupLevelName.cacheAsBitmap = true;
	builder.add(groupLevelName);


	var scoreBmp = Prefab.level_score_end(myScore);
	scoreBmp.position.x = ~~(ATW.gameMidWidth() - scoreBmp.width/2);
	scoreBmp.position.y = groupLevelName.y + groupLevelName.height + 20;
	scoreBmp.cacheAsBitmap = true;
	builder.add(scoreBmp);


	// --------------------------------------------------------------
	// Obj 1
	// --------------------------------------------------------------

	var lineObj1 = Prefab.level_obj_end((game.obj1 >= level.getMode().getEndPoint()), mode.getDescription(0, 0, 0, true));
	lineObj1.position.y = scoreBmp.position.y + scoreBmp.height + 70;
	lineObj1.position.x = ~~(ATW.gameMidWidth() - lineObj1.width/2);
	builder.add(lineObj1);


	// --------------------------------------------------------------
	// Obj star
	// --------------------------------------------------------------

	var lineObjStar = Prefab.level_obj_end((game.getStar() >= 1), _ts('obtenir_x_etoiles', {':x': 1}));
	lineObjStar.position.y = lineObj1.position.y + lineObj1.height + 10;
	lineObjStar.position.x = ~~(ATW.gameMidWidth() - lineObjStar.width/2);
	builder.add(lineObjStar);


	// --------------------------------------------------------------
	// Bottom interaction
	// --------------------------------------------------------------
	var bottomInteraction = new PIXI.DisplayObjectContainer();

	var btnMenu = new UI.Button(PIXI.Texture.fromFrame('button_menu'));
	btnMenu.refId = "btnMenu";
	builder.save(btnMenu);

	bottomInteraction.addChild(btnMenu);

	var buttonId = (player.life) ? 'button_reload' : 'app_more_heart';
	var btnReload = new UI.Button(PIXI.Texture.fromFrame(buttonId));
	btnReload.position.x = btnMenu.position.x + btnMenu.width + 15;
	btnReload.refId = "btnReload";
	builder.save(btnReload);

	bottomInteraction.addChild(btnReload);

	console.log('isBuyable', isBuyable);
	if(isBuyable) {

		var btnShopLevel = new UI.Button(PIXI.Texture.fromFrame('button_sh_next_level'));
		btnShopLevel.position.x = btnReload.position.x + btnReload.width + 40;
		btnShopLevel.refId = 'btnShopLevel';

		var text = _ts('passer_le_niveau');
		var textBmp = Util.DisplayText.wrap(text, {
			font: "18px FredokaOne-Regular",
			letterMax: 7,
			align: "center",
			maxWidth: 60,
			lineHeight: 18
		});
		textBmp.position.y = -textBmp.height/2;
		textBmp.position.x = -58;
		btnShopLevel.addChild(textBmp);

		var appPearl = PIXI.Sprite.fromFrame('app_pearl');
		appPearl.scale.x = appPearl.scale.y = 0.65;
		appPearl.position.x = 40;
		appPearl.position.y = 7;
		btnShopLevel.addChild(appPearl);

		var product = Util.Shop.findProductByKey('LEVEL');
		var priceBmp = new PIXI.BitmapText(product.price.toString(), {font: '25px FredokaOne-Regular'});
		priceBmp = Util.DisplayText.shadow(priceBmp, 2, 0, 0x0d0d0d, 0.5);
		priceBmp.position.x = 65;
		priceBmp.position.y = 20;
		btnShopLevel.addChild(priceBmp);

		builder.save(btnShopLevel);
		bottomInteraction.addChild(btnShopLevel);


	}

	bottomInteraction.position.x = ~~(ATW.gameMidWidth() - bottomInteraction.width/2 + btnMenu.width/2);
	bottomInteraction.position.y = ATW.gameHeight() - bottomInteraction.height;

	builder.add(bottomInteraction);





};


})(window.View = window.View || {});


/**** views/scenes/win_scene.view.js ****/
'use strict';

(function(views){

views.win_scene = function build_win_scene(builder) {
	var game = builder.container.game
		, level = game.getLevel()
		, mode = level.getMode()
		, myHighstar = Math.min(level.getStar(), 3)
		, myStar = game.appStar
		, levelName = level.getName()
		, myScore = game.getScore()
		, boundedBox = Util.Screen.boundedBox();
	var bg = PIXI.Sprite.fromFrame('win_background');
	Util.Screen.toFullScreen(bg);

	bg.position.x = ~~(ATW.gameMidWidth() - bg.width/2);
	builder.add(bg);

	Partial.header_partial(builder, boundedBox);

	var winTitle = new PIXI.BitmapText(_ts('victoire').toUpperCase(), {font: '60px FredokaOne-Regular', tint: 0xffea34});
	winTitle = Util.DisplayText.shadow(winTitle, 5, 3, 0xfda134, 1);

	winTitle.position.x = ~~(ATW.gameMidWidth() - winTitle.width/2);
	winTitle.position.y = 150;

	builder.add(winTitle);

	var marginTop = 10
		, marginLeft = 15
		, starContainer = new PIXI.DisplayObjectContainer();

	switch(myStar){

		case 3:
			var star1 = PIXI.Sprite.fromFrame('big_star_left');
			star1.position.y = marginTop;
			starContainer.addChild(star1);

			var star2 = PIXI.Sprite.fromFrame('big_star_center');
			star2.position.x = star1.width + marginLeft;
			starContainer.addChild(star2);

			var star3 = PIXI.Sprite.fromFrame('big_star_right');
			star3.position.x = star2.position.x + star2.width + marginLeft;
			star3.position.y = marginTop;
			starContainer.addChild(star3);

			break;

		case 2:
			var star1 = PIXI.Sprite.fromFrame('big_star_left');
			starContainer.addChild(star1);

			var star2 = PIXI.Sprite.fromFrame('big_star_right');
			star2.position.x = star1.width + marginLeft;
			starContainer.addChild(star2);
			break;

		case 1:
			var star1 = PIXI.Sprite.fromFrame('big_star_center');
			starContainer.addChild(star1);

			break;

	}

	starContainer.position.x = ~~(ATW.gameMidWidth() - starContainer.width/2);
	starContainer.position.y = winTitle.position.y + winTitle.height + 20;

	builder.add(starContainer);


	var groupLevelName = Prefab.level_name(levelName);
	groupLevelName.position.y = starContainer.position.y + starContainer.height + 5;
	groupLevelName.position.x = ~~(ATW.gameMidWidth() - groupLevelName.width/2);
	groupLevelName.cacheAsBitmap = true;
	builder.add(groupLevelName);

	var scoreBmp = Prefab.level_score_end(myScore);
	scoreBmp.position.x = ~~(ATW.gameMidWidth() - scoreBmp.width/2);
	scoreBmp.position.y = groupLevelName.y + groupLevelName.height + 20;
	scoreBmp.cacheAsBitmap = true;

	builder.add(scoreBmp);

	var s = null;
	if( mode.isSimple() ||  mode.isHanged() || mode.isCrossword() ) {
		s = _ts('mots_trouves') + " : " + game.getWordsSummarize().length;
	} else if( mode.isSurvival() ) {
		s = _ts('vagues_survecus') + " : " + game.iWave;
	} else if( mode.isWreckingBall() ) {
		s = _ts('meduses_sauvees') + " : " + game.nbSavedFish
	} else {
		s = _ts('temps') + " : " + game.getDurationString();
	}

	var tipsBmp = new PIXI.BitmapText(s, {font: "35px FredokaOne-Regular"});
	tipsBmp = Util.DisplayText.shadow(tipsBmp, 3, 0, 0x0d0d0d, 0.5);
	tipsBmp.position.x = ~~(ATW.gameMidWidth() - tipsBmp.width/2)
	tipsBmp.position.y =  scoreBmp.position.y + scoreBmp.height + 40;

	builder.add(tipsBmp);


	var highscoreBmp = new PIXI.BitmapText(_2('highscore') + " : " + level.getScore(), {font: "35px FredokaOne-Regular"});
	highscoreBmp = Util.DisplayText.shadow(highscoreBmp, 3, 0, 0x0d0d0d, 0.5);
	highscoreBmp.position.x = ~~(ATW.gameMidWidth() - highscoreBmp.width/2);
	highscoreBmp.position.y = tipsBmp.position.y + highscoreBmp.height + 10;

	builder.add(highscoreBmp);

	var highstarContainer = new PIXI.DisplayObjectContainer();
	var lastStar = null;
	for(var i=0; i<myHighstar; i++) {
		var star = PIXI.Sprite.fromFrame('app_min_star');

		if(lastStar) {
			star.position.x = lastStar.width + lastStar.position.x + 8;
		}

		star.scale.x = star.scale.y = 1.4;

		highstarContainer.addChild(star);
		lastStar = star;
	}

	highstarContainer.position.x = highscoreBmp.position.x + highscoreBmp.width + 20;
	highstarContainer.position.y = highscoreBmp.position.y + 2;

	builder.add(highstarContainer);

	// --------------------------------------------------------------
	// Obj 1
	// --------------------------------------------------------------

	var lineObj1 = Prefab.level_obj_end((game.obj1 >= level.getMode().getEndPoint()), mode.getDescription(0, 0, 0, true));

	lineObj1.position.y = highscoreBmp.position.y + highscoreBmp.height + 50;
	lineObj1.position.x = ~~(ATW.gameMidWidth() - lineObj1.width/2);

	builder.add(lineObj1);


	// --------------------------------------------------------------
	// Obj star
	// --------------------------------------------------------------

	var lineObjStar = Prefab.level_obj_end((game.getStar() >= 1), _ts('obtenir_x_etoiles', {':x': 1}));

	lineObjStar.position.y = lineObj1.position.y + lineObj1.height + 10;
	lineObjStar.position.x = ~~(ATW.gameMidWidth() - lineObjStar.width/2);

	builder.add(lineObjStar);


	// --------------------------------------------------------------
	// Bottom interaction
	// --------------------------------------------------------------
	var bottomInteraction = new PIXI.DisplayObjectContainer();

	var btnMenu = new UI.Button(PIXI.Texture.fromFrame('button_menu'));
	btnMenu.refId = "btnMenu";
	builder.save(btnMenu);

	bottomInteraction.addChild(btnMenu);

	var btnReload = new UI.Button(PIXI.Texture.fromFrame('button_reload'));
	btnReload.position.x = btnMenu.position.x + btnMenu.width + 15;
	btnReload.refId = "btnReload";
	builder.save(btnReload);

	bottomInteraction.addChild(btnReload);

	var btnNext = new UI.Button(PIXI.Texture.fromFrame('button_play_small'));
	btnNext.position.x = btnReload.position.x + btnReload.width + 15;
	btnNext.refId = "btnNext";
	builder.save(btnNext);

	bottomInteraction.addChild(btnNext);

	bottomInteraction.position.x = ~~(ATW.gameMidWidth() - bottomInteraction.width/2 + btnMenu.width/2);
	bottomInteraction.position.y = ATW.gameHeight() - bottomInteraction.height;

	builder.add(bottomInteraction);


};


})(window.View = window.View || {});


/**** views/partials/menu/header.partial.js ****/
'use strict';

(function(partials){

partials.header_partial = function build_header_partial(builder, boundedBox, p, delay){

	var player = ATW.App.getPlayer(),
		DO = Util.DisplayObject,
		centerGroup = new PIXI.DisplayObjectContainer(),
		marginRight = 15,
		scale = 1.2,
		displayCenterGroup = false,
		player = ATW.App.getPlayer(),
		nbPearl = player.getPearls(),
		headerContainer = new PIXI.DisplayObjectContainer(),
		mobileScale = 0.75,
		mobileScaleBtn = 0.95,
		heightHeart = 43;


	// --------------------------------------------------------------
	// Trophee
	// --------------------------------------------------------------
	if(!p || p.btnTrophy) {
		var trophy = Util.DisplayObject.button('button_trophy');
		if(ATW.isMobile()) trophy.scale.x = trophy.scale.y = mobileScaleBtn;

		trophy.position.x = ~~(trophy.width/2);
		trophy.position.y = ~~(trophy.height/2);

		var nbGiftLeft = ATW.App.getPlayer().getAchievementManager().getNbGiftLeft();
		var nbGiftBmp = new PIXI.BitmapText(nbGiftLeft.toString(), {font: "25px FredokaOne-Regular"});

		var containerNumberAch = new PIXI.Graphics();
		containerNumberAch.beginFill(0xFF0000, 1)
				.lineStyle(3, 0xFFFFFF, 1)
				.drawRoundedRect(0, 0, 25, 35, 10)
				.endFill()

		containerNumberAch.position.x = 17;
		containerNumberAch.position.y = 10;

		containerNumberAch.updateNb = function(nb, dontUpdateText) {
			if(!dontUpdateText) {
				nbGiftBmp.setText(nb.toString());
				nbGiftBmp.updateText();
			}

			nbGiftBmp.position.y = 7;
			nbGiftBmp.position.x = containerNumberAch.width/2 - 2 - nbGiftBmp.width/2;
			containerNumberAch.alpha =	(!nb) ? 0 : 1;

		}

		containerNumberAch.updateNb(nbGiftLeft, true);

		containerNumberAch.addChild(nbGiftBmp);
		containerNumberAch.refId = 'nbAchievementContainer';
		builder.add(containerNumberAch);

		trophy.addChild(containerNumberAch);

		trophy.refId = 'trophy';
		builder.add(trophy);


		centerGroup.addChild(trophy);
		displayCenterGroup = true;
	}

	// --------------------------------------------------------------
	// Shop
	// --------------------------------------------------------------
	if(!p || p.btnCart) {
		var cart = Util.DisplayObject.button('button_cart');
		if(ATW.isMobile()) cart.scale.x = cart.scale.y = mobileScaleBtn;

		cart.position.x = DO.xMax(trophy) + marginRight + ~~(cart.width/2 - trophy.width/2);
		cart.position.y = ~~(cart.height/2);

		cart.refId = 'cart';
		builder.add(cart);

		centerGroup.addChild(cart);
		displayCenterGroup = true;
	}

	// --------------------------------------------------------------
	// Message
	// --------------------------------------------------------------
	if(!p || p.btnMessage) {
		var message = Util.DisplayObject.button('button_notif');
		if(ATW.isMobile()) message.scale.x = message.scale.y = mobileScaleBtn;

		var nbNotif = ATW.App.getPlayer().getMessenger().total();
		var nbNotifBmp = new PIXI.BitmapText(nbNotif.toString(), {font: "25px FredokaOne-Regular"});

		var containerNumberNotif = new PIXI.Graphics();
		containerNumberNotif.beginFill(0xFF0000, 1)
				.lineStyle(3, 0xFFFFFF, 1)
				.drawRoundedRect(0, 0, 25, 35, 10)
				.endFill()

		containerNumberNotif.position.x = 17;
		containerNumberNotif.position.y = 10;


		containerNumberNotif.updateNb = function(nb, dontUpdateText) {
			if(!dontUpdateText) {
				nbNotifBmp.setText(nb.toString());
				nbNotifBmp.updateText();
			}

			nbNotifBmp.position.y = 7;
			nbNotifBmp.position.x = containerNumberNotif.width/2 - 2 - nbNotifBmp.width/2;
			containerNumberNotif.alpha = (!nb) ? 0 : 1;

		}

		containerNumberNotif.updateNb(nbNotif, true);

		containerNumberNotif.addChild(nbNotifBmp);
		containerNumberNotif.refId = 'nbNotifContainer';
		builder.add(containerNumberNotif);

		message.addChild(containerNumberNotif);

		message.position.x = DO.xMax(cart) + marginRight;
		message.position.y = ~~(message.height/2);

		message.refId = 'btnNotif';
		builder.add(message);

		centerGroup.addChild(message);
		displayCenterGroup = true;
	}

	if(displayCenterGroup) {
		DO.centerX(ATW.gameWidth(), centerGroup);
		centerGroup.position.y = 10;

		headerContainer.addChild(centerGroup);
	}

	// --------------------------------------------------------------
	// Heart
	// --------------------------------------------------------------
	var heartContainer = Partial.heart_bar_partial(builder);
	heartContainer.position.x = boundedBox.x + 20;
	heartContainer.position.y = 27;
	heartContainer.refId = 'heartContainer';
	builder.save(heartContainer);

	headerContainer.addChild(heartContainer)

	// --------------------------------------------------------------
	// Pearl
	// --------------------------------------------------------------
	var pearlContainer = new PIXI.DisplayObjectContainer();

	var text = new PIXI.BitmapText(nbPearl.toString(), {font: "25px FredokaOne-Regular"});
	text.refId = "headerPearlText";
	builder.save(text);


	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, 170, heightHeart, 40)
		.endFill();
	graph.alpha = 0.3;

	var pearl = Util.DisplayObject.sprite('app_pearl');
	pearl.scale.x = pearl.scale.y = 0.85;
	pearl.position.y = -2;


	var more = Util.DisplayObject.button('button_more');
	more.scale.x = more.scale.y = 1.05;
	more.position.x = graph.width - 20;
	more.position.y = ~~(more.height/2);
	more.refId = 'morePearl';
	builder.save(more);

	var cacheContainer = new PIXI.DisplayObjectContainer();
	cacheContainer.addChild(graph);
	cacheContainer.addChild(pearl);
	cacheContainer.cacheAsBitmap = true;

	pearlContainer.addChild(cacheContainer);

	text.rightOri = more.position.x - more.width/2  - 10;
	text.position.x = text.rightOri - text.width;
	text.position.y = 12;
	text.refId = 'nbPearlText';
	builder.save(text);


	pearlContainer.addChild(text);
	pearlContainer.addChild(more);

	if(ATW.isMobile()) pearlContainer.scale.x = pearlContainer.scale.y = mobileScale;

	pearlContainer.position.x =  boundedBox.xMax - pearlContainer.width - 12;
	pearlContainer.position.y = 27;

	headerContainer.addChild(pearlContainer);

	if(!delay) {
		headerContainer.refId = 'headerContainer';
		builder.add(headerContainer);
	}

	return headerContainer;

};



})(window.Partial = window.Partial || {});

/**** views/partials/menu/heart_bar.partial.js ****/
'use strict';

(function(partials){

partials.heart_bar_partial = function build_heart_bar_partial(builder){
	var player = ATW.App.getPlayer()
		, isFullLife = player.isFullLife()
		, mobileScale = 0.75
		, heartContainer = new PIXI.DisplayObjectContainer()
		, heartCache = new PIXI.DisplayObjectContainer()
		, myLife = player.life
		, heightHeart = 43;

	var graph = new PIXI.Graphics();
	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, 160, heightHeart, 40)
		.endFill();
	graph.alpha = 0.3;

	heartCache.addChild(graph);

	var heartIco = Util.DisplayObject.sprite(player.normalSessionIn ? 'app_golden_heart' : 'app_heart');
	heartIco.position.x = -20;
	if(player.normalSessionIn) heartIco.position.y = -8;
	else heartIco.position.y = -3;

	heartCache.addChild(heartIco);

	heartCache.cacheAsBitmap = true;
	heartContainer.addChild(heartCache);

	var moreHeart = Util.DisplayObject.button('button_more');
	moreHeart.scale.x = moreHeart.scale.y = 1.05;
	moreHeart.position.x = graph.width - 20;
	moreHeart.position.y = ~~(moreHeart.height/2) + -2;

	if(isFullLife || player.normalSessionIn) moreHeart.visible = false;

	moreHeart.refId = 'moreHeart';
	builder.save(moreHeart, true);
	heartContainer.addChild(moreHeart);

	var text = (isFullLife) ? _ts('Plein') : '';
	var timeLeft = new PIXI.BitmapText(text, {font: "25px FredokaOne-Regular"});
	timeLeft.position.x = 45;
	timeLeft.position.y = 11;
	timeLeft.refId = 'timeLeft';
	builder.save(timeLeft, true);
	heartContainer.addChild(timeLeft);

	var s = (!player.normalSessionIn) ? myLife.toString() : ''
	var lifeText = new PIXI.BitmapText(s, {font: "30px FredokaOne-Regular"});
	lifeText = Util.DisplayText.shadow(lifeText, 3, 0, 0x0d0d0d, 0.6);
	lifeText.position.x = ~~(10 - lifeText.width/2);
	lifeText.position.y = 9;
	lifeText.refId = 'headerLifeText';
	builder.save(lifeText, true);

	heartContainer.addChild(lifeText);

	if(player.normalSessionIn) {
		var infinity = PIXI.Sprite.fromFrame('app_infinity');
		infinity.position.x = -5;
		infinity.position.y = 12;
		heartContainer.addChild(infinity);
	}

	if(ATW.isMobile()) heartContainer.scale.x = heartContainer.scale.y = mobileScale;

	heartContainer.normalSessionIn = player.normalSessionIn;

	return heartContainer;
};



})(window.Partial = window.Partial || {});

/**** views/partials/menu/bottom.partial.js ****/
'use strict';

(function(partials){

partials.bottom_partial = function build_header_partial(builder, boundedBox, cfs){

	var group = new PIXI.DisplayObjectContainer();


	if(cfs && cfs.button_previous) {
		var btnPrevious = Util.DisplayObject.button('button_previous');
		btnPrevious.scale.x = btnPrevious.scale.y = 1.05;
		btnPrevious.position.x += boundedBox.x + btnPrevious.width/2 + 20;
		btnPrevious.position.y += btnPrevious.height/2;
		btnPrevious.refId = "button_previous";
		builder.save(btnPrevious);

		group.addChild(btnPrevious);
	}


	if(cfs && cfs.daily_reward) {
		var btnReward = Prefab.daily_reward_btn();
		if(btnReward) {
			btnReward.position.x = boundedBox.xMax - btnReward.width/2 - 20;
			btnReward.position.y = btnReward.height/2 - 5;
			btnReward.refId = 'button_daily_reward';
			builder.save(btnReward);

			group.addChild(btnReward);
		}

	}

	// group.position.x = boundedBox.x;
	group.position.y = ATW.gameHeight() - group.height - 25;
	group.refId = 'footerBar';
	builder.add(group);

};

})(window.Partial = window.Partial || {});

/**** views/prefabs/worlds/world.prefab.js ****/
'use strict';

(function(prefabs){

prefabs.world_prefab = function build_world_prefab(cWorld, showStat){
	var worldKey = cWorld.key
		, back2 = null
		, prefab = new PIXI.DisplayObjectContainer()
		, uWorld = ATW.App.getPlayer().getWorld(cWorld)
		, isOpen = uWorld.isOpen();

	if(!isOpen) showStat = false;

	prefab.storage = {};

	var title = PIXI.Sprite.fromFrame(worldKey + '-title');
	title.position.y = -250;

	var ground = Util.DisplayObject.sprite(worldKey + '-ground');
	var back1 = Util.DisplayObject.sprite(worldKey + '-back_1');
	try {
		back2 = Util.DisplayObject.sprite(worldKey + '-back_2');
	} catch(error) {}

	var back3 = Util.DisplayObject.sprite(worldKey + '-back_3');
	var fore1 = Util.DisplayObject.sprite(worldKey + '-fore_1');
	var fore2 = Util.DisplayObject.sprite(worldKey + '-fore_2');
	var pedestal = Util.DisplayObject.sprite(worldKey + '-pedestal');
	pedestal.position.y = 260;
	pedestal.position.x = -150;

	var socialPedestal = Util.DisplayObject.sprite(worldKey + '-pedestal');
	socialPedestal.position.y = 260;
	socialPedestal.position.x = 150;

	var shadow = PIXI.Sprite.fromFrame(worldKey + '-shadow');
	shadow.position.y = 320;
	shadow.position.x = 0;


	var cacheContainer = new PIXI.DisplayObjectContainer();

	if(!isOpen) {
		back1.tint = 0x899799;
		if(back2) back2.tint = 0x899799;
		back3.tint = 0x899799;
		ground.tint = 0x899799;
		fore1.tint = 0x899799;
		fore2.tint = 0x899799;
		title.tint = 0x899799;
	}

	prefab.addChild(back1);
	if(back2) prefab.addChild(back2);
	prefab.addChild(back3);
	prefab.addChild(ground);
	prefab.addChild(fore1);
	prefab.addChild(fore2);
	if(showStat) {
		prefab.addChild(title);
		prefab.addChild(pedestal);
		prefab.addChild(socialPedestal);

		var avatar = Prefab.avatar_prefab(cWorld.key, true, true);
		avatar.position.y = pedestal.height - 80;
		avatar.position.x = avatar.width/2 - 60;
		pedestal.addChild(avatar);

		prefab.storage.avatar = avatar;


	} else if(!isOpen) {
		prefab.addChild(title);
	}


	if(ATW.isMobile()) prefab.addChild(shadow);


	if(showStat) {
		var nbStar = uWorld.sumStar()
			, starGroup = new PIXI.DisplayObjectContainer();

		var graph = new PIXI.Graphics();
		graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 160, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		var appStar = PIXI.Sprite.fromFrame('app_star');
		appStar.position.x = -12;
		appStar.position.y = -3;

		starGroup.addChild(graph);
		starGroup.addChild(appStar);

		starGroup.position.x = -starGroup.width/2;
		starGroup.position.y = 280;

		var text = new PIXI.BitmapText(nbStar + "/" + uWorld.getMaxStar(), {font: "31px FredokaOne-Regular", tint: 0xffff47});
		text = Util.DisplayText.shadow(text, 3, 0, 0x966c00, 0.7);
		text.position.x = ~~(graph.width/2 - text.width/2) + 15;
		text.position.y = ~~(graph.height/2 - text.height/2);
		starGroup.addChild(text);

		prefab.addChild(starGroup);


		var ptsGroup = new PIXI.DisplayObjectContainer();
		var graph = new PIXI.Graphics();
			graph.beginFill(0x000000)
			.drawRoundedRect(0, 0, 220, 45, 45)
			.endFill();
		graph.alpha = 0.3;

		ptsGroup.addChild(graph);

		var ptsSprite = PIXI.Sprite.fromFrame('app_pts');
		ptsSprite.position.x = -2;
		ptsSprite.position.y = -2;

		ptsGroup.addChild(ptsSprite);

		var text = new PIXI.BitmapText(uWorld.getScore().toString(), {font: "31px FredokaOne-Regular"});
		text = Util.DisplayText.shadow(text, 3, 0, 0x61605e, 0.7);
		text.position.x = ~~(graph.width/2 - text.width/2) + 15;
		text.position.y = ~~(graph.height/2 - text.height/2);
		ptsGroup.addChild(text);


		ptsGroup.position.x = -ptsGroup.width/2 - 10;
		ptsGroup.position.y = 350;

		prefab.addChild(ptsGroup);

	}


	if(!isOpen) {
		var previousUnlocked = uWorld.prevHasFinishAllLvl();
		// Display friends
		var padlock = PIXI.Sprite.fromFrame('world_padlock');
		padlock.scale.x = padlock.scale.y = 0.4;
		// previousUnlocked = true;
		if(previousUnlocked) {
			padlock.position.y = -190;

			prefab.addChild(padlock);

			var unlockedIn = new PIXI.BitmapText( _ts('debloquer_dans'), {font: "27px FredokaOne-Regular"});
			unlockedIn = Util.DisplayText.shadow(unlockedIn, 2, 0, 0x0d0d0d, 0.6);
			unlockedIn.position.y = padlock.position.y + padlock.height - 22;
			unlockedIn.position.x = -~~(unlockedIn.width/2);
			prefab.addChild(unlockedIn);



			var totalStar = ATW.App.getPlayer().getStar();
			var atStarText = new PIXI.BitmapText(totalStar + "/" + cWorld.star, {font: "27px FredokaOne-Regular"});
			atStarText = Util.DisplayText.shadow(atStarText, 2, 0, 0x0d0d0d, 0.6);
			atStarText.position.x = -~~(atStarText.width/2);
			atStarText.position.y = unlockedIn.position.y + unlockedIn.height + 10;
			prefab.addChild(atStarText);

			var minStar = PIXI.Sprite.fromFrame('level_star_center');
			minStar.scale.x = minStar.scale.y = 0.6;
			minStar.position.x = atStarText.position.x + atStarText.width + 10 + minStar.width/2;
			minStar.position.y = atStarText.position.y + 10;
			prefab.addChild(minStar);

			var orText = new PIXI.BitmapText(_ts('Ou').toUpperCase(), {font: "42px FredokaOne-Regular"});
			orText = Util.DisplayText.shadow(orText, 2, 0, 0x0d0d0d, 0.6);
			orText.position.x = -~~(orText.width/2);
			orText.position.y = atStarText.position.y + atStarText.height + 25;
			prefab.addChild(orText);

			var friends = uWorld.getFriends()
				, friendsContainer = new PIXI.DisplayObjectContainer()
				, lastBc = null;
			for(var i=0; i<cWorld.nb_friend_need; i++) {
				var isUnlock = (friends.length > i)
					, friendInvite = PIXI.Sprite.fromFrame('friend_invite_bg')
					, friendBc = new PIXI.DisplayObjectContainer;

				if(lastBc) friendBc.position.x = lastBc.position.x + lastBc.width + 10;
				lastBc = friendBc;

				if(i==1) friendBc.position.y = 55;

				friendBc.addChild(friendInvite);

				// Inviter bouton
				var btnInvite = Util.DisplayObject.buttonBlue(_ts('inviter'));
				btnInvite.position.x = friendBc.width/2 - btnInvite.width/2;
				btnInvite.position.y = friendBc.height -5;

				var orText2 = new PIXI.BitmapText(_ts('Ou').toLowerCase(), {font: "24px FredokaOne-Regular"});
				orText2 = Util.DisplayText.shadow(orText2, 2, 0, 0x0d0d0d, 0.5);
				orText2.position.y = btnInvite.position.y + btnInvite.height + 3;
				orText2.position.x = friendInvite.width/2 - orText2.width/2;

				var btnShop = Util.DisplayObject.buttonGreen(uWorld.getPrice().toString());
				btnShop.position.x = friendBc.width/2 - btnShop.width/2;
				btnShop.position.y = orText2.position.y + orText2.height +15;


				friendBc.addChild(btnInvite);
				friendBc.addChild(orText2);
				friendBc.addChild(btnShop);

				friendsContainer.addChild(friendBc);

			}

			friendsContainer.position.x = -~~(friendsContainer.width/2);
			friendsContainer.position.y = orText.position.y + orText.height + 25;

			prefab.addChild(friendsContainer);



		} else {
			padlock.position.y = -70;
			prefab.addChild(padlock);

			var s2 = Util.DisplayText.wrap(_ts('terminez_niveau_anterieur'), {
				font: "27px FredokaOne-Regular",
				letterMax: 30,
				align: "center",
				maxWidth: 320,
				lineHeight: 40
			});

			s2.position.x = -~~(s2.width/2) + 35;
			prefab.addChild(s2);

		}

	}



	return prefab;
};

})(window.Prefab = window.Prefab || {});

/**** views/prefabs/worlds/world_leader.prefab.js ****/
'use strict';

(function(prefabs){

prefabs.world_leader_prefab = function world_leader_prefab(builder, leader){
	var prefab = new PIXI.DisplayObjectContainer()
	, circleLeader = PIXI.Sprite.fromFrame('circle_leader')
	, crown = PIXI.Sprite.fromFrame('crown');

	// Profil Pics
	var pic = Util.DisplayObject.circleProfil(leader.fbId);
	pic.position.x = 2;
	pic.position.y = 3;
	circleLeader.addChild(pic);

	crown.position.y = -42;
	crown.position.x = 35;
	circleLeader.addChild(crown);

	// Info
	var infoContainer = new PIXI.DisplayObjectContainer(),
	bgInfo = PIXI.Sprite.fromFrame('leader_info_bg'),
	encart = PIXI.Sprite.fromFrame('app_encart_yellow');

	infoContainer.addChild(bgInfo);

	encart.scale.x = encart.scale.y = 1.2;

	// var titleBmp = new PIXI.BitmapText(_ts('champion'), {font: "20px FredokaOne-Regular", tint: 0xFF0000});
	var titleBmp = new PIXI.BitmapText(_ts('champion'), {font: "18px FredokaOne-Regular", tint: 0x97855b});
	titleBmp = Util.DisplayText.shadow(titleBmp, 1, 1, 0xFFFFFF, 1);
	titleBmp.position.x = ~~(encart.width/2 - titleBmp.width/2) - 20;
	titleBmp.position.y = ~~(encart.height/2 - titleBmp.height/2) - 10;
	encart.addChild(titleBmp);

	encart.position.x = ~~(bgInfo.width/2 - encart.width/2);
	encart.position.y = 10;
	infoContainer.addChild(encart);

	var nameBmp = new PIXI.BitmapText(leader.firstName, {font: "20px FredokaOne-Regular", tint: 0x97855b})
	nameBmp = Util.DisplayText.shadow(nameBmp, 2, 0, 0xFFFFFF, 1);
	nameBmp.position.y = encart.position.y + encart.height - 8;
	nameBmp.position.x = bgInfo.width/2 - nameBmp.width/2;
	infoContainer.addChild(nameBmp);

	var scoreBmp = new PIXI.BitmapText(leader.score.toString(), {font: "20px FredokaOne-Regular", tint: 0x97855b})
	scoreBmp = Util.DisplayText.shadow(scoreBmp, 2, 0, 0xFFFFFF, 1);
	scoreBmp.position.y = nameBmp.position.y + nameBmp.height + 12;
	scoreBmp.position.x = bgInfo.width/2 - nameBmp.width/2;
	infoContainer.addChild(scoreBmp);

	var ptsIco = PIXI.Sprite.fromFrame('app_pts_orange');
	ptsIco.position.x = scoreBmp.position.x + scoreBmp.width + 5;
	ptsIco.position.y = scoreBmp.position.y - 3;
	infoContainer.addChild(ptsIco);
	infoContainer.alpha = 0;

	var shadow = PIXI.Sprite.fromFrame('av_common_shadow');
	shadow.position.y = infoContainer.height + circleLeader.height + 10;
	shadow.position.x = 35;
	prefab.addChild(shadow);


	prefab.addChild(infoContainer);

	circleLeader.position.x = ~~(infoContainer.width/2 - circleLeader.width/2) - 25;
	circleLeader.position.y = infoContainer.height + 20;
	prefab.addChild(circleLeader);

	prefab.showInfo = function(ori){
		// infoContainer.visible = (!infoContainer.visible);
		if(infoContainer.isShining) {
			TweenLite.to(infoContainer.position, 0.2, {
				y: ori.y + 30
			});
			TweenLite.to(infoContainer, 0.2, {alpha: 0});
		} else {
			TweenLite.to(infoContainer.position, 0.2, {
				y: ori.y - 30
			});
			TweenLite.to(infoContainer, 0.2, {alpha: 1});
		}

		infoContainer.isShining = (!infoContainer.isShining);


	};

	return prefab;
};

})(window.Prefab = window.Prefab || {});

/**** views/prefabs/levels/component.prefab.js ****/
'use strict';

(function(prefabs){

prefabs.level_name = function build_level_name_prefab(levelName){
	var prefab = new PIXI.DisplayObjectContainer()
		, widthGraph = 100
		, heightGraph = 50
		, graph = new PIXI.Graphics();

	graph.beginFill(0x000000)
		.drawRoundedRect(0, 0, widthGraph, heightGraph, 40)
		.endFill();
	graph.alpha = 0.3;

	var levelNameBmp = new PIXI.BitmapText(levelName, {font: '32px FredokaOne-Regular'});
	levelNameBmp = Util.DisplayText.shadow(levelNameBmp, 3, 0, 0x0d0d0d, 0.7);

	levelNameBmp.position.x = ~~(widthGraph/2 - levelNameBmp.width/2);
	levelNameBmp.position.y = ~~(heightGraph/2 - levelNameBmp.height/2);

	prefab.addChild(graph);
	prefab.addChild(levelNameBmp);

	return prefab;
};

prefabs.level_score_end = function build_level_score_end_prefab(myScore){
	var scoreBmp = new PIXI.BitmapText(myScore.toString(), {font: '60px FredokaOne-Regular'});
	scoreBmp = Util.DisplayText.shadow(scoreBmp, 3, 0, 0x0d0d0d, 0.5);

	return scoreBmp;
};


prefabs.level_obj_end = function build_level_obj_end_prefab(cond, text) {
	var validString = (cond) ? 'valid' : 'bad'
		, shadow = (validString == 'valid') ? 0x307ef2 : 0xeb382f
		, checkbox = PIXI.Sprite.fromFrame('ig_checkbg_' + validString)
		, check = PIXI.Sprite.fromFrame('ig_chk_' + validString)
		, line = new PIXI.DisplayObjectContainer()
		, textBmp = new PIXI.BitmapText(text, {font: "28px FredokaOne-Regular"});

	textBmp = Util.DisplayText.shadow(textBmp, 2, 1, shadow, 0.8);


	check.position.x = -2;
	check.position.y = -2;
	checkbox.addChild(check);

	textBmp.position.x = check.width + 10;

	line.addChild(checkbox);
	line.addChild(textBmp);

	line.cacheAsBitmap = true;

	return line;
};




})(window.Prefab = window.Prefab || {});

/**** views/prefabs/avatar/avatar.prefab.js ****/
'use strict';

(function(prefabs){

prefabs.avatar_prefab = function build_avatar_prefab(worldKey, bottomPivot){

	var prefab = new PIXI.DisplayObjectContainer();

	var tpl = ATW.config.avatars[worldKey];
	var customs = tpl.body;

	var inside = null;
	if(customs.length)
	{
		inside = new PIXI.DisplayObjectContainer();
		for(var i in customs)
		{
			var custom = customs[i]
				, item = ATW.Datas.AVATAR[custom.key]
				, sprite = PIXI.Sprite.fromFrame(custom.key);

			sprite.position.x = item.x;
			sprite.position.y = item.y;

			inside.addChild(sprite);

		}

	}

	var shadow = PIXI.Sprite.fromFrame('av_common_shadow')
		, skin = PIXI.Sprite.fromFrame(tpl.skin);

	shadow.position.y = skin.height - 20;
	shadow.position.x = 7;

	prefab.addChild(shadow);
	prefab.addChild(skin);

	if(inside) prefab.addChild(inside);

	if(bottomPivot) {
		prefab.pivot.x = prefab.width/2;
		prefab.pivot.y = prefab.height;

	}


	return prefab;
};

})(window.Prefab = window.Prefab || {});

/**** views/prefabs/button/daily_reward.prefab.js ****/
'use strict';

(function(prefabs){

prefabs.daily_reward_btn = function build_daily_reward_btn_prefab(){
	var player = ATW.App.getPlayer();

	if(!player.hasDailyReward()) {
		var sprite = null;
		if(player.heartAccelerator) {
			sprite = PIXI.Sprite.fromFrame('HEART_ACCELERATOR');
		} else if(player.scoreAccelerator) {
			sprite = PIXI.Sprite.fromFrame('SCORE_ACCELERATOR');
		} else if(player.timeBooster) {
			sprite = PIXI.Sprite.fromFrame('TIME_BOOSTER');
		}

		if(sprite) {
			sprite.anchor.x = sprite.anchor.y = 0.5;
			return sprite;
		}

	} else {
		return Util.DisplayObject.button('button_reward');
	}
};



})(window.Prefab = window.Prefab || {});

/**** models/DifficultyTemplate.js ****/
'use strict';

(function(exports) {


function DifficultyTemplate(difficultyId, level)
{
	this.id            = difficultyId;
	this.nbLetter      = 0;
	this.hasBeenInit   = false;
	this.level         = level;
	this.genereateEach = this.level.getMode().isHanged();
};

DifficultyTemplate.prototype.init = function()
{
	this.tpl = null;
	this._createTpl();
	this.hasBeenInit = true;
	this.letterMap = [];

	this.resetBag();
};

DifficultyTemplate.prototype.resetBag = function()
{
	this.generatedLetter = {};
	this.vowelPercent = Game.Char.getVowelPercent();	// Pourcentage originel
	this.vowels = [];
	this.consonnes = [];



	for(var i in this.tpl)
	{
		var inf = this.tpl[i];
		var nbLetter = parseInt(inf.value, 10);
		var pushIn = (Game.Char.isVowel(inf.letter)) ? this.vowels : this.consonnes;


		for(var i=0; i<nbLetter; i++)
		{
			pushIn.push(inf.letter);
		}

	}

};

DifficultyTemplate.prototype.generateLetterMap = function()
{
	if(!this.genereateEach || (this.letterMap && this.letterMap.length))
	{
		return;
	}

	this.letterMap = [];

	for(var i in this.tpl)
	{
		var inf = this.tpl[i];
		this.letterMap.push(inf.letter);
	}
};

DifficultyTemplate.prototype.letter = function()
{

	if(this.genereateEach)
	{
		this.generateLetterMap();

		var index = Util.Math2.randomInt(0, this.letterMap.length-1);
		var letter = this.letterMap.splice(index, 1);


		return letter[0];
	}



	// 1) Definit le tirage au sort d'une voyelle ou d'une consonne
	var selectedTab = null;
	if(this.vowels.length && !this.consonnes.length)
	{
		selectedTab = this.vowels;
	}
	else if(this.consonnes.length && !this.vowels.length)
	{
		selectedTab = this.consonnes;
	}


	if(! selectedTab)
	{
		var r = Math.random();
		if(r <= this.vowelPercent)
		{
			selectedTab = this.vowels;
			// 1.5) Au tirage d'une voyelle on reinitialise les pourcentages
			this.vowelPercent = Game.Char.getVowelPercent();
		}
		else
		{
			selectedTab = this.consonnes;
			// 2) Le tirage d'une consonne augmente la probabilité de tirer une voyelle
			var upBy = 0.15;
			this.vowelPercent = Math.min(this.vowelPercent + upBy, 1);

		}
	}


	var index = Util.Math2.randomInt(0, selectedTab.length-1);
	var letter = selectedTab.splice(index, 1);

	this.generatedLetter[letter] = letter;

	if(!this.vowels.length && !this.consonnes.length)
	{
		this.resetBag();
	}

	return letter[0];


};

DifficultyTemplate.prototype._createTpl = function()
{
	if(!this.tpl)
	{
		this.tpl = JSON.parse(ATW.Datas.DIFFICULTIES[this.id].tpl);
	}
	return this.tpl;
};

DifficultyTemplate.prototype.getTemplate = function(){ return this._createTpl; };

exports.DifficultyTemplate = DifficultyTemplate;

}) (window.Model = window.Model || {});

/**** models/LetterDropTemplate.js ****/
'use strict';

(function(exports){

function LetterDropTemplate(dropId, difficulty, quantity)
{
	this.id          = dropId;
	this.difficulty  = difficulty;
	this.cfMaxQuantity = this.maxQuantity = quantity;
	this.letters     = [];
	this.fullGrid = false;
};

LetterDropTemplate.prototype.init = function(game)
{

	this.game = game;

	if(game.getLevel().getMode().needFullGrid())
	{
		this.fullGrid = true;
		this.maxQuantity = game.getGrid().getNbSolidLine();
	}

	this._createTpl();
	this.reset();

};

LetterDropTemplate.prototype.reset = function()
{
	LetterDropTemplate.dropAt = null;
	this.difficulty.init();

	this.cursor = 0;
	var map     = [];

	for(var i=0; i<this.maxQuantity; i++)
	{
		map.push(this._createLine(i));
	}

	this.letters = map;
};

LetterDropTemplate.prototype._createLine = function(i)
{
	var grid = this.game.getGrid();
	if(!this.fullGrid)
	{
		// on doit remplir la ligne d'une quantité de lettre comprise entre this.tpl[i].min && this.tpl[i].max
		var useTpl = (this.tpl[i]) ? this.tpl[i] : this.tpl[this.tpl.length - 1];

		var minTpl = parseInt(useTpl.min); // proba de remplissage
		var maxTpl = parseInt(useTpl.max); // proba de remplissage
		var min = ~~((minTpl/100) * grid.getNbSolidCol());
		var max = ~~((maxTpl/100) * grid.getNbSolidCol());

		min = Math.max(1, min);
		max = Math.min(max, grid.getNbSolidCol());
		min = Math.min(min, max);

		var toGenerate = Util.Math2.randomInt(min, max);
	}
	else
	{
		var toGenerate = grid.getNbSolidCol();
	}

	return Game.Grid.generateHeapLetter(grid, this.difficulty, toGenerate);
};

LetterDropTemplate.prototype.use = function()
{

	if(this.fullGrid && this.cursor)
	{
		this.reset();
	}

	var nbLine = (!this.fullGrid) ? 1 : this.maxQuantity;

	var lettersFish = [];
	var length      = 0;


	for(var i=0; i<nbLine; i++)
	{
		var lettersLine = (this.letters[this.cursor]) ? this.letters[this.cursor] : this._createLine(this.cursor);

		var lFish           = null;
		var lettersFishLine = [];

		for(var j=0; j<lettersLine.length; j++)
		{
			lFish = null;
			if(lettersLine[j])	// Verifie la presence de la lettre (peut etre null)
			{
				// Construit une nouvelle meduse
				lFish = Game.LetterFish.create(lettersLine[j], this.difficulty);
				length++;
			}
			lettersFishLine.push(lFish);
		}

		lettersFish.push(lettersFishLine);

		this.cursor++;
		if(this.cursor >= this.letters.length)
		{
			break;
		}
	}


	return {
		res: lettersFish,
		length: length
	};
};

LetterDropTemplate.prototype._createTpl = function()
{
	if(!this.tpl) this.tpl = JSON.parse(ATW.Datas.LETTERDROPS[this.id].tpl);

	return this.tpl;
};

LetterDropTemplate.prototype.getTemplate    = function(){ return this._createTpl; };
LetterDropTemplate.prototype.getMaxQuantity = function(){ return this.maxQuantity; };
LetterDropTemplate.prototype.getQuantityLeft = function()
{
	return this.maxQuantity - this.cursor;
};

LetterDropTemplate.prototype.getCursor = function() { return this.cursor; };


exports.LetterDropTemplate = LetterDropTemplate;

})(window.Model = window.Model || {});

/**** models/WaveTemplate.js ****/
'use strict';

(function(exports) {

function WaveTemplate(waveId, drop)
{
	this.id         = waveId;
	this.drop       = drop;
};

// Crée une nouvelle pioche
WaveTemplate.prototype.init = function(game)
{
	this.drop.init(game);
};


WaveTemplate.prototype.next = function()
{
	var res = this.drop.use();
	return res;
};


WaveTemplate.prototype.getTimeout = function()
{
	this._createTpl();

	if(useCursor >= 1)
	{
		useCursor -= 1;
	}

	if(this.drop.cursor >= this.tpl.length)
	{
		var useCursor = this.tpl.length-1;
	}
	else
	{
		var useCursor = this.drop.cursor;
		if(useCursor >= 1)
		{
			useCursor -= 1;
		}

	}

	var currentStart = parseInt(this.tpl[useCursor], 10);
	if(ATW.App.getPlayer().timeBooster)
	{
		currentStart = Math.ceil(currentStart * 1.1);
	}

	return currentStart;

};


WaveTemplate.prototype._createTpl = function()
{
	if(!this.tpl) this.tpl = JSON.parse(ATW.Datas.WAVES[this.id].tpl);

	return this.tpl;
};

WaveTemplate.prototype.getTemplate = function(){ return this._createTpl; };
WaveTemplate.prototype.getCursor   = function(){ return this.cursor; };
WaveTemplate.prototype.getDrop     = function(){ return this.drop; };

exports.WaveTemplate = WaveTemplate;

})(window.Model = window.Model || {});

/**** models/User.js ****/
(function(exports){

function User(data)
{
	this.worlds = {};
	this.bonusMap = {};
	this.life = 0;
	this.achievementManager = new Model.AchievementManager();
	this.messenger = new Model.Messenger(data.notifs);

	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			case 'worlds':
				for(var worldId in val)
				{
					this.worlds[worldId] = new Model.World(val[worldId]);
					this.worlds[worldId].setId(worldId);
					this.worlds[worldId].setUser(this);
				}
				break;

			case 'bonusMap':
				for(var bonusId in val)
				{
					this.bonusMap[bonusId] = new Model.Bonus(val[bonusId]);
				}
				break;

			case 'achievements':
				for(var achKey in val)
				{
					var achievementsList = val[achKey];
					for(var achID in achievementsList)
					{
						this.achievementManager.setAchievement(new Model.Achievement(achievementsList[achID]));
					}


				}
				break;

			default:
				this[baseKey] = val;
		}
	}

	// if(!this.pearls || this.pearls < 1000) {
	// 	this.pearls = 9999;
	// 	alert('Debug 999 pearls gift');
	// }
	this.reset();
};

User.prototype.hasDailyReward = function(){	return this.waitingDailyGift; };

User.prototype.getBMapResume = function() {
	var o = {};
	for(var i in this.bonusMap)
	{
		o[i] = this.bonusMap[i].getResume();
	}

	return o;
};

User.prototype.isFullLife = function()
{
	return (Util.Math2.castInt(ATW.Datas.CONFIGS.GEN_MAX_LIFE) == this.life);
};


User.prototype.getLife = function(){ return this.life; }
User.prototype.hasLife = function(){ return this.getLife(); }

User.prototype.consumeBonus = function(bonusID)
{
	if(!this.hasBonus(bonusID))
	{
		return false;
	}

	return this.bonusMap[bonusID].decr();
};

User.prototype.incrBonus = function(bonusID, by)
{
	if(!this.hasBonus(bonusID))
	{
		this.addBonus(bonusID);
	}

	this.bonusMap[bonusID].incr(by);
};

User.prototype.addBonus = function(bonusID)
{
	this.bonusMap[bonusID] = new Model.Bonus({
		id: bonusID
	});
};

User.prototype.myUpdate = function(res)
{
	if(!res.u)
	{
		return;
	}

	for(var key in res.u)
	{
		if(key == 'bonusMap')
		{
			var resBonusMap = res.u[key];
			for(var bID in resBonusMap)
			{
				if(!this.hasBonus(bID))
				{
					this.addBonus(bID);
				}
				this.bonusMap[bID].setQuantity(resBonusMap[bID].quantity);
			}
		}
		else
		{
			this[key] = res.u[key];
		}

	}


	if(this.onMyUpdate)
	{
		this.onMyUpdate();
	}
};


User.prototype.reset = function()
{
	this.star = null;
};

User.prototype.incrPearls = function(by)
{
	if(!this.pearls) this.pearls = by;
	else this.pearls = Util.Math2.castInt(this.pearls) + by;
};

User.prototype.getPearls = function()
{
	return Util.Math2.castInt(this.pearls) || 0;
};


User.prototype.getWorld = function(cWorld, keys)
{
	if(!this.worlds) this.worlds = {};
	if(!this.worlds[cWorld.id])
	{
		this.worlds[cWorld.id] = new Model.World({
			fake: true,
			id: cWorld.id,
			user: this
		});
	}

	var world = this.worlds[cWorld.id];
	if(!keys)
	{
		return world;
	}

	if(keys.length == 1)
	{
		return world[keys[0]];
	}

	var data = {};
	for(var i in keys)
	{
		data[keys[i]] = world[keys[i]];
	}

	return data;
};

User.prototype.getStar = function()
{
	if(this.star != null)
	{
		return this.star;
	}

	if(!this.worlds)
	{
		return 0;
	}

	this.star = 0;
	for(var i in this.worlds)
	{
		this.star += this.worlds[i].sumStar();
	}

	return this.star;
};

User.prototype.hasBonus = function(bonusID)
{
	return ( this.bonusMap[bonusID] );
};


User.prototype.getBonus       = function(bonusID) { return this.bonusMap[bonusID]; };
User.prototype.getBonusMap    = function() { return this.bonusMap; };
User.prototype.getWorlds      = function() { return this.worlds; };

User.prototype.isTutoFisnish = function(key)
{
	// return true;
	return (this.tutos && this.tutos[key]) ? true : false;
};

User.prototype.finishTuto = function(key)
{
	if(!this.tutos)
	{
		this.tutos = {};
	}
	this.tutos[key] = {done: true};
};

User.prototype.setPearls = function(pearls)
{
	this.pearls = pearls;
};

User.prototype.getName = function()
{
	return this.firstName + ' ' + this.lastName;
};

User.prototype.getFirstName = function()
{
	return this.firstName;
};

User.prototype.getLastName = function()
{
	return this.lastName;
};

User.prototype.getLang = function()
{
	return this.lang;
};


User.prototype.setLanguage = function(lang, locale){
	this.lang = lang;
	this.locale = locale;
};

User.prototype.getTimeAccelLeft = function()
{
	if(!App.getPlayer().timeAccelLeft) return null;
	return App.getPlayer().timeAccelLeft - DateHelper.getAccelElapseTime();
};

User.prototype.createAccel = function(key) {
	this[key] = true;
};



User.prototype.getLocale = function()
{
	return this.locale;
};

User.prototype.isOnSession = function()
{
	return this.normalSessionAt;
};

User.prototype.getAchievementManager = function()
{
	return this.achievementManager;
};

User.prototype.getMessenger = function()
{
	return this.messenger;
};

exports.User = User;

})(window.Model = window.Model || {});

/**** models/AchievementManager.js ****/
'use strict';
(function(exports){

function AchievementManager()
{
	this.achievements = Util.Achievement.castByKey();
	this.hasUpdate = false;
	this.nbGiftLeft = 0;
};

AchievementManager.prototype.setAchievement = function(achievement)
{
	var achKey = achievement.getKey();
	if(!this.achievements[achKey])
	{
		this.achievements[achKey] = {};
	}

	if(
		(!this.achievements[achKey][achievement.getId()] || !this.achievements[achKey][achievement.getId()].isComplete())
		&& achievement.hasGift())
	{
		this.nbGiftLeft++;
	}

	this.achievements[achKey][achievement.getId()] = achievement;
};

AchievementManager.prototype.dispatch = function(key, content, by, replace)
{
	if(!this.achievements[key])
	{
		return false;
	}

	var achList = this.achievements[key];
	for(var i in achList)
	{
		var b = achList[i].incr(content, by, replace);
		if(b)
		{
			achList[i].hasUpdate = true;
			this.hasUpdate = true;

			if(achList[i].isComplete())
			{
				this.nbGiftLeft++;
				if(this.onComplete) this.onComplete(achList[i]);
			}
		}
	}

	return this.hasUpdate;
};

AchievementManager.prototype.getNbGiftLeft = function()
{
	return this.nbGiftLeft;
};

AchievementManager.prototype.save = function(force, rwId)
{
	if(!force && !this.hasUpdate)
	{
		return;
	}
	this.hasUpdate = false;

	var data = {};
	for(var key in this.achievements)
	{
		var achList = this.achievements[key];


		for(var id in achList)
		{
			if(!achList[id].hasUpdate) continue;

			if(!data[key]) data[key] = {};

			data[key][id] = achList[id].getResume();
			achList[id].hasUpdate = true;
		}

	}

	ATW.App.getDataManager().getApi().call('Achievement', 'POST', {
		on: 'me',
		data: data
	}, function(res){});

};

AchievementManager.prototype.each = function(cb, byCategory, exclude)
{
	if(byCategory)
	{
		through = {};
		for(var key in this.achievements)
		{
			if(!through[key]) through[key] = {};
			var achList = this.achievements[key];

			for(var id in achList)
			{
				var a = achList[id];
				var cat = a.getCategory();

				if(!through[key][cat]) through[key][cat] = [];

				through[key][cat].push(a);

			}

			// console.log('through', key, through[key]);
			for(var cat in through[key])
			{

				through[key][cat].sort(function(ach1, ach2){
					if(ach1.x > ach2.x) return 1;
					if(ach1.x < ach2.x) return -1;

					return 0;
				});

				var oldAch = null;
				for(var k in through[key][cat])
				{
					if(!oldAch || oldAch.isComplete()) {
						cb(through[key][cat][k]);
						oldAch = through[key][cat][k];
					}

				}
			}



		}

	}
	else
	{
		for(var key in this.achievements)
		{
			var achList = this.achievements[key];

			for(var id in achList)
			{
				cb(achList[id]);
			}

		}
	}


};



AchievementManager.prototype.getAchievements = function(key)
{
	return this.achievements[key];
};

AchievementManager.prototype.getAchievement = function(cAchievement)
{
	var key = ConfigAchievementHelper.getTypeKey(cAchievement.id);

	if(!key || !this.achievements[key] || !this.achievements[key][cAchievement.id]) {
		return false;
	}

	return this.achievements[key][cAchievement.id];
}

exports.AchievementManager = AchievementManager;

})(window.Model = window.Model || {});

/**** models/Achievement.js ****/
'use strict';

(function(exports){


function Achievement(data)
{
	this.id = data.id;

	this.progress = data.progress || 0;
	this.progress = Util.Math2.castInt(this.progress);
	this.reward = data.reward || false;

	this.x = parseInt(data.x, 10);
	this.y = data.y;
	this.z = data.z;

	if(typeof this.x == "undefined"
		|| typeof this.y == "undefined"
		|| typeof this.z == "undefined"
	) {
		var cf = ATW.Datas.ACHIEVEMENTS[this.id];
		this.x = parseInt(cf.x, 10);
		this.y = cf.y;
		this.z = cf.z;
	}

};

Achievement.prototype.getCategory = function()
{
	var key = this.getKey();
	return this.y || 0;
};

Achievement.prototype.getDescription = function()
{
	var cf = Util.Achievement.getType(this.id);
	var y = this.y;
	if(y && y.indexOf("~") === 0) {
		y = _ts('bonus_'+y.slice(1).toLowerCase()+'_ecrit');
		y = y.toUpperCase();
	}

	return Util.String2.strtr(_2(cf.name), {
		':x': this.x,
		':y': y,
		':z': this.z
	});
};

Achievement.prototype.getRewards = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].rws;
};

Achievement.prototype.getPearls = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].pearls;
};

Achievement.prototype.hasGift = function()
{
	return (this.isComplete() && !this.reward);
};

Achievement.prototype.getEndPoint = function()
{
	var r = 0;
	var key = this.getKey();
	switch(key)
	{

		case 'GET_PEARLS':
		case 'WRITE_WORD':
		case 'USE_MANUAL_BONUS':
		case 'USE_LETTER':
		case 'GET_POINTS_IN_WORD':
		case 'WORD_MASTER':
		case 'GET_EMPTY_GRID':
		case 'LEVEL_BY_EMPTY_GRID':
		case 'LAST_SEC_SAVE':
		case 'FIRST_SEC_SAVE':
		case 'GET_FRIENDS':
		case 'DUEL_FRIENDS':
		case 'DUEL_SEND':
		case 'RAND_DUEL_WON':
			r = this.x;
			break;

		case 'USE_LETTER_IN_WORD':
		case 'PERFECT_LEVEL':
			r = 1;
			break;

		default:
			console.log('Achievement::getEndPoint():' + key + ' not implemented yet');
	}

	return Util.Math2.castInt(r);
};

Achievement.prototype.isObjFill = function(ref)
{
	switch(this.getKey())
	{
		case 'WRITE_WORD':   // OK
			// var checkWord = ref;
			var y = this.y;
			if(y && y.indexOf("~") === 0) {
				y = _ts('bonus_'+y.slice(1).toLowerCase()+'_ecrit');
			}
			return (ref.toUpperCase() == y.toUpperCase());

		case 'USE_LETTER':   // OK
			return (ref.toUpperCase() == this.y.toUpperCase());

		case 'USE_LETTER_IN_WORD':
			return (ref.letter.toUpperCase() == this.y.toUpperCase() && ref.nb >= Util.Math2.castInt(this.x));

		case 'GET_POINTS_IN_WORD':
			// Ref : WORLD ID
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.y));

		case 'USE_MANUAL_BONUS':
		case 'WORD_MASTER':
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.y));

		case 'PERFECT_LEVEL':
			return (Util.Math2.castInt(ref) == Util.Math2.castInt(this.x));

		case 'GET_PEARLS':
		case 'GET_EMPTY_GRID':
			return ref.nb > 0;

		case 'FIRST_SEC_SAVE':
		case 'LAST_SEC_SAVE':
			return true;

	}

	return false;
};

Achievement.prototype.incr = function(content, by, replace)
{

	if(this.isComplete()
		|| (content && content.ref && !this.isObjFill(content.ref))
	) {
		return false;
	}

	if(!by)
	{
		by = 1;
	}

	if(!replace)
	{
		this.progress += by;
	}
	else
	{
		this.progress = by;
	}

	return true;
};


Achievement.prototype.getPercent = function()
{
	return ~~Math.min((this.progress / this.getEndPoint())*100, 100);
};

Achievement.prototype.isComplete = function()
{


	return (this.progress >= this.getEndPoint());
};

Achievement.prototype.getKey = function()
{
	return Util.Achievement.getTypeKey(this.id);
};

Achievement.prototype.getName = function()
{
	return _2(ATW.Datas.ACHIEVEMENTS[this.id].name);
};

Achievement.prototype.getNameId = function()
{
	return ATW.Datas.ACHIEVEMENTS[this.id].name;
};

Achievement.prototype.getResume = function() {
	return {
		id: Util.Math2.castInt(this.id),
		progress: this.progress,
		reward: this.reward
	};
};
Achievement.prototype.getProgress = function() { return this.progress; };
Achievement.prototype.getId = function() { return this.id; };

exports.Achievement = Achievement;

})(window.Model = window.Model || {});

/**** models/Level.js ****/
'use strict';
(function(exports){

function Level(data)
{
	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			default:
				this[baseKey] = val;
		}
	}

	this.mode = null;
	this.waveHandler = null;

	var cLevel = ATW.Datas.LEVELS[data.id];
	this.mode = new Model.Mode(cLevel.mode_id, this);

	var difficultyTpl = new Model.DifficultyTemplate(cLevel.difficulty_id, this);
	var dropTpl       = new Model.LetterDropTemplate(cLevel.drop_id, difficultyTpl, cLevel.wave_quantity);
	this.waveHandler  = new Model.WaveTemplate(cLevel.wave_id, dropTpl);

	this.opponent = null;
	this.pearlsGrind = Util.Math2.castInt(data.pearlsGrind) || 0;

};

Level.prototype.getDifficultyTpl = function()
{
	return this.waveHandler.drop.difficulty;
};

Level.prototype.getNbWave = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	switch(this.mode.getKey())
	{
		case 'WRECKING_BALL':
		case 'HANGED':
				return this.waveHandler.getDrop().cfMaxQuantity;
		case 'SURVIVAL':
		case 'SIMPLE':
			return this.waveHandler.getDrop().getMaxQuantity();

		// case 'SURVIVAL':
		// 	return -1;
		case 'CROSSWORD':
			return 1;
	}


};


Level.prototype.addPearl = function(pearls)
{
	this.pearlsGrind += pearls;
};

Level.prototype.hasTuto = function()
{

	var order = this.getOrder(),
		player = ATW.App.getPlayer();
	if((!player.isTutoFisnish('level1') && order == 0)
		|| (!player.isTutoFisnish('level2') && order == 1)
		|| (!player.isTutoFisnish('level3') && order == 2)
		|| (!player.isTutoFisnish('level4') && order == 3)
	) {
		return order;
	}

	return false;

};

Level.prototype.getName = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.name;
};

Level.prototype.update = function(data)
{
	for(var i in data)
	{
		this[i] = data[i];
	}

	if(this.fake)
	{
		this.world.fake = false;
		this.fake = false;

	}

	ATW.App.getPlayer().reset();
};


// --------------------------------------------------------------
// Verifie l'ouverture d'un niveau
// --------------------------------------------------------------
Level.prototype.isOpen = function()
{
	var debug = (this.id == 1);
	var cLevel = ATW.Datas.LEVELS[this.id];

	// Le monde est accessible par defaut
	if(Util.Level.isAccessible(cLevel))
	{
		return true;
	}

	// Le niveau est ouvert si l'utilisateur a complete son antecedent
	var cPreviousLevel = Util.Level.getPrevious(cLevel);
	if(!cPreviousLevel)
	{
		return false;
	}

	return this.world.getLevel(cPreviousLevel).isComplete();
};

// --------------------------------------------------------------
// Le level est il termine ?
// --------------------------------------------------------------
// Level.prototype.isComplete = function(){ return (this.star); }
Level.prototype.isComplete = function(){
	return this.star || this.bought;
};

// --------------------------------------------------------------
// Le level est il termine a 100% ?
// --------------------------------------------------------------
Level.prototype.isCompletelyOver = function()
{
	if(!this.over)
	{
		return false;
	}
	return this.over;
};


Level.prototype.getStar = function()
{
	if(!this.star)
	{
		return 0;
	}
	return Util.Math2.castInt(this.star);
};

Level.prototype.getScore = function()
{
	if(!this.score)
	{
		return 0;
	}
	return Util.Math2.castInt(this.score);
};

Level.prototype.getHighScore = function()
{
	if(!this.highScore)
	{
		return 0;
	}

	return Util.Math2.castInt(this.highScore);
};


Level.prototype.getNext = function()
{
	var cNext = Util.Level.getNext(ATW.Datas.LEVELS[this.id]);
	if(!cNext)
	{
		return false;
	}

	return this.world.getLevel(cNext);

};

Level.prototype.shop = function()
{
	this.fake = false;
	this.bought = true;
}

Level.prototype.isBuyable = function()
{
	return this.isFake();
};


Level.prototype.getPrevious = function()
{
	var cPrev = Util.Level.getPrevious(ATW.Datas.LEVELS[this.id]);
	if(!cPrev)
	{
		return false;
	}

	return this.world.getLevel(cPrev);
};

// --------------------------------------------------------------
// GETTERS
// --------------------------------------------------------------
Level.prototype.getLife = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.life;
};
Level.prototype.getConf  = function() { return ATW.Datas.LEVELS[this.id]; };
Level.prototype.getGrid  = function() { return this.grid; };
Level.prototype.isFake   = function() { return this.fake; };
Level.prototype.getId    = function() { return this.id; };
Level.prototype.getWorld = function() { return this.world; };
Level.prototype.getMode  = function() { return this.mode; };
Level.prototype.getOpponent = function() { return this.opponent; };
Level.prototype.getPoint = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return {x: cLevel.point_x, y:cLevel.point_y};
};
Level.prototype.getWaveHandler = function(){ return this.waveHandler; };
Level.prototype.getSpawnPearl = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.spawn_pearl;
};

Level.prototype.isScoringActive = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return cLevel.scoring;
};


Level.prototype.getOrder = function()
{
	var cLevel = ATW.Datas.LEVELS[this.id];
	return Util.Math2.castInt(cLevel.order);
};

Level.prototype.getDuration = function()
{
	return this.duration || 0;
};

Level.prototype.getPearls = function(){ return this.pearlsGrind; };
Level.prototype.incrPearls = function(by) {
	this.pearlsGrind += by;
};


Level.prototype.setOpponent = function(opponent)
{
	this.opponent = opponent;
};

Level.prototype.getPointFrame = function(){
	var pointFrame = 'world_point_off';
	if(this.isComplete()) pointFrame = 'world_point_done';
	else if(this.isOpen()) pointFrame = 'world_point_todo';

	return pointFrame;
};


// --------------------------------------------------------------
// SETTERS
// --------------------------------------------------------------
Level.prototype.setWorld = function(world) { this.world = world; };
Level.prototype.setId    = function(id) { this.id = id; };

exports.Level = Level;

})(window.Model = window.Model || {});

/**** models/Mode.js ****/
(function(exports){

function Mode(id, level)
{
	this.cf = ATW.Datas.MODES[id];
	this.level = level;
};

Mode.prototype.hasHourglass = function()
{
	return (
		this.getDuration() != -1
		&& (
			this.isCrossword()
			|| this.isWreckingBall()
			|| this.isHanged()
			// || this.isSurvival()
		)
	);
};

Mode.prototype.getEndPoint = function()
{
	return Util.Math2.castInt(ATW.Datas.LEVELS[this.level.getId()].obj_endpoint);
};


Mode.prototype.needFullGrid = function()
{
	return (this.isWreckingBall() || this.isCrossword() || this.isHanged()) ;
};


Mode.prototype.getProgressLeft = function(cGoal)
{
	return this.getEndPoint() - cGoal;
};

Mode.prototype.getDescription = function(cGoal, currentStar, currentScore, dontSpan)
{

	var endPoint = this.getEndPoint();
	var goals = this.findGoals();
	var isScoringObj = false;
	// if(currentStar >= goals.length)
	if(cGoal >= endPoint)
	{
		if(currentStar > 0)
		{
			return true;

		}

		isScoringObj = true;

	}


	if(this.level.isScoringActive() || isScoringObj)
	{
		var y = goals[currentStar] - currentScore;
		var txt = '<span>' + y + '</span>';
		if(dontSpan)
		{
			txt = y;
		}

		return _ts('obtenir_x_points', {
			':x' : txt
		});
	}

	var newY = endPoint - cGoal;

	if(!dontSpan)
	{
		newY = '<span>' + newY + '</span>';
	}


	var naturalDesc = _2(this.cf.description);
	switch(this.getKey())
	{
		case Mode.CROSSWORD:
			var a2 = this.getArg2();
			if(!a2)
			{
				naturalDesc = _2(this.cf.description2);
			}

			return Util.String2.strtr(naturalDesc, {
				':x': this.getX(),
				// ':y': y,
				':y': newY,
				':arg2': a2
			});

		case Mode.WRECKING_BALL:
		case Mode.SURVIVAL:
		case Mode.HANGED:
			return Util.String2.strtr(naturalDesc, {
				':x': this.getX(),
				// ':y': y
				':y': newY
			});
		case Mode.SIMPLE:

			if(!Util.Math2.castInt(this.getX()))
			{
				naturalDesc = _2(this.cf.description2);
			}

			return Util.String2.strtr(naturalDesc, {
				':nb_wave': this.level.getNbWave(),
				':x': this.getX(),
				// ':y': y
				':y': newY
			});

	}

	return naturalDesc;

};

Mode.prototype.hasDisplayHighduration = function(){	return (this.isWreckingBall() || this.isCrossword()); };

Mode.prototype.isSimple       = function() { return (this.getKey() == 'SIMPLE'); };
Mode.prototype.isHanged       = function() { return (this.getKey() == 'HANGED'); };
Mode.prototype.isSurvival     = function() { return (this.getKey() == 'SURVIVAL'); };
Mode.prototype.isWreckingBall = function() { return (this.getKey() == 'WRECKING_BALL'); };
Mode.prototype.isCrossword    = function() { return (this.getKey() == 'CROSSWORD'); };

Mode.prototype.getX = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return cLevel.mode_arg1;
};

Mode.prototype.getY = function(currentStar)
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return cLevel.obj_star1;
};


Mode.prototype.findGoalsPos = function(totalHeight)
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];

	var stars = [
		{y: ~~(totalHeight/3), value: Util.Math2.castInt(cLevel.obj_star1)},
		{y: ~~(totalHeight/3)*2, value: Util.Math2.castInt(cLevel.obj_star2)},
		{y: totalHeight, value: Util.Math2.castInt(cLevel.obj_star3)}
	];

	return stars;
};


Mode.prototype.getStar3 = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return Util.Math2.castInt(cLevel.obj_star3);
};


Mode.prototype.findGoals = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return [Util.Math2.castInt(cLevel.obj_star1), Util.Math2.castInt(cLevel.obj_star2), Util.Math2.castInt(cLevel.obj_star3)];
};

Mode.prototype.getArg2 = function()
{
	var cLevel = ATW.Datas.LEVELS[this.level.getId()];
	return Util.Math2.castInt(cLevel.mode_arg2);
};

Mode.prototype.getDuration = function()
{
	if(this.isHanged())
	{
		return this.getArg2();
	}
	else if(this.isSurvival())
	{
		return this.getEndPoint();
	}

	return  this.getX();


};


Mode.prototype.isFinish = function(star)
{
	if(!this.cf.stop)
	{
		return false;
	}

	var goals = this.findGoals();
	return (star >= goals.length);
};


Mode.prototype.getId          = function() { return this.cf.id; };
Mode.prototype.getKey         = function() { return this.cf.key; };
Mode.prototype.getName        = function() { return this.cf.name; };


Mode.CROSSWORD     = 'CROSSWORD';
Mode.WRECKING_BALL = 'WRECKING_BALL';
Mode.SURVIVAL      = 'SURVIVAL';
Mode.HANGED        = 'HANGED';
Mode.SIMPLE        = 'SIMPLE';


Mode.tutoRef = {};
Mode.tutoRefManual = {};

Mode.tutoRef[Mode.CROSSWORD] = 'crossword';
Mode.tutoRef[Mode.WRECKING_BALL] = 'miley_cyrus';
Mode.tutoRef[Mode.SURVIVAL] = 'survival_mode';
Mode.tutoRef[Mode.HANGED] = 'hanged';
Mode.tutoRef[Mode.SIMPLE] = 'first_game';

Mode.tutoRefManual[Mode.CROSSWORD] = 'crossword';
Mode.tutoRefManual[Mode.WRECKING_BALL] = 'miley_cyrus_manual';
Mode.tutoRefManual[Mode.SURVIVAL] = 'survival_mode_manual';
Mode.tutoRefManual[Mode.HANGED] = 'hanged';
Mode.tutoRefManual[Mode.SIMPLE] = 'simple_manual';


exports.Mode = Mode;

})(window.Model = window.Model || {});

/**** models/World.js ****/
(function(exports){

function World(data)
{
	this.bought = data.bought;
	this.levels = {};
	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			case 'levels':
				for(var levelId in val) this.addLevel(val[levelId]);
				break;

			default:
				this[baseKey] = val;
		}
	}

	this.opponent = null;
};

World.prototype.setEnterOnce = function(bool){	this.enterOnce = bool; };
World.prototype.isEnterOnce = function(){return this.enterOnce;};


World.prototype.addLevel = function(data)
{
	this.levels[data.id] = new Model.Level(data);
	this.levels[data.id].setWorld(this);
	this.levels[data.id].setId(data.id);
};

World.prototype.getFriends = function()
{
	return this.friends || [];
};

World.prototype.addFriend = function()
{
	if(!this.friends)
	{
		this.friends = [];
	}

	this.friends.push({
		bought: true
	});

};


// --------------------------------------------------------------
// Le nombre d'étoiles que l'on a recolté dans ce monde
// --------------------------------------------------------------
World.prototype.sumStar = function()
{
	if(this.isFake())
	{
		return 0;
	}

	var myStar = 0;
	for(var i in this.levels)
	{
		myStar += this.levels[i].getStar();
	}

	return myStar;
};

World.prototype.getMaxStar = function()
{
	return ATW.Datas.WORLDS[this.id].star_max;
};

World.prototype.getPrice = function()
{
	var friends = this.getFriends();
	var product = Util.Shop.findProductByKey('FRIEND_BASE');
	var price = Util.Math2.castInt(product.price);

	return price - (Util.Math2.castInt(ATW.Datas.CONFIGS.SHOP_FRIEND_DECR_BY)*friends.length);

};

World.prototype.getStarNeed = function()
{
	return (ATW.Datas.WORLDS[this.id].star - App.getPlayer().getStar());
};

World.prototype.prevHasFinishAllLvl = function()
{
	var cWorld = ATW.Datas.WORLDS[this.id];
	// Le monde est ouvert si l'utilisateur a complete son antecedent
	var cPreviousWorld = Util.World.getPrevious(cWorld);
	if(!cPreviousWorld)
	{
		// console.log('previous nop')
		return false;
	}

	var prevWorld = this.user.getWorld(cPreviousWorld);
	if(prevWorld.isFake())
	{
		// console.log('previous fake')
		return false;
	}

	if(!prevWorld.hasFinishAllLvl())
	{
		// console.log('dernier level non complete')
		return false;
	}

	return true;

};

World.prototype.getName = function()
{
	return ATW.Datas.WORLDS[this.id].name;
};

// --------------------------------------------------------------
// Verifie l'ouverture d'un monde
// --------------------------------------------------------------
World.prototype.isOpen = function()
{
	if(this.bought)
	{
		return true;
	}

	var cWorld = ATW.Datas.WORLDS[this.id];
	// Le monde est accessible par defaut
	if(Util.World.isAccessible(cWorld))
	{
		return true;
	}

	if(!this.prevHasFinishAllLvl())
	{
		return false;
	}


	var friends = this.getFriends();
	if(friends.length >= cWorld.nb_friend_need)
	{
		return true;
	}

	return (this.getStarNeed() <= 0);
};

World.prototype.hasFinishAllLvl = function()
{
	var cWorld = ATW.Datas.WORLDS[this.id];

	for(var i in cWorld.levels)
	{
		var levelId = cWorld.levels[i];
		if(!this.levels[levelId] || !this.levels[levelId].getStar())
		{
			return false;
		}

	}

	return true;
};


// --------------------------------------------------------------
// Le monde est il termine ?
// --------------------------------------------------------------
World.prototype.isComplete = function()
{
	if(this.isFake())
	{
		return false;
	}

	return (this.sumStar() >= ATW.Datas.WORLDS[this.id].star && this.hasFinishAllLvl());
};

World.prototype.getScore = function(){
	if(this.isFake())
	{
		return 0;
	}

	var score = 0;
	for(var id in this.levels) {
		score += this.levels[id].getScore();
	}
	return score;
};

World.prototype.getLevel = function(cLevel)
{
	if(!this.levels) this.levels = {};

	if(!this.levels[cLevel.id])
	{
		this.levels[cLevel.id] = new Model.Level({
			fake: true,
			world: this,
			id: cLevel.id
		});
	}

	return this.levels[cLevel.id];
};

World.prototype.shop = function()
{
	this.fake = false;
	this.bought = true;
};


World.prototype.getConf = function() { return ATW.Datas.WORLDS[this.id]; };
World.prototype.getKey = function() { return ATW.Datas.WORLDS[this.id].key; };
World.prototype.isFake  = function(){ return this.fake; };
World.prototype.setId   = function(id){ this.id = id; };
World.prototype.getId   = function() { return this.id; };
World.prototype.setUser = function(user) { this.user = user; };
World.prototype.getUser = function() { return this.user; };

World.prototype.getOpponent = function() { return this.opponent; };
World.prototype.setOpponent = function(opponent)
{
	this.opponent = opponent;
};


World.prototype.getLastVisited = function()
{
	return this.lastVisited;
};

World.prototype.setLastVisited = function(lastVisited)
{
	this.lastVisited = lastVisited;
};


exports.World = World;

})(window.Model = window.Model || {});

/**** models/Bonus.js ****/
'use strict';

(function(exports){

function Bonus(data)
{

	for(var baseKey in data)
	{
		var val = data[baseKey];
		switch(baseKey)
		{
			default:
				this[baseKey] = val;
		}

	}

};

Bonus.prototype.myUpdate = function(o)
{
	for(var key in o)
	{
		this[key] = o[key];
	}
};

Bonus.prototype.getGroundObject = function()
{
	var gId = this.getGroundObjectID();
	if(!gId)
	{
		return null;
	}

	return ATW.Datas.GROUNDOBJECT[gId];
};

Bonus.prototype.decr = function()
{
	var q = this.getQuantity();
	if(!q)
	{
		return false;
	}
	this.quantity = q-1;
	return true;
};

Bonus.prototype.incr = function(by)
{
	if(!by)
	{
		by = 1;
	}
	this.quantity = this.getQuantity()+by;
};

Bonus.prototype.isBomb = function(){ return this.getKey() == 'BONUS_BOMB'; };

Bonus.prototype.getId             = function() { return this.id; };
Bonus.prototype.getKey            = function() { return ATW.Datas.BONUS[this.id].key; };
Bonus.prototype.getWidth          = function() { return ATW.Datas.BONUS[this.id].width; };
Bonus.prototype.getHeight         = function() { return ATW.Datas.BONUS[this.id].height; };
Bonus.prototype.hasGroundObject   = function() { return this.getGroundObjectID(); };
Bonus.prototype.getGroundObjectID = function() { return ATW.Datas.BONUS[this.id].groundObjectId; };
Bonus.prototype.getQuantity       = function() { return this.quantity ? Util.Math2.castInt(this.quantity) : 0; };
Bonus.prototype.setQuantity = function(qty) { this.quantity = qty; };
Bonus.prototype.getResume = function() { return {id:this.id, quantity: this.quantity}; };

exports.Bonus = Bonus;

})(window.Model = window.Model || {});


/**** models/Messenger.js ****/
'use strict';

(function(exports){

function Messenger(data)
{
	this.reset();

	// this.genId = Messenger.ids++;
	for(var i in data) {
		var currentData = data[i];
		this.addSVRequest(currentData);
	}


};

Messenger.ids = 0;

Messenger.prototype.addSVRequest = function(request) {
	this.addRequest({
		db: true,
		id: request.id,
		// from: {id: request.fbFrom},
		from: {id: request.from},
		// receiver: {id: data.fbReceiver},
		message: request.message,
		data: {
			type: request.type
		}
	});
};

Messenger.prototype.reset = function() {
	// this.requests = [];
	this.requests = {};
	this.nbRequest = 0;
};

Messenger.prototype.addRequest = function(request){

	this.requests[request.id] = request;
	// this.requests.push(request);
	this.nbRequest++;
};

Messenger.prototype.total = function(){
	return this.nbRequest;
};

Messenger.prototype.isEmpty = function(){
	// return !this.total();
	return this.nbRequest;
};

Messenger.prototype.getRequests = function(){
	return this.requests;
};

Messenger.prototype.getRequest = function(i) {
	return this.requests[i] || false;
};

Messenger.prototype.deleteRequest = function(i) {
	// this.requests.splice(this.requests.indexOf(i), 1);
	if(this.requests[i]) {
		var rq = this.requests[i];

		if(!rq.db){
			if(fbManager.getFB()){
				fbManager.getFB().api('/' + i, 'delete');
				// fbManager.getFB().api('/' + rq.id, 'delete');
			}
		} else {
			ATW.App.getDataManager().getApi().call('Notif', 'Delete', {
			  on: i,
			  data: {}
			}, function(res){});
		}
		this.nbRequest--;
		delete this.requests[i];
		// this.requests.splice(i, 1);
	}
};


exports.Messenger = Messenger;

})(window.Model = window.Model ||{});

/**** translate.js ****/
var TRANS = {};

function loadTrad()
{
	TRANS['Plein'] = _2('Plein', 'Plein');
	TRANS['Credits'] = _2('Credits', 'Crédits');
	TRANS['Boutique'] = _2('Boutique');
	TRANS['Ou'] = _2('Ou');
	TRANS['succes'] = _2('succes', 'Succès');
	TRANS['champion'] = _2('champion', 'Champion');
	TRANS['Objectif'] = _2('Objectif', 'Objectif');
	TRANS['Chargement'] = _2('Chargement', 'Chargement');
	TRANS['Amis'] = _2('Amis', 'Amis');
	TRANS['Defi'] = _2('Defi', 'Défi');
	TRANS['maintenance'] = _2('maintenance', 'Maintenance');
	TRANS['vague'] = _2('vague', 'Vague');
	TRANS['populaire'] = _2('populaire', 'Populaire');
	TRANS['promo'] = _2('promo', 'Promo');
	TRANS['inviter'] = _2('inviter', 'Inviter');
	TRANS['accepter'] = _2('accepter', 'Accepter');
	TRANS['envoyer'] = _2('envoyer', 'Envoyer');
	TRANS['notification'] = _2('notification', 'Notification');
	TRANS['recuperer'] = _2('recuperer', 'Recupérer');
	TRANS['progression'] = _2('progression', 'Progression');
	TRANS['felicitation'] = _2('felicitation', 'Félicitations');
	TRANS['gagne'] = _2('gagne', 'Gagné');
	TRANS['perdu'] = _2('perdu', 'Perdu');
	TRANS['debloque'] = _2('debloque', 'Debloque');
	TRANS['obtenue'] = _2('obtenue', 'Obtenue');
	TRANS['highscore'] = _2('highscore', 'Highscore');
	TRANS['page'] = _2('page', 'Page');
	TRANS['defaite'] = _2('defaite', 'Défaite');
	TRANS['partager'] = _2('partager', 'Partager');
	TRANS['victoire'] = _2('victoire', 'Victoire');
	TRANS['temps'] = _2('temps', 'Temps');

	TRANS['aucun_message'] = _2('aucun_message', "Vous n'avez aucun nouveau message");
	TRANS['bonus_non_debloque'] = _2('bonus_non_debloque', "Vous n'avez pas encore débloqué ce bonus");
	TRANS['chargement_des_sons'] = _2('chargement_des_sons', 'Chargement des sons');

	TRANS['ami_battu'] = _2('ami_battu', 'Ami battu');
	TRANS['champion_battu'] = _2('champion_battu', 'Champion battu');
	TRANS['vous_avez_battu_x'] = _2('vous_avez_battu_x', 'Vous avez battu :name !');
	TRANS['vous_etes_champion'] = _2('vous_etes_champion', 'Vous êtes le champion !');
	TRANS['message_succes_termine'] = _2('message_succes_termine', 'Vous avez terminé le succès: :title');

	TRANS['mots_trouves'] = _2('mots_trouves', 'Mots trouvés');
	TRANS['vagues_survecus'] = _2('vagues_survecus', 'Vagues survécus');
	TRANS['meduses_sauvees'] = _2('meduses_sauvees', 'Méduses sauvées');

	TRANS['game_designer'] = _2('game_designer', 'Game Designer');
	TRANS['game_manager'] = _2('game_manager', 'Game Manager');
	TRANS['directeur_artistique'] = _2('directeur_artistique', 'Directeur Artistique');
	TRANS['developpeur'] = _2('developpeur', 'Développeur');
	TRANS['mentions_et_copyright'] = _2('mentions_et_copyright', 'Mentions légales & Copyrights.');

	TRANS['premiere_defaite_explication'] = _2('premiere_defaite_explication', "Quel dommage, tu viens de perdre ! Je vais t'expliquer pourquoi.");

	TRANS['faire_maximum_de_points'] = _2('faire_maximum_de_points', 'Faites un maximum de <span class="highlight">points</span> !');

	TRANS['aucun_mot_possible_explication'] = _2('aucun_mot_possible_explication', "Il n'y a plus de mots possibles. Les dernières méduses sont sauvées, mais ne te rapportent aucuns points.");

	TRANS['tuto_ecrit_joue'] = _2('tuto_ecrit_joue', 'Joue');
	TRANS['tuto_ecrit_deux'] = _2('tuto_ecrit_deux', 'Deux');
	TRANS['tuto_ecrit_points'] = _2('tuto_ecrit_points', 'Points');

	TRANS['niveau_suivant'] = _2('niveau_suivant', 'Niveau suivant');
	TRANS['premiere_etoile'] = _2('premiere_etoile', 'Première étoile');
	TRANS['deuxieme_etoile'] = _2('deuxieme_etoile', 'Deuxième étoile');
	TRANS['troisieme_etoile'] = _2('troisieme_etoile', 'Troisième étoile');

	TRANS['liste_des_mots'] = _2('liste_des_mots', 'Liste des <span>mots</span>');


	TRANS['coeur_journalier']   = _2('coeur_journalier', 'Les coeurs se recharge plus rapidement');
	TRANS['score_journalier']   = _2('score_journalier', 'Points en jeux augmenté de :x%');
	TRANS['temps_journalier']   = _2('temps_journalier', 'Temps en jeux augmenté de :x%');
	TRANS['jackpot_journalier'] = _2('jackpot_journalier', 'Tous les bonus');
	TRANS['perle_journalier'] = _2('perle_journalier', '+:x perles');
	TRANS['plus_bonus'] = _2('plus_bonus', '+:x Bonus :name');

	TRANS['debloquer_dans']                = _2('debloquer_dans', 'Débloquer dans');
	TRANS['terminez_niveau_anterieur']     = _2('terminez_niveau_anterieur', 'Vous devenez terminer le monde précédent');
	TRANS['meilleur_score']                = _2('meilleur_score', 'Meilleur score');
	TRANS['x_pts']                         = _2('x_pts', ':x Pts');
	TRANS['premier_arrive_sur_niveau']     = _2('premier_arrive_sur_niveau', 'Vous êtes le premier de vos amis à être allé aussi loin, bravo !');
	TRANS['manque_amour']                  = _2('manque_amour', "En manque d'amour ?");
	TRANS['obtenez_coeur']                 = _2('obtenez_coeur', 'Obtenez des coeurs !');
	TRANS['demander_coeur_supplementaire'] = _2('demander_coeur_supplementaire', 'Vous pouvez demander des coeurs supplémentaires à vos amis...');
	TRANS['demander_a_vos_amis']           = _2('demander_a_vos_amis', 'Demander à vos amis');
	TRANS['refaire_plein_coeur']           = _2('refaire_plein_coeur', 'Refaite le plein de coeurs avec vos perles');
	TRANS['obtenir_coeur_illimites_n']       = _2('obtenir_coeur_illimites_n', 'Vous pouvez obtenir des coeurs illimitées<br/>pendant :x heures');
	TRANS['obtenir_coeur_illimites_n_canvas']       = _2('obtenir_coeur_illimites_n_canvas', 'Vous pouvez obtenir des coeurs illimitées pendant :x heures');
	TRANS['prochain_coeur_dans']           = _2('prochain_coeur_dans', 'Prochain coeur dans');
	TRANS['aucun_mot_restant']             = _2('aucun_mot_restant', 'Aucun Mot Restant');
	TRANS['grille_vide']                   = _2('grille_vide', 'Grille Vide');


	TRANS['obtenir_x_etoiles'] = _2('obtenir_x_etoiles', 'Obtiens :x étoile');
	TRANS['obtenir_x_points'] = _2('obtenir_x_points', 'Obtiens :x points');
	TRANS['passer_le_niveau'] = _2('passer_le_niveau', 'Passer le niveau');





	TRANS['tuto_aucun_mot'] = _2('tuto_aucun_mot', 'Tu ne peux plus faire de mots, passes à la vague suivante.');
	TRANS['passer_vague_utilite'] = _2('passer_vague_utilite', 'En passant une vague, tu gagnes également des points pour chaque seconde que tu as passée.');
	TRANS['ecrire_maintenant_mot'] = _2('ecrire_maintenant_mot', 'Ecris maintenant le mot :word.');

	// --------------------------------------------------------------
	// Tuto
	// --------------------------------------------------------------

	//- Classique
	TRANS['voici_classique']  = _2('voici_classique', 'Te voici en mode Classique.');
	TRANS['objectifs_classique_explication']  = _2('objectifs_classique_explication', 'Ton objectif est de faire un certain nombre de mots, ici :x. Tous les mots sont acceptés, à l’exception des noms propres et des mots composés.');
	TRANS['objectif_progression']  = _2('objectif_progression', 'Regardes, tu as progressé dans ton objectif. Il ne te reste plus que :x mots à trouver.');
	TRANS['objectif_continue']  = _2('objectif_continue', 'Continue à réaliser tes objectifs !');
	TRANS['objectif_longueur_p1'] = _2('objectif_longueur_p1', "Regarde, des fois, l'objectif est de faire des mots d'une certaine longueur");
	TRANS['objectif_longueur_p2'] = _2('objectif_longueur_p2', "Tu peux quand même faire des mots plus courts, ils continuent de compter pour les points et donc pour tes étoiles");
	TRANS['objectif_longueur_p3'] = _2('objectif_longueur_p3', "Mais rappelle toi aussi que plus tes mots sont longs, plus ils rapportent de points");

	TRANS['nouveau_mode_pendu'] = _2('nouveau_mode_pendu', "Nous voici dans un nouveau mode de jeu: le mode Pendu! Ici, l'objectif est de trouver un mot d'une certaine longueur. Il n'y a pas de vagues, et toutes les méduses nécessaires sont présentes sur la grille. Pour atteindre l'objectif, tu dois écrire des mots de la même longueur que le mot recherché. Ecris maintenant le mot :prompt");



	//- Selection
	TRANS['commence_par_cliquer_sur_lettre']  = _2('commence_par_cliquer_sur_lettre', 'Commence par cliquer sur le :char.');
	TRANS['maintenant_sur_lettre']  = _2('maintenant_sur_lettre', 'Maintenant sur le :char.');
	TRANS['enfin_sur_lettre']  = _2('enfin_sur_lettre', 'Et enfin sur le  :char.');
	TRANS['enfin_sur_lettre_puis_valide']  = _2('enfin_sur_lettre_puis_valide', 'Et enfin sur le  :char, puis valide le mot.');
	TRANS['voila_tu_sais_selectionner']  = _2('voila_tu_sais_selectionner', 'Voilà, tu sais maintenant comment sélectionner des lettres pour former un mot.');
	TRANS['valide_mot_en_cliquant_ici']  = _2('valide_mot_en_cliquant_ici', 'Valide ton mot en cliquant ici.');

	TRANS['vague_explication']  = _2('vague_explication', 'Chaque niveau se joue en un certain nombre de vagues, ici, il t’en reste :x. A chaque vague, les méduses descendent d’une ligne.');
	TRANS['declencher_vague']  = _2('declencher_vague', "S'il te reste des vagues, tu peux les déclencher en cliquant sur le numéro de la vague.");
	TRANS['continue_a_jouer']  = _2('continue_a_jouer', 'Continue à jouer');


	TRANS['ecrire_mot_double'] = _2('ecrire_mot_double', 'Regarde, tu peux écrire le mot DOUBLE! Quand tu écris ce mot, une méduse au hasard se transforme en méduse mot compte double.');
	TRANS['ecrire_mot_cinq']   = _2('ecrire_mot_cinq', 'Regarde, tu peux écrire le mot CINQ! Quand tu écris ce mot, la limite de fantômes est augmentée de :x !');
	TRANS['ecrire_mot_glace']  = _2('ecrire_mot_glace', 'Regarde, tu peux écrire le mot GLACE ! Quand tu écris ce mot, le temps s’arrête pour :x secondes !');
	TRANS['ecrire_mot_stop']   = _2('ecrire_mot_stop', 'Regarde, tu peux écrire le mot STOP ! Quand tu écris ce  mot, le temps s’arrête pour :x secondes !');
	TRANS['ecrire_mot_bouh']   = _2('ecrire_mot_bouh', 'Regarde, tu peux écrire le mot BOUH ! Quand tu écris ce  mot, la limite de fantômes est augmentée de :x !');
	TRANS['ecrire_mot_joker']  = _2('ecrire_mot_joker', 'Regarde, tu peux écrire le mot JOKER ! Quand tu écris ce  mot, une méduse au hasard se transforme en JOKER.');
	TRANS['ecrire_mot_aide']   = _2('ecrire_mot_aide', 'Regarde, tu peux écrire le mot AIDE ! Quand tu écris ce  mot, le bonus d’aide se déclenche. Il est différent dans tous les modes de jeu.');

	TRANS['grille_vide_realiser']     = _2('grille_vide_realiser', 'Tu viens de réaliser une grille vide. Chaque grille vide rapporte :x points, puis la vague suivante tombe immédiatement en te donnant des points pour les secondes passées.');
	TRANS['oh_non_perte_fantome']     = _2('oh_non_perte_fantome', 'Oh non, tu viens de perdre une méduse !');
	TRANS['tu_as_droit_a_x_fantomes'] = _2('tu_as_droit_a_x_fantomes', 'Dans ce niveau, tu as droit à :x fantômes, attention à ne pas les atteindre !');
	TRANS['bravo_gain_points']        = _2('bravo_gain_points', 'Bravo tu viens de gagner :x points !');

	TRANS['maintenance_en_cours']       = _2('maintenance_en_cours', 'Around the words est actuellement en maintenance, veuillez réessayer plus tard');
	TRANS['ton_objectif_est_x_pts']     = _2('ton_objectif_est_x_pts', 'Ici ton seconde objectif est de faire :x points.');
	TRANS['nouveau_mode_sauvetage']     = _2('nouveau_mode_sauvetage', 'Nous voici dans un nouveau mode de jeu: le mode Sauvetage!');
	TRANS['mode_sauvetage_explication'] = _2('mode_sauvetage_explication', "Ici tu joues sur :wave grilles complètes. L'objectif est de sauver :endpoint méduses sur les :wave grilles.");
	TRANS['sauvetage_vague']            = _2('sauvetage_vague', "Tu peux passer à la grille suivante en appuyant sur le détonateur. Mais attention dans ce mode de jeu toute la grille tombe quand tu déclenches le détonateur. Et cela peut occasionner une grosse perte de méduses.");
	TRANS['nouveau_mode_survie']        = _2('nouveau_mode_survie', "Nous voici dans un nouveau mode de jeu: le mode Survie! Ici l'objectif n'est pas de faire un certain nombre de mots, mais de réussir à survivre à un certain nombre de vagues.");
	TRANS['nouveau_trou']               = _2('nouveau_trou', "Qui a creusé un trou ici ? Tes méduses vont tomber dedans !");
	TRANS['nouveau_mur']                = _2('nouveau_mur', 'Ah, un mur! Les murs bloquent les méduses.');
	TRANS['nouvelle_bombe']             = _2('nouvelle_bombe', "Oh non, une bombe! Attention, si tu utilises la méduse qui l'a mangée, elle explosera!");
	TRANS['nouvelle_meduse_bloque']     = _2('nouvelle_meduse_bloque', "Pauvre méduse, elle est piégée ici et ne bougera pas! Utilise-la pour la libérer !");
	TRANS['nouvelle_perle']             = _2('nouvelle_perle', "Oh, une perle! Si tu veux la gagner, utilise la méduse qui l'a mangée!");


	TRANS['demande_coeur']        = _2('demande_coeur', ':user vous demande un coeur');
	TRANS['demande_coeur_retour'] = _2('demande_coeur_retour', ":user t'as envoyé un coeur !");

	TRANS['demande_monde']        = _2('demande_monde', ':user a besoin de ton aide pour accéder au monde :world');
	TRANS['demande_monde_retour'] = _2('demande_monde_retour', ':user vous a aidé pour accéder au monde :world');

	TRANS['devenir_champion']     = _2('devenir_champion', ':me vient de devenir le champion de :world, viens te mesurer à lui.');
	TRANS['depasser_amis']        = _2('depasser_amis', 'Je viens de dépasser :opp au niveau :level du :world !');

	TRANS['score_partage']        = _2('score_partage', "J'ai fait :x au niveau :level du monde :world !");

	TRANS['bonus_joker_ecrit']  = _2('bonus_joker_ecrit', 'joker');
	TRANS['bonus_joker_ecrit'] = TRANS['bonus_joker_ecrit'].toLowerCase();

	TRANS['bonus_glace_ecrit']  = _2('bonus_glace_ecrit', 'glace');
	TRANS['bonus_glace_ecrit']  = TRANS['bonus_glace_ecrit'].toLowerCase();

	TRANS['bonus_aide_ecrit']   = _2('bonus_aide_ecrit', 'aide');
	TRANS['bonus_aide_ecrit']   = TRANS['bonus_aide_ecrit'].toLowerCase();

	TRANS['bonus_vie_ecrit']    = _2('bonus_vie_ecrit', 'cinq');
	TRANS['bonus_vie_ecrit'] = TRANS['bonus_vie_ecrit'].toLowerCase();

	TRANS['bonus_double_ecrit'] = _2('bonus_double_ecrit', 'double');
	TRANS['bonus_double_ecrit'] = TRANS['bonus_double_ecrit'].toLowerCase();

	TRANS['tuto_pendu_a_decouvrir'] = _2('tuto_pendu_a_decouvrir', 'lait').toUpperCase();
	TRANS['tuto_pendu_a_tester'] = _2('tuto_pendu_a_tester', 'pipe').toUpperCase();

	TRANS['tuto_pendu_progress'] = _2('tuto_pendu_progress', 'La lettre :letter est bien dans le mot');
	TRANS['tuto_pendu_error'] = _2('tuto_pendu_error', "La lettre :letter n'est pas dans le mot");
	TRANS['tuto_pendu_error_again'] = _2('tuto_pendu_error_again', "La lettre :letter n'est pas dans le mot mais vous ne perdez aucune vie");


	Game.Grid.BonusToTuto = {};
	Game.Grid.TutoToBonus = {};
	Game.Grid.BonusWord = {};

	Game.Grid.BonusWord[TRANS['bonus_joker_ecrit']] = [Game.Grid.BONUS_JOKER];
	Game.Grid.BonusToTuto[TRANS['bonus_joker_ecrit']] = 'joker';
	Game.Grid.TutoToBonus['joker'] = TRANS['bonus_joker_ecrit'];

	Game.Grid.BonusWord[TRANS['bonus_glace_ecrit']] = [Game.Grid.BONUS_FREEZE];
	Game.Grid.BonusToTuto[TRANS['bonus_glace_ecrit']] = 'glace';
	Game.Grid.TutoToBonus['glace'] = TRANS['bonus_glace_ecrit'];

	Game.Grid.BonusWord[TRANS['bonus_aide_ecrit']] = [Game.Grid.BONUS_BONUS];
	Game.Grid.BonusToTuto[TRANS['bonus_aide_ecrit']] = 'aide';
	Game.Grid.TutoToBonus['aide'] = TRANS['bonus_aide_ecrit'];

	Game.Grid.BonusWord[TRANS['bonus_vie_ecrit']] = [Game.Grid.BONUS_LIFE];
	Game.Grid.BonusToTuto[TRANS['bonus_vie_ecrit']] = 'cinq';
	Game.Grid.TutoToBonus['cinq'] = TRANS['bonus_vie_ecrit'];

	Game.Grid.BonusWord[TRANS['bonus_double_ecrit']] = [Game.Grid.BONUS_LIFE];
	Game.Grid.BonusToTuto[TRANS['bonus_double_ecrit']] = 'double';
	Game.Grid.TutoToBonus['double'] = TRANS['bonus_double_ecrit'];



	ATW.CAPTION = 'Around the Words';
	ATW.DESCRIPTION = _2('publication_description', "Viens mettre ton cerveau à l’épreuve dans ce jeu de lettre autour du monde ! Seras-tu le premier à explorer la planète ?!");
};



function _ts(key, o)
{
	if(typeof TRANS[key] == "undefined") {
		return key;
	}

	var s = TRANS[key];

	if(o) s = Util.String2.strtr(s, o);

	return s;

};


/**** App.js ****/
(function(exports){
exports.App = {
	player: null,
	// dataManager: new Api.DataManager(false),
	dataManager: new Api.DataManager(typeof dt != "undefined"),
	notifQueue: [],


	initPlayer: function(data)
	{
		var self = this;
		var user = new Model.User(data);

		var updateLifeCtx = function()
		{
			if(!Scene.BaseScene.current) return;
			var scene = Scene.BaseScene.current
				, timeLeft = scene.view.getElementById('timeLeft')
				, headerLifeText = scene.view.getElementById('headerLifeText')
				, moreHeart = scene.view.getElementById('moreHeart');

			if(!timeLeft) return;

			Util.DisplayText.updateShadowText(headerLifeText, user.life.toString());

			if(user.isFullLife())
			{
				timeLeft.setText(_ts('Plein'));
				moreHeart.visible = false;
			} else {
				moreHeart.visible = true;
			}
		}

		user.onMyUpdate = function(){
			if(self.timerLife)
			{
				self.timerLife.kill();
				self.timerLife = null;
			}


			var scene = Scene.BaseScene.current;
			var refreshHeart = function(){
				var heartContainer = scene.view.getElementById('heartContainer')
					, headerContainer = scene.view.getElementById('headerContainer');

				if(headerContainer && heartContainer && heartContainer.normalSessionIn != user.normalSessionIn) {
					var oldPosition = heartContainer.position;
					headerContainer.removeChild(heartContainer);
					heartContainer = Partial.heart_bar_partial(scene.view);
					heartContainer.position = oldPosition;
					headerContainer.addChild(heartContainer);

				}
			}

			if(scene) refreshHeart();

			if(user.lifeRegenAt || user.normalSessionAt)
			{
				var isSession = user.normalSessionIn;
				self.timerLife = new Util.TimerSec({
					secondes: (isSession) ? user.normalSessionIn : user.lifeRegenIn,

					onMyEnd: function(){
						if(isSession)
						{
							ATW.App.getDataManager().getApi().call('User', 'POST', {
								on: 'me',
								data: {
									immunity: 0
								}
							}, function(res){
								// $('.cLifeBar').removeClass('golden');
								refreshHeart();
								user.myUpdate(res);
							});

						}
						else
						{

							user.life++;

							ATW.App.getDataManager().getApi().call('User', 'POST', {
								on: 'me',
								data: {
									life: user.life,
									lifeRegenAt: 0
								}
							}, function(res){
								user.myUpdate(res);
							});
						}
					},

					onMyUpdate: function(t){
						if(!Scene.BaseScene.current) return;

						var scene = Scene.BaseScene.current;
						if(!scene.view) return;

						var timeLeft = scene.view.getElementById('timeLeft');

						if(!timeLeft) return;

						var o = t.getCurrent()
							, s = '';

						if(o.hour) s += o.hour + ':';
						s += o.min + ':' + o.sec;

						timeLeft.setText(s);



					}
				});

				self.timerLife.myGo();
			}

			updateLifeCtx();
		}

		user.onMyUpdate();



		user.getAchievementManager().onComplete = function(achievement)
		{
			self.addNotification(null, achievement.getDescription());
			self.refreshAwardNotif();

			ATW.App.getDataManager().getApi().call('Notif', 'POST', {
				on: user.fbId,
				data: {
					message: 'ach:' + achievement.getNameId(),
					type: 'MESSAGE'
				}
			}, function(res){
				if(!res.request) return;

				user.getMessenger()
					.addSVRequest(res.request);

				ATW.App.refreshMessenger();
			});

		}

		this.setPlayer(user);
	},

	refreshPearl: function()
	{
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;


		var pearlText = view.getElementById('headerPearlText')
		if(!pearlText) return;
		pearlText.setText(ATW.App.getPlayer().getPearls().toString());
		pearlText.updateText();
		pearlText.position.x = pearlText.rightOri - pearlText.width;
	},

	instaShop: function(price, toBuy, onAllow, onRes, discountId, onDisallow)
	{

		if(this.player.getPearls() >= price)
		{
			var addPearl = (toBuy && toBuy.u && toBuy.u.pearls) ? toBuy.u.pearls : 0;
			this.player.incrPearls(addPearl-price);

			var o = Util.Object.merge({
				u: {
					pearls: this.player.getPearls()
				}
			}, toBuy);

			this.player.myUpdate(o);

			this.dataManager.getApi().call('Shop', 'POST', {
				on: 'me',
				data: o
			}, onRes);

			if(Scene.BaseScene.current) {
				Scene.BaseScene.current.updatePearlText();
			}

			if(onAllow) onAllow();
		}
		else
		{
			if(onDisallow) onDisallow();
			if(Util.Popup.current) Util.Popup.current.close();

			// alert('!! ~~ [Insert Popup Store Here] ~~ !! Please be kind °_°');
			// var s = new ShopPopup(ConfigShopCat.findByKey('PEARL').id);
			var s = new UI.PopupShop(Util.ShopCat.findByKey('PEARL'));
			s.open();
		}
	},


	refreshAwardNotif: function(){
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;


		var containerNumber = view.getElementById('nbAchievementContainer')
		if(!containerNumber) return;

		var nbGiftLeft = ATW.App.getPlayer().getAchievementManager().getNbGiftLeft();
		containerNumber.updateNb(nbGiftLeft);
	},


	refreshMessenger: function()
	{
		console.log('App::refreshMessenger');
		if(!Scene.BaseScene.current || !Scene.BaseScene.current.view) return;
		var view = Scene.BaseScene.current.view;

		var containerNumber = view.getElementById('nbNotifContainer')
		if(!containerNumber) return;

		var nb = ATW.App.getPlayer().getMessenger().total();
		containerNumber.updateNb(nb);

	},


	addNotification: function(img, txt){
		var self = this;
		this.notifQueue.push(function(){

			var notif = new PIXI.DisplayObjectContainer();
			var bg = new PIXI.Graphics();
			bg.beginFill(0x000000, 0.7)
				.drawRoundedRect(0, 0, 500, 45, 10)
				.endFill();

			var cup = PIXI.Sprite.fromFrame('gold_cup');
			cup.scale.x = cup.scale.y = 0.45;
			cup.position.x = 10;
			cup.position.y = 9;

			var textBmp = new PIXI.BitmapText(txt, {font: '22px FredokaOne-Regular'});
			textBmp = Util.DisplayText.shadow(textBmp, 3, 1, 0xff9c0e, 0.8);
			textBmp.position.x = cup.width + cup.position.x + 18;
			textBmp.position.y = bg.height/2 - textBmp.height/2 - 2;

			var chk = PIXI.Sprite.fromFrame('ig_chk_valid');
			chk.position.x = bg.width - chk.width - 15;
			chk.position.y = 10;

			notif.addChild(bg);
			notif.addChild(cup);
			notif.addChild(textBmp);
			notif.addChild(chk);

			notif.interactive = true;
			notif.touchstart = notif.mousedown = function(){
				if(notif.done) return;
				notif.done = true;
				if(self.tlNotif)
				{
					self.tlNotif.clear();
					self.tlNotif = null;
				}

				TweenLite.to(notif, 0.3, {alpha: 0, onComplete: function(){
					ATW.stage.removeChild(notif);
					self._launchNotification();
				}})
			};

			notif.position.x = ATW.gameMidWidth() - notif.width/2;
			notif.position.y = 40;

			notif.alpha = 0;
			notif.scale.x = notif.scale.y = 0;

			ATW.stage.addChild(notif);

			self.tlNotif = new TimelineMax();
			self.tlNotif.to(notif, 0.15, {alpha:1}, 'start');
			self.tlNotif.to(notif.scale, 0.15, {x:1, y:1}, 'start');
			self.tlNotif.to(notif, 0.4, {alpha:0}, '+=1.7');
			self.tlNotif.call(function(){
				if(notif.done) return;

				notif.done = true;
				self.tlNotif = null;
				ATW.stage.removeChild(notif);
				self._launchNotification();
			});

			Util.Sound.fxPlay('fx/achievement');

		});

		if(this.notifQueue.length == 1 && !self.tlNotif) this._launchNotification();

	},


	_launchNotification: function()
	{
		if(!this.notifQueue.length) return;

		var f = this.notifQueue.pop();
		f();

	},

	setPlayer: function(player) { this.player = player; },
	getDataManager: function() { return this.dataManager; },
	getPlayer: function() { return this.player; },
	hasPlayer: function() { return this.getPlayer(); }
};



})(window.ATW = window.ATW || {});

/**** config.js ****/
'use strict';

(function(namespace){

var app = {
	width: 768,
	height: 1024
};

namespace.config = {
	app: app,
	game: {
		width: app.width,
		height: app.height,

		END_CHECK_LARGERWORD_ON_NBDEATH: 8,
		HOLE_SHIFT_TOP_BY: 30
	},

	ratio: 1,

	scene: {
		// fadeIn: 1.2,
		fadeIn: 0.7,
		fadeOut: 0.2
	},

	splashs: {
		images: ["resources/splash-f4f.jpg", "resources/splash-3dduo.jpg"],
		displayFor: 1400
	},


	loading: {
		minDisplay: 1,
		globeSpeed: 15

	},

	test: {
		desactiveDico: false,
		desactiveSplash: true,
		desactiveHome: true
	},

	wrapper: {
		width: 1024
	},

	avatars: {
		mexico: {
			body: [{
				type: 'face',
				key: 'face_mexico_mustache'
			}, {
				type: 'hat',
				key: 'hat_mexico_sombrero'
			}],
			skin: 'body_blue_to_pink'
		},

		france: {		// ok
			body: [{
				type: 'face',
				key: 'face_france_parisian'
			}, {
				type: 'hat',
				key: 'hat_france_beret'
			}],
			skin: 'body_blue_to_pink'
		},

		japan: {
			body: [{
				type: 'face',
				key: 'face_japan_ninja'
			}, {
				type: 'hat',
				key: 'hat_japan_headband'
			}],
			skin: 'body_blue_to_pink'
		},

		usa: {		// ok
			body: [{
				type: 'face',
				key: 'face_usa_belt'
			}, {
				type: 'hat',
				key: 'hat_usa_texas'
			}],
			skin: 'body_blue_to_pink'
		},

		tanzania: {
			body: [{
				type: 'face',
				key: 'face_tanzania_horn'
			}, {
				type: 'hat',
				key: 'hat_tanzania_ears'
			}],
			skin: 'skin_grey_animal'
		}

	}
};



namespace.gameMidWidth = function(){
	return ~~(this.gameWidth()/2);
};

namespace.gameMidHeight = function(){
	return ~~(this.gameHeight()/2);
};

namespace.gameWidth = function(){
	return namespace.config.game.width;
};

namespace.gameDim = function(){
	return namespace.config.game;
};

namespace.setGameWidth = function(width) {
	namespace.config.game.width = width;
};

namespace.gameHeight = function(){
	return namespace.config.game.height;
};

namespace.setGameHeight = function(height) {
	namespace.config.game.height = height;
};

namespace.isMobile = function(){
	return (namespace.config.game.width < 750);
};

})(window.ATW = window.ATW || {});


/**** Main.js ****/
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


