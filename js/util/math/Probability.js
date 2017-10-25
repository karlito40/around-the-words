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