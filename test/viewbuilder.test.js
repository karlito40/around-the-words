'use strict';


describe("ViewBuilder", function(){

	it("should throw an error with an unknow view", function(){
		expect(function(){
			var builder = new UI.ViewBuilder('toto');
		}).toThrow();

	});

/*	it("should throw an error when an element ask to be saved without refId or refClass", function(){
		var builder = new UI.ViewBuilder('simple_test');

		expect(function(){

			var object = new PIXI.DisplayObjectContainer();
			builder.add(object, true);

		}).toThrow();

	});*/

	it("should not throw an error if you add an item without refId or efClass", function(){
		expect(function(){
			var builder = new UI.ViewBuilder('simple_test');

			var o1 = new PIXI.DisplayObjectContainer();
			builder.add(o1);

		}).not.toThrow();
	});


	it("should not throw an error when an element ask to be saved with a refId or a refClass", function(){

		expect(function(){
			var builder = new UI.ViewBuilder('simple_test');

			var o1 = new PIXI.DisplayObjectContainer();
			o1.refId = "toto";
			builder.add(o1);

			var o2 = new PIXI.DisplayObjectContainer();
			o2.refClass = "super_toto";
			builder.add(o2);

			var o3 = new PIXI.DisplayObjectContainer();
			o3.refClass = "noooo";
			o3.refId = "yolo";
			builder.add(o3);

		}).not.toThrow();

	});

	it("should throw an error when an element is saved with a refId in use", function(){

		expect(function(){
			var builder = new UI.ViewBuilder('simple_test');

			var o1 = new PIXI.DisplayObjectContainer();
			o1.refId = "toto";
			builder.add(o1);

			var o1 = new PIXI.DisplayObjectContainer();
			o1.refId = "toto";
			builder.add(o1);

		}).toThrow();


	});


	// it("should throw an error when an element has a refId or a refClass and does not use the save function", function(){

	// 	expect(function(){

	// 		var builder = new UI.ViewBuilder('simple_test');

	// 		var o1 = new PIXI.DisplayObjectContainer();
	// 		o1.refId = "toto";
	// 		builder.add(o1);

	// 	}).toThrow();


	// });

	it("should be false when an element id is not found", function(){

		var builder = new UI.ViewBuilder('simple_test');
		expect(builder.getElementById('toto')).toBe(false);

	});


	it("shouldn't be false when an element id is found", function(){

		var builder = new UI.ViewBuilder('simple_test');

		var o1 = new PIXI.DisplayObjectContainer();
		o1.refId = "toto";
		builder.add(o1);

		expect(builder.getElementById('toto')).not.toBe(false);

	});

	it("should be an array when an element class exist", function(){

			var builder = new UI.ViewBuilder('simple_test');

			var o1 = new PIXI.DisplayObjectContainer();
			o1.refClass = "class";
			builder.add(o1);


			expect(Array.isArray(builder.getElementsByClassName('class'))).toBe(true);

	});

	it("should be an array with 2 element when you save 2 same class", function(){

			var builder = new UI.ViewBuilder('simple_test');

			var o1 = new PIXI.DisplayObjectContainer();
			o1.refClass = "class";
			builder.add(o1);

			var o2 = new PIXI.DisplayObjectContainer();
			o2.refClass = "class";
			builder.add(o2);


			expect(builder.getElementsByClassName('class').length).toEqual(2);


	});



});
