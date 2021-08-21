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

const State = function () {
	this._keys = {};
	this._events = {};
};

// Private API

State.prototype._createKey = function (keyFix, keyName, keyValue) {
	// get key
	const key = this._keys[keyName];
	
	// if key already exist
	if (key !== undefined) throw Error(`key ${keyName} already exist`);
	
	// create key
	this._keys[keyName] = {
		fix: keyFix,
		value: keyValue
	};
	
	// return this
	return this;
};

State.prototype._getKeyValue = function (keyName) {
	// get key
	const key = this._keys[keyName];
	
	// if key does not exist
	if (key === undefined) throw Error(`key ${keyName} does not exist`);
	
	// return key value
	return key.value;
};

State.prototype._setKeyValue = function (keyName, keyValue) {
	// get key
	const key = this._keys[keyName];
	
	// if key does not exist
	if (key === undefined) throw Error(`key ${keyName} does not exist`);
	
	// if key is fix
	if (key.fix === true) throw Error(`key ${keyName} is fix`);
	
	// fire key acts
	if (key.acts !== undefined) key.acts.forEach(fn => {
		fn(keyValue);
	});
	
	// set key value
	key.value = keyValue;
	
	// return this
	return this;
};

State.prototype._setKeyAct = function (keyName, act) {
	// get key
	const key = this._keys[keyName];
	
	// if key does not exist
	if (key === undefined) throw Error(`key ${keyName} does not exist`);
	
	// set key act
	if (key.acts) key.acts.push(act);
	else key.acts = [act];
	
	// return this
	return this;
};

State.prototype._deleteKey = function (keyName) {
	// delete key
	delete this._keys[keyName];
	
	// return this
	return this;
};

// Public API

State.prototype.fix = function (keyName, keyValue) {
	return this._createKey(true, keyName, keyValue);
};

State.prototype.let = function (keyName, keyValue) {
	return this._createKey(false, keyName, keyValue);
};

State.prototype.get = function (keyName) {
	return this._getKeyValue(keyName);
};

State.prototype.set = function (keyName, keyValue) {
	return this._setKeyValue(keyName, keyValue);
};

State.prototype.act = function (keyName, act) {
	return this._setKeyAct(keyName, act);
};

State.prototype.del = function (keyName) {
	return this._deleteKey(keyName);
};

State.prototype.catch = function (event, ...fns) {
	// add event functions
	if (this._events[event]) this._events[event].push(...fns);
	else this._events[event] = [...fns];
	
	// return this
	return this;
};

State.prototype.fire = async function (event, ...values) {
	// fire event functions
	if (this._events[event] !== undefined) this._events[event].forEach(fn => {
		fn(...values);
	});
	
	// return this
	return this;
};

// Export
export default State;
