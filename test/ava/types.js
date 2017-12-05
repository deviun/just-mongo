const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, typesDB;

test.serial('connection', (t) => {
  return new $Promise((resolve) => {
    $mongo = new $JMongo({
      models,
      db
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }
      
      typesDB = $mongo.collection('types');
      
      resolve();
    });
  });
});

test.serial('check (without strict mode)', async (t) => {
  const Data = {
    string: 555,
    number: '555',
    boolean: 'true',
    array: 'hello, array',
    object: 'hello, object'
  };

  await typesDB.deleteMany();
  await typesDB.insert(Data);

  const result = await typesDB.findOne();
  const expected = {
    string: '555',
    number: 555,
    boolean: true,
    array: ['hello, array'],
    object: {'0':'h','1':'e','2':'l','3':'l','4':'o','5':',','6':' ','7':'o','8':'b','9':'j'
    ,'10':'e','11':'c','12':'t'}
  };

  delete result._id;

  t.deepEqual(result, expected);
});

test.serial('connection with strict mode', (t) => {
  return new $Promise((resolve) => {
    $mongo = new $JMongo({
      models,
      db,
      strict: true
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }
      
      typesDB = $mongo.collection('types');
      
      resolve();
    });
  });
});

test.serial('check (with strict mode)', async (t) => {
  const Data = {
    string: '555',
    number: 555,
    boolean: true,
    array: [1,2,3,5],
    array2: [12, 34, 56, 67],
    object: {a: 'b', c: 'd'}
  };

  await typesDB.deleteMany();
  await typesDB.insert(Data);

  const result = await typesDB.findOne();

  delete result._id;

  t.deepEqual(result, Data);
});

test.serial('error (with strict mode)', async (t) => {
  const Data = {
    string: '555',
    number: 555,
    boolean: true,
    array: {},
    object: {a: 'b', c: 'd'}
  };

  let error;

  await typesDB.deleteMany();
  await typesDB.insert(Data)
  .catch((err) => {
    error = err;
  });

  const errorPattern = /validation error: property ".+" has an invalid data type; data are .+, and an array is expected/;
  const errorString = error.toString();

  t.true(!!errorString.match(errorPattern));
});
