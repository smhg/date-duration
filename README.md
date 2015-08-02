date-duration [![Build status](https://api.travis-ci.org/smhg/date-duration.png)](https://travis-ci.org/smhg/date-duration)
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
```

## API
### Duration(ISOString)
Pass a string in ISO 8601 duration format to create a duration.

### duration.addTo(Date)
Add the duration to a Date object and returns the new date. Objects with a `.toDate()` (like [Moment.js](http://momentjs.com/)) method are converted to a regular Date object.

### duration.subtractFrom(Date)
Subtract the duration from a Date object and returns the new date. Objects with a `.toDate()` method are converted to a regular Date object.

### duration.toString()
Convert a duration back to a string in ISO 8601 format.
