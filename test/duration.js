'use strict';

import createDuration from '../src/duration';
import assert from 'assert';

describe('createDuration', () => {
  describe('#()', () => {
    it('should accept an ISO string', () => {
      assert(typeof createDuration('P0D'), 'object');
      assert(typeof createDuration('PT0S'), 'object');
      assert(typeof createDuration('P1DT2H'), 'object');
    });

    it('should detect invalid input', () => {
      assert.throws(() => { createDuration(); });
      assert.throws(() => { createDuration(''); });
      assert.throws(() => { createDuration(undefined); });
      assert.throws(() => { createDuration(null); });
      assert.throws(() => { createDuration('abc'); });
      assert.throws(() => { createDuration('P'); });
      assert.throws(() => { createDuration('P0'); });
      assert.throws(() => { createDuration('P00'); });
    });
  });

  describe('#toString', () => {
    it('should return the passed ISO string', () => {
      assert.equal(createDuration('P1DT1M').toString(), 'P1DT1M');
      assert.equal(createDuration('P1W').toString(), 'P1W');
    });
  });

  describe('#addTo', () => {
    it('should add the duration to a date', () => {
      assert.equal(
        createDuration('PT1H')
          .addTo(new Date('2015-10-15T01:00:00.000Z'))
          .toISOString(),
        '2015-10-15T02:00:00.000Z'
      );

      assert.equal(
        createDuration('P1W')
          .addTo(new Date('2015-12-15T02:00:00.000Z'))
          .toISOString(),
        '2015-12-22T02:00:00.000Z'
      );
    });

    it('should not affect underlying units', () => {
      assert.deepEqual(
        createDuration('P1D')
          .addTo(new Date(Date.UTC(2016, 8, 1, 0, 0, 0))),
        new Date(Date.UTC(2016, 8, 2, 0, 0, 0))
      );
    });

    it('should work across timezones', () => {
      // jumps across timezones are handled differently for date and time elements
      // see https://en.wikipedia.org/wiki/ISO_8601#Durations

      // jump across timezone with time element
      assert.deepEqual(
        createDuration('PT744H') // ~ 31 days
          .addTo(new Date('Sun Oct 15 2016 12:00:00 GMT+0200 (CEST)')).toString(),
        new Date('Mon Nov 15 2016 11:00:00 GMT+0100 (CET)').toString()
      );

      // jump across timezone with date element
      assert.deepEqual(
        createDuration('P31D')
          .addTo(new Date('Sun Oct 15 2016 12:00:00 GMT+0200 (CEST)')).toString(),
        new Date('Mon Nov 15 2016 12:00:00 GMT+0100 (CET)').toString()
      );
    });

    it('should add the duration to a date-like object', () => {
      const date = {
        toDate: () => {
          return new Date('2015-10-25T01:00:00.000Z');
        }
      };

      assert.equal(createDuration('PT1H').addTo(date).toISOString(), '2015-10-25T02:00:00.000Z');
    });
  });

  describe('#subtractFrom', () => {
    it('should subtract the duration from a date', () => {
      assert.equal(
        createDuration('PT1H')
          .subtractFrom(new Date('2015-10-25T03:00:00.000Z'))
          .toISOString(),
        '2015-10-25T02:00:00.000Z'
      );

      assert.equal(
        createDuration('P2W')
          .subtractFrom(new Date('2015-12-15T02:00:00.000Z'))
          .toISOString(),
        '2015-12-01T02:00:00.000Z'
      );
    });

    it('should not affect underlying units', () => {
      assert.deepEqual(
        createDuration('P1D')
          .subtractFrom(new Date(Date.UTC(2016, 8, 2, 0, 0, 0))),
        new Date(Date.UTC(2016, 8, 1, 0, 0, 0))
      );
    });

    it('should work across timezones', () => {
      // jumps across timezones are handled differently for date and time elements
      // see https://en.wikipedia.org/wiki/ISO_8601#Durations

      // jump across timezone with time element
      assert.deepEqual(
        createDuration('PT744H') // ~ 31 days
          .subtractFrom(new Date('Mon Nov 15 2016 12:00:00 GMT+0100 (CET)')).toString(),
        new Date('Sun Oct 15 2016 13:00:00 GMT+0200 (CEST)').toString()
      );

      // jump across timezone with date element
      assert.deepEqual(
        createDuration('P31D')
          .subtractFrom(new Date('Mon Nov 15 2016 12:00:00 GMT+0100 (CET)')).toString(),
        new Date('Sun Oct 15 2016 12:00:00 GMT+0200 (CEST)').toString()
      );
    });

    it('should subtract the duration from a date-like object', () => {
      const date = {
        toDate: () => {
          return new Date('2015-10-25T03:00:00.000Z');
        }
      };

      assert.equal(createDuration('PT1H').subtractFrom(date).toISOString(), '2015-10-25T02:00:00.000Z');
    });
  });
});
