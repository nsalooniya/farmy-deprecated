// ==== Advance State Manager

const Key = function (keyConst, keyType, keyName, keyValue) {
    this.const = keyConst;
    this.type = keyType;
    this.name = keyName;
    this.setValue(keyValue);
};

Key.prototype.setValue = function (keyValue, isConst) {
    // if key is constant
    if (isConst && this.const) throw Error(`key '${this.name}' is constant`);

    // if keyType does not match keyValue
    if (this.type !== null && keyValue !== undefined && keyValue.constructor !== this.type) throw Error(`key '${this.name}' type does not match value`);
    
    // set value
    this.value = keyValue;
};

const State = function (blueprint) {
    this.keys = {};
    this.acts = [];
    this.exts = {};
    this.blueprint(blueprint);
};

// Public API

State.prototype.blueprint = function (blueprint) {
    // create keys from blueprint
    for (const keyName in blueprint) {
        // get property value
        const value = blueprint[keyName];

        // check property type
        if (value.constructor === Array) {
            this.let(value[0], keyName, value[1]);   
        } else {
            this.let(value, keyName);
        }
    }

    // return this
    return this;
};

State.prototype.getKey = function (keyName, declared) {
    // get key
    const key = this.keys[keyName];

    // if key is not declared
    if (!declared && !key) throw Error(`key '${keyName}' is not declared`);

    // if key is declared
    if (declared && key) throw Error(`key '${keyName}' is already declared`);

    // return key
    return key;
};

State.prototype.const = function (keyType, keyName, keyValue) {
    // get key
    const key = this.getKey(keyName, true);

    // create and add key
    this.keys[keyName] = new Key(true, keyType, keyName, keyValue);

    // return this
    return this;
};

State.prototype.let = function (keyType, keyName, keyValue) {
    // get key
    const key = this.getKey(keyName, true);

    // create and add key
    this.keys[keyName] = new Key(false, keyType, keyName, keyValue);

    // return this
    return this;
};

State.prototype.get = function (keyName) {
    // get key
    const key = this.getKey(keyName);

    // return keyValue
    return key.value;
};

State.prototype.set = function (keyName, keyValue) {
    // get key
    const key = this.getKey(keyName);

    // update keyValue
    key.setValue(keyValue, true);

    // run act functions
    this.actor(key);

    // return this
    return this;
};

State.prototype.delete = function (keyName) {
    // get key
    const key = this.getKey(keyName);

    // delete key
    delete this.keys[keyName];

    // return this
    return this;
};

State.prototype.act = function (fn) {
    // add act function
    this.acts.push(fn);

    // return this
    return this;
};

State.prototype.actor = function (key) {
    // run act functions
    this.acts.forEach(fn => {
        fn(key);
    });

    // return this
    return this;
};

State.prototype.ext = function (extName, extFn) {
    // add extention
    this.exts[extName] = extFn;

    // return this
    return this;
};

State.prototype.extor = function (extName, ...params) {
    // run extention
    this.exts[extName](...params);

    // return this
    return this;
};

module.exports = State;
