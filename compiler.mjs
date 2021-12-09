import fs from 'fs';

const farmyCompiler = function (code) {
    let regex, matches;

    // * & is replaced with __state__ internally
    regex = /&/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `__state__`);
    });

    // const/let type/null stateName:keyName = keyValue/undefined;
    regex = /(\w+)\s(\w+)\s(\w+):(\w+)\s=\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[3]}.${match[1]}(${match[2]}, '${match[4]}', ${match[5]});`);
    });

    // stateName:keyName = keyValue;
    regex = /(\w+):(\w+)\s=\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.set('${match[2]}', ${match[3]})`);
    });

    // delete stateName:keyName;
    regex = /delete\s(\w+):(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.delete('${match[2]}')`);
    });

    // stateName:keyName;
    regex = /(\w+):(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.get('${match[2]}')`);
    });

    // stateName::keyName;
    regex = /(\w+)::(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.getKey('${match[2]}')`);
    });

    // stateName @ actName = function;
    regex = /(\w+)\s@\s(\w+)\s=\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.act('${match[2]}', ${match[3]});`);
    });

    // stateName @@ actFunctionName;
    regex = /(\w+)\s@@\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.act('${match[2]}', ${match[2]});`);
    });

    // stateName @ actName;
    regex = /(\w+)\s@\s(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.acts['${match[2]}']`);
    });

    // delete stateName @ actName;
    regex = /delete\s(\w+)\s@\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `delete ${match[1]}.acts['${match[2]}']`);
    });

    // delete stateName # extName;
    regex = /delete\s(\w+)\s#\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `delete ${match[1]}.exts['${match[2]}']`);
    });

    // stateName # extName = function;
    regex = /(\w+)\s#\s(\w+)\s=\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.ext('${match[2]}', ${match[3]});`);
    });

    // stateName ## extFunctionName;
    regex = /(\w+)\s##\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.ext('${match[2]}', ${match[2]});`);
    });

    // stateName # extName;
    regex = /(\w+)\s#\s(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.exts['${match[2]}']`);
    });

    return code;
};

const code = fs.readFileSync('./test/app.fy', 'utf8');
fs.writeFileSync('./test/dist.js', farmyCompiler(code));
