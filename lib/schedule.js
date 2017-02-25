/**
 * highscore
 *
 * The Schedule object manages the reset schedule for a leaderboard,
 * dividing timestamps into logical buckets for grouping.
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

exports = module.exports = {};

/**
 * The reference year for scheduling.
 */
exports.referenceYear = 2017;

/**
 * Returns whether the specified year number is a leap year.
 *
 * @private
 * @param {number} year The year.
 * @return {boolean} True, if it is a leap year.
 */
exports.isLeapYear = function(year) {
  return (year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0);
}

/**
 * Returns the day number within a year (0-364).
 * For leap years, the range extends to (0-365).
 *
 * @private
 * @param {number} timestamp The timestamp.
 * @return {number} The day of the year.
 */
exports.dayOfYear = function(timestamp) {
  const daysBeforeMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let date = new Date(timestamp);
  let year = date.getUTCFullYear(), month = date.getUTCMonth(), day = date.getUTCDate();
  return (day - 1) + daysBeforeMonth[month] +
    ((exports.isLeapYear(year) && (month > 1 || day > 28)) ? 1 : 0);
}

/**
 * Returns the absolute day number relative to a specified year.
 *
 * @private
 * @param {number} timestamp The timestamp.
 * @param {number} referenceYear The reference year.
 * @return {number} The absolute day number.
 */
exports.dayNumber = function(timestamp, referenceYear) {
  let day = exports.dayOfYear(timestamp);
  let year = new Date(timestamp).getUTCFullYear();
  while (year != referenceYear) {
    day += (year > referenceYear)
      ? (exports.isLeapYear(--year) ? 366 : 365)
      : (exports.isLeapYear(year++) ? -366 : -365);
  }
  return day;
}

/**
 * Returns the absolute week number relative to a specified year.
 *
 * @private
 * @param {number} timestamp The timestamp.
 * @param {number} referenceYear The reference year.
 * @return {number} The absolute week number.
 */
exports.weekNumber = function(timestamp, referenceYear) {
  let day = exports.dayNumber(timestamp, referenceYear);
  return Math.floor(day / 7);
}

/**
 * Returns the absolute month number relative to a specified year.
 *
 * @private
 * @param {number} timestamp The timestamp.
 * @param {number} referenceYear The reference year.
 * @return {number} The absolute month number.
 */
exports.monthNumber = function(timestamp, referenceYear) {
  let date = new Date(timestamp);
  let year = date.getUTCFullYear(), month = date.getUTCMonth();
  return ((year - referenceYear) * 12) + month;
}

/**
 * The daily schedule.
 */
exports.daily = {
  /**
   * Returns the bucket number for the specified timestamp.
   *
   * @param {number} timestamp The timestamp.
   * @return {number} The bucket number.
   */
  bucket: function(timestamp) { return exports.dayNumber(timestamp, exports.referenceYear); },

  /**
   * Returns the initial timestamp for the specified bucket number.
   *
   * @param {number} bucket The bucket number.
   * @return {number} The timestamp.
   */
  timestamp: function(bucket) { return Date.UTC(exports.referenceYear, 0, 1 + bucket); }
};

/**
 * The weekly schedule.
 */
exports.weekly = {
  /**
   * Returns the bucket number for the specified timestamp.
   *
   * @param {number} timestamp The timestamp.
   * @return {number} The bucket number.
   */
  bucket: function(timestamp) { return exports.weekNumber(timestamp, exports.referenceYear); },

  /**
   * Returns the initial timestamp for the specified bucket number.
   *
   * @param {number} bucket The bucket number.
   * @return {number} The timestamp.
   */
  timestamp: function(bucket) { return Date.UTC(exports.referenceYear, 0, 1 + (7 * bucket)); }
};

/**
 * The monthly schedule.
 */
exports.monthly = {
  /**
   * Returns the bucket number for the specified timestamp.
   *
   * @param {number} timestamp The timestamp.
   * @return {number} The bucket number.
   */
  bucket: function(timestamp) { return exports.monthNumber(timestamp, exports.referenceYear); },

  /**
   * Returns the initial timestamp for the specified bucket number.
   *
   * @param {number} bucket The bucket number.
   * @return {number} The timestamp.
   */
  timestamp: function(bucket) { return Date.UTC(exports.referenceYear, bucket, 1); }
};
