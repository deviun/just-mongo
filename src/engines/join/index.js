const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.join';

const get = require('lodash/get');

const FasterEngine = require('./engine-faster');
const SaferEngine = require('./engine-safer');

async function join (filter, joinCollection, joinField, project, options) {
  let engine;

  if (get(options, 'joinDocument')) {
    engine = SaferEngine;
  } else {
    engine = FasterEngine;
  }

  return await engine.apply(this, arguments);
}

module.exports = join;