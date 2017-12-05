const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $mongoose = require('mongoose');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

const {models,db} = require($path.resolve(ROOT, 'test', 'db-config'));
const {Schema} = $mongoose;

$mongoose.Promise = $Promise;

async function test () {
  global.mongooseSpeed = $mongoose.model('Speed', models.speed);

  const startTime = (new Date()).getTime();
  
  for (let i = 0; i < 5000; ++i) {
    const doc = new mongooseSpeed({
      string: 555,
      number: '555',
      object: {},
      boolean: 'true'
    });

    await doc.save();
  }

  return (new Date()).getTime() - startTime;
}

module.exports = test;