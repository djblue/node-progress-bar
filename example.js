var p = require('./').progress(10000000);

var interval = setInterval(function () {
  if (p.done()) {
    clearInterval(interval);
    process.stderr.write('\n');
  } else {
    p.update(100000);
    process.stderr.clearLine();
    process.stderr.cursorTo(0);
    process.stderr.write(p.render());
  }
}, 100)
