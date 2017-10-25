'use strict';
(function(namespace){

namespace.DisplayText = {

	shadow: function(textOri, fromTop, fromLeft, tint, alpha) {
		var shadow = new PIXI.BitmapText(textOri.text, {font: textOri.fontSize + "px " + textOri.fontName, tint: tint});
		shadow.position.x = textOri.position.x + fromLeft;
		shadow.position.y = textOri.position.x + fromTop;
		shadow.alpha = alpha;

		var group = new PIXI.DisplayObjectContainer();
		group.addChild(shadow);
		group.addChild(textOri);

		return group;
	},



	updateShadowText: function(container, text, render){
		var children = container.children
			, nb = children.length;
		for(var i=0; i<nb; i++) {
			var c = children[i];
			if(!c.setText) continue;

			c.setText(text);
			if(render) {
				c.updateText();
			}
		}

	},

	wrap: function(textOri, style) {
		var splitText = [],
			textLength = textOri.length,
			group = new PIXI.DisplayObjectContainer(),
			letterMax = style.letterMax || 50,
			lineHeight = style.lineHeight || 20,
			center = (style.align && style.align == "center"),
			maxWidth = style.maxWidth,
			lastSpaceIndex = 0,
			nbChar = 0,
			startAt = 0;
		for(var i=0; i<textLength; i++) {
			nbChar++;
			if(textOri[i] == ' ') lastSpaceIndex = i;

			if(nbChar >= letterMax && lastSpaceIndex > startAt) {
				splitText.push(textOri.slice(startAt, lastSpaceIndex));
				if(nbChar < textLength) nbChar = 0;
				startAt = lastSpaceIndex+1;

			}

		}
		if(nbChar) splitText.push(textOri.slice(startAt, textLength));
		var nbSegment = splitText.length;
		for(var i=0; i<nbSegment; i++) {
			var textEncart = new PIXI.BitmapText(splitText[i], style);
			textEncart.position.y = lineHeight*i;
			if(center && maxWidth) {
				textEncart.position.x = ~~(maxWidth/2 - textEncart.width/2)
			}
			group.addChild(textEncart);

		}


		return group;

	}

};

})(window.Util = window.Util || {});
