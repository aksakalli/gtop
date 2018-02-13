var utils = {}


utils.humanFileSize = function (bytes, isDecimal) {
  isDecimal = (typeof isDecimal !== 'undefined') ? isDecimal : false;
  if (bytes == 0) {
    return "0.00 B";
  }
  var base = isDecimal ? 1000 : 1024;
  var e = Math.floor(Math.log(bytes) / Math.log(base));
  return (bytes / Math.pow(base, e)).toFixed(2) + ' ' + ' KMGTP'.charAt(e) + (isDecimal || e == 0 ? '' : 'i') + 'B';
}

utils.toBytes = function (value, unit) {
  return parseInt(value) * Math.pow(unit[1] !== 'i' ? 1000 : 1024, ' KMGTP'.indexOf(unit[0]))
}

utils.getNvidiaSmiCommand = function (options) {
  return 'nvidia-smi --format=csv,noheader --query-gpu=' + options.join(',')
}

utils.colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];

module.exports = utils;
