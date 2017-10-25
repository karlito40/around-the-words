(function(exports){

function PopupLeaderboard(level){
	Util.Popup.call(this);
	this.level = level;
};


PopupLeaderboard.constructor = PopupLeaderboard;
PopupLeaderboard.prototype = Object.create(Util.Popup.prototype);

PopupLeaderboard.prototype.create = function()
{
	var leaderboard = new UI.Leaderboard(this.level);
	leaderboard.create();

	leaderboard.position.x = ATW.gameMidWidth() - leaderboard.width/2;
	// leaderboard.position.y = ATW.gameMidHeight() - leaderboard.height/2;
	leaderboard.position.y = 100;

	this.addChild(leaderboard);

	this.filter.interactive = true;
	this.filter.mousedown = this.filter.touchstart = this.close.bind(this);


};

exports.PopupLeaderboard = PopupLeaderboard;

})(window.UI = window.UI || {});