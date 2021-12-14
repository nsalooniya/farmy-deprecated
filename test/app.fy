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

router ENV browser;

@ router
#
# USE logAsync('PATH /');
# PATH '/' logAsync('PATH /');
# PATH '/home' logAsync('PATH /home');
# PATH '/about' logAsync('PATH /about');
# ROUTE '/users' users;
# PATH '/~' logAsync('PATH not found');
@

@ users
#
# PATH '/' logAsync('PATH /users');
# PATH '/:id' logAsync('PATH /users/:id');
@

router RUN;
