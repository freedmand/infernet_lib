import {Header} from './header.js';

export const VEGA_SCHEMA = 'https://vega.github.io/schema/vega-lite/v2.json';
export const VEGA_DESCRIPTION = 'An auto-generated viz';

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

  toVegaEncoding(columnName) {
    const series = this.columnMap.get(columnName);
    return {
      field: columnName,
      type: series.typeSpec,
    };
  }

  toVegaHistogram(columnName, mark = 'bar', width = 500) {
    return {
      width,
      $schema: VEGA_SCHEMA,
      description: VEGA_DESCRIPTION,
      data: {
        values: this.toVegaData([columnName]),
      },
      mark,
      encoding: {
        x: {
          field: columnName,
          type: 'nominal',
        },
        y: {
          aggregate: 'count',
          type: 'quantitative',
        }
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