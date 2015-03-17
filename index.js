// extra                    1817.0 KiB   981K/s 00:02 [######################] 100%

var prettyBytes = require('pretty-bytes');

function pretty (bytes) {
  // remove white space
  return prettyBytes(bytes).replace(' ', '');
}

// get a basic timer function, each proceeding call
// will get the difference in seconds
//   digits - number of decimal digits of precision
function timer () {
  var start = Date.now();
  return function () {
    return (Date.now() - start) / 1000;
  };
}

exports.timer = timer;

// repeat a string n times
//   str - string to repeat.
//   n - number of times to repeat str.
function repeat (str) {
  if (str === undefined) {
    throw new Error('please provide str');
  }
  return function (n) {
    var result = "";
    for (var i = 0; i < n; i++) {
      result += str;
    }
    return result;
  }
}

exports.repeat = repeat;

// pad a integer i with n zeros to the left
//   i - integer to pad
//   n - fixed width number of digits
function pad (i, n) {
  var a = repeat('0')(n);
  i = i.toFixed();
  if (a.length < i .length) {
    throw Error(i + ' has more digits than ' + n);
  }
  return a.concat(i).slice(-1*n);
}

exports.pad = pad;

// return function to render a progress bar
//   doneChar - character for completed progress
//   notDoneChar - character for not completed progress
function bar (doneChar, notDoneChar) {

  doneChar = repeat((doneChar === undefined)? '#' : doneChar);
  notDoneChar = repeat((notDoneChar === undefined)? '-' : notDoneChar);

  // render the progress bar
  //   width - number of characters to return.
  //   percent - percent complete.
  return function (width, percent) {
    width -= 2; // for bracket boarders
    var done = Math.floor(width * percent);
    var notDone = width - done;

    return (
      '[' +
         doneChar(done) +
         notDoneChar(notDone) +
      ']'
    );
  };

}

exports.bar = bar;

// a progress bar
//   total - the total number counting up to
function progress (total, opts) {
  var t = timer();
  var p = 0;
  var b = bar('#', '-');
  var format = 'uploading :pad :size :rate :time :bar :percent';
  return {
    update: function (bytes) {
      p += bytes;
    },
    done: function () {
      return p >= total;
    },
    rawSize: function () {
      return p;
    },
    size: function () {
      return pretty(p);
    },
    rawPercent: function () {
      return p / total;
    },
    percent: function () {
      return ('   ' + (this.rawPercent() * 100).toFixed(1) + '%').slice(-6);
    },
    time: function () {
      var tick = t();
      var secs = tick % 60;
      var mins = Math.floor(tick / 60) % 60;
      var hrs = Math.floor(tick / 3600);
      return pad(hrs, 2) + ':' + pad(mins, 2) + ':' + pad(secs, 2);
    },
    bar: function () {
      return b(24, this.rawPercent());
    },
    rawRate: function () {
      return p / t();
    },
    rate: function () {
      return pretty(this.rawRate()) + '/s';
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

exports.progress = progress;
