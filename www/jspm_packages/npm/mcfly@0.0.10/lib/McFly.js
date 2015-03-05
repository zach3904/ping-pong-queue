/* */ 
'use strict';
var Dispatcher = require("./Dispatcher");
var Store = require("./Store");
var ActionsFactory = require("./ActionsFactory");
var assign = require("object-assign");
function McFly() {
  this.actions = {};
  this.stores = [];
  this.dispatcher = Dispatcher;
}
McFly.prototype.createStore = function(methods, callback) {
  var store = new Store(methods, callback);
  store.dispatcherID = this.dispatcher.register(store.callback);
  this.stores.push(store);
  return store;
};
McFly.prototype.createActions = function(actions) {
  var actionFactory = new ActionsFactory(actions);
  assign(this.actions, actionFactory);
  return actionFactory;
};
module.exports = McFly;
