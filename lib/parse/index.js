const Content = require('../models/content');
const ParsingState = require('./state');
const matchRule = require('./matchRule');

/**
 * Parse a text using a syntax
 * @param  {Syntax} syntax
 * @param  {String} text
 * @return {Content}
 */
function parse(syntax, text, options) {
    let entryRule = syntax.getEntryRule();
    let state     = new ParsingState(syntax, options);
    let tokens    = matchRule(state, entryRule, text);

    return Content.createFromToken(syntax.getName(), tokens.first());
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {String} text
 * @return {List<Token>}
 */
function parseAsInline(syntax, text, options) {
    let state = new ParsingState(syntax, options);
    return state.parseAsInline(text);
}

module.exports          = parse;
module.exports.asInline = parseAsInline;
