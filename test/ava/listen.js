const {test} = require('ava');

const $JMongo = require('../../');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');

let $mongo, feedDB;

test.serial('connection', async (t) => {
  await new $Promise((resolve) => {
    $mongo = new $JMongo({
      models,
      db,
      log: true
    }, function (err, ok) {
      if (err) {
        $log.error(err);
        t.fail('failed connection to MongoDB');
        return;
      }
  
      feedDB = $mongo.collection('feed');
  
      t.pass();
      resolve();
    });
  });
});

test.serial('check', async (t) => {
  let i = 0;

  await feedDB.deleteMany();
  
  const insertTimer = setInterval(() => {
    feedDB.insert({
      data: `Current time: ${(new Date().getTime())}`,
      index: ++i, 
      time: (new Date()).getTime()
    });
  }, 500);

  let firstCheckTime;

  const subs = feedDB.listen(async (lastUpdates) => {
    if (!lastUpdates && !firstCheckTime) {
      firstCheckTime = await feedDB.findOne(false, {
        sort: {
          time: -1
        }
      });

      if (!firstCheckTime) {
        firstCheckTime = {time: 0};
      }

      lastUpdates = [firstCheckTime];
    } else if (!lastUpdates && firstCheckTime) {
      lastUpdates = [firstCheckTime];
    }

    return await feedDB.find({
      time: {
        $gt: lastUpdates.pop().time
      }
    }, {
      project: {
        _id: 0,
        time: 1,
        index: 1
      }
    });
  }, 1000);

  const updatesList = [];

  subs
    .error((err) => {
      $log.error(err);
    })
    .addListener((updates) => {
      updatesList.push(updates.map((item) => item.index));
    });

  await new $Promise((resolve, reject) => {
    setTimeout(() => {
      clearInterval(insertTimer);
      subs.close(); 
      resolve();
    }, 5000);
  });

  const expected = [[1,2],[3,4],[5,6],[7,8]];

  t.deepEqual(updatesList, expected, 'updatesList incorrect');
});