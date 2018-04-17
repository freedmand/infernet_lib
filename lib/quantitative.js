import {NOT_IMPLEMENTED, INVALID} from './errors.js';
import {ensureSignature, makeCompoundType} from './signature.js';
import {OrdinalShell} from './ordinal.js';
import {approxEquals} from './math.js';

/**
 * Quantitative data expresses a quantity of something. Typically this
 * corresponds to numerical data.
 */
export class Quantitative extends OrdinalShell {
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

  sqr() {
    return this.pow(new Int(2));
  }

  sqrt() {
    return this.pow(new Float(0.5));
  }
}

/**
 * A general class for numeric data. This class is abstract but contains basic
 * axiomatic mathematics.
 */
export class Numeric extends Quantitative {
  static zero() {
    throw new Error(NOT_IMPLEMENTED);
  }

  static identity() {
    throw new Error(NOT_IMPLEMENTED);
  }

  negate() {
    throw new Error(NOT_IMPLEMENTED);
  }

  sub(other) {
    return this.add(other.negate());
  }
}

export class Float extends Numeric {
  valid() {
    return typeof this.data == 'number';
  }

  static zero() {
    return new Float(0);
  }

  static identity() {
    return new Float(1.0);
  }

  negate() {
    return new Float(-this.data);
  }

  add(other) {
    ensureSignature(other, FLOAT_OR_INT);
    return new Float(this.data + other.data);
  }

  mul(other) {
    ensureSignature(other, FLOAT_OR_INT);
    return new Float(this.data * other.data);
  }

  div(other) {
    ensureSignature(other, FLOAT_OR_INT);
    return new Float(this.data / other.data);
  }

  pow(other) {
    ensureSignature(other, FLOAT_OR_INT);
    return new Float(Math.pow(this.data, other.data));
  }

  eq(other) {
    ensureSignature(other, FLOAT_OR_INT);
    return approxEquals(this.data, other.data);
  }

  gt(other) {
    ensureSignature(other, FLOAT_OR_INT);
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

  static zero() {
    return new Int(0);
  }

  static identity() {
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

  eq(other) {
    ensureSignature(other, Int);
    return approxEquals(this.data, other.data);
  }

  gt(other) {
    ensureSignature(other, Int);
    return this.data > other.data;
  }

  toFloat() {
    return new Float(this.data);
  }
}

export const FLOAT_OR_INT = makeCompoundType([Float, Int]);
