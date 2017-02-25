/**
 * highscore
 * 
 * The Stat object is responsible for managing an individual statistic,
 * while providing the following aggregation values:
 *  - first: The first recorded value for the statistic.
 *  - last: The most recently recorded value for the statistic.
 *  - min: The minimum of all recorded values for the statistic.
 *  - max: The maximum of all recorded values for the statistic.
 *  - sum: The sum of all recorded values for the statistic.
 *  - count: The number of recorded values for the statistic.
 * 
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

module.exports = Stat;
var method = Stat.prototype;

/**
 * Constructs a Stat object, optionally initialized with the specified data.
 * 
 * @constructor
 * @this {Stat}
 * @param {Stat|Object} stat The data to initialize with.
 */
function Stat(stat) {
  this.first = stat && stat.first;
  this.last = stat && stat.last;
  this.min = stat && stat.min;
  this.max = stat && stat.max;
  this.sum = stat && stat.sum;
  this.count = (stat && stat.count) || 0;
}

/**
 * Records the specified value with this Stat object.
 * 
 * @this {Stat}
 * @param {number} value The value to record.
 * @return {Stat} The Stat object.
 */
method.record = function(value) {
  // Attempt to coerce input to a numeric type.
  value *= 1;
  if (isNaN(value)) throw new Error('Value must be a number.');

  // Update each aggregation field given the new value.
  this.first = this.first || value;
  this.last = value;
  this.min = Math.min(this.min || value, value);
  this.max = Math.max(this.max || value, value);
  this.sum = (this.sum || 0) + value;
  ++this.count;

  return this;
}
