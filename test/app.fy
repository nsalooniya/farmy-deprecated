const State = require('../lib/asm');

const & = new State({
    appName: String,
    i: Number
});

&:appName = 'Farmy';
&:i = 1;

const updatedKeyLogger = (key) => {
    console.log(key);
};

const increment = (n) => {
    &:i = &:i + n;
};

& @ updatedKeyLogger;
& @ inc = increment;

& @ inc (1);
&:appName = 'FARMY';
