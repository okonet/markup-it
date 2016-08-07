const Immutable = require('immutable');

const STYLES = require('../constants/styles');
const isBlock = require('../utils/isBlock');
const isEntity = require('../utils/isEntity');
const isStyle = require('../utils/isStyle');

const DEFAULTS = {
    // Type of token
    type: String(),

    // Metadata for this token
    data: new Immutable.Map(),

    // Inner text of this token (for inline tokens)
    text: null,

    // Original raw content of this token
    // Can be use for annotating
    raw: String(),

    // List of children tokens (for block tokens)
    tokens: new Immutable.List()
};

class Token extends new Immutable.Record(DEFAULTS) {
    constructor(def) {
        super({
            type:   def.type,
            data:   new Immutable.Map(def.data),
            text:   def.text,
            raw:    def.raw,
            tokens: new Immutable.List(def.tokens)
        });
    }

    // ---- GETTERS ----
    getType() {
        return this.get('type');
    }

    getData() {
        return this.get('data');
    }

    getText() {
        return this.get('text');
    }

    getRaw() {
        return this.get('raw');
    }

    getTokens() {
        return this.get('tokens');
    }

    /**
     * Return true if token is a text node
     * @return {Boolean}
     */
    isText() {
        return this.getType() === STYLES.TEXT;
    }

    /**
     * Return true if is a block token
     * @return {Boolean}
     */
    isBlock() {
        return isBlock(this);
    }

    /**
     * Return true if is an inline token
     * @return {Boolean}
     */
    isInline() {
        return !this.isBlock();
    }

    /**
     * Return true if is an inline style
     * @return {Boolean}
     */
    isStyle() {
        return isStyle(this);
    }

    /**
     * Return true if is an inline entity
     * @return {Boolean}
     */
    isEntity() {
        return isEntity(this);
    }

    /**
     * Merge this token with another one
     * @param {Token} token
     * @return {Token}
     */
    mergeWith(token) {
        return this.merge({
            type: token.getType(),
            text: this.getText() + token.getText(),
            raw:  this.getRaw() + token.getRaw(),
            data: this.getData()
                .merge(token.getData()),
            tokens: this.getTokens()
                .concat(token.getTokens())
        });
    }

    /**
     * Push an inner token
     * @param {Token} token
     * @return {Token}
     */
    pushToken(token) {
        return this.merge({
            tokens: this.getTokens()
                .push(token)
        });
    }

    /**
     * Update data of the token
     * @param {Object|Map}
     * @return {Token}
     */
    setData(data) {
        return this.set('data', Immutable.Map(data));
    }

    /**
     * Return plain text of a token merged with its children.
     * @return {String}
     */
    getAsPlainText() {
        var tokens = this.getTokens();

        if (tokens.size === 0) {
            return (this.getText() || '');
        }

        return tokens.reduce(function(text, tok) {
            return text + tok.getAsPlainText();
        }, '');
    }

    // ---- STATICS ----

    /**
     * Create a token
     * @param {Object} tok
     * @return {Token}
     */
    static create(type, tok) {
        tok = tok || {};

        var text   = tok.text || '';
        var tokens = Immutable.List(tok.tokens || []);
        var data   = Immutable.Map(tok.data || {});

        if (tokens.size > 0) {
            text = undefined;
        }

        return new Token({
            type:       type,
            text:       text,
            raw:        tok.raw || '',
            tokens:     tokens,
            data:       data
        });
    }

    /**
     * Create a token for an inline text
     * @param {String} text
     * @return {Token}
     */
    static createText(text) {
        return Token.create(STYLES.TEXT, {
            text: text,
            raw:  text
        });
    }
}

module.exports = Token;
