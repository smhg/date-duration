'use strict';

import 'babel-polyfill';
import createDuration from '../src/duration';
import assert from 'assert';

describe('createDuration', () => {
  describe('#()', () => {
    it('should accept an ISO string', () => {
      assert.equal(createDuration('P0D').P.D, 0);
      assert.equal(createDuration('PT0S').P.T.S, 0);
      assert.equal(createDuration('P1DT2H').P.D, 1);
      assert.equal(createDuration('P1DT2H').P.T.H, 2);
    });

    it('should accept an object', () => {
      assert.equal(createDuration({P: {D: 1, T: {H: 2}}}).P.D, 1);
      assert.equal(createDuration({P: {D: 1, T: {H: 2}}}).P.T.H, 2);
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
    it('should return an ISO string', () => {
      assert.equal(createDuration('P1DT1M').toString(), 'P1DT1M');
      assert.equal(createDuration('PT2H1M').toString(), 'PT2H1M');
      assert.equal(createDuration('P1W').toString(), 'P1W');
      assert.equal(createDuration('P0DT0M').toString(), 'P0DT0M');
      assert.equal(createDuration({P: {D: 5, T: {H: 1}}}).toString(), 'P5DT1H');
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

  describe('#add', () => {
    it('should add durations together', () => {
      assert.equal(createDuration('P1D').add(createDuration('P1D')).P.D, 2);
      assert.equal(createDuration('PT1M').add(createDuration('PT1M')).P.T.M, 2);
      assert.equal(createDuration('P1D').add(createDuration('P0D')).P.D, 1);
      assert.deepEqual(createDuration('P1DT1M').add(createDuration('P2DT1M')).P, {D: 3, T: {M: 2}});
    });
  });
});
