const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $mongoose = require('mongoose');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

const {db} = require($path.resolve(ROOT, 'test', 'db-config'));

$mongoose.Promise = $Promise;

async function test () {
  const startTime = (new Date()).getTime();

  await $mongoose.connect('mongodb://localhost/' + db, {
    useMongoClient: true
  });

  return ( (new Date()).getTime() - startTime );
}

module.exports = test;