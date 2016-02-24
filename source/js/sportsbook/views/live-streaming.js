(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.views");

    module.directive("liveStream", ["sportsbookConfiguration", function (sportsbookConfiguration) {
        return {
            restrict: "A",
            replace: false,
            scope: {
                "sources": "=liveStream"
            },
            templateUrl: sportsbookConfiguration.templates.liveStream,
            controller: "liveStreamController"
        };
    }]);

    module.controller("liveStreamController", [
        "$scope", "applicationState", "prematchSession",
        function ($scope, applicationState, prematchSession) {

            $scope.switchTo = function (stream) {
                $scope.currentStream = stream;
            };

            var setupStream = function (user) {

                var sources = $scope.sources;

                prematchSession.getSessionInfo().then(function (session) {
                    $scope.sessionId = session.token;
                });

                // Determine if we have any visual streams.
                $scope.videoStream = _.find(sources, { "type": 1 });
                $scope.visualizationStream = _.find(sources, { "type": 2 });

                $scope.hasVideoStream = !_.isUndefined($scope.videoStream);
                $scope.canShowVideoStream = $scope.hasVideoStream && ((!$scope.videoStream.requireAuthentication) || ($scope.videoStream.requireAuthentication && user.isAuthenticated));
                $scope.hasVisualizationStream = !_.isUndefined($scope.visualizationStream);
                $scope.hasAvailableStream = $scope.canShowVideoStream || $scope.hasVisualizationStream;

                // We have no visualizations, only stat streams.
                if (!$scope.canShowVideoStream && !$scope.hasVisualizationStream) {
                    $scope.currentStream = null;
                }

                // We have a visualization, but not a video stream (or we cannot show that because the user is not logged in).
                if (!$scope.canShowVideoStream && $scope.hasVisualizationStream) {
                    $scope.currentStream = $scope.visualizationStream;
                }

                if ($scope.canShowVideoStream) {
                    $scope.currentStream = $scope.videoStream;
                }
            };

            applicationState.user.subscribe(function (user) {
                setupStream(user);
            }, true);
        }
    ]);

    module.filter("url", [
        '$sce',
        function ($sce) {
            return function (val) {
                return $sce.trustAsResourceUrl(val);
            };
        }
    ]);

})(window.angular);
