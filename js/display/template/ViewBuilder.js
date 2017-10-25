'use strict';

(function(namespace){

/**
 * View Builder simule un dom à partir d'une vue
 *
 * @class ViewBuilder
 * @constructor
 */
function ViewBuilder(viewName, attachTo, params){
	this.viewName = viewName;
	if(typeof View[this.viewName] == "undefined")
		throw new Error("ViewBuilder a besoin d'une vue existante pour fonctionner {"+viewName+"}");

	this.template = View[this.viewName];
	this.treeId = {};
	this.treeClass = {};
	this.container = attachTo || new PIXI.DisplayObjectContainer();
	this.buildDone = false;
	this.params = params || {};
};


ViewBuilder.prototype.build = function(){

	if(this.buildDone) return;
	this.buildDone = true;

	this.template(this);


};

ViewBuilder.prototype.add = function(displayObject, force) {

	if(force || this.isSavable(displayObject)) {
		this.save(displayObject, force);
	}
	this.container.addChild(displayObject);

};

ViewBuilder.prototype.isSavable = function(displayObject) {
	return (displayObject.refId || displayObject.refClass);
};

ViewBuilder.prototype.save = function(saveRef, force){
	// if(!saveRef.refId && !saveRef.refClass) {c
	if(!this.isSavable(saveRef)) {
		throw new Error("ViewBuilder::saveRef L'element ne peut etre sauvegarde que si au moins refId ou refClass est specifie");

	}

	this.saveRefId(saveRef, force);
	this.saveRefClass(saveRef, force);
};

ViewBuilder.prototype.saveRefId = function(saveRef, force) {
	if(!saveRef.refId) return;

	if(this.treeId[saveRef.refId] && ! force)
		throw new Error("ViewBuilder::saveRefId Impossible de sauvegarder la ref ID car un autre element occupe deja cet emplacement " + saveRef.refId);

	this.treeId[saveRef.refId] = saveRef;
};

ViewBuilder.prototype.saveRefClass = function(saveRef) {
	if(!saveRef.refClass) return;

	if(!this.treeClass[saveRef.refClass]) this.treeClass[saveRef.refClass] = [];

	this.treeClass[saveRef.refClass].push(saveRef);

};

ViewBuilder.prototype.setElementById = function(element) {
	this.treeId[id] = element;
};

ViewBuilder.prototype.getElementById = function(id) {
	return this.treeId[id] || false;
};

ViewBuilder.prototype.getElementsByClassName = function(className) {
	return this.treeClass[className] || false;
};


namespace.ViewBuilder = ViewBuilder;

})(window.UI = window.UI || {});


