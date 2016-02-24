// Define the Sportsbook namespace if we don't have it already.
/* istanbul ignore if  */
/* istanbul ignore else  */
if (!window.Sportsbook) {
    window.Sportsbook = {};
}

/**
 * Defines a user selection.
 * @class Sportsbook.Selection
 * @constructor
 * @param {object} event - The event on which the client is betting.
 * @param {object} market - The market in which the selection is defined.
 * @param {object} selection - The bet selection is the actual option that the client is betting on.
 */
Sportsbook.Selection = function(event, market, selection) {
    this.event = event;
    this.market = market;
    this.selection = selection;
};

/**
 * Defines a bet.
 * @class Sportsbook.Bet
 * @constructor
 * @param {number} type - The number of selections in the combinations.
 * @param {number} stake - The stake value of the bet, as decimal.
 */
Sportsbook.Bet = function(type, stake) {

    // Individual stake for the bet. 
    this.stake = 0.0;
    this.stakeForReview = 0.0;

    // The type of the Bet
    this.type = type;

    if (stake) {
        this.stake = stake;
    }
};
