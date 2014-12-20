# policy-parser

convenience methods for working with Policy statements


## Usage

```javascript
var parse = require('policy-parser');
parse('{ ... }'); // returns a Policy object
parse.Policy; // the Policy constructor
parse.Statement; // the Statement constructor
```


## API

### Policy#push()

- @param {...Statement}

This just like `Array#push()`, and is a convenience method for adding one or
more Statement objects to a Policy object.

### Policy#authorises(action, resource)

- @param {String} action /^[a-z]+:\w+$/
- @param {String|BRN} resource the resource that is the target of action
- @returns {Boolean} true if statements permit action upon target

If the action-resource pair matches a "deny" statement, then the action is not
permitted, even when it simultaneously matches an "allow" statement.

At least one matching "allow" statement and the absence of any matching "deny"
statements results in authorisation, otherwise the action is not permitted.

### Statement#test(action, resource)

- @param {String} action /^[a-z]+:\w+$/
- @param {String|BRN} resource that is the target of action
- @returns {Boolean} true if this statement matches action and target

If a Statement matches, then you should check its `effect` property to see
whether to "allow" or "deny" the action.


## Schema

[Here](schema-v1.json) is a [JSON Schema](http://json-schema.org/) definition.


## Development and Testing

```shell
npm test
```
