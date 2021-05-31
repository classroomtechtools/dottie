# dottie.gs

Manipulate objects and their properties. Build jsons with sanity. Convert an array of jsons to spreadsheet-friendly 2d arrays, and back again. Made a cinch.

With thanks to [dot-object](https://github.com/rhalff/dot-object).

## Quickstart

- Script ID: `1k_EGzQ6FvfMlyifgPxcBqgPe3TQSWLFGF9VrDWAGU1wfOFnOFsRbI8V_`
- [Documentation](https://classroomtechtools.github.io/dottie/)
- Default identifier is `dottie` 

## Usage

- Use it to work with objects, such as copying properties
- Use it to flatten jsons into arrays, and back again
- Advanced: Use it inline

## Motivation

Working with jsons and objects can be tiresome to write out by hand, and there are easier ways to manipulate objects which other javascript frameworks can use. Why not bring that to gas?

I wrote this when working with the Google Chat Bot [cards service](https://developers.google.com/hangouts/chat/how-tos/cards-onclick), which requires writing jsons by hand. It was way easier for me to use dot notation.

I also use an array of jsons grabbed from external APIs, and write them to spreadsheets. So I added the two methods `jsonsToRows` and the reverse `rowsToJsons`, whose functionality depends upon the underyling methods.

## Use it to work with objects

Writing a Google Chat Bot using the card service using long-form jsons was a bit difficult. This is much more readable (and easier to edit) than writing out the object in long form:

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

### Example usage

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

## Use it to flatten jsons into arrays, and back again

### dottie.jsonsToRows

Takes an array of json objects and converts into a spreadsheet-friendly 2d array. The columns are named with dot notation according to the path of the properties. The first row contains the headers/columns (in alphabetical order) and the remaining rows are the values. 

Exmaple: 

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

Note that for paths in json which has an empty array, they are removed from the resulting array. 

### dottie.rowsToJsons

This is the reverse of `dottie.jsonsToRows`. 


## Usage of `.augment`

If using `dottie` namespace doesn't fit your brain, you can do this:

```js
dottie.augment(Object, Array);
```

That will let you use `{}.dottie.<method>` alternative syntax. Note that parameters are used differently too:

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
