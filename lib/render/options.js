const Immutable = require('immutable');

const DEFAULTS = {
    // Transform the output of the render of a token
    annotate: function(state, raw, token) {
        return raw;
    }
};

class RenderOptions extends new Immutable.Record(DEFAULTS) {
    getAnnotateFn() {
        return this.get('annotate');
    }
}

module.exports = RenderOptions;
