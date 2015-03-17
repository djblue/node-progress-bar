var util = require('./util');

// a progress bar
//   total - the total number counting up to
function progress (total, opts) {
  var t = util.timer();
  var p = 0;
  var b = util.bar('#', '-');
  var format = 'uploading :pad :size :rate :time :bar :percent';
  return {
    update: function (bytes) {
      p += bytes;
      this.flush();
    },
    flush: function () {
      var cols = process.stdout.columns - 1;
      process.stderr.clearLine();
      process.stderr.cursorTo(0);
      process.stderr.write(this.render(cols));
    },
    done: function () {
      return p >= total;
    },
    rawSize: function () {
      return p;
    },
    size: function () {
      return util.pretty(p);
    },
    rawPercent: function () {
      return p / total;
    },
    percent: function () {
      var f = util.fixed(' ', 6);
      return f((this.rawPercent() * 100).toFixed(1) + '%');
    },
    time: function () {
      var tick = t();
      var secs = tick % 60;
      var mins = Math.floor(tick / 60) % 60;
      var hrs = Math.floor(tick / 3600);
      return util.pad(hrs, 2) + ':' + util.pad(mins, 2) + ':' + util.pad(secs, 2);
    },
    bar: function () {
      return b(24, this.rawPercent());
    },
    rawRate: function () {
      return p / t();
    },
    rate: function () {
      var f = util.fixed(' ', 10);
      return f(util.pretty(this.rawRate()) + '/s');
    },
    // w - width of output (default to 79)
    // why 79? because most terminals default to 80 chars, and 79 is 1
    // less to keep any clearLine functions working.
    render: function (w) {

      if (w === undefined) {
        w = 79;
      }

      var pad = [];
      var s = format.split(' ');

      for (var i = 0; i < s.length; i++) {
        if (s[i][0] === ':') {
          var func = s[i].slice(1);
          if (func === 'pad') {
            pad.push(i);
            s[i] = '';
          } else {
            s[i] = this[func]();
          }
        }
      }

      // apply padding until the width w is reached, can only occur if
      // :pad tag is in format string, otherwise skipped.
      var j = 0;
      if (pad.length > 0) {
        while (s.join(' ').length < w) {
          s[pad[j]] += ' ';
          // apply padding to each :pad tag evenly
          j = (j + 1) % pad.length;
        }
      }

      return s.join(' ');
    }
  };
}

module.exports = progress;
