/**
 * highscore
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

exports = module.exports = {};

exports.Stat = require('./stat');
exports.Entry = require('./entry');
exports.Entries = require('./entries');
exports.Schedule = require('./schedule');

exports.version = require('../package.json').version;
