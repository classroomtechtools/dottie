import test from 'ava';
import {Dottie} from '../src/modules/Dottie.js';

let obj = {};
let path, value;

test("Dottie.set", t => {
    path = 'path.to.value';
    Dottie.set({obj, path, value: 100});
    t.true(obj.path.to.value == 100);
    path = 'path.to.array[1].name';
    Dottie.set({obj, path, value: 'name'});
    t.true(obj.path.to.array[1].name == 'name');
});

test("Dottie.get", t => {
    path = 'path.to.value';
    Dottie.set({obj, path, value: 100});
    value = Dottie.get({obj, path});
    t.true(value == 100);
    path = 'not.present';
    value = Dottie.get({obj, path});
    t.true(value === null);
});

test("Dottie.move", t => {
    obj = {};
    path = 'from.this';
    Dottie.set({obj, path, value: 'value'});
    let ppath = 'to.this';
    Dottie.move({obj, sourcePath: path, destPath: ppath});
    value = Dottie.get({obj, path:ppath});
    t.true(value == 'value');
});

test("Dottie.copy", t => {
    obj = {};
    let oobj = {};
    path = 'path.to.value';
    let ppath = 'different.path';
    Dottie.set({obj, path, value: 300});
    Dottie.copy({obj, sourcePath: path, destPath: ppath, target: oobj});
    value = Dottie.get({obj: oobj, path: ppath});
    t.true(value == 300);
});

test("Dottie.transfer", t => {
    obj = {};
    let oobj = {};
    path = 'path.to.value';
    let ppath = 'different.path.to.value';
    Dottie.set({obj, path, value: 100});
    Dottie.transfer({obj, sourcePath: path, target: oobj, destPath: ppath});
    value = Dottie.get({obj, path});
    let vvalue = Dottie.get({obj: oobj, path: ppath});
    t.true(value === null);
    t.true(vvalue == 100);
});

test("Dottie.expand", t => {
    obj = {'path.to.value': 100};
    let result = Dottie.expand({obj});
    t.true(result.path.to.value === 100);
});

test("Dottie.delete", t => {
    obj = {};
    path = 'path.to.value';
    Dottie.set({obj, path, value: 100});
    Dottie.delete({obj, path});
    value = Dottie.get({obj, path});
    t.true(value === null);
});

test("Dottie.remove", t => {
    obj = {};
    Dottie.set({obj, path, value: 100});
    Dottie.remove({obj, path});
    value = Dottie.get({obj, path});
    t.true(value == null);
});

test("Dottie.transform", t => {
    obj = {
        "id": 1,
        "contact": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "example@gmail.com",
        },
    };
    let recipe = {
        'id': 'nr',
        'contact.firstName': 'name.first',
        'contact.lastName': 'name.last',
        'contact.email': 'email'
    };
    let result = Dottie.transform({obj, recipe});
    t.true(result.name.first == 'John');
});

test("Dottie.dot", t => {
    obj = {
      id: 'my-id',
      nes: { ted: { value: true } },
      other: { nested: { stuff: 5 } },
      some: { array: ['A', 'B'] }
    };
    let result = Dottie.dot({obj});
    t.true(result["nes.ted.value"]);
});

test("Dottie.jsonsToRows", t => {
    obj = {};
    const jsons = [
        {func: function hey() { return 'yo'; }, array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o'], one: {two: 2}},
        {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o'], one: {two: 2, three: 3}},
        {another: 'one'}
    ];
    const result = Dottie.jsonsToRows({jsons, priorityHeaders: []});
    t.true(result.length == 4);
});

test("Dottie.rowsToJsons", t => {
    const rows = [
      [
        'another',   'array[0]',  'array[10]',
        'array[11]', 'array[12]', 'array[13]',
        'array[14]', 'array[15]', 'array[16]',
        'array[17]', 'array[18]', 'array[19]',
        'array[1]',  'array[20]', 'array[21]',
        'array[22]', 'array[23]', 'array[24]',
        'array[25]', 'array[26]', 'array[27]',
        'array[2]',  'array[3]',  'array[4]',
        'array[5]',  'array[6]',  'array[7]',
        'array[8]',  'array[9]',  'func',
        'one.three', 'one.two'
      ],
      [
        null, 'a', 'l',
        'm',  'n', 'o',
        'a',  'b', 'c',
        'd',  'e', 'f',
        'b',  'g', 'hi',
        'i',  'k', 'l',
        'm',  'n', 'o',
        'c',  'd', 'e',
        'f',  'g', 'hi',
        'i',  'k', '',
        null, 2
      ],
      [
        null, 'a', 'l',  'm', 'n', 'o',
        'a',  'b', 'c',  'd', 'e', 'f',
        'b',  'g', 'hi', 'i', 'k', 'l',
        'm',  'n', 'o',  'c', 'd', 'e',
        'f',  'g', 'hi', 'i', 'k', null,
        3,    2
      ],
      [
        'one', null, null, null, null,
        null,  null, null, null, null,
        null,  null, null, null, null,
        null,  null, null, null, null,
        null,  null, null, null, null,
        null,  null, null, null, null,
        null,  null
      ]
    ];
    const result = Dottie.rowsToJsons({rows});
    t.true(result[2].another == 'one');
});

test("Dottie.augment", t=> {
    const params = [ [Object, Array], [] ];
    params.forEach(function (param) {
        Dottie.augment(...param);
        obj = {};
        path = 'path.to.value';
        obj.dottie.set({path, value: 100});
        t.true(obj.path.to.value === 100);
        value = obj.dottie.get({path});
        t.true(value == 100);
        obj.dottie.move({path, destPath: 'new.path'});
        t.true(obj.new.path == 100);
        let target = {};
        obj.dottie.copy({path: 'new.path', destPath: 'copied.path', target});
        t.true(target.copied.path == 100);
        obj.dottie.transfer({path: 'new.path', destPath: 'transfered.to.here', target});
        t.true(target.transfered.to.here === 100);
        obj = {'path.to.value': 100};
        obj.dottie.expand();
        t.true(obj.path.to.value === 100);
        obj.dottie.delete({path: 'path.to'});
        t.true(Object.keys(obj.path).length === 0);
        obj = {'path.to.value': 100};
        obj.dottie.expand();
        obj.dottie.remove({path: 'path.to'});
        t.true(Object.keys(obj.path).length === 0);

        const jsons = [{'name.firstname': 'Adam', 'path.to.value': 100},{'name.firstname': 'Beth', 'path.to.value': 200}].map(json => json.dottie.expand());
        const rows = jsons.dottie.jsonsToRows();
    });

});

test("priority headers, and no nulls", t=> {

    obj = {};
    const jsons = [
        {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o'], one: {two: null}, id: 5},
        {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'hi', 'i', 'k', 'l', 'm', 'n', 'o'], one: {two: 2, three: 3}, id: 2},
        {another: 'one', one: null, id: 1}
    ];
    const rows = Dottie.jsonsToRows({jsons, priorityHeaders: ['id']});
    t.true(rows[0][0] === 'id')
    t.true(!rows[0].includes('one'));

});
