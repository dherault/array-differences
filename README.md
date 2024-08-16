# array-differences

[![npm version](https://badge.fury.io/js/array-differences.svg)](https://badge.fury.io/js/array-differences)

Find the differences between two arrays and their positions.

## Installation

`npm install array-differences --save`

or

`yarn add array-differences`

## Usage

```js
import { diffArray } from 'array-differences'

const input = [0, 1, 1, 4, 1, 1]
const output = [111, 1, 112, 1, 4, 1]
const diff = diffArray(input, output)

--> [['modified', 0, 111], ['inserted', 2, 112], ['deleted', 5]]
```

Using a custom comparison function:

```js
const diff = diffArray(
  [{ name: 'John' }, { name: 'Marie' }],
  [{ name: 'John' }, { name: 'Marie' }, { name: 'Chloe' }],
  (a, b) => a.name === b.name
)

--> [['inserted', 2, { name: 'Chloe' }]]
```

You can recontruct the second array by iterating over the differences on the first array or using the utility:

```js
import { reconstructArray } from 'array-differences'

const reconstructed = reconstructArray(input, diff) // builds the output

// You can reconstruct in place:
reconstructArray(input, diff, true) // modifies input to recreate output from diff
```

## Undefined values

The algorythm does not support arrays containing `undefined` values. Please replace your `undefined` values with a placeholder before applying it.

## Performance on large arrays

Entry one is length m,

Entry two is length n,

Perfomance is m * m * n.

Therefore, it works best on smaller first arrays or if growing an array. Performance is best when differences indexes are close to one another in the array.

## License

MIT
