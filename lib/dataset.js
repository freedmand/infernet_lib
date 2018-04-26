import {Header} from './header.js';
import {CategoricalBase} from './categorical.js';

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

export class Column {
  constructor(name, series) {
    this.name = name;
    this.series = series;
  }

  header() {
    return new Header({name: this.name, type: this.series.type});
  }
}

export class Dataset {
  constructor(columns) {
    this.columns = columns;
    this.numRows = this.columns[0].series.length;
    this.columnMap = new Map();
    this.init();
  }

  init() {
    for (const column of this.columns) {
      this.columnMap.set(column.name, column.series);
    }
  }

  row(index) {
    return this.columns.map((column) => column.series.row(index));
  }

  header() {
    return {
      data: this.columns.map((column) => column.header()),
      index: 0,
    };
  }

  allRows(includeHeader = false) {
    const rows = [];
    if (includeHeader) rows.push(this.header());
    for (let i = 0; i < this.numRows; i++) {
      rows.push({
        data: this.row(i),
        index: i + (includeHeader ? 1 : 0),
      });
    }
    return rows;
  }

  toVegaData(columnNames) {
    const data = [];
    for (let i = 0; i < this.numRows; i++) {
      const row = {};
      for (const columnName of columnNames) {
        row[columnName] = this.columnMap.get(columnName).data[i].json();
      }
      data.push(row);
    }
    return data;
  }

  toVegaEncoding(columnName, additionalEncodingProperties = null) {
    const series = this.columnMap.get(columnName);
    let spec = {
      field: columnName,
      type: series.typeSpec,
    };
    if (series.typeSpec == 'temporal') {
      spec.timeUnit = RESOLUTION_TO_TIMESPEC[series.type.res()];
    }
    if (additionalEncodingProperties) return Object.assign(additionalEncodingProperties, spec);
    return spec;
  }

  toVegaHistogram(columnName, mark = 'bar', width = 500) {
    const series = this.columnMap.get(columnName);
    let flip = false;
    if (series.type.prototype instanceof CategoricalBase) {
      if (series.hist().length > 10) flip = true;
    }

    if (series.typeSpec == 'temporal' || series.typeSpec == 'quantitative') mark = 'line';

    let encoding = {};
    encoding[flip ? 'y' : 'x'] = this.toVegaEncoding(columnName, mark == 'bar' ? {
      sort: {
        op: 'count',
        field: columnName,
        order: 'descending',
      },
    } : null);
    encoding[flip ? 'x' : 'y'] = {
      aggregate: 'count',
      type: 'quantitative',
    };
    return {
      width,
      $schema: VEGA_SCHEMA,
      description: VEGA_DESCRIPTION,
      data: {
        values: this.toVegaData([columnName]),
      },
      mark,
      encoding,
    };
  }

  toVegaUSGeoViz(latColumnName, lonColumnName, map = 'us-10m', mark = 'circle', size = 10, width = 500, height = 300) {
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v2.json",
      data: { "url": "data/github.csv"},
      width,
      height,
      layer: [
        {
          data: {
            url: `geo/${map}.json`,
            format: {
              type: 'topojson',
              feature: 'states',
            },
          },
          projection: {
            type: 'albersUsa',
          },
          mark: {
            type: 'geoshape',
            fill: 'lightgray',
            stroke: 'white',
          },
        },
        {
          data: {
            values: this.toVegaData([latColumnName, lonColumnName]),
          },
          projection: {
            type: 'albersUsa',
          },
          mark,
          encoding: {
            latitude: this.toVegaEncoding(latColumnName),
            longitude: this.toVegaEncoding(lonColumnName),
            size: {
              value: size,
            },
          },
        },
      ]
    };
  }

  toVegaBubbleChart(xColumnName, yColumnName, mark = 'circle', width = 500) {
    return {
      $schema: "https://vega.github.io/schema/vega-lite/v2.json",
      data: { "url": "data/github.csv"},
      mark,
      width,
      data: {
        values: this.toVegaData([xColumnName, yColumnName]),
      },
      encoding: {
        x: this.toVegaEncoding(xColumnName, {
          sort: {
            op: 'count',
            field: xColumnName,
            order: 'descending',
          },
        }),
        y: this.toVegaEncoding(yColumnName, {
          sort: {
            op: 'count',
            field: yColumnName,
            order: 'descending',
          },
        }),
        size: {
          type: 'quantitative',
          aggregate: 'count',
        },
      },
    };
  }

  toVega(xColumnName, yColumnName, mark = 'bar', width = 500) {
    return {
      width,
      $schema: VEGA_SCHEMA,
      description: VEGA_DESCRIPTION,
      data: {
        values: this.toVegaData([xColumnName, yColumnName]),
      },
      mark,
      encoding: {
        x: this.toVegaEncoding(xColumnName),
        y: this.toVegaEncoding(yColumnName),
      }
    };
  }
}