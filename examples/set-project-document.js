const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллекций
const models = {
  users: {
    name: String,
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

$mongo.setDocumentProject('users', function () {
  return {
    first_name: this.name,
    age: this.age,
    adult: this.age >= 18
  };
});

const usersDB = $mongo.collection('users');

(async () => {
  const list = await usersDB.find();
  const one = await usersDB.findOne();

  $log.info({
    list,
    one
  });
})()
.then(() => {
  process.exit();
})
.catch((err) => {
  $log.error(err);
  process.exit();
});