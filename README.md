date-duration [![ci](https://github.com/smhg/date-duration/actions/workflows/node.js.yml/badge.svg)](https://github.com/smhg/date-duration/actions/workflows/node.js.yml)
======
Manipulate Date objects with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations)-formatted durations.

## Installation
```shell
$ npm install date-duration
```

## Usage
```javascript
import Duration from 'date-duration';

let duration = Duration('PT1H');
// or
let duration = Duration({P: {T: {H: 1}}});
```
**Note:** keep in mind that working with time-only durations (hours, minutes, seconds) is _generally_ a better idea.

A duration of `PT36H` is not the same as `P1DT12H`. The former will add/subtract _exactly_ 36 hours while the latter will add 12 hours + whatever 1 day means. e.g. if jumping across DST (Daylight saving time) and the difference is 1 hour, this totals to plus/minus 35 hours or 37 hours.

This is generally what you want as long as you take into account this happens _within the context of the timezone of your environment_. **This can become tricky when used in browsers** (where you don't have control over this).

## API
### Duration(ISOString)
Pass a string in ISO 8601 duration format to create a duration.

### duration.addTo(Date)
Add the duration to a Date object and returns the new date. Objects with a `.toDate()` (like [Moment.js](http://momentjs.com/)) method are converted to a regular Date object.

### duration.subtractFrom(Date)
Subtract the duration from a Date object and returns the new date. Objects with a `.toDate()` method are converted to a regular Date object.

### duration.add(Duration)
Add durations together returning a new duration which is the sum of both.

### duration.multiply(number)
Multiply individual parts of duration returning a new duration as the result.

### duration.toString()
Convert a duration to a string in ISO 8601 format.
