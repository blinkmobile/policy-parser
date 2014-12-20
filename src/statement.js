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
    });
  } else {
    this.resources = [];
  }
}

module.exports = Statement;
