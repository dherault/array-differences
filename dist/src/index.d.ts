export declare type DifferenceType = ['inserted' | 'deleted' | 'modified', number, any?];
declare function arrayDifferences(arrayA: any[], arrayB: any[], comparisonFn?: typeof defaultComparisonFn): DifferenceType[];
declare namespace arrayDifferences {
    var reconstructArray: (array: any[], differences: DifferenceType[], inPlace?: boolean) => any[];
}
declare function defaultComparisonFn(x: any, y: any): boolean;
export default arrayDifferences;
