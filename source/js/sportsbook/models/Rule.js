/* Define the Sportsbook namespace if we don't have it already. */
/* istanbul ignore if  */
if (!window.Sportsbook)
/** @namespace Sportsbook */
{
    window.Sportsbook = {};
}

// Define a specific namespace for the rules. This allows us to keep them isolated from the rest of the model.
/* istanbul ignore if  */
/* istanbul ignore else  */
if (!window.Sportsbook.Rules)
/** @namespace Sportsbook.Rules */
{
    window.Sportsbook.Rules = {};
}

/**
 * Describes the result of a rule test.
 * If passed is true, "affected" and "message" will be undefined.
 * @param {boolean} passed - The result of the rule test.
 * @param {array} violations - The IDs of the selections in the coupon which are in violation of the rule.
 * @param {array} affected - The IDs of the selections which are affected by the rule.
 * @param {string} message - A message key which can be used to select the messages to display.
 * @class Sportsbook.Rules.Ruling
 * @constructor
 */

Sportsbook.Rules.Ruling = function (passed, violations, affected, ruleId, messageKey) {
    "use strict";
    this.passed = passed;
    this.violations = violations;
    this.affected = affected;
    this.ruleId = ruleId;
    this.messageKey = messageKey;
};

/**
 * Defines an assertion to be run on the coupons and the available selections. See SSK-151
 * @class Sportsbook.Rules.Rule
 * @constructor
 * @param {String} key - The message key for the rule.
 * @param {function} test - The rule implementation. This should accept a context, and return an array of affected selections.
 */
Sportsbook.Rules.Rule = function (id, test) {
    "use strict";

    var self = this;

    self.id = id;
    self.test = test;

    /**
     * Executes the rule assertion.
     * @function assert
     * @memberOf Sportsbook.Rules.Rule
     * @instance
     * @param {Object} selections - The selections against which the current selection will be tested.
     * @param {Object} targetSelection - The selection being tested.
     * @returns {Sportsbook.Rules.Ruling} - The result of the assertion.
     */
    this.assert = function (selections, targetSelection, messageKey) {
        var result = test(selections, targetSelection);
        var passed = result.violations.length === 0;

        return new Sportsbook.Rules.Ruling(passed, result.violations, result.affected, self.id, messageKey);
    };
};

/**
 * Pass through rule - this rule imposes no restrictions. See SSK-467
 * @memberOf Sportsbook.Rules
 */
Sportsbook.Rules.NoRestriction = new Sportsbook.Rules.Rule("no_restriction", function () {
    return {violations: [], affected: []};
});

/**
 * Specifies that a selection may not be combined with any other market from the same event. See SSK-467
 * @memberOf Sportsbook.Rules
 */
Sportsbook.Rules.NotSameEventRestriction = new Sportsbook.Rules.Rule("not_same_event_restriction", function (selections, targetSelection) {
    // Determine if there are any other selections with the same event id in the coupon.
    var matches = _.map(_.filter(selections, function (s) {
        return s.eventId === targetSelection.eventId && s.id !== targetSelection.id;
    }), function (s) {
        return s.id;
    });

    return {
        violations: matches.length === 0 ? [] : [targetSelection.id],
        affected: matches
    };
});

/**
 * Specifies that a selection may not be combined with any other market from the same subcategory. See SSK-467
 * @memberOf Sportsbook.Rules
 */
Sportsbook.Rules.NotSameSubCategoryRestriction = new Sportsbook.Rules.Rule("not_same_subcategory_restriction", function (selections, targetSelection) {

    // Determine if there are any other selections with the same event id in the coupon.
    var matches = _.map(_.filter(selections, function (s) {
        return s.subCategoryId === targetSelection.subCategoryId && s.id !== targetSelection.id;
    }), function (s) {
        return s.id;
    });

    return {
        violations: matches.length === 0 ? [] : [targetSelection.id],
        affected: matches
    };
});

/**
 * Specifies that a selection may not be combined with any other selection. See SSK-467
 * @memberOf Sportsbook.Rules
 */
Sportsbook.Rules.CannotCombineRestriction = new Sportsbook.Rules.Rule("cannot_combine", function (selections, targetSelection) {
    return (selections.length > 1) ? {violations: [targetSelection.id], affected: []} : {violations: [], affected: []};
});

/**
 * Specifies that a selection may not be combined with any other for the same participant. See SSK-467
 * @memberOf Sportsbook.Rules
 */
Sportsbook.Rules.NotSameParticipantRestriction = new Sportsbook.Rules.Rule("not_same_participant_restriction", function (selections, targetSelection) {
    var participantId = targetSelection.participantId;

    // Determine if there are any other selections with the same event id in the coupon.
    var matches = _.map(_.filter(selections, function (s) {
        return s.participantId === participantId && s.id !== targetSelection.id;
    }), function (s) {
        return s.id;
    });

    return {
        violations: matches.length === 0 ? [] : [targetSelection.id],
        affected: matches
    };
});

Sportsbook.Rules.OddsCannotEqual1Restriction = new Sportsbook.Rules.Rule("odds_cannot_equal_1_restriction", function (selections, targetSelection) {

    return {
        violations: (targetSelection.odds === 1) ? [targetSelection.id] : [],
    };
});

Sportsbook.Rules.NotOnHoldRestriction = new Sportsbook.Rules.Rule("not_on_hold_restriction", function (selections, targetSelection) {

    return {
        violations: (targetSelection.isOnHold) ? [targetSelection.id] : [],
    };
});

Sportsbook.Rules.Repository = [
    Sportsbook.Rules.NoRestriction,
    Sportsbook.Rules.NotSameEventRestriction,
    Sportsbook.Rules.NotSameSubCategoryRestriction,
    Sportsbook.Rules.CannotCombineRestriction,
    Sportsbook.Rules.NotSameParticipantRestriction
];

Sportsbook.Rules.ClientRepository = [
    Sportsbook.Rules.NotOnHoldRestriction
];

Sportsbook.Rules.Global = [
    Sportsbook.Rules.OddsCannotEqual1Restriction
];
