const Immutable = require('immutable');

/**
 * Merge tokens of a specific type
 *
 * @param {List<Token>} tokens
 * @param {Array<String>} types
 * @return {List<Token>}
 */
function mergeTokens(tokens, types) {
    let prev;

    return tokens.reduce(function(output, token, i) {
        let tokenType = token.getType();
        let isMergeable = (types.indexOf(tokenType) >= 0);
        let hasNext = ((i+1) < tokens.size);

        if (prev && prev.getType() === tokenType && isMergeable) {
            prev = prev.mergeWith(token);
        } else {
            output = prev? output.push(prev) : output;
            prev = token;
        }

        if (!hasNext) {
            output = output.push(prev);
        }

        return output;
    }, Immutable.List());
}

module.exports = mergeTokens;
