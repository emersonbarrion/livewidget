(function(angular) {
    "use strict";

    function streamClient($http, $interpolate, streamApi) {
        /*jshint validthis: true */
        var self = this;

        self.$http = $http;
        self.$interpolate = $interpolate;
        self.streamApi = streamApi + "/{{segment}}/{{language}}/stream/{{streamType}}/{{provider}}/{{streamId}}";
    }

    streamClient.prototype.getStreamData = function (context) {
        var self = this;
        var configuration = {
            "params": {
                "eventId": context.eventId,
                "sessionId": context.sessionId,
                "isMobile": context.isMobile
            }
        };

        var url = self.$interpolate(self.streamApi)(context);

        function getStreamResponse(response){
            // Standard response
            var stream = {
                url: response.data.lu,
                params: {},
                providerId: context.provider,
                streamType: context.streamType,
                errorMessage: ""
            };

            // Adding error response
            if(response.data.Errors){
                stream.errorMessage = response.data.Errors[0].Message;
            }

            // Perform Video stream required parameter
            if(context.provider === 1 && context.streamType === 1){
                stream.params = {
                    eventId: context.eventId,
                    key: response.data.k,
                    userId: context.sessionId,
                    partnerId: response.data.ptid
                };
            }

            // Perform Data Visualization required parameter
            if(context.provider === 1 && context.streamType === 2){
                stream.url = stream.url + "?width=" + context.streamWidth + "&token=" + response.data.k + "&ismobile=" + context.isMobile + "&lang=" + context.language + "&streamonly=" + context.streamOnly;
                stream.params = {
                    width: context.streamWidth,
                    token: response.data.k,
                    isMobile: context.isMobile,
                    lang: context.language,
                    streamOnly: context.streamOnly
                };
            }

            return stream;
        }

        return self.$http
            .get(url, configuration)
            .then(function (response) {
                return getStreamResponse(response);
            });
    };

    angular.module("sportsbook.streams")
        .service("streamClient", ["$http", "$interpolate", "streamApi", streamClient]);

})(angular);