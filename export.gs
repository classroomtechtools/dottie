/**
 * lib
 * @returns {DottieLib}
 */
function lib() {
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
  return Dottie.set({path, value, obj});
}


/**
 * Picks a value from the object without removing it. Returns null if not present.
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function get(obj, path) {
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
  return Dottie.transfer({sourcePath, destPath, obj, target});
}


/**
 * Converts an object with dotted-key/value pairs to it's expanded/normal version
 * @param {Object} obj
 * @return {Object}
 */
function expand (obj) {
  return Dottie.expand({obj});
}


/**
 * Delete a value using dot notation
 * @param {Object} obj
 * @param {String} path
 */
function delete_(obj, path) {
  return Dottie.delete_({obj, path});
}


/**
 * Remove a value using dot notation (and keep array indexes)
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function remove(obj, path) {
  return Dottie.remove({obj, path});
}


/**
 * Delete a value using dot notation (and adjust array indexes)
 * @param {Object} obj
 * @param {Object} path
 * @return {Object}
 */
function delete_(obj, path) {
  return Dottie.delete_({obj, path});
}


/**
 * Transform properties
 * @param {Object} obj
 * @param {Object} recipe
 * return {Object}
 */
function transform(obj, recipe) {
  return Dottie.transform({recipe, obj});
}


/**
 * Convert object to dotted-key/value pair
 * @param {Object} obj
 * @return {Object}
 */
function dot(obj) {
  return Dottie.dot({obj});
}


/**
 * Convert an array of jsons to 2d array
 * @param {Object[]} jsons
 * @return {Array[]}
 */
function jsonsToRows (jsons) {
  return Dottie.jsonsToRows({jsons});
}


/**
 *
 * @param {Array[]} rows
 * @return {Object[]}
 */
function rowsToJsons(rows) {
  return Dottie.rowsToJsons({rows});
}


/**
 * Add dottie namespace to Object and Array prototypes; advanced usage
 * @param {Object} Object
 * @param {Array} Array
 */
function augment (Object, Array) {
  Dottie.augment(Object, Array);
}
