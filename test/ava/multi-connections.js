const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');

const {models, db} = require('../db-config');

let $mongo;

const Data = {
  key: 'multi',
  value: 'connections'
};

test.serial('create multi', async (t) => {
  const connectionOne = new $JMongo({
    models, db,
    log: 'error'
  });

  const connectionTwo = new $JMongo({
    models,
    db: 'collectionForTest',
    log: 'error'
  });

  $mongo = $JMongo.multi({
    c1: connectionOne,
    c2: connectionTwo
  });

  t.pass();
});

test.serial('use multi', async (t) => {
  t.plan(2);

  const avaDBc1 = $mongo.db.c1.collection('avaTests');
  const avaDBc2 = $mongo.db.c2.collection('avaTests');

  await avaDBc1.deleteMany(Data);
  await avaDBc2.deleteMany(Data);

  await avaDBc1.insert(Data);
  await avaDBc2.insert(Data);

  const [res1, res2] = await $Promise.all([
    avaDBc1.findOne(Data),
    avaDBc2.findOne(Data)
  ]);

  delete res1.def;
  delete res1._id;
  delete res2.def;
  delete res2._id;

  t.deepEqual(res1, Data);
  t.deepEqual(res2, Data);
});