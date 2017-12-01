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
  log: true,
  strict: true,
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
  $log.info('we use the wrong data type, then we expect an error...');

  await usersDB.editOne(false, {
    age: '16'
  });
})()
.then(() => {
  process.exit();
})
.catch((err) => {
  $log.error(err);
  process.exit();
});