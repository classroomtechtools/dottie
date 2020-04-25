/**
 * lib
 * @returns {DotmitizerLib}
 */
function lib() {
  return Dotmitizer;
}


/**
 * @param {Object} obj
 * @param {String} sourcePath
 * @param {String} destPath
 * @return {Object}
 */
function move(obj, sourcePath, destPath) {
  return Dotmitizer.move({sourcePath, destPath, obj})
}

/**
 * Copy property from one object to another
 * @param {Object} sourceObject
 * @param {String} sourcePath
 * @param {Object} destObject 
 * @param {String} destPath
 * @returns {Object}
 */
function copy (sourceObject, sourcePath, destObject, destPath) {
  return Dotmitizer.copy({sourcePath, destPath, sourceObject, destObject});
}

/**
 * Transfer property from one object to another
 * @param {Object} sourceObject
 * @param {String} sourcePath
 * @param {Object} destObject
 * @param {String} destPath
 * @return {Object}
 */
function transfer (source, sourcePath, target, destPath) {
  return Dotmitizer.transfer({sourcePath, destPath, source, target});
}

/**
 * Expand to an object
 * @param {Object} obj
 * @return {Object}
 */
function expand (obj) {
  return Dotmitizer.expand({obj});
}

/**
 * To convert manually per string use
 * @param {Object} obj
 * @param {String} path
 * @param {Any} value
 * @returns {Object}
 */
function set(obj, path, value) {
  return Dotmitizer.set({path, value, obj});
}

/**
 * Picks a value from the object without removing it.
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function get(obj, path) {
  return Dotmitizer.get({path, obj});
}


/** 
 * Delete a value using dot notation
 * @param {Object} obj
 * @param {String} path
 */
function delete_(obj, path) {
  return Dotmitizer.delete_({obj, path});
}


/** 
 * Remove a value using dot notation
 * @param {Object} obj
 * @param {String} path
 * @return {Any}
 */
function remove(obj, path) {
  return Dotmitizer.remove({obj, path});
}


/** 
 * Transform object
 * @param {Object} recipe
 * @param {Object} source
 * @return {Object}
 */
function delete_(obj, path) {
  return Dotmitizer.delete_({obj, path});
}


/** 
 * Convert object to dotted-key/value pair
 * @param {Object} obj
 * @return {Object}
 */ 
function dot(obj) {
  return Dotmitizer.dot({obj});
}


/**
 * Convert an array of jsons to 2d array
 * @param {Object[]} jsons
 * @return {Array[]}
 */
function jsonsTo2dArray (jsons) {
  return Dotmitizer.jsonsTo2dArray({jsons});
}
