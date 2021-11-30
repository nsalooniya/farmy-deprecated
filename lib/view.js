// ======== AVM: Advance View Manager

class View {

	constructor(template, fake = false) {
		this.template = template;
		this.fucntions = {};

		// ****!! view fake
		if (fake) return;

		// ****!! view loops
		// const loops = Array.from(this.template.matchAll(/\[(\w+)\]\s?\((.+)\)/g));
		const loops = Array.from(this.template.matchAll(/\[(\w+)\]\s+\(([^)]+)\)/g));
		loops.forEach(loop => {
			this.catch(loop[1], (arr) => {
				const _view = new View(loop[2], true);
				return arr.map((el) => {
					if (el.constructor === Object || typeof el === 'object') {
						return _view.get(el);
					} else {
						return loop[2].replaceAll(`$${loop[1]}`, el);
					}
				}).join('');
			});
			this.template = this.template.replaceAll(loop[0], `[${loop[1]}]`);
		});

		// ****!! view ternary
		// this.terkeys = {};
		// const terLoops = Array.from(this.template.matchAll(/\[(\w+)=(\w+)\]\((\w+):(\w+)\)/g));
		// terLoops.forEach(loop => {
		// 	this.catch(loop[1], (value) => {
		// 		if (value === eval(loop[2])) {
		// 			return loop[3];
		// 		} else {
		// 			return loop[4];
		// 		}
		// 	});
		// 	this.template = this.template.replaceAll(loop[0], `[${loop[1]}]`);
		// });
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

		// ****!! ternary
		const terLoops = Array.from(this.template.matchAll(/\[(\w+)=(\w+)\]\((\w+):(\w+)\)/g));
		terLoops.forEach(loop => {
			if (params[loop[1]] === eval(loop[2])) {
				html = html.replaceAll(loop[0], loop[3]);
			} else {
				html = html.replaceAll(loop[0], loop[4]);
			}
		});
		// ****!!

		return html;
	}

	catch(prop, ...fns) {
		if (this.fucntions[prop] !== undefined) this.fucntions[prop].push(...fns);
		else this.fucntions[prop] = fns;
		return this;
	}

}

export default View;
