/**
 * Returns the library itself; only useful for internal purposes such as testing
 * @ignore
 * @returns {DottieLib}
 */
function lib() {
  const {Dottie} = Import;
  return Dottie;
}


/**
 * Sets `value` at the location in `obj` as determined by `path`
 * @param {Object} obj
 * @param {String} path
 * @param {Any} value
 * @returns {Object}
 * @example
const path = 'path.to.key';
let obj = {};
obj = dottie.set(obj, path, 'value');
Logger.log(obj.path.to.key);  // 'value'
 */
function set(obj, path, value) {
  const {Dottie} = Import;
  return Dottie.set({path, value, obj});
}


/**
 * Returns the value at location indicated by `path` of `obj`
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 * @example
const path = 'path.to.key';
let obj = {};
obj = dottie.set(obj, path, 'value');
const result = dottie.get(obj, path);
Logger.log(result);  // 'value'
 */
function get(obj, path) {
  const {Dottie} = Import;
  return Dottie.get({path, obj});
}


/**
 * Move a property within one object to another location. In-place operation, returns obj. If sourcePath is undefined, nothing changed
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {String} destPath
 * @return {Object}
 * @example
const path = 'path.to.key';
const diffPath = 'a.different.path.to.key';
let obj = {};
obj = dottie.set(obj, path, 'value');
obj = dottie.move(obj, path, diffPath);
const first = dottie.get(obj, path);
const second = dottie.get(obj, diffPath);
Logger.log(first);  // undefined
Logger.log(second);  // 'value'
 */
function move(obj, sourcePath, destPath) {
  const {Dottie} = Import;
  return Dottie.move({sourcePath, destPath, obj})
}


/**
 * Copy property from one object to another object. If sourcePath is undefined, nothing changed. It returns the destination object, but the operation is in-place.
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {Object} target
 * @param {String} destPath
 * @returns {Object}
 * @example
const path = 'path.to.key';
const source = dottie.set({}, path, 'value');
const dest = {};
dottie.copy(source, path, dest, 'new.path.to.key');
const present = dottie.get(source, path);
const value = dottie.get(dest, path);
Logger.log(present);  // undefined
Logger.log(value);  // 'value'
 */
function copy (obj, sourcePath, target, destPath) {
  const {Dottie} = Import;
  return Dottie.copy({sourcePath, destPath, obj, target});
}


/**
 * Transfer property from one object to another. Removes from sourceObject. If sourcePath is undefined, nothing happens. Same as copy except does not remove from source.
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {Object} target
 * @param {String} destPath
 * @return {Object}
 * @example
const path = 'path.to.key';
const source = dottie.set({}, path, 'value');
const dest = {};
dottie.copy(source, dest, path, 'new.path.to.key');
const present = dottie.get(source, path);
const value = dottie.get(dest, path);
Logger.log(present);  // undefined
Logger.log(value);  // 'value'
 */
function transfer (obj, sourcePath, target, destPath) {
  const {Dottie} = Import;
  return Dottie.transfer({sourcePath, destPath, obj, target});
}


/**
 * Converts an object with dotted-key/value pairs to it's expanded/normal version
 * @param {Object} obj
 * @return {Object}
 */
function expand (obj) {
  const {Dottie} = Import;
  return Dottie.expand({obj});
}


/**
 * Remove a value using dot notation (and keep array indexes)
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function remove(obj, path) {
  const {Dottie} = Import;
  return Dottie.remove({obj, path});
}


/**
 * Delete a value using dot notation (and adjust array indexes)
 * @param {Object} obj
 * @param {Object} path
 * @return {Object}
 */
function delete_(obj, path) {
  const {Dottie} = Import;
  return Dottie.delete_({obj, path});
}


/**
 * Transform properties
 * @param {Object} obj
 * @param {Object} recipe
 * return {Object}
 */
function transform(obj, recipe) {
  const {Dottie} = Import;
  return Dottie.transform({recipe, obj});
}


/**
 * Convert object to dotted-key/value pair
 * @param {Object} obj
 * @return {Object}
 */
function dot(obj) {
  const {Dottie} = Import;
  return Dottie.dot({obj});
}


/**
 * Convert an array of jsons to a 2d array that can be used to populate a Google Spreadsheet with unique headers. The retuned object's first element are the header values whose string values are derived via path notation, and any nested objects or arrays follow the naming convention provided by dots (for objects) and brackets (for arrays).
 * @param {Object[]} jsons - An array of objects, which can contain native values or nested objects with native values
 * @param {Array} [priorityHeaders=[]] - A list of headers you want to appear first as the headers. Note, if header does not appear in any row, it will not appear at all even though you've specified it as priority.
 * @return {Array[]}
 * @example
 const jsons = [{
   obj: {
     key: 'value'
   },
   arr: [1, 2]
 }];
 const result = dottie.jsonsToRows(jsons);
 Logger.log(result);
 // [ ['obj.key', 'arr[0]', 'arry[1]'],
 //   ['value',   1,        2]
 */
function jsonsToRows (jsons, priorityHeaders=[]) {
  const {Dottie} = Import;
  return Dottie.jsonsToRows({jsons, priorityHeaders});
}


/**
 *
 * @param {Array[]} rows
 * @return {Object[]}
 */
function rowsToJsons(rows) {
  const {Dottie} = Import;
  return Dottie.rowsToJsons({rows, priorityHeaders});
}


/**
 * Alternative way to utilize library, where you use methods augmented on the Object and Array prototype, and use named parameters on the method calls. Optional "advanced use" mode.
 * @param {Object} Object - Pass in `Object`
 * @param {Array} Array - Pass in `Array`
 * @example
dottie.augment(Object, Array);
const path = 'path.to.key';
// now can use methods on objects and arrays
const obj = {}.dottie.set({path, value: 'value'});
const arr = [].dottie.jsonsToRows({jsons: [{'key': 'value'}]});
Logger.log(obj.dottie.get({path}));  // 'value'
 */
function augment (Object, Array) {
  const {Dottie} = Import;
  Dottie.augment(Object, Array);
}
