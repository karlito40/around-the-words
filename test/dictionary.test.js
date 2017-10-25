'use strict';


var testWord = "AACIIIILNNNNOOOSSSSSTTTU";

describe("Dictionary", function(){

	it("should load an array with more than 200 000 elements", function(done) {
		var dictionaryLoader = new Game.DictionaryLoader('dico_array.fr');
		dictionaryLoader.onComplete = function(error, res){
			expect(error).toBe(null);
			expect(Array.isArray(res)).toBe(true);
			expect(res.length).toBeGreaterThan(200000);
			done();
		}
		dictionaryLoader.load();

  	});

	it("should load an object with an " + testWord + " index", function(done) {

		var dictionaryLoader = new Game.DictionaryLoader('dico_sort.fr');
		dictionaryLoader.onComplete = function(error, res){
			expect(error).toBe(null);
			expect(Array.isArray(res[testWord])).toBe(true);
			expect(res[testWord].length).toBeGreaterThan(0);
			done();
		}
		dictionaryLoader.load();

  	});

});


describe("DictionaryArray", function(){

	it("should be able to rand word on a unique array", function(){
		var dicoArray = new Game.DictionaryArray(["toto"]);
		expect(dicoArray.rand()).toEqual("toto");

	});

	it("should be able to rand word on a complicated array", function(){
		var array = [];
		for(var i = 0; i<200000; i++) {
			array.push("word-" + i);
		}
		var dicoArray = new Game.DictionaryArray(array);
		expect(dicoArray.rand()).toEqual(jasmine.any(String));

	});
});


describe("DictionarySort", function(){
	var map = {};
	map[testWord] = ['toto', 'tata'];
	var dicoSort = new Game.DictionarySort(map)


	it("should be able to get an index", function(){
		expect( Array.isArray(dicoSort.getIndex(testWord)) ).toBe(true);
	});

	it("should be able to return false when an index is unknow", function(){
		expect( dicoSort.getIndex("lol") ).toBe(false);
	});

});