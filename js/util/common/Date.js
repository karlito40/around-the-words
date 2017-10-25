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