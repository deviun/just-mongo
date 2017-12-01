const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  users: {
    age: Number
  }
};

const $mongo = new $JMongo({
  models,
  log: 'debug',
  db: 'jmongo'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.info({ok});
  }
});

const usersDB = $mongo.collection('users');

(async () => {
  const result = await usersDB.findRandom(false, 2, {
    project: {
      _id: false,
      id: true
    }
  });

  $log.info({
    result
  });
})()
.then(() => {
  process.exit();
})
.catch((err) => {
  $log.error(err);
  process.exit();
});