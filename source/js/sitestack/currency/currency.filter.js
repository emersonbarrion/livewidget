(function (angular) {
    'use strict';

    /**
    * @ngdoc filter
    * @name angular-sitestack-currency.filter:currency
    * @function
    *
    * @description
    * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
    * symbol for current locale is used.
    *
    * @param {number} amount Input to filter.
    * @param {string=} symbol Currency symbol or identifier to be displayed.
    * @param {number=} fractionSize Number of decimal places to round the amount to, defaults to default max fraction size for current locale
    * @returns {string} Formatted number.
    *
    *
    * @example
    <example module="currencyExample">
        <file name="index.html">
        <script>
            angular.module('currencyExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
                $scope.amount = 1234.56;
            }]);
        </script>
        <div ng-controller="ExampleController">
            <input type="number" ng-model="amount"> <br>
            default currency symbol ($): <span id="currency-default">{{amount | currency}}</span><br>
            custom currency identifier (USD$): <span id="currency-custom">{{amount | currency:"USD$"}}</span>
            no fractions (0): <span id="currency-no-fractions">{{amount | currency:"USD$":0}}</span>
        </div>
        </file>
        <file name="protractor.js" type="protractor">
        it('should init with 1234.56', function() {
            expect(element(by.id('currency-default')).getText()).toBe('$1,234.56');
            expect(element(by.id('currency-custom')).getText()).toBe('USD$1,234.56');
            expect(element(by.id('currency-no-fractions')).getText()).toBe('USD$1,235');
        });
        it('should update', function() {
            if (browser.params.browser == 'safari') {
            // Safari does not understand the minus key. See
            // https://github.com/angular/protractor/issues/481
            return;
            }
            element(by.model('amount')).clear();
            element(by.model('amount')).sendKeys('-1234');
            expect(element(by.id('currency-default')).getText()).toBe('($1,234.00)');
            expect(element(by.id('currency-custom')).getText()).toBe('(USD$1,234.00)');
            expect(element(by.id('currency-no-fractions')).getText()).toBe('(USD$1,234)');
        });
        </file>
    </example>
    */
    angular.module('angular-sitestack-currency').filter('sskCurrency', ['$filter', 'applicationState',
        function ($filter, applicationState) {
            var standardCurrencyFilter = $filter('currency');

            var sskCurrencyFilter = function (amount, currencySymbol, fractionSize) {

                var user = applicationState.user().$$state.value;

                if (angular.isUndefined(currencySymbol) && (user) && (user.isAuthenticated) && (user.details)) {
                    var charValue = parseInt(user.details.currencySymbolUnicode, 16);
                    if (!isNaN(charValue) && charValue !== 0) {
                        currencySymbol = String.fromCharCode(charValue);
                    }
                }
                return standardCurrencyFilter(amount, currencySymbol, fractionSize);
            };

            sskCurrencyFilter.$stateful = true;

            return sskCurrencyFilter;
        }
    ]);

}(angular));
