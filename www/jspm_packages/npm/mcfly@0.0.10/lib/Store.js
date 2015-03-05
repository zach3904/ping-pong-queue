/* */ 
'use strict';
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var iv = require("invariant");
function Store(methods, callback) {
  var self = this;
  this.callback = callback;
  iv(!methods.callback, '"callback" is a reserved name and cannot be used as a method name.');
  iv(!methods.mixin, '"mixin" is a reserved name and cannot be used as a method name.');
  assign(this, EventEmitter.prototype, methods);
  this.mixin = {
    componentDidMount: function() {
      var warn = (console.warn || console.log).bind(console),
          changeFn;
      if (!this.storeDidChange) {
        warn("A component that uses a McFly Store mixin is not implementing storeDidChange. onChange will be called instead, but this will no longer be supported from version 1.0.");
      }
      changeFn = this.storeDidChange || this.onChange;
      if (!changeFn) {
        warn("A change handler is missing from a component with a McFly mixin. Notifications from Stores are not being handled.");
      }
      this.listener = function() {
        this.isMounted() && changeFn();
      }.bind(this);
      self.addChangeListener(this.listener);
    },
    componentWillUnmount: function() {
      this.listener && self.removeChangeListener(this.listener);
    }
  };
}
Store.prototype.getDispatchToken = function() {
  return this.dispatcherID;
};
Store.prototype.emitChange = function() {
  this.emit('change');
};
Store.prototype.addChangeListener = function(callback) {
  this.on('change', callback);
};
Store.prototype.removeChangeListener = function(callback) {
  this.removeListener('change', callback);
};
module.exports = Store;
