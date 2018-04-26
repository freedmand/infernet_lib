import {Nominal} from './nominal.js';
import {ensureSignature} from './signature.js';

export function makeCategoricalClass(categories) {
  return class Categorical extends CategoricalBase {
    constructor(data) {
      super(data, categories);
    }
  }
}

export class CategoricalBase extends Nominal {
  constructor(data, categories) {
    super(data);
    this.categories = categories;
  }

  eq(other) {
    ensureSignature(other, Categorical);
    return this.data.data == other.data.data;
  }
}