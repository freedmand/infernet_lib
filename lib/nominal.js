import {NOT_IMPLEMENTED, INVALID} from './errors.js';
import {ensureSignature} from './signature.js';

export class NominalShell {
  constructor() {}

  equals(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  notEquals(other) {
    return !this.equals(other);
  }

  gt(other) {
    throw new Error(NOT_IMPLEMENTED);
  }

  gte(other) {
    return this.gt(other) || this.equals(other);
  }

  lt(other) {
    return !this.gte(other);
  }

  lte(other) {
    return !this.gt(other);
  }
}

/**
 * Nominal data expresses data that are ranked in some way, e.g.
 *   - ["first", "second", "third"]
 *   - ["small", "medium", "large", "x large"]
 */
export class Nominal extends NominalShell {
  constructor(rankings, data) {
    super();
    this.rankings = rankings;
    this.data = data;
    this.dataIndex = rankings.indexOf(data);
    if (this.dataIndex == -1) throw new Error('Invalid data point for rankings');
  }

  equals(other) {
    return this.dataIndex == other.dataIndex;
  }

  gt(other) {
    return this.dataIndex > other.dataIndex;
  }
}