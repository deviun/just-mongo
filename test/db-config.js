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
        default: 'test'
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
    },
    defaultCollection: {
      $jsonSchema: {
        bsonType: 'object',
        properties: {
          key1: {
            type: 'string',
            default: 'defaultString'
          },
          key2: {
            type: 'object',
            properties: {
              key21: {
                type: 'string',
                default: 'def21String'
              },
              key22: {
                type: 'string'
              },
              arrOfObjects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    str: {
                      type: 'string'
                    },
                    bool: {
                      type: 'boolean',
                      default: true
                    }
                  }
                }
              },
              arr2Object: {
                type: 'array',
                items: [
                  {
                    type: 'object',
                    properties: {
                      str: {
                        type: 'string'
                      },
                      bool: {
                        type: 'boolean',
                        default: true
                      }
                    }
                  },
                  {
                    type: 'object',
                    properties: {
                      str: {
                        type: 'string'
                      },
                      bool: {
                        type: 'boolean',
                        default: false
                      }
                    }
                  }
                ]
              }
            },
            default: {
              key21: 'defObj21'
            }
          }
        }
      }
    }
  }  
};