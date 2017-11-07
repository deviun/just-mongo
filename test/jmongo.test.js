const $JMongo = require('../');

const $log = require('../src/libs/log');
const $Promise = require('bluebird');

// пример моделей для коллеций
const models = {
  users: {
    name: { // правила для поля name
      type: String, // Тип данных
      // функция, проверяющая валидацию данных в поле name
      isValid: (value) => { return ( String(value).split(' ').length === 1 ) }
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
  db: 'jmongo'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.info({ok});
  }
});

const usersDB = $mongo.collection('users');

// создание записей (передавать можно и список и просто один объект)
async function createUsers () {
  let usersData = [
    {
      name: 'Anton',
      age: 18
    }, {
      name: 'Pavel',
      age: 32,
      ban: true
    }, {
      name: 'Sergey',
      age: 21
    }
  ];

  usersData = usersData.map((user, index) => {
    user.id = index + 1;

    return user;
  });

  await usersDB.insert(usersData);

  const countUsers = await usersDB.count();

  if (countUsers === 3) {
    $log.info('createUsers -> insert -> ok');
  } else {
    $log.error('createUsers -> insert -> falid', {
      countUsers
    });
  }
}

// массовое удаление записей
async function clearUsers () {
  await usersDB.deleteMany();

  const countUsers = await usersDB.count();
  
  if (countUsers === 0) {
    $log.info('clearUsers -> deleteMany -> ok');
  } else {
    $log.error('clearUsers -> deleteMany -> falid', {
      countUsers
    });
  }
}

// удаление одной записи
async function deleteUserBan () {
  const countBanBefore = await usersDB.count({
    ban: true
  });

  await usersDB.deleteOne({
    ban: true
  });

  const countBanAfter = await usersDB.count({
    ban: true
  });

  if ( (countBanBefore - countBanAfter) === 1 ) {
    $log.info('deleteUserBan -> deleteOne -> ok', {
      countBanBefore,
      countBanAfter
    });
  } else {
    $log.error('deleteUserBan -> deleteOne -> falid', {
      countBanBefore,
      countBanAfter
    });
  }

}

// получение списка.. параметры объектом, а не через курсор
async function getList () {
  const list = await usersDB.find(null, {
    limit: 100
  });

  $log.info({
    list
  });
}

// получение одной записи
async function getFirstUser () {
  const firstUser = await usersDB.findOne({
    id: 1
  });

  $log.info({
    firstUser
  });
}

// обновление одной записи
async function banFirstUser () {
  const banBefore = await usersDB.findOne({
    id: 1
  }, {
    fields: {
      ban: true
    }
  });

  await usersDB.updateOne({
    id: 1,
  }, {
    $set: {
      ban: true
    }
  });

  const banAfter = await usersDB.findOne({
    id: 1
  }, {
    fields: {
      ban: true
    }
  });

  if (banBefore.ban !== banAfter.ban) {
    $log.info('banFirstUser -> updateOne -> ok', {
      banBefore: banBefore.ban,
      banAfter: banAfter.ban
    });
  } else {
    $log.error('banFirstUser -> updateOne -> falid', {
      banBefore: banBefore.ban,
      banAfter: banAfter.ban
    });
  }
}


// массовое обновление
async function updateAgeForAll () {
  await usersDB.updateMany({}, {$set: {
    age: 19
  }});

  const count19 = await usersDB.count({
    age: 19
  });

  if (count19 === 2) {
    $log.info('updateAgeForAll -> updateMany -> ok');
  } else {
    $log.error('updateAgeForAll -> updateMany -> falid', {
      count19
    });
  }
}

// использование методов из библиотеки mongodb native
// http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html
async function usingMongoAPI () {
  const pipeline = [
    {
      $match: {
        age: 19
      }
    }, {
      $sort: {
        id: -1
      }
    }
  ];

  // т.е обращаемся к методам mongodb.Collection через usersDB.collection
  const result = await new $Promise((resolve, reject) => {
    usersDB.collection.aggregate(pipeline, {}, (err, dbres) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(dbres);
      }
    })
  });

  console.log({
    result
  });
}

// попытка создать запись с полем, которого нет в модели
async function createInvalidData () {
  const data = {
    first_name: 'Anton'
  };

  await usersDB.insert(data);
}

// создание записи без обязательного поля
async function createWithoutRequired () {
  const data = {
    name: 'Anton',
    age: 21
  };

  await usersDB.insert(data);
}

// execute

const fns = [
  clearUsers,
  createUsers,
  deleteUserBan,
  getList,
  getFirstUser,
  banFirstUser,
  updateAgeForAll,
  usingMongoAPI,
  createInvalidData,
  createWithoutRequired
];

(async () => {
  for (let fn of fns) {
    await fn().catch((err) => { // дабы не останавливаться на ошибках 
      $log.error(err);
    });
  }
})()