const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллеций
const models = {
  users: {
    name: { // правила для поля name
      type: String, // Тип данных
      // функция, проверяющая валидацию данных в поле name
      isValid: (value) => ( String(value).split(' ').length === 1  )
    },
    age: Number, // просто указываем тип данных 
    id: {
      type: Number,
      required: true, // требование к полю
    },
    ban: {
      type: Boolean,
      default: false // указываем значение по умочанию, если поле не указано
    }
  }
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

const pipeline = [];

pipeline.push({
  $match: {
    age: {$ne: null}
  }
});

(async () => {
  const result = await usersDB.aggregate(pipeline);
  
  $log.info({
    result
  });

  process.exit();
})();