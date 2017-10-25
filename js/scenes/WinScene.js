'use strict';
(function(exports){

function WinScene(game)
{
	exports.EndScene.call(this, game, 'WinScene', 'win_scene');
};

WinScene.constructor = WinScene;
WinScene.prototype = Object.create(exports.EndScene.prototype);

WinScene.prototype.logic = function() {

	var level = this.game.getLevel(),
		world = level.getWorld(),
		passLevelFriendPop = null,
		passWorldFriendPop = null,
		hasTuto = level.hasTuto(),
		player = ATW.App.getPlayer(),
		self = this;

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


	this.anim();



/*	Util.LeaderboardHelper.loadFriend(world.getId(), level.getId(), function(response){
		if(!response.ranking.above_me) return;

		var aboveMe = response.ranking.above_me;
		, gameScore = self.game.getScore();
		, leaderboard = response.ranking.leaderboard;

		var oppBeat = null;

		outer_loop:
		for(var i in leaderboard)
		{
			for(var j in leaderboard[i])
			{
				var currentOpp = leaderboard[i][j];
				if(currentOpp.fbId == player.fbId) break outer_loop;

				// if(currentOpp.score < gameScore && currentOpp.score > opp.score)
				if(gameScore > currentOpp.score)
				{
					oppBeat = currentOpp;
			 		break outer_loop;
				}
			}

		}
		if(!oppBeat) return;

		passLevelFriendPop = new Popup.PassFriend(self.game.getScore(), oppBeat, self.game);
		passLevelFriendPop.open();

		if(typeof FB != "undefined")
		{
			FB.api('/me/'+FB_NAMESPACE+':score', 'post', {
				level : OPEN_GRAPH + '&type=level&method=score&score='+self.game.getScore()+'&levelid='+level.getId()+'&v='+APP_VERSION+ '&myLocale='+player.getLocale()
			}, function(responseAPI) {
			    console.log('og score level', responseAPI);
			});
		}

		level.setOpponent(null);


	});


	if(!this.game.worldComplete && world.isComplete() && typeof FB != "undefined")
	{
		FB.api('/me/'+FB_NAMESPACE+':complete', 'post', {
			world : OPEN_GRAPH + '&type=world&method=complete&worldid='+world.getId()+'&v='+APP_VERSION+ '&myLocale='+ATW.App.getPlayer().getLocale()
		}, function(responseAPI) {
		    console.log('og beat world', responseAPI);
		});
	}

	var player = ATW.App.getPlayer();
	var worldScore = world.getScore();
	if(world.getOpponent()
		&& world.getOpponent().fbId != player.fbId
		&& world.getOpponent().score <= worldScore)
	{

		// passWorldFriendPop = new PassFriendPopup(this.game.getScore(), world.getOpponent(), world.getId());
		passWorldFriendPop = new Popup.PassFriend(worldScore, world.getOpponent(), self.game, true);
		if(!passLevelFriendPop)
		{
			passWorldFriendPop.open();
		}
		else
		{
			passLevelFriendPop.onClose = function(){
				passWorldFriendPop.open();
			};
		}

		if(typeof FB != "undefined")
		{
			FB.api('/me/'+FB_NAMESPACE+':master', 'post', {
				world : OPEN_GRAPH + '&type=world&method=master&worldid='+world.getId()+'&v='+APP_VERSION+ '&myLocale='+ATW.App.getPlayer().getLocale()
			}, function(responseAPI) {
			    console.log('og master world', responseAPI);
			});
		}

		world.setOpponent(null);
	}

*/

	exports.EndScene.prototype.logic.call(this);


};


WinScene.prototype.anim = function()
{
	var starContainer = this.view.getElementById('starContainer'),
	 	groupLevelName = this.view.getElementById('groupLevelName'),
	 	scoreBmp = this.view.getElementById('scoreBmp'),
	 	tipsBmp = this.view.getElementById('tipsBmp'),
	 	highscoreBmp = this.view.getElementById('highscoreBmp'),
	 	lineObj1 = this.view.getElementById('lineObj1'),
	 	lineObjStar = this.view.getElementById('lineObjStar')
	;


	var tl = new TimelineMax({delay: 0.5});
	var cStar = 1;

	var stagTo = [];
	for(var i = 0; i<starContainer.children.length; i++) {
		var star = starContainer.children[i];
		stagTo.push(star);
	}

	stagTo.push(groupLevelName);
	stagTo.push(scoreBmp);
	stagTo.push(tipsBmp);
	stagTo.push(highscoreBmp);
	stagTo.push(lineObj1);
	stagTo.push(lineObjStar);

	tl.staggerTo(stagTo, 1, {
		// x: 1,
		// y:1,
		alpha: 1,
		// ease: Elastic.easeOut,
		onStart: function(){
			Util.Sound.fxPlay('fx/etoile_' + cStar);
			cStar++;
		}
	}, 0.3);

	// tl.to(groupLevelName, 0.3, {alpha: 1}, -1)


}



exports.WinScene = WinScene;

})(window.Scene = window.Scene || {});



