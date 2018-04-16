export function approxEquals(amount1, amount2, epsilon = 0.0000000001) {
  return Math.abs(amount1 - amount2) < epsilon;
}