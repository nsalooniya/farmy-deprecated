// ======== ASM: Advance State Manager

class State {

	constructor(init = {}) {
		this._state = {};
		this._catch = {};
		for (const prop in init) {
			this.init(prop, init[prop]);
		}
	}
	
	// Private API
	
	_defineGetterSetter(prop) {
		Object.defineProperty(this, prop, {
			get() {
				return this._state[prop];
			},
			set(value) {
				this._state[prop] = value;
			}
		});
	}
	
	// Public API
	
	init(prop, value = undefined) {
		this._defineGetterSetter(prop);
		this._state[prop] = value;
		return this;
	}
	
	catch(event, ...fn) {
		if (this._catch[event]) this._catch[event].push(...fn);
		else this._catch[event] = [...fn];
		return this;
	}
	
	fire(event, ...values) {
		this._catch[event]?.forEach(fn => {
			fn(...values);
		});
		return this;
	}
	
}

export default State;
