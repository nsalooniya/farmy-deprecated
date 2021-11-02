// ======== AVM: Advance View Manager

class View {
	
	constructor(template) {
		this.template = template;
		this.fucntions = {};

		// ****!! view loops
		const loops = Array.from(this.template.matchAll(/\[(\w+)\]\((.+)\)/g));
		loops.forEach(loop => {
			this.catch(loop[1], (arr) => {
				const _view = new View(loop[2]);
				return arr.map((el) => {
					if (el.constructor === Object) {
						return _view.get(el);
					} else {
						return loop[2].replaceAll(`$${loop[1]}`, el);
					}
				}).join('');
			});
			this.template = this.template.replaceAll(loop[0], `[${loop[1]}]`);
		});
	}
	
	// Public API
	
	get(params) {
		if (!params) return this.template;
		let html = this.template, value;
		for (const prop in params) {
			if (!params.hasOwnProperty(prop)) continue;
			
			value = params[prop];
			this.fucntions[prop]?.forEach(fn => {
				value = fn(value);
			});
			
			html = html.replaceAll(`[${prop}]`, value);
		}
		return html;
	}
	
	catch(prop, ...fns) {
		this.fucntions[prop] = fns;
		return this;
	}
	
}

export default View;
