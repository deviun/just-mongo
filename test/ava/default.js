const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, avaDB;

test.serial('connection', (t) => {
  return new $Promise((resolve) => {
    $mongo = new $JMongo({
      models,
      db,
      log: process.env.LOG_LEVEL || false
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }

      avaDB = $mongo.collection('defaultCollection');

      resolve();
    });
  });
});

test.serial('insert without object21', async (t) => {
  await avaDB.deleteMany();

  const expectedObject = {
    key1: 'defaultString',
    key2: {
      key21: 'defObj21'
    }
  };

  await avaDB.insert({});

  const obj = await avaDB.findOne();

  delete obj._id;
  
  t.deepEqual(expectedObject, obj);
});

test.serial('insert without key21', async (t) => {
  await avaDB.deleteMany();

  const expectedObject = {
    key1: 'st',
    key2: {
      key21: 'def21String',
      key22: 'st22',
      arrOfObjects: [{
        str: 'str',
        bool: true
      }],
      arr2Object: [{
        str: 'str',
        bool: true
      }, {
        str: 'str',
        bool: false
      }]
    }
  };

  await avaDB.insert({
    key1: 'st',
    key2: {
      key22: 'st22',
      arrOfObjects: [{
        str: 'str'
      }],
      arr2Object: [{
        str: 'str'
      }, {
        str: 'str'
      }]
    }
  });

  const obj = await avaDB.findOne();

  delete obj._id;
  
  t.deepEqual(expectedObject, obj);
});
