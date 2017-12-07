const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  feed: {
    data: String,
    time: Number,
    index: Number
  }
};

const $mongo = new $JMongo({
  models,
  log: 'info',
  db: 'jmongo'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.info({ok});
  }
});

const feedDB = $mongo.collection('feed');

let i = 0;

setInterval(() => {
  feedDB.insert({
    data: `Current time: ${(new Date().getTime())}`,
    index: ++i, 
    time: (new Date()).getTime()
  });
}, 500);

let firstCheckTime;

(async () => {
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
        index: 1,
        data: 1
      }
    });
  }, 1000);

  subs
    .error((err) => {
      $log.error(err);
    })
    .addListener((updates) => {
      $log.info({updates});
    });

  setTimeout(() => {
    subs.close();

    $log.info('listen stop');

    process.exit();
  }, 5000);
})()
.catch((err) => {
  $log.error(err);
  process.exit();
});