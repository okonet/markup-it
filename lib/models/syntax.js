const Immutable = require('immutable');

const Rule = require('./rule');
const RulesSet = require('./rules');
const defaultRules = require('../constants/defaultRules');

const DEFAULTS = {
    name:      String(),
    entryRule: new Rule(),
    inline:    new RulesSet([]),
    blocks:    new RulesSet([])
};

class SyntaxSet extends new Immutable.Record(DEFAULTS) {
    constructor(name, def) {
        super({
            name:      name,
            entryRule: def.entryRule,
            inline:    new RulesSet(def.inline),
            blocks:    new RulesSet(def.blocks)
        });
    }

    // ---- GETTERS ----
    getEntryRule() {
        return this.get('entryRule') || defaultRules.documentRule;
    }

    getName() {
        return this.get('name');
    }

    getBlockRulesSet() {
        return this.get('blocks');
    }

    getInlineRulesSet() {
        return this.get('inline');
    }

    // ---- METHODS ----

    getBlockRules() {
        return this.getBlockRulesSet().getRules();
    }

    getInlineRules() {
        return this.getInlineRulesSet().getRules();
    }

    getInlineRule(type) {
        let rulesSet = this.getInlineRulesSet();
        return rulesSet.getRule(type) || defaultRules.inlineRule;
    }

    getBlockRule(type) {
        let rulesSet = this.getBlockRulesSet();
        return rulesSet.getRule(type) || defaultRules.blockRule;
    }

    /**
     * Add a new rule to the inline set
     * @param {Rule} rule
     * @return {Syntax}
     */
    addInlineRules(rule) {
        let rulesSet = this.getInlineRulesSet();
        rulesSet = rulesSet.add(rule);

        return this.set('inline', rulesSet);
    }

    /**
     * Add a new rule to the block set
     * @param {Rule} rule
     * @return {Syntax}
     */
    addBlockRules(rule) {
        let rulesSet = this.getBlockRulesSet();
        rulesSet = rulesSet.add(rule);

        return this.set('inline', rulesSet);
    }
}

module.exports = SyntaxSet;
