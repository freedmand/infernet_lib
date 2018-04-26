import {Series} from './series.js';
import {Float, Int, Numeric} from './quantitative.js';
import {Nominal} from './nominal.js';
import {makeCategoricalClass} from './categorical.js';
import {Null} from './null.js';
import {Time, createTimeClass} from './temporal.js';
import {Latitude, Longitude} from './geographic.js';
import {Count} from './count.js';

export function matchWhole(str, regexp) {
  const match = regexp.exec(str);
  if (match == null) return false;
  return match[0].length == str.length;
}

export function normStrEq(str1, str2) {
  if (str2 instanceof Array) {
    for (const str2Part of str2) {
      if (normStrEq(str1, str2Part)) return true;
    }
    return false;
  }
  return str1.trim().toLowerCase() == str2.trim().toLowerCase();
}

export const INT_REGEX = /\s*-?([1-9][0-9]*|0)\s*/;
export const FLOAT_REGEX = /\s*-?([1-9][0-9]*|0)\.[0-9]*\s*/;
export const ZERO_LEADING_REGEX = /\s*0[0-9]+\.?[0-9]*\s*/;
export const NA_REGEX = /[^a-zA-Z]*null[^a-zA-Z]*|[^a-zA-Z]*nil[^a-zA-Z]*|[^a-zA-Z]*n[^a-zA-Z]*a[^a-zA-Z]*|[^a-zA-Z]*none[^a-zA-Z]*|\s*(-+|_+)\s*|\s*/i;
export const NOMINAL_REGEX = /.*/

export const ISO_DAY_REGEX = /\s*\d{4}-[0-1]\d-[0-3]\d\s*/;
export const INFORMAL_YEAR_REGEX = /\s*[1-2]\d{3}\s*/;
// export const ISO_MINUTE_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/;
// export const ISO_SECOND_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/;
// export const ISO_MILLI_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const UNIQ_THRESHOLD = 0.025; // if less than this, categorical and not nominal.
const UNIQ_VALUES = 80; // No more than this many values in a categorical.
const UNIQ_DUPLICATES = 10; // there should be at least 10 duplicates for categorical.

const Day = createTimeClass('Day', (iso_day_string) => {
  const [yearRaw, monthRaw, dayRaw] = iso_day_string.split('-');
  const [year, month, day] = [parseInt(yearRaw), parseInt(monthRaw) - 1, parseInt(dayRaw)];
  return Date.UTC(year, month, day);
}, 'day');

const Year = createTimeClass('Year', (year_string) => {
  const year = parseInt(year_string);
  return Date.UTC(year, 0, 1);
}, 'year');

function parseNumber(type, datum) {
  if (matchWhole(datum, NA_REGEX)) return new Null();
  return new (type)(parseFloat(datum));
}

function parseDate(type, datum) {
  if (matchWhole(datum, NA_REGEX)) return new Null();
  return new (type)(datum);
}

const INFER_REGEXES = [
  [INFORMAL_YEAR_REGEX, ['years', 'ints', 'numbers']],
  [INT_REGEX, ['ints', 'numbers']],
  [FLOAT_REGEX, ['floats', 'numbers']],
  [ISO_DAY_REGEX, ['days']],
  [ZERO_LEADING_REGEX, ['nominals', 'zeroleading']],
  [NA_REGEX, ['na']],
  [NOMINAL_REGEX, ['nominals']],
];

const PARSERS = [
  [Numeric, parseNumber],
  [Time, parseDate],
];

/**
 * A series of data without type information yet.
 */
export class UntypedSeries {
  constructor(data, name = null) {
    this.data = data;
    this.name = name;
  }

  inferType() {
    const matches = {
      ints: 0,
      floats: 0,
      numbers: 0,
      nominals: 0,
      na: 0,
      years: 0,
      days: 0,
      zeroleading: 0,
    };
    const s = new Set();
    for (const row of this.data) {
      s.add(row);
      for (const [INFER_REGEX, matchers] of INFER_REGEXES) {
        if (matchWhole(row, INFER_REGEX)) {
          for (const match of matchers) matches[match]++;
          break;
        }
      }
    }

    const uniqPerc = s.size / this.data.length;
    const duplicates = this.data.length - s.size;
    console.log(`${this.name}, ${s.size}, ${uniqPerc}, ${duplicates}`, s)
    const categorical = uniqPerc < UNIQ_THRESHOLD && duplicates > UNIQ_DUPLICATES && s.size <= UNIQ_VALUES;

    if (matches.zeroleading > 0) return categorical ? makeCategoricalClass(s) : Nominal;
    if (matches.nominals > 0) return categorical ? makeCategoricalClass(s) : Nominal;
    if (matches.days > 0) return Day;
    if (matches.floats > 0) {
      if (this.name != null) {
        if (normStrEq(this.name, ['lat', 'latitude'])) {
          return Latitude;
        }
        if (normStrEq(this.name, ['lon', 'longitude'])) {
          return Longitude;
        }
        if (normStrEq(this.name, 'count')) {
          return Count;
        }
      }
      return Float;
    }
    if (matches.years > 0 && this.name && normStrEq(this.name, 'year')) return Year;
    if (matches.ints > 0) return Int;
    return Nominal;
  }

  apply(type) {
    const create = (datum) => {
      for (const [matchType, parser] of PARSERS) {
        if (type.prototype instanceof matchType) return parser(type, datum);
      }
      return new (type)(datum);
    };
    return new Series(this.data.map(datum => create(datum)), type, this);
  }

  auto() {
    return this.apply(this.inferType());
  }
}