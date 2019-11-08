function arrayDifferences(arrayA, arrayB, comparisonFn = defaultComparisonFn) {
  checkArray(arrayA)
  checkArray(arrayB)

  const a = arrayA.slice()
  const b = arrayB.slice()

  let leftIndexOffset = 0
  let l = Math.max(a.length, b.length)

  for (let i = 0; i < l; i++) {
    const x = a[i - leftIndexOffset]
    const y = b[i - leftIndexOffset]

    if (typeof x === 'undefined' && typeof y === 'undefined') {
      break
    }

    if (comparisonFn(x, y)) {
      a.shift()
      b.shift()
      leftIndexOffset++
    }
    else {
      break
    }
  }

  const al = a.length
  const bl = b.length
  l = Math.max(a.length, b.length)

  for (let i = 0; i < l; i++) {
    const x = a[al - i - 1]
    const y = b[bl - i - 1]

    if (typeof x === 'undefined' && typeof y === 'undefined') {
      break
    }

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

  const aObject = {}
  const bObject = {}

  a.forEach((item, index) => aObject[leftIndexOffset + index] = item)
  b.forEach((item, index) => bObject[leftIndexOffset + index] = item)

  let maxIndex = 0
  const indexesToDeleteA = []
  const indexesToDeleteB = []

  Object.entries(aObject).forEach(([indexA, itemA]) => {
    for (let indexB = maxIndex; indexB < b.length; indexB++) {
      if (comparisonFn(itemA, b[indexB])) {
        maxIndex = indexB

        indexesToDeleteA.push(indexA)
        indexesToDeleteB.push(indexB + leftIndexOffset)

        return
      }
    }
  })

  indexesToDeleteA.reverse().forEach(index => delete aObject[index])
  indexesToDeleteB.reverse().forEach(index => delete bObject[index])

  const results = []

  const aKeys = Object.keys(aObject).map(key => parseInt(key))
  const bKeys = Object.keys(bObject).map(key => parseInt(key))
  let keys = mergeDedupeSort(aKeys, bKeys)

  do {
    const index = keys[0]
    const x = aObject[index]
    const y = bObject[index]

    if (typeof x === 'undefined' && typeof y === 'undefined') {
      break
    }

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

function checkArray(array) {
  if (!Array.isArray(array)) {
    throw new Error('Argument is not an array')
  }
}

function defaultComparisonFn(x, y) {
  return x === y
}

function mergeDedupeSort(a, b) {
  return [...new Set([...a, ...b])].sort()
}

function incrementObjectKeys(o, diff) {
  const keys = Object.keys(o).sort()

  if (diff === 1) {
    keys.reverse()
  }

  keys.forEach(key => {
    o[parseInt(key) + diff] = o[key]

    delete o[key]
  })

  return o
}

function incrementArrayItems(a, diff) {
  a.forEach((item, i, a) => a[i] = item + diff)

  return a
}

function removeArrayItem(a, item) {
  const i = a.indexOf(item)

  a.splice(i, 1)

  return a
}

module.exports = arrayDifferences
