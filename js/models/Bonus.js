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
