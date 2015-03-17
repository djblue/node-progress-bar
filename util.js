var prettybytes = require('pretty-bytes');

function pretty (bytes) {
  // remove white space
  return prettybytes(bytes).replace(' ', '');
}

exports.pretty = pretty;

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

function fixed (fill, width) {
  var pad = repeat(fill)(width);
  return function (str) {
    if (str.length > width) {
      throw Error('str has more chars than ' + width);
    } else {
      return pad.concat(str).slice(-1*width);
    }
  };
}

exports.fixed = fixed;

// return function to render a progress bar
//   donechar - character for completed progress
//   notdonechar - character for not completed progress
function bar (donechar, notdonechar) {

  donechar = repeat((donechar === undefined)? '#' : donechar);
  notdonechar = repeat((notdonechar === undefined)? '-' : notdonechar);

  // render the progress bar
  //   width - number of characters to return.
  //   percent - percent complete.
  return function (width, percent) {
    width -= 2; // for bracket boarders
    var done = Math.floor(width * percent);
    var notdone = width - done;

    return (
      '[' +
         donechar(done) +
         notdonechar(notdone) +
      ']'
    );
  };

}

exports.bar = bar;
