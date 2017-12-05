const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $mongoose = require('mongoose');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

async function test (params) {
  const speedDB = global.$jmongo.collection('speed');

  const docs = [];

  for (let i = 0; i < 5000; ++i) {
    docs.push({
      string: 555,
      number: '555',
      object: {},
      boolean: 'true'
    });
  }

  const startTime = (new Date()).getTime();

  await speedDB.insert(docs);

  return (new Date()).getTime() - startTime;
}

module.exports = test;