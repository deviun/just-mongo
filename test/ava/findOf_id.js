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

test.serial('find', async (t) => {
  await avaDB.deleteMany();
  await avaDB.insert({
    key: 'test',
    value: 'fdfgdgd'
  });
  
  await avaDB.insert({
    key: 'test9456985474KEYS_SETTINGS',
    value: 'fdfgdgd'
  });

  const item = await avaDB.findOne();
  const stringId = String(item._id);
  const find = await avaDB.findOne({
    _id: stringId
  });

  t.deepEqual(item, find);
});

test.serial('find use settings keys', async (t) => {
  const item = await avaDB.findOne();
  const stringId = String(item._id);
  const find = await avaDB.findOne({
    _id: { $ne: stringId  }
  });

  t.notDeepEqual(item, find);
});

test.serial('update', async (t) => {
  const item = await avaDB.findOne();
  const stringId = String(item._id);
  const find = await avaDB.editOne({
    _id: { $ne: stringId  }
  }, {
    key: 'ddfgd'
  });

  const item2 = await avaDB.findOne();

  t.deepEqual(item, item2);
});