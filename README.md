[![just-mongo](https://img.shields.io/npm/v/just-mongo.svg?style=flat-square)](https://www.npmjs.com/package/just-mongo/)

# Just Mongo

Simple and fast wrapper for MongoDB.

## 💪 Motivation 

Less code and more action.

Just Mongo allows you to use a simplified API. Inside, we try to use minimalistic solutions that do not steal your time.

You choose the possibilities of the library, and nothing superfluous.

## Speed🌬

We ran along with [Mongoose](http://mongoosejs.com/), and overtook him in all the races!

| Test | Mongoose | Just-Mongo |
|:----------|:----:| :-------:|
| Connection | **52** | **11** |
| Insert (5k docs) | **4785** | **160** |
| Find | **53** | **3** |

...time in **ms**.

All tests are in directory: [test/speed-test](https://github.com/deviun/just-mongo/tree/master/test/speed-test).

## Install

```sh
$ npm i -S just-mongo
```

## Tests

```sh
$ npm test
```

## Docs

### Create models

```javascript
const models = {
  users: {
    name: {
      type: String,
      isValid: (value) => String(value).split(' ').length === 1
    },
    age: Number,
    id: {
      type: Number,
      required: true
    },
    ban: {
      type: Boolean,
      default: false
    }
  }
};
```

### Data types

| Type | Data | Data without `strict` |
|:----------|:----:| ------- |
| **String** | `"you data"` | `[1,2,3]` ⟹ `"1,2,3"` <br> `{}` ⟹ `"[object Object]"` <br> `5` ⟹ `"5"` <br> `true` ⟹ `"true"` |
| **Number** | `12345` | `[1,2,3]` ⟹ `NaN` <br> `{}` ⟹ `NaN` <br> `"5"` ⟹ `5` <br> `"abc"` ⟹ `NaN` <br> `true`/`false` ⟹ `1`/`0` |
| **Boolean** | `true` | `[1,2,3]` ⟹ `true` <br> `{}` ⟹ `true` <br> `"5"` ⟹ `true` <br> `0` ⟹ `false` |
| **Object** | `{foo: 'bar'}` | `[1,2,3]` ⟹ `[1,2,3]` <br> `"abc"` ⟹ `{0: 'a', 1: 'b', ...}` <br> `5` ⟹ `{0: 5}` <br> `true` ⟹ `{0: true}` |
| **Array** | `[1, 2, 3]` | `notArrayType` ⟹ `[notArrayType]` |

Note that the `Object` and `Array` are different types of data, and if you have a `strict` enabled, then when the array is checked, the object does not pass the validation.

### Create connection

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| models | object | yes | - |
| log | **`false`**, **`true`**, `error`, `warn`, `info`, `verbose`, `debug`, `silly` | no | false |
| strict | boolean | no | false |
| db | string | yes | '' |
| host | string | no | localhost |
| user | string | no | '' |
| password | string | no | '' |
| port | number/string | no | 27017 |

- **log** — Set the logging
- **strict** — Strict validation mode, if `true`, then an error occurs if the data type is incorrect. If the mode is disabled, the data will be automatically corrected as much as possible.

```javascript
const JustMongo = require('just-mongo');

const mongo = new JustMongo({
  models,
  db: 'database'
}, (err, done) => {
  if (err) {
    console.error(err)
  } else {
    console.log(done)
  }
});
```

If you need create multi connections, [read this doc](https://github.com/deviun/just-mongo/blob/master/docs/multi-connection.md).

### Collection

```javascript
const Users = mongo.collection('users');
```

### Collection [native]

```javascript
const Users = mongo.collection('users').collection;
```

Such a method should be used if you are sure that there is already a connection to the MongoBD. If there is no such certainty, then use the method described below.

```javascript
const Users = mongo.collection('users');

await Users.native((collection, resolve, reject) => {
  // use collection.MethodFromNative
  // сomplete the function using resolve or reject
});
```

This method will be executed after connecting to the database. After that, you can use the first method.

### [Insert](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#insert)

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| document | object/list\<object\> | yes | - |
| options | object | no | null |

```javascript
// insert one document
await Users.insert({ user_id: 1 }, { serializeFunctions: true });
// insert several documents
await Users.insert([
  { user_id: 1 }, 
  { user_id: 2 }
]);
```

### [Update](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#update)

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| filter | object | yes | - |
| document | object | yes | - |
| options | object | no | null |

```javascript
await Users.updateOne({ user_id: 1 }, {
  $set: {
    first_name: 'Mikhail'
  }
}, { serializeFunctions: false });

await Users.updateMany({ first_name: 'Mikhail' }, {
  $set: {
    age: 15
  }
}, { w: 1 });
```

> Or use methods **editOne** and **editMany** to avoid specifying **$set** for each request.

### [Delete](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#deleteMany)

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| filter | object | yes | - |
| options | object | no | null |

```javascript
await Users.deleteOne({ first_name: 'Anton' }, { w: 1 });
await Users.deleteMany({ age: 10 }, { wtimeout: 25 });
```

### [Find/Count](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#find)

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| filter | object | yes | - |
| options | object | no | null |

```javascript
const item = await Users.findOne({ age: 15 }, { limit: 5 });
const items = await Users.find({});
const itemsCount = await Users.count({ age: 15 }, { maxTimeMS: 2500 });
```

##### Searching for random entries

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| filter | object | no | null |
| count | number | no | 5 |
| options | object | no | null |

Options: 

- **project** — control the display of fields as a result.

```javascript
const items = await Users.findRandom({ age: 25 }, 2, {
  project: {
    id: 1,
    name: 1,
    _id: 0
  }
});
```

### Join engine

If you need joined collection, use [join engine](https://github.com/deviun/just-mongo/tree/master/docs/join-engine.md).


There's some cool [examples too](https://github.com/deviun/just-mongo/blob/master/examples/jmongo.test.js).

### Native connections

In case you need to create your own flexible connection using **mongodb native**, read [this](https://github.com/deviun/just-mongo/blob/master/docs/native-connection.md) doc.

## License

ISC.
