(function (angular) {
    "use strict";

    angular.module("sportsbook.markets").config(["eventsPollerProvider", function (eventsPollerProvider) {

        eventsPollerProvider.setDefaultInterval(60000);
        eventsPollerProvider.setTaskInterval("ssk.poller.reload.default", 1000 * 60 * 3);
        eventsPollerProvider.setTaskInterval("ssk.poller.reload.live", 5000);

    }]);

})(window.angular);
