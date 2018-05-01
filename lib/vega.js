import {NOT_IMPLEMENTED} from './errors.js';

export const VEGA_SCHEMA = 'https://vega.github.io/schema/vega-lite/v2.json';
export const VEGA_DESCRIPTION = 'An auto-generated viz';

const RESOLUTION_TO_TIMESPEC = {
  year: 'year',
  quarter: 'yearquarter',
  month: 'yearmonth',
  day: 'yearmonth',
  hour: 'yearmonth',
  minute: 'yearmonth',
  second: 'yearmonth',
  // day: 'yearmonthdate',
  // hour: 'yearmonthdatehours',
  // minute: 'yearmonthdatehoursminutes',
  // second: 'yearmonthdatehoursminutesseconds',
};

export function isSubset(master, object) {
  if ((object instanceof Array) && (master instanceof Array)) {
    if (object.length != master.length) return false;
    for (let i = 0; i < object.length; i++) {
      if (!isSubset(master[i], object[i])) return false;
    }
    return true;
  } else if ((object instanceof Object) && (master instanceof Object)) {
    for (const key of Object.keys(object)) {
      if (!master.hasOwnProperty(key)) return false;
      if (!isSubset(master[key], object[key])) return false;
    }
    return true;
  } else {
    return master == object;
  }
}

/**
 * Merges multiple dictionaries together. The one specified first override the ones specified later.
 */
export function merge(...specs) {
  const result = {};
  for (let i = specs.length - 1; i >= 0; i--) {
    const spec = specs[i];
    for (const key of Object.keys(spec)) {
      if (result.hasOwnProperty(key) && result[key] instanceof Object) {
        result[key] = merge(spec[key], result[key]);
      } else {
        result[key] = spec[key];
      }
    }
  }
  return result;
}

/**
 * A class that wraps a single visual.
 */
export class Visual {
  constructor(dataset, columns, spec) {
    this.dataset = dataset;
    this.columns = columns;
    this.spec = spec;
  }

  toVegaSpec(properties = {}) {
    return this.spec.chain(properties, this.dataset, this.columns);
  }
}

/**
 * A class that wraps a single visual.
 */
export class Visual {
  constructor(dataset, columns, spec) {
    this.dataset = dataset;
    this.columns = columns;
    this.spec = spec;
  }

  toVegaSpec(properties = {}) {
    return this.spec.chain(properties, this.dataset, this.columns);
  }
}

/**
 * Enumerate possible visualizations and refinements for a dataset.
 */
export class Visualizer {
  constructor(dataset) {
    this.dataset = dataset;
  }

  all() {
    const visualizations = [];
    this.dataset.columns.forEach((column) => {
      if (((column.series.type.prototype instanceof CategoricalBase && column.series.type.categories().size > 1) || column.series.typeSpec == 'quantitative' || column.series.typeSpec == 'temporal') && (column.series.type.name != 'Latitude' && column.series.type.name != 'Longitude')) {
        // visualizations.push(this.dataset.toVegaHistogram(column.name));
        visualizations.push(new Visual(this.dataset, [column.name], new BarCountChart()));
      }
    });
    for (let i = 1; i < this.dataset.columns.length; i++) {
      for (let j = 0; j < i; j++) {
        const column1 = this.dataset.columns[i];
        const column2 = this.dataset.columns[j];
        if (column1.series.type.prototype instanceof CategoricalBase && column2.series.type.prototype instanceof CategoricalBase && column1.series.type.categories().size > 1 && column2.series.type.categories().size > 1) {
          // visualizations.push(this.dataset.toVegaBubbleChart(column1.name, column2.name));
          visualizations.push(new Visual(this.dataset, [column1.name, column2.name], new BubbleChart()));
        }
        if (column1.series.type.name == 'Latitude' && column2.series.type.name == 'Longitude') {
          // visualizations.push(this.dataset.toVegaUSGeoViz(column1.name, column2.name));
          visualizations.push(new Visual(this.dataset, [column1.name, column2.name], new USGeo()));
        }
        if (column1.series.type.name == 'Longitude' && column2.series.type.name == 'Latitude') {
          // visualizations.push(this.dataset.toVegaUSGeoViz(column2.name, column1.name));
          visualizations.push(new Visual(this.dataset, [column2.name, column1.name], new USGeo()));
        }
      }
    }
  }
}

/**
 * A base class for different types of visualizations.
 */
export class Spec {
  constructor(...specs) {
    this.specs = specs;
  }

  apply(properties, dataset, columns) {
    return {};
  }

  chain(properties, dataset, columns) {
    const spec = this.apply(properties, dataset, columns);
    return merge(...[spec].concat(this.specs.map((s) => s.chain(properties, dataset, columns))));
  }
}

export class DataSpec extends Spec {
  apply(properties, dataset, columns) {
    const values = [];
    for (let i = 0; i < dataset.numRows; i++) {
      const row = {};
      for (const columnName of columns) {
        row[columnName] = dataset.columnMap.get(columnName).data[i].json();
      }
      values.push(row);
    }
    return {data: {values}};
  }
}

export class EncodingSpec extends Spec {
  constructor(...axes) {
    super();
    this.axes = axes;
  }

  apply(properties, dataset, columns) {
    if (columns.length != this.axes.length) {
      throw new Error('Number of columns mismatches number of axes');
    }

    const encoding = {};
    for (let i = 0; i < this.axes.length; i++) {
      const axis = this.axes[i];
      const columnName = columns[i];

      const series = dataset.columnMap.get(columnName);
      encoding[axis] = {
        field: columnName,
        type: series.typeSpec,
      };
      // TODO deal with time resolution
      if (series.typeSpec == 'temporal') {
        spec.timeUnit = RESOLUTION_TO_TIMESPEC[series.type.res()];
      }
    }
    return {encoding};
  }
}

export class XYEncodingSpec extends EncodingSpec {
  constructor() {
    super('x', 'y');
  }
}

export class FlipEncodingSpec extends XYEncodingSpec {
  apply(properties, dataset, columns) {
    const columnName = columns[i];
    const series = dataset.columnMap.get(columnName);
  }
}

export class BaseSpec extends Spec {
  apply({description = VEGA_DESCRIPTION}) {
    return {
      $schema: VEGA_SCHEMA,
      description,
    };
  }
}

export class WidthSpec extends Spec {
  constructor(width = 500) {
    super();
    this.width = width;
  }
  
  apply() {
    return {
      width: this.width,
    }
  }
}

export class MarkSpec extends Spec {
  constructor(mark = 'bar') {
    super();
    this.mark = mark;
  }

  apply() {
    return {
      mark: this.mark,
    }
  }
}

export class ChartSpec extends Spec {
  constructor() {
    super(new DataSpec(), new WidthSpec(), new BaseSpec());
  }
}

export class BarChartSpec extends Spec {
  constructor() {
    super(new MarkSpec('bar'), new EncodingSpec('x', 'y'), new ChartSpec());
  }
}