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