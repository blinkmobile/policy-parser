'use strict';

function Policy() {
  this.statements = [];
}

/**
 * @param {...Statement} statement to insert into this policy
 * @returns {Number} the new number of statements contained within this policy
 */
Policy.prototype.push = function push() {
  return this.statements.push.apply(this.statements, arguments);
};

module.exports = Policy;
