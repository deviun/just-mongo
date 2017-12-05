const ROOT = `${__dirname}/../../../`;

const $path = require('path');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

async function test () {
  const startTime = (new Date()).getTime();
  
  const result = await mongooseSpeed.findOne({
    string: '555',
    number: 555
  });

  return (new Date()).getTime() - startTime;
}

module.exports = test;