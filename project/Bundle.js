/* Bundle as defined from all files in src/modules/*.js */
const Import = Object.create(null);

'use strict';

(function (exports, window) {
// provide global (danger zone)
exports.__window = window;

Object.defineProperty(exports, '__esModule', { value: true });

function _process (v, mod) {
  var i;
  var r;

  if (typeof mod === 'function') {
    r = mod(v);
    if (r !== undefined) {
      v = r;
    }
  } else if (Array.isArray(mod)) {
    for (i = 0; i < mod.length; i++) {
      r = mod[i](v);
      if (r !== undefined) {
        v = r;
      }
    }
  }

  return v
}

function parseKey (key, val) {
  // detect negative index notation
  if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
    return val.length + parseInt(key, 10)
  }
  return key
}

function isIndex (k) {
  return /^\d+$/.test(k)
}

function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

function isArrayOrObject (val) {
  return Object(val) === val
}

function isEmptyObject (val) {
  return Object.keys(val).length === 0
}

var blacklist = ['__proto__', 'prototype', 'constructor'];
var blacklistFilter = function (part) { return blacklist.indexOf(part) === -1 };

function parsePath (path, sep) {
  if (path.indexOf('[') >= 0) {
    path = path.replace(/\[/g, '.').replace(/]/g, '');
  }

  var parts = path.split(sep);

  var check = parts.filter(blacklistFilter);

  if (check.length !== parts.length) {
    throw Error('Refusing to update blacklisted property ' + path)
  }

  return parts
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function DotObject (separator, override, useArray, useBrackets) {
  if (!(this instanceof DotObject)) {
    return new DotObject(separator, override, useArray, useBrackets)
  }

  if (typeof override === 'undefined') override = false;
  if (typeof useArray === 'undefined') useArray = true;
  if (typeof useBrackets === 'undefined') useBrackets = true;
  this.separator = separator || '.';
  this.override = override;
  this.useArray = useArray;
  this.useBrackets = useBrackets;
  this.keepArray = false;

  // contains touched arrays
  this.cleanup = [];
}

var dotDefault = new DotObject('.', false, true, true);
function wrap (method) {
  return function () {
    return dotDefault[method].apply(dotDefault, arguments)
  }
}

DotObject.prototype._fill = function (a, obj, v, mod) {
  var k = a.shift();

  if (a.length > 0) {
    obj[k] = obj[k] || (this.useArray && isIndex(a[0]) ? [] : {});

    if (!isArrayOrObject(obj[k])) {
      if (this.override) {
        obj[k] = {};
      } else {
        if (!(isArrayOrObject(v) && isEmptyObject(v))) {
          throw new Error(
            'Trying to redefine `' + k + '` which is a ' + typeof obj[k]
          )
        }

        return
      }
    }

    this._fill(a, obj[k], v, mod);
  } else {
    if (!this.override && isArrayOrObject(obj[k]) && !isEmptyObject(obj[k])) {
      if (!(isArrayOrObject(v) && isEmptyObject(v))) {
        throw new Error("Trying to redefine non-empty obj['" + k + "']")
      }

      return
    }

    obj[k] = _process(v, mod);
  }
};

/**
 *
 * Converts an object with dotted-key/value pairs to it's expanded version
 *
 * Optionally transformed by a set of modifiers.
 *
 * Usage:
 *
 *   var row = {
 *     'nr': 200,
 *     'doc.name': '  My Document  '
 *   }
 *
 *   var mods = {
 *     'doc.name': [_s.trim, _s.underscored]
 *   }
 *
 *   dot.object(row, mods)
 *
 * @param {Object} obj
 * @param {Object} mods
 */
DotObject.prototype.object = function (obj, mods) {
  var self = this;

  Object.keys(obj).forEach(function (k) {
    var mod = mods === undefined ? null : mods[k];
    // normalize array notation.
    var ok = parsePath(k, self.separator).join(self.separator);

    if (ok.indexOf(self.separator) !== -1) {
      self._fill(ok.split(self.separator), obj, obj[k], mod);
      delete obj[k];
    } else {
      obj[k] = _process(obj[k], mod);
    }
  });

  return obj
};

/**
 * @param {String} path dotted path
 * @param {String} v value to be set
 * @param {Object} obj object to be modified
 * @param {Function|Array} mod optional modifier
 */
DotObject.prototype.str = function (path, v, obj, mod) {
  var ok = parsePath(path, this.separator).join(this.separator);

  if (path.indexOf(this.separator) !== -1) {
    this._fill(ok.split(this.separator), obj, v, mod);
  } else {
    obj[path] = _process(v, mod);
  }

  return obj
};

/**
 *
 * Pick a value from an object using dot notation.
 *
 * Optionally remove the value
 *
 * @param {String} path
 * @param {Object} obj
 * @param {Boolean} remove
 */
DotObject.prototype.pick = function (path, obj, remove, reindexArray) {
  var i;
  var keys;
  var val;
  var key;
  var cp;

  keys = parsePath(path, this.separator);
  for (i = 0; i < keys.length; i++) {
    key = parseKey(keys[i], obj);
    if (obj && typeof obj === 'object' && key in obj) {
      if (i === keys.length - 1) {
        if (remove) {
          val = obj[key];
          if (reindexArray && Array.isArray(obj)) {
            obj.splice(key, 1);
          } else {
            delete obj[key];
          }
          if (Array.isArray(obj)) {
            cp = keys.slice(0, -1).join('.');
            if (this.cleanup.indexOf(cp) === -1) {
              this.cleanup.push(cp);
            }
          }
          return val
        } else {
          return obj[key]
        }
      } else {
        obj = obj[key];
      }
    } else {
      return undefined
    }
  }
  if (remove && Array.isArray(obj)) {
    obj = obj.filter(function (n) {
      return n !== undefined
    });
  }
  return obj
};
/**
 *
 * Delete value from an object using dot notation.
 *
 * @param {String} path
 * @param {Object} obj
 * @return {any} The removed value
 */
DotObject.prototype.delete = function (path, obj) {
  return this.remove(path, obj, true)
};

/**
 *
 * Remove value from an object using dot notation.
 *
 * Will remove multiple items if path is an array.
 * In this case array indexes will be retained until all
 * removals have been processed.
 *
 * Use dot.delete() to automatically  re-index arrays.
 *
 * @param {String|Array<String>} path
 * @param {Object} obj
 * @param {Boolean} reindexArray
 * @return {any} The removed value
 */
DotObject.prototype.remove = function (path, obj, reindexArray) {
  var i;

  this.cleanup = [];
  if (Array.isArray(path)) {
    for (i = 0; i < path.length; i++) {
      this.pick(path[i], obj, true, reindexArray);
    }
    if (!reindexArray) {
      this._cleanup(obj);
    }
    return obj
  } else {
    return this.pick(path, obj, true, reindexArray)
  }
};

DotObject.prototype._cleanup = function (obj) {
  var ret;
  var i;
  var keys;
  var root;
  if (this.cleanup.length) {
    for (i = 0; i < this.cleanup.length; i++) {
      keys = this.cleanup[i].split('.');
      root = keys.splice(0, -1).join('.');
      ret = root ? this.pick(root, obj) : obj;
      ret = ret[keys[0]].filter(function (v) {
        return v !== undefined
      });
      this.set(this.cleanup[i], ret, obj);
    }
    this.cleanup = [];
  }
};

/**
 * Alias method  for `dot.remove`
 *
 * Note: this is not an alias for dot.delete()
 *
 * @param {String|Array<String>} path
 * @param {Object} obj
 * @param {Boolean} reindexArray
 * @return {any} The removed value
 */
DotObject.prototype.del = DotObject.prototype.remove;

/**
 *
 * Move a property from one place to the other.
 *
 * If the source path does not exist (undefined)
 * the target property will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.move = function (source, target, obj, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(target, _process(this.pick(source, obj, true), mods), obj, merge);
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj, true), obj, merge);
  }

  return obj
};

/**
 *
 * Transfer a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.transfer = function (
  source,
  target,
  obj1,
  obj2,
  mods,
  merge
) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(
      target,
      _process(this.pick(source, obj1, true), mods),
      obj2,
      merge
    );
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj1, true), obj2, merge);
  }

  return obj2
};

/**
 *
 * Copy a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.copy = function (source, target, obj1, obj2, mods, merge) {
  if (typeof mods === 'function' || Array.isArray(mods)) {
    this.set(
      target,
      _process(
        // clone what is picked
        JSON.parse(JSON.stringify(this.pick(source, obj1, false))),
        mods
      ),
      obj2,
      merge
    );
  } else {
    merge = mods;
    this.set(target, this.pick(source, obj1, false), obj2, merge);
  }

  return obj2
};

/**
 *
 * Set a property on an object using dot notation.
 *
 * @param {String} path
 * @param {any} val
 * @param {Object} obj
 * @param {Boolean} merge
 */
DotObject.prototype.set = function (path, val, obj, merge) {
  var i;
  var k;
  var keys;
  var key;

  // Do not operate if the value is undefined.
  if (typeof val === 'undefined') {
    return obj
  }
  keys = parsePath(path, this.separator);

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    if (i === keys.length - 1) {
      if (merge && isObject(val) && isObject(obj[key])) {
        for (k in val) {
          if (hasOwnProperty.call(val, k)) {
            obj[key][k] = val[k];
          }
        }
      } else if (merge && Array.isArray(obj[key]) && Array.isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          obj[keys[i]].push(val[j]);
        }
      } else {
        obj[key] = val;
      }
    } else if (
      // force the value to be an object
      !hasOwnProperty.call(obj, key) ||
      (!isObject(obj[key]) && !Array.isArray(obj[key]))
    ) {
      // initialize as array if next key is numeric
      if (/^\d+$/.test(keys[i + 1])) {
        obj[key] = [];
      } else {
        obj[key] = {};
      }
    }
    obj = obj[key];
  }
  return obj
};

/**
 *
 * Transform an object
 *
 * Usage:
 *
 *   var obj = {
 *     "id": 1,
 *    "some": {
 *      "thing": "else"
 *    }
 *   }
 *
 *   var transform = {
 *     "id": "nr",
 *    "some.thing": "name"
 *   }
 *
 *   var tgt = dot.transform(transform, obj)
 *
 * @param {Object} recipe Transform recipe
 * @param {Object} obj Object to be transformed
 * @param {Array} mods modifiers for the target
 */
DotObject.prototype.transform = function (recipe, obj, tgt) {
  obj = obj || {};
  tgt = tgt || {};
  Object.keys(recipe).forEach(
    function (key) {
      this.set(recipe[key], this.pick(key, obj), tgt);
    }.bind(this)
  );
  return tgt
};

/**
 *
 * Convert object to dotted-key/value pair
 *
 * Usage:
 *
 *   var tgt = dot.dot(obj)
 *
 *   or
 *
 *   var tgt = {}
 *   dot.dot(obj, tgt)
 *
 * @param {Object} obj source object
 * @param {Object} tgt target object
 * @param {Array} path path array (internal)
 */
DotObject.prototype.dot = function (obj, tgt, path) {
  tgt = tgt || {};
  path = path || [];
  var isArray = Array.isArray(obj);

  Object.keys(obj).forEach(
    function (key) {
      var index = isArray && this.useBrackets ? '[' + key + ']' : key;
      if (
        isArrayOrObject(obj[key]) &&
        ((isObject(obj[key]) && !isEmptyObject(obj[key])) ||
          (Array.isArray(obj[key]) && !this.keepArray && obj[key].length !== 0))
      ) {
        if (isArray && this.useBrackets) {
          var previousKey = path[path.length - 1] || '';
          return this.dot(
            obj[key],
            tgt,
            path.slice(0, -1).concat(previousKey + index)
          )
        } else {
          return this.dot(obj[key], tgt, path.concat(index))
        }
      } else {
        if (isArray && this.useBrackets) {
          tgt[path.join(this.separator).concat('[' + key + ']')] = obj[key];
        } else {
          tgt[path.concat(index).join(this.separator)] = obj[key];
        }
      }
    }.bind(this)
  );
  return tgt
};

DotObject.pick = wrap('pick');
DotObject.move = wrap('move');
DotObject.transfer = wrap('transfer');
DotObject.transform = wrap('transform');
DotObject.copy = wrap('copy');
DotObject.object = wrap('object');
DotObject.str = wrap('str');
DotObject.set = wrap('set');
DotObject.delete = wrap('delete');
DotObject.del = DotObject.remove = wrap('remove');
DotObject.dot = wrap('dot');
['override', 'overwrite'].forEach(function (prop) {
  Object.defineProperty(DotObject, prop, {
    get: function () {
      return dotDefault.override
    },
    set: function (val) {
      dotDefault.override = !!val;
    }
  });
});
['useArray', 'keepArray', 'useBrackets'].forEach(function (prop) {
  Object.defineProperty(DotObject, prop, {
    get: function () {
      return dotDefault[prop]
    },
    set: function (val) {
      dotDefault[prop] = val;
    }
  });
});

DotObject._process = _process;

var dotObject = DotObject;

function Interface_ (name='', params={}) {
  class I_ {
    constructor (n, p) {
      this.name = `dottie.${n}`;
      this.params = p;
    }

    get req() {
      throw Error(`Missing at least one required parameter for ${this.name}: ${Object.keys(this.params)}`);
    }

    extra(kwargs) {
      if (Object.entries(kwargs).length > 0)
        throw Error(`Extra parameters passed to ${this.name}: ${Object.entries(kwargs)}`);
    }

    typecheck(args) {
      // arguments is an object-like array, need to flatten it so that we represent it as viewed from function scope
      let argObj = {};
      for (const prop in args) {
        argObj = {...argObj, ...args[prop]};
      }

      // now that both have matching types, let's go
      for (const prop in this.params) {
        if (this.params[prop] === 'any') continue;  // type of 'any' special meaning is to skip it
        if (this.params[prop] === 'array') {
          if (!Array.isArray(argObj[prop])) throw new Error(`Type mismatch in ${this.name}: "${prop}". Expected array but got ${typeof(argObj)}`);
        } else if (typeof(argObj[prop]) !== this.params[prop]) {
          throw new Error(`Type mismatch in ${this.name}: "${prop}". Expected ${typeof(this.params[prop])} but got ${typeof(argObj)}`);
        }
      }
    }
  }
  return new I_(name, params);
}


// create interfaces that allows us to enforce type checks
const MoveI = Interface_('move', {sourcePath: 'string', destPath: 'string', obj: 'object'});
const CopyI = Interface_('copy', {obj: 'object', sourcePath: 'string', target: 'object', destPath: 'string'});
const TransferI = Interface_('transfer', {sourcePath: 'string', destPath: 'string', obj: 'object', target: 'object'});
const ExpandI = Interface_('expand', {obj: 'object'});
const GetI = Interface_('get', {path: 'string', obj: 'object'});
const SetI = Interface_('set', {path: 'string', obj: 'object', value: 'any'});
const DeleteI = Interface_('delete', {path: 'string', obj: 'object'});
const RemoveI = Interface_('remove', {path: 'string', obj: 'object'});
const TransformI = Interface_('transform', {recipe: 'object', obj: 'object'});
const DotI = Interface_('dot', {obj: 'object'});
const JsonsI = Interface_('jsons', {jsons: 'array', priorityHeaders: 'array'});
const RowsI = Interface_('rows', {rows: 'array'});

/**
 * Internal class object. Global methods interface with these methods. If `augment` is used, these methods are augmented to Objects and Arrays with these function signatures.
 * @class
 */
class Dottie {

  /**
   * No instances are made, all these methods are static
   */
  constructor () {

  }

  /**
   * @see {@link move}
   * @param {Object} namedParameters
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.destPath
   * @param {Object} namedParameters.obj
   * @return {Object}
   */
  static move ({sourcePath=MoveI.req, destPath=MoveI.req, obj=MoveI.req, ...kwargs}={}) {
    MoveI.extra(kwargs);
    MoveI.typecheck(arguments);
    return dotObject.move(sourcePath, destPath, obj);
  }

  /**
   * @see {@link copy}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.target
   * @param {String} namedParameters.destPath
   * @return {Object}
   */
  static copy ({obj=CopyI.req, sourcePath=CopyI.req, target=CopyI.req, destPath=CopyI.req, ...kwargs}={}) {
    CopyI.extra(kwargs);
    CopyI.typecheck(arguments);
    return dotObject.copy(sourcePath, destPath, obj, target);
  }

  /**
   * @see {@link transfer}
   * @param {Object} namedParameters
   * @param {String} namedParameters.sourcePath
   * @param {String} namedParameters.destPath
   * @param {Object} namedParameters.obj
   * @param {Object} namedParameters.target
   * @return {Object}
   */
  static transfer ({sourcePath=TransferI.req, destPath=TransferI.req, obj=TransferI.req, target=TransferI.req, ...kwargs}={}) {
    TransferI.extra(kwargs);
    TransferI.typecheck(arguments);
    return dotObject.transfer(sourcePath, destPath, obj, target);
  }

  /**
   * @see {@link expand}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static expand ({obj=ExpandI.req, ...kwargs}={}) {
    ExpandI.extra(kwargs);
    ExpandI.typecheck(arguments);
    return dotObject.object(obj);
  }

  /**
   * @see {@link get}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Any}
   */
  static get ({path=GetI.req, obj=GetI.req, ...kwargs}={}) {
    GetI.extra(kwargs);
    GetI.typecheck(arguments);
    const result = dotObject.pick(path, obj);
    if (result === undefined) return null;
    return result;
  }

  /**
   * @see {@link set}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Any} namedParameters.value
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static set ({path=SetI.req, value=SetI.req, obj=SetI.req, ...kwargs}={}) {
    SetI.extra(kwargs);
    SetI.typecheck(arguments);
    return dotObject.str(path, value, obj);
  }

  /**
   * @see {@link delete_}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static delete ({path=DeleteI.req, obj=DeleteI.req, ...kwargs}={}) {
    DeleteI.extra(kwargs);
    DeleteI.typecheck(arguments);
    return dotObject.delete(path, obj);
  }

  /**
   * @see {@link remove}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static remove ({path=RemoveI.req, obj=RemoveI.req, ...kwargs}={}) {
    RemoveI.extra(kwargs);
    RemoveI.typecheck(arguments);
    return dotObject.remove(path, obj);
  }

  /**
   * @see {@link set}
   * @param {Object} namedParameters
   * @param {String} namedParameters.path
   * @param {Any} namedParameters.value
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static transform ({recipe=TransformI.req, obj=TransformI.req, ...kwargs}={}) {
    TransformI.extra(kwargs);
    TransformI.typecheck(arguments);
    return dotObject.transform(recipe, obj);
  }

  /**
   * @see {@link dot}
   * @param {Object} namedParameters
   * @param {Object} namedParameters.obj
   * @returns {Object}
   */
  static dot ({obj=DotI.req, ...kwargs}={}) {
    DotI.extra(kwargs);
    DotI.typecheck(arguments);
    return dotObject.dot(obj);
  }

  /**
   * @see {@link jsonsToRows}
   * @param {Object} namedParameters
   * @param {Object[]} namedParameters.jsons
   * @param {Array[String]} namedParameters.priorityHeaders
   * @returns {Array[]}
   */
  static jsonsToRows ({jsons=JsonsI.req, priorityHeaders=[], ...kwargs}={}) {
    JsonsI.extra(kwargs);
    JsonsI.typecheck(arguments);
    const headers = [];
    const values = [];

    // save values as dotted objects and store headers
    // remove any nulls
    for (const json of jsons) {
      const value = dotObject.dot(json);
      for (const [k, v] of Object.entries(value)) {
        if (v === null) {
          delete value[k];
        }
      }
      headers.push(Object.keys(value));
      values.push(value);
    }

    // row1 will consist of unique header columns, sorted alphabetically with id first
    // use array generics for most efficient manner of doing this
    const row1 = [...new Set([].concat(...headers))];
    row1.sort();
    for (const [i, h] of priorityHeaders.entries()) {
      const idx = row1.indexOf('id');
      if (idx !== -1) {
        row1.splice(idx, 1);      // remove
        row1.splice(i, 0, 'id');  // insert at front
      }

    }

    // the rest of the rows consits of the values in each column, or null if not present
    const rows = values.map(value => row1.map(column => value[column] || null));

    // concat the arrays efficiently for return
    return [row1, ...rows];
  }

  /**
   * @see {@link rowsToJsons}
   * @param {Object} namedParameters
   * @param {Any[][]} namedParameters.rows
   * @returns {Any[]}
   */
  static rowsToJsons ({rows=RowsI.req, ...kwargs}={}) {
    RowsI.extra(kwargs);
    RowsI.typecheck(arguments);
    const headers = rows[0];
    const objects = [];

    // go through row 1 to end
    for (const row of rows.slice(1)) {
      const dotted = row.reduce(
        function (acc, value, idx) {
          // safeguard if for some reason empty string for column or null
          const column = headers[idx] || null;
          if (!column) return acc;

          // set and return
          acc[column] = value;
          return acc;
        }, {}
      );
      const obj = dotObject.object(dotted);
      objects.push(obj);
    }
    return objects;
  }

  /*
    Sets up {}.dottie and [].dottie methods
    @param {Any} O - Pass your `Object`
    @param {Any} A - Pass your `Array`
   */
  static augment (O=null, A=null) {
    if (O === null) O = Object;
    if (A === null) A = Array;
    const me = this;
    !A.prototype.dottie && Object.defineProperty(A.prototype, 'dottie', {
      get: function () {
        return {
          jsonsToRows: ({priorityHeaders=[], ...kwargs}={}) => {
            return me.jsonsToRows({jsons:this, priorityHeaders});
          },
          rowsToJsons: ({...kwargs}={}) => {
            return me.rowsToJsons({rows: this});
          }
        };
      }
    });

    !O.prototype.dottie && Object.defineProperty(O.prototype, 'dottie', {
      get: function () {
        return {
          set: ({path, value}={}) => {
            return dotObject.str(path, value, this);
          },
          get: ({path}={}) => {
            return dotObject.pick(path, this);
          },
          move: ({path, destPath}={}) => {
            return dotObject.move(path, destPath, this);
          },
          copy: ({path, destPath, target}={}) => {
            return dotObject.copy(path, destPath, this, target);
          },
          transfer: ({path, destPath, target}={}) => {
            return dotObject.transfer(path, destPath, this, target);
          },
          expand: () => {
            return dotObject.object(this);
          },
          delete: ({path}={}) => {
            return dotObject.delete(path, this);
          },
          remove: ({path}) => {
            return dotObject.remove(path, this);
          },
          transform: ({recipe}={}) => {
            return dotObject.transform(recipe, this);
          },
          dot: ({target, path}={}) => {
            return dotObject.dot(this, target, path);
          }
        };
      }
    });
  }

}

exports.DotObject = dotObject;
exports.Dottie = Dottie;

})(Import, this);
try{exports.Import = Import;}catch(e){}
