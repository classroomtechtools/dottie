# dottie.gs

Manipulate objects and their properties. Build jsons with sanity. Convert jsons to spreadsheet-friendly 2d arrays, and back again. Made a cinch.

With thanks to [dot-object](https://github.com/rhalff/dot-object).

## Motivation

Working with jsons and objects can be tiresome to write out by hand, and there are easier ways to manipulate objects which other javascript frameworks can use. Why not bring that to gas?

I wrote this when working with the Google Chat Bot [cards service](https://developers.google.com/hangouts/chat/how-tos/cards-onclick), which requires writing jsons by hand. It was way easier for me to use dot notation.

I also use an array of jsons grabbed from external APIs, and write them to spreadsheets. So I added the two methods `jsonsToRows` and the reverse `rowsToJsons`, whose functionality depends upon the underyling methods.

## Quickstart as imported library

Library project id: `MFuaGnV66TzMY39sIo0MYtIziaeauqu6_`

Methods have autocomplete enabled. Type-checking is enabled and will throw an error if developer uses wrong types.

## Quickstart as inline library

Alternatively, copy and paste the `interface.gs`, `dot-object.gs` files into your project. You then have the `Dottie` namespace with same methods as the main library. Copying and pasting `export.gs` into your project will get you `set`, `get`, `move`, methods, etc.

More "advanced" usage would be to call `Dottie.augment()` and you get `{}.dottie` and `[].dottie` namespaces. The reason this way of working is tagged as "advanced" is that you have to interact with the methods with named parameters, and you'll have to look up in `Dottie` class static methods as needed. 

## Usage as imported library

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

## Usage as inline library

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

## Methods

### jsonsTo2dArray

Takes an array of json objects and converts into a spreadsheet-friendly 2d array. The columns are named with dot notation according to the path of the properties. The first row contains the headers/columns (in alphabetical order) and the remaining rows are the values. 

Exmaple: 

```js
const jsons = [
  {one: {two: 2}},
  {one: {two: 2, three: 3}},
  {another: 'one'}
];
const result = dottie.jsonsTo2dArray(jsons);
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

### Property Manipulations

The following methods are exposed as `Dottie.*`; please see [dot-object readme](https://github.com/rhalff/dot-object/blob/master/src/dot-object.js) for more info.

```
/**
 * To set values by path string
 * @param {Object} obj
 * @param {String} path
 * @param {Any} value
 * @returns {Object}
 */
function set(obj, path, value) {}


/**
 * Retrieves a value from the object without removing it.
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function get(obj, path) {}


/**
 * Move a property within one object to another location
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {String} destPath
 * @return {Object}
 */
function move(obj, sourcePath, destPath) {}


/**
 * Copy property from one object to another
 * @param {Object} sourceObject
 * @param {String} sourcePath
 * @param {Object} destObject 
 * @param {String} destPath
 * @returns {Object}
 */
function copy (sourceObject, sourcePath, destObject, destPath) {}


/**
 * Transfer property from one object to another
 * @param {Object} sourceObject
 * @param {String} sourcePath
 * @param {Object} destObject
 * @param {String} destPath
 * @return {Object}
 */
function transfer (source, sourcePath, target, destPath) {}

/**
 * Transform properties
 * @param {Object} recipe
 * @param {Object} source
 * return {Object}
 */
function transform(recipe, source) {}


/**
 * Expand to an object (convert dot notations to full object)
 * @param {Object} obj
 * @return {Object}
 */
function expand (obj) {}


/** 
 * Delete a value using dot notation
 * @param {Object} obj
 * @param {String} path
 */
function delete_(obj, path) {}


/** 
 * Remove a value using dot notation (and keep array indexes)
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function remove(obj, path) {}


/** 
 * Delete a value using dot notation (and adjust array indexes)
 * @param {Object} obj 
 * @param {Object} path
 * @return {Object}
 */
function delete_(obj, path) {}


/** 
 * Convert object to dotted-key/value pair
 * @param {Object} obj
 * @return {Object}
 */ 
function dot(obj) {}


/**
 * Convert an array of jsons to 2d array
 * @param {Object[]} jsons
 * @return {Array[]}
 */
function jsonsTo2dArray (jsons) {}
```
