'use strict';

// 3rd-party modules

var test = require('tape');
var request = require('request');
var ZSchema = require('z-schema');

// our modules

var schema = require('../schema-v1');

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

// this module

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
