const ROOT = `${__dirname}/../`;

const _ = require('lodash');

const $path = require('path');
const $Connection = require($path.resolve(ROOT, 'src/connection'));
const $Model = require($path.resolve(ROOT, 'src/model'));
const $Collection = require($path.resolve(ROOT, 'src/collection'));
const $log = require($path.resolve(ROOT, 'src/libs/log'));

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
    const logLevel = _.get(connection, 'log', false);

    if (!logLevel) {
      $log.transports.console.level = 'none';
    } else {
      $log.transports.console.level = typeof logLevel === 'string' ? logLevel : 'info';
    }

    this.connectionId = String((new Date()).getTime());
    this.collectionReady = { 
      status: false, 
      connection: false 
    };

    collectionCache[this.connectionId] = {};

    const models = _.get(connection, 'models', {});
    
    $Model.init(models, this.collectionReady)
      .catch((err) => {
        $log.error(err);
      });
    
    if (setConnection) {
      return Object.assign(this, {
        connection: setConnection
      });
    }

    Object.assign(this, {
      connectionConfig: Object.assign({}, {
        host: _.get(connection, 'host', authDefault.host),
        user: _.get(connection, 'user', authDefault.user),
        password: _.get(connection, 'password', authDefault.password),
        port: _.get(connection, 'port', authDefault.port),
        db: _.get(connection, 'db', authDefault.db),
        replica: _.get(connection, 'replica', authDefault.replica),
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
      this.collectionReady,
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
