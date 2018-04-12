export function ensureSignature(args, type) {
  if (!(args instanceof type)) {
    throw new Error('Signature does not match');
  }
}