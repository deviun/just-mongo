const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.connection';

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));
const { MongoClient } = require('mongodb');

class Connection {
  constructor(config, cb, nativeSandbox) {
    if (!config) {
      config = {};
    }
    
    const {
      user = '',
      password = '',
      host = 'localhost',
      port = 27017,
      db = '',
      replica: replicaSet
    } = config;

    if (nativeSandbox) {
      const resolve = (db) => {
        this.db = db;
      };

      const reject = (err) => {
        $log.error('[%s]', moduleName, err);
      };

      return nativeSandbox(resolve, reject);
    }

    this.db = false;

    const connectionURI = (user && password)
      ? `mongodb://${user}:${password}@${host}:${port}/${db}`
      : `mongodb://${host}:${port}/${db}`

    MongoClient.connect(connectionURI, { replicaSet }, (err, db) => {
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
          $log.debug('[%s] created new connection', moduleName, {
            config
          });
        }
      }
    });

    this.connectionURI = connectionURI;
  }

  isConnection() {
    return !!this.db;
  }
}

module.exports = Connection;
