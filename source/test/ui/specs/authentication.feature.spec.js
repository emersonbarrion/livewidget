describe("Feature: User authentication", function() {

    beforeEach(function() {
        browser.get("http://sportsbook.betsson.sitestack.mylocal/en");

        // Consider adding an id to the login link
        element(by.css('.login.dropdown-item .dropdown-toggle')).click();

        // The login box should be displayed.
        expect(element(by.css('.dropdown-container.arrow-box')).isDisplayed()).toBe(true);
    });

    describe("Scenario: User logged out, valid credentials presented", function () {

        it("should log the user in", function () {

            element(by.model('loginSubmitModel.username')).sendKeys('betssonqa02@gmail.com');
            element(by.model('loginSubmitModel.password')).sendKeys('testtest1');

            // Consider adding an id to the login button
            element(by.css('.login-button-wrapper button')).click();

            // Verify the state change
            // Right now we are not displaying user details so we should update this test once we add some items.
            // For now we only check that the login link is removed.
            expect(element(by.css('.login.dropdown-item')).isDisplayed()).toBe(false);

            // The login box should get hidden on success
            expect(element(by.css('.dropdown-container.arrow-box')).isDisplayed()).toBe(false);
        });
    });

    describe("Scenario: User logged out, invalid credentials presented", function () {
        it("should present an error message", function () {
            element(by.model('loginSubmitModel.username')).sendKeys('betssonqa02@gmail.com');
            element(by.model('loginSubmitModel.password')).sendKeys('gbjhjh');

            // Consider adding an id to the login button
            element(by.css('.login-button-wrapper button')).click();

            // Verify the state change

            // The login link should still be visible.
            expect(element(by.css('.login.dropdown-item')).isDisplayed()).toBe(true);

            // The login box should remain open.
            expect(element(by.css('.dropdown-container.arrow-box')).isDisplayed()).toBe(true);

            // A login message should be displayed.
            expect(element(by.binding('responseErrorMessage')).isDisplayed()).toBe(true);
        });
    });
});