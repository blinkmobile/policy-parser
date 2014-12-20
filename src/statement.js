'use strict';

// external modules

var BRN = require('brn');

// this module

/** @private @constant */
var ACTION = /^[a-z]+:\w+$/;

function Statement(input) {
  this.effect = input.effect === 'allow' ? 'allow' : 'deny';

  if (Array.isArray(input.actions)) {
    this.actions = input.actions.filter(function (a) {
      return typeof a === 'string' && ACTION.test(a);
    });
  } else {
    this.actions = [];
  }

  if (Array.isArray(input.resources)) {
    this.resources = input.resources.filter(function (r) {
      return BRN.isBRN(r);
    }).map(function (r) {
      return new BRN(r);
    });
  } else {
    this.resources = [];
  }
}

/**
 * @param {String} action /^[a-z]+:\w+$/
 * @param {String|BRN} brn the resource that is the target of action
 * @returns {Boolean} true if this statement allows action upon target
 */
Statement.prototype.test = function test(action, brn) {
  if (this.effect === 'deny') {
    return false;
  }
  if (this.actions.indexOf(action) === -1) {
    return false;
  }
  if (!brn instanceof BRN) {
    brn = new BRN(brn);
  }
  return this.resources.some(function (r) {
    return r.test(brn);
  });
};

module.exports = Statement;
