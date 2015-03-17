var test = require("tape").test;
var index = require('./');

test('.repeat()', function (t) {
  var repeat = index.repeat('*');
  t.equal(repeat(3), '***', 'should reapeat 3 times');
  t.equal(repeat(5), '*****', 'should reapeat 5 times');
  t.end();
});

test('.fixed()', function (t) {
  var fixed = index.fixed(' ', 3);
  t.equal(fixed(''), '   ', 'empty string');
  t.equal(fixed('*'), '  *', 'single char');
  t.equal(fixed('***'), '***', 'full string');
  t.throws(function () {
    return fixed('****');
  }, /str has more chars than \d+/, 'too full string');
  t.end();
});

test('.pad()', function (t) {
  var pad = index.pad;
  t.equal(pad(0,  2), '00');
  t.equal(pad(1,  2), '01');
  t.equal(pad(10, 2), '10');
  t.throws(function () {
    pad(100, 2);
  }, /\d+ has more digits than \d+/, '10');
  t.end();
});

test('.bar()', function (t) {
  var bar = index.bar('#', '-');
  t.equal(bar(10, 0.25), '[##------]', 'should render 25%');
  t.equal(bar(10, 0.50), '[####----]', 'should render 50%');
  t.equal(bar(10, 0.75), '[######--]', 'should render 75%');
  t.equal(bar(10, 1.00), '[########]', 'should render 100%');
  t.end();
});

test('.timer()', function (t) {
  var timer = index.timer();
  setTimeout(function () {
    t.equal(timer() > 0, true, 'timer should round to 0');
  }, 100);
  setTimeout(function () {
    t.equal(timer() > 1, true, 'timer should round to 1');
    t.end();
  }, 1000);
});

test('.progress()', function (t) {
  var p = index.progress(1024);
  setTimeout(function () {
    p.update(512);
    t.equal(p.time(), '00:00:01', 'time');
  }, 1000);
  setTimeout(function () {
    p.update(512);
    t.equal(p.rawRate() < 768, true, 'rate after 1.5 sec');
    t.equal(p.rawPercent(), 1, 'should be complete');
    t.end();
  }, 1500);
});

test('.render()', function (t) {
  var p = index.progress(10000000);
  setTimeout(function () {
    p.update(1000000);
    console.log(p.render());
    t.end();
  }, 10)
});
