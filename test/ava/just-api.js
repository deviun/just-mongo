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
      db
    }, function (err, ok) {
      if (err) {
        $log.info(err);
        t.fail('failed connection to MongoDB');
      } else {
        t.pass();
      }

      avaDB = $mongo.collection('avaTests');

      resolve();
    });
  });
});

test.serial('collection.deleteMany', async (t) => {
  await avaDB.deleteMany();

  t.pass();
});

test.serial('collection.insert', async (t) => {
  t.plan(2);

  await avaDB.insert({
    key: 'kkkk',
    value: 'vvvv'
  });

  t.pass();

  await avaDB.insert([
    {key: 'k2', value: 'v2'},
    {key: 'k3', value: 'v3'}
  ]);

  t.pass();
});

test.serial('collection.count', async (t) => {
  const count = await avaDB.count();

  t.is(count, 3);
});