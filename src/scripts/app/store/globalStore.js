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
		if (this._eventTypes.findIndex(x => x === eventType) === -1) {
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
				console.log('this._callbackFunctions[eventType][i]', this._callbackFunctions[eventType][i]);
				if (callback === this._callbackFunctions[eventType][i]) {
					console.log('MATCH', this._callbackFunctions[eventType][i]);
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

if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, 'findIndex', {
		value: function(predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			let o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			let len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			let thisArg = arguments[1];

			// 5. Let k be 0.
			let k = 0;

			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return k.
				let kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return k;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return -1.
			return -1;
		},
	});
}

export default new GlobalStore();
