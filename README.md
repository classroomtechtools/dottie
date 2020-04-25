# Dotmitizer

Manipulate object properties, made a cinch. 

A gas library wrapping [dot-object](https://github.com/rhalff/dot-object) for convenience, and adding a very useful `jsonsTo2dArray` method which utilizes the underlying property manipulation methods.

The property manipulation methods would be useful in a variety of applications that make heavy use of objects.

In particular, `jsonsTo2dArray` is useful when trying to get data returned from APIs reflected onto a Google Sheet. You should be able to call `.setValues()` with the returned data.

## Quickstart

Library project id: `MFuaGnV66TzMY39sIo0MYtIziaeauqu6_`

Methods in `Dotmitizer.*` have autocomplete enabled. Type-checking is enabled and will throw an error if developer uses wrong types.

Alternatively, copy and paste the `interface.gs`, `dot-object.gs` (and `license.gs`) files into your project.

### Methods

#### jsonsTo2dArray

Takes an array of json objects and converts into a spreadsheet-friendly 2d array. The columns are named with dot notation according to the path of the properties. The first row contains the headers/columns (in alphabetical order) and the remaining rows are the values. 

Exmaple: 

```js


const jsons = [
  {one: {two: 2}},
  {one: {two: 2, three: 3}},
  {another: 'one'}
];
const result = jsonsTo2dArray(jsons);
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

#### Property Manipulations

The following methods are exposed as `Dotmitizer.*`; please see [dot-object readme](https://github.com/rhalff/dot-object/blob/master/src/dot-object.js) for more info.

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
