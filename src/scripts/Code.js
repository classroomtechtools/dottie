/**
 * lib
 * @returns {DottieLib}
 */
function lib() {
  const {Dottie} = Import;
  return Dottie;
}


/**
 * To convert manually per string use
 * @param {Object} obj
 * @param {String} path
 * @param {Any} value
 * @returns {Object}
 */
function set(obj, path, value) {
  const {Dottie} = Import;
  return Dottie.set({path, value, obj});
}


/**
 * Picks a value from the object without removing it. Returns null if not present.
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
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
 */
function move(obj, sourcePath, destPath) {
  const {Dottie} = Import;
  return Dottie.move({sourcePath, destPath, obj})
}


/**
 * Copy property from one object to another object. If sourcePath is undefined, nothing changed
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {Object} destObject
 * @param {String} destPath
 * @returns {Object}
 */
function copy (obj, sourcePath, destObject, destPath) {
  const {Dottie} = Import;
  return Dottie.copy({sourcePath, destPath, obj, destObject});
}


/**
 * Transfer property from one object to another. Removes from sourceObject. If sourcePath is undefined, nothing happens
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {Object} target
 * @param {String} destPath
 * @return {Object}
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
 * @return {Array[]}
 * @example
 const jsons = [{
   obj: {
     key: 'value'
   },
   arr: [1, 2]
 }];
 const result = Dottie.jsonsToRows(jsons);
 Logger.log(result);
 // [ ['obj.key', 'arr[0]', 'arry[1]'],
 //   ['value',   1,        2]
 */
function jsonsToRows (jsons) {
  const {Dottie} = Import;
  return Dottie.jsonsToRows({jsons});
}


/**
 *
 * @param {Array[]} rows
 * @return {Object[]}
 */
function rowsToJsons(rows) {
  const {Dottie} = Import;
  return Dottie.rowsToJsons({rows});
}


/**
 * Add dottie namespace to Object and Array prototypes; advanced usage
 * @param {Object} Object
 * @param {Array} Array
 */
function augment (Object, Array) {
  const {Dottie} = Import;
  Dottie.augment(Object, Array);
}
