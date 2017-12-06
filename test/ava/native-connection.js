const {test} = require('ava');

const $JMongo = require('../../');
const $mongodb = require('mongodb');
const $log = require('../../src/libs/log');
const $Promise = require('bluebird');
const {models, db} = require('../db-config');


test.serial('native connection', async (t) => {
  const $mongo = $JMongo.nativeConnection({models}, (resolve, reject) => {
    const connectionURI = `mongodb://127.0.0.1:27017/${db}`;
    const {MongoClient} = $mongodb;
  
    MongoClient.connect(connectionURI, {}, (err, db) => {
      if (err) {
        reject(err);
        t.fail(err);
      } else {
        resolve(db);
      }
    });
  });

  const avaDB = $mongo.collection('avaTest');

  await avaDB.count();

  t.pass();
});