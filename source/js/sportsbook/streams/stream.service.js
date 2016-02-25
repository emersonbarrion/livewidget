(function (angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name sportsbook.streams:streamService
     * @description Provides access to stream features.
     */
    angular
        .module("sportsbook.streams")
        .service("streamService", streamService)
        .config(["$provide", streamConfiguration]);

    streamService.$inject = ['$http','$interpolate', 'streamApi'];

    function streamService($http, $interpolate, streamApi) {
        /*jshint validthis: true */
        var self = this;

        /*
        Request interface
         "segment"
         "language"
         "streamType"
         "provider"
         "streamId"
         "eventId"
         "isMobile"
         "sessionId"
         "streamWidth"
         "streamOnly"
         */


        function getstream(params){
            var streamUrl = streamApi + "/{{segment}}/{{language}}/stream/{{streamType}}/{{provider}}/{{streamId}}";

            var url = $interpolate(streamUrl)(params);
            var configuration = {
                "params": {
                    "eventId": params.eventId,
                    "sessionId": params.sessionId,
                    "isMobile": params.isMobile
                }
            };

            return $http.get(url, configuration).then(function(response){
                return self.getStreamResponse(response, params);
            });
        }

        function getStreamResponse(response, params){
            // Standard response
            var stream = {
                url: response.data.lu,
                params: {},
                providerId: params.provider,
                streamType: params.streamType,
                errorMessage: ""
            };

            // Adding error response
            if(response.data.Errors){
                stream.errorMessage = response.data.Errors[0].Message;
            }

            // Perform Video stream required parameter
            if(params.provider === 1 && params.streamType === 1){
                stream.params = {
                    eventId: params.eventId,
                    key: response.data.k,
                    userId: params.sessionId,
                    partnerId: response.data.ptid
                };
            }

            // Perform Data Visualization required parameter
            if(params.provider === 1 && params.streamType === 2){
                stream.url = stream.url + "?width=" + params.streamWidth + "&token=" + response.data.k + "&ismobile=" + params.isMobile + "&lang=" + params.language + "&streamonly=" + params.streamOnly;
                stream.params = {
                    width: params.streamWidth,
                    token: response.data.k,
                    isMobile: params.isMobile,
                    lang: params.language,
                    streamOnly: params.streamOnly
                };
            }

            return stream;
        }

        var service = {
            getstream: self.getstream
        };

    }

    function streamConfiguration($provide) {
        $provide.constant("streamApi", "https://sbsitefacade.bpsgameserver.com/isa/v2");
        $provide.constant("streamDirectiveTemplate", "/templates/sportsbook/streams/stream.html");
    }

})(angular);