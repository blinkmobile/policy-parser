'use strict';

// our modules

var Policy = require('./src/policy');
var Statement = require('./src/statement');

// this module

/**
 * @param {String} input JSON string to deserialise into a Policy
 * @returns {Policy} the result
 * @throws Error if input JSON string is malformed
 */
module.exports = function parse(input) {
  var obj;
  var policy;
  if (input && typeof input === 'string') {
    obj = JSON.parse(input);
  } else {
    obj = input;
  }
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('expected input JSON to define an Object');
  }
  policy = new Policy();
  if (Array.isArray(obj.statements) && obj.statements.length) {
    policy.push.apply(policy, obj.statements.map(function (s) {
      return new Statement(s);
    }));
  }
  return policy;
};

module.exports.Policy = Policy;
module.exports.Statement = Statement;
