const ROOT = `${__dirname}/../`;
const moduleName = 'jmongo.model';

const _ = require('lodash');

const $path = require('path');
const $log = require($path.resolve(ROOT, 'src/libs/log'));
const $Promise = require('bluebird');
const $Default = require('./engines/default');

class Model {
  static async init (models, jprovider) {
    let db;
    const defaultCollections = {};

    $log.debug('[%s] await connection for init', moduleName);

    await new $Promise((resolve) => {
      (function check () {
        if (!jprovider.connection) {
          setTimeout(check, 250);
        } else {
          db = jprovider.connection;
          resolve();
        }
      })()
    });

    $log.debug('[%s] db connected for init', moduleName);

    for (let collectionName of Object.keys(models)) {
      let schema;

      if (!models[collectionName].$jsonSchema) {
        schema = Model.createJsonSchema(models[collectionName]);
      } else {
        schema = models[collectionName].$jsonSchema;
      }

      const checkDefault = new $Default(collectionName, schema);

      if (checkDefault.isDefault) {
        defaultCollections[collectionName] = checkDefault;
      }

      const validatorOptions = {
        validator: { $jsonSchema: schema }/* ,
        validationLevel: 'strict',
        validationAction: 'error' */
      };

      let setSchema, cmd;
      try {
        cmd = Object.assign({
          create: collectionName
        }, validatorOptions);

        $log.debug('[%s] query for update Schema for "%s". ', moduleName, collectionName, schema, 'cmd: ', cmd);

        setSchema = await db.command(cmd);
      } catch (err) {
        $log.debug('[%s] use collMod for update schema', moduleName);

        try {
          cmd = Object.assign({
            collMod: collectionName
          }, validatorOptions);

          $log.debug('[%s] query for update Schema for "%s". ', moduleName, collectionName, schema, 'cmd: ', cmd);

          setSchema = await db.command(cmd);
        } catch (err2) {
          $log.error('[%s] error set schema to collection', moduleName, err, '\n-----\n', err2);

          throw new Error('error schema validation');
        }
      }

      $log.debug('[%s] schema for "%s" created. ', moduleName, collectionName, schema, 'result: ', setSchema);
    }

    jprovider.defaultCollections = defaultCollections;
    jprovider.collectionReady = true;
  }

  static createJsonSchema (oldSchema) {
    const schema = {
      bsonType: 'object',
      properties: {}
    };

    Object.keys(oldSchema).forEach((property) => {
      schema.properties[property] = {};

      const value = oldSchema[property];
      const prop = schema.properties[property];

      function setTypeOfFn (fn) {
        switch (fn) {
          case String:
            prop.type = 'string';
          break;
          case Number:
            prop.type = 'number';
          break;
          case Object: 
            prop.type = 'object';
          break;
          case Array: 
            prop.type = 'array';
          break;
          case Boolean:
            prop.type = 'boolean';
          break;
        }
      }

      if (typeof value === 'function') {
        setTypeOfFn(value);
      } else if (typeof value === 'object') {
        setTypeOfFn(value.type);

        if (value.required) {
          if (!schema.required) {
            schema.required = [];
          }
          
          schema.required.push(property);
        }

        if (value.default) {
          prop.default = value.default;
        }
      } else {
        throw new Error('collection model is invalid type');
      }
    });

    return schema;
  }
}

module.exports = Model;
