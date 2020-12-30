# dottie.gs

Manipulate objects and their properties. Build jsons with sanity. Convert an array of jsons to spreadsheet-friendly 2d arrays, and back again. Made a cinch.

With thanks to [dot-object](https://github.com/rhalff/dot-object).

## Motivation

Working with jsons and objects can be tiresome to write out by hand, and there are easier ways to manipulate objects which other javascript frameworks can use. Why not bring that to gas?

I wrote this when working with the Google Chat Bot [cards service](https://developers.google.com/hangouts/chat/how-tos/cards-onclick), which requires writing jsons by hand. It was way easier for me to use dot notation.

I also use an array of jsons grabbed from external APIs, and write them to spreadsheets. So I added the two methods `jsonsToRows` and the reverse `rowsToJsons`, whose functionality depends upon the underyling methods.

## Quickstart

Library project id: `MFuaGnV66TzMY39sIo0MYtIziaeauqu6_`. Using identifier `dottie` use autocomplete to see which methods are available for object minipulation. Any parameter `obj` is the object which is the source.

## NPM

`npm install @classroomtechtools/dottie`

## API

The file `export.gs` illustrates all of the methods that are available when used as an imported library. Autocomplete assists with this, too.

Alternatively, use it as an inline library (copied and pasted into your project), and see the Dottie class in `interface.gs` for the API.

If you use `.augment` this enables the "advanced" API where you have methods on `Object.prototype` and `Array.prototype`. 

## Example

Writing a Google Chat Bot using the card service using long-form jsons was a bit difficult. This is much more readable (and easier to edit) than writing out the object in long form:

```js
const cards = {};
const path = 'cards[0].sections[0].widgets[0].keyValue';
dottie.set(cards, `${path}.topLabel`, 'Ticket no.');
dottie.set(card,s `${path}.content`, ticketId.toString());
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

## Howto as imported library

Library project id: `MFuaGnV66TzMY39sIo0MYtIziaeauqu6_`

Methods on namespace `dottie` (or whatever identifier you choose) have autocomplete enabled. See `export.gs` for complete information, or just use autocomplete.

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


## Howto as inline library

Alternatively, copy and paste the `interface.gs`, `dot-object.gs` files into your project. Copying and pasting `export.gs` into your project will get you `set`, `get`, `move`, etc methods in the global space.

More "advanced" usage would be to call `Dottie.augment()` when used as an inline library, which provides you `{}.dottie` and `[].dottie` namespaces. The reason this way of working is tagged as "advanced" is that you have to interact with the methods with object parameters, and you'll have to look up in `Dottie` class static methods as needed.

Furthermore, any parameters named `obj` in the published API is not needed to be passed when used in this manner.


### Usage as inline library

Same as above, except no need for the `dottie` namespace … or … if you call `Dottie.augment()` you will then be able to do this:

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

### Usage of `dottie.augment()`

You can get `{}.dottie` and `[].dottie` mode while using dottie as an imported library if you so which, by calling `dottie.augment(Object, Array)`. This is not highly advertised as it sounds like a bit of pain; you'll have to look up the methods and usage on this github (since it won't be in your project).  Or maybe the conventions used here are so obvious you won't have to look them up?

### Errors thrown

It is the author's opinion that a library should throw errors if its API is used wrongly, instead of failing at some obscure code path. This ensures that the developer understands how to use the library correctly.

For that reason, type-checking is enabled. Dottie throws an error with explanation if:

* its methods are passed with incompatible or unexpected types
* if required parameters are not passed
* more than the necessary parameters are passed


## Special Methods

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

### dottie.rowsToJsons

This is the reverse of `dottie.jsonsToRows`.

