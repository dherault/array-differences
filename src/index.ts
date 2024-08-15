export type DifferenceType<T = any> = ['inserted' | 'deleted' | 'modified', number, T?]

export function arrayDifferences<T = any>(arrayA: T[], arrayB: T[], comparisonFn = (x: T, y: T) => x === y) {
  checkArray(arrayA)
  checkArray(arrayB)

  const a = arrayA.slice()
  const b = arrayB.slice()

  /*
    Trim the left sides:
    [0, 1, 2]
    [0, 1, 3, 4]
    -->
    [2]
    [3, 4]
  */

  let leftIndexOffset = 0
  let l = Math.max(a.length, b.length)

  for (let i = 0; i < l; i++) {
    const x = a[i - leftIndexOffset]
    const y = b[i - leftIndexOffset]

    if (comparisonFn(x, y)) {
      a.shift()
      b.shift()
      leftIndexOffset++
    }
    else {
      break
    }
  }

  /*
    Trim the right sides:
    [0, 1, 2]
    [1, 3, 1, 2]
    -->
    [0]
    [1, 3]
  */

  const al = a.length
  const bl = b.length
  l = Math.max(a.length, b.length)

  for (let i = 0; i < l; i++) {
    const x = a[al - i - 1]
    const y = b[bl - i - 1]

    if (comparisonFn(x, y)) {
      a.pop()
      b.pop()
    }
    else {
      break
    }
  }

  if (a.length === 0 && b.length === 0) {
    return []
  }

  /*
    Build an object for incoherent keys.
    [0, 1, 2, 3]
    [1, 2, 4]
    -->
    aObject: { '0': 0, '3': 3 }
    bObject: { '2': 4 }
  */

  const aObject: Record<number, any> = {}
  const bObject: Record<number, any> = {}

  a.forEach((item, index) => aObject[leftIndexOffset + index] = item)
  b.forEach((item, index) => bObject[leftIndexOffset + index] = item)

  /*
    Let A = [0, 1, 2]
    Consider A, [1, 2], [2], [0, 2], [0], [0, 1] the subsets of a.
    And compare them to B in a competion to find the minimum of operations between A and B.
    If for a given index there is a match between A[index] and B[index], the index is deleted (not taken into account).
    The winner is the one that deletes the most indexes.
  */

  let indexesToDeleteA: number[] = []
  let indexesToDeleteB: number[] = []

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i; j++) {
      const currentIndexesToDeleteA: number[] = []
      const currentIndexesToDeleteB: number[] = []
      let maxIndex = 0

      Object.entries(aObject).forEach(([indexAString, itemA]) => {
        const indexA = parseInt(indexAString)

        if (indexA >= i && indexA < i + j) {
          return
        }

        for (let indexB = maxIndex; indexB < b.length; indexB++) {
          if (comparisonFn(itemA, b[indexB])) {
            maxIndex = indexB + 1
            currentIndexesToDeleteA.push(indexA)
            currentIndexesToDeleteB.push(indexB + leftIndexOffset)

            return
          }
        }
      })

      if (currentIndexesToDeleteA.length + currentIndexesToDeleteB.length > indexesToDeleteA.length + indexesToDeleteB.length) {
        indexesToDeleteA = currentIndexesToDeleteA
        indexesToDeleteB = currentIndexesToDeleteB
      }
    }
  }

  indexesToDeleteA.reverse().forEach(index => delete aObject[index])
  indexesToDeleteB.reverse().forEach(index => delete bObject[index])

  /*
    Resolve incoherences.
  */
  const results: DifferenceType<T>[] = []

  const aKeys = Object.keys(aObject).map(key => parseInt(key))
  const bKeys = Object.keys(bObject).map(key => parseInt(key))
  let keys = mergeDedupeSort(aKeys, bKeys) // In previous example: [0, 2, 3]

  do {
    const index = keys[0]
    const x = aObject[index]
    const y = bObject[index]

    if (typeof x === 'undefined') {
      results.push(['inserted', index, y])
      removeArrayItem(bKeys, index)
      incrementArrayItems(aKeys, 1)
      incrementObjectKeys(aObject, 1)
    }
    else if (typeof y === 'undefined') {
      results.push(['deleted', index])
      removeArrayItem(aKeys, index)
      incrementArrayItems(aKeys, -1)
      incrementObjectKeys(aObject, -1)
    }
    else {
      results.push(['modified', index, y])
      removeArrayItem(aKeys, index)
      removeArrayItem(bKeys, index)
    }

    keys = mergeDedupeSort(aKeys, bKeys)
  } while (keys.length)

  return results
}

function checkArray(array: any[]) {
  if (!Array.isArray(array)) {
    throw new Error('Argument is not an array')
  }
}

function sortSmallestFirst(a: number, b: number) {
  return a < b ? -1 : 1
}

function mergeDedupeSort(a: number[], b: number[]) {
  return [...new Set([...a, ...b])].sort(sortSmallestFirst)
}

function incrementObjectKeys(o: Record<string, any>, diff: number) {
  const keys = Object.keys(o)
  .map(key => parseInt(key))
  .sort(sortSmallestFirst)

  if (diff === 1) {
    keys.reverse()
  }

  keys.forEach(key => {
    o[key + diff] = o[key]

    delete o[key]
  })
}

function incrementArrayItems(a: number[], diff: number) {
  a.forEach((item, i, a) => a[i] = item + diff)
}

function removeArrayItem(a: number[], item: number) {
  a.splice(a.indexOf(item), 1)
}

export function reconstructArray<T>(array: T[], differences: DifferenceType<T>[], inPlace = false) {
  const a = inPlace ? array : array.slice()

  differences.forEach(([operation, index, value]) => {
    if (operation === 'inserted') {
      a.splice(index, 0, value!)
    }
    else if (operation === 'deleted') {
      a.splice(index, 1)
    }
    else if (operation === 'modified') {
      a[index] = value!
    }
  })

  return a
}
