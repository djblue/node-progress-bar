var test = require("tape");
var util = require('./util');

test('util.repeat()', function (t) {
  var repeat = util.repeat('*');
  t.equal(repeat(3), '***', 'should reapeat 3 times');
  t.equal(repeat(5), '*****', 'should reapeat 5 times');
  t.end();
});

test('util.fixed()', function (t) {
  var fixed = util.fixed(' ', 3);
  t.equal(fixed(''), '   ', 'empty string');
  t.equal(fixed('*'), '  *', 'single char');
  t.equal(fixed('***'), '***', 'full string');
  t.throws(function () {
    return fixed('****');
  }, /str has more chars than \d+/, 'too full string');
  t.end();
});

test('util.pad()', function (t) {
  var pad = util.pad;
  t.equal(pad(0,  2), '00');
  t.equal(pad(1,  2), '01');
  t.equal(pad(10, 2), '10');
  t.throws(function () {
    pad(100, 2);
  }, /\d+ has more digits than \d+/, '10');
  t.end();
});

test('util.bar()', function (t) {
  var bar = util.bar('#', '-');
  t.equal(bar(10, 0.25), '[##------]', 'should render 25%');
  t.equal(bar(10, 0.50), '[####----]', 'should render 50%');
  t.equal(bar(10, 0.75), '[######--]', 'should render 75%');
  t.equal(bar(10, 1.00), '[########]', 'should render 100%');
  t.end();
});

test('util.timer()', function (t) {
  var timer = util.timer();
  setTimeout(function () {
    t.equal(timer() > 0, true, 'timer should round to 0');
  }, 100);
  setTimeout(function () {
    t.equal(timer() > 1, true, 'timer should round to 1');
    t.end();
  }, 1000);
});

