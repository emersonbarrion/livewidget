(function(angular) {
    "use strict";

    function streamVideo($http, $interpolate, streamApi) {
        /*jshint validthis: true */
        var self = this;

        self.$http = $http;
        self.$interpolate = $interpolate;
        self.streamApi = streamApi + "/{{segment}}/{{language}}/stream/{{streamType}}/{{provider}}/{{streamId}}";

        /*self.getProviderUrl = function(streamData, context){
            var url = "";

            if(isValidRequest(streamData,context)){
                switch (context.provider){
                    case 1: // Perform
                        url = streamData.lu + "?eventId=" + context.eventId + "&key=" + streamData.k + "&userId=" + context.sessionId + "&partnerId=" + streamData.ptid;
                        break;
                    case 2: // Sportsman
                        url = streamData.lu;
                        break;
                }
            }

            return url;
        };*/

        function isValidRequest(streamData, context){
            if(streamData.lu && context.eventId && streamData.k && context.sessionId && streamData.ptid){
                return true;
            } else {
                return false;
            }
        }
    }

    streamVideo.prototype.getStreamData = function (context) {
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
                return response.data;
            });
    };

    angular.module("sportsbook.streams")
        .service("streamVideo", ["$http", "$interpolate", "streamApi", streamVideo]);

})(angular);