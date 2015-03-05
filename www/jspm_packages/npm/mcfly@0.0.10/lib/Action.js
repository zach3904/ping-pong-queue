/* */ 
'use strict';
var Dispatcher = require("./Dispatcher");
var Promise = require("es6-promise").Promise;
function reThrow(reject, error) {
  setTimeout(function() {
    if (error && error.stack) {
      console.error(error.stack);
    }
    throw error;
  }, 0);
  return reject();
}
function Action(callback) {
  this.callback = callback;
}
Action.prototype.dispatch = function() {
  return Promise.resolve(this.callback.apply(this, arguments)).then(function(payload) {
    return new Promise(function(resolve, reject) {
      if (!payload)
        return reject();
      if (!payload.actionType)
        return reThrow(reject, "Payload object requires an actionType property");
      try {
        Dispatcher.dispatch(payload);
      } catch (error) {
        reThrow(reject, error);
      }
      resolve();
    });
  });
};
module.exports = Action;
