const State = require('../lib/asm');

// == create state
const & = new State({
    name: [String, 'Counter App'],
    counter: [Number, 0],
    interval: [null]
});

// == create extentions and acts

const init = () => setInterval(& # inc, 1000);

const inc = () => {
    &:counter = &:counter + 1;
};

const logger = (key) => {
    if (key === &::counter) {
        console.log(`${&:counter} seconds passed`);
    }
};

// == add extentions and acts

& ## init;
& ## inc;
& @@ logger;

console.log(&);

// == start 
&:interval = & # init();

setTimeout(() => {
    clearInterval(&:interval);
    delete &:interval;
    delete & @ logger;
    console.log(&);
}, 5*1000);

