// ASM compiler
const ASMCompiler = function (code) {
    let regex, matches;

    // * & is replaced with __state__ internally
    regex = /&/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `__state__`);
    });

    // a..type
    regex = /(\w+)\.\.type/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.constructor`);
    });

    // (a: type, b: type) => { body } type
    regex = /\(([^\)]+)\)\s=>\s\{([^\~]+)\}\s(\w+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        const paramsObj = `{${match[1]}}`;
        const params = match[1].split(',').map(p => p.split(':')[0].trim()).join(',');
        code = code.replaceAll(match[0], `State.fn(${paramsObj}, function (${params}) {${match[2]}}, ${match[3]})`);
    });
    // const sum = State.fn({
    //     'a': Number,
    //     'b': Number,
    // }, (a, b) => {
    //     return a + b;
    // }, Number);

    // const/let type/null stateName:keyName = keyValue/undefined;
    regex = /(\w+)\s([^\s]+)\s(\w+):(\w+)\s=\s([^;]+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[3]}.${match[1]}(${match[2]}, '${match[4]}', ${match[5]});`);
    });

    // - get key action function
    // stateName::keyName @ actName;
    regex = /(\w+)::(\w+)\s@\s([^\s]+)/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.getKey('${match[2]}').acts['${match[3]}']`);
    });

    // stateName:keyName = keyValue;
    regex = /(\w+):(\w+)\s=\s([^;]+);/g;
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

    // save stateName tagName;
    regex = /save\s(\w+)\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.save('${match[2]}')`);
    });

    // load stateName tagName;
    regex = /load\s(\w+)\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.load('${match[2]}')`);
    });

    // return code
    return code;
};

// ARM compiler
const ARMCompiler = function (code) {
    let regex, matches;

    // - add multiple routes
    regex = /@\s(\w+)\s:([^@]+)@/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        const replaceCode = match[2].split('#').map(c => c.trim()).filter(c => c !== '').map(c => `${match[1]} ${c}`).join('\n');
        code = code.replaceAll(match[0], replaceCode);
    });

    // router PRE fn;
    regex = /(\w+)\sPRE\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.pre(${match[2]});`);
    });

    // router POST fn;
    regex = /(\w+)\sPOST\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.post(${match[2]});`);
    });

    // add use fn;
    regex = /(\w+)\sUSE\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.use(${match[2]});`);
    });

    // router PATH /p?a=t#h fn;
    regex = /(\w+)\sPATH\s'?([\w/:?#\~]+)'?\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.path('${match[2]}', ${match[3]});`);
    });

    // router ROUTE /p?a=t#h router;
    regex = /(\w+)\sROUTE\s'?([\w/:?#\~]+)'?\s(.+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.route('${match[2]}', ${match[3]});`);
    });

    // router RUN;
    regex = /(\w+)\sRUN;/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.run();`);
    });

    // router RUN url;
    regex = /(\w+)\sRUN\s'?([\w/:?#\~]+)'?;/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.run('${match[2]}');`);
    });

    // router ENV browser/node;
    regex = /(\w+)\sENV\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.env('${match[2]}');`);
    });

    // router ENV browser/node;
    regex = /(\w+)\sENV\s(\w+);/g;
    matches = Array.from(code.matchAll(regex));
    matches.forEach(match => {
        code = code.replaceAll(match[0], `${match[1]}.env('${match[2]}');`);
    });

    // return code
    return code;
};

// Complete farmy compiler
const farmyCompiler = function (code) {

    // ARM Compiler
    code = ARMCompiler(code);

    // ASM Compiler
    code = ASMCompiler(code);

    // return code
    return code;

};

exports.default = function (source, map) {
    this.callback(
        null,
        farmyCompiler(source),
        map
    );
};
