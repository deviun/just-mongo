const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.collection';

const _ = require('lodash');

const $path = require('path');
const $Promise = require('bluebird');
const $log = require($path.resolve(ROOT, 'src/libs/log'));

class Collection {
  constructor (connection, dataValidator, name) {
    Object.assign(this, {
      connection,
      name,
      dataValidator
    });

    this.createCollection();
  }

  async checkConnection () {
    let isConnection = await this.connection.isConnection();

    if (isConnection) {
      return true;
    }

    return await new $Promise((resolve, reject) => {
      let checkCount = 0;

      const checkConnection = async () => {
        isConnection = await this.connection.isConnection();

        if (isConnection) {
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
    await this.checkConnection();

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

    list = list.map((item) => {
      return this.dataValidator.check(item);
    });

    return await this.collection.insertMany(list, options);
  }

  async deleteMany (filter, options) {
    await this.checkConnection();

    $log.debug('[%s][deleteMany] filter:', moduleName, filter);

    return await this.collection.deleteMany(filter, options);
  }

  async deleteOne (filter, options) {
    await this.checkConnection();

    $log.debug('[%s][deleteOne] filter:', moduleName, filter);

    return await this.collection.deleteOne(filter, options);
  }

  async count (query, options) {
    await this.checkConnection();

    $log.debug('[%s][count] query:', moduleName, query);

    return await this.collection.count(query, options);
  }

  async findOne (query, options) {
    await this.checkConnection();

    $log.debug('[%s][findOne] query:', moduleName, query);

    return await this.collection.findOne(query, options);
  }

  async find (query, options) {
    await this.checkConnection();

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
        } else {
          return resolve(dbres);
        }
      });
    });
  }

  async updateOne (filter, update, options) {
    await this.checkConnection();

    $log.debug('[%s][updateOne] filter:', moduleName, filter, {
      update
    });

    update = this.dataValidator.check(update, {
      set: _.get(update, '$set', false)
    });

    return await this.collection.updateOne(filter, update, options);
  }

  async updateMany (filter, update, options) {
    await this.checkConnection();

    $log.debug('[%s][updateMany] filter:', moduleName, filter, {
      update
    });

    update = this.dataValidator.check(update, {
      set: _.get(update, '$set', false)
    });

    return await this.collection.updateMany(filter, update, options);
  }

}

module.exports = Collection;
