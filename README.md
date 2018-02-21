# Just Mongo 2.0 `alpha`
[![just-mongo](https://img.shields.io/npm/v/just-mongo.svg?style=flat-square)](https://www.npmjs.com/package/just-mongo/)

Simple and fast wrapper for MongoDB.

## 💪 Motivation 

Less code and more action.

Just Mongo allows you to use a simplified API. Inside, we try to use minimalistic solutions that do not steal your time.

You choose the possibilities of the library, and nothing superfluous.

## Speed ➵

We ran along with [Mongoose](http://mongoosejs.com/), and overtook him in all the races!

| Test | Just-Mongo 2 | Mongoose |
|:-----|:----:| :-------:|
| Connection |  **4** | **46** |
| Insert (5k docs) |  **366** | **3686** |
| Find | **6** | **10** |

...time in **ms**.

All tests are in directory: [test/speed-test](https://github.com/deviun/just-mongo/tree/master/test/speed-test).

## Feature compatibility

Just-Mongo 2 uses the new version of mongodb. 
Please, read next posts:

 - https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/

- https://docs.mongodb.com/manual/core/schema-validation/#json-schema

## Switching from v1.x

The following should be considered when upgrading the version:

- It is desirable to update old models to new json schemes.
- Old models will work in limited functionality. Stop working: `isValid`, `default`.

> You may soon be able to set the default values for document properties.

## Install

```sh
$ npm i just-mongo -S
```

## Tests

```sh
$ npm test
```

--------
## Docs
### Create models

Limited version:
```javascript
const models = {
  users: {
    name: {
      type: String,
    },
    age: Number,
    id: {
      type: Number,
      required: true
    },
    ban: {
      type: Boolean
    }
  }
};
```

Flexible version:

```javascript
const models = {
  users: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        name: {
          type: 'string'
        },
        age: {
          type: 'number'
        },
        id: {
          type: 'number'
        },
        ban: {
          type: 'boolean'
        }
      },
      required: ['name', 'id']
    }
  }
};
```

### Create connection

| Parameter | Type | Requried | Default |
|:----------|:----:| :-------:| :------:|
| models | object | yes | - |
| log | **`false`**, **`true`**, `error`, `warn`, `info`, `verbose`, `debug`, `silly` | no | false |
| db | string | yes | '' |
| host | string | no | localhost |
| user | string | no | '' |
| password | string | no | '' |
| port | number/string | no | 27017 |

- **log** — Set the logging.

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

You can [configure](https://github.com/deviun/just-mongo/tree/master/docs/document-project.md) additional logic for the contents of documents.

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

### Getting updates

To constantly receive new data from one or more collections at once, you can use our listening solution. [Open doc](https://github.com/deviun/just-mongo/tree/master/docs/listen-collection.md).


### Join engine

If you need joined collection, use [join engine](https://github.com/deviun/just-mongo/tree/master/docs/join-engine.md).

---
There's some cool [examples too](https://github.com/deviun/just-mongo/blob/master/examples/jmongo.test.js).

----
### Native connections

In case you need to create your own flexible connection using **mongodb native**, read [this](https://github.com/deviun/just-mongo/blob/master/docs/native-connection.md) doc.

## License

ISC.
