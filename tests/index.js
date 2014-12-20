'use strict';

// 3rd-party modules

var test = require('tape');
var request = require('request');
var ZSchema = require('z-schema');

// our modules

var parse = require('../');
var Policy = require('../src/policy');
var schema = require('../schema-v1');
var Statement = require('../src/statement');

// this module

var example = {
  statements: [
    {
      effect: 'allow',
      actions: ['domain:CreateType'],
      resources: ['brn:domain:type::*']
    },
    {
      effect: 'deny',
      actions: ['domain:DeleteType'],
      resources: ['brn:domain:type::*']
    }
  ]
};

test('downloading JSON Schema schema', function (t) {
  var schemaUrl = 'http://json-schema.org/draft-04/schema';
  request(schemaUrl, function (error, response, body) {
    var validator = new ZSchema();

    t.error(error);

    validator.setRemoteReference(schemaUrl, JSON.parse(body));

    t.test('example passes Policy schema', function (t) {
      t.ok(validator.validate(example, schema), 'example is valid');
      t.notOk(validator.getLastErrors(), 'no validation errors');
      t.end();
    });

    t.test('empty Object fails Policy schema', function (t) {
      t.notOk(validator.validate({}, schema), 'Object is invalid');
      t.ok(validator.getLastErrors(), 'validation errors');
      t.end();
    });

    t.end();
  });
});

test('parser(example)', function (t) {
  var policy = parse(example);
  t.ok(policy instanceof Policy, 'Policy instance created');
  t.ok(Array.isArray(policy.statements), 'policy has statements Array');
  t.equal(policy.statements.length, 2, 'policy has 2 statements');
  t.ok(policy.statements.every(function (s) {
    return s instanceof Statement;
  }), 'statements are Statement instances');
  t.end();
});

require('./statement');
