module.exports = {
  db: 'jmongo',
  models: {
    avaTests: {
      key: String,
      value: String,
      def: {
        type: String,
        default: 'test',
        isValid: (value) => true
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
    }
  }  
};