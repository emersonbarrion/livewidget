/**
 * @ngdoc service
 * @name String
 * @description Extension methods for the JavaScript String type. 
 */

/**
 * @ngdoc method
 * @name String#replaceAll
 * @methodOf String
 * @description Replaces all occurences of a substring with the given value.
 * @param {string} find - The substring to replace.
 * @param {string} replace - The substring to replace.
 * @returns {string} The source string with all occurences of the 'find' substring replaced with the 'replace' value.
 */
String.prototype.replaceAll = function(find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

/**
 * @ngdoc method
 * @name String#replaceTemplateVariables
 * @methodOf String
 * @description Populates the placeholders with the given values.
 * @param {string} category - The replacement value for category.
 * @param {string} region - The replacement value for region.
 * @param {string} competition - The replacement value for competition.
 * @param {string} event - The replacement value for event.
 * @returns {string} The populated template.
 */
String.prototype.replaceTemplateVariables = function(category, region, competition, event) {
    return this
        .replaceAll("{{category}}", category ? category : "")
        .replaceAll("{{region}}", region ? region : "")
        .replaceAll("{{competition}}", competition ? competition : "")
        .replaceAll("{{name}}", event ? event : "");
};

/**
 * @ngdoc method
 * @name String#populate
 * @methodOf String
 * @description Populates the placeholders with the given values. Placeholders should be named in the hash, and delimited by double curly braces.
 * @param {hash} values - A hash containing the replacement values.
 * @returns {string} The populated template.
 */
String.prototype.populate = function (values) {

    var string = this;

    _.forEach(_.pairs(values), function(pair) {
        string = string.replaceAll("{{" + pair[0] + "}}", pair[1]);
    });
 
    // Clean up any remaining placeholders
    string = string.replace(/\{\{[^\}]*\}\}/g, "");

    return string;
};

/**
 * @ngdoc method
 * @name String#endsWith
 * @methodOf String
 * @description Determines whether the string ends with the given suffix.
 * @param {hash} values - A hash containing the replacement values.
 * @returns {boolean} True if the string ends with the given suffix.
 */
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/*
 * Polyfill for browsers which do not support startsWith natively.
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}