import {DataType} from './signature.js';

export class Null extends DataType {
  constructor() {
    super();
    this.isNull = true;
  }

  eq(other) {
    return other.isNull;
  }

  static type() {
    return 'nominal';
  }
}