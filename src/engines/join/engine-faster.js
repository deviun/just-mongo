const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.join.faster';

const get = require('lodash/get');
const isObject = require('lodash/isObject');

const aggregateMap = require('./aggregate-map');

async function faster(filter, joinCollection, joinField, project, options) {
  const aggregatePipeline = [];

  if (isObject(filter)) {
    aggregatePipeline.push({
      $match: filter
    });
  }

  const skip = get(options, 'skip', 0);
  const limit = get(options, 'limit', 100);
  const sort = get(options, 'sort', false);

  if (sort) {
    aggregatePipeline.push({
      $sort: sort
    });
  }

  aggregatePipeline.push({
    $skip: skip
  }, {
    $limit: limit
  });

  const [localField] = Object.keys(joinField);
  const foreignField = joinField[localField];

  aggregatePipeline.push({
    $lookup: {
      from: joinCollection.name,
      localField,
      foreignField,
      as: 'joinArray'
    }
  });

  const dbres = await this.aggregate(aggregatePipeline);

  return dbres.map(aggregateMap.bind({
    project
  }));
}

module.exports = faster;
