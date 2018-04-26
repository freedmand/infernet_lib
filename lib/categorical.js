import {Nominal} from './nominal.js';
import {ensureSignature} from './signature.js';
import {NOT_IMPLEMENTED} from './errors.js';

export function makeCategoricalClass(categories) {
  return class Categorical extends CategoricalBase {
    constructor(data) {
      super(data);
    }

    static categories() {
      return categories;
    }
  }
}

export class CategoricalBase extends Nominal {
  constructor(data) {
    super(data);
  }

  static categories() {
    throw new Error(NOT_IMPLEMENTED);
  }

  eq(other) {
    ensureSignature(other, CategoricalBase);
    return this.data == other.data;
  }
}