'use strict';
describe("Depth", function(){

	it("should decremented with the distance", function(){
		var depth = new Util.Depth({x: 0}, 10);

		var a1 = depth.get({x: 100});
		var a2 = depth.get({x: 300});
		var a3 = depth.get({x: 500});

		expect(a2).toBeLessThan(a1);
		expect(a3).toBeLessThan(a1);

	});

	it("should keep the same depth with a negative x or positive x", function(){
		var depth = new Util.Depth({x: 200}, 10);

		var a1 = depth.get({x: 100});
		var a2 = depth.get({x: 300});

		expect(a2).toEqual(a1);

	});

	it("should return scaleOri when refPoint is equal to checkingPoint", function(){
		var scaleOri = 1.4;
		var depth = new Util.Depth({x: 200}, 10, scaleOri);

		var a1 = depth.get({x: 200});
		expect(a1).toEqual(scaleOri);

	});

});
