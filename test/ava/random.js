const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

const Data = [{test: 1}, {test: 2}, {test: 3}, {test: 4}];

test.serial('collection.findRandom', async (t) => {
  const $mongo = new $JMongo({
    models,
    db
  }, function (err, ok) {
    if (err) {
      $log.error(err);
      t.fail('failed connection to MongoDB');
    }
  });

  const randomDB = $mongo.collection('random');

  await randomDB.deleteMany();
  await randomDB.insert(Data);

  const result1 = await randomDB.findRandom(false, 2);
  const result2 = await randomDB.findRandom(false, 2);

  t.notDeepEqual(result1, result2);
});
