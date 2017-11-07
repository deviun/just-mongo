const $Winston = require('winston');

const Log = new $Winston.Logger();

const level = process.env.LOG_LEVEL || 'info';
const colorize = process.env.NODE_ENV === 'producation' ? false : true;

Log.configure({
  transports: [
    new ($Winston.transports.Console)({
      colorize,
      level,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      prettyPrint: true,
      timestamp: true
    })
  ]
});

module.exports = Log;
