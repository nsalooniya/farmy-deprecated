import {State, Router, Component, View, $} from '../index.js';

const timer = (t) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, t);
});

const logAsync = (log, time) => async function ({params}) {
    console.log(log);
    if (time) await timer(time);
    __state__.set('appName', log)
};

const router = new Router();
const users = new Router();

router.env('browser');

router.use(logAsync('PATH /'));
router.path('/', logAsync('PATH /'));
router.path('/home', logAsync('PATH /home'));
router.path('/about', logAsync('PATH /about', 1000));
router.route('/users', users);
router.path('/~', logAsync('PATH not found'));

users.path('/', logAsync('PATH /users'));
users.path('/:id', logAsync('PATH /users/:id'));

router.run();

const __state__ = new State();
__state__.let(String, 'appName', undefined);

__state__.let(null, 'a', 4);

const Dom = new State();
Dom.const($.List, 'root', $('#root'));

__state__.getKey('appName').acts['update'] = function () {
    Dom.get('root').innerHTML(`<h1>${__state__.get('appName')}</h1>`);
};

// ****

const sum = State.fn({a: Number, b: Number}, function (a,b) {
    return a + b;
}, Number);

console.log(sum(1, 2));

