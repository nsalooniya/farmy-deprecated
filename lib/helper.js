const formatPath = function (path, options = {}) {
    
    const {
        start = true,
        end = false,
        str = '/',
    } = options;
    
    if (start && path[0] !== str) path = str + path;
    else if (!start && path[0] === str) path = path.slice(1);

    if (end && path[path.length - 1] !== str) path = path + str;
    else if (!end && path.length > 1 && path[path.length - 1] === str) path = path.slice(0, -1);
    
    return path;

};

const formatUrl = function (url, end = false) {
    return formatPath(url, {start: false, end: end});
};

const joinPath = function (basePath, path, options = {}) {

    const {
        str = '/'
    } = options;

    if (basePath === str && path === str) return str;
    else if (basePath === str) return path;
    else if (path === str) return basePath
    else return basePath + path;

};

const pathToRegexCache = {};
const pathToRegex = function (path) {

    let regex = pathToRegexCache[path];

    if (!regex) {

        regex = new RegExp(
            '^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(\\w+)').replace(/\*/g, '(.+)') + '$'
        );

        pathToRegexCache[path] = regex;

    }

    return regex;

};

const matchRegexCache = {};
const matchRegex = function (path, regex) {

    let match = matchRegexCache[`${path}-${regex}`];

    if (!match) {

        match = path.match(regex);

        matchRegexCache[`${path}-${regex}`] = match;

    }

    return match;

};

const getRouteParamsCache = {};
const getRouteParams = function (route) {

    let params = getRouteParamsCache[`${route.path}-${route.match.input}`];

    if (!params) {

        const values = route.match.slice(1);
        const keys = Array.from(route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
        params = Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
        }));

        getRouteParamsCache[`${route.path}-${route.match.input}`] = params;

    }

    return params;
};

module.exports = {
    formatPath,
    formatUrl,
    joinPath,
    pathToRegex,
    matchRegex,
    getRouteParams
};
