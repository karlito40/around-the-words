(function(exports){

exports.LeaderboardHelper = {

	inLoadingFriend: {},
	inLoadingWorld: {},
	leaderboardWorld: {},
	leaderboardFriend: {},

	reset: function()
	{
		this.inLoadingFriend = {};
		this.inLoadingWorld = {};
		this.leaderboardFriend = {};
		this.leaderboardWorld = {};

	},

	removeWorld: function(worldId, levelId)
	{
		if(this.leaderboardWorld[worldId]
			&& this.leaderboardWorld[worldId][levelId]
		) {
			delete this.leaderboardWorld[worldId][levelId];
		}
	},

	removeFriend: function(worldId, levelId)
	{
		if(this.leaderboardFriend[worldId]
			&& this.leaderboardFriend[worldId][levelId]
		) {
			delete this.leaderboardFriend[worldId][levelId];
		}
	},

	loadWorld: function(worldId, levelId, cb) {
		if(this.leaderboardWorld[worldId]
			&& this.leaderboardWorld[worldId][levelId]
		) {
			cb(this.leaderboardWorld[worldId][levelId]);
			return;
		}

		if(this.inLoadingWorld[worldId] && this.inLoadingWorld[worldId][levelId]) return;
		if(!this.inLoadingWorld[worldId]) this.inLoadingWorld[worldId] = {};
		if(!this.inLoadingWorld[worldId][levelId]) this.inLoadingWorld[worldId][levelId] = true;

		var self = this;
		// App.getDataManager().getApi().call('User', 'GET', {
		ATW.App.getDataManager().getOnlineApi().call('Score', 'GET', {
				on: 'ranking',
				data: {
					worldId: worldId,
					levelId: levelId,
					lang: I18N.Manager.lang
				}
			}, function(response){
				self.inLoadingWorld[worldId][levelId] = false;
				if(response.ranking)
				{
					if(!self.leaderboardWorld[worldId]) self.leaderboardWorld[worldId] = {};
					self.leaderboardWorld[worldId][levelId] = response;
				}

				cb(response);

			}
		);

	},



	loadFriend: function(worldId, levelId, cb){
		if(!ATW.App.getPlayer().fbId) return cb({ranking: {}});

		if(this.leaderboardFriend[worldId]
			&& this.leaderboardFriend[worldId][levelId]
		) {
			cb(this.leaderboardFriend[worldId][levelId]);
			return;
		}

		if(this.inLoadingFriend[worldId] && this.inLoadingFriend[worldId][levelId]) return;
		if(!this.inLoadingFriend[worldId]) this.inLoadingFriend[worldId] = {};
		if(!this.inLoadingFriend[worldId][levelId]) this.inLoadingFriend[worldId][levelId] = true;

		var player = ATW.App.getPlayer();
		var self = this;
		// App.getDataManager().getApi().call('User', 'GET', {
		ATW.App.getDataManager().getOnlineApi().call('Score', 'GET', {
				on: 'me/ranking',
				data: {
					worldId: worldId,
					levelId: levelId
				}
			}, function(response){
				self.inLoadingFriend[worldId][levelId] = false;
				if(response.ranking)
				{
					if(!self.leaderboardFriend[worldId])
					{
						self.leaderboardFriend[worldId] = {};
					}
					self.leaderboardFriend[worldId][levelId] = response;
				}

				var ulevel = player.getWorld(ATW.Datas.WORLDS[worldId]).getLevel(ATW.Datas.LEVELS[levelId]);
				if(ulevel.getStar() >= 3)
				{
					var opponent = {};
					if(response.ranking && response.ranking.above_me)
					{
						opponent.fbId = response.ranking.above_me.fbId;
						opponent.firstName = response.ranking.above_me.firstName;

						// $loadObjFriend.html('<img src="https://graph.facebook.com/'+oppponent.fbId+'/picture" alt="" class="pic">');
						var objScore = parseInt(response.ranking.above_me.score, 10);
					}
					else
					{

						opponent.fbId = ATW.App.getPlayer().fbId;
						opponent.firstName = ATW.App.getPlayer().getFirstName();
						var objScore = ulevel.getScore();
					}

					opponent.score = objScore;
					objScore += 5;

					opponent.objScore = objScore;
					ulevel.setOpponent(opponent);

				}


				cb(response);

			}
		);

	}



};

})(window.Util = window.Util || {});