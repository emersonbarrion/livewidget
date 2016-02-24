 // Define the Sportsbook namespace if we don't have it already.
/* istanbul ignore if  */
if (!window.Sportsbook) {
    window.Sportsbook = {};
}

/**
 * Defines the type of market that should be displayed (live or prematch)
 * @memberOf Sportsbook
 * @property {number} All - Describes all events.
 * @property {number} Prematch - Describes prematch events.
 * @property {number} Live - Describes live events.
 */
Sportsbook.Modes = {
    All: 0,
    Prematch: 1,
    Live: 2
};