// ======== ADM: Advance Dom Manager

class Elmn {
	
	constructor(el) {
		this.el = el;
		this.components = [];
	}
	
	// Public API
	
	$(selector) {
		return new List(selector, this.el);
	}
	
	closest(selector) {
		return new Elmn(this.el.closest(selector));
	}

	addClass(...cls) {
		this.el.classList.add(...cls);
		return this;
	}
	
	rmClass(...cls) {
		this.el.classList.remove(...cls);
		return this;
	}
	
	hasClass(cls) {
		return this.el.classList.contains(cls);
	}
	
	setStyle(prop, value) {
		this.el.style.setProperty(prop, value);
		return this;
	}
	
	rmStyle(prop) {
		this.el.style.removeProperty(prop);
		return this;
	}
	
	getStyle(prop) {
		this.el.style.getPropertyValue(prop);
		return this;
	}
	
	setAttr(prop, value) {
		this.el.setAttribute(prop, value);
		return this;
	}
	
	rmAttr(prop) {
		this.el.removeAttribute(prop);
		return this;
	}
	
	getAttr(prop) {
		return this.el.getAttribute(prop);
	}
	
	on(event, handler, opt) {
		this.el.addEventListener(event, handler, opt);
		return this;
	}
	
	off(event, handler, opt) {
		this.el.removeEventListener(event, handler, opt);
		return this;
	}
	
	textContent(text) {
		if (text === undefined) {
			return this.el.textContent;
		} else {
			this.el.textContent = text;
			return this;
		}
	}
	
	innerText(text) {
		if (text === undefined) {
			return this.el.innerText;
		} else {
			this.el.innerText = text;
			return this;
		}
	}
	
	innerHTML(html) {
		if (html === undefined) {
			return this.el.innerHTML;
		} else {
			this.el.innerHTML = html;
			return this;
		}
	}
	
	insertHTML(pos, html) {
		this.el.insertAdjacentHTML(pos, html);
		return this;
	}
	
	focus() {
		this.el.focus();
		return this;
	}
	
	blur() {
		this.el.blur();
		return this;
	}
	
	value() {
		return this.el.value;
	}
	
	// Render Components
	
	renderAdd(...components) {
		this.components.push(...components);
		return this;
	}
	
	renderRemove(...components) {
		this.components = this.components.filter(com => {
			return !components.includes(com);
		});
		return this;
	}
	
	renderReplace(component, newComponent) {
		this.components = this.components.map(com => {
			return com === component ? newComponent : com;
		});
		return true;
	}
	
	renderClear() {
		this.components.forEach(com => {
			com.unload();
		});
		this.components = [];
		return this;
	}
	
	render(innerHTML = false) {
		if (innerHTML) {
			this.innerHTML(this.components.map(com => com.view()).join(''));
			this.components.forEach(com => com.load());
		} else {
			this.components.forEach(com => {
				this.insertHTML('beforeend', com.view());
				com.load();
			});
		}
		return this;
	}
	
	clear() {
		this.innerHTML('');
		return this;
	}

	renderSuper(ComponentArr, innerHTML) {
		this.renderClear();
		this.renderAdd(...ComponentArr);
		this.render(innerHTML);
		return this;
	}

}

class List {
	
	constructor(selector, base = document) {
		this.selector = selector;
		this.base = base;
		this.length = 0;
		this.base.querySelectorAll(this.selector).forEach(el => {
			this[this.length++] = new Elmn(el);
		});
	}
	
	// Public API
	
	forEach(fn) {
		for (let i = 0; i < this.length; i++) {
			fn(this[i], i);
		}
		return this;
	}
	
	map(fn) {
		const arr = [];
		for (let i = 0; i < this.length; i++) {
			arr.push(fn(this[i], i));
		}
		return arr;
	}
	
	$(selector) {
		return new List(selector, this[0].el);
	}
	
	get el() {
		return this[0].el;
	}
	
	closest(selector) {
		return this[0].closest(selector);
	}

	addClass(...cls) {
		return this.forEach(elmn => {
			elmn.addClass(...cls);
		});
	}
	
	rmClass(...cls) {
		return this.forEach(elmn => {
			elmn.rmClass(...cls);
		});
	}
	
	hasClass(cls) {
		return this[0].hasClass(cls);
	}
	
	setStyle(prop, value) {
		return this.forEach(elmn => {
			elmn.setStyle(prop, value);
		});
	}
	
	rmStyle(prop) {
		return this.forEach(elmn => {
			elmn.rmStyle(prop);
		});
	}
	
	getStyle(prop) {
		return this[0].getStyle(prop);
	}
	
	setAttr(prop, value) {
		return this.forEach(elmn => {
			elmn.setAttr(prop, value);
		});
	}
	
	rmAttr(prop) {
		return this.forEach(elmn => {
			elmn.rmAttr(prop);
		});
	}
	
	getAttr(prop) {
		return this[0].getAttr(prop);
	}
	
	on(event, handler, opt) {
		return this.forEach(elmn => {
			elmn.on(event, handler, opt);
		});
	}
	
	off(event, handler, opt) {
		return this.forEach(elmn => {
			elmn.off(event, handler, opt);
		});
	}
	
	textContent(text) {
		if (text === undefined) {
			return this[0].textContent();
		} else {
			return this.forEach(elmn => {
				elmn.textContent(text);
			});
		}
	}
	
	innerText(text) {
		if (text === undefined) {
			return this[0].innerText();
		} else {
			return this.forEach(elmn => {
				elmn.innerText(text);
			});
		}
	}
	
	innerHTML(html) {
		if (html === undefined) {
			return this[0].innerHTML();
		} else {
			return this.forEach(elmn => {
				elmn.innerHTML(html);
			});
		}
	}
	
	insertHTML(pos, html) {
		return this.forEach(elmn => {
			elmn.insertHTML(pos, html);
		});
	}
	
	focus() {
		return this.forEach(elmn => {
			elmn.focus();
		});
	}
	
	blur() {
		return this.forEach(elmn => {
			elmn.blur();
		});
	}
	
	value() {
		return this[0].value();
	}
	
	// Render Components
	
	renderAdd(...components) {
		return this.forEach(elmn => {
			elmn.renderAdd(...components);
		});
	}
	
	renderRemove(...components) {
		return this.forEach(elmn => {
			elmn.renderRemove(...components);
		});
	}
	
	renderReplace(component, newComponent) {
		return this.forEach(elmn => {
			elmn.renderReplace(component, newComponent);
		});
	}
	
	renderClear() {
		return this.forEach(elmn => {
			elmn.renderClear();
		});
	}
	
	render(innerHTML = false) {
		return this.forEach(elmn => {
			elmn.render(innerHTML);
		});
	}
	
	clear() {
		return this.forEach(elmn => {
			elmn.clear();
		});
	}

	renderSuper(ComponentArr, innerHTML) {
		return this.forEach(elmn => {
			elmn.renderSuper(ComponentArr, innerHTML);
		});
	}
	
}

const $ = (selector) => new List(selector, document);

$.elmn = (el) => new Elmn(el);
$.head = document.head;
$.title = document.title;
$.body = document.body;

export default $;
