const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.join.aggregate-map';

const _ = require('lodash');

function aggregateMap(item) {
  const {joinArray} = item;
  const [joinDocument] = joinArray;
  const newDocument = {};
  const project = this.project;

  Object.keys(project).forEach((key) => {
    const propertyDescription = project[key].match(/([0-1])\.([a-z0-9_$]+)/i);
    const dataFrom = Number(propertyDescription[1]) === 0 ? item : joinDocument;
    const fromKey = propertyDescription[2];

    if (_.has(dataFrom, fromKey)) {
      newDocument[key] = dataFrom[fromKey];
    } else {
      newDocument[key] = null;
    }    
  });

  return newDocument;
}

module.exports = aggregateMap;
