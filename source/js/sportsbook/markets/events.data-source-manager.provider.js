(function (angular) {
    "use strict";
    
    angular.module("sportsbook.markets").provider("eventDataSourceManagerConfiguration", [function () {
        var self = this;

        self.configuration = {
            alreadyLoadingError: "Already loading",
            eventsAddedBroadcastName: "added",
            eventsUpdatedBroadcastName: "updated",
            eventsDeletedBroadcastName: "deleted",
            marketsEventPrefix: "markets",
            expirationTimeout: 5 * 60 * 1000 * 1000,
        };
        
        self.$get = [function () {
                return {
                    configuration: self.configuration,
                    getEventsDeletedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.eventsDeletedBroadcastName;
                    },
                    getEventsAddedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.eventsAddedBroadcastName;
                    },
                    getEventsUpdatedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.eventsUpdatedBroadcastName;
                    },
                    getMarketsDeletedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.marketsEventPrefix + "-" + self.configuration.eventsDeletedBroadcastName;
                    },
                    getMarketsAddedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.marketsEventPrefix + "-" + self.configuration.eventsAddedBroadcastName;
                    },
                    getMarketsUpdatedBroadcast: function (dataSourceName) {
                        return dataSourceName + "-" + self.configuration.marketsEventPrefix + "-" + self.configuration.eventsUpdatedBroadcastName;
                    }
                };
            }
        ];

    }]);

}(window.angular));