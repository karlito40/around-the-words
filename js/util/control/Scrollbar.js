'use strict';
(function(exports){

function ScrollBar(overflow, camera)
{

	this.overflow = overflow;
    this.displayObject = overflow.children[0],

	this.ticker = this.frame = this.velocity = this.reference = this.amplitude = null;

	this.timeConstant = 175;
	this.min = this.displayObject.position.y;
	this.pressed = false;
	this.traveling = 0;
	this.max = this.displayObject.position.y - this.displayObject.height + camera.height;


    if(this.displayObject.height > this.max) {
    	this.overflow.interactive = true;

    	this.overflow.touchstart = this.overflow.mousedown = this.tap.bind(this);
    	this.overflow.touchmove = this.overflow.mousemove = this.drag.bind(this);
    	this.overflow.touchend = this.overflow.mouseup = this.release.bind(this);
    }

};



ScrollBar.prototype.tap = function(interactionData)
{
	var cursor = interactionData.getLocalPosition(ATW.stage);

	this.pressed = true;
    this.reference = cursor.y;

    this.velocity = this.amplitude = 0;
    this.frame = this.displayObject.position.y;
    this.timestamp = Date.now();

    if(this.ticker) {
    	clearInterval(this.ticker);
    	this.ticker = null;
    }
    this.ticker = setInterval(this.track.bind(this), 100);
};

ScrollBar.prototype.drag = function(interactionData)
{
    if (!this.pressed) return;

	var cursor = interactionData.getLocalPosition(ATW.stage);
	var y, delta;
    y = cursor.y;

    delta = y - this.reference;

    if (delta > 2 || delta < -2) {
        this.reference = y;
        this.translate(this.displayObject.position.y + delta);
    }
};

ScrollBar.prototype.release = function(interactionData)
{
	this.pressed = false;

	if(this.ticker){
		clearInterval(this.ticker);
		this.ticker = null;
	}


    this.target = this.displayObject.position.y;
    if (this.velocity > 10 || this.velocity < -10) {
        this.amplitude = 0.025 * this.velocity;
        this.target = this.displayObject.y + this.amplitude;

    }

    if(this.snap) {
        this.target = Math.round(this.target/this.snap) * this.snap;
    }
    this.amplitude = this.target - this.displayObject.position.y;

    this.timestamp = Date.now();
    requestAnimationFrame(this.autoTraject.bind(this));

};


ScrollBar.prototype.track = function()
{
	var now, elapsed, delta, v;

    now = Date.now();
    elapsed = now - this.timestamp;
    this.timestamp = now;
    delta = this.displayObject.position.y - this.frame;
    this.frame = this.displayObject.position.y;

    v = 1000 * delta / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
};


// autoScrollBar
ScrollBar.prototype.autoTraject = function()
{
    if (!this.amplitude) return;

    var elapsed = Date.now() - this.timestamp;
    var delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);
    if (delta > 0.5 || delta < -0.5) {
        // this.translate(this.displayObject.position.y - delta);
    	this.translate(this.target + delta);
    	requestAnimationFrame(this.autoTraject.bind(this));
	} else {
        this.translate(this.target);
    }

};

// scrollBar
ScrollBar.prototype.translate = function(y)
{
	if(y < this.max) {
		y = this.max
	} else if(y > this.min) {
		y = this.min;
	}



	var old = this.displayObject.position.y;
	this.displayObject.position.y = y;
    // console.log('this.current', this.displayObject.position.y);
	this.traveling += old - this.displayObject.position.y;

	if(this.onUpdate) this.onUpdate(this.traveling);
};

exports.ScrollBar = ScrollBar;


})(window.PIXIScroller = window.PIXIScroller || {});