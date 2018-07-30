const ObjectID = require('mongodb').ObjectID;
const get = require('lodash/get');
// Mongo settings key
const mongoSKRegExp = /\$[a-z_0-9]+/i;

class ObjectIDReplacer {
  static findString(obj) {
    function find(obj) {
      const isArray = obj instanceof Array;

      return Object.keys(obj).reduce((r, key) => {
        const item = obj[key];

        if (typeof item === 'string') {
          if (isArray) {
            r.push(new ObjectID(item));
          } else {
            r[key] = new ObjectID(item);
          }
        } else if (typeof item === 'object') {
          if (get(item, '_bsontype') !== 'ObjectID') {
            if (isArray) {
              r.push(find(item));
            } else {
              r[key] = find(item);
            }
          } else {
            if (isArray) {
              r.push(item);
            } else {
              r[key] = item;
            }
          }

        } else {
          if (isArray) {
            r.push(obj[key]);
          } else {
            r[key] = obj[key];
          }
        }

        return r;
      }, isArray ? [] : {});
    }

    return find(obj);
  }

  static findAndReplace(obj) {
    function find(obj) {
      if (typeof obj === 'string') {
        return obj;
      }

      const repObj = Object.keys(obj).reduce((r, key) => {
        if (key.match(mongoSKRegExp)) {
          r[key] = find(obj[key]);
        } else if (key === '_id' && get(obj[key], '_bsontype') !== 'ObjectID') {
          if (typeof obj[key] === 'object') {
            r[key] = ObjectIDReplacer.findString(obj[key]);
          } else {
            r[key] = new ObjectID(obj[key]);
          }

        } else {
          r[key] = obj[key];
        }

        return r;
      }, {});

      if (obj instanceof Array) {
        return Object.keys(repObj).reduce((r, key) => {
          r.push(repObj[key]);

          return r;
        }, []);
      }

      return repObj;
    }

    return find(obj);
  }
}

module.exports = {
  ObjectID,
  ObjectIDReplacer
};