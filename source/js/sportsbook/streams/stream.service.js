(function (angular) {
    "use strict";

    var streamService = function (streamClient) {
        /*jshint validthis: true */
        var self = this;

        self.client = streamClient;
    };

    streamService.prototype.getStreamData = function(context) {
        var self = this;
        return self.client.getStreamData(context)
            .then(function (response) {
                return response;
            });
    };

    /**
     * @ngdoc service
     * @name sportsbook.streams:streamService
     * @description Provides access to stream features.
     */
    angular.module("sportsbook.streams")
        .service("streamService", ["streamClient", streamService]);

})(angular);