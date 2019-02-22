const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

test.serial('await connection', async (t) => {
  const $mongo = new $JMongo({
    models,
    db
  }, function (err, ok) {
    if (err) {
      $log.error(err);
      t.fail('failed connection to MongoDB');
    }
  });

  const avaDB = $mongo.collection('avaTests');

  await avaDB.insert({
    key: 'aaa',
    value: 'www'
  });

  t.pass();
});
