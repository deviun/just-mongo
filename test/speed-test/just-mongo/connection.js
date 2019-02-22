const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $JMongo = require($path.resolve(ROOT, 'index.js')).default;
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

const {db, models} = require($path.resolve(ROOT, 'test', 'db-config'));

async function test () {
  let speed;

  await new $Promise((resolve, reject) => {
    const startTime = (new Date()).getTime();

    const $mongo = new $JMongo({
      models,
      db,
      log: true
    }, (err, done) => {
      if (err) {
        return reject(err);
      }

      global.$jmongo = $mongo;

      speed = (new Date()).getTime() - startTime;

      resolve();
    });
  });

  return speed;
}

module.exports = test;
