var utils = {}


utils.humanFileSize = function(bytes) {
  if (bytes == 0) {
    return "0.00 B";
  }
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + ' KMGTP'.charAt(e) + 'B';
}

utils.colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];

module.exports = utils;
