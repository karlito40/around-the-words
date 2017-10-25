'use strict';
(function(exports){

function Scroll(displayObject, camera, column)
{

	this.displayObject = displayObject;

	this.ticker = this.frame = this.velocity = this.reference = this.amplitude = null;

	this.timeConstant = 175;
	this.min = this.displayObject.position.x;
	this.pressed = false;
	this.traveling = 0;
	// this.max = this.displayObject.height - boundary.height;
	this.max = this.displayObject.position.x - this.displayObject.width + camera.width;

    if(column) {
        this.snap = (this.max - this.min)/column;
    }

    this.displayObject.hitArea = new PIXI.Rectangle(0, 0, this.displayObject.width, this.displayObject.height*2);


	this.displayObject.interactive = true;

	this.displayObject.touchstart = this.displayObject.mousedown = this.tap.bind(this);
	this.displayObject.touchmove = this.displayObject.mousemove = this.drag.bind(this);
	this.displayObject.touchend = this.displayObject.mouseup = this.release.bind(this);

};



Scroll.prototype.tap = function(interactionData)
{
	var cursor = interactionData.getLocalPosition(ATW.stage);

	this.pressed = true;
    this.reference = cursor.x;

    this.velocity = this.amplitude = 0;
    this.frame = this.displayObject.position.x;
    this.timestamp = Date.now();

    if(this.ticker) {
    	clearInterval(this.ticker);
    	this.ticker = null;
    }
    this.ticker = setInterval(this.track.bind(this), 100);
};

Scroll.prototype.drag = function(interactionData)
{
    if (!this.pressed) return;

	var cursor = interactionData.getLocalPosition(ATW.stage);
	var x, delta;
    x = cursor.x;

    delta = x - this.reference;

    if (delta > 2 || delta < -2) {
        this.reference = x;
        this.translate(this.displayObject.position.x + delta);
    }
};

Scroll.prototype.release = function(interactionData)
{
	this.pressed = false;

	if(this.ticker){
		clearInterval(this.ticker);
		this.ticker = null;
	}

  /*  if (this.velocity > 10 || this.velocity < -10) {
        // this.amplitude = 0.03 * this.velocity;
        this.amplitude = 0.025 * this.velocity;
        // this.amplitude = 0.025 * this.velocity;
        this.target = Math.round(this.displayObject.x + this.amplitude);
        this.timestamp = Date.now();
        requestAnimationFrame(this.autoTraject.bind(this));
    }*/

    this.target = this.displayObject.position.x;
    if (this.velocity > 10 || this.velocity < -10) {
        // this.amplitude = 0.025 * this.velocity;
        this.amplitude = 0.025 * this.velocity;
        this.target = this.displayObject.x + this.amplitude;

    }

    if(this.snap) {
        this.target = Math.round(this.target/this.snap) * this.snap;
    }
    this.amplitude = this.target - this.displayObject.position.x;

    this.timestamp = Date.now();
    requestAnimationFrame(this.autoTraject.bind(this));

};


Scroll.prototype.track = function()
{
	var now, elapsed, delta, v;

    now = Date.now();
    elapsed = now - this.timestamp;
    this.timestamp = now;
    delta = this.displayObject.position.x - this.frame;
    this.frame = this.displayObject.position.x;

    v = 1000 * delta / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
};


// autoScroll
Scroll.prototype.autoTraject = function()
{
    if (!this.amplitude) return;

    var elapsed = Date.now() - this.timestamp;
    var delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);
    if (delta > 0.5 || delta < -0.5) {
        // this.translate(this.displayObject.position.x - delta);
    	this.translate(this.target + delta);
    	requestAnimationFrame(this.autoTraject.bind(this));
	} else {
        this.translate(this.target);
    }

};

// scroll
Scroll.prototype.translate = function(x)
{
	if(x < this.max) {
		x = this.max
	} else if(x > this.min) {
		x = this.min;
	}

	var old = this.displayObject.position.x;
	this.displayObject.position.x = x;
    // console.log('this.current', this.displayObject.position.x);
	this.traveling += old - this.displayObject.position.x;

	if(this.onUpdate) this.onUpdate(this.traveling);
};

exports.Scroll = Scroll;


})(window.PIXIScroller = window.PIXIScroller || {});