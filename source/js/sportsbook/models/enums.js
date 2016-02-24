(function(angular) {
    var module = angular.module("sportsbook.models");

    module.constant("betStatus", {
        OPEN: 1,
        WON: 2,
        LOST: 3,
        VOID: 4,
        HALF_WON: 5,
        HALF_LOST: 6,
        MANUAL_REJECTED: 7,
        MANUAL_REVIEW: 8,
        MANUAL_GRANTED: 9
    });

    module.constant("betFilters", {
        ALL: 0,
        OPEN: 1000,
        WON: 2,
        LOST: 3,
        VOID: 4
    });

    module.constant("couponTypes", {
        "single": 0,
        "combi": 1,
        "system": 2
    });

    module.constant("eventPhases", {
        BOTH: 0,
        PREMATCH: 1,
        LIVE: 2
    });

    module.constant("eventSortFields", {
        POPULARITY: 1,
        DATE: 2
    });

})(angular);
