import {State, Router, Component, View, $} from '${pkgName}';

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

const & = new State();
const router = new Router();

let String &:appName = undefined;
const $.List &:root = $('#root');

&::appName @ update = function () {
    &:root.innerHTML(`<h1>${&:appName}</h1>`);
};

router ENV browser;

@ router :
#
# USE logAsync('USE /');
#
# PATH '/' logAsync('PATH /');
# PATH '/home' logAsync('PATH /home');
# PATH '/about' logAsync('PATH /about');
#
# PATH '/~' logAsync('PATH not found');
@

router RUN;
