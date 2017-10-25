'use strict';

(function(exports){

var User = {};

User.get = function(params){

	var response = {};
	switch(params.on) {
		case 'me':
			var install = false;
			var player = Api.Storage.getItem('user');
            var update = {};

			if(!player) {
				player = {life:5, sound: true};
                update.life = player.life;
				install = true;
			}


			player.worlds = Api.World.getFormatList();

			var scores = Api.Score.getFormatList();
			for(var worldId in scores) {
				var score = scores[worldId];
				for(var key in score) {
					if(!player.worlds[worldId]) player.worlds[worldId] = {};
					player.worlds[worldId][key] = scores[worldId][key];
				}

			}


			player.bonusMap = Api.Bonus.getFormatList();
			player.tutos = Api.Tuto.getFormatList();
			player.achievements = Api.Achievement.getFormatList();
			player.notifs = Api.Notif.getFormatList();


			var now = Date.now()
				, midnightTime = Util.Date.getMidnight()
				, lastDayConn  = (typeof player['lastDayConn'] != "undefined") ? parseInt(player['lastDayConn'], 10) : 0;;


			var msDay = 86400000;
			if((midnightTime - lastDayConn) >= msDay) {
				if(!install){
					update['waitingDailyGift'] = player['waitingDailyGift'] = true;
				}

				update['lastDayConn']  = 	 midnightTime;
				update['heartAccelerator'] = player['heartAccelerator'] = false;
				update['scoreAccelerator'] = player['scoreAccelerator'] = false;
				update['timeBooster']      = player['timeBooster'] = false;
			}

			player['timeAccelLeft'] = null;
			if(player['heartAccelerator']
				|| player['scoreAccelerator']
				|| player['timeBooster']
			) {
				player['timeAccelLeft'] = (midnightTime + msDay) - now;
			}

			// var regenLife = (int) Config::_get('configs', 'GEN_REGEN_LIFE_SEC');
			var regenLife = parseInt(ATW.Datas.CONFIGS.GEN_REGEN_LIFE_SEC, 10);
			var regenAt = parseInt(player['lifeRegenAt'], 10);

			var nbLifeWon = 0;
			if(player['waitingLife'])
			{
				nbLifeWon += player['waitingLife'];
				update['waitingLife'] = 0;
			}


			if(regenAt || nbLifeWon)
			{
				if(regenAt)
				{
					var diff = (Date.now()/1000) - regenAt;
					nbLifeWon = Math.min(Math.floor(diff/regenLife), 5);
				}

				if(nbLifeWon > 0)
				{
					console.log('nbLifeWon', nbLifeWon);
					// update = array_merge($update, User::addLife($nbLifeWon, $userData));
					var addLifeUpdate = User.addLife(nbLifeWon, player);
					for(var i in addLifeUpdate) update[i] = addLifeUpdate[i];
				}
			}


			User._handleUpdate(update);

			delete player['lastDayConn'];
			delete player['waitingLife'];

			this._regenIN(player);
			this._normalSessionIN(player);

			response.me = player;
			break;
		default:
			throw new Error('User::get ' + params.on + ' need to be implemented');

	}

	return response;

};


User.post = function(params){
	var data = params.data;
	return this._handleUpdate( data );
};

User.delete = function(){
	Api.Storage.setItem('user', {});
	Api.Score.delete();
};

User._handleUpdate = function(data, dontSave) {
	var save = (dontSave) ? false : true
		, player = ATW.App.getPlayer() || Api.Storage.getItem('user') || {}
		, response = {}
		, resUser = {}
		, configs = ATW.Datas.CONFIGS;

	if(data.bonusMap){
		Api.Bonus._handleUpdate(data);

		data.bonusMap = null;
		delete data.bonusMap;
	}

	if(typeof data.life != "undefined"){
		var newLife = parseInt(data['life'], 10)
			, maxLife = parseInt(configs.GEN_MAX_LIFE, 10);
		if(
			(!player['lifeRegenAt'] || data['lifeRegenAt'])
			&& newLife < maxLife
		) {
			var addSec = parseInt(configs.GEN_REGEN_LIFE_SEC, 10); // 2 minutes
			if(player['heartAccelerator']) addSec = Math.ceil(addSec/2);


			resUser['lifeRegenAt'] = data['lifeRegenAt'] = ~~(Date.now()/1000) + addSec;
			this._regenIN(resUser);
		}
		else if(newLife == maxLife)
		{
			resUser['lifeRegenAt'] = data['lifeRegenAt'] = 0;
			this._regenIN(resUser);
		}
		else
		{
			resUser['lifeRegenAt'] = player['lifeRegenAt'];
			this._regenIN(resUser);
		}

	}


	if(typeof data.immunity != "undefined")
	{

		var immunity = parseInt(data['immunity'], 10);
		delete data.immunity;

		if(immunity)
		{
			var addSec = parseInt(configs['GEN_GAME_INFINITE_SESSION_SEC'], 10);
			resUser['normalSessionAt'] = data['normalSessionAt'] = ~~(Date.now()/1000) + addSec;

			if(player['lifeRegenAt'])
			{
				var x = {
					lifeRegenAt: player['lifeRegenAt']
				};
				var remainingTime = this._regenIN(x);
				remainingTime = remainingTime['lifeRegenIn'];
				resUser['lifeRegenAt'] = data['lifeRegenAt'] = resUser['normalSessionAt'] + remainingTime;

				this._regenIN(resUser);
			}

		}
		else // Enleve l'immunite
		{
			if(player['lifeRegenAt'])
			{
				resUser['lifeRegenAt'] = player['lifeRegenAt'];
				this._regenIN(resUser);
			}

			resUser['normalSessionAt'] = data['normalSessionAt'] = 0;

		}

		this._normalSessionIN(resUser);

	}

	if(data['heartAccelerator']
		|| data['scoreAccelerator']
		|| data['timeBooster']
	) {
		var d = new Date();
		d.setHours(0,0,0,0);
		var midnightTime = d.getTime()/1000;

		resUser['timeAccelLeft'] = (midnightTime + 86400) - ~~(Date.now()/1000);
		resUser['timeAccelLeft'] *= 1000;

	}


	var storeData = Api.Storage.getItem('user') || {};
	for(var key in data) storeData[key] = player[key] = data[key];

	console.log('User::_handleUpdate save', storeData);

	if(save) Api.Storage.setItem('user', storeData);

	response.u = resUser;
	return response;

};

User._normalSessionIN = function(o) {
	var normalSessionAt = (o['normalSessionAt']) ? parseInt(o['normalSessionAt'], 10) : 0;

	if(normalSessionAt) o['normalSessionIn'] = normalSessionAt - ~~(Date.now()/1000);
	else o['normalSessionIn'] = 0;

};

User._regenIN = function(o) {
	if(!o['lifeRegenAt']) o['lifeRegenAt'] = 0;

	var regenAt = parseInt(o['lifeRegenAt'], 10);
	if(regenAt) o['lifeRegenIn'] = regenAt - ~~(Date.now()/1000);
	else o['lifeRegenIn'] = 0;

	return o;
};

User.addLife = function(nbLife, player){
	var update = {};
	// $maxLife = (int) Config::_get('configs', 'GEN_MAX_LIFE');
	var maxLife = ATW.Datas.CONFIGS.GEN_MAX_LIFE,
		myLife = player['life'] || 0
    	, newLife = Math.min(maxLife, player['life'] + nbLife);

    update['life'] = player['life'] = newLife;
    if(newLife == maxLife)
    {
        update['lifeRegenAt'] = player['lifeRegenAt'] = 0;
    }
    else
    {
        // $addSec = (int) Config::_get('configs', 'GEN_REGEN_LIFE_SEC');
        var addSec = ATW.Datas.CONFIGS.GEN_REGEN_LIFE_SEC;
        if(player['heartAccelerator'])
        {
            addSec = Math.ceil(addSec/2);
        }
        update['lifeRegenAt'] = player['lifeRegenAt'] = Date.now() + addSec;
    }

    return update;


};

exports.User = User;

})(window.Api = window.Api || {});

