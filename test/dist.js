const State = require('../lib/asm');

// == create state
const __state__ = new State({
    name: [String, 'Counter App'],
    counter: [Number, 0],
    interval: [null]
});

// == create extentions and acts

const init = () => setInterval(__state__.exts['inc'], 1000);

const inc = () => {
    __state__.set('counter', __state__.get('counter') + 1)
};

const logger = (key) => {
    if (key === __state__.getKey('counter')) {
        console.log(`${__state__.get('counter')} seconds passed`);
    }
};

// == add extentions and acts

__state__.ext('init', init);
__state__.ext('inc', inc);
__state__.act('logger', logger);

console.log(__state__);

// == start 
__state__.set('interval', __state__.exts['init']())

setTimeout(() => {
    clearInterval(__state__.get('interval'));
    __state__.delete('interval')
    delete __state__.acts['logger'];
    console.log(__state__);
}, 5*1000);

