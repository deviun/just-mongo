const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');


let $mongo, joinTo, joinFrom;

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
      
      joinTo = $mongo.collection('joinTo');
      joinFrom = $mongo.collection('joinFrom');
      
      resolve();
    });
  });
});

const Data = {
  joinTo: {
    user_id: 1,
    text: 'Test text for test',
    time: '12:56 12.05.2017'
  },
  joinFrom: {
    id: 1,
    name: 'Anton Danilov'
  }
};

test.serial('join', async (t) => {
  t.plan(2);
  
  await joinTo.deleteMany();
  await joinFrom.deleteMany();

  await joinTo.insert(Data.joinTo);
  await joinFrom.insert(Data.joinFrom);

  const joinResult = await joinTo.join(false, joinFrom, {user_id: 'id'}, {
    user_id: '0.user_id',
    user_name: '1.name',
    text: '0.text',
    time: '0.time'
  });

  const objExpected = {
    user_id: Data.joinTo.user_id,
    user_name: Data.joinFrom.name,
    text: Data.joinTo.text,
    time: Data.joinTo.time
  };

  t.deepEqual(joinResult[0], objExpected);

  const joinResult2 = await joinTo.join(false, joinFrom, {user_id: 'id'}, {
    user_id: '0.user_id',
    user_name: '1.name',
    text: '0.text',
    time: '0.time'
  }, {
    limit: 100,
    skip: 0,
    joinDocument: {
      filter: {
        name: {$ne: null}
      },
      sort: {
        _id: 1
      }
    }
  });

  t.deepEqual(joinResult2[0], objExpected);
});