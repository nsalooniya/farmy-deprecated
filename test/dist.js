import State from '../lib/asm.js';
import Router from '../lib/arm.js';

const timer = (t) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, t);
});

const logAsync = (log, time) => async function ({params}) {
    console.log(log);
    if (time) await timer(time);
};

const router = new Router();
const users = new Router();

router.env('browser');

router.use(logAsync('PATH /'));
router.path('/', logAsync('PATH /'));
router.path('/home', logAsync('PATH /home'));
router.path('/about', logAsync('PATH /about'));
router.route('/users', users);
router.path('/~', logAsync('PATH not found'));

users.path('/', logAsync('PATH /users'));
users.path('/:id', logAsync('PATH /users/:id'));

router.run();
