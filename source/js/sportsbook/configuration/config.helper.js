(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.configuration');

    module.service("_configHelper", [function () {

        this.getBetGroupsFromWinnerListConfig = function(winnerListConfig) {
            return _.chain(winnerListConfig.widgets).flatten().map("groups").flatten().map("betGroupId").value();
        };

    }]);

})(angular);
