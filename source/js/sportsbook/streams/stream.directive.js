(function(angular) {
    "use strict";

    function streamDirective(streamDirectiveTemplate) {
        return {
            scope: {
                "segment": "=",
                "language": "=",
                "stream": "=",
                "sessionId": "=",
                "isMobile": "=?",
                "streamWidth": "=",
                "streamOnly": "="
            },
            replace: true,
            controller: "streamCtrl",
            controllerAs: "stream",
            restrict: "E",
            templateUrl: streamDirectiveTemplate
        };
    }

    function streamConfiguration($provide) {
        $provide.constant("streamApi", "https://sbsitefacade.bpsgameserver.com/isa/v2");
        $provide.constant("streamDirectiveTemplate", "/templates/sportsbook/streams/stream.html");
    }

    streamDirective.$inject = ["streamDirectiveTemplate"];

    angular.module("sportsbook.streams")
        .directive("stream", streamDirective)
        .config(["$provide", streamConfiguration]);
})(angular);