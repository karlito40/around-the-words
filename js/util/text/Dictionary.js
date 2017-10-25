(function(exports){
exports.Dictionary = {

	_cacheExist: {},
	_cacheLargerWord: {},

	createAbc: function(doShuffle)
	{
		var abc = [];
		for(var code=CharHelper.code.a; code<=CharHelper.code.z; code++) abc.push(code);

		if(doShuffle) abc = shuffle(abc);
		return abc;
	},

	startBy: function(by, inLength)
	{
		// if(!dictionary[inLength])
		if(!AroundTheWords.tabDictionary[inLength]) return false;


		var elems = AroundTheWords.tabDictionary[inLength];
		for(var i in elems)
		{
			var checkWord = elems[i];

			if(checkWord.indexOf(by) == 0) return checkWord;

		}

		return false;
	},

	findLargerWord: function(sortedLetter, cb)
	{
		// console.log('findLargerWord', sortedLetter);
		if(typeof this._cacheLargerWord[sortedLetter] != "undefined")
		{
			if(cb)
			{
				cb(this._cacheLargerWord[sortedLetter])
			}
		}
		else
		{
			var self = this;
			ATW.App.getDataManager().getApi().call('Word', 'GET', {
				on: 'findLargerWord',
				data: {
					sortedLetter: sortedLetter
				}
			}, function(res){
				if(!res.error)
				{
					self._cacheLargerWord[sortedLetter] = res.lword;

					if(cb)
					{
						cb(res.lword)
					}

				}
			});
		}


	},

	generateRandWord: function(nb, length, cb, hangedTuto)
	{
		ATW.App.getDataManager().getApi().call('Word', 'GET', {
			on: 'generateRand',
			data: {
				hangedTuto: (hangedTuto) ? 1 : 0,
				nb: nb,
				length: length
			}
		}, function(res) {
			if(res.error)
			{
				return;
			}

			if(res.list && cb)
			{
				cb(res.list);
			}
		});
	},

	exist: function(word, cb)
	{
		var self = this;

		if(typeof this._cacheExist[word] != "undefined")
		{
			if(cb) cb(this._cacheExist[word])

			return null;
		}


		return ATW.App.getDataManager().getApi().call('Word', 'GET', {
			on: 'find',
			data: {
				word: word
			}
		}, function(res){
			console.log('res', res);
			if(res.error)
			{
				if(cb) cb(null);
			}
			else
			{
				self._cacheExist[word] = res.ex;
				if(cb) cb(self._cacheExist[word]);

			}

		});

	}
}

})(window.Util = window.Util || {});