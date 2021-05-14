// Class State

class State {

    constructor() {

        this._state = {};
        this._links = {};

    }

    // Private API

    _addGetterSetter(prop) {
        Object.defineProperty(this, prop, {
            get() {
                return this.get(prop);
            },
            set(v) {
                this.set(prop, v);
            }
        });
    }

    // Public API

    init(prop) {
        this._addGetterSetter(prop);
        return this;
    }

    get(prop) {
        return this._state[prop];
    }

    set(prop, value) {
        const lastValue = this._state[prop];
        
        //
        if (!Object.getOwnPropertyDescriptor(this, prop)) this.init(prop);
        //
        
        this._state[prop] = value;
        this._links[prop]?.forEach(fn => fn(value, lastValue));
        return this;
    }

    link(prop, fn, run = false) {
        if (this._links[prop]) this._links[prop].push(fn);
        else this._links[prop] = [fn];
        if (run) fn(this.get(prop));
        return this;
    }

}

// Export

module.exports = State;
