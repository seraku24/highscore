/**
 * highscore
 *
 * The Entries object is responsible for managing a group of individual Entry objects,
 * each accessible by a unique identifier.  Additionally, the Entries object provides
 * a query mechanism for retrieving results from the data set.
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const Entry = require('./entry');

module.exports = Entries;
var method = Entries.prototype;

/**
 * Constructs an Entries object, optionally initialized with the specified data.
 *
 * @constructor
 * @this {Entries}
 * @param {Entries|Object} entries The data to initialize with.
 */
function Entries(entries) {
  Object.keys(entries || {}).forEach(key => this[key] = new Entry(entries[key]));
}

/**
 * Records the specified stats for an entry associated with the specified
 * unique identifier.
 *
 * @this {Entries}
 * @param {string} id The unique identifier
 * @param {Object} stats The stats to record.
 * @return {Entries} The Entries object.
 */
method.record = function(id, stats) {
  this.entry(id).record(stats);
  return this;
}

/**
 * Returns the entry associated with the specified unique identifier.
 *
 * @private
 * @this {Entries}
 * @param {string} id The unique identifier of the entry.
 * @return {Entry} The entry.
 */
method.entry = function(id) {
  return this[id] = this[id] || new Entry();
}

/**
 * Returns the unique identifiers of all entries recorded in this Entries object.
 *
 * @this {Entries}
 * @return {string[]} The unique identifiers of the entries.
 */
method.ids = function() {
  return Object.keys(this);
}

/**
 * Performs a deep lookup on an object given the specified keys.
 *
 * @private
 * @param {Object} obj The object in which to look.
 * @param {string[]} keys The keys.
 * @return {Object} The result, or undefined.
 */
var deepLookup = function(obj, keys) {
  let current = obj, index = 0;
  while (typeof(current) !== 'undefined' && index < keys.length) {
    current = current[keys[index++]];
  }
  return current;
}

/**
 * Returns the comparison value for the given arguments.
 *
 * @private
 * @param {*} a The first thing to compare.
 * @param {*} b The second thing to compare.
 * @return {number} A value indicating the comparison.
 */
var compare = function(a, b) {
  return (a < b) ? -1 : (b < a) ? 1 : 0;
}

/**
 * This callback is used while querying to project requested stats into another form.
 *
 * @callback projectionCallback
 * @param {Object} input The requested stats.
 * @return {Object} The projected object.
 */

/**
 * Performs a query for the specified stats, optionally projecting the values,
 * and ordering the results.
 *
 * @this {Entries}
 * @param {string[]} stats The requested stats.
 * @param {projectionCallback} projection The projection to apply to the requested stats.
 * @param {string[]} ordering The stats to order the entries by.
 * @return {Object[]} The results of the query.
 */
method.query = function(stats, projection, ordering) {
  // Parse the format for requesting stats and fields.
  stats = (stats || []).map(stat => {
    let regex = /^\s*[^.,:\s]+(?:\s*:\s*[^.,:\s]+(?:\s*,\s*[^.,:\s]+)*)?\s*$/i
    if (!regex.test(stat)) throw new Error('Invalid format for requesting stats.')
    let split = stat.split(':');
    let name = split[0].trim();
    let fields = (split[1] || 'first,last,min,max,sum,count').split(',').map(x => x.trim());
    return { name: name, fields: fields };
  });

  // Parse the format for ordering results.
  ordering = (ordering || ['id']).map(order => {
    let regex = /^\s*[^.,:\s]+(?:\s*\.\s*[^.,:\s]+)*(?:\s*:\s*(?:a|de?)(?:sc(?:ending)?)?)?\s*$/i;
    if (!regex.test(order)) throw new Error('Invalid format for specifying ordering.')
    let split = order.split(':');
    let path = split[0].split('.').map(x => x.trim());
    let descending = /^\s*d/i.test(split[1] || '');

    // Construct the comparison function.
    return (a, b) => {
      let result = compare(deepLookup(a, path), deepLookup(b, path));
      return descending ? -result : result;
    };
  });

  // Process each entry in this object.
  var rows = [];
  this.ids().forEach(id => {
    let row = { id: id, };

    // Fetch the requested stats.
    let entry = this[id];
    stats.forEach(stat => {
      let _stat = entry[stat.name];
      row[stat.name] = {};
      stat.fields.forEach(field => row[stat.name][field] = _stat && _stat[field]);
    });

    // Perform projection.
    if (projection) { row = projection(row); }

    rows.push(row);
  });

  // Order the results.
  rows.sort((a, b) => {
    let result = 0, index = 0;
    while (result == 0 && index < ordering.length) {
      result = ordering[index++](a, b);
    }
    return result;
  });

  return rows;
}
