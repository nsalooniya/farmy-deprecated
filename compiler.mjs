import fs from 'fs';

const farmyCompiler = function (code) {
    let regex, matches;

    // const & = new State();
    regex = /&/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `_`);
    });

    // const String &:name = 'Nikhil';
    regex = /(\w+)\s(\w+)\s(\w+):(\w+)\s=\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[3]}.${match[1]}(${match[2]}, '${match[4]}', ${match[5]});`);
    });

    // &:age = &:age + 1;
    regex = /(\w+):(\w+)\s=\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.set('${match[2]}', ${match[3]})`);
    });

    // console.log(&:name);
    regex = /(\w+):(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.get('${match[2]}')`);
    });

    // acts // & @ hello;
    regex = /(\w+)\s@\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.act(${match[2]});`);
    });

    // extentions // & @ inc = increment;
    regex = /(\w+)\s@\s(\w+)\s=\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.ext('${match[2]}', ${match[3]});`);
    });

    // extentions // & @ inc (1);
    regex = /(\w+)\s@\s(\w+)\s\((.+)\);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.extor('${match[2]}', ${match[3]});`);
    });

    return code;
};

const code = fs.readFileSync('./test/app.fy', 'utf8');
fs.writeFileSync('./test/dist.js', farmyCompiler(code));
