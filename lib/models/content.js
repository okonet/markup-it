const Immutable = require('immutable');
const Token = require('./token');
const BLOCKS = require('../constants/blocks');

const DEFAULTS = {
    // Name of the syntax used to parse
    syntax: String(),

    // Entry token
    token:  Token.create(BLOCKS.DOCUMENT)
};

class Content extends new Immutable.Record(DEFAULTS) {
    // ---- GETTERS ----
    getSyntax() {
        return this.get('syntax');
    }

    getToken() {
        return this.get('token');
    }

    // ---- STATICS ----

    /**
     * Create a content from a syntax and a list of tokens
     *
     * @param {Syntax} syntax
     * @param {Token} token
     * @return {Content} content
     */
    static createFromToken(syntax, token) {
        return new Content({
            syntax: syntax,
            token:  token
        });
    }
}

module.exports = Content;
