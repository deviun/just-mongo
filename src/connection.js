const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.connection';

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));
const $mongodb = require('mongodb');

class Connection {
  constructor (config, cb) {
    this.db = false;

    const connectionURI = `mongodb://${!config.user ? '' : `${config.user}:${config.password}@`}${config.host}:${config.port}/${config.db}`;
    
    const options = Object.assign({}, {
      replicaSet: config.replica
    });
    
    const {MongoClient} = $mongodb;
    
    MongoClient.connect(connectionURI, options, (err, db) => {
      if (err) {
        if (cb) {
          return cb(err);
        } else {
          $log.error('[%s]', moduleName, err);
        }
      } else {
        this.db = db;

        if (cb) {
          cb(null, true);
        } else {
          $log.info('[%s] created new connection', moduleName, {
            config
          });
        }
      }
    });

  }

  async isConnection () {
    return Boolean(this.db);
  }
}

module.exports = Connection;