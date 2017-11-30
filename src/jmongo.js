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

class JMongo {
  constructor (connection, cb, setConnection) {
    const logLevel = _.get(connection, 'log', false);
    const strictMode = _.get(connection, 'strict', false);

    if (!logLevel) {
      $log.transports.console.level = 'none';
    } else {
      $log.transports.console.level = typeof logLevel === 'string' ? logLevel : 'info';
    }
    
    if (setConnection) {
      return Object.assign(this, {
        connection: setConnection,
        models: new $Model(_.get(connection, 'models'), strictMode)
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

    const models = _.get(connection, 'models');

    this.connection = new $Connection(this.connectionConfig, cb);
    this.models = new $Model(models, strictMode);
  }

  collection (name) {
    const dataValidator = this.models.createValidator(name);

    return new $Collection(this.connection, dataValidator, name);
  }

  static nativeConnection (models, sandbox) {
    const nConnection = new $Connection(null, null, sandbox);

    return new JMongo({models}, null, nConnection);
  }

}

module.exports = JMongo;
