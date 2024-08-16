import { type DifferenceType, diffArray, reconstructArray } from '../src'

function testArrayDifferences<T>(a: T[], b: T[], expected: DifferenceType<T>[]) {
  const diff = diffArray(a, b)

  expect(diff).toEqual(expected)

  const reconstructed = reconstructArray(a, diff)

  expect(reconstructed).toEqual(b)

  reconstructArray(a, diff, true)

  expect(a).toEqual(b)
}

test('It return an empty array on no differences', () => {
  testArrayDifferences(
    [],
    [],
    []
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1, 2],
    []
  )
})

test('It returns the modified items', () => {
  testArrayDifferences(
    [0, 1, 2],
    [111, 1, 2],
    [['modified', 0, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 111, 2],
    [['modified', 1, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1, 111],
    [['modified', 2, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 111, 112],
    [['modified', 1, 111], ['modified', 2, 112]]
  )
})

test('It returns the inserted items', () => {
  testArrayDifferences(
    [0, 1, 2],
    [111, 0, 1, 2],
    [['inserted', 0, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 111, 1, 2],
    [['inserted', 1, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1, 111, 2],
    [['inserted', 2, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1, 2, 111],
    [['inserted', 3, 111]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1, 2, 111, 112],
    [['inserted', 3, 111], ['inserted', 4, 112]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 1, 2, 112, 3],
    [['inserted', 1, 111], ['inserted', 4, 112]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 112, 1, 2, 113, 114, 3],
    [['inserted', 1, 111], ['inserted', 2, 112], ['inserted', 5, 113], ['inserted', 6, 114]]
  )
})

test('It returns the deleted items', () => {
  testArrayDifferences(
    [0, 1, 2],
    [1, 2],
    [['deleted', 0]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 2],
    [['deleted', 1]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0, 1],
    [['deleted', 2]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [0],
    [['deleted', 1], ['deleted', 1]]
  )

  testArrayDifferences(
    [0, 1, 2],
    [1],
    [['deleted', 0], ['deleted', 1]]
  )
})

test('It return the modified, inserted and deleted items in complex situations', () => {
  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 3],
    [['modified', 1, 111], ['deleted', 2]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 2, 3, 112],
    [['modified', 1, 111], ['inserted', 4, 112]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 2, 112, 3],
    [['modified', 1, 111], ['inserted', 3, 112]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [1, 2, 111],
    [['deleted', 0], ['modified', 2, 111]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 2, 111, 3],
    [['deleted', 1], ['inserted', 2, 111]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 2, 3, 111],
    [['deleted', 1], ['inserted', 3, 111]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [111, 0, 1, 2],
    [['inserted', 0, 111], ['deleted', 4]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 1, 2, 112],
    [['inserted', 1, 111], ['modified', 4, 112]]
  )

  testArrayDifferences(
    [0, 1, 2, 3, 4, 5, 6],
    [0, 111, 1, 2, 112, 4, 6],
    [['inserted', 1, 111], ['modified', 4, 112], ['deleted', 6]]
  )

  testArrayDifferences(
    [0, 1, 2, 3, 4, 5, 6],
    [111, 1, 112, 5, 7],
    [['modified', 0, 111], ['modified', 2, 112], ['deleted', 3], ['deleted', 3], ['modified', 4, 7]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 112, 113, 1, 2, 114, 115, 3],
    [['inserted', 1, 111], ['inserted', 2, 112], ['inserted', 3, 113], ['inserted', 6, 114], ['inserted', 7, 115]]
  )

  testArrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 112, 113, 2, 114, 115, 3],
    [['modified', 1, 111], ['inserted', 2, 112], ['inserted', 3, 113], ['inserted', 5, 114], ['inserted', 6, 115]]
  )
})

test('It handles duplicates', () => {
  testArrayDifferences(
    [1, 1],
    [1, 1, 1],
    [['inserted', 2, 1]]
  )

  testArrayDifferences(
    [0, 0, 1, 1],
    [0, 1, 0, 1, 1],
    [['inserted', 1, 1]]
  )

  testArrayDifferences(
    [1, 1, 1],
    [1, 1],
    [['deleted', 2]]
  )

  testArrayDifferences(
    [0, 1, 1],
    [1, 1],
    [['deleted', 0]]
  )

  testArrayDifferences(
    [1, 1, 4, 1, 1],
    [1, 112, 1, 4, 1],
    [['inserted', 1, 112], ['deleted', 4]]
  )

  testArrayDifferences(
    [0, 1, 1, 4, 1, 1],
    [111, 1, 112, 1, 4, 1],
    [['modified', 0, 111], ['inserted', 2, 112], ['deleted', 5]]
  )
})

test('It return the minimum number of operations', () => {
  testArrayDifferences(
    [0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0],
    [['deleted', 0], ['deleted', 0], ['inserted', 3, 0], ['inserted', 4, 0]]
  )

  testArrayDifferences(
    [0, 0, 1, 1, 1, 0, 0, 2, 2, 1],
    [2, 2, 1, 0, 0, 1, 1, 1, 0, 0],
    [['inserted', 0, 2], ['inserted', 1, 2], ['inserted', 2, 1], ['deleted', 10], ['deleted', 10], ['deleted', 10]]
  )
})

test('It uses a custom comparison function', () => {
  const array1 = [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 4 }, { value: 1 }, { value: 1 }]
  const array2 = [{ value: 111 }, { value: 1 }, { value: 112 }, { value: 1 }, { value: 4 }, { value: 1 }]

  const diff = diffArray(
    array1,
    array2,
    (a, b) => a.value === b.value
  )

  const expected: DifferenceType<typeof array1[number]>[] = [['modified', 0, { value: 111 }], ['inserted', 2, { value: 112 }], ['deleted', 5]]

  expect(diff).toEqual(expected)

  const reconstructed = reconstructArray(array1, expected)

  expect(reconstructed).toEqual(array2)
})

test('It works with any litterals out of the box', () => {
  testArrayDifferences(
    ['b', 'b', 'a'],
    ['a', 'b', 'b'],
    [['inserted', 0, 'a'], ['deleted', 3]]
  )

  testArrayDifferences(
    [true, false],
    [false, false, true, true],
    [['inserted', 0, false], ['inserted', 1, false], ['modified', 3, true]]
  )

  testArrayDifferences(
    [null, null],
    [null, null, null],
    [['inserted', 2, null]]
  )
})

test('It works on large arrays', () => {
  const array: number[] = []

  for (let i = 0; i < 1000; i++) {
    array.push(i)
  }

  const array2 = array.slice()

  array2[99] = 111
  array2[22] = 111

  testArrayDifferences(array, array2, [['modified', 22, 111], ['modified', 99, 111]])
})

test('It throws on non-array inputs', () => {
  expect(() => diffArray(null as any as any[], [])).toThrow()
  expect(() => diffArray([], null as any as any[])).toThrow()
  expect(() => diffArray(2 as any as any[], 3 as any as any[])).toThrow()
})
