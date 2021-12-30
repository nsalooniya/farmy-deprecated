// ======== AVM: Advance View Managers
import $ from "./adm.js";
import State from "./asm.js";

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
				if (arr.length === 0) return '';
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

		// ****!! view state action
		const vsaMatches1 = Array.from(this.template.matchAll(/<act\s(\w+)\s\(([^\)]+)\)>/g));
		const temps = [];
		vsaMatches1.forEach(match => {
			if (temps.includes(match[0])) return;
			else temps.push(match[0]);

			const actID = 'act' + State.createID();
			const loopBody = `[${match[1]}] (${match[2]})`;
			const _view = new View(loopBody);
			const text = match[1];
			this.catch(match[1], function (v) {
				let o = {};
				v.acts[actID] = function () {
					o = {};
					o[text] = v.value;
					$('.' + actID).innerHTML(_view.get(o));
				};
				o[text] = v.value;
				return _view.get(o);
			});
			this.template = this.template.replaceAll(match[0], `<act class="${actID}">[${match[1]}]</act>`);
		});

		// ****!! view state action
		const vsaMatches = Array.from(this.template.matchAll(/<act\s(\w+)>/g));
		vsaMatches.forEach(match => {
			if (temps.includes(match[0])) return;
			else temps.push(match[0]);
			const actID = 'act' + State.createID();
			this.catch(match[1], function (v) {
				v.acts[actID] = function () {
					$('.' + actID).innerHTML(v.value);
				};
				return v.value;
			});
			this.template = this.template.replaceAll(match[0], `<act class="${actID}">[${match[1]}]</act>`);
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

		// ****!! ternary
		const terLoops = Array.from(this.template.matchAll(/\[(\w+)\s=\s([^\s]+)\s\?\s(\w+)\s:\s(\w+)\]/g));
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
