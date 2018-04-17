import {BasicType} from './signature.js';

export class Nominal extends BasicType {
  constructor(data) {
    super();
    this.data = data;
  }

  eq(other) {
    return this.data == other.data;
  }
}