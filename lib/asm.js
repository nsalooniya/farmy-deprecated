// ==== Advance State Manager

const Key = function (keyConst, keyType, keyName, keyValue) {
    this.const = keyConst;
    this.type = keyType;
    this.name = keyName;
    this.acts = {};
    this.setValue(keyValue);
};

Key.prototype.setValue = function (keyValue, checkConst = false, setKey = false) {
    // if key is constant
    if (checkConst && this.const) throw Error(`key '${this.name}' is constant`);

    // if keyType does not match keyValue
    if (this.type !== null && keyValue === undefined && setKey) throw Error(`key '${this.name}' type does not match value`);
    if (this.type !== null && keyValue !== undefined && keyValue.constructor !== this.type) throw Error(`key '${this.name}' type does not match value`);

    // set value
    this.value = keyValue;
};

Key.prototype.action = function (key) {
    // run action functions
    for (const name in this.acts) {
        this.acts[name](key);
    }

    // return this
    return this;
};

const State = function (blueprint) {
    this.keys = {};
    this.acts = {};
    this.exts = {};
    this.opts = {
        seal: false,
        freeze: false,
        saves: {}
    };
    this.blueprint(blueprint);
};

// Public API

State.prototype.blueprint = function (blueprint) {
    // create keys from blueprint
    for (const keyName in blueprint) {
        // get property value
        const value = blueprint[keyName];

        // check property type
        if (value !== null && value.constructor === Object) {
            const key = value;
            if (key.const) this.const(key.type, keyName, key.value);
            else this.let(key.type, keyName, key.value);
        } else
        if (value !== null && value.constructor === Array) {
            this.let(value[0], keyName, value[1]);   
        } else {
            this.let(value, keyName);
        }
    }

    // return this
    return this;
};

State.prototype.checkOptions = function (opts = {}) {
    // check seal
    if (opts.seal && this.opts.seal) throw Error('state is sealed');

    // check freeze
    if (opts.freeze && this.opts.freeze) throw Error('state is freezed');
}

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
    // check options
    this.checkOptions({ seal: true, freeze: true });

    // get key
    const key = this.getKey(keyName, true);

    // create and add key
    this.keys[keyName] = new Key(true, keyType, keyName, keyValue);

    // return this
    return this;
};

State.prototype.let = function (keyType, keyName, keyValue) {
    // check options
    this.checkOptions({ seal: true, freeze: true });

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
    // check options
    this.checkOptions({ freeze: true });

    // get key
    const key = this.getKey(keyName);

    // update keyValue
    key.setValue(keyValue, true, true);

    // run key act functions
    key.action();

    // run act functions
    this.action(key);

    // return this
    return this;
};

State.prototype.delete = function (keyName) {
    // check options
    this.checkOptions({ seal: true, freeze: true });

    // get key
    const key = this.getKey(keyName);

    // delete key
    delete this.keys[keyName];

    // return this
    return this;
};

State.prototype.act = function (actName, actFn) {
    // add action
    this.acts[actName] = actFn;

    // return this
    return this;
};

State.prototype.action = function (key) {
    // run action functions
    for (const name in this.acts) {
        this.acts[name](key);
    }

    // return this
    return this;
};

State.prototype.ext = function (extName, extFn) {
    // add extention
    this.exts[extName] = extFn;

    // return this
    return this;
};

State.prototype.seal = function () {
    // seal state (-CD)
    this.opts.seal = true;

    // return this
    return this;
};

State.prototype.unseal = function () {
    // unseal state
    this.opts.seal = false;

    // return this
    return this;
};

State.prototype.freeze = function () {
    // freeze state (-CUD)
    this.opts.freeze = true;

    // return this
    return this;
};

State.prototype.unfreeze = function () {
    // unfreeze state
    this.opts.freeze = false;

    // return this
    return this;
};

State.prototype.raw = function (deep = false) {
    // create raw object
    const raw = {};

    // loop keys and map raw object
    for (const keyName in this.keys) {
        if (!deep) {
            raw[keyName] = this.keys[keyName].value;
        } else {
            raw[keyName] = {...this.keys[keyName]};
        }
    }

    // return raw object
    return raw;
};

State.prototype.reset = function (optsReset) {
    // reset keys
    this.keys = {};

    // reset acts
    this.acts = {};

    // reset exts
    this.exts = {};

    // save otps
    if (optsReset) save.otps = {
        seal: false,
        freeze: false,
        saves: {}
    };

    // return this
    return this;
};

State.prototype.save = function (tag) {
    // create save object
    const save = {};

    // save keys
    save.keys = this.raw(true);

    // save acts
    save.acts = {...this.acts};

    // save exts
    save.exts = {...this.exts};

    // add save object 
    this.opts.saves[tag] = save;

    // return this
    return this;
};

State.prototype.load = function (tag) {
    // check options
    this.checkOptions({ seal: true, freeze: true });

    // get save object
    const save = this.opts.saves[tag];
    if (!save) throw Error(`save '${tag}' not found`);

    // reset state
    this.reset(false);

    // load keys
    this.blueprint(save.keys);

    // load acts
    this.acts = save.acts;

    // load exts
    this.exts = save.exts;

    // return this
    return this;
};

State.fn = function (__params__, __fn__, __return__) {
    const __state__ = new State(__params__);
    __params__ = Object.keys(__state__.keys);
    __state__.let(__return__, 'return', undefined);
    return function (...params) {
        __params__.forEach((p, i) => {
            __state__.set(p, params[i]);
        });
        __state__.set('return', __fn__(...params));
        __return__ = __state__.get('return');
        return __return__;
    };
};

State.Key = Key;

// ==== LocalDB Plugin

const random = function (start, end) {
    return start + Math.floor(Math.random()*(end-start+1));
};

const createID = function (bit32 = false) {
    const power = bit32 ? 32 : 16;
    const timestamp = Date.now();
    const salt = random(+`100${'0'.repeat(power - 16)}`, +`999${'9'.repeat(power - 16)}`);
    const numID = + `${timestamp}${salt}`;
    const hexID = numID.toString(power);
    return hexID;
};

const timer = function (t) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};

class Collection {
    constructor (name, data) {
        this.name = name;
        this.data = data;
    }

    async set (name, data) {
        this.data[name] = data;
        return this;
    }

    async create (doc) {
        await timer(1);
        doc.ID = createID();
        this.data[doc.ID] = doc;
        return doc;
    }

    async get (ID) {
        return this.data[ID];
    }

    async update (ID, newDoc, replace = false) {
        if (replace) {
            this.data[ID] = newDoc;
        } else {
            const doc = this.data[ID];
            for (const key in newDoc) {
                if (key === 'ID') continue;
                doc[key] = newDoc[key];
            }
        }
        return this.data[ID];
    }

    async delete (ID) {
        const doc = this.data[ID];
        delete this.data[ID];
        return doc;
    }

}

class LocalDB {
    constructor (name) {
        this.name = name;
        this.data = JSON.parse(localStorage.getItem(this.name)) || {};
    }

    collection (collectionName) {
        const data = this.data[collectionName] || {};
        this.data[collectionName] = data;
        return new Collection(collectionName, data);
    }

    save () {
        localStorage.setItem(this.name, JSON.stringify(this.data));
    }

    reset () {
        localStorage.setItem(this.name, JSON.stringify({}));
    }
}

State.LocalDB = LocalDB;
State.Collection = Collection;
State.createID = createID;

export default State;
