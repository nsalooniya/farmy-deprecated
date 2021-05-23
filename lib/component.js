// Class Component

class ComponentJoin {
	constructor(components) {
		this.components = components;
	}
	
	viewer(...values) {
		return this.components.map((component, i) => {
			return component.prototype.view(values[i]);
		}).join('');
	}
	
	loader(...values) {
		this.components.forEach((component, i) => {
			component.prototype.load(values[i]);
		});
	}
	
	unloader(...values) {
		this.components.forEach((component, i) => {
			component.prototype.unload(values[i]);
		});
	}
}

class Component {
	
	constructor() {
	
	}
	
	view() {
		//
	}
	
	load() {
		//
	}
	
	unload() {
		//
	}
	
	// static viewer(...components) {
	// 	return components.map(component => {
	// 		const [com, ...values] = component;
	// 		return com.prototype.view(...values);
	// 	}).join('');
	// }
	//
	// static loader(...components) {
	// 	components.forEach(component => {
	// 		const [com, ...values] = component;
	// 		com.prototype.load(...values);
	// 	});
	// }
	//
	// static unloader(...components) {
	// 	components.forEach(component => {
	// 		const [com, ...values] = component;
	// 		com.prototype.unload(...values);
	// 	});
	// }
	
	static join(...components) {
		return new ComponentJoin(components);
	}
	
}

module.exports = Component;
