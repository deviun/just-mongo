const ObjectID = require('mongodb').ObjectID;
// Mongo settings key
const mongoSKRegExp = /\$[a-z_0-9]+/i;

class ObjectIDReplacer {
  static findString (obj) {
    function find (obj) {
      return Object.keys(obj).reduce((r, key) => {
        const item = obj[key];
        
        if (typeof item === 'string') {
          r[key] = new ObjectID(obj[key]);
        } else if (typeof item === 'object') {
          r[key] = find(obj[key]);
        } else {
          r[key] = obj[key];
        }

        return r;
      }, {});
    }

    return find(obj);
  }

  static findAndReplace (obj) {
    function find (obj) {
      return Object.keys(obj).reduce((r, key) => {
        if (key.match(mongoSKRegExp)) {
          r[key] = find(obj[key]);
        } else if (key === '_id' && !(obj[key] instanceof ObjectID)) {
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
    }

    return find(obj);
  }
}

module.exports = {
  ObjectID,
  ObjectIDReplacer
};