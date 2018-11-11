'use strict';

const clone = value => {
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }

  return new Date(+value);
};

const dateParser = /P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?/;

const timeParser = /T(\d+H)?(\d+M)?(\d+S)?/;

const methods = {
  Y: 'FullYear',
  M: 'Month',
  W: 'Date',
  D: 'Date',
  T: {
    H: 'UTCHours',
    M: 'UTCMinutes',
    S: 'UTCSeconds'
  }
};

const parseIso = (parser, iso) =>
  (iso.match(parser) || [undefined])
    .slice(1)
    .filter(part => /^[0-9]+[A-Z]$/i.test(part))
    .map(part => ({ [part[part.length - 1]]: parseInt(part.slice(0, -1), 10) }));

const applyParts = (date, parts, methods, operator) => {
  Object.keys(parts).forEach(key => {
    if (key === 'T') {
      date = applyParts(date, parts.T, methods.T, operator);
    } else {
      date[`set${methods[key]}`](operator(date[`get${methods[key]}`](), (key !== 'W' ? parts[key] : parts[key] * 7)));
    }
  });

  return date;
};

const joinParts = (parts, range) =>
  Object.keys(parts || {})
    .filter(key => range.indexOf(key) >= 0)
    .map(key => `${parts[key]}${key}`)
    .join('');

const mergeParts = (left, right, operator) =>
  [...new Set(Object.keys(left).concat(Object.keys(right)))].reduce((result, key) => {
    if (key === 'T') {
      result[key] = mergeParts(left[key], right[key], operator);
    } else {
      result[key] = Math.abs(operator(left[key] || 0, right[key] || 0));
    }

    return result;
  }, {});

export default function createDuration (iso) {
  if (!iso) {
    throw new Error(`Invalid duration: no input`);
  }

  let parts = {};

  if (typeof iso === 'string') {
    parts = Object.assign(
      {},
      ...parseIso(dateParser, iso)
    );

    const timeParts = parseIso(timeParser, iso);

    if (timeParts.length > 0) {
      Object.assign(parts, { T: Object.assign({}, ...timeParts) });
    }

    if (Object.keys(parts) <= 0) {
      throw new Error(`Invalid duration: invalid ISO format (${iso})`);
    }
  } else if ('P' in iso) {
    parts = Object.assign({}, iso.P);
  } else {
    throw new Error(`Invalid duration: invalid input (${iso})`);
  }

  return Object.freeze(Object.assign(
    { P: parts },
    {
      toString: () =>
        `P${joinParts(parts, ['Y', 'M', 'W', 'D'])}${parts.T ? `T${joinParts(parts.T, ['H', 'M', 'S'])}` : ''}`,
      addTo: date => applyParts(clone(date), parts, methods, (left, right) => left + right),
      subtractFrom: date => applyParts(clone(date), parts, methods, (left, right) => left - right),
      add: duration => createDuration({ P: mergeParts(parts, duration.P, (left, right) => left + right) })
    }
  ));
}
