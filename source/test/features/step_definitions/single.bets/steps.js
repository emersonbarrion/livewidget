module.exports = function () {

    var support = require("../support");
    require('jasmine');
    
    this.Given(/^that I have no selections$/, function (callback) {
        support.findElements(this, '.event-slip button', function (items) {

            while (items.length > 0)
                items[index].click();

            callback();
        });
    });

    this.Then(/^the bet button should be hidden$/, function (callback) {

        var betButtonSelector = 'button.submitCoupon';

        support.isElementPresent(this, betButtonSelector, function(result) {
            if (result) {
                support.findElements(this, betButtonSelector, function (items) {                    
                    items[0].isDisplayed().then(function(state) {
                        expect(state).toBe(false);
                        callback();
                    });
                });
            } else {
                callback();
            }
        });        
    });

    this.Then(/^the potential win should be "([^"]*)"$/, function (expectedPotentialPayout, callback) {
        support.findByBinding(this, 'coupon.getPotentialWin()', function (item) {

            item.getText().then(function(value) {
                expect(value).toBe(expectedPotentialPayout);
                callback();
            });            
        });
    });

    this.When(/^I pick a selection$/, function (callback) {

        support.findElements(this, ".selectable", function (items) {
            items[0].click();
            callback();
        });
    });

    this.Then(/^the selection should be added to the betslip$/, function (callback) {
        support.findElements(this, ".event-slip", function (items) {
            expect(items.length).toBe(1);
            callback();
        });
    });

    this.Given(/^that I have (\d+) selection[s]?$/, function (numberOfSelections, callback) {
        support.findElements(this, ".selectable", function (items) {

            for (var i = 0; i < numberOfSelections; i++)
                items[i].click();

            callback();
        });
    });

    this.When(/^I set a stake of "([^"]*)"$/, function (value, callback) {
        
        support.findByModel(this, "bet.stake", function (items) {

            for (var i = 0; i < items.length; i++)
                items[i].sendKeys(value);
            
            callback();
        });
    });

    this.Then(/^the potential win should be updated$/, function (callback) {

        support.findByBinding(this, "bet.selection.odds", function (items) {
            items[0].getText().then(function (text) {
                var odds = parseFloat(text);
                var expectedPayout = odds * 2.0;

                // The payout should be the equivalent of (stake * odds) formatted for currency.
                support.findByBinding(this, 'coupon.getPotentialWin()', function (item) {

                    item.getText().then(function (value) {
                        expect(value).toBe('€' + expectedPayout.toFixed(2));
                        callback();
                    });
                });
            });
        });

    });

    this.Then(/^the bet button should be displayed$/, function (callback) {
        var betButtonSelector = 'button.submitCoupon';

        support.isElementPresent(this, betButtonSelector, function (result) {
            if (result) {
                support.findElements(this, betButtonSelector, function (items) {
                    items[0].isDisplayed().then(function (state) {
                        expect(state).toBe(true);
                        callback();
                    });
                });
            } else {
                callback();
            }
        });
    });
};