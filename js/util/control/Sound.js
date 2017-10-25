'use strict';

(function(exports){

var Sound = exports.Sound = {
	playingList: {}
};

Sound.fxPlay = function(name){
	if(!ATW.App.getPlayer().sound) return false;

	var exportCDN = Util.Url.getPlatformCDN();

	var s01 = new Audio();
    s01.src = exportCDN.baseUri + "resources/sound/"+name+".ogg";

	var aud = new SoundManager.Audio().setAudio(s01);
	aud.play();
};

Sound.play = function(name){

    if(!ATW.App.getPlayer().sound) return false;
	var exportCDN = Util.Url.getPlatformCDN();

	if(this.playingList[name]) return;

	var music = new Audio();
    music.src = exportCDN.baseUri + "resources/sound/"+name+".ogg";
    music.loop = true;
	var aud = new SoundManager.Music().setAudio(music);
	aud.play();

	this.playingList[name] = aud;


};

Sound.stop = function(name) {
	if(!this.playingList[name]) return;
	this.playingList[name].pause();

	delete this.playingList[name];

};

Sound.stopAll = function(name) {
	for(var name in this.playingList) {
		this.stop(name);
	}

}

exports.Sound = Sound;

})(window.Util = window.Util || {});



(function(SoundManager) {
    SoundManager.Audio= function() {
        return this;
    };

    SoundManager.Audio.prototype= {

        audio   : null,

        setAudio : function( audio ) {
            this.audio= audio;
            this.audio.load();
            return this;
        },

        loop : function( loop ) {
            return this;
        },

        play : function() {
            //var volume = Math.random();
            //console.log("volume = " + volume);
            this.audio.volume = 0.5;

            this.audio.play();
            return this;
        },

        pause : function() {
            this.audio.pause();
            return this;
        }

    };

})(window.SoundManager = window.SoundManager || {});

(function(SoundManager) {
    SoundManager.Music= function() {
        return this;
    };

    SoundManager.Music.prototype= {

        audio   : null,

        setAudio : function( audio ) {
            this.audio= audio;
            this.audio.load();
            this.audio.addEventListener(
                'ended',
                function(audioEvent) {
                    audioEvent.target.playing= false;
                    console.log("Audio ends playing.");
                },
                false
            );
            return this;
        },

        loop : function( ) {
            if ( !this.audio) {
                console.log("audio not present.");
                return;
            }

            this.audio.loop= !this.audio.loop;
            return this;
        },

        play : function() {

            if ( !this.audio) {
                console.log("audio not present.");
                return;
            }

            if ( this.audio.playing ) {
                return;
            }
            this.audio.playing= true;
            this.audio.play();


            return this;
        },

        pause : function() {
            if ( !this.audio) {
                console.log("audio not present.");
                return;
            }
            this.audio.pause();
            this.audio.playing= false;
            return this;
        }

    };

})(window.SoundManager = window.SoundManager || {});


