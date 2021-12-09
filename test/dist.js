const State = require('../lib/asm');

const _ = new State({
    appName: String,
    i: Number
});

_.set('appName', 'Farmy')
_.set('i', 1)

const updatedKeyLogger = (key) => {
    console.log(key);
};

const increment = (n) => {
    _.set('i', _.get('i') + n)
};

_.act(updatedKeyLogger);
_.ext('inc', increment);

_.extor('inc', 1);
_.set('appName', 'FARMY')
