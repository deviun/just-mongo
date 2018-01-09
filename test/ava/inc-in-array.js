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

      avaDB = $mongo.collection('incArray');

      resolve();
    });
  });
});

test.serial('update', async (t) => {
  await avaDB.deleteMany();
  await avaDB.insert({
    arr: [
      {count: 0}
    ],
    inc: 0
  });

  const itemBeforeUpdate = await avaDB.findOne();

  console.log(JSON.stringify(itemBeforeUpdate));

  await avaDB.updateOne({
    _id: itemBeforeUpdate._id
  }, {
    $inc: {
      'arr.0.count': 1,
      // 'inc': 5
    }
  });

  const itemAfterUpdate = avaDB.findOne({_id: itemBeforeUpdate._id});

  t.notDeepEqual(itemBeforeUpdate.arr[0].count, itemAfterUpdate.arr[0].count);
});