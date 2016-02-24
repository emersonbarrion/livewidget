(function(angular) {
    "use strict";

    function streamVisual($http, $interpolate, streamApi) {
        /*jshint validthis: true */
        var self = this;

        self.$http = $http;
        self.$interpolate = $interpolate;
        self.streamApi = streamApi + "/{{segment}}/{{language}}/stream/{{streamType}}/{{provider}}/{{streamId}}";
    }

    streamVisual.prototype.getStreamData = function (context) {
        var self = this;
        var configuration = {
            "params": {
                "eventId": context.eventId,
                "sessionId": context.sessionId,
                "isMobile": context.isMobile
            }
        };

        var url = self.$interpolate(self.streamApi)(context);

        return self.$http
            .get(url, configuration)
            .then(function (response) {
                return response.data.lu;
            });
    };

    angular.module("sportsbook.streams")
        .service("streamVisual", ["$http", "$interpolate", "streamApi", streamVisual]);

})(angular);