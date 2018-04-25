import {DataType} from './signature.js';

export class Header extends DataType {
  constructor(data) {
    super(data);
  }

  static type() {
    return 'header';
  }
}