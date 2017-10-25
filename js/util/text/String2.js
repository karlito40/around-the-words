'use strict';
(function(namespace){

namespace.String2 = {
	strtr: function(string, o) {
		var s2 = string;
		for(var find in o) {
	 		var replaceBy = o[find];
	 		var regex = new RegExp(find, "g");

	 		s2 = s2.replace(regex, replaceBy);
	 	}

	 	return s2;
	},

	textCut: function(text, max, replace) {
		if(text.length > max) {
			text = text.substr(0, max);
			if(replace) {
				text += replace;
			}
		}

		return text;
	},


	sort: function(s) {
		var chars  = s.split('');
		chars.sort();
		return chars.join('');
	},

	strip: function(s) {
		return s.replace(/<[^>]*>?/g, '');
	},

	capitalise: function(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	},

	noAccent: function(s) {
	   var accent = [
	        /[\300-\306]/g, /[\340-\346]/g, // A, a
	        /[\310-\313]/g, /[\350-\353]/g, // E, e
	        /[\314-\317]/g, /[\354-\357]/g, // I, i
	        /[\322-\330]/g, /[\362-\370]/g, // O, o
	        /[\331-\334]/g, /[\371-\374]/g, // U, u
	        /[\321]/g, /[\361]/g, // N, n
	        /[\307]/g, /[\347]/g// C, c
	    ];
	    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

	    for(var i = 0; i < accent.length; i++){
	        s = s.replace(accent[i], noaccent[i]);
	    }

	    return s;
	}




};

})(window.Util = window.Util || {});


