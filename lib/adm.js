// Class ADMElmn

class ADMElmn {

    constructor(el) {
        this._elmn = el;
    }

    // Public API

    $(selector) {
        return new ADMList(selector, this._elmn);
    }

    get e() {
        return this._elmn;
    }

    addClass(...cls) {
        this._elmn.classList.add(...cls);
        return this;
    }

    rmClass(...cls) {
        this._elmn.classList.remove(...cls);
        return this;
    }

    hasClass(cls) {
        return this._elmn.classList.contains(cls);
    }

    setStyle(prop, value) {
        this._elmn.style.setProperty(prop, value);
        return this;
    }

    rmStyle(prop) {
        this._elmn.style.removeProperty(prop);
        return this;
    }

    getStyle(prop) {
        return this._elmn.style.getPropertyValue(prop);
    }

    setAttr(prop, value) {
        this._elmn.setAttribute(prop, value);
        return this;
    }

    rmAttr(prop) {
        this._elmn.removeProperty(prop);
        return this;
    }

    getAttr(prop) {
        return this._elmn.getAttribute(prop);
    }

    on(event, fn, opt = {}) {
        this._elmn.addEventListener(event, fn, opt = {});
        return this;
    }

    off(event, fn, opt = {}) {
        this._elmn.removeEventListener(event, fn, opt = {});
        return this;
    }

    textContent(text) {
        this._elmn.textContent = text;
        return this;
    }

    innerText(text) {
        this._elmn.innerText = text;
        return this;
    }

    innerHTML(html) {
        this._elmn.innerHTML = html;
        return this;
    }

    insertHtml(pos, html) {
        this._elmn.insertAdjacentHTML(pos, html);
        return this;
    }

    focus() {
        this._elmn.focus();
        return this;
    }

    blur() {
        this._elmn.blur();
        return this;
    }

}

// Class ADMList

class ADMList {

    constructor(selector, base = document) {
        this.selector = selector;
        this.base = base;
        this.length = 0;
        this.base.querySelectorAll(selector).forEach(el => {
             this[this.length++] = new ADMElmn(el);
        });
    }

    // Public API

    forEach(fn) {
        for (let i = 0; i < this.length; i++) {
            fn(this[i], i);
        }
        return this;
    }

    $(selector) {
        return new ADMList(selector, this.e);
    }

    get elmn() {
        return this[0];
    }

    get e() {
        return this[0].e;
    }

    addClass(...cls) {
        this.forEach(elmn => {
            elmn.addClass(...cls);
        });
        return this;
    }

    rmClass(...cls) {
        this.forEach(elmn => {
            elmn.rmClass(...cls);
        });
        return this;
    }

    hasClass(cls) {
        return this.elmn.hasClass(cls);
    }

    setStyle(prop, value) {
        this.forEach(elmn => {
            elmn.setStyle(prop, value);
        });
        return this;
    }

    rmStyle(prop) {
        this.forEach(elmn => {
            elmn.rmStyle(prop, value);
        });
        return this;
    }

    getStyle(prop) {
        return this.elmn.getStyle(prop);
    }

    setAttr(prop, value) {
        this.forEach(elmn => {
            elmn.setAttr(prop, value);
        });
        return this;
    }

    rmAttr(prop) {
        this.forEach(elmn => {
            elmn.rmAttr(prop);
        });
        return this;
    }

    getAttr(prop) {
        return this.elmn.getAttr(prop);
    }

    on(event, fn, opt = {}) {
        return this.forEach(elmn => {
            elmn.on(event, fn, opt);
        });
    }

    off(event, fn, opt = {}) {
        return this.forEach(elmn => {
            elmn.off(event, fn, opt);
        });
    }

    textContent(text) {
        this.forEach(elmn => {
            elmn.textContent(text);
        });
        return this;
    }

    innerText(text) {
        this.forEach(elmn => {
            elmn.innerText(text);
        });
        return this;
    }

    innerHTML(html) {
        this.forEach(elmn => {
            elmn.innerHTML(html);
        });
        return this;
    }

    insertHtml(pos, html) {
        this.forEach(elmn => {
            elmn.insertHtml(pos, html);
        });
        return this;
    }

    focus() {
        this.elmn.focus();
        return this;
    }

    blur() {
        this.elmn.blur();
        return this;
    }

    push(...lists) {
        lists.forEach(list => {
            list.forEach(elmn => {
                this[this.length++] = elmn;
            });
        });
        return this;
    }

    pop(n = 0) {
        for (let i = n; i < this.length; i++) {
            this[i] = this[i + 1];
        }
        delete this[--this.length];
        return this;
    }

    pushEl(...els) {
        els.forEach(el => {
            this[this.length++] = new ADMElmn(el);
        });
        return this;
    }

}

const $ = (selector) => new ADMList(selector);

$.el = (el) => new ADMList().pushEl(el);

$.head = $('head');
$.title = $.head.$('title');
$.body = $('body');

// Export

module.exports = $;
