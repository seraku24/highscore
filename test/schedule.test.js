/**
 * highscore
 *
 * @author Aaron Hill (https://github.com/seraku24)
 * @license MIT
 */

'use strict';

const highscore = require('../'),
      Schedule = highscore.Schedule;

describe('Schedule', function() {

  it('has a default reference year', function() {
    expect(Schedule.referenceYear).to.exist;
  });

  context('when using the daily schedule relative to 2010', function() {
    beforeEach(function() {
      Schedule.referenceYear = 2010;
    });

    it('returns bucket 567 for July 22 2011', function() {
      expect(Schedule.daily.bucket(Date.UTC(2011, 6, 22))).to.equal(567);
    });
    it('returns bucket -678 for February 23, 2008', function() {
      expect(Schedule.daily.bucket(Date.UTC(2008, 1, 23))).to.equal(-678);
    });
    it('returns July 22 2011 for bucket 567', function() {
      expect(Schedule.daily.timestamp(567)).to.equal(Date.UTC(2011, 6, 22));
    });
    it('returns February 23, 2008 for bucket -678', function() {
      expect(Schedule.daily.timestamp(-678)).to.equal(Date.UTC(2008, 1, 23));
    });
  });

  context('when using the weekly schedule relative to 1990', function() {
    beforeEach(function() {
      Schedule.referenceYear = 1990;
    });

    it('returns bucket 468 for December 21, 1998', function() {
      expect(Schedule.weekly.bucket(Date.UTC(1998, 11, 21))).to.equal(468);
    });
    it('returns bucket -357 for February 28, 1983', function() {
      expect(Schedule.weekly.bucket(Date.UTC(1983, 1, 28))).to.equal(-357);
    });
    it('returns December 21, 1998 for bucket 468', function() {
      expect(Schedule.weekly.timestamp(468)).to.equal(Date.UTC(1998, 11, 21));
    });
    it('returns February 28, 1983 for bucket -357', function() {
      expect(Schedule.weekly.timestamp(-357)).to.equal(Date.UTC(1983, 1, 28));
    });
  });

  context('when using the monthly schedule relative to 1970', function() {
    beforeEach(function() {
      Schedule.referenceYear = 1970;
    });

    it('returns bucket 147 for April 1, 1982', function() {
      expect(Schedule.monthly.bucket(Date.UTC(1982, 3, 1))).to.equal(147);
    });
    it('returns bucket -258 for July 1, 1948', function() {
      expect(Schedule.monthly.bucket(Date.UTC(1948, 6, 1))).to.equal(-258);
    });
    it('returns April 1, 1982 for bucket 147', function() {
      expect(Schedule.monthly.timestamp(147)).to.equal(Date.UTC(1982, 3, 1));
    });
    it('returns July 1, 1948 for bucket -258', function() {
      expect(Schedule.monthly.timestamp(-258)).to.equal(Date.UTC(1948, 6, 1));
    });
  });

  describe('.isLeapYear', function() {
    it('returns false for a non-leap year', function() {
      expect(Schedule.isLeapYear(2001)).to.be.false;
      expect(Schedule.isLeapYear(1900)).to.be.false;
    })
    it('returns true for a leap year', function() {
      expect(Schedule.isLeapYear(2000)).to.be.true;
      expect(Schedule.isLeapYear(2004)).to.be.true;
    })
  });

  describe('.dayOfYear', function() {
    it('returns 72 for PI day (March 14) on non-leap years', function() {
      expect(Schedule.dayOfYear(Date.UTC(1999, 2, 14))).to.equal(72);
    });
    it('returns 73 for PI day (March 14) on leap years', function() {
      expect(Schedule.dayOfYear(Date.UTC(2000, 2, 14))).to.equal(73);
    });
  });

  describe('.dayNumber', function() {
    it('returns 179 for TAU day (June 28) in 2000 relative to 2000', function() {
      expect(Schedule.dayNumber(Date.UTC(2000, 5, 28), 2000)).to.equal(179);
    });
    it('returns 544 for TAU day (June 28) in 2001 relative to 2000', function() {
      expect(Schedule.dayNumber(Date.UTC(2001, 5, 28), 2000)).to.equal(544);
    });
    it('returns -187 for TAU day (June 28) in 2000 relative to 2001', function() {
      expect(Schedule.dayNumber(Date.UTC(2000, 5, 28), 2001)).to.equal(-187);
    });
    it('returns 3831 for TAU day (June 28) in 2005 relative to 1995', function() {
      expect(Schedule.dayNumber(Date.UTC(2005, 5, 28), 1995)).to.equal(3831);
    });
    it('returns -3475 for TAU day (June 28) in 1995 relative to 2005', function() {
      expect(Schedule.dayNumber(Date.UTC(1995, 5, 28), 2005)).to.equal(-3475);
    });
  });

  describe('.weekNumber', function() {
    it('returns 2 for January 15, 2000 relative to 2000', function() {
      expect(Schedule.weekNumber(Date.UTC(2000, 0, 15), 2000)).to.equal(2);
    });
    it('returns 80 for July 14, 2001 relative to 2000', function() {
      expect(Schedule.weekNumber(Date.UTC(2001, 6, 14), 2000)).to.equal(80);
    });
    it('returns -90 for April 11, 1998 relative to 2000', function() {
      expect(Schedule.weekNumber(Date.UTC(1998, 3, 11), 2000)).to.equal(-90);
    });
  });

  describe('.monthNumber', function() {
    it('returns 4 for May 2000 relative to 2000', function() {
      expect(Schedule.monthNumber(Date.UTC(2000, 4, 1), 2000)).to.equal(4);
    });
    it('returns 19 for August 2001 relative to 2000', function() {
      expect(Schedule.monthNumber(Date.UTC(2001, 7, 1), 2000)).to.equal(19);
    });
    it('returns -2 for November in 2000 relative to 2001', function() {
      expect(Schedule.monthNumber(Date.UTC(2000, 10, 1), 2001)).to.equal(-2);
    });
  });

});
