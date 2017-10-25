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
