(function (angular) {
    "use strict";

    var module = angular.module("demo.authentication");

    module.service("sportsbookUserDetails", ["lodash", "CacheFactory", function (_, persistence) {
        var self = this;

        var properties = ["firstName", "lastName", "fullName"];
        var storage = persistence.get("demo.cache.user-details");

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