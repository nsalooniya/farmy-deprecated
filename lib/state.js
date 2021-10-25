// // ======== ASM: Advance State Manager
//
// class State {
//
// 	constructor(init = {}) {
// 		this._state = {};
// 		this._catch = {};
// 		for (const prop in init) {
// 			this.init(prop, init[prop]);
// 		}
// 	}
//
// 	// Private API
//
// 	_defineGetterSetter(prop) {
// 		Object.defineProperty(this, prop, {
// 			get() {
// 				return this._state[prop];
// 			},
// 			set(value) {
// 				this._state[prop] = value;
// 			}
// 		});
// 	}
//
// 	// Public API
//
// 	init(prop, value = undefined) {
// 		this._defineGetterSetter(prop);
// 		this._state[prop] = value;
// 		return this;
// 	}
//
// 	catch(event, ...fn) {
// 		if (this._catch[event]) this._catch[event].push(...fn);
// 		else this._catch[event] = [...fn];
// 		return this;
// 	}
//
// 	fire(event, ...values) {
// 		this._catch[event]?.forEach(fn => {
// 			fn(...values);
// 		});
// 		return this;
// 	}
//
// }
//
// export default State;


// ==== NEW

/* Magler State */

// Constructor

// const State = function () {
// 	this._keys = {};
// 	this._events = {};
// };
//
// // Private API
//
// State.prototype._createKey = function (keyFix, keyName, keyValue) {
// 	// get key
// 	const key = this._keys[keyName];
//
// 	// if key already exist
// 	if (key !== undefined) throw Error(`key ${keyName} already exist`);
//
// 	// create key
// 	this._keys[keyName] = {
// 		fix: keyFix,
// 		value: keyValue
// 	};
//
// 	// return this
// 	return this;
// };
//
// State.prototype._getKeyValue = function (keyName) {
// 	// get key
// 	const key = this._keys[keyName];
//
// 	// if key does not exist
// 	if (key === undefined) throw Error(`key ${keyName} does not exist`);
//
// 	// return key value
// 	return key.value;
// };
//
// State.prototype._setKeyValue = function (keyName, keyValue) {
// 	// get key
// 	const key = this._keys[keyName];
//
// 	// if key does not exist
// 	if (key === undefined) throw Error(`key ${keyName} does not exist`);
//
// 	// if key is fix
// 	if (key.fix === true) throw Error(`key ${keyName} is fix`);
//
// 	// fire key acts
// 	if (key.acts !== undefined) key.acts.forEach(fn => {
// 		fn(keyValue);
// 	});
//
// 	// set key value
// 	key.value = keyValue;
//
// 	// return this
// 	return this;
// };
//
// State.prototype._setKeyAct = function (keyName, act) {
// 	// get key
// 	const key = this._keys[keyName];
//
// 	// if key does not exist
// 	if (key === undefined) throw Error(`key ${keyName} does not exist`);
//
// 	// set key act
// 	if (key.acts) key.acts.push(act);
// 	else key.acts = [act];
//
// 	// return this
// 	return this;
// };
//
// State.prototype._deleteKey = function (keyName) {
// 	// delete key
// 	delete this._keys[keyName];
//
// 	// return this
// 	return this;
// };
//
// // Public API
//
// State.prototype.fix = function (keyName, keyValue) {
// 	return this._createKey(true, keyName, keyValue);
// };
//
// State.prototype.let = function (keyName, keyValue) {
// 	return this._createKey(false, keyName, keyValue);
// };
//
// State.prototype.get = function (keyName) {
// 	return this._getKeyValue(keyName);
// };
//
// State.prototype.set = function (keyName, keyValue) {
// 	return this._setKeyValue(keyName, keyValue);
// };
//
// State.prototype.act = function (keyName, act) {
// 	return this._setKeyAct(keyName, act);
// };
//
// State.prototype.del = function (keyName) {
// 	return this._deleteKey(keyName);
// };
//
// State.prototype.catch = function (event, ...fns) {
// 	// add event functions
// 	if (this._events[event]) this._events[event].push(...fns);
// 	else this._events[event] = [...fns];
//
// 	// return this
// 	return this;
// };
//
// State.prototype.fire = async function (event, ...values) {
// 	// fire event functions
// 	if (this._events[event] !== undefined) this._events[event].forEach(fn => {
// 		fn(...values);
// 	});
//
// 	// return this
// 	return this;
// };
//
// // Export
// export default State;


// NEW MAGLER STATE

// Constructor

const State =  function () {
	this._keys = {};
	this._catches = {};
};

// Private API

State.prototype._createKey = function (keyConst, keyType, keyName, keyValue) {
	// read key
	const key = this._readKey(keyName);
	
	// if key already exist
	if (key !== undefined) throw Error('Key already exists');
	
	// if keyType does not match
	if (keyType !== null && keyValue !== null && keyType !== keyValue.constructor) throw Error('key type does not match');
	
	// create key
	this._keys[keyName] = {
		const: keyConst,
		type: keyType,
		value: keyValue
	};
	
	// return this
	return this;
};

State.prototype._readKey = function (keyName, checkExist) {
	// read key
	const key = this._keys[keyName];
	
	// if key does not exist
	if (checkExist === true && key === undefined) throw Error('key does not exist');
	
	// return key
	return key;
};

State.prototype._deleteKey = function (keyName) {
	// delete key
	delete this._keys[keyName];
	
	// return this
	return this;
};

// Public API

State.prototype.const = function (keyType, keyName, keyValue) {
	// create key and return this
	return this._createKey(true, keyType, keyName, keyValue);
};

State.prototype.let = function (keyType, keyName, keyValue) {
	// create key and return this
	return this._createKey(false, keyType, keyName, keyValue);
};

State.prototype.get = function (keyName) {
	// read key
	const key = this._readKey(keyName, true);
	
	// return key value
	return key.value;
};

State.prototype.set = function (keyName, keyValue) {
	// read key
	const key = this._readKey(keyName, true);
	
	// if key is const
	if (key.const === true) throw Error('key is const');
	
	// if keyType does not match
	if (key.type !== null && key.type !== keyValue.constructor) throw new Error('key type does not match');
	
	// execute acts
	if (key.acts) key.acts.forEach(act => act(keyValue, key.value));
	
	// update key value
	key.value = keyValue;
	
	// return this
	return this;
};

State.prototype.delete = function (keyName) {
	// delete key and return this
	return this._deleteKey(keyName);
};

State.prototype.act = function (keyName, fn) {
	// read key
	const key = this._readKey(keyName, true);
	
	// add act
	if (key.acts) key.act.push(fn);
	else key.acts = [fn];
	
	// return this
	return this;
};

State.prototype.catch = function (event, fn) {
	// add catch
	if (this._catches[event]) this._catches[event].push(fn);
	else this._catches[event] = [fn];
	
	// return this
	return this;
};

State.prototype.fire = function (event, ...values) {
	// add catch
	if (this._catches[event]) this._catches[event].forEach(fn => fn(...values));
	
	// return this
	return this;
};

State.prototype.loopKeys = function (fn) {
	// loop keys
	let i = 0;
	for (const key in this._keys) {
		fn(key, this._keys[key], i++);
	}
	
	// return this
	return this;
};

State.prototype.mapKeys = function (fn) {
	// create map
	const map = [];
	
	// loop keys
	this.loopKeys((keyName, key, i) => map[i] = fn(keyName, key, i));
	
	// return map
	return map;
};

State.prototype.raw = function () {
	// create raw object
	const raw = {};
	
	// loop keys
	this.loopKeys((keyName, key) => raw[keyName] = key.value);
	
	// return raw object
	return raw;
};

State.prototype.shiftKey = function (newState, ...keyNames) {
	if (keyNames) keyNames.forEach(keyName => {
		const key = this._readKey(keyName, true);
		newState._createKey(key.const, key.type, keyName, key.value);
		this._deleteKey(keyName);
	});
};

// Export

export default State;


