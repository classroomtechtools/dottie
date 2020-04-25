function testObjectManip() {
  // set
  const setObj = set({}, 'path.to.value', 100);
  if (setObj.path.to.value !== 100) throw new Error("failed!");
  
  // get
  const getValue = get(setObj, 'path.to.value');
  if (getValue !== 100) throw new Error('failed');
  if (get(setObj, 'not.present') !== null) throw new Error("not null");

  // move
  const moveObj = set({}, 'from.this.here', '200');
  const result = move(moveObj, 'from.this.here', 'to.that.there');
  if (result.to.that.there !== '200') throw new Error("failed");
  
  // copy
  const copyObj = set({}, 'path.to.value', 300);
  const copiedObj = copy(copyObj, 'path.to.value', {}, 'copied.to.here');
  if (get(copiedObj, 'copied.to.here') !== 300) throw new Error("failed");
  
  // transfer
  const transferObj = set({}, 'path.to.value', 100);
  const transferredObj = transfer(transferObj, 'path.to.value', {}, 'transferred.to.here');
  if (get(transferObj, 'path.to.value') !== null) throw new Error("null");
  
  // expand
  const expandObj = {'path.to.value': 100};
  const expandedObj = expand(expandObj);
  if (get(expandedObj, 'path.to.value') !== 100) throw new Error("failed");
  
  // delete_
  const deleteObj = set({}, 'path.to.value', 100);
  delete_(deleteObj, 'path.to.value');
  if (get(deleteObj, 'path.to.value') !== null) throw new Error("failed");
  
  // remove 
  const removeObj = set({}, 'path.to.value', 100);
  remove(removeObj, 'path.to.value');
  if (get(removeObj, 'path.to.value') !== null) throw new Error("failed");
  
  // transform
  const transformObj = set({}, 'original.path.to.value', 100);
  const transformedObj = transform(transformObj, {'original.path.to.value': 'new.path.to.value'});
  if (get(transformedObj, 'new.path.to.value') !== 100) throw new Error('failed'); 
}
