const HP = require('./helper');

// Class Router

class Router {

    constructor() {
        this._routes = [];
    }

    // Private API

    _runRouter(basePath, url) {

        let
            i,
            currPath,
            currRoute,
            finalRoute;

        for (i = 0; i < this._routes.length; i++) {

            currRoute = this._routes[i];
            currPath = HP.joinPath(basePath, currRoute.path);

            if (currRoute.type === 'use') {
                currRoute.fn(url);
            }

            if (currRoute.type === 'path') {
                currRoute.match = HP.matchRegex(url.pathname, HP.pathToRegex(currPath));
                if (currRoute.match !== null) {
                    finalRoute = currRoute;
                    break;
                }
                continue;
            }

            if (currRoute.type === 'route' && HP.formatUrl(url.pathname).startsWith(HP.formatUrl(currPath))) {
                currRoute = currRoute.router._runRouter(currPath, url);
                if (currRoute && currRoute.match !== null) {
                    finalRoute = currRoute;
                    break;
                }
                continue;
            }

        }

        return finalRoute;

    }

    // Public API

    use(fn) {
        this._routes.push({
            type: 'use',
            fn
        });
        return this;
    }

    path(path, fn) {
        this._routes.push({
            type: 'path',
            path: HP.formatPath(path),
            fn
        });
        return this;
    }

    route(path, router) {
        this._routes.push({
            type: 'route',
            path: HP.formatPath(path),
            router
        });
        return this;
    }

    // Static Private API

    static _runRoute(routes, ...values) {
        routes.forEach(route => {
            route.fn(...values);
        });
    }

    static _runStartRouter() {

        // URL
        const url = new URL(HP.formatUrl(location.href));

        // Run Pre-Routes
        this._runRoute(this._preRoutes, url);

        // Run Start-Router
        const route = this._startRouter._runRouter('/', url);

        // Run Post-Routes
        this._runRoute(this._postRoutes, route, url);

    }

    // Static Public API

    static match(options = {}) {

        const {
            link = 'link',
            title = 'title'
        } = options;

        this._matchLink = link;
        this._matchTitle = title;

    }

    static before(fn) {
        this._preRoutes.push({
            type: 'before',
            fn
        });
        return this;
    }

    static after(fn) {
        this._postRoutes.push({
            type: 'after',
            fn
        });
        return this;
    }

    static start(router) {
        this._startRouter = router;
        this._runStartRouter();
    }

    static to(url, options = {}) {

        const {
            reload = true,
            title = null,
            data = null
        } = options;

        url = HP.formatUrl(url);

        if (reload && (url === HP.formatUrl(location.href))) {
            location.reload();
        } else {
            history.pushState(data, title, url);
            this._runStartRouter();
        }

    }

}

Router._preRoutes = [];
Router._startRouter = undefined;
Router._postRoutes = [];

Router.match();
Router.after((route, url) => {

    if (route) {
        route.params = HP.getRouteParams(route);
    } else {
        route = {
            type: '404',
            path: '/404',
            match: null,
            params: {},
            fn: () => {
                throw Error(`Error 404 : ${url.href} not found`);
            }
        }
    }

    route.fn(route, url);

});

window.addEventListener('popstate', Router._runStartRouter);

document.body.addEventListener('click', (e) => {
     if (Router._startRouter && (e.target.dataset[Router._matchLink] === 'true')) {
         e.preventDefault();
         Router.to(e.target.href, {
             title: e.target.dataset[Router._matchTitle]
         });
     }
});

// Export

module.exports = Router;
