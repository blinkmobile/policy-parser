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

### Statement#test(action, resource)

- @param {String} action /^[a-z]+:\w+$/
- @param {String|BRN} resource that is the target of action
- @returns {Boolean} true if this statement allows action upon target


## Schema

[Here](schema-v1.json) is a [JSON Schema](http://json-schema.org/) definition.


## Development and Testing

```shell
npm test
```
