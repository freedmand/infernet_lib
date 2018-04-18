import {DataType} from './signature.js';

export class Nominal extends DataType {
  constructor(data) {
    super(data);
  }

  eq(other) {
    return this.data == other.data;
  }

  static type() {
    return 'nominal';
  }
}