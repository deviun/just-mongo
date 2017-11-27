const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.model';

const _ = require('lodash');

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

class Validator {
  constructor (model) {
    this.model = model;
  }

  check (object, options) {
    const model = this.model;

    let newObject, isSet;

    if (_.has(object, '$set')) {
      newObject = Object.assign({}, object.$set);
      isSet = true;
    } else {
      newObject = Object.assign({}, object);
    }

    Object.keys(newObject).forEach((key) => {
      if (!_.has(model, key)) {
        const newError = `validation error: property "${key}" is not found in model ${JSON.stringify(Object.keys(model))}`;

        $log.error('[%s]', moduleName, newError);

        throw new Error(newError);
      }
    });

    Object.keys(model).forEach((key) => {
      const dataOfKey = model[key];

      if (typeof dataOfKey === 'function' && _.has(newObject, key)) {
        newObject[key] = dataOfKey(newObject[key]);
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

    if (isSet) {
      return {$set: newObject};
    } else {
      return newObject;
    }
  }

  _type (object, key, dataOfKey, paramValue) {
    if (!_.has(object, key)) {
      return;
    }

    object[key] = paramValue(object[key]);
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

  _isValid (object, key, dataOfKey, paramValue) {
    if (!_.has(object, key)) {
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
  constructor (models) {
    this.models = models;
  }

  createValidator (collectionName) {
    return new Validator(this.models[collectionName]);
  }
}

module.exports = Model;
