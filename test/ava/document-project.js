const {test} = require('ava');

const $JMongo = require('../../').default;
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

const Data = [{
  key: 'dog',
  value: 'cat'
}];

test.serial('find/findOne', async (t) => {
  t.plan(2);
  
  const $mongo = new $JMongo({
    models,
    db
  }, function (err, ok) {
    if (err) {
      $log.error(err);
      t.fail('failed connection to MongoDB');
    }
  });

  $mongo.setDocumentProject('avaTests', function () {
    return {
      data: `${this.key} - ${this.value}`
    }
  });

  const avaDB = $mongo.collection('avaTests');

  await avaDB.deleteMany();
  await avaDB.insert(Data);

  const list = await avaDB.find();
  const one = await avaDB.findOne();
  const expected = {data: 'dog - cat'};

  t.deepEqual(list, [expected]);
  t.deepEqual(one, expected);
});
