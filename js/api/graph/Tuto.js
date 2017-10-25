'use strict';

(function(exports){

var Tuto = {};

Tuto.get = function(params){};
Tuto.post = function(params){
	var data = params.data
		, tutoKey = data.key
		, cTutos = ATW.Datas.TUTOS
		, tuto = cTutos[tutoKey];


	if(!tuto
		&& tutoKey != 'level1'
		&& tutoKey != 'level2'
		&& tutoKey != 'level3'
		&& tutoKey != 'level4'
		&& tutoKey != 'first_defeat'
		&& tutoKey != 'board_no_possibility'
		&& tutoKey != 'board_pearl'
		&& tutoKey != 'board_spawn_locked'
	) {
		return {success: false};
	}


	var myTutos = this.getFormatList();
	if(myTutos[tutoKey]) return {success: false};

	myTutos[tutoKey] = {done: 1};
	Api.Storage.setItem('tuto', myTutos);

	return {success: true};

}
Tuto.delete = function(){};
Tuto.getFormatList = function(){ return Api.Storage.getItem('tuto') || {}; };

exports.Tuto = Tuto;

})(window.Api = window.Api || {});

