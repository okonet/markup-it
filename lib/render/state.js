const Token         = require('../models/token');
const RenderOptions = require('./options');

class RenderingState {
    constructor(syntax, options) {
        this.syntax  = syntax;
        this.options = RenderOptions(options || {});
    }

    /**
     * Render a token using a set of rules
     * @param {RulesSet} rules
     * @param {Boolean} isInline
     * @param {Token|List<Token>} tokens
     * @return {List<Token>}
     */
    render(tokens) {
        let state    = this;
        let syntax   = this.syntax;
        let annotate = this.options.getAnnotateFn();

        if (tokens instanceof Token) {
            let token = tokens;
            tokens = token.getTokens();

            if (tokens.size === 0) {
                return annotate(state, token.getAsPlainText(), token);
            }
        }

        return tokens.reduce(function(text, token) {
            let tokenType = token.getType();
            let rule = (token.isInline()? syntax.getInlineRule(tokenType)
                : syntax.getBlockRule(tokenType));

            if (!rule) {
                throw new Error('Unexpected error: no rule to render "' + tokenType + '"');
            }

            let raw = rule.onToken(state, token);
            raw = annotate(state, raw, token);

            return text + raw;
        }, '');
    }

    renderAsInline(tokens) {
        return this.render(tokens);
    }

    renderAsBlock(tokens) {
        return this.render(tokens);
    }
}

module.exports = RenderingState;
