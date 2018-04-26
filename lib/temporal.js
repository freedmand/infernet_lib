import {Quantitative} from './quantitative.js';
import {UnitTable, Unit, makeUnitClass} from './unit.js';
import {ensureSignature} from './signature.js';

export const RESOLUTIONS = {
  'millisecond': 0,
  'second': 1,
  'minute': 2,
  'hour': 3,
  'day': 4,
  'week': 5,
  'month': 6,
  'quarter': 7,
  'year': 8,
  'decade': 9,
  'century': 10,
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const RESOLUTION_ERROR = 'The time does not have enough resolution for this';

const timeTable = new UnitTable({
  'second': [1000, 'millisecond'],
  'minute': [60, 'second'],
  'hour': [60, 'minute'],
  'day': [24, 'hour'],
  'week': [7, 'day'],
  'year': [365, 'day'],
  'month': [1 / 12, 'year'],
  'quarter': [3, 'month'],
  'decade': [10, 'year'],
  'century': [100, 'year'],
});

export const TimeDuration = makeUnitClass(timeTable, 'second');

function nameClass(classDef, name) {
  Object.defineProperty(classDef, 'name', {value: name});
  return classDef;
}

export function createTimeClass(className, parser, resolution) {
  return nameClass(class extends Time {
    constructor(text) {
      super(parser(text), resolution);
    }
  }, className);
}

/**
 * Time represents a moment in time as the number of milliseconds that have
 * elapsed since 1970.
 */
export class Time extends Quantitative {
  constructor(millisSince1970, resolution) {
    super(millisSince1970);
    this.dateTime = new Date(millisSince1970);
    this.resolution = resolution;
  }

  valid() {
    return true;
  }

  format(formatString) {
    const zeroPad = (s, n = 2) => {
      let str = `${s}`;
      while (str.length < n) str = '0' + str;
      return str;
    };

    const replaceIfContains = (str, replacements) => {
      for (const [search, fn] of replacements) {
        if (str.includes(search)) {
          const replacement = fn();
          str = str.split(search).join(replacement);
        }
      }
      return str;
    };

    return replaceIfContains(formatString, [
      ['YYYY', () => zeroPad(this.year(), 4)],
      ['MM', () => zeroPad(this.month() + 1)],
      ['DD', () => zeroPad(this.dayOfMonth())],
      ['hh', () => zeroPad(this.hour())],
      ['mm', () => zeroPad(this.minute())],
      ['ss', () => zeroPad(this.second())],
      ['Month', () => this.longMonth()],
      ['Day', () => this.dayOfMonth()],
      ['Year', () => this.year()],
      ['Weekday', () => this.longWeekday()],
      ['Hour', () => this.americanHour()],
      ['amPm', () => this.amPm()],
    ]);
  }

  toString() {
    if (this.resolution == 'year') return this.format('Year');
    if (this.resolution == 'month') return this.format('Month Year');
    if (this.resolution == 'day') return this.isoDate();
    if (this.resolution == 'minute') return this.format('YYYY-MM-DD hh:mm');
    if (this.resolution == 'second') return this.format('YYYY-MM-DD hh:mm:ss');
    throw new Error('Unsupported resolution'); // TODO: support all resolutions
  }

  isoDate() {
    return this.format('YYYY-MM-DD');
  }

  isoDateAndTime() {
    return this.format('YYYY-MM-DD hh:mm:ss');
  }

  mediumDate() {
    return this.format('Month Day, Year');
  }

  mediumDateAndTime() {
    return this.format('Month Day, Year Hour:mm:ss amPm');
  }

  longDate() {
    return this.format('Weekday, Month Day, Year');
  }

  longDateAndTime() {
    return this.format('Weekday, Month Day, Year Hour:mm:ss amPm');
  }

  enforceResolution(resolution) {
    if (RESOLUTIONS[this.resolution] > RESOLUTIONS[resolution]) throw new Error(RESOLUTION_ERROR);
  }

  epochTime() {
    this.enforceResolution('millisecond');
    return this.dateTime.getTime();
  }

  millisecond() {
    this.enforceResolution('millisecond');
    return this.dateTime.getUTCMilliseconds();
  }

  second() {
    this.enforceResolution('second');
    return this.dateTime.getUTCSeconds();
  }

  minute() {
    this.enforceResolution('minute');
    return this.dateTime.getUTCMinutes();
  }

  hour() {
    this.enforceResolution('hour');
    return this.dateTime.getUTCHours();
  }

  americanHour() {
    let hourMod = this.hour() % 12;
    if (hourMod == 0) hourMod = 12;
    return hourMod;
  }

  amPm() {
    return this.hour() >= 12 ? 'p.m.' : 'a.m.';
  }

  dayOfYear() {
    this.enforceResolution('day');
    return Math.floor((Date.UTC(this.year(), this.month(), this.dayOfMonth()) - Date.UTC(this.year(), 0, 0)) / 24 / 60 / 60 / 1000);
  }

  dayOfMonth() {
    this.enforceResolution('day');
    return this.dateTime.getUTCDate();
  }

  dayOfWeek() {
    this.enforceResolution('day');
    return this.dateTime.getUTCDay();
  }

  longWeekday() {
    return WEEKDAYS[this.dayOfWeek()];
  }

  month() {
    this.enforceResolution('month');
    return this.dateTime.getUTCMonth();
  }

  longMonth() {
    return MONTHS[this.month()];
  }

  quarter() {
    this.enforceResolution('quarter');
    return Math.floor(this.month() / 3);
  }

  year() {
    this.enforceResolution('year');
    return this.dateTime.getUTCFullYear();
  }

  decade() {
    this.enforceResolution('decade');
    return Math.floor(this.year() / 10) * 10;
  }

  century() {
    this.enforceResolution('century');
    return Math.floor(this.decade() / 100) * 100;
  }

  add(timeDelta) {
    ensureSignature(timeDelta, TimeDuration);
    this.enforceResolution(timeDelta.unit);
    const newEpochTime = this.data + timeDelta.get('millisecond');
    return new Time(newEpochTime, this.resolution);
  }

  sub(other) {
    ensureSignature(other, Time);
    this.enforceResolution(other.resolution);
    return new TimeDuration(this.data - other.data, 'millisecond').to(this.resolution);
  }

  eq(other) {
    ensureSignature(other, Time);
    this.enforceResolution(other, other.resolution);
    return this.data == other.data;
  }
}