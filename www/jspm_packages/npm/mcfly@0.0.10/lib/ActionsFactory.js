/* */ 
'use strict';
var Action = require("./Action");
var assign = require("object-assign");
function ActionsFactory(actions) {
  var $ActionsFactory_actions = {},
      a,
      action;
  for (a in actions) {
    if (actions.hasOwnProperty(a)) {
      action = new Action(actions[a]);
      $ActionsFactory_actions[a] = action.dispatch.bind(action);
    }
  }
  assign(this, $ActionsFactory_actions);
}
module.exports = ActionsFactory;
