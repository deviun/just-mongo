const ROOT = `${__dirname}/../../`;

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));
const {table} = require('table');

const libsForTest = [
  'mongoose',
  'just-mongo'
];

const stepsForTest = [
  'connection',
  'insert',
  'find',
];

const tests = libsForTest.reduce((r, libName) => {
  r[libName] = stepsForTest.reduce((r, testName) => {
    const testPath = $path.resolve(ROOT, 'test/speed-test', libName, testName);

    try {
      r[testName] = require(testPath);
    } catch (err) {
      $log.error(err);
      r[testName] = async () => false;
    }

    return r;
  }, {});

  return r;
}, {});

const stats = {};

(async () => {
  for (test of stepsForTest) {
    stats[test] = {};

    for (lib of libsForTest) {
      const fnTest = tests[lib][test];

      $log.info('starting %s.%s...', lib, test);

      const speed = await fnTest()
      .catch((err) => {
        $log.error(err);
      });

      $log.info('finished %s.%s, speed: %sms', lib, test, speed);

      stats[test][lib] = speed;
    }
  }

  const statsTable = table([
    ['Test', 'Mongoose', 'Just-Mongo'],
    ['Connection', stats.connection.mongoose, stats.connection['just-mongo']],
    ['Insert', stats.insert.mongoose, stats.insert['just-mongo']],
    ['Find', stats.find.mongoose, stats.find['just-mongo']]
  ]);

  console.log(statsTable);
})()
.then(() => {
  process.exit();
})
.catch((err) => {
  $log.error(err);
  process.exit();
});