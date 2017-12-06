# Native connection

## Create connection

```javascript
const mongodb = require('mongodb');
const mongo = JustMongo.nativeConnection({
  models,
  strict: true,
  log: 'debug'
}, (resolve, reject) => {
  const connectionURI = `mongodb://127.0.0.1:27017/jmongo`;
  const {MongoClient} = mongodb;

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

const usersDB = mongo.collection('users');

// etc...
```

## Options

We use options from the standard [connection](https://github.com/deviun/just-mongo#create-connection), except the parameters for login the database.

## Example

Open [this](https://github.com/deviun/just-mongo/blob/master/examples/native.connection.js) example to view.