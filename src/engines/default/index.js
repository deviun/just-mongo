class Default {
  constructor (collectionName, schema) {
    Object.assign(this, {
      collectionName,
      schema,
      origSchema: JSON.parse( JSON.stringify(schema) )
    });

    this.isDefault = Default.scan(this.schema);
  }

  static scan (schema) {
    let is;
    const schemaType = Default.getType(schema);

    if (schemaType === 'object' && typeof schema.properties !== 'undefined') {
      for (let prop in schema.properties) {
        const scan = Default.scan(schema.properties[prop]);

        if (scan) {
          is = true;
        }
      }
    } else if (schemaType === 'array' && typeof schema.items === 'object') {
      if (schema.items instanceof Array) {
        for (let itemSchema of schema.items) {
          const scan = Default.scan(itemSchema);

          if (scan) {
            is = true;
          }
        }
      } else {
        const scan = Default.scan(schema.items);

        if (scan) {
          is = true;
        }
      }
    }

    if (!is) {
      is = typeof schema.default !== 'undefined';
    }

    if (is) {
      delete schema.default;
    }

    return is;
  }

  static getType (schema) {
    return schema.bsonType || schema.type || 'unknown';
  }

  setDefault (doc, schema = this.origSchema) {
    if (!doc && typeof schema.default !== 'undefined') {
      return schema.default;
    } else if (!doc && typeof schema.default === 'undefined') {
      return doc;
    }

    const schemaType = Default.getType(schema);
    
    if (schemaType === 'object' && typeof schema.properties !== 'undefined') {
      for (let prop in schema.properties) {
        doc[prop] = this.setDefault(doc[prop], schema.properties[prop]);
      }
    } else if (schemaType === 'array' && typeof schema.items === 'object') {
      if (schema.items instanceof Array) {
        let index = 0;

        for (let itemSchema of schema.items) {
          doc[index] = this.setDefault(doc[index], itemSchema);
          ++index;
        }
      } else {
        let index = 0;

        for (let item of doc) {
          doc[index] = this.setDefault(doc[index], schema.items);
          ++index;
        }
      }
    } else {
      return doc;
    }

    return doc;
  }
}

module.exports = Default;