/**
 * highscore
 * 
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const highscore = require('../'),
      Stat = highscore.Stat;

describe('Stat', function() {

  context('when constructed with no initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Stat();
    });

    it('reports the value that was first set does not exist', function() {
      expect(subject).to.have.property('first').undefined;
    });

    it('reports the most recently set value does not exist', function() {
      expect(subject).to.have.property('last').undefined;
    });

    it('reports the minimum of all values set does not exist', function() {
      expect(subject).to.have.property('min').undefined;
    });

    it('reports the maximum of all values set does not exist', function() {
      expect(subject).to.have.property('max').undefined;
    });

    it('reports the sum of all values set does not exist', function() {
      expect(subject).to.have.property('sum').undefined;
    });

    it('reports the number of values set is zero', function() {
      expect(subject).to.have.property('count', 0);
    });
  });

  context('when constructed with initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Stat({ first: 2, last: 3, min: 1, max: 5, sum: 11, count: 4 });
    });

    it('reports the value that was first set', function() {
      expect(subject).to.have.property('first', 2);
    });

    it('reports the most recently set value', function() {
      expect(subject).to.have.property('last', 3);
    });

    it('reports the minimum of all values set', function() {
      expect(subject).to.have.property('min', 1);
    });

    it('reports the maximum of all values set', function() {
      expect(subject).to.have.property('max', 5);
    });

    it('reports the sum of all values set', function() {
      expect(subject).to.have.property('sum', 11);
    });

    it('reports the number of values set', function() {
      expect(subject).to.have.property('count', 4);
    });
  });

  context('when multiple values have been recorded', function() {
    let subject;
    beforeEach(function() {
      subject = new Stat();
      const values = [3.1, 4.1, 5.9, 2.6, 5.3];
      values.forEach(value => subject.record(value));
    });

    it('reports the value that was first set', function() {
      expect(subject).to.have.property('first', 3.1);
    });

    it('reports the most recently set value', function() {
      expect(subject).to.have.property('last', 5.3);
    });

    it('reports the minimum of all values set', function() {
      expect(subject).to.have.property('min', 2.6);
    });

    it('reports the maximum of all values set', function() {
      expect(subject).to.have.property('max', 5.9);
    });

    it('reports the sum of all values set', function() {
      expect(subject).to.have.property('sum', 21);
    });

    it('reports the number of values set', function() {
      expect(subject).to.have.property('count', 5);
    });
  });

  it('throws when non-numeric values are recorded', function() {
    let subject = new Stat();
    expect(() => subject.record('Huh?')).to.throw(/value must be a number/i);
  });

  it('accepts values that can be coerced to numeric values', function() {
    let subject = new Stat();
    [true, '1.2', [-3.4]].forEach(value => subject.record(value));
    expect(subject.count).to.equal(3);
  });

});
