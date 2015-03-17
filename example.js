var transfer = require('./');
var b = transfer(1000000);

var interval = setInterval(function () {
  if (b.done()) {
    clearInterval(interval);
  } else {
    b.update(10000);
  }
}, 10);
