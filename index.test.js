/* eslint-env jest */

const arrayDifferences = require('./index')

let diff

test('It return an empty array on no differences', () => {
  diff = arrayDifferences(
    [],
    [],
  )

  expect(diff).toEqual([])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1, 2],
  )

  expect(diff).toEqual([])
})

test('It returns the modified items', () => {
  diff = arrayDifferences(
    [0, 1, 2],
    [111, 1, 2],
  )

  expect(diff).toEqual([['modified', 0, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 111, 2],
  )

  expect(diff).toEqual([['modified', 1, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1, 111],
  )

  expect(diff).toEqual([['modified', 2, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 111, 112],
  )

  expect(diff).toEqual([['modified', 1, 111], ['modified', 2, 112]])
})

test('It returns the inserted items', () => {
  diff = arrayDifferences(
    [0, 1, 2],
    [111, 0, 1, 2],
  )

  expect(diff).toEqual([['inserted', 0, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 111, 1, 2],
  )

  expect(diff).toEqual([['inserted', 1, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1, 111, 2],
  )

  expect(diff).toEqual([['inserted', 2, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1, 2, 111],
  )

  expect(diff).toEqual([['inserted', 3, 111]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1, 2, 111, 112],
  )

  expect(diff).toEqual([['inserted', 3, 111], ['inserted', 4, 112]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 1, 2, 112, 3],
  )

  expect(diff).toEqual([['inserted', 1, 111], ['inserted', 4, 112]])
})

test('It returns the deleted items', () => {
  diff = arrayDifferences(
    [0, 1, 2],
    [1, 2],
  )

  expect(diff).toEqual([['deleted', 0]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 2],
  )

  expect(diff).toEqual([['deleted', 1]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0, 1],
  )

  expect(diff).toEqual([['deleted', 2]])

  diff = arrayDifferences(
    [0, 1, 2],
    [0],
  )

  expect(diff).toEqual([['deleted', 1], ['deleted', 1]])

  diff = arrayDifferences(
    [0, 1, 2],
    [1],
  )

  expect(diff).toEqual([['deleted', 0], ['deleted', 1]])
})

test('It return the modified, inserted and deleted items in complex situations', () => {
  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 3],
  )

  expect(diff).toEqual([['modified', 1, 111], ['deleted', 2]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 2, 3, 112],
  )

  expect(diff).toEqual([['modified', 1, 111], ['inserted', 4, 112]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 2, 112, 3],
  )

  expect(diff).toEqual([['modified', 1, 111], ['inserted', 3, 112]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [1, 2, 111],
  )

  expect(diff).toEqual([['deleted', 0], ['modified', 2, 111]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 2, 111, 3],
  )

  expect(diff).toEqual([['deleted', 1], ['inserted', 2, 111]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 2, 3, 111],
  )

  expect(diff).toEqual([['deleted', 1], ['inserted', 3, 111]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [111, 0, 1, 2],
  )

  expect(diff).toEqual([['inserted', 0, 111], ['deleted', 4]])

  diff = arrayDifferences(
    [0, 1, 2, 3],
    [0, 111, 1, 2, 112],
  )

  expect(diff).toEqual([['inserted', 1, 111], ['modified', 4, 112]])

  diff = arrayDifferences(
    [0, 1, 2, 3, 4, 5, 6],
    [0, 111, 1, 2, 112, 4, 6],
  )

  expect(diff).toEqual([['inserted', 1, 111], ['modified', 4, 112], ['deleted', 6]])

  diff = arrayDifferences(
    [0, 1, 2, 3, 4, 5, 6],
    [111, 1, 112, 5, 7],
  )

  expect(diff).toEqual([['modified', 0, 111], ['modified', 2, 112], ['deleted', 3], ['deleted', 3], ['modified', 4, 7]])
})

test('It handles duplicates', () => {
  diff = arrayDifferences(
    [1, 1],
    [1, 1, 1],
  )

  expect(diff).toEqual([['inserted', 2, 1]])

  diff = arrayDifferences(
    [0, 0, 1, 1],
    [0, 1, 0, 1, 1],
  )

  expect(diff).toEqual([['inserted', 1, 1]])

  diff = arrayDifferences(
    [1, 1, 1],
    [1, 1],
  )

  expect(diff).toEqual([['deleted', 2]])

  diff = arrayDifferences(
    [0, 1, 1],
    [1, 1],
  )

  expect(diff).toEqual([['deleted', 0]])

  diff = arrayDifferences(
    [1, 1, 4, 1, 1],
    [1, 112, 1, 4, 1],
  )

  expect(diff).toEqual([['inserted', 1, 112], ['deleted', 4]])

  diff = arrayDifferences(
    [0, 1, 1, 4, 1, 1],
    [111, 1, 112, 1, 4, 1],
  )

  expect(diff).toEqual([['modified', 0, 111], ['inserted', 2, 112], ['deleted', 5]])
})

test('It return the minimum number of operations', () => {
  diff = arrayDifferences(
    [0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0],
  )

  expect(diff).toEqual([['deleted', 0], ['deleted', 0], ['inserted', 3, 0], ['inserted', 4, 0]])
})

test('It uses a custom comparison function', () => {
  diff = arrayDifferences(
    [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 4 }, { value: 1 }, { value: 1 }],
    [{ value: 111 }, { value: 1 }, { value: 112 }, { value: 1 }, { value: 4 }, { value: 1 }],
    (a, b) => a.value === b.value
  )

  expect(diff).toEqual([['modified', 0, { value: 111 }], ['inserted', 2, { value: 112 }], ['deleted', 5]])
})

test('It works with any litterals out of the box', () => {
  diff = arrayDifferences(
    ['b', 'b', 'a'],
    ['a', 'b', 'b'],
  )

  expect(diff).toEqual([['inserted', 0, 'a'], ['deleted', 3]])

  diff = arrayDifferences(
    [true, false],
    [false, false, true, true],
  )

  expect(diff).toEqual([['inserted', 0, false], ['inserted', 1, false], ['modified', 3, true]])
})
