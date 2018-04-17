export class BasicType {
  constructor() {}

  static match(type) {
    return type instanceof this;
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