import {State, Router, Component, View, $} from '../../index.js';

const timer = (t) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, t);
});

const logAsync = (log, time) => async function ({params}) {
    console.log(log);
    if (time) await timer(time);
    &:appName = log;
};

const router = new Router();
const users = new Router();

router ENV browser;

@ router :
#
# USE logAsync('PATH /');
#
# PATH '/' logAsync('PATH /');
# PATH '/home' logAsync('PATH /home');
# PATH '/about' logAsync('PATH /about', 1000);
# 
# ROUTE '/users' users;
#
# PATH '/~' logAsync('PATH not found');
@

@ users :
#
# PATH '/' logAsync('PATH /users');
# PATH '/:id' logAsync('PATH /users/:id');
@

router RUN;

const & = new State();
let String &:appName = undefined;

let null &:a = 4;

const Dom = new State();
const $.List Dom:root = $('#root');

&::appName @ update = function () {
    Dom:root.innerHTML(`<h1>${&:appName}</h1>`);
};

// ****

const sum = (a: Number, b: Number) => {
    return a + b;
} Number;

console.log(sum(1, 2));

