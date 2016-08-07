const Immutable = require('immutable');
const is = require('is');

const Token = require('./token');

const DEFAULTS = {
    // Type of the rule
    type: new String(),

    // Listener / Handlers {Map(<String,List<Function>)}
    listeners: new Immutable.Map()
};

class Rule extends new Immutable.Record(DEFAULTS) {
    // ---- GETTERS ----

    getType() {
        return this.get('type');
    }

    getListeners() {
        return this.get('listeners');
    }

    // ---- METHODS ----

    /**
     * Add a listener
     * @param {String} key
     * @param {Function} fn
     * @return {Rule} rule
     */
    on(key, fn) {
        var listeners = this.getListeners();

        // Add the function to the list
        var fns = listeners.get(key) || new Immutable.List();
        fns = fns.push(fn);

        listeners = listeners.set(key, fns);

        return this.set('listeners', listeners);
    }

    /**
     * Add a template or function to render a token
     * @param {String|Function} fn
     * @return {Rule} rule
     */
    toText(fn) {
        if (is.string(fn)) {
            var tpl = fn;
            fn = function (state, token) {
                return tpl.replace('%s', function() {
                    return state.render(token);
                });
            };
        }

        return this.on('text', fn);
    }

    /**
     * Add a match callback
     * @param {Function} fn
     * @return {Rule} rule
     */
    match(fn) {
        return this.on('match', fn);
    }

    /**
     * Add a match callback using a RegExp
     * @param {RegExp} re
     * @param {Funciton} propsFn
     * @return {Rule} rule
     */
    regExp(re, propsFn) {
        return this.match(function(state, text) {
            var block = {};

            var match = re.exec(text);
            if (!match) {
                return null;
            }
            if (propsFn) {
                block = propsFn.call(null, state, match);
            }

            if (!block) {
                return null;
            }
            else if (block instanceof Token) {
                return block;
            }
            else if (is.array(block)) {
                return block;
            }

            block.raw = is.undefined(block.raw)? match[0] : block.raw;

            return block;
        });
    }

    /**
     * Call listerners with a specific set of data
     * @param {String} key
     * @return {Mixed}
     */
    emit(key) {
        var args = Array.prototype.slice.call(arguments, 1);
        var listeners = this.getListeners();

        // Add the function to the list
        var fns = listeners.get(key) || new Immutable.List();

        return fns.reduce(function(result, fn) {
            if (result) return result;

            return fn.apply(null, args);
        }, null);
    }

    /**
     * Parse a text using matching rules and return a list of tokens
     * @param  {ParsingState} state
     * @param  {String} text
     * @return {List<Token>}
     */
    onText(state, text) {
        return this.emit('match', state, text);
    }

    /**
     * Render a token as a string
     * @param  {RenderingState} state
     * @param  {Token} token
     * @return {String}
     */
    onToken(state, text) {
        return this.emit('text', state, text);
    }

    // ---- STATICS ----

    /**
     * Create a new rule
     * @param {String} rule
     * @return {Rule}
     */
    static create(type) {
        return new Rule({ type: type });
    }
}

module.exports = Rule;
