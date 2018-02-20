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
    const virtualObject = VirtualObject.get();

    $log.info({
      virtualObject
    });

    return object;
  }

}

class VirtualObject {
  static get () {
    
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
