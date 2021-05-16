// Class Component

class Component {
	
	constructor(view, load, unLoad) {
		this._view = view ? [view] : [];
		this._load = load ? [load] : [];
		this._unLoad = unLoad ? [unLoad] : [];
	}
	
	view() {
		return this._view.map(view => view.html()).join('');
	}
	
	load() {
		this._load.forEach(load => {
			load();
		});
	}
	
	unLoad() {
		this._unLoad.forEach(unload => {
			unload();
		});
	}
	
	static join(...components) {
		const component = new Component();
		components.forEach(com => {
			component._view.push(com.view);
			component._load.push(com.load);
			component._unLoad.push(com.unLoad);
		});
		return component;
	}
	
}

module.exports = Component;
