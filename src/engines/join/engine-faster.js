const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.join.faster';

const $path = require('path');
const _ = require('lodash');

async function faster (filter, joinCollection, joinField, project, options) {
  const thisCollection = this;
  const aggregatePipeline = [];

  if (_.isObject(filter)) {
    aggregatePipeline.push({
      $match: filter
    });
  }

  const skip = _.get(options, 'skip', 0);
  const limit = _.get(options, 'limit', 100);

  aggregatePipeline.push({
    $skip: skip
  });

  aggregatePipeline.push({
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

  let dbres = await this.aggregate(aggregatePipeline);

  dbres = dbres.map(aggregateMap.bind({
    project
  }));

  return dbres;
}

function aggregateMap (item) {
  const {joinArray} = item;
  const [joinDocument] = joinArray;
  const newDocument = {};
  const project = this.project;

  Object.keys(project).forEach((key) => {
    const propertyDescription = project[key].match(/([0-1])\.([a-z0-9_$]+)/i);
    const dataFrom = Number(propertyDescription[1]) === 0 ? item : joinDocument;
    const fromKey = propertyDescription[2];

    newDocument[key] = dataFrom[fromKey];
  });

  return newDocument;
}

module.exports = faster;