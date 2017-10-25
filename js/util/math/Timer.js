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