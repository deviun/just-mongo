const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {db, models, user, password} = require('../db-config');

let $mongo, avaDB;

test.serial('connection', (t) => {
  return new $Promise((resolve, reject) => {
    $mongo = new $JMongo({
      models,
      db,
      user,
      password,
      log: true
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        return reject();
      }

      avaDB = $mongo.collection('newAvaDB');

      resolve();
    });
  })
    .then(() => {
      t.pass()
    })
    .catch(() => {
      t.fail('failed connection to MongoDB');
    });
});

test.serial('insert', async (t) => {
  await avaDB.deleteMany();

  await avaDB.insert({
    key1: 'string',
    key2: 1519238735629
  });

  t.pass();
});

test.serial('insert (test error)', async (t) => {
  await avaDB.deleteMany();

  let isError;

  try {
    await avaDB.insert({
      key1: 'string',
      key2: 'dfggd'
    });
  } catch (err) {
    isError = true;
  }

  t.true(isError);
});
