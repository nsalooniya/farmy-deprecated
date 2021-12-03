// ======== ARM: Advance Router Manager

const formatPathCache = {};
const formatPath = (path, {start = true, end = false, str = '/'} = {}) => {
	
	let originalPath = path;
	path = formatPathCache[`${originalPath}-${start}-${end}-${str}`];
	
	if (path === undefined) {
		
		path = originalPath;
		
		if (path === str || path === '') path = str + str;
		
		if (start && !path.startsWith(str)) path = str + path;
		else if (!start && path.startsWith(str)) path = path.slice(str.length);
		
		if (end && !path.endsWith(str)) path = path + str;
		else if (!end && path.endsWith(str)) path = path.slice(0, -str.length);
		
		formatPathCache[`${originalPath}-${start}-${end}-${str}`] = path;
		
	}
	
	return path;
	
};

const formatURL = (url, {end = false} = {}) => {
	return formatPath(url, {start: false, end: end})
};

const joinPathCache = {};
const joinPath = function (basePath, path, {str = '/'} = {}) {
	
	let joinedPath = joinPathCache[`${basePath}-${path}-${str}`];
	
	if (joinedPath === undefined) {
		
		if (basePath === str && path === str) joinedPath =  str;
		else if (basePath === str) joinedPath = path;
		else if (path === str) joinedPath = basePath
		else joinedPath = basePath + path;
		
		joinPathCache[`${basePath}-${path}-${str}`] = joinedPath;
		
	}
	
	return joinedPath;
	
};

const pathToRegexCache = {};
const pathToRegex = function (path) {
	
	let regex = pathToRegexCache[path];
	
	if (regex === undefined) {
		
		regex = new RegExp(
			'^' + path.replace(/\//g, '\\/').replace(/:[-\w]+/g, '(\[-\\w]+)').replace(/\*/g, '(.+)') + '$'
		);
		
		pathToRegexCache[path] = regex;
		
	}
	
	return regex;
	
};

const matchRegexCache = {};
const matchRegex = function (path, regex) {
	
	let match = matchRegexCache[`${path}-${regex}`];
	
	if (match === undefined) {
		
		match = path.match(regex);
		
		matchRegexCache[`${path}-${regex}`] = match;
		
	}
	
	return match;
	
};

const getRouteParamsCache = {};
const getRouteParams = function (route) {
	
	let params = getRouteParamsCache[`${route.path}-${route.match.input}`];
	
	if (params === undefined) {
		
		const values = route.match.slice(1);
		const keys = Array.from(route.path.matchAll(/:([-\w]+)/g)).map(result => result[1]);
		params = Object.fromEntries(keys.map((key, i) => {
			return [key, values[i]];
		}));
		
		getRouteParamsCache[`${route.path}-${route.match.input}`] = params;
		
	}
	
	return params;
};

class Router {
	
	constructor() {
		this._routes = [];
	}
	
	// Private API
	
	async _runRouter(basePath, url) {
		
		let
			i,
			currPath,
			currRoute,
			finalRoute;
		
		for (i = 0; i < this._routes.length; i++) {
			
			currRoute = this._routes[i];
			currPath = joinPath(basePath, currRoute.path);
			
			if (currRoute.type === 'use') {
				await currRoute.fn(url);
			}
			
			if (currRoute.type === 'path') {
				currRoute.match = matchRegex(url.pathname, pathToRegex(currPath));
				if (currRoute.match !== null) {
					finalRoute = currRoute;
					break;
				}
				continue;
			}
			
			if (currRoute.type === 'route' && formatURL(url.pathname).startsWith(formatURL(currPath))) {
				currRoute = await currRoute.router._runRouter(currPath, url);
				if (currRoute && currRoute.match !== null) {
					finalRoute = currRoute;
					break;
				}
			}
			
		}
		
		return finalRoute;
		
	}
	
	// Public API
	
	use(...fns) {
		fns.forEach(fn => {
			this._routes.push({
				type: 'use',
				fn
			});
		});
		return this;
	}
	
	path(path, ...fns) {
		fns.forEach(fn => {
			this._routes.push({
				type: 'path',
				path: formatPath(path),
				fn
			});
		});
		return this;
	}
	
	route(path, ...routers) {
		routers.forEach(router => {
			this._routes.push({
				type: 'path',
				path: formatPath(path),
				router
			});
		});
		return this;
	}
	
	// Static Private API
	
	static async _runRoute(routes, ...values) {
		for (const route of routes) {
			await route.fn(...values);
		}
	}
	
	static async _runStartRouter(url) {
		
		// URL
		if (url === undefined) url = new URL(formatURL(location.href));
		
		// Run Pre-Routes
		await this._runRoute(this._preRoutes, url);
		
		// Run Start-Router
		const route = await this._startRouter._runRouter('/', url);
		
		// Run Post-Routes
		await this._runRoute(this._postRoutes, route, url);
		
	}
	
	// Static Public API
	
	static match({link = 'link', title = 'title'} = {}) {
		this._matchLink = link;
		this._matchTitle = title;
	}
	
	static before(...fns) {
		fns.forEach(fn => {
			this._preRoutes.push({
				type: 'before',
				fn
			});
		})
		return this;
	}
	
	static after(...fns) {
		fns.forEach(fn => {
			this._postRoutes.push({
				type: 'after',
				fn
			});
		})
		return this;
	}
	
	static async start(router) {
		this._startRouter = router;
		await this._runStartRouter();
	}
	
	static reload() {
		return this._runStartRouter();
	}

	static async to(url, {reload = false, title = null, data = null, replace = false} = {}) {
		
		url = formatURL(url);
		
		if (!reload && (url === formatURL(location.href))) {
			history.replaceState(data, title, url);
			await this._runStartRouter();
		} else {
			url = new URL(url, location.origin);
			if (replace) history.replaceState(data, title, url);
			else history.pushState(data, title, url.href);
			await this._runStartRouter(url);
		}
		
	}
	
}

Router._preRoutes = [];
Router._startRouter = undefined;
Router._postRoutes = [];

Router.match();

const _notFoundRoute = {
	type: '404',
	path: '/404',
	match: null,
	params: {},
	fn: (route, url) => {
		throw Error(`Error 404 : ${url.href} not found`);
	}
};

Router.after(async (route, url) => {
	
	if (route) {
		route.params = getRouteParams(route);
	} else {
		route = _notFoundRoute
	}
	
	await route.fn(route, url);
	
});

window.addEventListener('popstate', Router._runStartRouter.bind(Router, undefined));

document.body.addEventListener('click', (e) => {
	const el = e.target.closest('a');
	if (Router._startRouter && (el?.dataset[Router._matchLink] === 'true')) {
		e.preventDefault();
		const href = el.getAttribute('href');

		// **** !! same location replace
		// console.log(formatPath(href), location.pathname);

		if (formatPath(href) === location.pathname) {
			Router.to(href, {
				title: el.dataset[Router._matchTitle],
				replace: true
			});
		} else {
			Router.to(href, {
				title: el.dataset[Router._matchTitle],
			});
		};
		// **** !!

		// Router.to(href, {
		// 	title: el.dataset[Router._matchTitle],
		// });

	}
});

export default Router;
