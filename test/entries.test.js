/**
 * highscore
 * 
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const highscore = require('../'),
      Entries = highscore.Entries;

describe('Entries', function() {

  context('when constructed with no initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Entries();
    });

    it('lists no entries exist', function() {
      expect(subject.ids()).to.have.lengthOf(0);
    });
  });

  context('when constructed with initial data', function() {
    let subject;
    beforeEach(function() {
      subject = new Entries({
        'Alice': { apple: { first: 3, last: 3, min: 3, max: 3, sum: 3, count: 1 } },
        'Bob': { banana: { first: -2, last: -2, min: -2, max: -2, sum: -2, count: 1 } },
        'Carol': { cherry: { first: 5.5, last: 5.5, min: 5.5, max: 5.5, sum: 5.5, count: 1 } },
      });
    });

    it('lists which entries now exist', function() {
      expect(subject.ids()).to.have.all.members(['Alice', 'Bob', 'Carol']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('Alice.apple.last', 3);
      expect(subject).to.have.deep.property('Bob.banana.last', -2);
      expect(subject).to.have.deep.property('Carol.cherry.last', 5.5);
    });
  });

  context('when stats for several entries are recorded one time', function() {
    let subject;
    beforeEach(function() {
      subject = new Entries();
      subject.record('Alice', { apple: 3 });
      subject.record('Bob', { banana: -2 });
      subject.record('Carol', { cherry: 5.5 });
    });

    it('lists which entries now exist', function() {
      expect(subject.ids()).to.have.all.members(['Alice', 'Bob', 'Carol']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('Alice.apple.last', 3);
      expect(subject).to.have.deep.property('Bob.banana.last', -2);
      expect(subject).to.have.deep.property('Carol.cherry.last', 5.5);
    });
  });

  context('when stats for an entry are recorded multiple times', function() {
    let subject;
    beforeEach(function() {
      subject = new Entries();
      subject.record('Dave', { date: 12.3 });
      subject.record('Dave', { date: -34.5 });
      subject.record('Dave', { date: 56.7 });
    });

    it('lists which entries now exist', function() {
      expect(subject.ids()).to.have.all.members(['Dave']);
    });

    it('returns the values that were recorded', function() {
      expect(subject).to.have.deep.property('Dave.date.first', 12.3);
      expect(subject).to.have.deep.property('Dave.date.last', 56.7);
      expect(subject).to.have.deep.property('Dave.date.count', 3);
    });
  });

  describe('#query', function() {
    let fixture;
    beforeEach(function() {
      fixture = new Entries();
      // NOTE: The ordering is intentional.
      fixture.record('Carol', { apple: 4, banana: -3, cherry: 7.7 });
      fixture.record('Alice', { apple: 3, banana: -2, cherry: 5.5 });
      fixture.record('Bob', { apple: 2, banana: -1 });
    });

    it('returns only the unique identifier if no stats are requested', function() {
      let subject = fixture.query();
      expect(subject).to.have.lengthOf(3);
      subject.forEach(row => expect(row).to.have.all.keys(['id']));
    });

    it('throws if the formatting is incorrect for requesting stats', function() {
      expect(() => fixture.query([':missing_name', 'missing_field:', 's p a c e s']))
        .to.throw(/invalid format for requesting stats/i);
    });

    it('throws if the formatting is incorrect for specifying ordering', function() {
      expect(() => fixture.query([], null, [':missing_name', 'missing_direction:', 's p a c e s']))
        .to.throw(/invalid format for specifying ordering/i);
    });

    it('returns all fields for stats requested if not qualified', function() {
      let subject = fixture.query(['apple', 'banana']);
      expect(subject).to.have.lengthOf(3);
      subject.forEach(row => {
        expect(row).to.have.all.keys(['apple', 'banana', 'id']);
        expect(row.apple).to.have.all.keys(['first', 'last', 'min', 'max', 'sum', 'count']);
        expect(row.banana).to.have.all.keys(['first', 'last', 'min', 'max', 'sum', 'count']);
      });
    });

    it('returns only the fields requested when qualified', function() {
      let subject = fixture.query(['apple:first,last', 'banana:min,max']);
      expect(subject).to.have.lengthOf(3);
      subject.forEach(row => {
        expect(row).to.have.all.keys(['apple', 'banana', 'id']);
        expect(row.apple).to.have.all.keys(['first', 'last']);
        expect(row.banana).to.have.all.keys(['min', 'max']);
      });
    });

    it('returns undefined for missing stats that are requested', function() {
      let subject = fixture.query(['cherry:count']);
      let bob = subject.filter(x => x.id === 'Bob')[0];
      expect(bob).to.have.all.keys(['cherry', 'id']);
      expect(bob.cherry.count).to.be.undefined;
    });

    it('invokes the projection callback when provided', function() {
      let callback = sinon.spy();
      let subject = fixture.query([], callback);
      expect(callback).to.have.been.called;
    });

    it('orders entries by ID when no ordering is provided', function() {
      let subject = fixture.query();
      let ids = subject.map(x => x.id);
      expect(ids).to.deep.equal(['Alice', 'Bob', 'Carol']);
    });

    it('orders entries by a single stat ascending', function() {
      let subject = fixture.query(['apple:sum'], null, ['apple.sum:ascending']);
      let values = subject.map(x => x.apple.sum);
      expect(values).to.deep.equal([2, 3, 4]);
    });

    it('orders entries by a single stat descending', function() {
      let subject = fixture.query(['banana:last'], null, ['banana.last:descending']);
      let values = subject.map(x => x.banana.last);
      expect(values).to.deep.equal([-1, -2, -3]);
    });

    it('orders entries by a projected value', function() {
      let projection = (x) => { return { something: x.cherry.max || -2.2 } };
      let subject = fixture.query(['cherry:max'], projection, ['something']);
      let values = subject.map(x => x.something);
      expect(values).to.deep.equal([-2.2, 5.5, 7.7]);
    });

    it('orders entries by a multiple stats', function() {
      fixture.record('Bob', { apple: -1 });
      let subject = fixture.query(['apple:sum,count'], null, ['apple.count', 'apple.sum']);
      let counts = subject.map(x => x.apple.count);
      expect(counts).to.deep.equal([1, 1, 2]);
      let values = subject.map(x => x.apple.sum);
      expect(values).to.deep.equal([3, 4, 1]);
    });
  });

});
