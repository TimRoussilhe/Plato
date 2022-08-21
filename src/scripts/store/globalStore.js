// Global store in addition of the STATE, Animation / mouse state when State is in charge of Application State.
class GlobalStore {
  constructor() {
    this._type = 'CommonModel';
    this._eventTypes = [];
    this._callbackFunctions = [];
    this._dataObj = {
      createdAt: new Date(),
      rafCallStack: [],
      scroll: {
        targetY: 0,
        currentY: 0,
      },
      mouse: {
        x: 0,
        y: 0,
      },
    };
  }

  on(eventType, callback) {
    if (this._eventTypes.findIndex((x) => x === eventType) === -1) {
      this._eventTypes.push(eventType);
    }

    if (this._callbackFunctions[eventType]) {
      this._callbackFunctions[eventType].push(callback);
    } else {
      this._callbackFunctions[eventType] = [];
      this._callbackFunctions[eventType].push(callback);
    }
  }

  off(eventType, callback) {
    if (this._callbackFunctions[eventType] !== undefined) {
      for (let i = 0; i < this._callbackFunctions[eventType].length; i++) {
        if (callback === this._callbackFunctions[eventType][i]) {
          this._callbackFunctions[eventType].splice(i, 1);
        }
      }
    }
  }

  offRAF(callback) {
    for (let i = 0; i < this.get('rafCallStack').length; i++) {
      let current = this.get('rafCallStack')[i];
      if (current === callback) {
        if (i > -1) {
          this.get('rafCallStack').splice(i, 1);
        }
      }
    }
  }

  set(attr, val, silent) {
    if (silent) {
      this._dataObj[attr] = val;
    } else {
      if (this._dataObj[attr] !== val) {
        const previous = this._dataObj[attr];
        this._dataObj[attr] = val;
        this._eventTypes.forEach((eventType, index) => {
          this._callbackFunctions[eventType].forEach((callback, index) => {
            if (eventType.indexOf('change:') > -1) {
              if (eventType === 'change:' + attr) {
                callback.call(this, val, previous);
              }
            } else {
              callback.call(this, val, previous);
            }
          });
        });
      }
    }
  }

  get(attr) {
    return this._dataObj[attr];
  }
}

export default new GlobalStore();
