import {NOT_IMPLEMENTED, INVALID} from './errors.js';
import {ensureSignature} from './signature.js';
import {NominalShell} from './nominal.js';

/**
 * Quantitative data expresses a quantity of something. Typically this
 * corresponds to numerical data.
 */
export class Quantitative extends NominalShell {
  constructor(data) {
    super();
    this.data = data;
    if (!this.valid()) throw new Error(INVALID);
  }

  valid() {
    throw new Error(NOT_IMPLEMENTED);
  }

  add(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  sub(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  mul(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  div(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  pow(other) {
    throw new Error(NOT_IMPLEMENTED);
  }
}

/**
 * A general class for numeric data. This class is abstract but contains basic
 * axiomatic mathematics.
 */
export class Numeric extends Quantitative {
  identity() {
    throw new Error(NOT_IMPLEMENTED);
  }

  negate() {
    throw new Error(NOT_IMPLEMENTED);
  }

  inverse() {
    throw new Error(NOT_IMPLEMENTED);
  }

  sub(other) {
    return this.add(other.negate());
  }

  div(other) {
    return this.mul(other.inverse());
  }
}

export class Float extends Numeric {
  valid() {
    return typeof this.data == 'number';
  }

  identity() {
    return new Float(1.0);
  }

  negate() {
    return new Float(-this.data);
  }

  inverse() {
    return new Float(1.0 / this.data);
  }

  add(other) {
    ensureSignature(other, Float);
    return new Float(this.data + other.data);
  }

  mul(other) {
    ensureSignature(other, Float);
    return new Float(this.data * other.data);
  }

  pow(other) {
    ensureSignature(other, Float);
    return new Float(Math.pow(this.data, other.data));
  }

  equals(other) {
    ensureSignature(other, Float);
    return this.data == other.data;
  }

  gt(other) {
    ensureSignature(other, Float);
    return this.data > other.data;
  }

  toInt() {
    return new Int(this.data | 0);
  }
}

export class Int extends Numeric {
  valid() {
    return typeof this.data == 'number' && Number.isInteger(this.data);
  }

  identity() {
    return new Int(1);
  }

  negate() {
    return new Int(-this.data);
  }

  add(other) {
    ensureSignature(other, Int);
    return new Int(this.data + other.data);
  }

  mul(other) {
    ensureSignature(other, Int);
    return new Int(this.data * other.data);
  }

  div(other) {
    ensureSignature(other, Int);
    return new Int((this.data / other.data) | 0);
  }

  pow(other) {
    ensureSignature(other, Int);
    return new Int(Math.pow(this.data, other.data) | 0);
  }

  equals(other) {
    ensureSignature(other, Int);
    return this.data == other.data;
  }

  gt(other) {
    ensureSignature(other, Int);
    return this.data > other.data;
  }

  toFloat() {
    return new Float(this.data);
  }
}