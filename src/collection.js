const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.collection';

const _ = require('lodash');

const $path = require('path');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

// engines
const $joinEngine = require($path.resolve(ROOT, 'src/engines/join'));
const $listenEngine = require($path.resolve(ROOT, 'src/engines/listen'));

const {ObjectIDReplacer, ObjectID} = require($path.resolve(ROOT, 'src/object-id'));

class Collection {
  constructor (connection, jprovider, name) {
    Object.assign(this, {
      connection,
      name,
      jprovider
    });

    this.createCollection();
  }

  async checkConnection (options) {
    let isConnection;

    if (isConnection) {
      return true;
    }

    return await new $Promise((resolve, reject) => {
      let checkCount = 0;

      const checkConnection = async () => {
        isConnection = this.connection.isConnection();

        $log.debug('[%s] checkConnection, options: ', moduleName, options || {}, 'collectionReadyStatus', this.jprovider.collectionReady);

        if (isConnection &&
           ( _.get(options, 'ignoreCollectionReady') ? true : this.jprovider.collectionReady )
        ) {
          return resolve(true);
        } else {
          if (checkCount < 15) {
            ++checkCount;
            setTimeout(checkConnection, 250);
          } else {
            return reject('connection for mongodb is not found');
          }
        }
      };

      checkConnection();
    });
  }

  async createCollection () {
    await this.checkConnection({
      ignoreCollectionReady: true
    });

    this.jprovider.connection = this.connection.db;
    this.collection = this.connection.db.collection(this.name);
  }

  async insert (list, options) {
    await this.checkConnection();

    $log.debug('[%s][insert] list:', moduleName, list);

    const isList = (list instanceof Array);
    const isObject = (list instanceof Object);

    if (!isList && isObject) {
      list = [list];
    } else if (!isObject) {
      const newError = 'list for insert not is Object or Array of Object';

      $log.error('[%s]', moduleName, newError);

      throw new Error(newError);
    }

    if (!list.length) {
      return;
    }

    const defaultSchema = this.jprovider.defaultCollections[this.name];

    if (defaultSchema) {
      list = list.map((doc) => defaultSchema.setDefault(doc));
    }

    return await this.collection.insertMany(list, options);
  }

  async deleteMany (filter, options) {
    await this.checkConnection();

    if (!filter) {
      filter = {};
    }

    filter = ObjectIDReplacer.findAndReplace(filter);

    $log.debug('[%s][deleteMany] filter:', moduleName, filter);

    return await this.collection.deleteMany(filter, options);
  }

  async deleteOne (filter, options) {
    await this.checkConnection();

    if (!filter) {
      filter = {};
    }

    filter = ObjectIDReplacer.findAndReplace(filter);

    $log.debug('[%s][deleteOne] filter:', moduleName, filter);

    return await this.collection.deleteOne(filter, options);
  }

  async count (query, options) {
    await this.checkConnection();

    if (!query) {
      query = {};
    }

    $log.debug('[%s][count] query:', moduleName, query);

    return await this.collection.count(query, options);
  }

  ObjectID (id) {
    return new ObjectID(id);
  }

  async findOne (query, options) {
    await this.checkConnection();

    if (!query) {
      query = {};
    }

    query = ObjectIDReplacer.findAndReplace(query);

    $log.debug('[%s][findOne] query:', moduleName, query);

    const dbres = await this.collection.findOne(query, options);

    if (!this.documentProject) {
      return dbres;
    } else {
     return this._project(dbres);
    }
  }

  async find (query, options) {
    await this.checkConnection();

    if (!query) { // for "false", "null" .etc
      query = {};
    }

    query = ObjectIDReplacer.findAndReplace(query);

    $log.debug('[%s][find] query:', moduleName, query);

    const cursor = this.collection.find(query);

    if (options) {
      Object.keys(options).forEach((fn) => {
        cursor[fn](options[fn]);
      });
    }

    return await new $Promise((resolve, reject) => {
      cursor.toArray((err, dbres) => {
        if (err) {
          return reject(err);
        }

        if (!this.documentProject) {
          return resolve(dbres);
        } else {
          return resolve(this._project(dbres));
        }
      });
    });
  }

  _project (result) {
    if (result instanceof Array) {
      return result.map((item) => this.documentProject.apply(item));
    } else if (typeof result === 'object') {
      return this.documentProject.apply(result);
    } else {
      throw new Error(`[${moduleName}][_project] an unknown data type was received`);
    }
  }

  async updateOne (filter, update, options) {
    await this.checkConnection();

    if (!filter) {
      filter = {};
    }

    filter = ObjectIDReplacer.findAndReplace(filter);

    $log.debug('[%s][updateOne] filter:', moduleName, filter, {
      update
    });

    return await this.collection.updateOne(filter, update, options);
  }

  async updateMany (filter, update, options) {
    await this.checkConnection();

    if (!filter) {
      filter = {};
    }

    filter = ObjectIDReplacer.findAndReplace(filter);

    $log.debug('[%s][updateMany] filter:', moduleName, filter, {
      update
    });

    return await this.collection.updateMany(filter, update, options);
  }

  async editOne (filter, update, options) {
    return this.updateOne(filter, {
      $set: update
    }, options);
  }

  async editMany (filter, update, options) {
    return this.updateMany(filter, {
      $set: update
    }, options);
  }

  async aggregate (pipeline, options = {}) {
    await this.checkConnection();

    $log.debug(
      '[%s][aggregate] pipeline: %s',
      moduleName,
      $log.transports.console.level === 'debug' ? JSON.stringify(pipeline) : false
    );

    return await new $Promise((resolve, reject) => {
      this.collection.aggregate(pipeline, options, (err, dbres) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(dbres);
        }
      })
    });
  }

  async native (cb) {
    await this.checkConnection();

    return await new $Promise((resolve, reject) => {
      cb(this.collection, resolve, reject);
    });
  }

  async findRandom (where, count = 5, options) {
    await this.checkConnection();

    const aggregatePipeline = [];

    if (where && where instanceof Object) {
      aggregatePipeline.push({
        $match: where
      });
    }

    aggregatePipeline.push({
      $sample: {
        size: Math.abs(count)
      }
    });

    const projectDocuments = _.get(options, 'project');

    if (projectDocuments) {
      aggregatePipeline.push({
        $project: projectDocuments
      })
    }

    return await this.aggregate(aggregatePipeline);
  }

  async join (filter, joinCollection, joinField, project, options) {
    await this.checkConnection();
    
    return await $joinEngine.apply(this, arguments);
  }

  listen (getUpdates, timeout) {
    return new $listenEngine(...arguments);
  }

}

module.exports = Collection;
