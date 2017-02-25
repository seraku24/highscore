var highscore = require('../');

describe('highscore', function() {
  it('has a version', function() {
    expect(highscore.version).to.exist;
  });
});
