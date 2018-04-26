import {NOT_IMPLEMENTED, INVALID} from './errors.js';
import {ensureSignature} from './signature.js';
import {DataType} from './signature.js';

export class OrdinalShell extends DataType {
  constructor(data) {
    super(data);
  }

  eq(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  neq(other) {
    return !this.eq(other);
  }

  gt(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  gte(other) {
    return this.gt(other) || this.eq(other);
  }

  lt(other) {
    return !this.gte(other);
  }

  lte(other) {
    return !this.gt(other);
  }
}

/**
 * Ordinal data expresses data that are ranked in some way, e.g.
 *   - ["first", "second", "third"]
 *   - ["small", "medium", "large", "x large"]
 */
export class Ordinal extends OrdinalShell {
  constructor(data, rankings) {
    super({data, rankings});
    this.rankings = rankings;
    this.dataIndex = rankings.indexOf(data);
    if (this.dataIndex == -1) throw new Error('Invalid data point for rankings');
  }

  static type() {
    return 'ordinal';
  }

  eq(other) {
    ensureSignature(other, Ordinal);
    return this.dataIndex == other.dataIndex;
  }

  gt(other) {
    ensureSignature(other, Ordinal);
    return this.dataIndex > other.dataIndex;
  }
}