(function (angular) {
    "use strict";

    angular
        .module("sportsbook.markets")
        .service("eventsPollerService", ["pollerFactory", "eventDataSourceManager", "liveCatalogueService", "$rootScope", function (Poller, eventDataSourceManager, liveCatalogueService, $rootScope) {

            var self = this;
            var initialised = false;

            // TODO: Investigate this as it seems to be causing performance issues due to extra $digest cycles.
            var onReloadComplete = function (hasChanges) {
                if (hasChanges) {
                    // Wait until all the current call stack has been cleared and trigger a $digest cycle
                    _.defer(function () {
                        $rootScope.$apply();
                    });
                }
            };

            self.init = function () {
                if (initialised) {
                    return;
                }
                self._poller = new Poller();

                self._poller.addPollingTask("ssk.poller.reload.default", function () {
                    eventDataSourceManager.reload("default"); //.then(onReloadComplete);
                });

                self._poller.addPollingTask("ssk.poller.reload.live", function () {
                    eventDataSourceManager.reload("live"); //.then(onReloadComplete);
                });

                return initialised = true;
            };

            self.start = function () {
                return self._poller.start();
            };

            self.stop = function () {
                return self._poller.stop();
            };

            self.setDefaultInterval = function (defaultIntervalMillis) {
                self._poller.setDefaultInterval(defaultIntervalMillis);
            };

            self.setTaskInterval = function (taskKey, intervalMillis) {
                self._poller.setTaskInterval(taskKey, intervalMillis);
            };

        }]);

})(window.angular);