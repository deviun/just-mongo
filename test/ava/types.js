const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, typesDB;

test.serial('connection', (t) => {
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

test.serial('check', async (t) => {
  const Data = {
    string: '555',
    number: 555,
    boolean: true,
    array: [1,2,3,5],
    array2: [12, 34, 56, 67],
    object: {a: 'b', c: 'd'}
  };

  await typesDB.deleteMany();
  await typesDB.insert(Object.assign({}, Data));

  const result = await typesDB.findOne();

  delete result._id;

  t.deepEqual(result, Data);
});

test.serial('error', async (t) => {
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
    error = true;
  }); 

  t.true(error);
});
