// ======== AVM: Advance View Manager

class View {
	
	constructor(template) {
		this.template = template;
		this.fucntions = {};
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
