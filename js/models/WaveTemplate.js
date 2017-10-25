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