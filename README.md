[![just-mongo](https://img.shields.io/npm/v/just-mongo.svg?style=flat-square)](https://www.npmjs.com/package/just-mongo/)

# just-mongo

Wrapper for MongoDB.

## Install

```sh
$ npm i just-mongo
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

### Create connection

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| models | object | yes | - |
| log | **`false`** **`true`** `error` `warn` `info` `verbose` `debug` `silly` | no | false |
| db | string | yes | '' |
| host | string | no | localhost |
| user | string | no | '' |
| password | string | no | '' |
| port | number/string | no | 27017 |


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

### Collection

```javascript
const Users = mongo.collection('users');
```

### Collection [native]

```javascript
const Users = mongo.collection('users').collection;
```

### [Insert](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#insert)

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| document | object | yes | - |
| options | object | no | null |

```javascript
await Users.insert({ user_id: 1 }, { serializeFunctions: true });
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

There's some cool [examples too](https://github.com/deviun/just-mongo/blob/master/test/jmongo.test.js).

### Native connections

In case you need to create your own flexible connection using **mongodb native**, use the code from the [example](https://github.com/deviun/just-mongo/blob/master/test/native.connection.js).

## License

ISC.
