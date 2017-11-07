# Just MongoDB

Wrapper for mongodb for Node.js | Простая обертка над MongoDB native

##### Create models for collections | Создание моделей для коллекций

```javascript

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

```

##### Create connection to MongoDB | Создание подключения к MongoDB

```javascript

const $JMongo = require('just-mongo');
const $mongo = new $JMongo({
  models,
  db: 'you_database'
}, function (err, ok) {
  if (err) {
    $log.info(err);
  } else {
    $log.error({ok});
  }
});

```

> At this point, the following options are available for the designer: | На данный момент для конструктора доступны следующие параметры

```json

{
  "models": {},
  "db": "you_database",
  "host": "127.0.0.1",
  "user": "username",
  "password": "password for db",
  "port": "27017",
  "replica": "http://mongodb.github.io/node-mongodb-native/2.0/tutorials/connecting/"
}
```

> All except the `models` has default values | Все, кроме `models` имеет значения по умолчанию

#### Using | Использование

##### Collection | Коллекция

```javascript
const usersDB = $mongo.collection('users');
```

##### Collection with API mongodb native | Коллекция с API mongodb native

```javascript
const usersDB = $mongo.collection('users').collection;
```

##### Insert | Создание документов

```javascript
await usersDB.insert(Object || Array.<Object>, options);
```

> `options` support all of the documentation 
> `options` поддерживает всё из документации
> http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html

##### Update | Обновление документов

```javascript
await usersDB.updateOne(where || null, updateObject, options);
await usersDB.updateMany(where || null, updateObject, options);
```

> `options` support all of the documentation 

##### Delete | Удаление документов

```javascript
await usersDB.deleteOne(where || null, options);
await usersDB.deleteMany(where || null, options);
```

> `options` support all of the documentation 

##### Find/Count | Получение документов и их кол-во

```javascript
const doc = await usersDB.findOne(where || null, options);
const countDocs = await usersDB.count(where || null, options);
const list = await usersDB.find(where || null, options);
```

> `options` for `find` are specified in the object, the method is not a cursor. To use the cursor, use API mongodb native

> `options` для `find` указаны в объекте, метод не является курсором. Чтобы использовать курсор, используйте API mongodb native

[More examples | Больше примеров](https://github.com/deviun/just-mongo/blob/master/test/jmongo.test.js)