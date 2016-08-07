const RenderingState = require('./state');

/**
 * Render a Content instance using a syntax
 * @param {Content}
 * @param {Object} options
 * @return {String}
 */
function render(syntax, content, options) {
    let state     = new RenderingState(syntax, options);
    let entryRule = syntax.getEntryRule();
    let token     = content.getToken();

    return entryRule.onToken(state, token);
}

/**
 * Parse a text using a syntax as inline content
 * @param  {Syntax} syntax
 * @param  {List<Token>} tokens
 * @return {String}
 */
function renderAsInline(syntax, tokens) {
    let state = new RenderingState(syntax);
    return state.renderAsInline(tokens);
}

module.exports          = render;
module.exports.asInline = renderAsInline;
