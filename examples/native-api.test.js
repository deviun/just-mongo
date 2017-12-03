const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  id: Number
};

const $mongo = new $JMongo({
  models,
  log: true,
  db: 'jmongo'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.info({ok});
  }
});

const usersDB = $mongo.collection('users');

new $Promise((resolve, reject) => {
  // first method

  usersDB.native((collection, resolve, reject) => {
    collection.find().toArray((err, dbres) => {
      if (err) {
        return reject(err);
      }

      $log.info({
        dbres
      });
  
      resolve();
    });
  }).then(resolve).catch(reject);
})
  .then(() => {
    // second method

    return new $Promise((resolve, reject) => {
      usersDB.collection.find().toArray((err, dbres) => {
        if (err) {
          return reject(err);
        }

        $log.info({dbres});

        resolve();
      });
    });
  })
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    $log.error(err);
    process.exit();
  });