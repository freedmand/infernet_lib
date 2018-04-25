import {NOT_IMPLEMENTED} from './errors.js';

export class BasicType {
  constructor() {
    this.isNull = false;
  }

  static match(type) {
    return type instanceof this;
  }

  static type() {
    throw new Error(NOT_IMPLEMENTED);
  }
}

export class DataType extends BasicType {
  constructor(data) {
    super();
    this.data = data;
  }

  json() {
    return this.data;
  }
}

export function makeCompoundType(types) {
  return class extends BasicType {
    constructor() {
      super();
    }

    static match(type) {
      for (const myType of types) {
        if (myType.match(type)) return true;
      }
      return false;
    }
  }
}

export function ensureSignature(arg, type) {
  if (!type.match(arg)) {
    throw new Error('Signature does not match');
  }
}