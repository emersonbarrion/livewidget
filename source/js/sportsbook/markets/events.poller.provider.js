(function (angular) {
    "use strict";

    angular
    .module("sportsbook.markets")
    .provider("eventsPoller", [function () {

        var configuration = {

            defaultIntervalMillis: 60000,

            taskIntervalMillis: {
                "ssk.poller.reload.default": 10000,
                "ssk.poller.reload.live": 2000
            }

        };

        return {

            setDefaultInterval: function (defaultIntervalMillis) {
                configuration.defaultIntervalMillis = defaultIntervalMillis;
            },

            setTaskInterval: function (taskKey, taskIntervalMillis) {
                configuration.taskIntervalMillis[taskKey] = taskIntervalMillis;
            },

            $get: ["eventsPollerService", function (eventsPollerService) {
                eventsPollerService.init();
                eventsPollerService.setDefaultInterval(configuration.defaultIntervalMillis);
                eventsPollerService.setTaskInterval("ssk.poller.reload.default", configuration.taskIntervalMillis["ssk.poller.reload.default"]);
                eventsPollerService.setTaskInterval("ssk.poller.reload.live", configuration.taskIntervalMillis["ssk.poller.reload.live"]);
                return eventsPollerService;
            }]

        };

    }]);

})(window.angular);
