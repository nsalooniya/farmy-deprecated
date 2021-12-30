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

const Dom = new State();
const $.List Dom:root = $('#root');
let String Dom:data = 'ABCD';
let String Dom:name = 'name';
let Array Dom:arr = [{
    i: 1,
    name : 'a'
}, {
    i: 2,
    name: 'b'
}];

// const view = new View(`
//     <div id="test">
//         <act id="act-1">[@data #act-1]</act>
//         <act id="act-2">[@name #act-2]</act>
//     </div>
// `);

const view2 = new View(`
    <div>
        <br>
        <act arr (
            <div>[i] . [name]</div>
        )>
        <hr>
        <act arr2 (
            <div>[i] = [name]</div>
        )>
        <br>
    </div>
`);

console.log(view2);

Dom:root.innerHTML(view2.get({
    data: Dom::data,
    arr: Dom::arr,
    arr2: Dom::arr,
    x: '123',
}));

(async () => {
    await timer(2000);
    Dom:data = '1234';
    await timer(2000);
    Dom:data = 'View State actions are working';
    await timer(2000);
    Dom:arr = [{
        i: 10,
        name : 'apple'
    }, {
        i: 11,
        name: 'banana'
    }];
})();