/**
 * highscore
 *
 * The Entry object is responsible for managing a group of individual Stat objects,
 * each accessible by name.
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const Stat = require('./stat');

module.exports = Entry;
var method = Entry.prototype;

/**
 * Constructs an Entry object, optionally initialized with the specified data.
 *
 * @constructor
 * @this {Entry}
 * @param {Entry|Object} entry The data to initialize with.
 */
function Entry(entry) {
  Object.keys(entry || {}).forEach(key => this[key] = new Stat(entry[key]));
}

/**
 * Records the specified stats in this Entry object.
 *
 * @this {Entry}
 * @param {Object} stats The stats to record.
 * @return {Entry} The Entry object.
 */
method.record = function(stats) {
  Object.keys(stats).forEach(key => this.stat(key).record(stats[key]));

  return this;
}

/**
 * Returns the stat with the specified name.
 *
 * @private
 * @this {Entry}
 * @param {string} name The name of the stat.
 * @return {Stat} The stat.
 */
method.stat = function(name) {
  return this[name] = this[name] || new Stat();
}

/**
 * Returns the names of all stats recorded in this Entry object.
 *
 * @this {Entry}
 * @return {string[]} The names of the recorded stats.
 */
method.names = function() {
  return Object.keys(this);
}
