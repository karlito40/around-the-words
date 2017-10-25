(function(exports){

var Char = {
	code:
	{
		A:65,
		Z:90,
		a: 97,
		z: 122
	},


	points: {},

	vowel:
	{
		map: ['A', 'E', 'I', 'O', 'U', 'Y'],
		letters: { A: 1, E: 1, I: 1, O: 1, U: 1, Y: 1 }
	},

	consonne:
	{
		map: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z', '?'],
		letters : {B: 1, C: 1, D: 1, F: 1, G: 1, H: 1, J: 1, K: 1, L: 1, M: 1, N: 1, P: 1, Q: 1, R: 1, S: 1, T: 1, V: 1, W: 1, X: 1, Z: 1, '?': 1}
	},

	rand: function()
	{
		// On pourrait aussi faire un alea en fonction du poid ..

		var letter = null;

		switch(rand(0, 2))
		{
			case 0:
			case 1:
				letter = this.vowel.map[rand(0, this.vowel.map.length-1)];
				break;
			case 2:
				letter = this.consonne.map[rand(0, this.consonne.map.length-1)];
				break;
		}

		// return letter.toLowerCase();
		return letter;

		// return String.fromCharCode(code).toLowerCase();
	},

	isVowel: function(c)
	{
		return this.vowel.letters[c.toUpperCase()] || false;
	},

	getVowelPercent: function()
	{
		return this.vowel.map.length/this.consonne.map.length;
	},

	getWeight: function(c)
	{
		var upperChar = c.toUpperCase();
		return this.points[upperChar] || 0;
	},

	setPoints: function(points)
	{
		this.points = points;
	}
};

exports.Char = Char;

})(window.Game = window.Game || {});