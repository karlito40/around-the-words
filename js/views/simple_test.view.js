// Une vue

(function(views){

	views.simple_test = function build_simple_test(builder) {

		var yellowFish = new PIXI.Sprite(PIXI.Texture.fromFrame('yellow_fish_default'))
		builder.add(yellowFish);

	}


})(window.View = window.View || {});
