import {Numeric} from './quantitative.js';
import {ensureSignature} from './signature.js';
import {INVALID} from './errors.js';
import {approxEquals} from './math.js';

/*
    {
     'cm': [100, 'mm'],
     'm': [1000, 'mm'],
     'in': [2.54, 'cm'],
    }
*/

export class UnitTable {
  constructor(conversions) {
    this.conversions = conversions;
    this.matrix = new Map();
    this.init();
  }

  init() {
    const set = (fromUnit, toUnit, amount) => {
      if (this.matrix.has(fromUnit)) {
        const fromUnitMatrix = this.matrix.get(fromUnit);
        if (fromUnitMatrix.has(toUnit)) return; // Skip if already exists.
        // Recurse.
        for (const [otherToUnit, otherAmount] of fromUnitMatrix) {
          set(toUnit, otherToUnit, otherAmount / amount);
        }
        fromUnitMatrix.set(toUnit, amount);
      } else {
        this.matrix.set(fromUnit, new Map([[toUnit, amount]]));
      }

      set(toUnit, fromUnit, 1 / amount); // Set the reverse.
      set(toUnit, toUnit, 1); // Set the identities.
      set(fromUnit, fromUnit, 1);
    };

    // Go through existing conversions and populate the matrix.
    for (const key in this.conversions) {
      if (this.conversions.hasOwnProperty(key)) {
        const [amount, toUnit] = this.conversions[key];
        set(key, toUnit, amount);
      }
    }
  }

  value(amount, unit) {
    return new Unit(amount, unit, this);
  }
}

export class Unit extends Numeric {
  constructor(amount, unit, unitTable) {
    super({amount, unit, unitTable});
    this.amount = amount;
    this.unit = unit;
    this.unitTable = unitTable;
  }

  valid() {
    return typeof this.data.amount == 'number' &&
        this.data.unitTable.matrix.has(this.data.unit);
  }

  get(toUnit) {
    return this.amount * this.unitTable.matrix.get(this.unit).get(toUnit);
  }

  withAmount(amount) {
    return new Unit(amount, this.unit, this.unitTable);
  }

  eq(other) {
    ensureSignature(other, Unit);
    return approxEquals(this.get(other.unit), other.amount);
  }

  gt(other) {
    ensureSignature(other, Unit);
    return this.get(other.unit) > other.amount;
  }

  identity() {
    return this.withAmount(1);
  }

  negate() {
    return this.withAmount(-this.amount);
  }

  add(other) {
    return this.withAmount(this.amount + other.get(this.unit));
  }

  // TODO(freedmand): Add sq units
  // mul(other) {
  //   return this.withAmount(this.amount * other.get(this.unit));
  // }

  // pow(other) {
  //   return this.withAmount(Math.pow(this.amount, other.get(this.unit)));
  // }
}