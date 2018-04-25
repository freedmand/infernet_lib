import {Int} from './quantitative.js';
import {Null} from './null.js';

export class Series {
  constructor(data, type, untypedSeries = null) {
    this.data = data;
    this.type = type;
    this.typeSpec = this.type.type();
    this.length = data.length;
    this.untypedSeries = untypedSeries;
  }

  row(index) {
    return this.data[index];
  }

  average() {
    if (this.length == 0) throw new Error('Need elements for average');
    return this.sum().div(new Int(this.length));
  }

  sum() {
    let total = this.type.zero();
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      total = total.add(elem);
    }
    return total;
  }

  variance() {
    const mean = this.average();
    let total = this.type.zero();
    for (const elem of this.data) {
      if (elem instanceof Null) continue;
      total = total.add(elem.sub(mean).sqr());
    }
    return total.div(new Int(this.length));
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