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

    function streamService($http, $interpolate, streamApi, $sce) {
        /*jshint validthis: true */
        var self = this;

        /*
        Request Interface
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

        // Response Interface
        self.stream = {
            url: "",
            params: {
                eventId: "",
                key: "",
                userId: "",
                partnerId: ""
            },
            providerId: "",
            streamType: "",
            errorMessage: ""
        };


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

            return $http.get(url, configuration)
                .then(function(response){
                    return self.getStreamResponse(response, params);
                })
                .catch(function(reason){
                    return self.stream.errorMessage = reason.data.Errors[0].Message;
                });
        }

        function getStreamResponse(response, params){
            self.stream.url = $sce.trustAsResourceUrl(response.data.lu);
            self.stream.providerId = params.provider;
            self.stream.streamType = params.streamType;

            // Adding error response
            if(response.data.Errors){
                self.stream.errorMessage = response.data.Errors[0].Message;
            }

            // Perform Video stream required parameter
            if(params.provider === 1 && params.streamType === 1){
                self.stream.params = {
                    eventId: params.eventId,
                    key: response.data.k,
                    userId: params.sessionId,
                    partnerId: response.data.ptid
                };
            }

            // Perform Data Visualization required parameter
            if(params.provider === 1 && params.streamType === 2){
                self.stream.url = $sce.trustAsResourceUrl(self.stream.url + "?width=" + params.streamWidth + "&token=" + response.data.k + "&ismobile=" + params.isMobile + "&lang=" + params.language + "&streamonly=" + params.streamOnly);
                self.stream.params = {
                    width: params.streamWidth,
                    token: response.data.k,
                    isMobile: params.isMobile,
                    lang: params.language,
                    streamOnly: params.streamOnly
                };
            }

            return self.stream;
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