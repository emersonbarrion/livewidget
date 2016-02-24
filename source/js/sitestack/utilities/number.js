/**
 * @ngdoc service
 * @name Number
 * @description Extension methods for the JavaScript Number type.
 */

/**
 * @ngdoc method
 * @name Number#roundAtMidpoint
 * @methodOf Number
 * @description Rounds down at the midway point (i.e. 0.55555555...) to 2 decimal places.  Used for tax calculations.
 * @param {number=} precision - The precision decimal places to round to.
 * @returns {number} - The rounded number
 */
Number.prototype.roundAtMidpoint = function (precision) {
    var d = precision || 0;
    var m = Math.pow(10, d);
    var n = +(d ? this * m : this).toFixed(8); // Avoid rounding errors
    var i = Math.floor(n), f = n - i;
    var e = 1e-8; // Allow for rounding errors in f
    var r = (f > 0.5 - e && f < 0.5 + e) ?
        ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
};
