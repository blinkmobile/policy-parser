'use strict';

// 3rd-party modules

var test = require('tape');

// our modules

var Policy = require('../src/policy');
var Statement = require('../src/statement');

var defaultPolicy = require('./policy-default');
// var defaultPolicyJson = JSON.stringify(defaultPolicy);

// this module

test('Policy(): "auth:ReadToken" both denied and allowed', function (t) {
  var policy = new Policy();
  policy.push(new Statement({
    effect: 'allow',
    actions: ['auth:CreateToken', 'auth:ReadToken'],
    resources: ['brn:auth:token::*']
  }));
  policy.push(new Statement({
    effect: 'deny',
    actions: ['auth:CreateToken'],
    resources: ['brn:auth:token::*']
  }));

  policy.push(new Statement({
    effect: 'allow',
    actions: ['auth:CreateUser'],
    resources: ['brn:auth:user::*']
  }));

  t.notOk(policy.authorises('auth:CreateToken', 'brn:auth:token::123'), 'denied action fails');
  t.ok(policy.authorises('auth:ReadToken', 'brn:auth:token::123'), 'allowed action passes');
  t.notOk(policy.authorises('auth:DeleteToken', 'brn:auth:user::123'), 'unlisted action fails');
  t.end();
  t.ok(policy.authorises('auth:CreateUser', 'brn:auth:user::123'), 'allowed action passes');
});

test('policy.push({ /* ... */ }): properly instantiates Statements', function (t) {
  var policy = new Policy();
  policy.push.apply(policy, defaultPolicy.statements);
  policy.statements.forEach(function (stmt, index) {
    t.ok(stmt instanceof Statement, '[' + index + '] is a Statement');
  });
  t.end();
});

test('policy.push({ /* ... */ }): "deny" persists regardless of order', function (t) {
  var policy = new Policy();
  policy.push.apply(policy, defaultPolicy.statements);
  t.notOk(policy.authorises('policy:LinkUser', 'brn:policy:users::*'));
  // add an "allow" that matches a previous "deny"
  policy.push({
    'effect': 'allow',
    'actions': [
      'policy:LinkUser'
    ],
    'resources': [
      'brn:policy:users::*'
    ]
  });
  t.notOk(policy.authorises('policy:LinkUser', 'brn:policy:users::*'));
  t.end();
});

test('policy-default.json: permissions are as expected', function (t) {
  var policy = new Policy();
  policy.push.apply(policy, defaultPolicy.statements);

  ['*', '123'].forEach(function (id) {
    var brn;

    brn = 'brn:policy:policies::' + id;
    t.notOk(policy.authorises('policy:CreatePolicy', brn), brn);
    t.notOk(policy.authorises('policy:ReadPolicy', brn), brn);
    t.notOk(policy.authorises('policy:UpdatePolicy', brn), brn);
    t.notOk(policy.authorises('policy:DeletePolicy', brn), brn);
    t.notOk(policy.authorises('policy:LinkPolicy', brn), brn);

    brn = 'brn:policy:tokens::' + id;
    t.ok(policy.authorises('policy:CreateToken', brn), brn);
    t.notOk(policy.authorises('policy:LinkToken', brn), brn);

    brn = 'brn:policy:users::' + id;
    t.ok(policy.authorises('policy:CreateUser', brn), brn);
    t.notOk(policy.authorises('policy:LinkUser', brn), brn);
  });

  t.end();
});
