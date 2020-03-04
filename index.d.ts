declare module 'array-differences' {
  type Differences = (string | number | object)[][];

  export function reconstructArray<T>(array: T[], differences: Differences, inPlace?: boolean): T[];
  export default function arrayDifferences<T>(arrayA: T[], arrayB: T[], comparisonFn?: (val1: T, val2: T) => boolean): Differences;
}