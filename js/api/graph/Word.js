'use strict';

(function(exports){

var Word = {};

Word.get = function(params){
	var response = {};
	switch(params.on) {
		case 'find':
			console.log('Word::find');
			var checkWord = params.data.word.toUpperCase(),
				exist;

			if(this._hasJoker(checkWord)){

				exist = this._applyJoker(checkWord);

			} else {
				var sortedWord = Util.String2.sort(checkWord)
				, section = ATW.dictioSort.map[sortedWord.length];

				if(section && section[sortedWord]) exist = true;
			}

			response.ex = exist;

			break;


		case 'findLargerWord':
			console.log('Word::findLargerWord');

			var sortedLetter = params.data.sortedLetter.toUpperCase()
				, minLength = params.data.minLength || 1;

			response.lword = this._findLarger(sortedLetter, parseInt(minLength, 10));
			console.log('Word::findLargerWord result', response);

			break;

		case 'generateRand':
			console.log('Word::generateRand');
			var nb = parseInt(params.data.nb, 10)
				, length = parseInt(params.data.length, 10)
				, hangedTuto = parseInt(params.data.hangedTuto, 10);

			response.list = this._randWords(nb, length, hangedTuto);
			console.log('Word::generateRand result', response);

			break;


	}



	return response;


};
Word.post = function(){
	console.log('Word::post need to be implemented');
};
Word.delete = function(){
	console.log('Word::delete need to be implemented');
};


Word._hasJoker = function(s) {
	return (s.indexOf(Game.LetterFish.JOKER) != -1);
};

Word._applyJoker = function(s){
	var tab = s.split(Game.LetterFish.JOKER);

	if(tab.length == 1) return s;

	var result = this._checkABC(tab[0], tab, 0, s.length);
	return (result) ? result : false;
};



Word._checkABC = function(start, tab, i, sizeWord)
{
	if(i == tab.length - 1){
		return this._startBy(start, sizeWord);
	}

	var wordFound,
		c,
		res,
		abc = this._createAbc(true);
	for(var j=0; j<abc.length; j++)
	{
		c = String.fromCharCode(abc[j]);
		wordFound = this._startBy(start + c, sizeWord);
		if(wordFound){
			res = this._checkABC(start + c + tab[i + 1], tab, i + 1, sizeWord);
			if(res){
				return res;
			}
		}
	}

	return false;
};


Word._startBy = function(by, inLength)
{
	var elems = this._getArrayDictionary(inLength);
	if(!elems) return false;

	for(var i in elems)
	{
		var checkWord = elems[i];
		if(checkWord.indexOf(by) == 0) return checkWord;

	}

	return false;
};

Word._createAbc = function(doShuffle)
{
	var abc = []
		, codes = Game.Char.code;
	for(var code=codes.A; code<=codes.Z; code++) abc.push(code);

	if(doShuffle) abc = Util.Array.shuffle(abc);

	return abc;
};

Word._getLettersCount = function(sortedLetter) {
	var lettersCount = {}
		, l = sortedLetter.length
		, letter;


	for(var i=0; i<l; i++)
	{
		letter = sortedLetter[i];
		if(!lettersCount[letter]) lettersCount[letter] = 0;

		lettersCount[letter]++;
	}

	return lettersCount;

};

Word._getSortDictionary = function(i) {
	return ATW.dictioSort.map[i];
};

Word._getArrayDictionary = function(i) {
	return ATW.dictioArray.map[i]
};

Word._randWords = function(nb, length, hangedTuto) {
	var list = [],
		section = this._getArrayDictionary(length);

	if(!section) return list;

	var sectionCount = section.length
		, generated = {}
		, nbGenerated = 0
		, mysteryWord, isOk;
	for(var x=0; x<nb; x++)
	{
		do
		{
			mysteryWord = section[Util.Math2.randomInt(0, sectionCount)];
			isOk = true;

		} while ( !isOk || (generated[mysteryWord] && nbGenerated < sectionCount) )

		generated[mysteryWord] = true;
		list.push(mysteryWord);
		nbGenerated++;

		if(nbGenerated >= sectionCount) break;

		hangedTuto = false;
	}


	return list;

};

Word._findLarger = function(sortedLetter, minLength){
	if(!minLength) var minLength = 0;

	var l = sortedLetter.length;
	if(!l || l < minLength) return '';


	var inverse = true
		, lettersCount = this._getLettersCount(sortedLetter)
		, word = ''
		, startAt
		, currentSection;


	if(inverse) startAt = Math.min(l, 25);
	else startAt = 0;

	breakAll:
	for(var i = startAt; ((inverse && i>=minLength) || (!inverse && i<=25)) ; (inverse) ? i-- : i++)
	{
		currentSection = this._getSortDictionary(i);
		if(!currentSection) {
			continue;
		}

		// foreach($currentSection as $sortWord => $wordList)
		for(var sortWord in currentSection)
		{
			var wordList = currentSection[sortWord]
				, myLettersCount = {}
				, allow = false
				, sortedLength = sortWord.length;
			for(var j=0; j<sortedLength; j++)
			{
				var searchLetter = sortWord[j];
				allow = true;
				// Le mot ne peut etre formé a partir de notre letter count
				if(!lettersCount[searchLetter])
				{
					allow = false;
					break;
				}

				if(!myLettersCount[searchLetter]) myLettersCount[searchLetter] = 0;

				myLettersCount[searchLetter]++;

				if(myLettersCount[searchLetter] > lettersCount[searchLetter])
				{
					allow = false;
					break;
				}

			}

			if(allow)
			{
				word = wordList[Util.Math2.randomInt(0, wordList.length-1)];
				break breakAll;
			}

		}

	}

	return word;
};

exports.Word = Word;

})(window.Api = window.Api || {});