(function (angular) {
    "use strict";

    angular.module("sportsbook.markets").factory("mockDataSourceFactory", ["baseEventDataSourceFactory", "$q", function (baseEventDataSourceFactory, $q) {

        function MockDataSource(dataSourceName, dataSourceManager, mockEventSourceFunction) {
            baseEventDataSourceFactory.call(this, dataSourceName);

            this._dataSourceManager = dataSourceManager;
            this._mockEventSourceFunction = mockEventSourceFunction;
        }

        MockDataSource.prototype = Object.create(baseEventDataSourceFactory.prototype);
        
        MockDataSource.prototype.initialiseEvents = function (events) {
            this.content = events;
        };

        MockDataSource.prototype.processUpdatedEvents = function () { };

        MockDataSource.prototype.processNewEvents = function () { };

        MockDataSource.prototype.processDeletedEvents = function () { };

        MockDataSource.prototype.initialiseMarkets = function () { };

        MockDataSource.prototype.processUpdatedMarkets = function () { };

        MockDataSource.prototype.processNewMarkets = function () { };

        MockDataSource.prototype.processDeletedMarkets = function () { };

        MockDataSource.prototype.eventsSource = function () {
            return $q.when(this._mockEventSourceFunction());
        };

        return MockDataSource;
    }]);

}(window.angular));