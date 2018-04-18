export const VEGA_SCHEMA = 'https://vega.github.io/schema/vega-lite/v2.json';
export const VEGA_DESCRIPTION = 'An auto-generated viz';

export class Column {
  constructor(name, series) {
    this.name = name;
    this.series = series;
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

  toVega(xColumnName, yColumnName, mark = 'bar') {
    return {
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