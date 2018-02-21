const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, avaDB;

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
      
      avaDB = $mongo.collection('avaTests');
      
      resolve();
    });
  });
});

test.serial('using invalid type', async (t) => {
  let error;

  await avaDB.insert({
    key: 5555
  })
  .catch((err) => {
    error = true;
  });

  t.true(error);
});