const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.model';

const _ = require('lodash');

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

class Validator {
  constructor (model, strictMode) {
    Object.assign(this, {
      model,
      strictMode
    });
  }

  check (object, options) {
    const model = this.model || {};

    let newObject;
    const isMongoKeys = Object.keys(object).find((key) => key.match(/\$[a-z]+/i));
    const mongoKeysIndexes = {};

    if (isMongoKeys) {
      options.set = true;
      newObject = Object.assign({}, ...Object.keys(object).map((key) => {
        if (key.match(/\$[a-z]+/i)) {
          mongoKeysIndexes[key] = [...Object.keys(object[key])];

          return object[key];
        } else {
          const retObject = {};

          retObject[key] = object[key];
          
          return retObject;
        }
      }));

      if (Object.keys(object).find((key) => key === '$rename')) {
        options.rename = true;
      }
      
      if (Object.keys(object).find((key) => key === '$unset')) {
        options.unset = true;
      }
    } else {
      newObject = Object.assign({}, object);
    }

    Object.keys(newObject).forEach((key) => {
      if (!_.has(model, key)) {
        const newError = `validation error: property "${key}" is not found in model ${JSON.stringify(Object.keys(model))}`;

        $log.error('[%s]', moduleName, newError);

        throw new Error(newError);
      }

      if (
        this.strictMode && 
        !_.get(options, 'rename')
      ) {
        let checkArray;

        if (_.get(model[key], 'type') === Array || model[key] === Array) {
          if (!(newObject[key] instanceof Array)) {
            const newError = `validation error: property "${key}" has an invalid data type; data are ${typeof newObject[key]}, and an array is expected`;
  
            $log.error('[%s]', moduleName, newError);
  
            throw new Error(newError);
          }
        } else {
          const trueType = typeof model[key] === 'function' ?
            typeof model[key]({}) : 
            typeof model[key].type({});
          const currentType = typeof newObject[key];
  
          if (trueType !== currentType) {
            const newError = `validation error: property "${key}" has an invalid data type; data are ${currentType}, and an ${trueType} is expected`;
  
            $log.error('[%s]', moduleName, newError);
  
            throw new Error(newError);
          }
        }
      }
    });

    Object.keys(model).forEach((key) => {
      const dataOfKey = model[key];

      if (
        typeof dataOfKey === 'function' && 
        _.has(newObject, key) &&
        (
          !_.get(options, 'rename') || 
          !Object.keys(object.$rename).includes(key)
        ) &&
        (
          !_.get(options, 'unset') ||
          !Object.keys(object.$unset).includes(key)
        )
      ) {
        if (dataOfKey !== Array) {
          newObject[key] = dataOfKey(newObject[key]);
        } else if (!(newObject[key] instanceof Array)) {
          newObject[key] = Array(newObject[key]);
        }
      } else if (typeof dataOfKey === 'object'
                 && !(dataOfKey instanceof Array))
      {
        Object.keys(dataOfKey).forEach((param) => {
          if (this[`_${param}`]) {
            this[`_${param}`](newObject, key, dataOfKey, dataOfKey[param], options);
          }
        });
      }
    });

    if (isMongoKeys) {
      const restoreObject = {};
      const useProperties = [];

      Object.keys(mongoKeysIndexes).forEach((key) => {
        restoreObject[key] = mongoKeysIndexes[key].reduce((r, c) => {
          r[c] = newObject[c];

          useProperties.push(c);

          return r;
        }, {});
      });

      Object
        .keys(newObject).filter((key) => {
          return !(useProperties.includes(key));
        })
        .forEach((key) => {
          restoreObject[key] = newObject[key];
        });

      return restoreObject;

    } else {
      return newObject;
    }
  }

  _type (object, key, dataOfKey, paramValue, options) {
    if (!_.has(object, key) || _.get(options, 'rename') || _.get(options, 'unset')) {
      return;
    }

    if (paramValue !== Array) {
      object[key] = paramValue(object[key]);
    } else if (!(object[key] instanceof Array)) {
      object[key] = Array(object[key]);
    }
  }

  _default (object, key, dataOfKey, paramValue, options) {
    if (!_.has(object, key) && _.get(options, 'set', false) === false) {
      object[key] = paramValue;
    }
  }

  _required (object, key, dataOfKey, paramValue, options) {
    if (!_.has(object, key) && _.get(options, 'set', false) === false) {
      const newError = `validation error: property "${key}" is not found in ${JSON.stringify(object)}`;

      $log.error('[%s]', moduleName, newError);

      throw new Error(newError);
    }
  }

  _isValid (object, key, dataOfKey, paramValue, options) {
    if (!_.has(object, key) || _.get(options, 'rename') || _.get(options, 'unset')) {
      return;
    }

    const check = paramValue(object[key]);

    if (!check) {
      const newError = `validation error: property "${key}" is not valid in ${JSON.stringify(object)}`;

      $log.error('[%s]', moduleName, newError);

      throw new Error(newError);
    }
  }
}

class Model {
  constructor (models, strictMode) {
    Object.assign(this, {
      models,
      strictMode
    });
  }

  createValidator (collectionName) {
    return new Validator(this.models[collectionName], this.strictMode);
  }
}

module.exports = Model;
