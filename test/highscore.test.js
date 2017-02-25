/**
 * highscore
 * 
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const highscore = require('../');

describe('highscore', function() {
  it('has a version', function() {
    expect(highscore.version).to.exist;
  });
});
