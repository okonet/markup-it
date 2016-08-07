const parse    = require('./parse');
const render   = require('./render');

class MarkupIt {
    /**
     * Create an instance using a set of rules
     * @param {Syntax} syntax
     */
    constructor(syntax) {
        this.syntax = syntax;
    }

    /**
     * Convert a text into a parsed content
     * @param  {String} text
     * @return {ContentState}
     */
    toContent(text, options) {
        return parse(this.syntax, text, options);
    }

    /**
     * Convert a text into an inline parsed content
     * @param  {String} text
     * @return {List<Tokens>}
     */
    toInlineContent(text) {
        return parse.asInline(this.syntax, text);
    }

    /**
     * Convert a content to text
     * @param  {ContentState} content
     * @param  {Object} options
     * @return {String}
     */
    toText(content, options) {
        return render(this.syntax, content, options);
    }

    /**
     * Convert a content to text
     * @param  {List<Tokens>}
     * @return {String}
     */
    toInlineText(tokens) {
        return render.asInline(this.syntax, tokens);
    }
}

module.exports = MarkupIt;
