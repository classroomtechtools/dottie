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
const CopyI = Interface_('copy', {sourceObject: 'object', sourcePath: 'string', destObject: 'object', destPath: 'string'});
const TransferI = Interface_('transfer', {sourcePath: 'string', destPath: 'string', source: 'object', target: 'object'});
const ExpandI = Interface_('expand', {obj: 'object'});
const GetI = Interface_('get', {path: 'string', obj: 'object'});
const SetI = Interface_('set', {path: 'string', obj: 'object', value: 'any'});
const DeleteI = Interface_('delete_', {path: 'string', obj: 'object'});
const RemoveI = Interface_('remove', {path: 'string', obj: 'object'});
const TransformI = Interface_('transform', {recipe: 'object', source: 'object'});
const DotI = Interface_('dot', {obj: 'object'});
const JsonsI = Interface_('jsons', {jsons: 'array'});
const RowsI = Interface_('rows', {rows: 'array'});


class Dottie {
    
  static move ({sourcePath=MoveI.req, destPath=MoveI.req, obj=MoveI.req, ...kwargs}={}) {
    MoveI.extra(kwargs);
    MoveI.typecheck(arguments);
    return DotObject.move(sourcePath, destPath, obj);
  }
  
  static copy ({sourceObject=CopyI.req, sourcePath=CopyI.req, destObject=CopyI.req, destPath=CopyI.req, ...kwargs}={}) {
    CopyI.extra(kwargs);
    CopyI.typecheck(arguments);
    return DotObject.copy(sourcePath, destPath, sourceObject, destObject);
  }
  
  static transfer ({sourcePath=TransferI.req, destPath=TransferI.req, source=TransferI.req, target=TransferI.req, ...kwargs}={}) {
    TransferI.extra(kwargs);
    TransferI.typecheck(arguments);
    return DotObject.transfer(sourcePath, destPath, source, target);
  }
  
  static expand ({obj=ExpandI.req, ...kwargs}={}) {
    ExpandI.extra(kwargs);
    ExpandI.typecheck(arguments);
    return DotObject.object(obj);
  }
  
  static get ({path=GetI.req, obj=GetI.req, ...kwargs}={}) {
    GetI.extra(kwargs);
    GetI.typecheck(arguments);
    const result = DotObject.pick(path, obj);
    if (result === undefined) return null;
    return result;
  }
  
  static set ({path=SetI.req, value=SetI.req, obj=SetI.req, ...kwargs}={}) {
    SetI.extra(kwargs);
    SetI.typecheck(arguments);
    return DotObject.str(path, value, obj);
  }
  
  static delete_ ({path=DeleteI.req, obj=DeleteI.req, ...kwargs}={}) {
    DeleteI.extra(kwargs);
    DeleteI.typecheck(arguments);
    return DotObject.delete(path, obj);
  }
  
  static remove ({path=RemoveI.req, obj=RemoveI.req, ...kwargs}={}) {
    RemoveI.extra(kwargs);
    RemoveI.typecheck(arguments);
    return DotObject.remove(path, obj);
  }
  
  static transform ({recipe=TransformI.req, source=TransformI.req, ...kwargs}={}) {
    TransformI.extra(kwargs);
    TransformI.typecheck(arguments);
    return DotObject.transform(recipe, source);
  }
  
  static dot ({obj=DotI.req, ...kwargs}={}) {
    DotI.extra(kwargs);
    DotI.typecheck(arguments);
    return DotObject.dot(obj);
  }
  
  static jsonsToRows ({jsons=JsonsI.req, ...kwargs}={}) {
    JsonsI.extra(kwargs);
    JsonsI.typecheck(arguments);
    const headers = [];
    const values = [];
    
    // save values as dotted objects and store headers
    for (const json of jsons) {
      const value = DotObject.dot(json);
      headers.push(Object.keys(value));
      values.push(value);
    }
    
    // row1 will consist of unique header columns, sorted alphabetically
    // use array generics for most efficient manner of doing this
    const row1 = [...new Set([].concat(...headers))];
    row1.sort();
    
    // the rest of the rows consits of the values in each column, or null if not present
    const rows = values.map(value => row1.map(column => value[column] || null));

    // concat the arrays efficiently for return
    return [row1, ...rows];
  }
  
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
      const obj = DotObject.object(dotted);
      objects.push(obj);
    }
    return objects;
  }

  /*
    Use this to use {}.dottie and [].dottie methods
   */
  static augment () {
    Object.defineProperty(Array.prototype, 'dottie', {
      get: function () {
        return {
          jsonsToRows: ({...kwargs}={}) => {
            Logger.log(Object.keys(this));
            return Dottie.jsonsToRows({jsons:this});
          },
          rowsToJsons: ({...kwargs}={}) => {
            return Dottie.rowsToJsons({rows: this});
          }
        };
      }
    });
  
    Object.defineProperty(Object.prototype, 'dottie', {
      get: function () {
        return {
          set: ({...kwargs}={}) => {
            return Dottie.set({obj:this, ...kwargs});
          },
          get: ({...kwargs}={}) => {
            return Dottie.get({obj:this, ...kwargs});
          },
          move: ({...kwargs}={}) => {
            return Dottie.move({obj: this, ...kwargs});
          },
          copy: ({...kwargs}={}) => {
            return Dottie.copy({sourceObject:this, ...kwargs});
          },
          transfer: ({...kwargs}={}) => {
            return Dottie.transfer({source: this, ...kwargs});
          },
          expand: ({...kwargs}={}) => {
            return Dotimitizer.expand({obj: this, ...kwargs});
          },
          delete_: ({...kwargs}={}) => {
            return Dottie.delete_({obj:this, ...kwargs});
          },
          remove: ({...kwargs}={}) => {
            return Dottie.remove({obj: this, ...kwargs});
          },
          transform: ({...kwargs}={}) => {
            return Dottie.transform({source: this, ...kwargs});
          },
          dot: ({...kwargs}={}) => {
            return Dottie.dot({obj: this, ...kwargs});
          }
        };
      }
    });
  }

}
