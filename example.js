var progress = require('./');
var p = progress(1000000);

var interval = setInterval(function () {
  if (p.done()) {
    clearInterval(interval);
  } else {
    p.update(10000);
  }
}, 100);
