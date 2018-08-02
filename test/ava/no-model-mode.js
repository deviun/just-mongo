const { test } = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const { db } = require('../db-config');

test.serial('connection (without models)', (t) => {
  return new $Promise((resolve) => {
    new $JMongo({
      db
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }

      resolve();
    });
  });
});