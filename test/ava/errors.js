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
      log: true,
      strict: true
    }, function (err, ok) {
      if (err) {
        $log.info(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }
      
      avaDB = $mongo.collection('avaTest');
      
      resolve();
    });
  });
});

test.serial('use unknown property', async (t) => {
  let error;

  await avaDB.insert({
    unkownProp: true
  })
  .catch((err) => {
    $log.error(err);
  });

  t.pass();
});