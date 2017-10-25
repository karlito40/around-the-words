'use strict';
(function(exports){
function Grid(game, ldGrid, backgroundColor)
{
	this.game = game;
	this.backgroundColor = backgroundColor;

	this.nbLine = ldGrid.length;
	this.nbCol  = ldGrid[0].length;

	this.currentTuto = [];

	var margin    = 0;

	this.topMask = - margin - Game.Ground.WIDTH;

	this.map = [];
	this.words = [];

	var top, left, line = null;
	this.startCol     = null;
	this.endCol       = null;
	this.startLine    = null;
	this.endLine = null;
	this.startCol     = null;
	this.existCol     = {};
	this.nbSolidCol   = 0;
	this.nbSolidLine   = 0;
	this.nbLastDrop   = 0;
	this.lettersForce = {};
	this.wordsFish = {};
	this.hasPearl = false;
	this.hasWall = false;
	this.hasHole = false;
	this.hasBomb = false;
	this.hasFishLocked = false;
	this.nbInitFish = 0;

	var pearlsGround = {};
	var hasSpawnPearl = false;
	for(var i = 0; i<ldGrid.length; i++)
	{
		top         = (i * Game.Ground.HEIGHT) + (margin * i) - (i*Game.Ground.THICKNESS);
		line        = ldGrid[i];
		this.map[i] = [];
		for(var j = 0; j<line.length; j++)
		{
			left = (j * Game.Ground.WIDTH) + (margin * j);
			var gr = this.map[i][j] = new Game.Ground(this, line[j], i, j, {
				top: top,
				left: left
			});

			if(gr.hasLetterFish())
			{
				this.nbInitFish++;
			}

			if(gr.hasWall())
			{
				this.hasWall = true;
			}

			if(gr.hasHole())
			{
				this.hasHole = true;
			}

			if(gr.getLetterFish())
			{
				this.hasFishLocked = true;
			}

			if(gr.getBonus() && gr.getBonus().isBomb())
			{
				this.hasBomb = true;;
			}

			if(gr.spawnPearl)
			{
				if(!pearlsGround[gr.spawnPearl.id])
				{
					pearlsGround[gr.spawnPearl.id] = [];
				}
				hasSpawnPearl = true;
				pearlsGround[gr.spawnPearl.id].push(this.map[i][j]);
			}

			if(!this.existCol[j] && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.nbSolidCol++;
				this.existCol[j] = true;
			}

			if(this.startLine == null && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.startLine = i;
			}

			if((this.endLine == null || i > this.endLine) && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.endLine = i
			}

			if(this.startCol == null && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.startCol = j;
			}

			if((this.endCol == null || j>this.endCol) && this.map[i][j].isSolid() && !this.map[i][j].isLDLostLife())
			{
				this.endCol = j;
			}
		}
	}

	this.nbSolidLine = this.endLine - this.startLine + 1;

	// Ajoute des perles en fonction du template
	if(hasSpawnPearl)
	{
		var spawnPearls = this.game.level.getSpawnPearl();

		var myGrindingPearl = this.game.level.getPearls();
		for(var pearlID in pearlsGround)
		{
			var grounds = pearlsGround[pearlID];
			var qty = spawnPearls[pearlID];
			qty -= myGrindingPearl;
			var qtyMax = Math.min(Math.ceil(qty), grounds.length);


			for(var i=0; i<qtyMax; i++)
			{
				var proba = Math.min(qty-i, 1);
				var spawn = (proba < 1) ? (Math.random() <= proba) : true;

				if(spawn)
				{

					var rI = Util.Math2.randomInt(0, grounds.length-1);
					var gr = grounds[rI];

					this.hasPearl = gr;

					gr.dropPearl();

					grounds.splice(rI, 1);

					myGrindingPearl += 1;
				}

			}

		}
	}

};

// Récupère nb meduses aleatoirement
Grid.prototype.killFishes = function(nb)
{
	var fishes = [];

	this.eachGround(function(ground){
		if(ground.hasLetterFish())
		{
			fishes.push(ground.getLetterFish());
		}
	});

	var randFishes = [];
	if(fishes.length > nb)
	{
		for(var i=0; i<nb; i++)
		{
			var index = Util.Math2.randomInt(0, fishes.length-1);
			var fish = fishes[index];

			randFishes.push(fish);
			fish.kill();

			fishes.splice(index, 1);


			if(!fishes.length)
			{
				break;
			}
		}

	}
	else
	{
		randFishes = fishes;

		for(var i in randFishes)
		{
			var fish = randFishes[i];
			fish.kill();
		}

	}




	return randFishes;
};

Grid.prototype.getSortedLetter = function()
{
	var validFishes = {};
	var lettersCount = {};
	var builderWord = '';

	var job = function(fish){
		if(!fish.isAlive()) return;

		var letter = fish.getLetter().toLowerCase();
		if(!validFishes[letter])
		{
			validFishes[letter] = [];
			lettersCount[letter] = 0;
		}
		validFishes[letter].push(fish);

		lettersCount[letter]++;

		builderWord += letter;
	};


	// Récupère tous les ground comprenant un fish
	this.eachGround(function(ground){
		if(ground.hasLetterFish())
		{
			var fish = ground.getLetterFish();
			job(fish);
		}

		var holeFish = ground.getAvailableHoleFish();
		if(holeFish) job(holeFish);

	});

	builderWord =  Util.String2.sort(builderWord);
	builderWord = builderWord.replace(/[^a-zA-Z 0-9]+/g, '');
	return builderWord;

};

// Grid.prototype.findLargerWord = function(minLength, startAt, inverse)
// {

// 	// var fishWords = [
// 	// 	[{f1}, {f2} ..., {fn1}], // Word 1
// 	// 	[{f1}, {f2} ..., {fn2}], // Word n
// 	// ];

// 	var validFishes = {};	// Indexes par leurs lettres
// 	/*validFishes = {
// 		'A': [{f1}, {f2}],
// 		'B': ...
// 	}*/

// 	var lettersCount = {};
// 	var builderWord = '';

// 	var job = function(fish){
// 		if(!fish.isAlive())
// 		{
// 			return;
// 		}
// 		var letter = fish.getLetter().toLowerCase();
// 		if(!validFishes[letter])
// 		{
// 			validFishes[letter] = [];
// 			lettersCount[letter] = 0;
// 		}
// 		validFishes[letter].push(fish);

// 		lettersCount[letter]++;

// 		builderWord += letter;
// 	};


// 	// Récupère tous les ground comprenant un fish
// 	this.eachGround(function(ground){
// 		if(ground.hasLetterFish())
// 		{
// 			var fish = ground.getLetterFish();
// 			job(fish);
// 		}

// 		var holeFish = ground.getAvailableHoleFish();
// 		if(holeFish)
// 		{
// 			job(holeFish);
// 		}
// 	});

// 	// console.log('builderWord', builderWord);
// 	if(builderWord.length < minLength)
// 	{
// 		// return fishWords;
// 		return [];
// 	}

// 	var fishWords = [];

// 	var tmp =  StringHelper.sort(builderWord);
// 	tmp = tmp.replace(/[^a-zA-Z 0-9]+/g, '');
// 	var rawBuilder = builderWord = tmp;
// 	// Essaye de generer le plus grand mot possible

// 	var word = null;

// 	for(var i=0; i<rawBuilder.length; i++)
// 	{
// 		var builderWord = rawBuilder.substr(i, rawBuilder.length);
// 		var startAt = 0;
// 		var currentLength = builderWord.length;
// 		do
// 		{
// 			var s = builderWord.substr(startAt, currentLength);

// 			// Recherche la section du dico correspondante
// 			if(dictionary[s.length]
// 				&& dictionary[s.length][s]
// 				&& (!word || word.length < s.length)
// 			) {
// 				var section = dictionary[s.length][s];
// 				word = section[rand(0, section.length-1)];
// 			}

// 			currentLength--;
// 		} while(currentLength >= minLength);
// 	}

// 	if(!startAt)
// 	{
// 		var startAt = (builderWord.length < 10) ? builderWord.length : 10;
// 	}

// /*	if(inverse)
// 	{
// 		startAt = minLength;
// 	}
// */
// 	outer_loop:
// 	for(var i = startAt; ((!inverse && i>=minLength) || (inverse && i<=10)) ; (!inverse) ? i-- : i++)
// 	{
// 		var currentSection = dictionary[i];

// 		for(var sortedWord in currentSection)
// 		{
// 			var myLettersCount = {};
// 			var allow = false;
// 			for(var j=0; j<sortedWord.length; j++)
// 			{
// 				var searchLetter = sortedWord[j];
// 				allow = true;
// 				if(!lettersCount[searchLetter]) // Le mot ne peut etre formé a partir de notre letter count
// 				{
// 					allow = false;
// 					break;
// 				}

// 				if(!myLettersCount[searchLetter])
// 				{
// 					myLettersCount[searchLetter] = 0;
// 				}

// 				myLettersCount[searchLetter]++;

// 				if(myLettersCount[searchLetter] > lettersCount[searchLetter])
// 				{
// 					allow = false;
// 					break;
// 				}

// 			}

// 			if(allow)
// 			{
// 				word = currentSection[sortedWord][rand(0, currentSection[sortedWord].length-1)];
// 				break outer_loop;
// 			}

// 		}

// 	}


// 	if(!word)
// 	{
// 		return [];
// 	}


// 	for(var i in word)
// 	{
// 		var letter = word[i];
// 		fishWords.push(validFishes[letter][0]);
// 		validFishes[letter].splice(0, 1);
// 	}

// 	return fishWords;

// }

/*Grid.prototype.findWords = function(nb, minLength, maxLength)
{
	// var fishWords = [
	// 	[{f1}, {f2} ..., {fn1}], // Word 1
	// 	[{f1}, {f2} ..., {fn2}], // Word n
	// ];
	var fishWords = [];
	// Recherche par la fin
	for(var line=this.endLine; line>=0; line--)
	{
		for(var col=this.endCol; col>=0; col--)
		{

			for(var key in MYGame.DIRS)
			{
				var dir = MYGame.DIRS[key];
				var buildingWord = '';
				var fishes = [];
				this.throughDir(dir, line, col, maxLength, function(ground, checkLine, checkCol){
					if(ground.hasLetterFish())
					{
						var fish = ground.getLetterFish();
						buildingWord += fish.getLetter();
					}


					loopLength++;
				});
			}

		}
	}

	return fishWords;

}*/

Grid.prototype.injectWord = function(dir, word, lineStart, colStart)
{
	var cursor = 0;

	var overrideString = '';
	var allow = true;
	var self = this;
	var validLetters = {};
	var fishes = [];
	this.throughDir(dir, lineStart, colStart, word.length, function(ground, line, col){
		var id = line+'_'+col;
		var upperLetter = word[cursor].toUpperCase();
		if(self.lettersForce[id] && self.lettersForce[id] != upperLetter)
		{
			allow = false;
			overrideString += self.lettersForce[id].toLowerCase();	// La lettre actuelle ne peut pas etre modifiée
		}
		else
		{
			// overrideString += '?'; // La lettre courante peut etre modifie
			overrideString += LetterFish.JOKER; // La lettre courante peut etre modifie
			ground.getLetterFish().setLetter(upperLetter);
			fishes.push(ground.getLetterFish());
			validLetters[id] = upperLetter;
		}

		cursor++;
	});


	if(!allow)
	{
		return overrideString;
	}

	for(var i in validLetters)
	{
		this.lettersForce[i] = validLetters[i];
	}

	// Finalement le mot est gardé en mémoire.
	this.words.push(word);
	this.wordsFish[word] = fishes;

	return true;

};

Grid.prototype.throughDir = function(dir, line, col, length, cb)
{
	for(var i=0; i<length; i++)
	{
		if(!this.map[line] || !this.map[line][col])
		{
			return;
		}

		cb(this.map[line][col], line, col);

		switch(dir)
		{

			case MYGame.DIR_NE:
				line--;
				col++;
				break;

			case MYGame.DIR_NW:
				line--;
				col--;
				break;

			case MYGame.DIR_SE:
				line++;
				col++;
				break;

			case MYGame.DIR_SW:
				line++;
				col--;
				break;

			case MYGame.DIR_E:
				col++;
				break;

			case MYGame.DIR_W:
				col--;
				break;

			case MYGame.DIR_S:
				line++;
				break;

			case MYGame.DIR_N:
				line--;
				break;
		}


	}


};

Grid.prototype.fishesByLetter = function()
{
	var mapLetter = {};
	var addFish = function(f)
	{
		if(f.getLetter() == Game.LetterFish.JOKER) return;


		if(!mapLetter[f.getLetter()])
		{
			mapLetter[f.getLetter()] = [];
		}

		mapLetter[f.getLetter()].push(f);
	}
	this.eachGround(function(ground){

		if(ground.hasLetterFish())
		{
			addFish(ground.getLetterFish());
		}

		if(ground.getHole() && ground.getHole().getLetterFish())
		{
			addFish(ground.getHole().getLetterFish());
		}


	});

	return mapLetter;
};


/**
* Deplacement et ajout de poisson
*/

Grid.prototype.drop = function(freshFishs, dir, includeWords)
{
	this.currentTuto = [];

	// Enregistre toutes les translations effectués
	var translate = [];
	var lettersMap = {};

	// --------------------------------------------------------------
	// Deplacement
	// --------------------------------------------------------------

	var last, freeSlot, prevGround, ground, toPosition;
	for(var col=0; col<this.nbCol; col++)
	{
		// On parcours en commencant par le bas de la grille pour
		// recuperer la derniere position libre

		last = true; 	// La derniere case a la meme valeur que Ground.LD_LOST_LIFE
		freeSlot = -1;
		for(var line=(this.nbLine-1); line>=0; line--)
		{
			toPosition = null;
			ground = this.map[line][col];
			if(!ground.isSolid())
			{
				continue;
			}

			var fish = (ground.hasLetterFish()) ? ground.getLetterFish() : null;
			// if(fish)
			if(fish && fish.isAlive())
			{
				lettersMap[fish.getLetter()] = true;
			}

			// if(ground.getHole() && ground.getHole().getLetterFish())
			if(ground.getHole() && ground.getHole().getLetterFish()  && ground.getHole().getLetterFish().isAlive())
			{
				lettersMap[ground.getHole().getLetterFish().getLetter()] = true;
			}


			var fishId       = (fish) ? fish.getId() : null;
			var prevGround   = null;
			var destroyBonus = false;
			var destroyPearl = false;
			var updateWallOnGround = null;
			var jump = false;

			// Deplacement

			// if(fish && !fish.isInHole())
			if(fish && !fish.isInHole() && fish.isAlive())
			{
				if(this.game.getLevel().getMode().needFullGrid())
				{
					fish.hp = 0;
					ground.setLetterFish(null); // Sort le poisson du jeu
					toPosition = {top: this.height, left: ground.getLeft()};
				}
				else if(freeSlot != -1) // Deplacement autorise
				{
					if(!ground.hasWall())
					{
						prevGround      = this.map[freeSlot][col];
						var oldHasBonus = prevGround.hasBonus();
						var oldHasPearl = prevGround.hasPearl();
						if(ground.sendFishTo(prevGround)) // Le sol courant envoit son poisson au sol du dessous
						{
							toPosition   = prevGround.getPosition();
							destroyBonus = oldHasBonus && !prevGround.hasBonus();
							destroyPearl = oldHasPearl && !prevGround.hasPearl();
							jump = (prevGround.getLine() - ground.getLine() > 1);
						}
					}
					else
					{
						updateWallOnGround = ground.attackWall();
					}

				}
				else if(last)
				{

					if(!ground.hasWall())
					{
						// fish.moveTo(ground);
						ground.setLetterFish(null); // Sort le poisson du jeu
						toPosition = {top: this.height, left: ground.getLeft()};
					}
					else
					{
						updateWallOnGround = ground.attackWall();
					}


				}
			}

			last = false;

			// if(ground.hasLetterFish()))
			if(ground.hasLetterFish() && ground.getLetterFish().isAlive())
			{
				freeSlot = -1;	// Le slot n'est pas libre
			}
			else
			{
				freeSlot = line;	// Libere le slot
			}


			if(toPosition)
			{
				translate.push({
					position: toPosition,
					fish: fish,
					groundRececeiver: prevGround,
					ground: ground,
					destroyBonus: destroyBonus,
					destroyPearl: destroyPearl,
					updateWallOnGround: updateWallOnGround,
					jump: jump
				});
			}
			else if(updateWallOnGround)
			{
				translate.push({
					updateWallOnGround: updateWallOnGround
				});
			}

		}
	}

	// --------------------------------------------------------------
	// Ajoute la pioche a notre grille
	// --------------------------------------------------------------

	this.nbLastDrop = 0;
	if(freshFishs)
	{
		var freshFills = [];
		var freshFish = null, lFish = null, ground = null;
		for(var i in freshFishs)
		{
			freshFish = freshFishs[i];

			for(var col=0; col<this.nbCol; col++)
			{
				lFish = freshFish[col];

				if(!lFish)
				{
					continue;
				}

				var line = (dir == 1) ? 0 : this.nbLine-2;

				var cond = false;
				var isCompatible = true;

				var oldGround = null;
				do
				{

					ground = this.map[line][col];
					line += dir;

					cond = (!ground.isSolid());
					if(dir == -1 && !cond)
					{
						// cond = (ground.hasLetterFish());
						cond = (ground.hasLetterFish() && ground.getLetterFish().isAlive());
					}

				} while	(cond  && this.map[line]);

				var oldHasBonus = ground.hasBonus();
				var oldHasPearl = ground.hasPearl();

				var isFree = (!ground.hasLetterFish() || !ground.getLetterFish().isAlive());
				// if(ground && ground.isSolid() && !ground.hasLetterFish())
				if(ground && ground.isSolid() && isFree)
				{
					this.nbLastDrop++;

					ground.receiveFish(lFish);
					freshFills.push(ground);

					lettersMap[lFish.getLetter()] = true;

					var destroyBonus = oldHasBonus && !ground.hasBonus();
					var destroyPearl = oldHasPearl && !ground.hasPearl();

					var pos = ground.getPosition();
					pos.top = this.topMask;


					translate.push({
						position: pos,
						fish: lFish,
						groundRececeiver: ground,
						ground:ground,
						destroyBonus: destroyBonus,
						destroyPearl: destroyPearl,
						jump: true
					});
				}

			}

		}

		// --------------------------------------------------------------
		// Gestion des mots a inclure dans la vague
		// --------------------------------------------------------------
		this._includeWords(freshFills, includeWords, lettersMap);

	}


	return translate;
};


Grid.prototype._includeWords = function(freshFills, includeWords, lettersMap)
{
	if(!includeWords)
	{
		return;
	}

	if(includeWords.word)
	{
		this._includeWord(freshFills, includeWords);
	}

	if(includeWords.wordHanged)
	{
		this._includeWordHanged(freshFills, includeWords);
	}

	if(includeWords.words)
	{
		this._includeMapWords(freshFills, includeWords);
	}

	if(includeWords.letters)
	{
		this._includeLettersWords(freshFills, includeWords);
	}

	if(includeWords.forceLetter)
	{
		this._includeForceLetter(freshFills, includeWords, lettersMap);
	}

	if(includeWords.forceOneLetter)
	{
		this._includeForceOneLetter(freshFills, includeWords, lettersMap);
	}
};


Grid.prototype._includeWordHanged = function(freshFills, includeWords)
{
	var fishesByLetter = this.fishesByLetter();
	var lettersToDisplay = {};
	includeWords.wordHanged.split('').forEach(function(letter){
		if(!lettersToDisplay[letter]) lettersToDisplay[letter] = 1;
		else lettersToDisplay[letter]++;
	});
	for(var letter in lettersToDisplay) {
		var nb = lettersToDisplay[letter];

		if(typeof fishesByLetter[letter] != "undefined" && fishesByLetter[letter].length >= nb ) continue;

		;
		var nbLetterNeed = nb - fishesByLetter[letter].length;
		for(var i=0; i<nbLetterNeed; i++) {
			// Transforme des lettres
			for(var letterDist in fishesByLetter){
				var tab = fishesByLetter[letterDist];

				if(tab.length <= 1) continue;

				var fish = tab.shift();
				fish.setLetter(letter);

			}

		}

	}

	var fm = {};
	var letters = this.fishesByLetter();
	for(var l in letters) {
		fm[l] = letters[l].length;
	}
	// console.log('fm', fm);
};

Grid.prototype._includeWord = function(freshFills, includeWords)
{
	var word = includeWords.word;
	if(freshFills.length < word.length)
	{
		return false;
	}


	var freshCopy = freshFills.slice(0);
// console.log('freshCopy', freshCopy);
	if(includeWords.noRand)
	{
		freshCopy.sort(function(o1, o2){
			if (o1.id > o2.id) return 1;
			if (o1.id < o2.id) return -1;

			return 0;
		});

		var startMax = freshCopy.length - includeWords.word.length;
		var noRandAt = Util.Math2.randomInt(0, startMax-1);
	}


	outer_loop:
	for(var i in word)
	{
		var letter = word[i];

		do
		{
			if(includeWords.noRand)
			{
				var randGroundIndex = noRandAt++;

			}
			else
			{
				var randGroundIndex = Util.Math2.randomInt(0, freshCopy.length-1);
			}

			var randGround = freshCopy[randGroundIndex];
			var recipient = randGround;
			if(!randGround.getLetterFish())
			{
				recipient = randGround.getHole();
			}
			recipient.getLetterFish().setLetter(letter.toUpperCase());

			if(includeWords.tuto)
			{
				this.currentTuto.push(recipient.getLetterFish());
			}

			if(!includeWords.noRand)
			{
				freshCopy.splice(randGroundIndex, 1);
			}

			if(!freshCopy.length)
			{
				break outer_loop;
			}

		} while( (!recipient || !recipient.getLetterFish()) )
	}

};

Grid.prototype._includeForceLetter = function(freshFills, includeWords, lettersMap)
{
	var forceLetter = includeWords.forceLetter.toUpperCase();
	if(!freshFills.length || lettersMap[forceLetter])
	{
		return false;
	}

	var groundFocus = freshFills[Util.Math2.randomInt(0, freshFills.length-1)];

	var fish = groundFocus.getLetterFish() || groundFocus.getHole().getLetterFish();
	fish.setLetter(forceLetter);
	return forceLetter;
};

Grid.prototype._includeForceOneLetter = function(freshFills, includeWords, lettersMap)
{
	if(!freshFills.length){
		return;
	}

	var map = includeWords.forceOneLetter;
	if(!map.length)
	{
		return;
	}

	do
	{
		var randIndex = Util.Math2.randomInt(0, map.length-1);
		var letter = map[randIndex];
		var hasBeenInsert = this._includeForceLetter(freshFills, {
			forceLetter: letter
		}, lettersMap);

		map.splice(randIndex, 1);
	} while(map.length && !hasBeenInsert);
};

Grid.prototype._includeLettersWords = function(freshFills, includeWords)
{
	if(!freshFills.length){
		return;
	}
	var generatedWords = {};

	var wordMinLength = 3;
	var wordMaxLength = 5;
	var nbGrounds     = freshFills.length;
	// console.log('nbGrounds', nbGrounds);
	var nbLettersMax  = Math.min(includeWords.letters, nbGrounds);

	// console.log('nbLettersMax', nbLettersMax);
	var nbWordsMax = ~~(nbLettersMax/wordMinLength); // le nombre de mots maximum que l'on peut générer
	var nbWordsMin = ~~(nbLettersMax/wordMaxLength); // le nombre de mots minimum que l'on peut générer

	var nbWords = Util.Math2.randomInt(nbWordsMin, nbWordsMax); // genere un nombre de mots aléatoires
	// console.log('nbWords', nbWords);
	var todo = [];
	var nbLettersUsed = 0;
	var validIndexes = [];
	for(var i=0; i<nbWords; i++)
	{
		todo.push(wordMinLength);
		validIndexes.push(i);
		nbLettersUsed += wordMinLength;
	}

	// console.log('start todo', todo);

	// Ajuste le tableau pour contenir les nbLettersMax lettres souhaites
	while(nbLettersUsed < nbLettersMax)
	{
		var randIndex = Util.Math2.randomInt(0, validIndexes.length-1);
		var val = todo[validIndexes[randIndex]];
		var addLetter = Util.Math2.randomInt(1, wordMaxLength-val);

		todo[validIndexes[randIndex]] += addLetter;
		nbLettersUsed += addLetter;
		if(todo[validIndexes[randIndex]] >= wordMaxLength)
		{
			validIndexes.splice(randIndex, 1);
		}

	}

	var freshCopy = freshFills.slice(0);

	// console.log('end todo', todo);
	// Le tableau est maintenant bon; il nous reste plus qu'a générer les mots à partir de ce dernier

	for(var i=0; i<todo.length; i++)
	{
		var wordLength = todo[i];
		var index       = Util.Math2.randomInt(0, AroundTheWords.tabDictionary[wordLength].length-1);
		var randWord   = AroundTheWords.tabDictionary[wordLength][index];
		// console.log('randWord', randWord);

		var s = '';
		// Affecte chaque lettre du mot à un freshground
		for(var j=0; j<randWord.length; j++)
		{
			var randGroundIndex = Util.Math2.randomInt(0, freshCopy.length-1);
			var randGround = freshCopy[randGroundIndex];

			var letter = randWord[j];

			/*
TypeError: randGround is undefined
randGround.getLetterFish().setLetter(letter.toUpperCase());
			*/
			if(randGround.getLetterFish())
			{
				randGround.getLetterFish().setLetter(letter.toUpperCase());
			}
			else
			{
				randGround.getHole().getLetterFish().setLetter(letter.toUpperCase());
			}


			freshCopy.splice(randGroundIndex, 1);

			s += randGround.getLine() + '-' + randGround.getCol() + ' ';
		}

	}



};


Grid.prototype._includeMapWords = function(freshFills, includeWords)
{
	if(!freshFills.length){
		return;
	}

	var generatedWords = {};

	// Repertorie les sols qui se sont vues attribues une lettre //
	// Ce qui n'empeche pas de creer un mot avec cette derniere //

	var groundData = {};

	for(var i=0; i<includeWords.words; i++)
	{
		var nbTest = 0;
		do
		{
			// 1 - Choisit un sol aleatoire parmis ceux fraichement remplit
			var index       = Util.Math2.randomInt(0, freshFills.length-1);
			var groundFocus = freshFills[index];
			var line = groundFocus.getLine();
			var col  = groundFocus.getCol();
			// var data = (groundData[line] && groundData[line][col]) ? groundData[line][col] : null;

			if(!groundData[line])
			{
				groundData[line] = {}
			}

			if(!groundData[line][col])
			{
				groundData[line][col] = {
					// dirs: {}
					dirs: MYGame.DIRS.slice(0)
				};
			}

			// A partir de la on peut prendre une direction aleatoire et en definir sa longueur
			// var dir = MYGame.DIRS[rand(0, MYGame.DIRS.length-1)];


			// unallowDir = (data && data.dirs && data.dirs[dir]) ? true : false;
			unallowDir = (!groundData[line][col].dirs.length);

			if(!unallowDir)
			{

				// if(!groundData[line])
				// {
				// 	groundData[line] = {}
				// }

				// if(!groundData[line][col])
				// {
				// 	groundData[line][col] = {
				// 		// dirs: {}
				// 		dirs: MYGame.DIRS.slice(0)
				// 	};
				// }

				// groundData[line][col].dirs[dir] = true;

				var rDirIndex = Util.Math2.randomInt(0, groundData[line][col].dirs.length-1);
				var dir = groundData[line][col].dirs[rDirIndex];
				groundData[line][col].dirs.splice(rDirIndex, 1);


				var dirRange = this.range(dir, groundFocus, true);
				var acceptedRange = includeWords.acceptedRange;
				var wordLength = Util.Math2.randomInt(acceptedRange, dirRange);

				// Seul les mots de plus de 3 lettres sont acceptées

				if(dirRange < acceptedRange || !dictionary[wordLength])
				{
					unallowDir = true; // Continue a boucler gros
				}
				else
				{

					var hasBeenInjected = false;

					// On a plus qu'a trouver un mot de cette longueur
					do
					{
						// <!><!><!> Le mot doit prendre en compte les anciens mots deja placé <!><!><!>
						var dicSection = AroundTheWords.tabDictionary[wordLength];
						var randIndex = Util.Math2.randomInt(0, dicSection.length);
						var word = dicSection[randIndex];
					} while(generatedWords[word] || !word);

					// Wooow notre mot est OK
					// Il nous suffit maintenant de le placer dans la dir donnée //
					var injectedResult = this.injectWord(dir, word, line, col);
					if(injectedResult !== true)
					{

						var acceptedWord = new Word(injectedResult);
						var hasJoker = acceptedWord.hasJoker();
						var jokerResult = acceptedWord.applyJoker();

						if(!jokerResult || !hasJoker || generatedWords[jokerResult] || this.injectWord(dir, acceptedWord.getCurrent(), line, col) !== true)
						{
							unallowDir = true;
							// hasBeenInjected = true;
						}
						else
						{
							generatedWords[acceptedWord.getCurrent()] = true;
							// hasBeenInjected = true;
						}

					}
					else
					{
						generatedWords[word] = true;
						// hasBeenInjected = true;
					}


				}

			}

			if(nbTest > 100)
			{
				this._includeMapWords(freshFills, includeWords);
				return;
			}
			nbTest++;
		} while(unallowDir) // Reproduit le truc si la direction a deja ete utilise


	}
};



Grid.prototype.range = function(dir, ground, include)
{
	// Test.grid.range(Game.DIR_N, Test.grid.map[1][5])


	var line = ground.getLine();
	var col = ground.getCol();

	var range = (include && ground.hasLetterFish()) ? 1 : 0;
	do
	{
		var alive = false;

		switch(dir)
		{

			case MYGame.DIR_NE:
				line--;
				col++;
				break;

			case MYGame.DIR_NW:
				line--;
				col--;
				break;

			case MYGame.DIR_SE:
				line++;
				col++;
				break;

			case MYGame.DIR_SW:
				line++;
				col--;
				break;

			case MYGame.DIR_E:
				col++;
				break;

			case MYGame.DIR_W:
				col--;
				break;

			case MYGame.DIR_S:
				line++;
				break;

			case MYGame.DIR_N:
				line--;
				break;

			default:
				throw new Error('Grid::range ' + dir + ' not implemented yet');

		}

		if(this.map[line] && this.map[line][col] && this.map[line][col].hasLetterFish())
		{
			range++;
			alive = true;
		}

	} while(alive);




	return range;
};



/**
*	Ajoute un joker sur un de nos poissons
*/
Grid.prototype.addJoker = function()
{
	var self = this;

	// --------------------------------------------------------------
	// On commence par recuperer notre liste de poisson sans bonus
	// --------------------------------------------------------------
	var mapFish = [];
	this.eachGround(function(ground){

		if(ground.hasLetterFish()
			&& !ground.getLetterFish().hasBonus()
			&& !ground.getLetterFish().isJoker()
			&& !ground.getLetterFish().isDouble()
		) {
			mapFish.push(ground.getLetterFish());
		}

		if(ground.getHole()
			&& ground.getHole().getLetterFish()
			&& !ground.getHole().getLetterFish().hasBonus()
			&& !ground.getHole().getLetterFish().isJoker()
			&& !ground.getHole().getLetterFish().isDouble()
		) {
			mapFish.push(ground.getHole().getLetterFish());
		}

	});



	if(!mapFish.length)
	{
		return null;
	}

	// --------------------------------------------------------------
	// Tire un poisson aleatoire et ajoute un bonus joker
	// --------------------------------------------------------------
	var randI = Util.Math2.randomInt(0, mapFish.length - 1);
	var fish = mapFish[randI];
	// fish.activeBonus(Grid.BONUS_JOKER);
	fish.activeBonus(
		new Model.Bonus({
			id: Util.Bonus.findByKey(Game.Grid.BONUS_JOKER).id
		})

	);


	return fish;
};


Grid.prototype.addDouble = function()
{
	var self = this;

	// --------------------------------------------------------------
	// On commence par recuperer notre liste de poisson sans bonus
	// --------------------------------------------------------------
	var mapFish = [];
	this.eachGround(function(ground){

		if(ground.hasLetterFish()
			&& !ground.getLetterFish().hasBonus()
			&& !ground.getLetterFish().isJoker()
			&& !ground.getLetterFish().isDouble()
		) {
			mapFish.push(ground.getLetterFish());
		}

		if(ground.getHole()
			&& ground.getHole().getLetterFish()
			&& !ground.getHole().getLetterFish().hasBonus()
			&& !ground.getHole().getLetterFish().isJoker()
			&& !ground.getHole().getLetterFish().isDouble()
		) {
			mapFish.push(ground.getHole().getLetterFish());
		}

	});



	if(!mapFish.length)
	{
		return null;
	}

	// --------------------------------------------------------------
	// Tire un poisson aleatoire et ajoute un bonus joker
	// --------------------------------------------------------------
	var randI = Util.Math2.randomInt(0, mapFish.length - 1);
	var fish = mapFish[randI];
	// fish.activeBonus(Grid.BONUS_JOKER);
	fish.activeBonus(
		new Model.Bonus({
			id: Util.Bonus.findByKey(Game.Grid.BONUS_DOUBLE).id
		})

	);


	return fish;
};


/**
* Ajoute une bombe sur le terrain
*/
Grid.prototype.addBomb = function()
{
	var self = this;
	var mapGround = [];

	this.eachGround(function(ground){
		if(!ground.isSolid() || ground.isLDLostLife())
		{
			return;
		}

		// Une bombe ne peut etre pose sur une meduse ou un sol remplit
		// if(!ground.hasBonus() && (!ground.hasLetterFish() || !ground.getLetterFish().hasBonus()))
		if(!ground.hasBonus()
			&& !ground.hasPearl()
			&& (!ground.hasLetterFish() || !ground.getLetterFish().hasBonus())
			&& (!ground.hasLetterFish() || !ground.getLetterFish().hasPearl()))
		{
			mapGround.push(ground);
		}
	});


	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	// ground.addBonus(Grid.BONUS_BOMB);
	ground.addBonus(new Bonus({
			id: ConfigBonusHelper.findByKey(Grid.BONUS_BOMB).id
		})
	);

	return ground;


};

/**
* Explose tous les poissons autour du point donné
*/
Grid.prototype.explode = function(line, col)
{
	var pattern = [
		// Haut
		{line: line-1, col: col-1},
		{line: line-1, col: col},
		{line: line-1, col: col+1},

		// Centre
		{line: line, col: col-1},
		{line: line, col: col},
		{line: line, col: col+1},

		// Bas
		{line: line+1, col: col-1},
		{line: line+1, col: col},
		{line: line+1, col: col+1}
	];


	var result = [];
	var o, ground;
	for(var i in pattern)
	{
		o = pattern[i];
		if(this.map[o.line] && this.map[o.line][o.col])
		{
			var ground = this.map[o.line][o.col];
			var fishId = null;
			if(ground.hasLetterFish())
			{
				fishId = ground.getLetterFish().getId();
			}
			ground = this.map[o.line][o.col];
			ground.setLetterFish(null);
			result.push({
				ground: ground,
				fishId: fishId
			});
		}
	}

	return result;

};

/**
* Change toutes les lettres des poissons
*/
Grid.prototype.addSwap = function()
{
	var result = [];
	this.eachGround(function(ground){
		if(ground.hasLetterFish()) {
			var fish = ground.getLetterFish();
			var isAllow = fish.randLetter();
			if(isAllow)
			{
				result.push(fish);
			}
		}
	});

	return result;
}

/**
*	Ajoute un mur sur la grille
*/
Grid.prototype.addWall = function()
{
	var mapGround = [];
	this.eachGround(function(ground){
		if(!ground.hasPearl() && !ground.hasBonus() && ground.isWallAccept())
		{
			mapGround.push(ground);
		}
	});

	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	ground.addBonus(Grid.BONUS_WALL);
	ground.createWall();

	return ground;
};

Grid.prototype.hasJoker = function()
{
	for(var i=0; i<this.nbLine; i++) {
		for(var j=0; j<this.nbCol; j++) {
			if(this.map[i][j].hasLetterFish()
				&& this.map[i][j].getLetterFish().isJoker()
			) {
				return true;
			}
		}
	}

	return false;
};

/**
*	Ajoute
*/
Grid.prototype.addHole = function()
{
	var mapGround = [];
	this.eachGround(function(ground){
		if(!ground.isSolid())
		{
			return;
		}

		// Le trou ne peut atterir sur un mur
		if(!ground.isLDWall() && !ground.hasHole())
		{
			mapGround.push(ground);
		}
	});

	if(!mapGround.length)
	{
		return null;
	}

	var randI = Util.Math2.randomInt(0, mapGround.length - 1);
	var ground = mapGround[randI];
	ground.addHole();

	return ground;
};

/**
*	Parcours les pavets de notre grille
*/
Grid.prototype.eachGround = function(callback)
{
	if(!callback)
	{
		throw new Error("Grid::eachGround a besoin d\'un callback");
	}

	for(var i=0; i<this.nbLine; i++) {
		for(var j=0; j<this.nbCol; j++) {
			callback(this.map[i][j]);
		}
	}
};

Grid.prototype.eachFish = function(callback)
{
	this.eachGround(function(ground){
		var fishesLeft = [];
		if(ground.getLetterFish())
		{
			callback(ground.getLetterFish());
		}

		if(ground.getHole() && ground.getHole().getLetterFish())
		{
			callback(ground.getHole().getLetterFish());
		}

	});
};

Grid.generateHeap = function(grid){
	var heapLine = [];
	var allowedCol = [];

	if(!grid.game.getLevel().getMode().isHanged())
	// if(true)
	{
		for(var j=0; j<grid.getNbCol(); j++)
		{
			if(grid.hasCol(j))
			{
				allowedCol.push(j);
			}

			heapLine.push(null);
		}
	}
	else
	{
		if(typeof Model.LetterDropTemplate.dropAt == "undefined" || Model.LetterDropTemplate.dropAt == null || Model.LetterDropTemplate.dropAt < grid.startLine)
		{
			Model.LetterDropTemplate.dropAt = grid.endLine;
		}

		var useLine = grid.map[Model.LetterDropTemplate.dropAt];
		for(var j=0; j<useLine.length; j++)
		{
			if(useLine[j].isSolid() && !useLine[j].isLDLostLife())
			{
				allowedCol.push(j);
			}

			heapLine.push(null);
		}

		Model.LetterDropTemplate.dropAt--;
	}


	return {
		allowedCol: allowedCol,
		heapLine: heapLine
	}
};

Grid.generateHeapLetter = function(grid, difficulty, toGenerate, suchAs)
{
	var heap = Grid.generateHeap(grid);

	for(var nbGenerate=0;nbGenerate<toGenerate;nbGenerate++)
	{
		if(!heap.allowedCol.length)
		{
			break;
		}

		// Récupère une colonne valide
		if(!suchAs)
		{
			var atIndex = Util.Math2.randomInt(0, heap.allowedCol.length-1);
		}
		else
		{
			var atIndex = 0;
		}

		var atCol = heap.allowedCol[atIndex];
		heap.allowedCol.splice(atIndex, 1);

		if(difficulty.letter)
		{
			heap.heapLine[atCol] = difficulty.letter();
		}
		else
		{
			if(!suchAs)
			{
				var rI = Util.Math2.randomInt(0, difficulty.length-1);
				var letter = difficulty.splice(rI, 1);
				letter = letter[0];
			}
			else
			{
				var letter = difficulty.splice(0, 1);
				letter = letter[0];
			}
			heap.heapLine[atCol] = letter;
		}

	}


	return heap.heapLine;

};

Grid.generateWord = function(grid, difficulty, suchAs)
{
	var heapLetter = Grid.generateHeapLetter(grid, difficulty, difficulty.length, suchAs);
	var freshFish = {
		res: [],
		length: 0
	};
	var length = 0;
	var fishesInLine = [];
	var fishes = [];
	for(var i in heapLetter)
	{
		if(heapLetter[i])
		{
			// fishes.push(LetterFish.create(heapLetter[i], game));
			fishes.push(Game.LetterFish.create(heapLetter[i], grid.game.getLevel().getDifficultyTpl()));
			length++;
		}
		else
		{
			fishes.push(null);
		}
	}
	fishesInLine.push(fishes);

	freshFish.res = fishesInLine;
	freshFish.length = length;
	return freshFish;
};


Grid.prototype.hasCol           = function(col) { return this.existCol[col]; };
Grid.prototype.getMap           = function(){ return this.map; };
// Grid.prototype.getWidth         = function() { return this.width; },
// Grid.prototype.getHeight        = function() { return this.height; },
Grid.prototype.getGround        = function(line, col) { return this.map[line][col]; };
Grid.prototype.getNbCol         = function() { return this.nbCol; };
Grid.prototype.getNbLine        = function() { return this.nbLine; };
// Grid.prototype.getBackgroundUrl = function() { return UrlHelper.getBackground(this.backgroundId); }
Grid.prototype.getBackgroundColor = function() { return this.backgroundColor; };
Grid.prototype.getNbSolidCol    = function() { return this.nbSolidCol; };
Grid.prototype.getNbSolidLine    = function() { return this.nbSolidLine; };
Grid.prototype.getStartCol      = function() { return this.startCol; };
Grid.prototype.getEndCol        = function() { return this.endCol; };
Grid.prototype.getStartLine     = function() { return this.startLine; };
Grid.prototype.getEndLine       = function() { return this.endLine; };
Grid.prototype.getWords         = function() { return this.words; };
Grid.prototype.getNbLastDrop    = function() { return this.nbLastDrop; };

Grid.BONUS_JOKER  = 'BONUS_JOKER';
Grid.BONUS_BOMB   = 'BONUS_BOMB';
Grid.BONUS_FREEZE = 'BONUS_FREEZE';
Grid.BONUS_HOLE   = 'BONUS_HOLE';
Grid.BONUS_HELP   = 'BONUS_HELP';
Grid.BONUS_BONUS  = 'BONUS_BONUS';
Grid.BONUS_SWAP   = 'BONUS_SWAP';
Grid.BONUS_WALL   = 'BONUS_WALL';
Grid.BONUS_LIFE   = 'BONUS_LIFE';
Grid.BONUS_DOUBLE   = 'BONUS_DOUBLE';

Grid.BonusList = [Grid.BONUS_JOKER, Grid.BONUS_BOMB, Grid.BONUS_HOLE, Grid.BONUS_HELP, Grid.BONUS_BONUS, Grid.BONUS_SWAP, Grid.BONUS_FREEZE, Grid.BONUS_WALL, Grid.BONUS_LIFE, Grid.BONUS_DOUBLE];
Grid.BonusWord = {};

exports.Grid = Grid;

})(window.Game = window.Game || {});