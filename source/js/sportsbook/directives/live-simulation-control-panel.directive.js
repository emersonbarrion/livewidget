(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.directives');

    module.directive("liveSimulationControlPanel", ['sportsbookConfiguration', 'liveSimulationLayer', function (sportsbookConfiguration, liveSimulationLayer) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: sportsbookConfiguration.templates.liveSimulationControlPanel,
            link: function (scope) {
                var text = {
                    on: ['All I want for Christmas is ... ', 'Show me the Christmas tree!', 'Dashing through the snow!'],
                    off: ['Turn off this bloody Christmas tree!', 'I am a Grinch!', 'I am getting coal this Christmas!']
                };                

                function getText() {
                    var list = text.on;

                    if (liveSimulationLayer.getIsActive()) {
                        list = text.off;
                    }

                    return list[Math.floor(Math.random() * list.length)];
                }

                scope.text = getText();

                scope.toggle = function () {
                    liveSimulationLayer.toggle();
                    scope.text = getText();
                };
            }
        };
    }]);
}(window.angular));
