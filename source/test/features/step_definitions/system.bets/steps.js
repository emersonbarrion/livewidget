module.exports = function () {

    var support = require("../support");
    var expect = require('jasmine').expect;

    var url = "http://sportsbook.betsson.sitestack.mylocal/en/football";

    this.Given(/^that I am on the sportsbook page$/, function (callback) {

        // Maximise the browser window. Annoying but needed as the glimpse overlay can prevent selenium from clicking some stuff.
        this.browser.driver.manage().window().maximize();

        support.get(this, url, function (result) {
            callback(result);
        });
    });

    this.Given(/^that I have less than (\d+) selections$/, function (numberOfSelections, callback) {
        support.findElements(this, '.event-slip button', function(items) {

            while (items.length > numberOfSelections)
                items[index].click();

            callback();
        });
    });

    this.Then(/^the system bets tab should be disabled$/, function (callback) {

        support.isElementPresentByClass(this, '.bet-types .system', function (result) {
            expect(result).toBe(true);
        });

        support.findElements(this, '.bet-types .system', function (items) {
            callback.pending();
        });
    });

    this.When(/^I make (\d+) or more selections$/, function (numberOfSelections, callback) {
        support.findElements(this, ".selectable", function (items) {

            for (var i = 0; i < numberOfSelections; i++)
                items[i].click();

            callback();
        });
    });

    this.Given(/^that I have (\d+) selections$/, function (numberOfSelections, callback) {

        support.findElements(this, '.event-slip button', function (items) {

            while (items.length > 0)
                items[index].click();

            support.findElements(this, ".selectable", function (items) {

                for (var i = 0; i < numberOfSelections; i++)
                    items[i].click();

                callback();
            });
        });
    });

    this.When(/^I remove a selection$/, function (callback) {
        support.findElements(this, '.event-slip button', function (items) {
            items[0].click();
            callback();
        });
    });
};