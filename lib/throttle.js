/**
 * Creates a throttled version of a function that limits how often it can be called
 * @param {Function} func - The function to throttle
 * @param {number} delay - The minimum delay between function calls in milliseconds
 * @returns {Function} The throttled function
 */
function throttle(func, delay) {
  let lastCall = 0;
  let timeout = null;
  let lastArgs = null;
  let lastThis = null;

  const throttled = function() {
    lastArgs = arguments;
    lastThis = this;
    
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      // Enough time has passed, execute immediately
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func.apply(lastThis, lastArgs);
    } else if (!timeout) {
      // Schedule execution for the remaining time
      timeout = setTimeout(function() {
        lastCall = Date.now();
        timeout = null;
        func.apply(lastThis, lastArgs);
      }, remaining);
    }
  };

  throttled.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastCall = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}

module.exports = throttle;