// Создание нативного подключения со своими гибкими параметрами

const $JMongo = require('../');
const $mongodb = require('mongodb');

// пример моделей для коллекций
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

const $mongo = $JMongo.nativeConnection({
  models,
  strict: true,
  log: 'debug'
}, (resolve, reject) => {

  const connectionURI = `mongodb://127.0.0.1:27017/jmongo`;
  const {MongoClient} = $mongodb;

  console.log('connecting to mongoDB..');

  MongoClient.connect(connectionURI, {}, (err, db) => {
    if (err) {
      console.log('connection finished with error');
      reject(err);
    } else {
      console.log('connection finished with success');
      resolve(db);
    }
  });

});

const usersDB = $mongo.collection('users');

(async () => {
  console.log('start async function');

  // запрос не выполнится, пока не будет создано подключение 
  const users = await usersDB.find();

  console.log({
    users
  });

  process.exit();
})();