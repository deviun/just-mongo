const get = require('lodash/get');

const $Connection = require('./connection');
const $Model = require('./model');
const $Collection = require('./collection');
const $log = require('./libs/log');

const authDefault = {
  host: '127.0.0.1',
  user: false,
  password: false,
  db: 'test',
  port: 27017
};

const collectionCache = {};

class JMongo {
  constructor (connection, cb, setConnection) {
    const logLevel = get(connection, 'log', false);

    if (!logLevel) {
      $log.transports.console.level = 'none';
    } else {
      $log.transports.console.level = typeof logLevel === 'string' ? logLevel : 'info';
    }

    this.connectionId = String((new Date()).getTime());
    this.jprovider = { 
      collectionReady: false, 
      connection: false 
    };

    collectionCache[this.connectionId] = {};

    const models = get(connection, 'models');

    if (models) {
      $Model.init(models, this.jprovider)
        .catch((err) => {
          $log.error(err);
        });
    } else {
      this.jprovider.collectionReady = true;
    }
    
    if (setConnection) {
      return Object.assign(this, {
        connection: setConnection
      });
    }

    Object.assign(this, {
      connectionConfig: Object.assign({}, {
        host: get(connection, 'host', authDefault.host),
        user: get(connection, 'user', authDefault.user),
        password: get(connection, 'password', authDefault.password),
        port: get(connection, 'port', authDefault.port),
        db: get(connection, 'db', authDefault.db),
        replica: get(connection, 'replica', authDefault.replica),
      }),
      connection: false
    });

    this.connection = new $Connection(this.connectionConfig, cb);
  }

  collection (name) {
    if (collectionCache[this.connectionId][name]) {
      return collectionCache[this.connectionId][name];
    }

    collectionCache[this.connectionId][name] = new $Collection(
      this.connection, 
      this.jprovider,
      name
    );

    return collectionCache[this.connectionId][name];
  }

  setDocumentProject (name, replacer) {
    this.collection(name).documentProject = replacer;
  }

  static nativeConnection (options, sandbox) {
    return new JMongo(
      options, 
      null, 
      new $Connection(null, null, sandbox)
    );
  }

  static multi (connections) {
    return {db: connections};
  }

}

module.exports = JMongo;
