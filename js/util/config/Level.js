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