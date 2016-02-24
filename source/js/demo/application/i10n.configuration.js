(function(angular) {
    "use strict";

    var bundles = [

        { Key: "betslip", Product: "SportsbookPrematch" },
        { Key: "betslip.system-combinations", Product: "SportsbookPrematch" },
        { Key: "betslip.system-total-multipliers", Product: "SportsbookPrematch" },
        { Key: "catalogue", Product: "SportsbookPrematch" },
        { Key: "event.widget.market", Product: "SportsbookPrematch" },
        { Key: "event.widget", Product: "SportsbookPrematch" },
        { Key: "open-bets", Product: "SportsbookPrematch" },
        { Key: "prematch", Product: "SportsbookPrematch" },
        { Key: "winner-market", Product: "SportsbookPrematch" },

        
        { Key: "account-area", Product: "CommonValkyrie" },
        { Key: "account-area.user-account", Product: "CommonValkyrie" },
        { Key: "account-area.user-balance", Product: "CommonValkyrie" },
        { Key: "account-area.oms", Product: "CommonValkyrie" },
        { Key: "account-area.mobile", Product: "CommonValkyrie" },
        { Key: "account-area.help", Product: "CommonValkyrie" },
        { Key: "forgot-password", Product: "CommonValkyrie" },
        { Key: "footer", Product: "CommonValkyrie" },
        { Key: "404", Product: "CommonValkyrie" }

    ];

    var fallbackLanguage = "en";    // Fall-back languages specifies the translation used when a key is not available in the selected language.

    // Initialize the application.
    angular.module("sportsbook-app").config(["$translateProvider", function ($translateProvider) {

        $translateProvider
            .useLoader('translate.rest.loader', { bundles: bundles })        
            .useLocalStorage()
            .fallbackLanguage(fallbackLanguage);
    }]);
})(angular);