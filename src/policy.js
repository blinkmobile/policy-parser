'use strict';

function Policy() {
  this.statements = [];
  this.actions = {};
}

/**
 * @param {...Statement} statement to insert into this policy
 * @returns {Number} the new number of statements contained within this policy
 */
Policy.prototype.push = function push() {
  var me = this;
  var i, iLength = arguments.length;
  var a, aLength;
  var statement;
  var action;
  for (i = 0; i < iLength; i++) {
    statement = arguments[i];
    aLength = statement.actions.length;
    for (a = 0; a < aLength; a++) {
      action = statement.actions[a];
      me.actions[action] = me.actions[action] || [];
      if (statement.effect === 'allow') {
        me.actions[action].push(statement);
      } else {
        me.actions[action].unshift(statement);
      }
    }
  }
  return this.statements.push.apply(this.statements, arguments);
};

/**
 * @param {String} action /^[a-z]+:\w+$/
 * @param {String|BRN} brn the resource that is the target of action
 * @returns {Boolean} true if statements allow action upon target
 */
Policy.prototype.authorises = function authorises(action, brn) {
  var statements = this.actions[action];
  var statement;
  var s, sLength;
  if (!Array.isArray(statements) || !statements.length) {
    return false;
  }
  sLength = statements.length;
  for (s = 0; s < sLength; s++) {
    statement = statements[s];
    if (statement.test(action, brn)) {
      if (statement.effect === 'deny') {
        return false;
      }
      return true;
    }
  }
  return false;
};

module.exports = Policy;
