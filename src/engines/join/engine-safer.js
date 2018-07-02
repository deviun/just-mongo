const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.join.safer';

const get = require('lodash');

const aggregateMap = require('./aggregate-map');

async function safer (filter, joinCollection, joinField, project, options) {
  const skip = get(options, 'skip', 0);
  const limit = get(options, 'limit', 100);
  const sort = get(options, 'sort', false);

  const itemsForJoin = await this.find(filter, {
    limit, skip, sort
  });

  const [localField] = Object.keys(joinField);
  const foreignField = joinField[localField];
  const joinFilter = get(options, 'joinDocument.filter', {}) ;
  const joinSort = get(options, 'joinDocument.sort', false);

  const fieldValuesJoin = itemsForJoin.reduce((r, item) => {
    const itemfilter = {};

    itemfilter[foreignField] = item[localField];
    
    Object.assign(itemfilter, joinFilter);

    r[item._id] = itemfilter;

    return r;
  }, {});

  const aggregatePipeline = [];
  const $facet = Object.keys(fieldValuesJoin).reduce((r, key) => {
    const pipeline = [];

    pipeline.push({
      $match: fieldValuesJoin[key]
    });

    if (joinSort) {
      pipeline.push({
        $sort: joinSort
      });
    }

    pipeline.push({
      $limit: 1
    });

    r[key] = pipeline;

    return r;
  }, {});

  aggregatePipeline.push({$facet});

  const [joinDocs] = await joinCollection.aggregate(aggregatePipeline);

  return itemsForJoin
    .map((item) => {
      item.joinArray = joinDocs[item._id];

      return item;
    })
    .map(aggregateMap.bind({
      project
    }));
}

module.exports = safer;
