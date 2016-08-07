const Immutable = require('immutable');

const STYLES = require('../constants/styles');
const lex = require('./lex');
const mergeTokens = require('./mergeTokens');

class ParsingState {
    constructor(syntax, options) {
        this._       = {};
        this.depth   = 0;
        this.syntax  = syntax;
        this.options = Immutable.Map(options || {});
    }

    /**
     * Get an option value
     * @param {String} key
     * @return {Mixed}
     */
    getOption(key) {
        return this.options.get(key);
    }

    /**
     * Get depth of parsing
     * @return {Number}
     */
    getDepth() {
        return this.depth;
    }

    /**
     * Get depth of parent token
     * @return {Number}
     */
    getParentDepth() {
        return this.getDepth() - 1;
    }

    /**
     * Get a state
     * @param {String} key
     * @return {Mixed}
     */
    get(key) {
        return this._[key];
    }

    /**
     * Get a state
     * @param {String} key
     * @param {Mixed} value
     * @return {Mixed}
     */
    set(key, value) {
        this._[key] = value;
        return this;
    }

    /**
     * Toggle a state and execute the function
     * @param {String} key
     * @param {[type]} [varname] [description]
     * @return {Mixed}
     */
    toggle(key, value, fn) {
        if (!fn) {
            fn = value;
            value = this.depth;
        }

        let prevValue = this.get(key);

        this._[key] = value;
        var result = fn();
        this._[key] = prevValue;

        return result;
    }

    /**
     * Parse a text using a set of rules
     * @param {RulesSet} rules
     * @param {Boolean} isInline
     * @param {String} text
     * @return {List<Token>}
     */
    parse(rulesSet, isInline, text) {
        this.depth++;

        let rules = rulesSet.getRules();
        let tokens = lex(this, rules, isInline, text);

        if (isInline) {
            tokens = mergeTokens(tokens, [
                STYLES.TEXT
            ]);
        }

        this.depth--;

        return tokens;
    }

    /**
     * Parse a text using inline rules
     * @param {String} text
     * @return {List<Token>}
     */
    parseAsInline(text) {
        return this.parse(
            this.syntax.getInlineRulesSet(),
            true,
            text
        );
    }

    /**
     * Parse a text using inline rules
     * @param {String} text
     * @return {List<Token>}
     */
    parseAsBlock(text) {
        return this.parse(
            this.syntax.getBlockRulesSet(),
            false,
            text
        );
    }
}

module.exports = ParsingState;
