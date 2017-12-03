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

test.serial('collection.deleteMany', async (t) => {
  await avaDB.deleteMany();

  const itemsCount = await avaDB.count();

  t.is(itemsCount, 0);
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

test.serial('collection.find', async (t) => {
  const result = await avaDB.find();

  t.is(result.length, 3);
});

test.serial('collection.findOne', async (t) => {
  const entry = await avaDB.findOne();
  
  const testEntry = {
    key: 'kkkk',
    value: 'vvvv'
  };

  testEntry._id = entry._id;

  delete entry.def;

  t.deepEqual(entry, testEntry, 'entry not is equal');
});

test.serial('collection.deleteOne', async (t) => {
  const deleteFilter = {key: 'kkkk'};
  const beforeCount = await avaDB.count(deleteFilter);

  await avaDB.deleteOne(deleteFilter);

  const afterCount = await avaDB.count(deleteFilter);

  t.is((beforeCount !== afterCount), true);
});

test.serial('collection.editOne/editMany', async (t) => {
  t.plan(2);

  const beforeItem = await avaDB.findOne();

  await avaDB.editOne({
    _id: beforeItem._id
  }, {
    key: 'edited'
  });

  const afterItem = await avaDB.findOne({
    _id: beforeItem._id
  });

  t.notDeepEqual(beforeItem, afterItem);

  await avaDB.editMany(false, {
    value: 'edited all items'
  });

  const currentItems = await avaDB.find();

  t.is(currentItems.filter((item) => item.value === 'edited all items').length, 2);
});