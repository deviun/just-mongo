const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  users: {
    marks: {
      type: Object,
      isValid: (value) => (value instanceof Array) || (value.$each instanceof Array)
    },
    age: Number
  }
};

const $mongo = new $JMongo({
  models,
  log: 'silly',
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
  await usersDB.updateOne(false, {
    $push: {
      marks: {
        $each: [1, 23, 4, 56],
        $slice: -2
      }
    }
  });

  await usersDB.updateOne(false, {
    $inc: {
      age: '12'
    }
  });
  
  await usersDB.updateOne(false, {
    $rename: {
      'age': '_age'
    }
  });
  
  await usersDB.updateOne(false, {
    $unset: {
      marks: ''
    }
  });
})()
.then(() => {
  process.exit();
})
.catch((err) => {
  $log.error(err);
  process.exit();
});