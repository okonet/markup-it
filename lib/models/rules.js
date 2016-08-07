const Immutable = require('immutable');
const is = require('is');

const Rule = require('./rule');

const DEFAULTS = {
    rules: new Immutable.List()
};

class RulesSet extends new Immutable.Record(DEFAULTS) {
    constructor(rules) {
        rules = RulesList(rules);

        super({
            rules: rules
        });
    }

    // ---- GETTERS ----

    getRules() {
        return this.get('rules');
    }

    // ---- METHODS ----

    /**
     * Add a rule / or rules
     * @param {Rule|RulesSet|Array} rules
     * @return {RulesSet}
     */
    add(newRules) {
        var rules = this.getRules();

        // Prepare new rules
        newRules = RulesList(newRules);

        // Concat rules
        rules = rules.concat(newRules);

        return this.set('rules', rules);
    }

    /**
     * Add a rule / or rules at the beginning
     * @param {Rule|RulesSet|Array} rules
     * @return {RulesSet}
     */
    unshift(newRules) {
        var rules = this.getRules();

        // Prepare new rules
        newRules = RulesList(newRules);

        // Add rules
        rules = rules.unshift.apply(rules, newRules.toArray());

        return this.set('rules', rules);
    }

    /**
     * Remove a rule by its type
     * @param {String} ruleType
     * @return {RulesSet}
     */
    del(ruleType) {
        var rules = this.getRules();

        rules = rules.filterNot(function(rule) {
            return rule.getType() == ruleType;
        });

        return this.set('rules', rules);
    }

    /**
     * Replace a rule type by a new rule
     * @param {Rule} rule
     * @return {RulesSet}
     */
    replace(rule) {
        return this
            .del(rule.getType())
            .add(rule);
    }

    /**
     * Get a specific rule using its type
     * @param {String} ruleType
     * @return {Rule}
     */
    getRule(ruleType) {
        var rules = this.getRules();

        return rules.find(function(rule) {
            return rule.getType() == ruleType;
        });
    }
}

/**
 * Build a list of rules
 * @param {Rule|RulesSet|Array} rules
 * @return {List<Rule>}
 */
function RulesList(rules) {
    if (rules instanceof Rule) {
        return new Immutable.List([rules]);
    }

    if (is.array(rules)) {
        return new Immutable.List(rules);
    }

    if (rules instanceof RulesSet) {
        return rules.getRules();
    }

    return rules || new Immutable.List();
}

module.exports = RulesSet;
