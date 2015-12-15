'use strict';

import createDuration from '../dist/duration';
import assert from 'assert';

describe('createDuration', () => {
  describe('#()', () => {
    it('should accept an ISO string', () => {
      assert.doesNotThrow(() => {
        createDuration('P1Y2M3D');
      });
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
      let date = new Date('2015-10-15T01:00:00.000Z');

      assert.equal(createDuration('PT1H').addTo(date).toISOString(), '2015-10-15T02:00:00.000Z');

      assert.equal(createDuration('P1W').addTo(new Date('2015-12-15T02:00:00.000Z')).toISOString(), '2015-12-22T02:00:00.000Z');
    });

    it('should add the duration to a date-like object', () => {
      let date = {
        toDate: () => {
          return new Date('2015-10-25T01:00:00.000Z');
        }
      };

      assert.equal(createDuration('PT1H').addTo(date).toISOString(), '2015-10-25T02:00:00.000Z');
    });
  });

  describe('#subtractFrom', () => {
    it('should subtract the duration from a date', () => {
      let date = new Date('2015-10-25T03:00:00.000Z');

      assert.equal(createDuration('PT1H').subtractFrom(date).toISOString(), '2015-10-25T02:00:00.000Z');

      assert.equal(createDuration('P2W').subtractFrom(new Date('2015-12-15T02:00:00.000Z')).toISOString(), '2015-12-01T02:00:00.000Z');
    });

    it('should subtract the duration from a date-like object', () => {
      let date = {
        toDate: () => {
          return new Date('2015-10-25T03:00:00.000Z');
        }
      };

      assert.equal(createDuration('PT1H').subtractFrom(date).toISOString(), '2015-10-25T02:00:00.000Z');
    });
  });
});
