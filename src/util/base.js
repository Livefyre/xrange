/**
 * @fileOverview Commonly used utility functions.
 */

/** @type {Object} */
var util = {};

/**
 * Abstract method. Throws an exception if it is not overridden.
 * @throws {Exception} If not overridden.
 */
util.abstractMethod = function () {
  throw 'This function must be overridden';
};

/**
 * Memoize a function. That is, only run the function once and cache the result
 * so that it doesn't have to keep calculating it.
 * @param {function()} fn The function to memoize.
 * @return {function()} The memoized function.
 */
util.memoize = function (fn) {
  return function() {
    var value = fn.call(this);
    fn = function () {
      return value;
    };
    return value;
  };
};

module.exports = util;
