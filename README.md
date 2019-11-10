# array-differences

[![npm version](https://badge.fury.io/js/array-differences.svg)](https://badge.fury.io/js/array-differences)

Find the differences between two arrays and their positions.

## Installation

`npm install array-differences --save`

or

`yarn add array-differences`

## Usage

```js
import arrayDifferences from 'array-differences'

const diff = arrayDifferences(
  [0, 1, 1, 4, 1, 1],
  [111, 1, 112, 1, 4, 1],
)

--> [['modified', 0, 111], ['inserted', 2, 112], ['deleted', 5]]
```

You can recontruct the second array by iterating over the differences on the first array.

Using a custom comparison function:

```js
const diff = arrayDifferences(
  [{ name: 'John' }, { name: 'Marie' }],
  [{ name: 'John' }, { name: 'Marie' }, { name: 'Chloe' }],
  (a, b) => a.name === b.name
)

--> [['inserted', 2, { name: 'Chloe' }]]
```

## Performance on large arrays

Entry one is length n,

Entry two is length m,

Perfomance is n * n * m.

Therefore, it works best on small arrays.

## License

MIT
