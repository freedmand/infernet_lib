import {Series} from './series.js';
import {Float, Int} from './quantitative.js';
import {Nominal} from './nominal.js';

// Possible null values.
const NULLS = [
  'null',
  'nil',
  'na',
  'none',
  '',
];

export function matchWhole(str, regexp) {
  const match = regexp.exec(str);
  if (match == null) return false;
  return match[0].length == str.length;
}

export const INT_REGEX = /-?([1-9][0-9]*|0)/;
export const FLOAT_REGEX = /-?([1-9][0-9]*|0)\.[0-9]*/;
export const ZERO_LEADING_REGEX = /0[0-9]+\.?[0-9]*/;
export const NA_REGEX = /[^a-zA-Z]*null[^a-zA-Z]*|[^a-zA-Z]*nil[^a-zA-Z]*|[^a-zA-Z]*n[^a-zA-Z]*a[^a-zA-Z]*|[^a-zA-Z]*none[^a-zA-Z]*|\s*(-+|_+)\s*|\s*/i;
export const NOMINAL_REGEX = /.*/

const INFER_REGEXES = [
  [INT_REGEX, ['ints', 'numbers']],
  [FLOAT_REGEX, ['floats', 'numbers']],
  [ZERO_LEADING_REGEX, ['nominals', 'zeroleading']],
  [NA_REGEX, ['na']],
  [NOMINAL_REGEX, ['nominals']],
];

/**
 * A series of data without type information yet.
 */
export class UntypedSeries {
  constructor(data) {
    this.data = data;
  }

  inferType() {
    const matches = {
      ints: 0,
      floats: 0,
      numbers: 0,
      nominals: 0,
      na: 0,
      zeroleading: 0,
    };
    for (const row of this.data) {
      for (const [INFER_REGEX, matchers] of INFER_REGEXES) {
        if (matchWhole(row, INFER_REGEX)) {
          for (const match of matchers) matches[match]++;
          break;
        }
      }
    }
    if (matches.zeroleading > 0) return Nominal;
    if (matches.ints > 0 && matches.ints > matches.floats) return Int;
    if (matches.floats > 0) return Float;
    return Nominal;
  }

  apply(type) {
    return new Series(this.data.map(datum => new (type)(datum)), type);
  }
}