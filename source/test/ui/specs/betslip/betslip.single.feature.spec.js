describe('Feature: Betslip (Single bet mode)', function() {
    
    beforeEach(function () {

        // Maximise the browser window. Annoying but needed as the glimpse overlay can prevent selenium from clicking some stuff.
        browser.driver.manage().window().maximize();
        browser.get("http://sportsbook.betsson.sitestack.mylocal/en/football/england/fa-premiership");

        // Ensure that the betslip is empty
        element.all(by.css('.event-slip button')).then(function(items) {

            for (var index = 0; index < items.length; index++)
                items[index].click();
        });

        // Switch to single bet mode
        element(by.css('.bet-types .single')).click();
    });

    it('Bet button should be hidden if the betslip is empty', function() {

        var betButton = element(by.css('button.submitCoupon'));        
        expect(betButton.isDisplayed()).toBe(false);

        // Consider also disabling the button.
        //expect(betButton.isEnabled()).toBe(false);
    });

    it('Possible payout should default to 0 in the currency format', function() {

        expect(element(by.binding('coupon.getPotentialWin()')).getText()).toEqual("€0.00");
    });

    describe('When a selection is clicked', function() {

        beforeEach(function() {
            element.all(by.css(".selectable")).then(function (items) {
                items[0].click();
            });
        });

        it('should display the selection in the betslip', function () {            
            element.all(by.css(".event-slip")).then(function(items) {
                expect(items.length).toEqual(1);
            });
        });

        it('should display the bet button', function() {
            expect(element(by.css('button.submitCoupon')).isDisplayed()).toBe(true);
        });

        describe('and a stake is set on the selection', function () {

            beforeEach(function() {
                element.all(by.model('bet.stake')).then(function (items) {
                    items[0].clear();
                    items[0].sendKeys('2');
                });
            });

            it('should update possible payout', function() {

                element.all(by.binding('bet.selection.odds')).then(function(items) {
                    // Get the odds for the selection.
                    items[0].getText().then(function (text) {
                        var odds = parseFloat(text);
                        var expectedPayout = odds * 2.0;

                        // The payout should be the equivalent of (stake * odds) formatted for currency.
                        expect(element(by.binding('coupon.getPotentialWin()')).getText()).toEqual('€' + expectedPayout.toFixed(2));
                    });
                });                               
            });

            describe('and when a second selection is added and a stake is set', function () {

                beforeEach(function () {
                    element.all(by.css(".selectable")).then(function (items) {
                        items[1].click();
                    });

                    element.all(by.model('bet.stake')).then(function (items) {
                        items[0].clear();
                        items[0].sendKeys('2');

                        items[1].clear();
                        items[1].sendKeys('3');
                    });
                });

                it('should update possible payout to the sum of stake * odds', function() {

                    var sum = 0;
                    
                    element.all(by.binding('bet.selection.odds')).then(function (items) {
                        // Get the odds for the selection.
                        items[0].getText().then(function (text1) {
                            sum += (parseFloat(text1) * 2);

                            items[1].getText().then(function (text2) {
                                sum += (parseFloat(text2) * 3);
                                
                                expect(element(by.binding('coupon.getPotentialWin()')).getText()).toEqual('€' + sum.toFixed(2));
                            });
                        });                        
                    });
                });
            });
        });
    });
});