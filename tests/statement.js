'use strict';

// 3rd-party modules

var test = require('tape');

// our modules

var Statement = require('../src/statement');

// this module

test('Statement(): "allow"; "auth:CreateToken"; "brn:auth:token::*"', function (t) {
  var s = new Statement({
    effect: 'allow',
    actions: ['auth:CreateToken'],
    resources: ['brn:auth:token::*']
  });
  t.ok(s.test('auth:CreateToken', 'brn:auth:token::123'), 'specific BRN passes');
  t.notOk(s.test('auth:DeleteToken', 'brn:auth:token::123'), 'different action fails');
  t.notOk(s.test('auth:CreateToken', 'brn:auth:user::123'), 'different BRN type fails');
  t.end();
});

test('Statement(): "deny"; "auth:CreateToken"; "brn:auth:token::*"', function (t) {
  var s = new Statement({
    effect: 'deny',
    actions: ['auth:CreateToken'],
    resources: ['brn:auth:token::*']
  });
  t.ok(s.test('auth:CreateToken', 'brn:auth:token::123'), 'specific BRN passes');
  t.notOk(s.test('auth:DeleteToken', 'brn:auth:token::123'), 'different action fails');
  t.notOk(s.test('auth:CreateToken', 'brn:auth:user::123'), 'different BRN type fails');
  t.end();
});

test('Statement(): "allow"; "auth:CreateToken", "auth:DeleteToken"; "brn:..."', function (t) {
  var s = new Statement({
    effect: 'allow',
    actions: ['auth:CreateToken', 'auth:DeleteToken'],
    resources: ['brn:auth:token::*']
  });
  t.ok(s.test('auth:CreateToken', 'brn:auth:token::123'), 'specific BRN passes');
  t.ok(s.test('auth:DeleteToken', 'brn:auth:token::123'), 'different action passes');
  t.notOk(s.test('auth:CreateToken', 'brn:auth:user::123'), 'different BRN type fails');
  t.end();
});
