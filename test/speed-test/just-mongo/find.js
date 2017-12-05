const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $mongoose = require('mongoose');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

async function test (params) {
  const speedDB = global.$jmongo.collection('speed');
  const startTime = (new Date()).getTime();

  const result = await speedDB.findOne({
    string: '555',
    number: 555
  });

  return (new Date()).getTime() - startTime;
}

module.exports = test;