const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, avaDB, avaDB2;

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
      
      avaDB = $mongo.collection('avaTests');
      avaDB2 = $mongo.collection('avaTests');
      
      resolve();
    });
  });
});

test.serial('check links to collections', (t) => {
  t.true(avaDB === avaDB2);
});