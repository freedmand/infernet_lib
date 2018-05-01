import {Int, Float} from './quantitative.js';
import {Null} from './null.js';

function ensureFloat(num) {
  if (num instanceof Int) return num.toFloat();
  return num;
}

export class Series {
  constructor(data, type, untypedSeries = null) {
    this.data = data;
    this.type = type;
    this.typeSpec = this.type.type();
    this.length = data.length;
    this.untypedSeries = untypedSeries;
  }

  stats() {
    const hist = this.hist();
    const format = ([val, count]) => `${val.data} (${count}x)`;

    let stats = `         Length: ${this.length}
Non-null length: ${this.nonNullLength()}
  Unique values: ${hist.length}
`;
    if (this.typeSpec == 'quantitative') {
      stats += `            Min: ${this.min().data}
            Max: ${this.max().data}
            Sum: ${this.sum().data}
           Mean: ${this.average().data}
         StdDev: ${this.stddev().data}
`;
    }
    stats += `    Most common: ${hist.slice(0, 5).map(format).join('\n                 ')}
`;
    return stats;
  }

  nonNullLength() {
    let total = 0;
    for (const datum of this.data) {
      if (datum instanceof Null) continue;
      total++;
    }
    return total;
  }

  row(index) {
    return this.data[index];
  }

  average() {
    if (this.length == 0) throw new Error('Need elements for average');
    return this.sum().div(new Int(this.nonNullLength()));
  }

  sum() {
    let total = this.type.zero();
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      total = total.add(elem);
    }
    return total;
  }

  min() {
    let min = null;
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      if (min == null || elem.lt(min)) {
        min = elem;
      }
    }
    return min;
  }

  max() {
    let max = null;
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      if (max == null || elem.gt(max)) {
        max = elem;
      }
    }
    return max;
  }

  variance() {
    const mean = this.average();
    let total = Float.zero();
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      total = total.add(ensureFloat(elem).sub(mean).sqr());
    }
    return total.div(new Int(this.nonNullLength()));
  }

  stddev() {
    return this.variance().sqrt();
  }

  hist() {
    const counts = [];
    for (const elem of this.data) {
      let found = false;
      for (let i = 0; i < counts.length; i++) {
        const [key, value] = counts[i];
        if (elem.eq(key)) {
          counts[i] = [key, value + 1];
          found = true;
          break;
        }
      }
      if (!found) {
        counts.push([elem, 1]);
      }
    }
    counts.sort((a, b) => {
      return b[1] - a[1];
    });
    return counts;
  }

  mode() {
    const hist = this.hist();
    return hist[0][0];
  }
}