(function (angular) {
    "use strict";

    var scoreBoardService = function (applicationState, scoreboardsResource) {

        this.applicationState = applicationState;
        this.scoreboardsResource = scoreboardsResource;
    };

    scoreBoardService.prototype.byEvent = function (options) {
        var self = this;

        return self.applicationState.culture().then(function (culture) {
            return self.scoreboardsResource.query({
                "eventids": options.eventIds.join(),
                "totalActions": (options.actions ? options.actions : 0)
            }, culture).then(function (data) {
                return data;
            });
        });
    };

    /**
     * @ngdoc service
     * @name sportsbook.markets:scoreboardsService
     * @description Loads scoreboard details independently of the event.
     */
    angular.module('sportsbook.markets')
        .service('scoreboardsService', ["applicationState", "scoreboardsResource", scoreBoardService]);
}(window.angular));
