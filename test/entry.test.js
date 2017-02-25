/**
 * highscore
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const highscore = require('../'),
      Entry = highscore.Entry;

describe('Entry', function() {

  context('when constructed with no initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry();
    });

    it('lists no stats were recorded', function() {
      expect(subject.names()).to.have.lengthOf(0);
    });
  });

  context('when constructed with initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry({
        apple: { first: 3, last: 3, min: 3, max: 3, sum: 3, count: 1 },
        banana: { first: -2, last: -2, min: -2, max: -2, sum: -2, count: 1 },
        cherry: { first: 5.5, last: 5.5, min: 5.5, max: 5.5, sum: 5.5, count: 1 },
      });
    });

    it('lists which stats were recorded', function() {
      expect(subject.names()).to.have.all.members(['apple', 'banana', 'cherry']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('apple.last', 3);
      expect(subject).to.have.deep.property('banana.last', -2);
      expect(subject).to.have.deep.property('cherry.last', 5.5);
    });
  });


  context('when one stat has been recorded once', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry();
      subject.record({ apple: 3 });
    });

    it('lists which stat was recorded', function() {
      expect(subject.names()).to.have.all.members(['apple']);
    });

    it('returns the value that was recorded', function() {
      expect(subject).to.have.deep.property('apple.last', 3);
    });
  });

  context('when one stat has been recorded multiple times', function() {
    let subject;
    beforeEach(function() {
      const values = [ 2, 5, 7 ];
      subject = new Entry();
      values.forEach(value => subject.record({ apple: value }));
    });

    it('lists which stat was recorded', function() {
      expect(subject.names()).to.have.all.members(['apple']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.property('apple');
      expect(subject.apple.first).to.equal(2);
      expect(subject.apple.last).to.equal(7);
      expect(subject.apple.count).to.equal(3);
    });
  });

  context('when multiple stats have been recorded individually', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry();
      subject.record({ apple: 3 });
      subject.record({ banana: -2 });
      subject.record({ cherry: 5.5 });
    });

    it('lists which stats were recorded', function() {
      expect(subject.names()).to.have.all.members(['apple', 'banana', 'cherry']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('apple.last', 3);
      expect(subject).to.have.deep.property('banana.last', -2);
      expect(subject).to.have.deep.property('cherry.last', 5.5);
    });
  });

  context('when multiple stats have been recorded together', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry();
      subject.record({ apple: 3, banana: -2, cherry: 5.5 });
    });

    it('lists which stats were recorded', function() {
      expect(subject.names()).to.have.all.members(['apple', 'banana', 'cherry']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('apple.last', 3);
      expect(subject).to.have.deep.property('banana.last', -2);
      expect(subject).to.have.deep.property('cherry.last', 5.5);
    });
  });

  context('when multiple stats have been recorded multiple times', function() {
    let subject;
    beforeEach(function() {
      subject = new Entry();
      subject.record({ apple: 1, cherry: 5.5 });
      subject.record({ apple: 2, cherry: 6.6 });
      subject.record({ banana: -9, cherry: 7.7 });
    });

    it('lists which stats were recorded', function() {
      expect(subject.names()).to.have.all.members(['apple', 'banana', 'cherry']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.property('apple');
      expect(subject.apple.first).to.equal(1);
      expect(subject.apple.last).to.equal(2);
      expect(subject.apple.count).to.equal(2);
      expect(subject).to.have.property('banana');
      expect(subject.banana.first).to.equal(-9);
      expect(subject.banana.last).to.equal(-9);
      expect(subject.banana.count).to.equal(1);
      expect(subject).to.have.property('cherry');
      expect(subject.cherry.first).to.equal(5.5);
      expect(subject.cherry.last).to.equal(7.7);
      expect(subject.cherry.count).to.equal(3);
    });
  });

});
