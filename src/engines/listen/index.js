const ROOT = `${__dirname}/../../../`;
const moduleName = 'jmongo.engines.listen';

const EventEmitter = require('events');
const _ = require('lodash');

class Listen extends EventEmitter {
  constructor(getUpdates, timeout = 250) {
    super();

    Object.assign(this, {
      getUpdates,
      timeout,
      lastUpdates: false,
      stop: false,
      errorHandler: (err) => console.log(err)
    });

    this._check();
  }

  async _check() {
    if (this.stop) {
      return;
    }

    try {
      const updates = await this.getUpdates(this.lastUpdates)
        .catch(this.errorHandler);

      const isSend = typeof updates === 'string' ? updates.length !== 0 :
        typeof updates === 'number' ? updates !== 0 :
        updates instanceof Array ? updates.length !== 0 :
        typeof updates === 'object' ? updates && Object.keys(updates).length !== 0 :
        typeof updates === 'boolean' ? updates : true;

      if (isSend) {
        this.lastUpdates = updates;
        super.emit('updates', updates);
      }

      this.lastCheckTimer = setTimeout(this._check.bind(this), this.timeout);
    } catch (err) {
      this.errorHandler(err);
    }
  }

  addListener(cb) {
    super.addListener('updates', cb);

    return this;
  }

  removeListener(cb) {
    super.removeListener('updates', cb);

    return this;
  }

  close() {
    clearTimeout(this.lastCheckTimer);
    super.removeAllListeners();
    this.stop = true;
  }

  error(cb) {
    this.errorHandler = cb;

    return this;
  }
  
}

module.exports = Listen;
