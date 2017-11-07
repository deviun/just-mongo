const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.jmongo';

const _ = require('lodash');

const $path = require('path');
const $Connection = require($path.resolve(ROOT, 'src/connection'));
const $Model = require($path.resolve(ROOT, 'src/model'));
const $Collection = require($path.resolve(ROOT, 'src/collection'));

const authDefault = {
  host: '127.0.0.1',
  user: false,
  password: false,
  db: 'test',
  port: 27017
};

class JMongo {
  constructor (connection, cb) {
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
    this.models = new $Model(models);
  }

  collection (name) {
    const dataValidator = this.models.createValidator(name);

    return new $Collection(this.connection, dataValidator, name);
  }

}

module.exports = JMongo;