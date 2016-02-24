(function (angular) {
    function TestAuthenticationHelper(applicationState) {
        this.applicationState = applicationState;
    }

    TestAuthenticationHelper.$inject = ["applicationState"];

    TestAuthenticationHelper.prototype.login = function () {
        this.applicationState.user({
            "isAuthenticated": true,
            "details": {
                "currencyCode": "GBP",
                "currencySymbol": "£",
                "currencySymbolUnicode": "00A3",
                "twoLetterIsoLanguageName": "en",
                "twoLetterIsoRegionName": "DE",
                "accountType": "Normal",
                "customerGuid": "3ae04cea-f296-11e1-8bf9-00505695002b",
                "birthDate": "1984-06-03T00:00:00",
                "gender": "Female",
                "firstName": "test",
                "lastName": "test",
                "name": "betssonqa04@gmail.com",
                "merchantId": 8,
                "balance": {
                    "totalFunds": {
                        "amount": 64.32,
                        "currency": "GBP",
                        "display": "£64.32"
                    },
                    "funds": {
                        "amount": 23.12,
                        "currency": "GBP",
                        "display": "£23.12"
                    },
                    "bonusMoney": {
                        "amount": 23.12,
                        "currency": "GBP",
                        "display": "£23.12"
                    },
                    "withdrawable": {
                        "amount": 0,
                        "currency": "GBP",
                        "display": "£0.00"
                    },
                    "lockedMoney": {
                        "amount": 0,
                        "currency": "GBP",
                        "display": "£0.00"
                    },
                    "currencyCode": "GBP",
                    "bonusAndLockedMoney": {
                        "amount": 23.12,
                        "currency": "GBP",
                        "display": "£23.12"
                    }
                }
            }
        });
    };

    TestAuthenticationHelper.prototype.logout = function () {
        this.applicationState.user({
            "isAuthenticated": false
        });
    };
    angular.module("sportsbook.tests").service("testAuthenticationHelper", TestAuthenticationHelper);
})(window.angular);