module.exports = {
  db: 'jmongo',
  user: 'admin',
  password: 'admin',
  models: {
    avaTests: {
      key: String,
      value: String,
      def: {
        type: String,
        default: 'test',
        isValid: () => true
      }
    },
    joinTo: {
      user_id: Number,
      text: String,
      time: String
    },
    joinFrom: {
      id: Number,
      name: String
    },
    random: {
      test: Number
    },
    speed: {
      string: String,
      number: Number,
      object: Object,
      boolean: Boolean
    },
    types: {
      string: String,
      number: Number,
      boolean: Boolean,
      array: Array,
      array2: {
        type: Array
      },
      object: Object
    },
    feed: {
      $jsonSchema: {
        bsonType: 'object',
        properties: {
          data: {
            type: 'string'
          },
          time: {
            type: 'number'
          },
          index: {
            type: 'number'
          }
        }
      }
    },
    incArray: {
      arr: Array,
      inc: Number
    },
    newAvaDB: {
      $jsonSchema: {
        bsonType: 'object',
        required: [ 'key1' ],
        properties: {
          key1: {
            type: 'string'
          },
          key2: {
            type: 'number'
          }
        }
      }
    }
  }  
};