(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.application");
    
    module.service("sportsbookUserSettings", ["lodash", "CacheFactory", function (_, persistence) {
        var self = this;

        var properties = ["coupon", "acceptOddsChanges"];
        var storage = persistence.get("ssk.cache.sb.user-settings");

        _.forEach(properties, function (property) {
            Object.defineProperty(self, property, {
                get: function () {
                    return storage.get(property);
                },
                set: function (data) {
                    storage.put(property, data);
                },
            });
        });
    }]);

}(window.angular));

