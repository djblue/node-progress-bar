# node-transfer-bar

Basic progress bar focused on downloads and uploads; inspired by pacman
(arch linux package manager) and
[progress](https://www.npmjs.com/package/progress). This module is more
specialized than progress, because it assumes your unit of progress is
always a byte.

# Usage

For basic usage, do:

```javascript
var bar = require('transfer-bar');

var b = bar(/* total bytes */);
something.on('data', function (data) {
  b.update(data.length);
});
```

# Test

To run all the tests, do:

    npm test
