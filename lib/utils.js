/**
 * Utility functions for gtop
 * @module utils
 */
var utils = {};

/**
 * Converts bytes to human-readable file size
 * @param {number} bytes - The number of bytes to convert
 * @param {boolean} [isDecimal=false] - Whether to use decimal (1000) or binary (1024) units
 * @returns {string} Human-readable file size (e.g., "1.50 KiB", "2.00 MB")
 * @example
 * utils.humanFileSize(1024) // "1.00 KiB"
 * utils.humanFileSize(1000, true) // "1.00 KB"
 */
utils.humanFileSize = function(bytes, isDecimal) {
  isDecimal = typeof isDecimal !== 'undefined' ? isDecimal : false;
  if (!bytes || bytes == 0 || typeof bytes !== 'number' || bytes < 0) {
    return '0.00 B';
  }
  var base = isDecimal ? 1000 : 1024;
  var e = Math.floor(Math.log(bytes) / Math.log(base));
  e = Math.max(0, Math.min(e, 4)); // Clamp to valid range for ' KMGTP'
  return (
    (bytes / Math.pow(base, e)).toFixed(2) +
    ' ' +
    ' KMGTP'.charAt(e) +
    (isDecimal || e == 0 ? '' : 'i') +
    'B'
  );
};

/**
 * Available colors for charts and visualizations
 * @type {string[]}
 */
utils.colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];

module.exports = utils;
