# dottie.gs

Convert an array of jsons to spreadsheet-friendly 2d arrays, and back again. Work with nested objects. Made a cinch.

With thanks to [dot-object](https://github.com/rhalff/dot-object).

## Quickstart

- Script ID: `1k_EGzQ6FvfMlyifgPxcBqgPe3TQSWLFGF9VrDWAGU1wfOFnOFsRbI8V_`
- Default identifier is `dottie` 
- See [Documentation](https://classroomtechtools.github.io/dottie/)


## Usage

- Use it to flatten jsons from apis into 2-d arrays, and back again
- Use it to work with objects, such as copying properties
- Advanced: Use it inline

### Use it to flatten jsons into arrays, and back again

#### dottie.jsonsToRows

Takes an array of json objects and converts into a spreadsheet-friendly 2d array. The columns are named with dot notation according to the path of the properties. The first row contains the headers/columns (in alphabetical order) and the remaining rows are the values. 

#### Examples: 

```js
const jsons = [
  {one: {two: 2}},
  {one: {two: 2, three: 3}},
  {another: 'one'}
];
const result = dottie.jsonsToRows(jsons);
Logger.log(result);
```

Result is (formatted for readability):

```js
[
  ['another', 'one.three', 'one.two'],
  [  null,       null,        2.0],
  [  null,       3.0,         2.0],
  [  'one',      null,        null]
]
```

> Note that `.jsonsToRows` doesn't try to normalize or adjust the values in any way. If you need it to output in some specific manner, the idea is to adjust the jsons themselves to produce the desired result

For example, we have the following structure, but you want to ensure that the spreadsheet has consistent amount of columns:

```js
const jsons = [
  {
    value: 'value',
    arr: [
      {first: 'first'},
      {second: 'second'}
    ]
  }
]
for (const json of jsons) {
  json.arr.length = 5;  // guaranteed to be five columns long!
}
dottie.jsonsToRows(jsons);
```

You can also define the order in which the columns are given in the second paramter:

```js
const jsons = /* ... */;
dottie.jsonsToRows(jsons, ['id', 'name']);
```

> If there are more columns than `id` and `name`, the remaining columns will be output after those, in alphabetical order.

#### dottie.rowsToJsons

This is the reverse of `dottie.jsonsToRows`. 

### Use it to work with objects

Working with jsons can be bit difficult. The following is much more readable (and easier to edit) than writing out the object in long form:

```js
const cards = {};
const path = 'cards[0].sections[0].widgets[0].keyValue';
dottie.set(cards, `${path}.topLabel`, 'Ticket no.');
dottie.set(cards, `${path}.content`, ticketId.toString());
dottie.set(cards, `${path}.contentMultiline`, false);
dottie.set(cards, `${path}.bottomLabel`, item.priority.toUpperCase());
dottie.set(cards, `${path}.icon`, 'TICKET'); 
Logger.log(cards);
/*
{
  cards: [
    {
      sections: [
        {
          widgets: [
            {
              keyValue: {
                topLabel: 'Ticket no.',
                content: '<id>',
                contentMultiline: false,
                bottomLabel: 'HIGH'
              }
          ]
        }
      ]
    }
  ]
*/
```

Example usage

```js
const obj = dottie.set({}, 'path.to.value', 100);
Logger.log(obj);
/* 
{
  path: {
    to: {
      value: 100
    }
  }
}
*/
const value = dottie.get(obj, 'path.to.value');
Logger.log(value);
/*
100
*/

const obj = dottie.set({}, 'path.to.array[0].name', 'Bob');
Logger.log(obj);
/*
{
  path: {
    to: {
      array: [
        {name: "Bob"}
      ]
    }
  }
}
*/
```



### Advanced: Usage of `.augment`

If using `dottie` namespace doesn't fit your brain, you can do this:

```js
dottie.augment(Object, Array);
```

That will let you use `{}.dottie.<method>` alternative syntax. Note that parameters are not positional:

```js
const obj = {}.dottie.set({path: 'path.to.value', value: 100});
Logger.log(obj);
/* 
{
  path: {
    to: {
      value: 100
    }
  }
}
*/
const value = obj.dottie.get({path: 'path.to.value'});
Logger.log(value);
/*
100
*/

const obj = {}.dottie.set({path: 'path.to.array[0].name', value: 'Bob'});
Logger.log(obj);
/*
{
  path: {
    to: {
      array: [
        {name: "Bob"}
      ]
    }
  }
}
*/
```

## Notes

### Errors thrown

It is the author's opinion that a library should throw errors if its API is used wrongly, instead of failing at some obscure code path. This ensures that the developer understands how to use the library correctly.

For that reason, type-checking is enabled. Dottie throws an error with explanation if:

* its methods are passed with incompatible or unexpected types
* if required parameters are not passed
* more than the necessary parameters are passed
