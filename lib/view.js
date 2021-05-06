// Class View

class View {

    constructor(template) {
        this.template = template;
    }

    // Public API

    parse(params = {}) {
        this.template = this.html(params);
        return this;
    }

    html(params = {}, ) {
        let _html = this.template;
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            _html = _html.replaceAll(`[${key}]`, params[key]);
        }
        return _html;
    }

}

// Export

module.exports = View;
