const Rule = require('../models/rule');

const BLOCKS = require('./blocks');
const STYLES = require('./styles');

const defaultDocumentRule = Rule.create(BLOCKS.DOCUMENT)
    .match(function(state, text) {
        return {
            tokens: state.parseAsBlock(text)
        };
    })
    .toText(function(state, token) {
        return state.renderAsBlock(token);
    });

const defaultBlockRule = Rule.create(BLOCKS.TEXT)
    .match(function(state, text) {
        return {
            tokens: state.parseAsInline(text)
        };
    })
    .toText('%s\n');

const defaultInlineRule = Rule.create(STYLES.TEXT)
    .match(function(state, text) {
        return {
            text: text
        };
    })
    .toText('%s');

module.exports = {
    documentRule: defaultDocumentRule,
    blockRule:    defaultBlockRule,
    inlineRule:   defaultInlineRule
};
